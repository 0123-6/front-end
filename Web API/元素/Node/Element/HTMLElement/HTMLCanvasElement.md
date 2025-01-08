# HTMLCanvasElement

canvas元素，

## 方法

```javascript
toBlob(callback)
toBlob(callback, type)
toBlob(callback, type, quality)
```

### [参数](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob#参数)

- [`callback`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob#callback)

  回调函数，可获得一个单独的 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象参数。如果图像未被成功创建，可能会获得 `null` 值。

- [`type`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob#type) 可选

  - `image/png`默认，不指定格式，或指定的格式不支持时使用，无损压缩

  -  `image/jpeg`，有损压缩

  - `image/webp`，有损压缩，推荐

- [`quality`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob#quality) 可选

  值在 0 与 1 之间，当请求图片格式为 `image/jpeg` 或者 `image/webp` 时用来指定图片展示质量。如果这个参数的值不在指定类型与范围之内，则使用默认值，其余参数将被忽略。