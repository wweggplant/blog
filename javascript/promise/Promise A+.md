# Promise


## 标准

通过阅读[Promises/A+](https://promisesaplus.com/#point-46)规范发现,该规范明确强调了不会说明`Promise`是如何`create`、`fulfill`和`reject`的, 仅仅是提供`then`方法的操作. 其中的内容大部分围绕`then`方法,甚至也可以说`Promises/A+`规范就是关于`then`的操作手册.也就是说, 标准并没有规定我们常用的`catch`、`all`等方法.

## 三种状态

1. 初始状态为`pending`, 该状态可以转变成其他两种状态
2. `fulfilled`状态下有一个不可变更的值
3. `rejected`状态下有一个不可变更的原因

ps.不可变更的意思是`===`


## `then`方法

`promise`提供的`then`方法, 在这个方法中有两个参数`onFulfilled、onRejected`,这两个参数是非必填的.

```javaScript
    promise.then(onFulfilled, onRejected)
```

onFulfilled, onRejected的判断过程

1. `onFulfilled`和`onRejected`是`optional`参数,如果是非函数的,则会忽略掉.
2. `onFulfilled`函数:
   1. 必须在`promise`处于fulfilled状态后才可以调用










