diff算法是比较两个节点，这里我们先设老节点1和新节点2分别为n1和n2

## 基本流程
1. 首先会判断n1是否存在，n1和n2是否为相同类型的节点。如果类型不相同的话，先把老节点卸载掉
```javascript
if (n1 && !isSameVNodeType(n1, n2)) {
  anchor = getNextHostNode(n1)
  unmount(n1, parentComponent, parentSuspense, true)
  n1 = null
}

```

类型是否相同是按照下面的代码判断的，如果两个vnode的节点`type`和`key`相同，则类型相同

```javascript
return n1.type === n2.type && n1.key === n2.key
```


2. 根据n2的`type`属性，进行后续的判断

```javascript
switch (type) {
  case Text:
    文本
  case Comment:
    注释类型
  case Static:
    静态节点
  case Fragment:
    Fragment类型，vue3新增类型
  default:
    if (shapeFlag & ShapeFlags.ELEMENT) {
      element节点
    } else if (shapeFlag & ShapeFlags.COMPONENT) {
      处理组件
    } else if (shapeFlag & ShapeFlags.TELEPORT) {
      处理TELEPORT节点，类似react的portal
    } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
      处理SUSPENSE的节点
    }
}
```

基本的流程如上，下面我们就各个类型进行具体分析。在__test__文件夹里面找到测试代码

## element类型

情况1, 新的根节点, 测试代码如下

```javascript
const root = nodeOps.createElement('div')

render(h('div'), root)
expect(inner(root)).toBe('<div></div>')
```

直接进入到`processElement`函数内部看一下，这个时候n1为null

1. 首先设置是否是SVG节点，由于n1是null，进入`mountElement`方法，把n2作为新的节点挂载

```javascript
isSVG = isSVG || (n2.type as string) === 'svg'
if (n1 == null) {
    mountElement(n2, ...)
} 
```

2. 判断vnode.el是否为空，非空说明是这个静态节点正在被`reused`。只需要克隆这个el即可？

3. 在`mountElement`方法中，就把n2挂载到`container`节点下面

```javascript
hostInsert(el, container, anchor)
```

情况2, 两个节点类型不一样, 测试代码如下:

```javascript
it('should update an element tag which is already mounted', () => {
  render(h('div', ['foo']), root)
  expect(inner(root)).toBe('<div>foo</div>')

  render(h('span', ['foo']), root)
  expect(inner(root)).toBe('<span>foo</span>')
})
```

根据上面的分析,n1和n2的节点类型是不一样的.这个时候会吧老节点n1卸载掉,然后把新节点n2挂载.下面会说一下卸载节点的方法

```javascript
const unmount: UnmountFn = (
  vnode,
  parentComponent,
  parentSuspense,
  doRemove = false
) => {
  const {
    type,
    props,
    ref,
    children,
    dynamicChildren,
    shapeFlag,
    patchFlag,
    dirs
  } = vnode
  // ref属性置null

  if (shapeFlag & ShapeFlags.COMPONENT) {
    // 卸载组件
  } else {
    if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
      // 卸载SUSPENSE
      return
    }

    if (shouldInvokeDirs) {
      // 调用指令的beforeUnmount的钩子
      invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount')
    }

    if (
      dynamicChildren &&
      (type !== Fragment ||
        (patchFlag > 0 && patchFlag & PatchFlags.STABLE_FRAGMENT))
    ) {
      // 卸载Fragment组件
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 卸载子组件
    }

    // an unmounted teleport should always remove its children
    if (shapeFlag & ShapeFlags.TELEPORT) {
      // 删除TP组件
    }

    if (doRemove) {
      // 删除节点
      remove(vnode)
    }

  if ((vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
    // 有挂载onVnodeUnmounted的话执行该事件
  }
}

```
