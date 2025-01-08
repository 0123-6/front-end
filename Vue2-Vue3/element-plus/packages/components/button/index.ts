import { withInstall, withNoopInstall } from '@element-plus/utils'
import Button from './src/button.vue'
import ButtonGroup from './src/button-group.vue'
import type { SFCWithInstall } from '@element-plus/utils'

// 定义ElButton组件,并导出
export const ElButton: SFCWithInstall<typeof Button> & {
  ButtonGroup: typeof ButtonGroup
} = withInstall(Button, {
  ButtonGroup,
})
// 定义ElButtonGroup组件,并导出
export const ElButtonGroup: SFCWithInstall<typeof ButtonGroup> =
  withNoopInstall(ButtonGroup)
// 默认导出ElButton组件
export default ElButton

export * from './src/button'
export * from './src/constants'
export type { ButtonInstance, ButtonGroupInstance } from './src/instance'
