# 基本视觉格式化

## 基本框

如果边框样式有某种缝隙，则可以通过这些缝隙看到元素的背景。换句话说，边框与内容和内边距有相同的背景。最后要说明的是，边框的宽度绝对不能为负。


## 块级元素

包含块由最近的块级祖先框、表单元格或行内块祖先框的内容边界（ content edge）构成。

1. 正常流 从上到下,从做到右
2. 非替换元素, 大多数元素都是非替换元素,如`<p>`,`<span>`
3. 替换元素, `<input>`、`<img />`等等，这些标签的实际内容会被浏览器替换
4. 块级元素，不解释
5. 行内元素，不解释


### 水平格式化

width影响是内容区的宽度，其中内容宽度和外边距的`width`可以设置`auto`（css中已经有了`box-sizing`属性）

```
真正的宽度 = 内容宽度 + 内边距(padding) + 边框(border) + 外边距(margin)
```

### 使用auto (width，margin-left和margin-right)

width设置为auto,margin不动,则margin设置为0,width撑满父级

居中块级元素: 两个margin都设置为auto, width设置具体值, 元素水平居中

自动宽度: 如果margin-left和margin-right设置具体数值,内容的width设置auto或者不设置, 则内容宽度自动撑开到三者相加与父级宽度相同。

格式化属性过分受限: width、margin-left和margin-right这个三个属性中都设置成非auto的话,这时浏览器总会把margin-right强制设置成auto。例子如下
> 从左往右(默认情况)是以上的情况,如果方向相反这情况也对应相反


<iframe
    height=450
    width=800
    src="http://jsrun.net/dG2Kp/embedded/all/light"
    frameborder=0
    allowfullscreen="allowfullscreen">
</iframe>


### 负外边距

margin-right：一般情况下，元素的水平的7个属性总要等于父元素的width, 只要他们之和大于0,那么元素就不会大于父元素的内容区。但是指定负边距可以得到更宽的子元素， 如下：

<iframe
    width="100%"
    height="300"
    src="https://jsrun.net/mG2Kp/embedded/all/light"
    allowfullscreen="allowfullscreen"
    frameborder="0">
</iframe>

也就是说,之前说的子元素的外边距和内容的宽度之和只要满足数值上相等即可。上面给的例子是要满足以下关系

```
10px + 3px + auto + 3px - 50px = 400px
```

这样计算出来的子元素`width:auto`实际宽度是`434px`，要比父元素的`400px`大

margin-left设置为负的话，子元素可能会超过浏览器窗口

> 只有外边距可以为负值，内边距padding不可以为负

### 百分比

    以上规则喻队百分比都适用。

边框不能设置为百分比，这也是为什么想要实现『完全响应式』比较困难，除非放弃边框。
### 垂直格式化

块级元素，如果没有指定height，那么实际高度就是内容的高度。如果指定了height，则会涉及到内容height与指定height比较。如果内容height大于指定，则根据overflow属性显示，否则跟随指定高度。

1. 高度百分比

height使用百分比的话，实际值是包含块的高度百分比计算出来的值。

```html
<div style="height: 6em;">
    <p style="height: 50%;">Half as tall</p>
</div>
```

2. auto高度与垂直边距合并

高度是上下子元素的外边框边界之间的距离。这样的话，子元素的margin-top/bottom就不起作用了。但是如果包含块是上下`内边距`或者`边框`则刚才的高度是要加上子元素的上下外边距的。

上下外边距会合并：如果包含块设置边框和内边距的话，子元素外边距就会被包含在包含块中，这个合并就会失效。

<iframe
    width="100%"
    height="300"
    src="https://jsrun.net/GD2Kp/embedded/all/light"
    allowfullscreen="allowfullscreen"
    frameborder="0">
</iframe>

3. 负外边距

要合并的两个垂直外边距(margin-top/bottom)如果：
 1. 都是负值，那么取两个值的绝对值最大的一方
 2. 有一个负值，则正负相加之和为最后的结果。

<iframe
    width="100%"
    height="300"
    src="https://jsrun.net/5D2Kp/embedded/all/light"
    allowfullscreen="allowfullscreen"
    frameborder="0">
</iframe>

> 由于负边距导致元素重叠情况，那么在正常文档流后出现的元素可能会覆盖前面的元素。

## 行内元素
### 基础术语和概念

1. 匿名文本框
2. 内容区：非替换元素指的是字符串，不会产生垂直效果；替换元素还要加上外边距、边框和内边距，会产生垂直效果，进而影响航框的高度。
3. 行间距: `font-size`与`line-height`之差
4. 行内框: 非替换元素，line-height；替换元素内容区的高
5. 行框: 最高的行内框的上边界与最低行内框的下边界的高度。


**如何构造一个行框**

 1. line-height - font-size 得到行间距h。h/2应用到内容框的顶部和底部。得到替换元素的height、上下内边距、边框和上下外边距的值。
![20200601172950](http://oss.ipanda.site/markdown/20200601172950.png)
![20200601173126](http://oss.ipanda.site/markdown/20200601173126.png)
 2. 内容区确定文本基线和整行的基线，并对齐两者。替换元素的底部要和基线对齐。
 3. 对于`vertical-align`属性的元素，确定其偏移量。
 4. 得到最高和最低的的行内框，计算行框的高度。


### 行内格式化

通过上面可以发现，在块级元素上设置`line-height`会影响所有包含的内容, 明显的影响到行框。`line-height`只会影响行内元素,不会影响行内的块级元素.行内元素才会继承`line-height`

### 行内非替换元素


### 行内替换元素

## 改变元素显示

### 改变角色
### 行内块级元素
### run-in元素