1. [剖析 Vue.js 内部运行机制](https://juejin.im/book/5a36661851882538e2259c0f)
2. [Vue 逐行级别的源码分析](https://github.com/HcySunYang/vue-design)


# 选项处理小结

现在我们了解了 Vue 中是如何合并处理选项的，接下来我们稍微做一个总结：

 - 对于 el、propsData 选项使用默认的合并策略 defaultStrat。
 - 对于 data 选项，使用 mergeDataOrFn 函数进行处理，最终结果是 data 选项将变成一个函数，且该函数的执行结果为真正的数据对象。
 - 对于 生命周期钩子 选项，将合并成数组，使得父子选项中的钩子函数都能够被执行
 - 对于 directives、filters 以及 components 等资源选项，父子选项将以原型链的形式被处理，正是因为这样我们才能够在任何地方都使用内置组件、指令等。
 - 对于 watch 选项的合并处理，类似于生命周期钩子，如果父子选项都有相同的观测字段，将被合并为数组，这样观察者都将被执行。
 - 对于 props、methods、inject、computed 选项，父选项始终可用，但是子选项会覆盖同名的父选项字段。
 - 对于 provide 选项，其合并策略使用与 data 选项相同的 mergeDataOrFn 函数。


 最后，以上没有提及到的选项都将使默认选项 defaultStrat。
 最最后，默认合并策略函数 defaultStrat 的策略是：只要子选项不是 undefined 就使用子选项，否则使用父选项。


# 渲染函数中的观察者和数据响应系统

## 响应式数据系统简述

```javascript
// 入口
initState(vm)

export function initState (vm: Component) {
  ... 进入到下面的方法中
  observe(vm._data)
  ...
}

export function observe (value: any, asRootData: ?boolean): Observer | void {
  return ob = new Observer(value)
}
```

```javascript
class Observer {
  dep: Dep;
  constructor (value: any) {
    // 创建依赖栈
    this.dep = new Dep()
    // 添加标识
    def(value, '__ob__', this)
    /*
      ...
      为数组的一些方法赋予响应能力, 并且已经为数组的变异方法(push、pop、shift等等)添加了拦截功能,具有响应能力
    */
    // 深度遍历属性, 为后续的属性赋予响应能力
    this.walk(value)
    ....
  }
  // 这里是浅层的遍历属性,调用defineReactive
  walk (obj: Object) {
    defineReactive(obj, (in..for)obj)
  }
}
```

```javascript
function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep() // 属性的依赖
  /*
    1. 进行一些判断,保证obj.key 是一个obj的可配置的属性(Object.getOwnPropertyDescriptor(obj, key).configurable === true)
    2. 缓存已有的set/get方法, 对于仅仅有get方法的对象属性, 新的get方法不会覆盖老的get方法, 并且保证响应代码只添加一次
  */
  /*
   childOb 只有在val是对象或者数组情况下才有值
   */
  let childOb = !shallow && observe(val)
  /*
    对obj.key属性赋予响应式能力
   */
  Object.defineProperty(obj, key, {
    ...
    /* 
    1. get方法主要是收集属性的依赖
    2. set方法通知进行变更操作
     */
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend() // 收集当前属性(obj.key)的依赖
        // 如果childOb是ob对象实例的话,进行后续的依赖收集,这样就保证了递归收集所有的依赖
        if (childOb) {
          childOb.dep.depend()
          //... 处理数组的依赖收集
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      ....
      // 通知依赖进行变更操作
      dep.notify()
    }
  })
}
```

```javascript
class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    vm._watchers.push(this)
    /* 
     初始化操作
    
     */
  }
  /**
   * Evaluate the getter, and re-collect dependencies.
   * 依赖收集的过程
   */
  get () {
    pushTarget(this) // 设置Dep.target当前watcher实例为全局唯一正在求值的watcher
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      popTarget() // 重置Dep.target为null
      this.cleanupDeps()
    }
    return value
  }
  addDep (dep: Dep) // 向依赖表中添加当前watcher实例

  cleanupDeps () // 清空依赖表

  update () {
    if (this.sync) {
      // 同步
      this.run()
    } else {
      // 异步, 渲染观察者, 进行dom操作中使用
      queueWatcher(this)
    }
  }
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
  evaluate () // 求当前watcher的值

  depend () // 把当前的watcher实例和依赖表关联起来

  teardown () // 从依赖中删除当前watcher实例
}
```

```javascript
/* @flow */
let uid = 0

class Dep {
  static target: ?Watcher; // 全局唯一的正在被evaluated的watcher
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }
  addSub (sub: Watcher) // 在依赖列表里添加watcher
  removeSub (sub: Watcher) // 移除watcher
  depend () // 把当前的Dep实例添加到Dep.target(当前的watcher)里去
  notify () // 通知依赖队列进行update操作
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

```



## 依赖的收集过程

要面对的问题:

1. 如果避免依赖手机重复

答: 以id为标识, 使用`newDepIds`数组过滤收集过的依赖


```javascript
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

```

## 依赖触发过程

```javascript
  run () {
    if (this.active) {
     /*
        重新赋值,会条用get方式,
        在之前的生命周期里有 new Watcher(vm, updateComponent...)样的代码,这里updateComponent就是渲染Watcher传入的getter函数
      */
      const value = this.get()
      if (
        value !== this.value ||
        isObject(value) ||
        this.deep
      ) {
        // set new value 这里的代码是为非渲染函数准备的
        const oldValue = this.value
        this.value = value
        if (this.user) {
          // 开发者通过$watch和.watch传入的方法可能是错误的, 所以用try/catch包起来
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
```


##  异步更新队列

如果采用同步方式, 多次给name赋值,会多次出发渲染动作,会严重影响性能, 所以vue使用异步方式来触发渲染动作

```vue
<template>
  <div id="app">
    <p>{{name}}</p>
  </div>
</template>
<script>
  new Vue({
    el: '#app',
    data: {
      name: ''
    },
    mounted () {
      this.name = 'hcy'
    }
  })
</script>
```
异步和同步的if判断

```javascript
  update () {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      // 执行同步代码
      this.run()
    } else {
      // 异步, 渲染观察者, 统一更新
      queueWatcher(this)
    }
  }
```


```javascript
function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      /* 
      在队列中插入watcher, 并保证插入时queue里watcher的顺序(按照id从小到大)
       */
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}

```

`has`是一个map, 存放watcher的唯一id. 避免相同的watcher添加到队列

```javascript
let has: { [key: number]: ?true } = {}
```

`flushing`是一个执行更新的标志位, `false`的情况下把watcher放入队列中, `true`的情况下表示正在执行更新.
`waiting`是一个控制`flushSchedulerQueue`只执行一次
