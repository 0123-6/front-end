# Object属性(2个)

## constructor

原型对象的属性，指向对应的构造函数。

## \_\_proto\_\_

一个对象对应的原型对象，通过\_\_proto\_\_组成了原型链

# Object方法(12个)

## 遍历(3个)

### Object.keys()

返回一个对象的自有的，可枚举的属性数组

### Object.values()

返回一个对象的自有的，可枚举的属性值数组

### Object.entries()

返回一个对象的自有的，可枚举的键值对数组

## 原型(4个)

### Object.create()

创建一个新对象，指定它的原型。

### Object.getPrototypeOf()

获取一个对象的原型对象

### Object.prototype.isPrototypeOf()

判断一个对象是否在另一个对象的原型链上

### Object.setPrototypeOf()

为一个对象设置它的原型对象

## 属性(3个)

### Object.defineProperty()

在一个对象上定义和修改一个属性。

```javascript
// 将对象改为响应式
	observer(obj) {
		if(!obj || (typeof obj !== 'object')) {
			return;
		}
		const _this = this;
		Object.keys(obj).forEach((key) => {
            // 这里需要先提出来，不能直接使用obj[key]，否则会栈溢出。
			let value = obj[key];
			Object.defineProperty(obj, key, {
				enumerable: true,
				configurable: true,
				get: function reactiveGetter() {
					return value;
				},
				set: function reactiveSetter(newVal) {
					if (newVal === obj[key]) {
						return;
					}
					value = newVal;
					_this.updatePage();
				}
			})
		});
	}
```



### Object.hasOwn()

### Object.prototype.hasOwnProperty()

判断一个对象是否有指定自有属性

## 实用方法(2个)

### Object.assign()

将一个或多个源对象自有，可枚举属性复制到目标对象上，返回修改后的目标对象。

### Object.is()

比较







