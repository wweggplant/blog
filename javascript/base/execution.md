
# javascript执行相关知识整合

这篇文章主要想讲一下关于javascript执行与解析的几个概念。其中有作用域、执行上下文（栈）、激活对象（VO和AO）等等。放在一起说是因为我觉得这几个概念其实是相互之间有很大关系的。在这个过程中参考了很多大神的文章。

# 目录

1. 作用域
2. 执行上下文（栈）、变量对象和提升
3. 作用域链
4. this

# 作用域

关于作用域的理解，可以参考《你不知道的javascript（上）》里的第一张内容，这本书里有对作用域有比较清晰的讲解。我认为比较重要的是里面对于作用域嵌套的描述。在词法作用域、函数作用域和块级作用域中，都和作用域嵌套有关。

## 作用域嵌套
当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。因此，在当前作用 域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量， 或抵达最外层的作用域(也就是全局作用域)为止。

看起来是不是觉得这不就是闭包么？关于闭包其实有各种说法，而且这些说法的意思都大同小异，其中基本的原理就是作用域的嵌套。闭包更偏向运行时的作用域嵌套的实际例子。
![作用域当成一栋楼房](http://oss.ipanda.site/markdown/20200615113853.png)

## 词法作用域与函数作用域（理念与实现）

### 词法作用域

正常的作用域分两类：一种是被大多数语言使用的词法作用域；另一种是动态作用域，bash等语言就是使用的动态作用域。引用《你不知道的javascript》，简单地说，词法作用域是由你在写代码时将**变量**和**块作用域**写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变(大部分情况下是这样的)。

```javascript
function foo(a) {
   var b = a * 2;
   function bar(c) {
      console.log( a, b, c );
   }
   bar( b * 3 )
}
foo( 2 );
```
以上代码的词法作用域如下：
![20200612160615](http://oss.ipanda.site/markdown/20200612160615.png)

> 欺骗词法是指的在运行时修改词法的作用域。有两种办法eval和with。但是这样的做法会导致性能下降。因为不管是eval还是with，引擎无法在编译时对作用域查找进行优化。

### 函数作用域
在javascript中，最常见的作用域是基于函数实现的，大部分情况下，函数声明在哪里，它的作用域就是哪里。在这个函数里的全部变量，都可以在整个函数范围内使用和复用。（嵌套也是可以的，这也是闭包的前提条件）看下面的例子：

```javascript
function foo(a) {
   var b = 2;
   function bar() {
      // ...
   }
   var c = 3;
}

```

在`foo`函数内部,可以访问`a`、`b`、`c`、`bar`这四个变量。`foo`不能访问`bar`函数内部定义的变量，但是`bar`内部可以访问它外部的变量。

常用的技巧：
1. 隐藏内部实现

```javascript
function doSomething(a) {
   b = a + doSomethingElse( a * 2 );
   console.log( b * 3 );
}
function doSomethingElse(a) {
   return a - 1;
}
var b;
doSomething( 2 ); // 15
```

在这个例子中，函数`doSomethingElse`和变量`b`被doSomething使用，但是这两个都是是暴露在外面的，也就是说其他代码是可以访问并修改doSomethingElse函数的！如果我们修改成下面的形式：

```javascript
function doSomething(a) {
   function doSomethingElse(a) {
      return a - 1;
   }
   var b;
   b = a + doSomethingElse( a * 2 );
   console.log( b * 3 );
}
doSomething( 2 ); // 15
```

现在`doSomethingElse`和`b`都无法从外部访问了

2. 规避冲突

```javascript
function foo() {
   function bar(a) {
      i = 3; //修改for循环所属作用域中的i
      console.log( a + i );
   }
   for (var i=0; i<10; i++) {
      bar( i * 2 ); // 糟糕，无限循环了!
   }
}
foo();
```

在上面这段代码中，调用`bar`函数修改了外部的`i`的值，使得`i`的值永远为3，形成死循环。要规避这种错误情况的发生，最好的办法是利用函数作用域把循环体隐藏起来，这就相当于很多编程语言的块级作用域。

> 这里引出的命名冲突的问题，又涉及到了模块的概念。在js里，为了解决没有模块系统和块级作用域的问题，分别使用了函数作用域和各种模块引入系统。

### *块级作用域*

除了函数作用域可以产生块级作用域的效果，还有其他方式也可以达到类似的效果。

1. with，在with创建的作用域仅在with声明中而非外部使用。
2. try/catch，catch部分的代码是属于块级作用域。

```javascript
try {
   undefined(); // 执行一个非法操作来强制制造一个异常
}
catch (err) {
   console.log( err ); // 能够正常执行!
}
console.log( err ); // ReferenceError: err not found
```

3. let/cont，ES6中新引入的关键字，为开发者带来的真正的块级作用域。


### 小结

从上面我们可以看到，有很多编程语言遵循词法作用域，词法作用域更加偏向一种理念。而对于javascript，函数作用域可以看做是对于词法作用域的一种体现。


# 执行上下文(栈)、变量对象和提升

   感觉执行上下文和执行上下文堆栈阅读起来多有不便，决定使用相应的英文简称替代。执行上下文：EC（Execution Context），执行上下文：ECS（Execution Context Stack）

## 执行上下文（EC）

EC是指的代码执行的环境，它的计算是按照下面的顺序进行的：
1. 全局作用域代码(Global code) - 你代码第一次被执行时的默认环境
2. 函数作用域代码(Function code) - 当执行到一个函数体内时
3. Eval作用域代码(Eval code) - 在eval函数内部执行中.

![20200616112324](http://oss.ipanda.site/markdown/20200616112324.png)

上图中，紫色的框是全局作用域`global context`，其他颜色的框是函数作用域`function context`。在应用中，只有一个全局作用域`global context`可以访问其他作用域。每当调用一个函数，就会创建一个新的函数作用域`function context`，这些`function context`会创建一篇私有的范围`scope`，在这个`scope`中声明（变量和函数）不能被外面的`scope`访问到，但是内部的`scope`可以访问外边的`scope`。


## 执行上下文堆栈（ECS）

   有没有想过引擎是如何实现以上所说的内容呢？接下来就涉及到ECS。在我看来，执行上下文偏向概念，定义了js执行环境的。而ECS则更加具体。

众所周知，浏览器是单线程的，也就是说在同一时间，只能做一件事，其他的事情（比如event loop）都以队列的形式放在了ECS中。

![20200616140631](http://oss.ipanda.site/markdown/20200616140631.png)

浏览器载入script脚本后，首先默认进入全局作用域中。如果在全局作用域中调用了函数，按照执行顺序进入被调用的函数中，在ECS中，压入一个新创建EC。如果你在当前调用的函数中，又调用了其他的函数，后续的过程与之类似。新创建的EC会被压入ECS顶部。引擎总是会执行ECS当前顶部的EC，一旦当前EC完毕，ECS就会把它从栈顶推出，之后ECS把当前栈顶的EC（也就是之前栈顶下面的EC）的控制权返回给引擎。具体可以参见下面的例子。

```javascript
(function foo(i) {
    if (i === 3) {
        return;
    }
    else {
        foo(++i);
    }
}(0));
```

![es1](http://oss.ipanda.site/markdown/es1.gif)

这里我参考其他文章，总结的执行上下文的5个关键点:

1. 单线程
2. 同步执行（这个同步的意思不太懂）
3. 一个全局上下文
4. 无限个函数上下文
5. 每次调用一个函数都会新建一个新的执行上下文, 哪怕是调用它自身


## 执行EC的细节

调用一个EC都会分为两个阶段.

1. 创建阶段.[当一个函数被调用,但是并未执行任何代码的时候]
   1. 创建一个作用域链(Scope chain)
   2. 创建变量,函数和函数的调用参数（arguments）.
   3. 确定this的值
2. 激活/代码执行阶段:
   1. 变量赋值, 确定函数引用以及解释/执行代码块.

代码化以上步骤最后的结果可以抽象成以下的这个对象，而这个结果就是我们接下来要讲的激活对象/变量对象了。

```javascript
executionContextObj = {
    'scopeChain': { /* 当前的执行环境variableObject,以及所有父级执行环境的variableObject的引用 */ },
    'variableObject': { /* 函数形参, 内部变量和函数声明*/ },
    'this': {}
}
```


## 激活对象和变量对象[AO/VO]

上文提到的`executionContextObj`的创建的时机是在函数被调用后，真正执行之前，也就是在`执行EC的细节`这节中提到的创建阶段。在这个阶段里，解释器会先扫描当前函数代码中的参数（形参和实参），声明的函数与变量，然后根据扫描的结果创建`executionContextObj`里的`variableObject`。

具体来说就是以下的伪过程：
1. 找到待执行函数的代码
2. 在执行函数之前, 创建执行上下文(execution context)
3. 进入创建阶段:
   1. 初始化作用域链(scope chain)
   2. 创建变量对象（VO）
      1. 创建实际参数对象，检查参数的上下文，初始化其名称和值并创建一个引用副本.
      2. 扫描上下文中所有的函数声明
         1. 每个函数被找到的时候, 在variable object中创建一个对应函数名称的属性, 其值是一内存中指向该函数的指针引用.
         2. 如果这个函数已经存在，该指针引用会被覆盖.
      3.  扫描上下文中所有对象的声明
          1. 当一个变量被找到的时候, 在variable object中创建其对应变量名的属性, 并将其值初始化为undefined
          2. 如果这个变量名的key已经存在于variable object中时, 跳过本次扫描.
   3. 确定this在上下文中的值
4. 激活/代码执行阶段
   1. 解释器逐行执行函数内的代码, 变量也在此时被赋值.

看一个具体的例子：

```javascript
function foo(i) {
    var a = 'hello';
    var b = function privateB() {

    };
    function c() {

    }
}
foo(22);
```

在执行到`foo(22)`的时候，创建阶段的结果如下：

```javascript
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: { // 实际参数
            0: 22,
            length: 1
        },
        i: 22,  // 形参,注意这里有赋值
        c: pointer to function c() // 函数声明，指向c函数的引用
        a: undefined,  // 声明变量初始化为undefined
        b: undefined
    },
    this: { ... }
}
```

可以看到，在创建阶段，只是把内部的声明与VO中的属性名对应起来，除了参数外，没有赋值操作。创建阶段完成后，接下来程序开始执行代码，进入执行阶段。在这里VO转变成了激活对象（AO）。在这个阶段安顺序执行代码，并进行赋值操作。

```javascript
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
    },
    this: { ... }
}
```

## 提升

通过前面的分析我们就明白了，为什么js会发生提升。原因就在与，在创建函数执行之前的创建阶段里，解释器会扫描代码，把声明的函数的变量先放在VO中。所以即便是先写了访问这些声明的代码，最终的记过也是可以正常执行的。这就是所说的提升，就好像这些声明代码被移动到了代码的最开始的位置。

```javascript
(function() {

    console.log(typeof foo); // 函数指针
    console.log(typeof bar); // 未定义
    console.log(typeof aoo); // 未定义

    var foo = 'hello',
        bar = function aoo() {
            return 'world';
        };

    function foo() {
        return 'hello';
    }

}());​
```

1. 为什么foo变量声明之前我们就能够访问?

如果我们看上面的创建阶段, 我们知道变量在执行阶段(activation / code execution stage)之前就已经被创建了. 所以当我们的函数开始执行的时候,foo变量在activation object中存在了.

2. foo被定义了两次, 为什么foo被当作是函数而不是undefined或者是字符串呢?

尽管foo被定义了两次, 我们直到在创建阶段(creation stage)中，函数先于变量创建，如果其属性名存在的话, 接下来的声明会被跳过。因此, 函数foo的引用在创建阶段的时候先被创建, 解释器接下来发现了变量foo, 但是由于已经存在了foo的名称，因此什么都没有发生和执行。需要注意的是，即便给`bar`赋值的函数是一个具名函数`aoo`，`aoo`也没有发生提升。

3. 为什么bar是undefined?

bar实际上是一个函数变量, 我们变量在创建阶段初始化时的值为undefined.

### 条件语句中的函数声明

需要注意的是，现在很多浏览器是支持条件语句的函数声明的，如下代码，在以前的浏览器中运行的话，会输出`else`

```javascript
foo()
if(true) {
   function foo() {
      console.log('if')
   }
} else {
   function foo() {
      console.log('else')
   }
}
// 以前会输出: else
```

   具体参见 [MDN function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function)

## 小结

从提升这部分可以看出来，在js中，函数声明是一等公民，引擎在编译阶段会优先把他们找出来，并绑定在VO/AO中。除非后面同名的声明函数，否则一般变量声明还不能覆盖他，但是他是可以覆盖其他同名变量声明。一旦采用函数表达式，那么他的低位就没那么高了，就相当于公主下嫁，即便她有公主的名分（具名函数），那也和普通变量声明没有区别了。



# 参考

1. [JavaScript 深入系列、JavaScript 专题系列、ES6 系列](https://github.com/mqyqingfeng/Blog)
2. [What is the Execution Context & Stack in JavaScript?](http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/)
3. 《你不知道的javascript（上卷）》