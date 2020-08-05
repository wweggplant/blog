关于深拷贝的思考,现在面试考察深拷贝会问你遇到非基础类型的属性怎么处理.比如`function`,`promise`等等.从面试角度来说,其实是考察对于这些数据类型的了解情况.但是实际工作中,遇到让你深拷贝对象的情况,一般都是纯对象的情况,如果遇到对象里面含有其他非基础类型的属性的时候,更好的办法还是创建一个工厂方法去创建呀一个对象.


# 浅拷贝

浅拷贝其实就是只把属性用`=`操作符把值指向另一个地方.

```javascript
function shallowCopy(obj) {
 if (typeof obj !== 'object') return;
 var o = Array.isArray(obj) ? [] : {}
 for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
        o[key] = obj[key]
    }
 }
 return o
}
var obj = {
    a: 1,
    b: {
        c: 2
    }
}
var newObj = shallowCopy(obj)
obj.b.c = 3
console.log(newObj.b.c)

// es6中的提供了浅拷贝的原生方法
Object.assign({}, obj)
```

浅拷贝有个现象是如果属性值是对象的话,只会复制引用,这样的话,不管是新生成的对象还是传入的对象中的对象属性值改变的话,另一个也会发生相应改变.比如上面的`obj.b.c = 3`,`newObj.b.c`也会变成3.其实浅拷贝非常常见,如果语言默认采用深拷贝的话,对于资源可能是一个巨大的浪费.常见的
常见的浅拷贝有esMoulde中的`import`和`export`,数组方法中的`slice`和`concat`等.下面是一个深拷贝的实现

```javascript
function extend() {
    var deep = false;
    var lenght = arguments.length
    var name, src, copy, i = 1, options, clone, copyIsArray
    var target = arguments[0] || {};
    if (typeof arguments[0] === 'boolean') {
        deep = arguments[0]
        target = arguments[i++] || {}
    }
    // 确保target是对象,不能是函数
    if (typeof target !== 'object' && !isFunction(target) ) {
        target = {}
    }
    for(;i < length; i++) {
        options = arguments[i]
        if (options != null) {
            for(name in options) {
                src = target[name];
                copy = options[name];
                if (deep && copy && (
                    isPlainObject(copy) || 
                    (copyIsArray = Array.isArray(copy))
                )) {
                    /* 
                        var obj1 = {
                            a: 1,
                            b: {
                                c: 2
                            }
                        }

                        var obj2 = {
                            b: {
                                c: [5],

                            }
                        }
                        var d = extend(true, obj1, obj2)
                        console.log(d); 解决属性中包含数组的情况
                    */
                    // 如果copy是数组的话而src不是数组,就给src赋值[]
                    if (copyIsArray) {
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        // 如果copy是对象的话而src不是对象,就给src赋值{}
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    // 递归
                    target[name] = extend(deep, clone, copy);
                } else if (copy != undefined) {
                    target[name] = copy
                }
            }
        }
    }
    return target
}
```

上面的函数到考虑到了如果被复制的对象中包含数组的情况如何处理, 如果copy是数组,而`src`不是的话,以`copy`为准,返回一个空的数组`[]`.还要一个循环引用的问题,不过这个情况比复杂,其实就是检测环的存在 在冴羽的这篇[博文](https://github.com/mqyqingfeng/Blog/issues/33)中,降到的循环引用我觉得有问题,只能检测一层,如果嵌套很多层话,就检测不出来了.一般检测环是否存在,需要借助图的算法.但是检测一个对象还好说,如果要拷贝的对象相互之间交叉引用,这种情况的检测又是难题了.

深拷贝还有要考虑到如果值是`promise`话,处理又有变化,这个时候`promise`的实例,构造时传入的执行函数已经执行完成了,这个时候,我能想到的只能是在这个`promise`实例上包装一层`promise`