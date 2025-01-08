# CSS动画

- **transition**：过渡效果，需要触发条件，只能控制开始和结束的状态
  - `transition-property` 要过渡的属性，all表示所有属性
  - `transition-duration` 动画持续时间，单位为s或ms，默认值 0s 。
  - `transition-timing-function`  时间函数描述了动画进程在时间上的分布。贝塞尔曲线或阶跃函数。
    - ease 默认值
    - ease-in
    - ease-out
    - ease-in-out
    - linear
    - cubic-bezier(x2, y2, x3, y3)
  - `transition-delay`  动画**开始前**的延迟时间
- **animation**：动画，无需触发条件，可以通过**keyframes关键帧**控制多个中间状态和更详细的动画过程

**transform**是变换，和动画无关，但可以应用到动画过程中。

## 贝塞尔曲线

CSS 中设置一贝塞尔曲线的语法为：`cubic-bezier(x2, y2, x3, y3)`。这里我们只需要设置第二个和第三个值，因为第一个点固定为 `(0,0)`，第四个点固定为 `(1,1)`。

```vue
<template>
	<!--最外层-->
	<div class="test-comp flex-grow flex flex-col bg-[orange]">
		<div class="relative h-[200px] flex flex-col bg-[red] hover:bg-primary ">
			<span class="absolute text-xl left-0 hover:left-[400px] transition-[left] duration-[5s] ease-linear"
			      style="animation: ss 3s infinite alternate">哈哈哈</span>
		</div>
	</div>
</template>

<style>
@keyframes ss {
  from {
   left: 0;
  }
  to {
   left: calc(100% - 60px);
  }
}
.test-comp {

}
</style>
```

# animation

[CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) **animation** 属性是 [`animation-name`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-name)，[`animation-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-duration), [`animation-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)，[`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)，[`animation-iteration-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-iteration-count)，[`animation-direction`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction)，[`animation-fill-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) 和 [`animation-play-state`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-play-state) 属性的一个简写属性形式。

每个动画定义中的属性值的顺序很重要：可以被解析为时间第一个值被分配给[`animation-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-duration)，第二个分配给 [`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)。

##  [`animation-name`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-name)

指定@keyframes定义的关键帧，以逗号分割。

## [`animation-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-duration)

设置动画完成一个动画周期所需的时间。默认0s，单位为s或ms

## [`animation-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)

见transition。

## [`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)

延迟。

## [`animation-iteration-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-iteration-count)

播放的次数，infinite表示正无穷。默认值为1。

## [`animation-direction`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction)

设置动画是应正向播放、反向播放还是在正向和反向之间交替播放。

- normal：默认值，正常播放
- reverse：反向播放
- alternate：正反交替播放

## [`animation-fill-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode)

设置 CSS 动画在执行之前和之后如何将样式应用于其目标。

- none
- forwards
- backwards
- both

##  [`animation-play-state`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-play-state)

设置动画是运行还是暂停

- running：正常运行
- paused：暂停运行

# 如何优化动画

将dom设置为absolute或fixed,使其脱离文档流,防止回流.

# 可能引发的问题

原生CSS属性是很快的,如果设置了一个属性但是没有立即生效,可能是动画或过渡效果引发的延迟.













































