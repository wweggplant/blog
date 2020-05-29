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

边框不是是百分比

### 垂直格式化
### 列表项

## 行内元素
### 行布局
### 基础术语和概念
### 行内格式化
### 行内非替换元素
### 行内替换元素

## 改变元素显示

### 改变角色
### 行内块级元素
### run-in元素