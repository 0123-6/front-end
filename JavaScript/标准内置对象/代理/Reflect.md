# Reflect

**Reflect**不是构造函数，类似于Math，只有静态方法。

Reflect提供了拦截JavaScript操作的方法，这些方法和proxy的handler的方法类似。

# 属性

# 方法

## Reflect.apply()

```js
Reflect.apply(target, thisArgument, argumentsList)
```

- target：目标函数
- thisArgument：函数调用时绑定的this对象
- argumentsList：函数参数，类似于fn.apply()

```js
console.log(Reflect.apply(Math.floor, undefined, [1.75]))// 1
```

## Reflect.get()

```js
const obj = {
  x: 1,
  y: 2,
}
console.log(Reflect.get(obj, 'x'))// 1
```

## Reflect.has()

```js
const duck = {
  name: '吕凤凤',
  age: 24,
  doSomething() {
   console.log('hhh')
  }
}

console.log(Reflect.has(duck, 'doSomething'))// true
```

## Reflect.set()

```js
const duck = {
  name: '吕凤凤',
  age: 24,
  doSomething() {
   console.log('hhh')
  }
}

Reflect.set(duck, 'love', '女人')

console.log(Reflect.has(duck, 'doSomething'))
console.log(duck.love)// 女人
```

## 为什么使用Reflect?

