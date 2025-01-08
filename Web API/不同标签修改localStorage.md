# 不同标签页面修改localStorage

```ts
window.addEventListener('storage', (event) => {
  if (event.key === key) {
    result.value = event.newValue ? JSON.parse(event.newValue) : null;
  }
});
```

