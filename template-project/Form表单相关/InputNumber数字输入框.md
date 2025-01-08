# InputNumber数字输入框

仅允许输入标准的数字值，可定义范围。

## Vue2 + element-ui

### 属性

| 属性              | 说明                     | 类型         | 可选值 | 默认值    |
| ----------------- | ------------------------ | ------------ | ------ | --------- |
| value / v-model   | 绑定值                   | number       |        | 0         |
| min               | 设置计数器允许的最小值   | number       |        | -Infinity |
| max               | 设置计数器允许的最大值   | number       |        | Infinity  |
| step              | 计数器步长               | number       |        | 1         |
| step-strictly     | 是否只能输入 step 的倍数 | boolean      |        | false     |
| precision         | 数值精度                 | number       |        |           |
| size              | 计数器尺寸               | large, small |        | -         |
| disabled          | 是否禁用计数器           | boolean      |        | false     |
| controls          | 是否使用控制按钮         | boolean      |        | true      |
| controls-position | 控制按钮位置             | string       | right  | -         |

## Vue3 + element-plus

### 属性

| 属性                  | 说明                     | 类型                | 可选值 | 默认值    |
| --------------------- | ------------------------ | ------------------- | ------ | --------- |
| model-value / v-model | 绑定值                   | number              |        |           |
| min                   | 设置计数器允许的最小值   | number              |        | -Infinity |
| max                   | 设置计数器允许的最大值   | number              |        | Infinity  |
| step                  | 计数器步长               | number              |        | 1         |
| step-strictly         | 是否只能输入 step 的倍数 | boolean             |        | false     |
| precision             | 数值精度                 | number              |        |           |
| size                  | 计数器尺寸               | large/default/small |        | default   |
| disabled              | 是否禁用计数器           | boolean             |        | false     |
| controls              | 是否使用控制按钮         | boolean             |        | true      |
| controls-position     | 控制按钮位置             | string              | right  | -         |
|                       |                          |                     |        |           |
|                       |                          |                     |        |           |



## React18 + antd

### 属性

