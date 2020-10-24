
经常会看到网上各种手写bind的教程，推荐看一篇就够了 [冴羽大佬——手写bind](https://github.com/mqyqingfeng/Blog/issues/12)以及[bind的Polyfill——MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill)。下面是我在自己实现手写bind的过程中遇到的问题与思考。如果对于如何实现一个手写bind还有疑惑的话，那么可以先看看上面两篇文章。

# 手写bind vs 原生bind

我们先使用一个典型的手写bind的例子，代码如下：
```javascript
Function.prototype.bind2 = function (context) {
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

我们首先用原生bind运行一下代码

```javascript
function Foo(a) {this.a = a}
Foo.prototype.sayHi = function( ) {}
let _Foo = Foo.bind(undefined, 'a')
new _Foo() 
```
![原生bind](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e720f06cafa4944808adce6ff097b25~tplv-k3u1fbpfcp-zoom-1.image)

然后使用手写版代码，运行同样的代码

```javascript
function Foo(a) {this.a = a}
Foo.prototype.sayHi = function( ) {}
let _Foo = Foo.bind2(undefined, 'a')
new _Foo() 
```
![多一层__proto__](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c03c0fcd832405cba80f4ae80185d88~tplv-k3u1fbpfcp-zoom-1.image)

我们可以看到相比原生bind方法，手写版的bind方法返回的构造函数，构造出来的新对象会比原生的多一层`__proto__`。而这个`__proto__`产生的原因就是在很多教程中提到的**防止原型链篡改**。

这也就是为什么很多的文章会告诉你，为什么要添加下面的代码。

```javascript
var fNOP = function () {};
fNOP.prototype = this.prototype;
fBound.prototype = new fNOP();
```

这段代码中，使用了一个空函数作为中转，相当于`Object.create(fBound.prototype)`。具体可以查看文章开头给出的文章，里面的详细的说明。

# 规范中的bind

既然说道，加上面的代码是为了防止原型链篡改。我就想看看原生的bind如何处理这个问题的呢？


```javascript
function Foo(a) {this.a = a}
Foo.prototype.sayHi = function( ) {}
let _Foo = Foo.bind(undefined, 'a')
_Foo.prototype.sayHi = function( ) {console.log('篡改的_Foo的sayHi方法')}
(new _Foo().sayHi())
```

我发现在运行上面的代码，程序执行到修改`_Foo`的原型方法的语句时，就已经报错了。提示表明`_Foo`没有`prototype`属性！既然没有`prototype`属性，那么是不是也就不用处理原型链篡改的问题了呢？

之后，我查了一下[规范](https://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.5), 在NOTE中，有下面一段话。明确指出了bind返回的函数是没有`prototype`属性，这也多少印证了上面的猜想。

> Function objects created using Function.prototype.bind do not have a prototype property or the [[Code]], [[FormalParameters]], and [[Scope]] internal properties.

其中需要注意的有一点是这条：

> 11. Set the [[Prototype]] internal property of F to the standard built-in Function prototype object as specified in 15.3.3.1.

我自己理解的意思是是bind出来的函数对象的prototype属性是内建的`Function.prototype`属性, 这里应该是说明了为什么原生的bind不会多一层`__proto__`属性


# 小结

写这篇的目的是总结下自己在实现bind过程中遇到的问题，记录探究的过程。通过一系列手写原生方法，锻炼了我们对于原理的进一步认识。但是也要注意验证，实际去操作几次，可能得出自己的经验。如果有更多的两者对比的发现，可以在评论里告诉我，欢迎各位大佬斧正。



