
1. [探索Vue高阶组件 | HcySunYang](https://segmentfault.com/p/1210000012743259/read)
2. [Vue 进阶必学之高阶组件 HOC（保姆式教学，冲击20k必备）](https://juejin.im/post/5e8b5fa6f265da47ff7cc139)


# 注意的点

1. 高阶组件关注的点:`props`, `events`和 `slots`
2. `template`只有在完成vue中可以使用, 运行时没有提供
    需要使用渲染函数(`render`)替代模板(`template`)

```javascript
export default function WithConsole (WrappedComponent) {
  return {
    mounted () {
      console.log('I have already mounted')
    },
    props: WrappedComponent.props, // 高阶组件的 props 设置与被包装组件的 props 相同
    render (h) {
        // 将 this.$slots 格式化为数组，因为 h 函数第三个参数是子节点，是一个数组
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
      return h(WrappedComponent, {
        on: this.$listeners,
        attrs: this.$attrs,
        props: this.$props // attrs 指的是那些没有被声明为 props 的属性，所以在渲染函数中还需要添加 props 参数
      }, slots)
    }
  }
}
```

3.  `slots`最后显示的内容顺序不对

这是由于console.log(this.$vnode.context === this.$vnode.componentOptions.children[0].context) // true, 但是中间插入了高阶组件,导致这个表达式false

```javascript
const slots = Object.keys(this.$slots)
.reduce((arr, key) => arr.concat(this.$slots[key]), [])
// 手动更正 context
.map(vnode => {
    vnode.context = this._self
    return vnode
})
```


4. 封装一个从 this 上整合需要透传属性的函数

```javascript
function normalizeProps(vm) {
  return {
    on: vm.$listeners,
    attr: vm.$attrs,
    // 传递 $scopedSlots
    scopedSlots: vm.$scopedSlots,
  }
}
```

5. 函数式 compose

```javascript
function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
// ===>
function compose(...args) {
  return function(arg) {
    let i = args.length - 1
    let res = arg
    while(i >= 0) {
     let func = args[i]
     res = func(res)
     i--
    }
    return res
  }
}
```