# Array函数对象

在JavaScript中，数组不是基本类型，而是有以下核心特征的Array对象：

- JavaScript数组是可调整大小的，并且可以包含不同的数据类型(当不需要这些特性时，可以使用类型化数组)
- 使用非负整数或对应的字符串作为索引，如果超出边界会返回undefined
- JavaScript数组得到索引从0开始
- JavaScript数组复制操作创建浅拷贝(所有JavaScript对象的标准复制操作都会创建浅拷贝，而不是深拷贝)

# 构造函数

Array()构造函数用于创建Array对象。

```javascript
const arr1 = new Array();
const arr2 = new Array('apple');
const arr3 = new Array('apple', 'banana');
const arr4 = new Array(10);

// 调用Array时可以使用或不使用new，两者都会创建一个新的Array对象。
const arr5 = Array();
const arr6 = Array('apple');
const arr7 = Array('apple', 'banana');
const arr8 = Array(20);

```

## elementN

Array构造函数会根据给定的元素创建一个JavaScript数组，但当仅有一个参数且为数字时除外。

## arrayLength

如果传递给Array构造函数的唯一参数是介于[0, 2^32)之间的整数，这将返回一个新的JavaScript数组对象，其length属性为该参数(这意味着一个由arrayLength个空槽组成的数组，而不是实际undefined值)

# Array属性

## 实例属性length

length是Array的实例的属性，表示该数组中元素的个数。该值是一个无符号32位整数，并且其数值总是大于数组最大索引。

数组对象会观察length属性，并自动将length值与数组的内容同步。

# Array方法(35个)

## 创建Array和判断Array(10个方法)

### Array.isArray()

Array.isArray()静态方法用于确定传递的对象是否是数组对象。

判断1个对象是否是数组的3种方法

- Array.isArray()
- arr instanceof Array
- Object.prototype.toString.call(arr) == '[object Array]'

### Array.of() ES6

Array.of()静态方法通过可变数量的参数创建一个新的Array实例。

和Array构造函数的区别是参数是一个数字的时候。

- 不存在原数组
- 返回创建的数组

```javascript
// 语法
// Array.of()
// Array.of(element0)
// Array.of(element0, element1)
// Array.of(element0, element1, ..., elementN)

const arr1 = Array.of(1,2,3,4,5)
console.log(arr1)
```

### Array.from() ES6

Array.from()静态方法类数组对象和从可迭代对象创建一个新的数组对象。

- 不改变原数组
- 返回新创建的数组

```javascript
// 语法
// Array.from(arrayLike)
// Array.from(arrayLike, mapFn)
// Array.from(arrayLike, mapFn, thisArg)

const arr1 = [1,2,3,4,5,6]
const arr2 = Array.from(arr1, x => x*x);
console.log(arr2)// [ 1, 4, 9, 16, 25, 36 ]
```

### Array.prototype.map()

map()方法创建一个新数组，这个新数组是由原数组的每个元素调用一个提供的函数后的返回值组成。

- 不改变原数组
- 返回根据原数组和函数形成的新数组

```javascript
// 语法
// map(callbackFn)
// map(callbackFn, thisArg)

const arr1 = [1, 2, 3, 4, 5, 6, 7];
const arr2 = arr1.map(x => x*x);
console.log(arr2)
```

### Array.prototype.slice()

slice()方法返回一个新的数组对象，这个对象是一个由\[start, end\)决定的数组的浅拷贝。

- 不改变原数组
- 返回新数组

```javascript
// 语法
// slice()
// slice(start)
// slice(start, end)

const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// Expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// Expected output: Array ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));
// Expected output: Array ["duck", "elephant"]

console.log(animals.slice(2, -1));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice());
// Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]

```

### Array.prototype.filter()

filter()方法创建给定数组的一部分的浅拷贝，其包含通过所提供的测试函数

- 不改变原数组
- 返回通过测试的新数组
- 忽略空槽

### Array.prototype.toReversed() ES6

toReversed()方法是reverse()方法对应的复制版本

- 不改变原数组
- 返回反转后的新数组

### Array.prototype.toSorted() ES6

toSorted()方法是sort()方法对应的复制版本

- 不改变原数组
- 返回排序后的新数组

### Array.prototype.toSpliced() ES6

toSpliced()方法是splice()方法对应的复制版本

- 不改变原数组
- 返回删除和插入后的新数组

### Array.prototype.flat()

**`flat()`** 方法创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中。

- 不改变原数组
- 返回将原始数组扁平化的新数组

