# Element

**Element**是最通用的基类，Document中的所有元素对象都继承自它，具有各种元素共有的属性和方法。

**Element**接口继承自**EventTarget**接口

# 谁继承了Element

- HTMLElement: 该接口是所有HTML元素的基本接口
- SVGElement：是所有SVG元素的基本接口
- MathMLElement：MathML元素的基本接口

# 属性

## innerHTML

里面的内容

## outerHTML

包含自身全部的内容

## children

返回此元素的子元素

## childElementCount

返回子元素的个数

## clientHeight

元素高度+padding - 水平滚动条

## clientWidth

元素宽度+padding - 垂直滚动条

![](D:\前端\Web API\元素\Element\img\clientHeight.png)



## scrollHeight

和clientHeight一样，包括溢出高度。如果没有溢出，等于clientHeight

![](D:\前端\Web API\元素\Element\img\scrollHeight.png)

## scrollWidth

和clientWidth一样，包括溢出宽度。如果没有溢出，等于clientWidth。

## scrollLeft

元素左滚动偏移量的数值。

## scrollTop

元素滚定的值。将页面滚动到顶部，需要修改这个值。

# 方法

## scrollTo()

[`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 的 **`scrollTo()`** 方法可以使界面滚动到给定元素的指定坐标位置。

























































