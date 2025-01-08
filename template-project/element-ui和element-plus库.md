# element-ui和element-plus库

这是element-ui和element-plus的常用组件库总结。

# 悬浮层组件

## Tooltip文字提示

常用于展示鼠标hover时的提示信息。

Vue2相关：

- style属性无效，如果style存在，将设置style值到其插槽元素上，即要设置悬浮效果的元素上。

- class属性无效，如果class存在，同style属性。

- offset属性存在bug，无法使用。

Vue3相关：

- style，class属性会被忽略。

- offset可以使用。

### 参数列表

| 参数                          | 说明                                                         | 类型                          | 默认值 |
| ----------------------------- | ------------------------------------------------------------ | ----------------------------- | ------ |
| **content**                   | 提示内容                                                     | string字符串                  | ''     |
| **placement**                 | 方向-对齐，4个方向top，left，right，bottom；3种对齐方式，start，''，end | string字符串，'方向-对齐方式' | bottom |
| **effect**                    | 主题                                                         | 'dark'，'light'               | dark   |
| **disabled**                  | 是否禁用                                                     | Boolean                       | false  |
| **visible-arrow**（Vue2专属） | 是否显示 Tooltip 箭头                                        | Boolean                       | true   |
| **show-arrow**（Vue3专属）    | 是否显示 Tooltip 箭头                                        | Boolean                       | true   |
| **popper-class**              | 悬浮DOM最外层原生class                                       | String                        | ''     |
| **offset**(Vue3专属)          | 偏移量                                                       | number                        | 12     |

### Vue2示例

```vue
<template>
	<!--最外层-->
	<div class="text-comp flex-grow flex flex-col">
		<el-tooltip content="悬浮提示内容悬浮提示内容悬浮提示内容悬浮提示内容gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg"
		            placement="top"
		            effect="dark"
		            popper-class="el-tooltip-test-comp"
		>
			<!--默认插槽-->
			<button class="mt-[300px]">提交</button>
		</el-tooltip>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "TestComp",
})
</script>

<style>
/*el-tooltip__popper组件由1个矩形div + 1个三角形箭头组成*/
.el-tooltip__popper.is-dark.el-tooltip-test-comp[x-placement^=top] {
	/*修改组件的矩形div*/
	max-width: 400px;
	color: chartreuse;
	background-color: red;
	padding: 8px;
	font-size: 14px;
	line-height: 20px;
	word-break: break-all;

	/*修改组件距离元素的距离，offset属性，因为offset有bug，所以在这里设置*/
	margin-bottom: 6px;

	/*修改箭头的颜色*/
	.popper__arrow {
		border-top-color: red;
		/*箭头距离矩形元素的偏移值*/
		bottom: -3px;
	}
	.popper__arrow::after {
		border-top-color: red;
	}
}
</style>

```

### Vue3示例

```vue
<template>
	<!--最外层-->
	<div class="test-comp flex-grow flex flex-col items-center">
		<el-tooltip effect="dark"
		            content="ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg我草你妈ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg我草你妈"
		            placement="top"
		            popper-class="el-tooltip-test-comp"
		            :offset="12"
		>
			<button class="mt-[300px] w-[100px]">提交</button>
		</el-tooltip>
	</div>
</template>

<style>
.el-popper.is-dark.el-tooltip-test-comp {
	/*内容区域*/
	max-width: 400px;
	padding: 8px;
	color: chartreuse;
	background-color: red;
	border: unset;
	font-size: 14px;
	line-height: 20px;
	word-break: break-all;

	/*箭头相关*/
	.el-popper__arrow {
		bottom: -5px;
	}
	.el-popper__arrow::before {
		background-color: red;
		border: red;
	}
}
</style>
```

## Popover气泡卡片

tooltip承载简单文本内容，popover承载复杂内容。

### 参数列表

| 参数                       | 说明                                                         | 类型             | 默认值                   |
| -------------------------- | ------------------------------------------------------------ | ---------------- | ------------------------ |
| **trigger**                | 触发方式                                                     | 'click'/'hover'  | click(Vue2)，hover(Vue3) |
| **placement**              | 方向-对齐，4个方向top，left，right，bottom；3种对齐方式，start，''，end | '方向-对齐方式'  | bottom                   |
| **disabled**               | 是否禁用                                                     | Boolean          | false                    |
| **visible-arrow**(Vue2)    | 是否显示箭头                                                 | Boolean          | true                     |
| **show-arrow**(Vue3)       | 是否显示箭头                                                 | Boolean          | true                     |
| **popper-class**           | 悬浮DOM最外层原生class                                       | String           | ''                       |
| **effect**（Vue3专属）     | Tooltip 主题                                                 | `dark` / `light` | light                    |
| **offset**(Vue3专属)       | 浮层偏移量                                                   | number           | 12                       |
| **popper-style**(Vue3专属) | 悬浮DOM最外层原生style                                       |                  |                          |
| **width**(Vue3专属)        | 宽度                                                         |                  |                          |

