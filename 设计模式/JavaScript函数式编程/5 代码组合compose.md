# 5 代码组合compose

## 函数饲养

这就是 `组合`（compose，以下将称之为组合）：

```javascript
var compose = function(f, g) {
  return function(x) {
    return f(g(x))
  }
}
```

`f` 和 `g` 都是函数，`x` 是在它们之间通过“管道”传输的值。