```ts
flat()
// 默认值是1,Infinity表示无穷,完全展开
flat(depth)

const arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

const arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### Array.prototype.flatMap()

等效于调用map()方法后再调用深度为1的flat方法.

- 不改变原数组
- 先map,再调用深度为1的flat方法.

```ts
// 等效于arr.map(...args).flat(1)
const arr1 = [1, 2, 3, 4];

arr1.map((x) => [x * 2]);
// [[2], [4], [6], [8]]

arr1.flatMap((x) => [x * 2]);
// [2, 4, 6, 8]

// 只有一层被展平
arr1.flatMap((x) => [[x * 2]]);
// [[2], [4], [6], [8]]
```

## 遍历相关(7个)

### Array.prototype.keys() ES6

keys()方法返回一个新的迭代器对象

- 不改变原数组
- 返回索引对应的迭代器

### Array.prototype.values() ES6

values()方法返回一个新的数组迭代器对象。

- 不改变原数组
- 返回新的数组迭代器对象

```javascript
const arr = ['apple', 'banana', 'cccc', 'ddd', 'eee'];
for(const value of arr.values()) {
	console.log(value)
}

Array.prototype.values === Array.prototype[Symbol.iterator]// true
```

Array.prototype.values()是Array.prototype\[Symbol.iterator\]\(\)的默认实现。

也就是说，for(const value of arr) ，其实是for(const value of arr\[Symbol.iterator\]\(\))，其实是for(const value of arr.values\(\))。

### Array.prototype\[Symbol.iterator\]\(\) ES6

Array实例的\[Symbol.iterator\]()方法实现了迭代协议，允许数组被大多数期望可迭代对象的语法中使用，例如**展开语法**和**for...of**循环。它返回一个数组迭代器对象，该对象会产生数组中每个索引的值。

该属性的初始值与**Array.prototype.values**属性的初始值是相同的函数对象。

- 不改变原数组
- 返回数组迭代器对象

```javascript
const array1 = ['a', 'b', 'c'];
const iterator1 = array1[Symbol.iterator]();

for (const value of iterator1) {
	console.log(value);
}

// Expected output: "a"
// Expected output: "b"
// Expected output: "c"

for(const value of array1[Symbol.iterator]()) {
	console.log(value)
}

for(const value of array1) {
	console.log(value)
}

```

我们不需要直接调用此方法，这个方法的存在使数组可迭代，for...of循环这样的语法会自动调用此方法以获得要遍历的迭代器。

也可以手动执行迭代器。

```javascript
const arr = ['a', 'b', 'c', 'd', 'e'];
const arrIterator = arr[Symbol.iterator]();

console.log(arrIterator.next().value);// a
console.log(arrIterator.next().value);// b
console.log(arrIterator.next().value);// c
console.log(arrIterator.next().value);// d
console.log(arrIterator.next().value);// e
console.log(arrIterator.next().value);// undefined

```



### Array.prototype.entries() ES6

entries()方法返回一个新的数组迭代器对象，该对象包含数组中每个索引的键值对。

- 不改变原数组
- 返回一个新的数组迭代器对象，包含数组中每个索引的键值对

```javascript
// 语法
// entries()

const array1 = ['a', 'b', 'c'];

for(const [index,value] of array1.entries()) {
	console.log('index: ' + index + ', value: ' + value);
}
// index: 0, value: a
// index: 1, value: b
// index: 2, value: c
```

### Array.prototype.forEach()

forEach()方法对数组的每个元素执行一次给定的函数.

`forEach()` 不会改变其调用的数组，但是，作为 `callbackFn` 的函数可以更改数组。

### Array.prototype.reduce()

reduce()方法对数组中的每个元素执行一个提供的reducer函数，每一个运行reducer会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。

- 不改变原数组
- 返回最终计算结果

```javascript
// 语法
// reduce(callbackFn)
// reduce(callbackFn, initialValue)

const arr = [1,2,3,4,5,6,7,8,9,10]
const sum = arr.reduce((sum, item) => {
	return sum + item;
}, 0);
console.log(sum)// 55
```

第一次执行回调函数时，不存在"上一次的计算结果"。如果需要回调函数从数组索引为0的元素开始执行，则需要传递初始值；否则，数组索引为0的元素将被用作初始值，迭代器将从**第二个元素**开始执行。

### Array.prototype.reduceRight()

和reduce()方法类似，只是迭代顺序相反。

## 修改(8个)

### Array.prototype.fill() ES6

fill()方法用一个固定值填充一个数组的全部元素。

- 改变原数组
- 返回改变后的原数组

```javascript
// 语法
// fill(value)
// fill(value, start)
// fill(value, start, end)

const array1 = [1, 2, 3, 4];

// Fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4));
// Expected output: Array [1, 2, 0, 0]

// Fill with 5 from position 1
console.log(array1.fill(5, 1));
// Expected output: Array [1, 5, 5, 5]

console.log(array1.fill(6));
// Expected output: Array [6, 6, 6, 6]

```

### Array.prototype.reverse()

reverse()方法反转数组的元素

- 改变原数组
- 返回改变后的原数组



### Array.prototype.sort()

sort()方法对元素进行排序

- 改变原数组
- 返回排序后的数组

```javascript
// 语法
// sort
// sort(compareFn)

const arr = [1,32,-1,100,4334,-10000,-43];
arr.sort((a, b) => (a - b));
console.log(arr)// [-10000, -43, -1, 1, 32, 100, 4334]
```

默认比较方法是将元素转换为字符串，根据Unicode码进行排序。

| compareFn(a, b)返回值 | 排序顺序           |
| --------------------- | ------------------ |
| >0                    | a在b后，[b, a]     |
| <0                    | a在b前，[a, b]     |
| ===0                  | 保持a，b原来的顺序 |

为了确保正确的排序行为，比较函数应具有以下5个属性

- 纯函数：比较函数不会改变被比较的对象或任何外部状态
- 稳定性：比较函数对应相同的输入，输出一定相同
- 自反性：compareFn(a, a) === 0
- 反对称性：compareFn(a, b) 和compareFn(b, a)必须都是0或者具有相反的符号
- 传递性：如果compareFn(a, b)和compareFn(b, c)都是正数，0，或负数，则compareFn(a, c)的符合与前面2个相同

V8引擎是一款由谷歌开发的JavaScript引擎，它被用于执行JavaScript代码。在V8引擎中，`Array.prototype.sort`方法的实现使用了一种基于TimSort算法的混合排序（hybrid sorting）方法。

TimSort算法是由Tim Peters在Python语言的标准库中实现的一种排序算法，它结合了归并排序（Merge Sort）和插入排序（Insertion Sort）的优点，以便在各种不同类型的数据集上都能有较好的性能表现。TimSort首先将待排序的数组划分成若干个小的子数组，然后对每个子数组进行排序，最后再合并这些子数组。

在V8引擎中，`Array.prototype.sort`方法会根据被排序数组的长度和元素类型等因素来选择最佳的排序策略。对于小型数组或具有少量混合类型元素的数组，V8可能会选择插入排序，因为插入排序在小型数据集上表现良好。对于较大的数组或者数据集类型单一的数组，V8则会选择TimSort算法进行排序，因为TimSort在处理大型数据集时有着良好的性能，并且在处理有序数组或者部分有序数组时，也能有较好的表现。

总之，V8引擎的`Array.prototype.sort`方法通过选择合适的排序算法，如TimSort，来实现对数组的高效排序。

### Array.prototype.splice()

splice()方法通过移除或替换已存在的元素改变数组内容

- 改变原数组
- k返回被删除的数组

```javascript
// 语法
// splice(start)
// splice(start, deleteCount)
// splice(start, deleteCount, item1)
// splice(start, deleteCount, item1, item2, ..., itemN)

const arr = ['apple', 'banana', 'cccc', 'ddd', 'eee'];

arr.splice(3, 1, 'add_1');
console.log(arr)// ['apple', 'banana', 'cccc', 'add_1', 'eee']

arr.splice()
console.log(arr)// ['apple', 'banana', 'cccc', 'add_1', 'eee']

