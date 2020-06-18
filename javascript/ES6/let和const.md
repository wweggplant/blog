# let和const！

## 块级作用域
其实javascript一直有块级作用域的。只不过想要实现块级作用域，需要一点技巧。常用的手段是使用函数作用域来代替块级作用域，还有就是使用`try/catch`中catch的代码块。不能像其他语言那样直接使用类似`{ var x = 1 }`的代码实现。这也成为了javascript被人鄙视了很长时间的的一个槽点。

来看一个经典的例子

```javascript
for(var i=0;i<=5;i++){
    console.log("hello");
}
console.log(i); //5
```

在其他编程语言，像上面的for循环语句中声明的变量的作用域应该只在`{}`内起作用，但是javascript中是没有块作用域的，导致后面的语句也能访问到前面语句声明的变量。

但是再ES6中，我们有了`let/cont`后就不一样了，还是上面的例子，我们把`var`改成`let`，再来执行发现，执行结果报错。

```javascript
for(let i=0;i<=5;i++){
    console.log("hello");
}
console.log(i); // Uncaught ReferenceError: i is not defined
```

这样javascript就能使用期待已久的块级作用域。ES6规定的块级作用域存在于：

- 函数内部
- 块中(字符 { 和 } 之间的区域)


## let、const

### 临时死区(TDZ)

临时死区是ES6为了解决块作用域和变量初始化相关的问题的。下面会降到的3个特点中，就和临时死区关键很大。

回顾ES3中, 变量初始化

在ES6中块级作用域有以下几个特点

1. 不会被提升

在ES3中，我们都知道的引擎对变量会有提升，就像把声明语句放在开头位置。

```javascript
console.log(bar) // undefined
var bar = 1;
```

但是使用`let`的话，结果报错

```javascript
console.log(bar) // ReferenceError: bar is not defined
let bar = 1;
```

2. 重复声明报错

在之前的文章里有提到过引擎在扫描代码阶段，遇到同名的变量声明，会选择跳过，也就是说可以重复声明变量。

```javascript
var a = 1;
var a = 2;
```

在ES6中，这样是不可以的，结果会提示变量已声明

```javascript
var a = 1;
let a = 2 // Identifier 'a' has already been declared

```

3. 不绑定全局作用域

在全局上下文中，使用`var`声明变量的话，默认是绑定到全局变量中

```javascript
var a = 1
console.log(window.a) // 1
```

使用`let`的话，是不会绑定到全局对象中去的

```javascript
let a = 1
console.log(window.a) // undefined
```



# 参考


(理解ES6中的暂时死区(TDZ))[https://segmentfault.com/a/1190000008213835]