# Proxy

**Proxy**构造函数用于创建一个对象的代理，从而实现基本操作的拦截和自定义。Object.defineProperty是之前的实现方式。对proxy修改会改变原始对象。

我们定义一些概念：

- target：被代理的原始**对象**。可以是任何对象，包括原生数组，函数，另一个代理。
- handler：包含一些列trap的处理器对象。
- traps：提供属性访问的方法。

```js
const p = new Proxy(target, handler)
```

# 属性

# 方法

proxy本身没有方法，这里列举的是构造参数handler对象的方法。

所有的捕获器都是可选的，如果没有定义某个捕获器，那么就会保留源对象的默认行为。

## handler.getPrototypeOf()

## handler.setPrototypeOf()

## handler.has()

in 操作符的捕获器

## handler.get()

属性读取操作的捕获器

```js
const handler = {
  // receiver即调用的proxy对象本身.
	get(obj, prop, receiver) {
		return prop in obj ? obj[prop] : 37
	},
}

const obj = {}
const p = new Proxy(obj, handler)
p.a = 1
p.b = undefined

console.log('p.a: ', p.a, obj.a)// 1 1
console.log('p.b: ', p.b, obj.b)// undefined undefined
console.log('p.c: ', p.c, obj.c)// 37 undefined
```

## handler.set()

属性赋值的捕获器

```js
const handler = {
  get(obj, prop) {
   return prop in obj ? obj[prop] : 37
  },
  set(obj, prop, value) {
   if (prop === 'age') {
    if (!Number.isInteger(value)) {
     throw new TypeError('年龄必须是整数')
    }
    if (value < 0 || value > 300) {
     throw new RangeError('年龄不符合合理范围，请检查')
    }
   }
   
   obj[prop] = value
   return true
  },
}

const obj = {}
const p = new Proxy(obj, handler)

p.age = -1000
console.log(p.age)// 报错，RangeError: 年龄不符合合理范围，请检查
```

## handler.apply()

函数调用操作的捕获器



































