
> “Be conservative in what you send; be liberal in what you accept.
 –The Robustness principle”
 “发送时要保守；接收时要开放。
 –伯斯塔尔法则”
 
一切从伯斯塔尔法则说起,伯斯塔尔法则是促成了HTML5规范形成的主线。作为专业人士，在发送文档的时候，我们会尽量保守一些，尽量采用最佳实践，尽量确保文档格式良好。但从浏览器的角度说，它们必须以开放的姿态去接收任何文档。

W3C组织一开始作死，想把`XML`那一套应用到浏览器中。可是浏览器厂商不买账，于是几家巨头联合起来搞了一个新的组织WHATWG，愉快的在浏览器里面添加各种新的实现。W3C看这情况自己已经被架空，于是立马转变态度，提出两个组织合并的事宜。最后，可想而知，新的组织里，明显厂商话语权更大。即便从现在来看，W3C选择XML肯定是没前途的，因为XML语法要求严格，而且实现上没法向后兼容。程序员不愿意支持XML这种错一点，整个页面奔溃的处理机制。

# HTML5的设计原理

### 1.avoid needless complexity 避免不必要的复杂性
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<link rel="stylesheet" type="text/css" href=""/>
<script type="text/javascript"></script>
```
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<link rel="stylesheet" type="text/css" href=""/>
<script type="text/javascript"></script>
```
```html
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr">
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href=""/>
<script type="text/javascript"></script>
```
上面3端代码片段分别代表着XHTML1, HTML4.01, XHTML1.1的文档类型申明和字符编码申明以及引入JavaScript和CSS时要书写的内容。

好吧, 让我们来看一看HTML5的这部分内容:
 ```html
<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8" />
<link rel="stylesheet" href="" />
<script src=""></script>
```
doctype
验证器：doctype提供给验证器验证文档的。但是浏览器不会纠结doctype是什么类型，他都会尝试把标签元素解析出来，也就是说使用一个和doctype不匹配的标签，浏览器也会尝试解析出来。向后兼容：兼容未来的HTML版本——不管是HTML6、HTML7，还是其他什么——都要与当前的HTML版本，HTML5，兼容。因此，把一个版本号放在doctype里面没有多大的意义，即使对验器证也一样。
避免麻烦的写法
`meta`直接使用`charset`属性，`link`不用再写`rel=”stylesheet”`，`script`不用再写`type=”text/javascript”`
### 2. Support existing content 支持已有的内容
显然，我们都会考虑让Web的未来发展得更好，但他们则必须考虑过去。别忘了W3C这个工作组中有很多人代表的是浏览器厂商，他们肯定是要考虑支持已有内容的。
 再来看几段代码:
 ```html
<p class="foo">Hello World</p>
<p class="foo">Hello World
<IMG SRC="foo" ALT="bar"><P CLASS="foo">Hello World</P>
<img src=foo alt=bar><p class=foo>Hello World</p>
```
这个例子展示了编写同样内容的四种不同方式。一个是img元素，另一个是带属性的段落元素。四种写法唯一的不同点就是语法。把其中任何一段代码交给浏览器，浏览器都会生成相同的DOM树，没有任何问题。从浏览器的角度看，这四种写法没有区别。因而在HTML5中，你可以随意使用下列任何语法。这几段代码有问题吗? 没有, 是的, 完全没有问题!接收时要开放的原则在这里完美体现。那么发送者要保守的原则体现在哪里呢？当然是指的开发者，在开发程序的时候，有类似jslint这样工具来保证写的html5是符合标准的。
### 3. solve real problems 解决现实的问题
看代码:
 ```html
<h2>Heading text</h2>
<p>Paragraph text.</p>
```
现在我们需要给这两个文本都加上一个链接, 那我们的做法会是什么? 给h2和p分别加上一个a标签？ 就像：
```html
<a href="somewhere">
    <h2>Heading text</h2>
    <p>Paragraph text.</p>
</a>
```
这样写没有错，只不过是种不太好的习惯, 并且通不过严格的校验。但是这样的应用场景肯定存在的, 因为早就有人这样写了，当然这是不合乎规范的。所以，说HTML5解决现实的问题，其本质还是“你都这样写了很多年了吧？现在我们把标准改了，允许你这样写了。”
### 4. pave the cowpaths 求真务实
   > 把一群牛放在地里，然后看牛喜欢怎么走，然后根据牛群踩过的痕迹来铺一条给牛走的路。


