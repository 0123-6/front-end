# Number

# 属性

# 方法

## Number.isNaN()

**`Number.isNaN()`** 静态方法判断传入的值是否为 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)，如果输入不是数字类型，则返回 `false`。它是全局 [`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN) 函数更健壮的版本。

## Number.isFinite()

**`Number.isFinite()`** 静态方法判断传入值是否是一个有限数——也就是说，它检查给定值是一个数字，且该数字既不是正的 [`Infinity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity)，也不是负的 `Infinity` 或 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)。

与全局 [`isFinite()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isFinite) 函数相比，此方法不会先将参数转换为数字，这意味着只有类型为数字*且*为有限数的值才返回 `true`，而非数字的值始终返回 `false`。

## Number.prototype.toFixed()

保留指定位数小数.