### 插槽列表

| 参数                | 说明         |
| ------------------- | ------------ |
| **reference插槽**   | 要设置的元素 |
| **default默认插槽** | 悬浮内容     |

### Vue2示例

```vue
<template>
	<!--最外层-->
	<div class="text-comp flex-grow flex flex-col items-center">
		<el-popover
			trigger="hover"
			placement="top"
			popper-class="el-popover-test-comp"
		>
			<div class="w-[600px] h-[600px] flex flex-col bg-[orange]">

			</div>
			<button class="mt-[700px]" slot="reference">hover 激活</button>
		</el-popover>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "TestComp",
})
</script>

<style>
.el-popover.el-popover-test-comp[x-placement^=top] {
	padding: 0;
	margin-bottom: 6px;

	/*修改箭头的颜色*/
	.popper__arrow {
		border-top-color: orange;
		/*箭头距离矩形元素的偏移值*/
		bottom: -3px;
	}
	.popper__arrow::after {
		border-top-color: orange;
	}
}
</style>
```

### Vue3示例

```vue
<template>
	<!--最外层-->
	<div class="test-comp flex-grow flex flex-col items-center">
		<el-popover trigger="hover"
		            placement="top"
		            effect="light"
		            :offset="10"
		            :show-arrow="true"
		            popper-class="el-popover-test-comp"
		            width="500"
		>
			<template #reference>
				<div class="mt-[700px] w-[300px] h-[100px] flex flex-col items-center bg-[red]">
					<span>哈哈哈，我爱你</span>
				</div>
			</template>
			<template #default>
				<div class="w-[500px] h-[500px] bg-[red]"></div>
			</template>
		</el-popover>

	</div>
</template>

<style>
.el-popper.is-light.el-popover.el-popover-test-comp {
	padding: 0;
	/*箭头相关*/
	.el-popper__arrow {
		bottom: -5px;
	}
	.el-popper__arrow::before {
		background-color: red;
		border: red;
	}
}
</style>
```

## Dialog对话框

Dialog 弹出一个对话框，适合需要定制性更大的场景。

### 参数列表

| 参数                            | 说明                                                         | 类型    | 默认值 |
| ------------------------------- | ------------------------------------------------------------ | ------- | ------ |
| **visible**(Vue2)               | 是否显示 Dialog，支持 .sync 修饰符                           | boolean | false  |
| **model-value / v-model**(Vue3) | 是否显示 Dialog                                              | boolean | -      |
| **title**                       | Dialog 的标题                                                | string  | ''     |
| **width**                       | Dialog 的宽度                                                | string  | 50%    |
| **fullscreen**                  | 是否为全屏 Dialog                                            | boolean | false  |
| **top**                         | Dialog CSS 中的 margin-top 值                                | string  | 15vh   |
| **modal**                       | 是否需要遮罩层                                               | boolean | true   |
| **modal-class**(Vue3)           | 遮罩的自定义类名                                             | string  | ''     |
| **modal-append-to-body**        | 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上 | boolean | true   |
| **append-to-body**              | Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true | boolean | false  |
| **lock-scroll**                 | 是否在 Dialog 出现时将 body 滚动锁定                         | boolean | true   |
| **custom-class**(Vue2)          | Dialog 的自定义类名                                          | string  | ''     |
| **class**(Vue3)                 | 等效于custom-class                                           |         |        |
| **close-on-click-modal**        | 是否可以通过点击 modal 关闭 Dialog                           | boolean | true   |
| **show-close**                  | 是否显示关闭按钮                                             | boolean | true   |
| **center**                      | 是否对头部和底部采用居中布局                                 | boolean | false  |
| **align-center**(Vue3)          | 是否水平垂直对齐对话框                                       | boolean | false  |
| **destroy-on-close**            | 关闭时销毁 Dialog 中的元素                                   | boolean | false  |
| **draggable**(Vue3)             | 为 Dialog 启用可拖拽功能                                     | boolean | false  |
| **overflow**(Vue3)              | 拖动范围可以超出可视区                                       | boolean | false  |

### Vue2示例

见模板项目。

### Vue3示例

##Message消息提示

## Drawer抽屉

# 表单组件

## Form表单

## Input输入框

## InputNumber计数器

## Autocomplete自动完成

## Select选择器

## Radio单选框

## Checkbox多选框

## Cascader级联选择器

## Slider滑块

# 表格相关

## Table表格

## Pagination分页





















