很有趣的比喻吧, 说的就是把一些既然存在的东西变得更加标准一些. 接上地气的标准才是能够被执行的标准.
 举个栗子:
WHATWG对抽样对大量网站进行了分析, 得出了这样的一个结论:
 `id=”header”`, `id=”footer”`, `id=”content”`, `id=”navigation”`, `id=”sidebar”` 这样的命名方式非常常见, 那好吧, 那我就给你们一些这样的标签!`<section>`,`<article>`,`<aside>`,`<nav>`,`<header>`,`<footer>`,`<details>`,`<figure>`
 看代码:
 ```html
<body>
  <div id="header"></div>
  <div id="navigation"></div>
  <div id="main"></div>
  <div id="sidebar"></div>
  <div id="footer"></div>
</body>
```
变!
```html
<body>
  <header></header>
  <nav></nav>
  <div id="main"></div>
  <aside></aside>
  <footer></footer>
</body>
```
变!
```html
<section class="item">
    <header><h2></h2></header>
    <footer class="meta"></ footer >
    <div class="content"></div>
    <nav class="link"></nav>
</section>
```

这些元素在一个页面中不止可以使用一次，而是可以使用多次。可以在文档添加一个头部（`header`），再添加一个脚部（`footer`）；但文档中的每个分区 （`section`）照样也都可以有一个头部和一个脚部。而每个分区里还可以嵌套另一个分区，被嵌套的分区仍然可以有自己的头部和脚部。

最重要的是它们是有语义的，跟位置没有关系。之前的`div`变成了`section`们，有了明确的语义。
### 5. degrade gracefully 优雅降级
 HTML5中设计了这么些新玩意：
 ```html
<input type="number" />
<input type="search" />
<input type="range" />
<input type="email" />
<input type="date" />
<input type="url" />
```
很有趣, 但是浏览器不认识, 怎么办呢?
最关键的问题在于浏览器在看到这些新`type`值时会如何处理。现有的浏览器是无法理解这些新`type`值的。但在它们看到自己不理解的`type`值时，会将type的值解释为`text`。

HTML5还为输入元素增加了新的属性，比如`placeholder`（占位符），就是用于在文本框中预先放一些文本。使用JavaScript编写一些代码当然也可以实现这个功能，但HTML5只用一个`placeholder`属性就帮我们解决了问题。对于不支持这个属性的浏览器，你还是可以使用JavaScript来实现占位符功能。通过JavaScript来测试浏览器支不支持该属性也非常简单。如果支持，后退一步，把路让开，乐享其成即可。如果不支持，可以再让你JavaScript来模拟这个功能。

再来看一个比较极端的优雅降级方案:
```html
<video>
    <source src="movie.mp4">
    <source src="movie.ogv">
    <source src="movie.webm">
    <object data="movie.swf">
      <a href="movie.mp4">download</a>
    </object>
</video>
```

上面的代码中包含了4个不同的层次。
 1、如果浏览器支持video元素，也支持H264，没什么好说的，用第一个视频。
 2、如果浏览器支持video元素，支持Ogg，那么用第二个视频。
 3、如果浏览器不支持video元素，那么就要试试Flash影片了。
 4、如果浏览器不支持video元素，也不支持Flash，我还给出了下载链接。
 
### 6. Priority of constituencies 最终用户优先

 事先声明, 这是条很哲学的设计原则, 没有代码可以看。它的意义就是: 一旦遇到冲突，最终用户优先，其次是作者，其次是实现者，其次标准制定者，最后才是理论上的完满。在有人建议了某个特性，而HTML5工作组为此争论不下时，如果有浏览器厂商说“我们不会支持这个特性，不会在我们的浏览器中实现这个特性”，那么这个特性就不会写进规范。因为即使是把特性写进规范，如果没有厂商实现，规范不过是一纸空文。

## 参考

[帮助你理解HTML5](https://www.jianshu.com/p/1ee96def153c)