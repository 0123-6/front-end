# CSS常见面试题

## CSS如何定义注释?

使用/**/

```css
/*这是注释*/
.item {
  
}
```



## CSS3新增了什么?

![](D:\前端\CSS\css3.png)

- flex布局
- grid布局
- transform转换
- transition过渡 transition: all 0.5s ease;
- animation动画
- 属性选择器
- 结构伪类选择器
- 媒体查询
- 计算属性width: calc(100% - 50px)

## 什么是重绘和回流

- **重绘**：HTML元素的不需要重新计算几何结构的变化，代价小。
- **回流**：HTML元素的变化导致几何结构改变，浏览器需要重新计算受影响的元素，代价大。

## 如何让一个元素水平垂直居中

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <style>
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
   }
  </style>
</head>
<body>
<!--1. flex布局-->
<div style="width: 500px;height: 500px;background-color: pink;
  display: flex;justify-content: center;align-items: center;">
  <div style="width: 100px;height: 100px;background-color: orange;"></div>
</div>

<!--2. grid布局-->
<div style="margin-top: 20px;width: 500px;height: 500px;background-color: pink;
  display: grid;justify-content:center;align-items: center;">
  <div style="width: 100px;height: 100px;background-color: orange;"></div>
</div>

<!--3. 绝对定位 + transform-->
<div style="margin-top: 20px;width: 500px;height: 500px;background-color: pink;position: relative;">
  <div style="width: 100px;height: 100px;background-color: orange;
  position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);"></div>
</div>

<!--4. 绝对定位 + margin-->
<div style="margin-top: 20px;width: 500px;height: 500px;background-color: pink;position: relative;">
  <div style="width: 100px;height: 100px;background-color: orange;
  position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;"></div>
</div>
</body>
</html>
```

## 如何实现0.5px的线

注意:使用transform: scaleY(0.5)处理之后的div,只是看着为0.5px,实际上依然占据1px的空间,也就是transform不会影响元素的布局,只会影响元素的展示效果.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <style>
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
   }
  </style>
</head>
<body>
<!--1. height: 1px + transform-->
<div style="width: 500px;height: 500px;background-color: pink;
  display: flex;justify-content: center;align-items: center;">
  <div style="width: 100px;height: 1px;background-color: black;transform: scaleY(0.5);"></div>
</div>

<!--2. border + transform-->
<div style="margin-top: 20px;width: 500px;height: 500px;background-color: pink;
  display: flex;justify-content: center;align-items: center;">
  <div style="width: 100px;height: 0;border-top: 1px solid black;transform: scaleY(0.5);"></div>
</div>

<!--3. svg-->
</body>
</html>
```

## 主流浏览器支持原生CSS嵌套吗？

部分支持，比如最新版的谷歌浏览器和edge浏览器支持。

## display:none, visibility: hidden,opacity:0的区别

|          | display:none | visibility: hidden | opacity: 0 |
| -------- | ------------ | ------------------ | ---------- |
| 是否可见 | ×            | ×                  | ×          |
| 响应事件 | ×            | ×                  | √          |
| 空间     | ×            | √                  | √          |

## font-size和line-height的最佳实践

html设置font-size: 16px,保证tailwindcss正确.

body设置font-size: 14px,line-height: 1.5

其它字体和line-height使用tailwindcss推荐配置.

原则: 设置**line-height**略大于**font-size**,保证文字不溢出.

## 文字溢出设置

或者使用tailwindcss的**line-clamp-1**等属性。

```css
.line-clamp-1 {
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  word-break: break-all;
 	overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

## 如何画一个米字

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>学习CSS</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			flex-shrink: 0;
		}
	</style>
</head>
<body>
<!--最外层-->
<div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;background-color: rebeccapurple;">
	<div style="margin-top: 100px;margin-left: 100px;width: 600px;height: 600px;background-color: orange;display: flex;justify-content: center;align-items: center;position: relative;">
		<!--横线-->
		<div style="position: absolute;width: 100%;height: 2px;background-color: darkblue;top: 50%;transform: translateY(-50%);"></div>
		<!--竖线-->
		<div style="position: absolute;width: 2px;height: 100%;background-color: darkblue;left: 50%;transform: translateX(-50%);"></div>
		<!--左上右下线-->
		<div style="position: absolute;width: 100%;height: 2px;background-color: darkblue;top: 0;transform-origin: left top;transform: rotate(45deg) translateY(-50%) scaleX(1.415);"></div>
		<!--右上左下线-->
		<div style="position: absolute;width: 100%;height: 2px;background-color: darkblue;top: 0;transform-origin: right top;transform: rotate(-45deg) translateY(-50%) scaleX(1.415);"></div>
		<!--物体-->
		<div style="width: 300px;height: 300px;background-color: chartreuse;transform: none;"></div>
	</div>
</div>
</body>
</html>
```

