export const componentSizes = ['', 'default', 'small', 'large'] as const

export type ComponentSize = typeof componentSizes[number]

// 按钮的高度定义
export const componentSizeMap = {
  // large,高度为40px
  large: 40,
  // default默认, 高度为32px
  default: 32,
  // small, 高度为24px
  small: 24,
} as const