arr.splice(0, 3)
console.log(arr)// [add_1', 'eee']
```

### Array.prototype.push()

push()方法将指定的元素添加到数组的末尾，返回新的数组长度.

- 改变原数组
- 返回新数组的长度

```javascript
// 语法
// push()
// push(element0)
// push(element0, element1)
// push(element0, element1, ..., elementN)
```

### Array.prototype.pop()

pop()方法从数组中删除最后一个元素，并返回该元素的值。

- 会改变原数组
- 返回被删除的之前的最后一个元素的值，当数组为空时返回undefined

### Array.prototype.shift()

shift()方法从数组中删除第一个元素，并返回被删除的元素

- 改变原数组
- 返回被删除的元素

### Array.prototype.unshift()

unshift()方法向数组中添加一个元素，返回数组的长度

- 改变原数组
- 返回数组的新长度



## 在数组中查找的相关方法(6个)

### Array.prototype.indexOf()

indexOf()方法返回数组第一个出现给定元素的下标，不存在返回-1、

- 不改变原数组
- 返回第一此出现给定元素的索引，不存在返回-1

```javascript
// 语法
// indexOf(searchElement)
// indexOf(searchElement, fromIndex)
```

indexOf()使用**===**进行比较

### Array.prototype.lastIndexOf()

lastIndexOf()方法返回数组中给定元素最后一次出现的索引，不存在返回-1

- 不改变原数组
- 从fromIndex开始向前搜索，返回fromIndex之前最后出现的索引，没有返回-1

```javascript
// 语法
// lastIndexOf(searchElement)
// lastIndexOf(searchElement, fromIndex)
```

lastIndexOf()使用**===**进行比较

### Array.prototype.find() ES6

find()方法返回数组中满足提供的测试函数的第一个元素的值，否则返回undefined

- 不改变原数组
- 返回符合测试函数的第一个元素值,找不到返回undefined

在数组中查找的推荐：

- 如果需要查找某个值的索引，使用indexOf();

### Array.prototype.findLast() ES6

findLast()方法反向迭代数组，返回满足测试函数的第一个元素的值，没有返回undefined

- 不改变原数组
- 返回满足测试函数的最后一个元素值，否则返回undefined

### Array.prototype.findIndex() ES6

findIndex返回符合测试函数的第一个元素的索引，找不到返回-1

- 不改变原数组
- 返回符合测试函数的第一个元素的下标，找不到返回-1

### Array.prototype.findLastIndex() ES6

返回符合测试函数的最后一个元素的索引

- 不改变原数组
- 返回满足测试函数的最后一个元素的索引，没有的话返回-1

## 在数组中判断的相关方法(3个)

### Array.prototype.includes() ES6

includes()方法用来判断一个数组是否包含一个指定的值

- 不改变原数组
- 返回true或false

```javascript
// 语法
// includes(searchElement)
// includes(searchElement, fromIndex)

const array1 = [1, 2, 3];

console.log(array1.includes(2));
// Expected output: true

const pets = ['cat', 'dog', 'bat'];

console.log(pets.includes('cat'));
// Expected output: true

console.log(pets.includes('at'));
// Expected output: false

```

includes()使用**零值相等**算法进行比较

### Array.prototype.some()

some()方法测试数组中是否存在元素满足测试函数。

- 不改变原数组
- 返回true或false

### Array.prototype.every()

**every()**方法测试一个数组内的所有元素是否都能通过指定函数的测试。

- 不改变原数组
- 返回一个布尔值，代表是否所有元素都通过测试
- 忽略空槽

```javascript
// 语法
// every(callbackFn, thisArg)
const arr = [2,6,238];
const allIsEven = arr.every((value) => {
	return value%2 === 0
})
console.log(allIsEven)
```

every()方法是一个迭代方法，它为数组中的每一个元素调用一次指定的callbackFn函数，直到返回一个false值。

## 合并数组(1个)

### Array.prototype.join()

join()方法将一个数组的所有元素连接成一个字符串并返回这个字符串

- 不改变原数组
- 返回数组对应的字符串
- 将空槽视为undefined

```javascript
// join()
// join(separator)

const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());
// Expected output: "Fire,Air,Water"

console.log(elements.join(''));
// Expected output: "FireAirWater"

console.log(elements.join('-'));
// Expected output: "Fire-Air-Water"

```

# 常见问题

## 如何判断一个对象是否为数组

```js
// 1. 使用Array.isArray();
// 2. 使用obj instanceof Array
// 3. 使用Object.prototype.toString.call(obj) === '[object Array]'

const arr = [1,3,4]
const obj = {name:'小明'}

// 1. 使用Array.isArray();
Array.isArray(arr)// true
Array.isArray(obj)// false

// 2. 使用obj instanceof Array
arr instanceof Array// true
obj instanceof Array// false

// 3. 使用Object.prototype.toString.call(obj) === '[object Array]'
Object.prototype.toString.call(arr) === '[object Array]'// true
Object.prototype.toString.call(obj) === '[object Array]'// false
```

## 如何将类数组转换为真实数组

```js
// 1. Array.from
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
const arr = Array.from(arrayLike); // ['a', 'b']

// 2. 扩展运算符 ...
const nodeList = document.querySelectorAll('p');
const arr = [...nodeList]; // 将 NodeList 转换为数组

// 3. Array.prototype.slice
function example() {
  const args = Array.prototype.slice.call(arguments);
  console.log(args); // 将 arguments 转换为数组
}
example(1, 2, 3); // [1, 2, 3]

// 4. Array.prototype.concat
const arrayLike = { 0: 'x', 1: 'y', length: 2 };
const arr = [].concat(arrayLike); // ['x', 'y']
```

# Array中ES6新增的部分

## 扩展运算符

将一个数组展开，是函数剩余参数的逆运算。

