## CSS有哪些选择器,优先级是什么?

CSS的规则是明确性大的应用,如果明确性一样,CSS定义出现晚的会覆盖前面的.

- 内联样式：在style属性中定义的样式，最高优先级
- id选择器：明确性(1, 0, 0)
- 类选择器，伪类选择器，属性选择器，明确性(0, 1, 0)
- 类型选择器，明确性(0, 0, 1)
- 通配符和运算符，不会增加优先级

```css
/*id选择器(1, 0, 0)*/
#box1 {
  
}

/*类选择器(0, 1, 0)*/
.box {

}

/*伪类选择器(0, 1, 0)*/
.box:hover {

}

/*属性选择器,根据一个元素上的某个标签的属性的存在以选择元素(0, 1, 0)*/
[title] {
	color: red;
}
/*可以加条件*/
[title='1'] {
	color: red;
}

/*类型选择器(0, 0, 1)*/
div {
	margin: 0;
	padding: 0;
	background-color: blueviolet;
}
```

## CSS中有哪些运算符选择器和通配符选择器?

- 后代选择器 单个空格
- 子代选择器 大于号 **>** ,
- 临近兄弟选择器 加号 +
- 通用兄弟选择器 波浪号 ~
- 通配符选择器 *号

## CSS如何处理禁用状态

禁用状态无需使用属性选择器，使用伪类选择器即可，伪类选择器之所以生效，是因为它们直接与元素的状态相关联，并由浏览器自动处理这些状态。这使得它们非常适合用于样式动态变化的元素，而无需手动检测和应用状态。

## 什么是伪元素

伪元素，选择一个元素的某个部分而不是元素自己.

- ::first-line

```stylus
p::first-line {
}
```

有一组特别的伪元素，它们和content属性一起使用，使用CSS将内容插入到HTML中。

```stylus
.box::after {
	content: 'after插入';
}
```

## 最小页面宽度设置多少?

页面最小宽度设置为**1200px**。

## flex的注意事项

慎用和尽量不用flex-grow属性,尽量使用height,min-height属性.

min-height不是height,其子元素height: 100%不生效,因为父元素的height未设置.

```vue
<template>
  <!--最外层-->
  <div class="not-found h-full flex flex-col bg-primary">
   <!--当flex-1不是最后一个元素时，之后的元素必须有明确的高度，否则会溢出-->
   <div class="flex-1 bg-[orange] flex items-center">
    <span class="text-xl">ss</span>
   </div>
   <div class="flex items-center">
    <span class="text-xl">404</span>
   </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "NotFound",
})
</script>
```

## 什么是BEM?

BEM(Block Element Modifier)是一种CSS命名规范,旨在提高代码的可读性,可维护性和复用性.BEM将CSS类名分为3部分: Block(块), Element(元素), Modifier(修饰符).

```css
block__element--modifier
```

- Block(块): 代表一个独立的功能模块, 比如导航栏, 按钮, 表单.menu, button, card
- Element(元素): 是块中的一部分, 使用双下划线连接,表示属于某个块的组成部分.
- Modifier(修饰符): 用于表示块或元素的不同状态或外观,用双连字符连接.

```html
<head>
  <style>
    .menu {
  		background-color: #f0f0f0;
		}

		.menu__item {
  		padding: 10px;
		}

		.menu__item--active {
  		font-weight: bold;
  		color: blue;
		}
  </style>
</head>

<body>
  <div class="menu">
  <div class="menu__item menu__item--active">Home</div>
  <div class="menu__item">About</div>
  <div class="menu__item">Contact</div>
</div>
</body>
```

## 全局scale缩放导致字体模糊解决方案

使用transform: scale或其它缩放方法时,会对元素进行像素级缩放,会引起像素对齐问题,可能导致字体模糊.

