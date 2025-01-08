# Map

Map对象保存键值对，并且能够记住键的原始插入顺序。**任何值(对象或原始值)**都可以作为键或值。

Map对象是键值对的集合。Map中的一个键只能出现一次；迭代按照插入的顺序进行。

Map键的比较基于**零值相等**算法

```javascript
// 语法
// new Map()
// new Map(iterator)// 数组或其它可迭代对象，用来初始化map
```

Map()必须用new构造。

# Map属性(1个)

## size

size的值是一个整数，表示Map对象有几个键值对。size的设置访问器函数是undefined，我们无法更改size属性。

# Map方法(10个)

## 遍历方法(5个)

### Map.prototype.keys()

返回键的迭代器对象

### Map.prototype.values()

返回value的迭代器对象。

### Map.prototype.entries()

Map实例的entries()方法返回一个新的迭代器对象。

```javascript
// 语法
// entries()
const map1 = new Map();

map1.set('name', '韩佩江');
map1.set('age', 25);
console.log(map1.size);// 2

for(const [key, value] of map1.entries()) {
	console.log('key: ', key, ' value: ', value)
}
// key: name value: 韩佩江
// key: age value: 25
```

### Map.prototype\[Symbol.iterator\]()

Map实现了可迭代协议，默认是Map.prototype.entries。

### Map.prototype.forEach()

对每个键值对执行函数

## 修改方法(3个)

### Map.prototype.set()

添加或更新指定键。

- 返回Map对象，因此可以链式调用

### Map.prototype.delete()

delete()方法删除指定的键值对。

如果Map对象中的元素存在并已被删除，返回true；如果元素不存在，返回false。

```javascript
// 语法
// delete(key)
const map1 = new Map();

map1.set('name', '韩佩江');
map1.set('age', 25);
console.log(map1.size);// 2

map1.delete('name')
console.log(map1)// Map(1) { 'age' => 25 }
```

### Map.prototype.clear()

清空map对象，没有返回值。

```javascript
// 语法
// clear()

const map1 = new Map();

map1.set('name', '韩佩江');
map1.set('age', 25);
console.log(map1.size);// 2

map1.clear();
console.log(map1.size);// 0
```

## 查找和判断方法(2个)

### Map.prototype.has()

判断是否存在指定元素

### Map.prototype.get()

Map实例的get()方法返回指定元素。如果不存在返回undefined

```javascript
// 语法
// get(key)

const map1 = new Map();

map1.set('name', '韩佩江');
map1.set('age', 25);
console.log(map1.size);// 2

console.log(map1.get('name'))// 韩佩江
```





















































