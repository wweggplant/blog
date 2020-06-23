# let和const

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


## 临时死区(TDZ)

临时死区是ES6为了解决块作用域和变量初始化相关的问题的。下面会讲到的3个特点中，就和临时死区关键很大。

回顾ES3中, 函数作用域初始化过程中，会发生变量提升（`var`）。

```javascript
console.log(x) // undefined 发生提升
var x = '123'
```

但是按照`let`的写法改一下的话

```javascript
console.log(x) // ReferenceError: x is not defined
let x = '123'
```

这样更加接近块级作用域，但是背后的原理是引擎扫描到当前作用域有`let/const`声明的变量时，和`var`一样会把这个变量初始化，不同的是这些变量被『保护』起来，不可被访问。直到变量被赋值后，这种『保护』才结束，变量可以被访问到。有人可能要问了，如果变量没有赋值呢？如果是这种情况，会自动赋值`undefined`，然后继续后面的步骤。

### 不仅仅是`let/const`

临时死区在ES6中的函数预设值中也产生了影响。


```javascript
function foo(x = y, y = 1) {
    console.log(y)
}
foo() // Cannot access 'y' before initialization
fon(1) // 正常运行
foo(undefined, 1)
```

运行上面的代码，会提示`y`在初始化之前不可访问。

从上面可以总结在ES6中块级作用域有以下几个特点

1. 重复声明报错

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

2. 不绑定全局作用域

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

3. 是否有提升？

可以参考这里(我用了两个月的时间才理解 let)[https://segmentfault.com/a/1190000008213835]，作者的探索的精神值得大家学习。文章本身比结论更重要。

## 循环体中的`let`

很多说明let作用域的都会出现类似下面的代码，可是如果按照之前作用域的知识，其实`var`写法的版本才是正确的！！！这一点上一篇文章里的作者也有相同的疑问。

```javascript
// var 版本,只会输出5
var list = document.querySelectorALl('li')
for(let i = 0;i < 5;i++) {
    list.onclick = function() {
        console.log(i)
    }
}
// let 版本,会分别输出1到5
let list = document.querySelectorALl('li')
for(let i = 0;i < 5;i++) {
    list.onclick = function() {
        console.log(i)
    }
}
```

参考上一篇文章，我们知道了在循环体中，let会创建一个语法糖，上面的`let`版本会近似下面的代码

```javascript
let list = document.querySelectorALl('li')
for(let i = 0;i < 5;i++) {
    let j = i; // 重点,相当于在这里添加了这一句,把当前的i变量锁住了
    list.onclick = function() {
        console.log(i)
    }
}
```


# 参考


(理解ES6中的暂时死区(TDZ))[https://segmentfault.com/a/1190000008213835]