- 改变方案,使用**rem** + **动态根字体大小**实现,tailwindcss响应式系统是这样的实现(**推荐**),`rem` 是基于根元素（`html`）的字体大小计算的，通过动态调整 `html` 的 `font-size`，可以轻松实现全局的尺寸缩放，而无需逐一调整各个元素。**适配设计稿的单位**：根据你的设计稿（如 750px 或 1920px 宽度），选择一个适合的基准值。

  ```css
  html {
    font-size: 16px; /* 默认 */
  }
  
  @media (max-width: 768px) {
    html {
      font-size: 14px; /* 小屏时缩小比例 */
    }
  }
  
  @media (min-width: 1200px) {
    html {
      font-size: 18px; /* 大屏时放大比例 */
    }
  }
  ```

  ```ts
  const baseSize = 16; // 默认 font-size
  window.addEventListener('resize', setRem);
  setRem();
  
  function setRem() {
    const minFontSize = 12; // 最小限制
    const maxFontSize = 20; // 最大限制
    const designWidth = 1920;// 设计稿宽度
    const screenWidth = document.documentElement.clientWidth;// 实际屏幕宽度
    const scale = screenWidth / designWidth;// 缩放比例
    let newFontSize = Math.min(Math.max(baseSize * scale, minFontSize), maxFontSize);
    // 四舍五入取整
    newFontSize = Math.round(newFontSize)
    document.documentElement.style.fontSize = `${newFontSize}px`;
  }
  
  ```

  在设计中，所有尺寸、间距、字体大小都基于 `rem`，这样可以避免 `transform` 的像素模糊问题。

  | 屏幕宽度       | 推荐font-size |      |
  | -------------- | ------------- | ---- |
  | <768px         | 12px - 14px   |      |
  | 768px - 1200px | 14px - 16px   |      |
  | >1200px        | 16px - 18px   |      |

- 避免非整数的缩放比例: 如果必须使用 `transform: scale`，尽量使用接近整数的比例（如 `1.5` 而非 `1.33`），因为非整数比例容易导致子像素渲染模糊。

  - ```css
    /*启用字体抗锯齿*/
    html, body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /*保持字体在物理像素网格上对齐*/
    .scaled-element {
      transform: scale(1.2);
      will-change: transform;
    }
    
    .scaled-container * {
      font-size: calc(1rem / 1.2); /* 补偿缩放的字体模糊 */
    }
    ```

### 奇数是否导致字体模糊?

**奇数值本身不会直接导致模糊**

- 浏览器会将 `font-size` 渲染为物理像素，**非整数会被映射为最接近的子像素值**，并通过抗锯齿技术平滑显示。
- **在正常显示下**（没有缩放或其他复杂操作），现代浏览器的渲染能力足以处理非整数值，大多数情况下字体不会模糊。

**模糊问题通常与缩放有关**

1. 非整数的缩放比率: 当 font-size的缩放结果不是整数时，浏览器会进行子像素渲染，可能出现字体模糊。
   - 例如，`html { font-size: 15.5px; }` 在缩放后可能引起模糊。
2. **像素对齐问题**：一些低分辨率设备上，字体会因为无法精确对齐像素点而变得不清晰。

建议：选择常见的整数值（如 `14px`、`16px`、`18px`），并优先避免非整数缩放。

最佳实践是尽量避免复杂的缩放场景，使用**响应式设计**替代全局缩放。

# CSS重要属性

## object-fit

**object-fit**属性指定元素的内容应该如何适应到其使用高度和宽度确定的框。

|                | 是否保持图片全图          | 是否保持图片宽高比 | 是否铺满元素              | 使用建议                   |
| -------------- | ------------------------- | ------------------ | ------------------------- | -------------------------- |
| fill(默认)     | √                         | ×                  | √                         | 不保持宽高比,垃圾,不使用   |
| cover          | ×                         | √                  | √                         | 不保持全图,垃圾,不使用     |
| none           | 图片尺寸<元素尺寸,则保持. | √                  | 图片尺寸>元素尺寸,则铺满. | 不保证保持全图,垃圾,不使用 |
| **contain**    | √                         | √                  | ×(尽可能铺满)             | 建议使用,图片尽可能大      |
| **scale-down** | √                         | √                  | ×                         | 建议使用,图片不放大        |

scale-down 内容的尺寸与 `none` 或 `contain` 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。

## word-break

CSS 属性 `word-break` 指定了怎样在单词内断行。

默认值：normal

- normal,使用默认的断行规则
- break-all,在任意字符间断行
- break-word，他的效果是`word-break: normal` 和 `overflow-wrap: anywhere` 的合，不论 [`overflow-wrap`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow-wrap)的值是多少。已废弃。

## white-space

