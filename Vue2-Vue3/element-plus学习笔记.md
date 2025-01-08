# element-plus学习笔记

element-plus是基于Vue3,面向**设计师**和**开发者**的组件库.

Element Plus默认提供了一套主题,CSS采用BEM风格.

# element-plus组件总览

# 基础组件 11个

## ElButton

```ts
// button/index.ts
import Button from './src/button.vue'
import ButtonGroup from './src/button-group.vue'

// 定义ElButton组件,并导出
export const ElButton = withInstall(Button)
export const ElButtonGroup = withInstall(ButtonGroup)
export default ElButton
```

我们来看最重要的button.vue文件

```vue
<template>
<button ref="_ref"
        v-bind="_props"
        :class="buttonKls"
        @click="handleClick">
  <template v-if="loading">
    <slot name="loading" v-if="$slots.loading"/>
    <el-icon v-else :class="ns.is('loading')">
      <component :is="loadingIcon"/>
  	</el-icon>
	</template>
	<el-icon v-else-if="icon" || $slots.icon>
    <component :is="icon" v-if="icon"/>
    <slot v-else name="icon"/>
	</el-icon>
	<span v-if="$slots.default"><slot name="default"></slot></span>
</button>
</template>

<script lang="ts" setup>
// 定义组件名字
defineOptions({
  name: 'ElButton',
})
// 定义props和emit
const props = defineProps<IElButtonProps>()
// 定义触发的方法
const emit = defineEmits('click')
const ns = useNamespace('button')

const useButton = (props, emit) => {
  const buttonGroupContext = inject(buttonGroupContextKey, undefined)
  const globalConfig = useGlobalConfig('button')
  const {form} = useFormItem()
  const _size = useFormSize(computed(() => buttonGroupContext?.size))
  const _disabled = useFormDisabled()
  const _ref = ref()
  const slots = useSlots()
  const _type = computed(() => props.type || buttonGroupContext?.type || '')
  const _props = computed(() => ({
    disabled: _disabled.value || props.loading,
  }))
  const handleClick = (evt) => {
    if (_disabled.value || props.loading) {
      evt.stopPropagation()
      return
    }
    if (props.nativeType === 'reset') {
      form?.stopPropagation()
    }
    emit('click', evt)
  }
  
  return {
    _disabled,
    _size,
    _type,
    _ref,
    _props,
    handleClick,
  }
}

const {_ref, _size, _type, _disabled, _props, handleClick} = useButton(props, emit)
const buttonKls = computed(() => [
  ns.b(),
  ns.m(_type.value),
  ns.m(_size.value),
  ns.is('disabled', _disabled.value),
  ns.is('loading', props.loading),
  ns.is('plain', props.plain),
  ns.is('round', props.round),
  ns.is('circle', props.circle),
  ns.is('text', props.text),
  ns.is('link', props.link),
  ns.is('has-bg', props.bg),
])
</script>
```

```ts
export interface IElButtonProps {
  
  // 是否是禁用状态
  disabled: Boolean,
  // 加载中
  loading: Boolean,
  
  // 按钮高度,default 32px, small 24px, large 40px,
  size: 'default' | 'small' | 'large',
  // 按钮类型
  type: '' | 'default' | 'info' | 'primary' | 'success' | 'warning' | 'danger',
  // 简朴按钮
  plain: Boolean,
  // 是否为圆角
  round: Boolean,
  // 是否为圆形
  circle: Boolean,
  
  // 是否为文字按钮
  text: Boolean,
  // 链接按钮
  link: Boolean,
  // 文字按钮是否展示背景色
  bg: Boolean,
}
```

## 边框



# 表单组件 21个

- ElAutoComplete 自动补全

- Form表单

  ```vue
  <template>
  	<div class="mt-4 h-[112px] rounded bg-[#F6F7Fc] p-4 flex gap-x-8">
      <!--左,直接使用el-form组件,并通过设置style的width和height来进行最外层样式控制,不要设置为flex布局-->
      <el-form :model="form"
               inline
               label-position="right"
               label-width="70"
               style="width: calc(100% - 80px - 32px);height: 100%;"
      >
        <el-form-item label="选项1"></el-form-item>
        <el-form-item label="选项2"></el-form-item>
        <el-form-item label="选项3"></el-form-item>
    	</el-form>
      <!--右-->
      <div class="w-[80px] h-full flex flex-col justify-between">
        <button>查询</button>
        <button>重置</button>
    	</div>
    </div>
  </template>
  ```

  

- 去

# 数据展示 23个

## Table

在使用table时,建议设置一个height属性,否则当属性列出现fixed时,会出现一个不期望的纵向滚动条.

table组件在data更新时会自动触发selection-change方法,参数为null,但不会触发sort-change方法.

在改变table的父条件时,重置table组件本身的状态.

```ts
const tableRef = ref(null)
const resetTableRef = () => {
  tableRef.value.clearSelection()
  tableRef.value.clearSort()
  tableRef.value.clearFilter()
}
```



# 导航 9个

# 反馈组件 10个

# 其它 2个

# ElAutocomplete 自动补全

```ts
// index.ts
import { withInstall } from '@element-plus/utils'
import Autocomplete from './src/autocomplete.vue'

export const ElAutocomplete = withInstall(Autocomplete)
export default ElAutocomplete
```

# 常见问题

el-select的el-option组件无法处理value为数组的情况,需要将value先转换为字符串,需要时再恢复为数组.

在使用时可以借助computed函数来实现,value还是原始数组值,但是el-options绑定的是一个computed计算属性.

## 日期相关

在导入Element Plus的中文包后,还需要再导入**dayjs的中文包**.











































