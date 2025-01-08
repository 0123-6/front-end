# Tooltip文字提示组件

## React18 + antd

### Tooltip文字提示

鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

通过设置 `title=""` 可以禁用 Tooltip。

距离元素距离未完成。

箭头大小修改未完成。

#### 属性列表

| 属性                  | 说明                                               | 类型                                                | 默认值 |
| --------------------- | -------------------------------------------------- | --------------------------------------------------- | ------ |
| **title**             | 提示内容                                           | ReactNode                                           | ''     |
| **placement**         | 12个方向                                           | topLeft，top，topRight，leftTop，left，leftBottom等 | top    |
| **color**             | 主题背景颜色                                       |                                                     |        |
| **arrow**             | 修改箭头的显示状态以及修改箭头是否指向目标元素中心 | boolean                                             | true   |
| **overlayClassName**  | 悬浮层最外层自定义class                            | string                                              |        |
| **overlayStyle**      | 悬浮层最外层自定义style                            | object                                              |        |
| **overlayInnerStyle** | 文字内容div的style                                 | object                                              |        |

#### 示例

```tsx
import {Tooltip} from "antd";

export default function TestComp() {
	// state
	// effect
	// methods
	// render
	return (
		// 最外层
		<div className={'test-comp flex-grow flex flex-col items-center'}>
			<Tooltip title={'提示内容展示gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'}
			         placement={'bottom'}
			         color='red'
			         overlayClassName={'aaa bbb'}
			         overlayStyle={{
								 minWidth: '20px',
				         maxWidth: '400px',
			         }}
			         overlayInnerStyle={{
				         padding: '8px',
				         color: 'chartreuse',
				         fontSize: '14px',
				         lineHeight: '20px',
				         wordBreak: 'break-all',
			         }}
			>
				<button className={'mt-[400px] w-[100px]'}>提交</button>
			</Tooltip>
		</div>
	)
}
```

### popover气泡卡片

#### 属性

| 属性                  | 说明                                               | 类型                                                | 默认值 |
| --------------------- | -------------------------------------------------- | --------------------------------------------------- | ------ |
| **arrow**             | 修改箭头的显示状态以及修改箭头是否指向目标元素中心 | boolean                                             | true   |
| **color**             | 主题背景颜色                                       |                                                     |        |
| **overlayClassName**  | 悬浮层最外层自定义class                            | string                                              |        |
| **overlayStyle**      | 悬浮层最外层自定义style                            | object                                              |        |
| **overlayInnerStyle** | 文字内容div的style                                 | object                                              |        |
| **placement**         | 12个方向                                           | topLeft，top，topRight，leftTop，left，leftBottom等 | top    |
| trigger               | 触发行为                                           |                                                     | hover  |
| title                 | 卡片标题                                           |                                                     |        |
| content               | 卡片内容                                           |                                                     |        |

#### 示例

```tsx
import {Popover} from "antd";

const ContentComp = (
	<div className={'w-[400px] h-[400px] flex flex-col items-center bg-[orange]'}>
		<span>123</span>
		<span>456</span>
	</div>
)

export default function TestComp() {
	// state
	// effect
	// methods
	// render
	return (
		// 最外层
		<div className={'test-comp flex-grow flex flex-col items-center'}>
			<Popover color={'#ffa500'}
			         overlayStyle={{
								 maxWidth: '500px',
				         padding: 0,
			         }}
			         arrow={false}
			         overlayInnerStyle={{
								 padding: 0,
			         }}
			         trigger={'hover'}
			         placement={'top'}
			         title={null}
			         content={ContentComp}
			>
				<div className={'mt-[700px] w-[500px] h-[200px] flex items-center bg-[orange]'}></div>
			</Popover>
		</div>
	)
}
```



















