CSS **`white-space`** 属性用于设置如何处理元素内的[空白字符](https://developer.mozilla.org/zh-CN/docs/Glossary/Whitespace)。

- 空白字符是否[合并](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space#合并空白字符)，以及如何合并。
- 是否换行，以及如何换行。

默认值：normal

|                  | 换行符 | 空格和制表符 | 文本换行 | 行末空格 | 行末的其他空白分隔符 |
| ---------------- | ------ | ------------ | -------- | -------- | -------------------- |
| `normal(默认值)` | 合并   | 合并         | 换行     | 移除     | 挂起                 |
| `nowrap`         | 合并   | 合并         | 不换行   | 移除     | 挂起                 |
| `pre`            | 保留   | 保留         | 不换行   | 保留     | 不换行               |
| `pre-wrap`       | 保留   | 保留         | 换行     | 挂起     | 挂起                 |
| `pre-line`       | 保留   | 合并         | 换行     | 移除     | 挂起                 |
| `break-spaces`   | 保留   | 保留         | 换行     | 换行     | 换行                 |

## overflow

**`overflow`** 是 [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 的[简写属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Shorthand_properties)，其设置了元素溢出时所需的行为——即当元素的内容太大而无法适应它的[区块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context)时。

请不要修改全局默认值,因为其它UI 框架可能依赖overflow默认属性来实现CSS效果,比如Element Plus.

默认值：visible

- **visible**：可见的，直接溢出，没有滚动条.
- **hidden**: 裁剪,可以编程滚动
- **clip**: 和hidden相似,不可编程滚动
- **scroll**: 始终显示滚动条
- **auto**: 溢出时显示滚动条

## transform属性

有多个值时,**从右到左**执行.

- **none**：不应用任何转换
- **rotate**：旋转
  - **rotate**：旋转
  - **rotate3d**： 3d旋转
  - **rotateX**：
  - **rotateY**：
  - **rotateZ**：
  - **度数(deg)**：1圈 = 360 deg
  - **弧度(rad)**：1圈 = 2π rad
  - **周(turn)**：1圈 = 1turn
- **scale**：
  - **scale**： 放大或缩写，1个值时X，Y同时生效
  - **scale3d**：
  - **scaleX**：在X轴缩放
  - **scaleY**：在Y轴缩放
  - **scaleZ**：
- **translate**：
  - **translate**： 在X,Y轴移动，1个值时仅在X轴移动。
  - **translate3d**：
  - **translateX**：在X轴移动
  - **translateY**：在Y轴移动
  - **translateZ**：

## transform-origin

元素的原点。左上角为(0,0)点，默认为center，即50% 50%。

相对于自己,而不是父元素.

## font-size

**是继承**属性.

## line-height

**是继承**属性

## color

**是继承**属性

## background-repeat

background-repeat属性定义背景图片的重复方式.背景图片可以沿着水平轴,垂直轴重复,或者不重复.

```css
.t1 {
  /*默认值*/
  background-repeat: repeat;
  
  background-repeat: repeat-x;
	background-repeat: repeat-y;
	background-repeat: space;
	background-repeat: round;
	background-repeat: no-repeat;
}
```

##  background-position

background-position属性为每一个背景图片设置初始位置.

```css
.t1 {
  /*默认值*/
  background-position: 0% 0%;
  
  background-position: top;
	background-position: bottom;
	background-position: left;
	background-position: right;
	background-position: center;
}
```

## background-size

background-size属性设置图片大小.图片可以保持原有大小,或者拉伸到新的尺寸,或者保持比例的同时拉伸到元素大小.

```css
.t1 {
  /*默认值*/
  background-size: auto auto;
  
  background-size: cover;
	background-size: contain;
}
```

## text-align

文字对齐方式,默认start.

## align-items

一般设置为center,如需占满元素,可以设置为**stretch**,这个值也是默认值.

## user-select

元素是否可以被选择.

| Class       | Properties         |
| ----------- | ------------------ |
| select-none | user-select: none; |
| select-text | user-select: text; |
| select-all  | user-select: all;  |
| select-auto | user-select: auto; |

## transition

过渡效果

**`transition`** [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性是 [`transition-property`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-property)、[`transition-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-duration)、[`transition-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-timing-function) 和 [`transition-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-delay) 的一个[简写属性](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties)。

# 最佳实践

## 如何设置div占满剩余空间

如果父元素的父元素有高度,设置父元素为**min-h-full**,子元素可以使用**grow**来设为: 在子元素高度小于剩余高度时,子元素高度 = 剩余高度;在子元素高度 > 剩余高度时,子元素高度 = 自己本身高度.

请注意,flex-grow只会限制最低高度或宽度,而不会限制最大宽度或高度,不等效于height属性.如果子元素height: 100%,则子元素height设置无效.

```vue
<template>
	<div class="w-full min-h-full p-4 flex flex-col">
    <div class="h-[100px]"></div>
    <div class="mt-1.5 grow rounded"></div>
  </div>
</template>
```





























