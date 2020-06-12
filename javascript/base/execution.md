
# 一篇javascript解析和执行的文章

这篇文章主要想讲一下关于javascript执行与解析的几个概念。其中有作用域、执行上下文（栈）、激活对象（VO和AO）等等。放在一起说是因为我觉得这几个概念其实是相互之间有很大关系的。在这个过程中参考了很多大神的文章。

# 目录

1. 词法作用域
2. 提升
3. 执行上下文（栈）
4. 变量对象
5. 作用域链
6. this

# 词法作用域

这部分是对于后面知识的前置知识。正常的作用域分两类：一种是被大多数语言使用的词法作用域，我们将会详细说明；另一种是动态作用域，bash等语言就是使用的动态作用域。引用《你不知道的javascript》，简单地说，词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你在写代码时将**变量**和**块作用域**写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变(大部分情况下是这样的)。而在ES5中，块级作用域主要是由函数来决定的。所以大部分情况下，函数声明在哪里，它的作用域就是哪里。

```javascript
function foo(a) {
   var b = a * 2;
   function bar(c) {
      console.log( a, b, c );
   }
   bar( b * 3 )
}
foo( 2 ); // 2, 4, 12
```
以上代码的词法作用域如下：
![20200612160615](http://oss.ipanda.site/markdown/20200612160615.png)

> 欺骗词法是指的在运行时修改词法的作用域。有两种办法eval和with。但是这样的做法会导致性能下降。因为不管是eval还是with，引擎无法在编译时对作用域查找进行优化。

# 执行上下文(栈)

# 执行上下文(栈) vs 作用域 vs 作用域链 vs 变量对象

执行上下文与执行上下文堆栈

**执行上下文就是代码执行的环境**

1. 全局作用域代码(Global code) - 你代码第一次被执行时的默认环境
2. 函数作用域代码(Function code) - 当执行到一个函数体内时
3. Eval作用域代码(Eval code) - 在eval函数内部执行中.

![20200611155230](http://oss.ipanda.site/markdown/20200611155230.png)


执行上下文堆栈

执行上下文的5个关键点:

1. 单线程
2. 同步执行
3. 一个全局上下文
4. 无限个函数上下文
5. 每次调用一个函数都会新建一个新的执行上下文, 哪怕是调用它自身

调用一个执行上下文(Execution context)都会分为两个阶段.

1. 创建阶段.[当一个函数被调用,但是在执行任何内部代码之前]
   1. 创建一个作用域链(Scope chain)
   2. 创建变量,函数和函数的调用参数.
   3. 确定this的值
2. 激活/代码执行阶段:
   1. 变量赋值, 函数引用以及代码块的执行.

![全局的执行环境始终在底部.](http://oss.ipanda.site/markdown/20200611155505.png)

激活 / 变量对象[AO/VO]

1. 找到调用这个函数的所有代码
2. 在执行函数之前, 创建执行上下文(execution context)
3. 进入创建阶段:
   1. 初始化作用域链(scope chain)
   2. 创建变量对象
      1.  创建参数对象,检查参数的上下文,初始化其名称和值并创建一个副本.
      2. 扫描上下文中所有的函数声明
         1. 每个函数被找到的时候, 在variable object中创建一个对应函数名称的属性, 其值是一内存中指向该函数的指针引用.
         2. 如果这个函数已经存在,该指针引用会被覆盖.
      3.  扫描上下文中所有对象的声明
          1.  当一个变量被找到的时候, 在variable object中创建其对应变量名的属性, 并将其值初始化为undefined
          2. 如果这个变量名的key已经存在于variable object中时, 跳过本次扫描.
   3. 确定this在上下文中的值
4. 激活/代码执行阶段
   1. 解释器逐行执行函数内的代码, 变量也在此时被赋值.

变量提升

```javascript
(function() {

    console.log(typeof foo); // 函数指针
    console.log(typeof bar); // 未定义

    var foo = 'hello',
        bar = function() {
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

尽管foo被定义了两次, 我们直到在创建阶段(creation stage)中,函数先于变量创建, 如果其属性名存在的话, 接下来的声明会被跳过.
因此, 函数foo的引用在创建阶段的时候先被创建, 解释器接下来发现了变量foo, 但是由于已经存在了foo的名称,因此什么都没有发生和执行.
3. 为什么bar是undefined?

bar实际上是一个函数变量, 我们变量在创建阶段初始化时的值为undefined.


# 参考

1. [JavaScript 深入系列、JavaScript 专题系列、ES6 系列](https://github.com/mqyqingfeng/Blog)
2. [[翻译]JS的执行上下文和堆栈详解(What is the Execution Context & Stack in JavaScript?)](https://pjf.name/blogs/what-is-execution-context-and-stack-in-javascript.html)
3. 《你不知道的javascript（上卷）》