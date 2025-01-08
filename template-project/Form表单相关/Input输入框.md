# Input输入框

## Vue2 + element-ui

### 属性

| 属性                | 说明                                                         | 类型             | 可选值                                                       | 默认值   |
| ------------------- | ------------------------------------------------------------ | ---------------- | ------------------------------------------------------------ | -------- |
| **type**            | 类型                                                         | string           | text，textarea，radio，checkbox，date，file，number，password | **text** |
| **value / v-model** | 绑定值                                                       |                  |                                                              |          |
| **placeholder**     | 输入框占位文本                                               | string           |                                                              |          |
| **disabled**        | 禁用                                                         | boolean          |                                                              | false    |
| **clearable**       | 是否可清空                                                   | boolean          |                                                              | false    |
| autocomplete        | 原生属性，自动补全                                           | string           | on, off                                                      | off      |
| size                | 输入框尺寸，只在 `type!="textarea"` 时有效                   | string           | medium / small / mini                                        | -        |
| prefix-icon         | 输入框头部图标                                               | string           |                                                              |          |
| suffix-icon         | 输入框尾部图标                                               | string           |                                                              |          |
|                     |                                                              |                  |                                                              |          |
| show-word-limit     | 是否显示输入字数统计                                         | boolean          |                                                              | false    |
| rows                | 输入框行数，只对 `type="textarea"` 有效                      | number           |                                                              | 2        |
| maxlength           | 原生属性，最大输入长度                                       | number           |                                                              |          |
| minlength           | 原生属性，最小输入长度                                       | number           |                                                              |          |
| autosize            | 自适应内容高度，只对 `type="textarea"` 有效，可传入对象，如，{ minRows: 2, maxRows: 6 } | boolean / object |                                                              | false    |
|                     |                                                              |                  |                                                              |          |
| max                 | 原生属性，设置最大值                                         |                  |                                                              |          |
| min                 | 原生属性，设置最小值                                         |                  |                                                              |          |
| step                | 原生属性，设置输入字段的合法数字间隔                         |                  |                                                              |          |
|                     |                                                              |                  |                                                              |          |
| show-password       | 是否显示切换密码图标                                         | boolean          |                                                              | false    |



## Vue3 + element-plus

### 属性

| 属性                      | 说明                                                         | 类型                  | 默认值  |
| ------------------------- | ------------------------------------------------------------ | --------------------- | ------- |
| **type**                  | 类型                                                         | string，原生input类型 | text    |
| **model-value / v-model** | 绑定值                                                       |                       |         |
| **placeholder**           | 输入框占位文本                                               | string                |         |
| **disabled**              | 禁用                                                         | boolean               | false   |
| **clearable**             | 是否可清空                                                   | boolean               |         |
| autocomplete              | 原生 `autocomplete` 属性                                     | string                | -       |
| size                      | 输入框尺寸，只在 `type` 不为 'textarea' 时有效               | large/default/small   | default |
| prefix-icon               | 自定义前缀图标                                               |                       |         |
| suffix-icon               | 自定义后缀图标                                               |                       |         |
|                           |                                                              |                       |         |
| show-word-limit           | 是否显示输入字数统计                                         | boolean               | false   |
| rows                      | 输入框行数，仅 `type` 为 'textarea' 时有效                   | number                | 2       |
| maxlength                 | 原生属性，最大输入长度                                       | string` / `number     |         |
| minlength                 | 生属性，最小输入长度                                         | string` / `number     |         |
| autosize                  | textarea 高度是否自适应，仅 `type` 为 'textarea' 时生效。 可以接受一个对象，比如: `{ minRows: 2, maxRows: 6 }` | boolean` / `object    | false   |
|                           |                                                              |                       |         |
| max                       | 原生属性，设置最大值                                         |                       |         |
| min                       | 原生属性，设置最小值                                         |                       |         |
| step                      | 原生属性，设置输入字段的合法数字间隔                         |                       |         |
|                           |                                                              |                       |         |
| show-password             | 是否显示切换密码图标                                         | boolean               | false   |

## React18 + antd

## 属性

