# JavaScript面试题

## JavaScript是什么?

JavaScript最初被创建的目的是**使网页更生动**.,JavaScript是**基于原型的面向对象**的单线程的解释型的动态语言,主要用于为网站增加交互.

## JavaScript引擎是如何工作的?

1. 引入读取脚本
2. 引擎将脚本编译为机器语言
3. 机器代码被执行

## 如何插入到HTML中

我们可以使用script标签将JavaScript程序插入到HTML文档的任何位置.

script标签包裹了JavaScript代码,当浏览器遇到script标签,代码会自动执行.

- type='text/javascript' type属性默认值,可以省略
- type='module' 表明这是一个ES6引入的模块

## 什么是外部脚本?

如果我们有大量的JavaScript代码,我们可以将它放入一个单独的文件.

使用src属性指向js文件

```html
<script src="./index.js"></script>
```

如果设置了src特性.script标签内容会被忽略.

## 关于分号

大部分情况下可以省略,引擎会自动添加,但有时不可省略.

## 严格模式

ES5引入了严格模式,需要使用"use strict"激活.

"use strict"可以放在js文件头部,或函数头部.必须位于第一行.

在type='module'的js代码中,自动使用"use strict".

浏览器控制台默认是不启动use strict的.

|                      | 非严格模式      | 严格模式  |
| -------------------- | --------------- | --------- |
| 没有定义的变量被赋值 | 可以,自动创建   | 语法错误  |
| this                 | 全局对象,window | undefined |

## JavaScript风格

- Google JavaScript
- Airbnb JavaScript

使用ESLint来约束.

## 什么是头等函数?

当一门编程语言的函数可以被当作变量一样用时，则这门语言拥有头等函数。例如，在JavaScript中，函数可以被当做参数传递给其他函数，可以作为另一个函数的返回值，还可以被赋值给一个变量。

## 什么是匿名函数?

```ts
// 匿名函数，函数本身没有具体的名称
const foo = function () {
	console.log('foobar')
}
// 用变量名调用它,需要加上分号，否则js引擎会将后面的括号作为参数传递给foo(),所以最好加上;
foo();

// 匿名函数可以立即调用
(function() {
	console.log('This is an immediately invoked function expression');
})();


// 正常函数
function foo2() {
	console.log('foobar2')
}
foo2()
```

## 什么是高阶函数?

一个返回**另外一个函数**的函数被称为高阶函数。

## 什么是回调函数?

我们把一个函数作为参数传递给另外一个函数，那么我们就称这个函数为回调函数.

```ts
function sayHello() {
  return 'Hello,'
}

function greeting(helloMessage, name) {
  console.log(helloMessage() + name)
}
greeting(sayHello, 'JavaScript')
```

sayHello函数就是一个回调函数。

## 什么是工厂函数?

一个返回对象的普通函数.

## JavaScript数据类型有哪些

有**8种**数据类型，1种对象类型和7种基本类型

- boolean 有2个值，true，false
- number 数字，整数或浮点数
- bigint(ES2020新增) 大整数，const t1 = 123n,将n附加到整数末尾来创建
- string 字符串，字符串是不可变的
- symbol(ES6新增) 枚举值，不可变，不可比较
- null 空对象，关键字，注意，typeof null为object，但null是null类型
- undefined 关键字，var，let只声明，但未赋值。const必须赋值，否则语法报错。不推荐显式赋值为undefined.

JavaScript为动态类型语言,定义后可以更改变量类型.

基本数据类型储存在栈中，对象存储在堆中。

在JavaScript做数学运算是安全的,最坏得到NaN,但不会代码报错.

双引号和单引号都是简单引用.反引号是功能扩展引号,允许我们将变量和表达式包装在${}中.

const obj = {name: 'hpj'},obj本身存在栈中，内容为{name: 'hpj'}对象在堆中的地址。

```js
const t1 = Symbol()
const t2 = Symbol()
console.log(t1 == t2)// false

// 判断是否为对象
function isObject(obj) {
  return (typeof obj === 'object' && obj !== null)
}
```

NaN全局属性，表示一个非数字的值，是number类型；NaN不等于任何其它值，包括另一个NaN。

可以使用Number.isNaN()判读传入的值是否为NaN.

访问基本类型的方法时,会自动将值装入包装对象中.即**自动装箱**.

函数的本质是对象.

## typeof和instanceof的区别

我们可以使用typeof判断变量的类型.

```js
console.log(typeof null)// object
console.log(typeof undefined)// undefined
console.log(typeof true)// boolean
console.log(typeof 1)// number
console.log(typeof 1n)// bigint
console.log(typeof '')// string
console.log(typeof Symbol())// symbol
console.log(typeof function () {})// function
```

typeof null为object是一个JavaScript错误,为了兼容性而保存了下来,正确应该为null类型.

function没有一个特殊的function类型,function也是对象类型,但typeof可以识别并输出function.

- typeof可以判断基本类型,对象只能识别object和function
- instanceof判断对象.

## JavaScript如何定义变量,什么是变量提升?

- **var**(过时)
- **let** ES6引入,变量
- **const** ES6引入,常量,通常约定为大写.

变量名称仅包含字母,数字,和'$', '_' 两个符号.

首字符不可以为数字.

也可以是其他语言,比如汉字,但不推荐.

变量名不可以与JavaScript内置保留字重复.

在JavaScript中,变量提升是指在代码执行之前,**变量声明和函数声明**会被提升到其**所在作用域**的顶部,但实际赋值操作并不会提升.

- var和function会提升.提前访问var定义的变量为undefined
- let,const也会提升,但访问会报错,无法访问,存在暂时性死区.
- 函数表达式会被提升,但访问为undefined,因为它的赋值操作类似于普通变量.

## JavaScript运算符

**: 求幂

## JavaScript逻辑运算符

JavaScript有4个逻辑运算符

- || 短路求值,返回第一个真值或最后一个值
- &&
- !
- ?? 空值合并运算符,第一个参数不是null或undefined即可.

```js
let a = 0 || 1// 1
let b = 0 ?? 1// 0
console.log(a, b)
```

## JavaScript运算符优先级

!x, await x,

== 和 === 优先级高,

位运算符 &

位运算符 |

&& 的优先级

|| 的优先级

三元运算符

## 什么是对象,如何创建?

对象是一个包含数据和方法的集合。

```ts
// 1. 通过new Object()
const obj1 = new Object()

// 2. 直接通过{}
const obj2 = {}
```

?. 安全访问属性

```js
const obj = {
  name: 'hpj'
}

obj?.name
obj?.['name']
obj.say?.()
```

根据规范,只有2种原始类型可以用作对象属性键.

- 字符串
- symbol: 不参加for...in循环,也不参加Object.keys().

```js
let id = Symbol('id')

// 读取或创建全局symbol
Symbol.for(key)
```

symbol是使用Symbol()创建的.

Symbol.iterator

```js
let str = 'hello'
str.test = 5// 无效操作,会忽略
console.log(str.test)// undefined
```

剩余参数...

展开运算...

互为逆运算.

2种属性

- 数据属性: 常规
- 访问器属性: getter/setter,由get,set表示.

## Function全局内置对象和Object全局内置对象的关系

- Function对象是Object对象的实例
- Object对象是Function对象的实例

```ts
console.log(Function instanceof Object)// true
console.log(Object instanceof Function)// true
```

## JavaScript的原型和原型链

```js
function Foo(){};
const f1 = new Foo();
```

![](.\img\js原型和原型链.png)

以上代码表示创建了一个构造函数Foo(),并用**new**关键字实例化该构造函数得到一个实例化对象f1

### \_\_proto\_\_

首先，我们需要知道，\_\_proto\_\_和constructor属性是对象独有的，prototype是函数独有的，但JavaScript中函数也是对象，所以函数也有\_\_proto\_\_和constructor属性

![](.\img\__proto__分析.png)

第一，这里我们仅留下\_\_proto\_\_属性，它是对象独有的，可以看到\_\_proto\_\_属性都是由一个对象指向一个对象，即指向他们的原型对象(父对象)，当访问对象的属性时，先查找对象本身是否存在，如果不存在，则去对象的\_\_proto\_\_指向的原型对象上找，以此类推，直到null。通过一个对象的\_\_proto\_\_属性连接的一条链，我们称之为原型链。

我们平时调用的字符串方法，数组方法，对象方法，函数方法都是靠原型链找到的。

### prototype

![](.\img\prototype.png)

第二，我们看prototype属性：

任何函数在创建的时候，会默认同时创建该函数的prototype指向的对象。

prototype属性是函数对象的属性，指向该函数对应的原型，

### constructor

最后，我们来看constructor属性：

![](.\img\constructor.png)

constructor属性也是对象才拥有的，从一个对象指向一个函数，就是一个原型对象指向对应的构造函数。constructor属性的终点是Function对象。

![](.\img\constructor2.png)

![](.\img\constructor3.png)



### 总结

- \_\_proto\_\_和constructor属性是**对象**独有的
- prototype属性是**函数对象**独有的，因为函数对象也是对象，所以函数对象也有\_\_proto\_\_和constructor
- \_\_proto\_\_属性指向对象的原型，也就是构造该对象的构造函数的prototype属性指向的对象，读取该对象属性时，会从对象本身和\_\_proto\_\_指向的原型链中读取，直到null为止。
- prototype属性指向该构造函数的原型
- constructor：构造函数会自动生成它对应的prototype指向的对象，该prototype指向的对象的constructor属性自动指向构造函数本身,所有函数对象最终的构造函数是Function.

## 调用Function时使用new和不使用new的区别

使用new,将函数作为构造函数执行

不使用new,普通函数执行.

## 手写new的实现

```ts
// 自己实现new关键字
function myNew(constructorFunc, ...args) {
	// 1. 创建1个空对象,原型为构造函数的prototype属性
	const newInstance = Object.create(constructorFunc.prototype)
	// 2. 调用构造函数,并将this绑定到新创建的对象上
	const result = constructorFunc.apply(newInstance, args)
	// 3. 如果result为对象,则返回result,否则返回newInstance
	return result instanceof Object ? result : newInstance
}
```

## getter和setter是什么?

可以定义一个非普通属性,此时不能同时存在同名普通属性.

```ts
const person = {
  firstName: 'John',
  lastName: 'Doe',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  }
};

console.log(person.fullName); // "John Doe"

```

也可以通过Object.defineProperty定义.

```ts
const person = {
  firstName: 'John',
  lastName: 'Doe'
};

Object.defineProperty(person, 'fullName', {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  set(name) {
    [this.firstName, this.lastName] = name.split(' ');
  }
});

console.log(person.fullName); // "John Doe"
person.fullName = 'Jane Smith';
console.log(person.firstName); // "Jane"
console.log(person.lastName);  // "Smith"
```

## JavaScript如何定义循环

- for()

- for in 遍历对象的原型链，获取对象的**键名**。

- for of 遍历可迭代对象，获得**值**.

**`for...in`** 语句迭代一个对象的所有[可枚举字符串属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)（除 [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 以外），包括继承的可枚举属性。

```ts
const object = { a: 1, b: 2, c: 3 };

for (const property in object) {
  console.log(`${property}: ${object[property]}`);
}

// Expected output:
// "a: 1"
// "b: 2"
// "c: 3"

for (variable in object)
  statement
```

## 数据类型检测的方式有哪些？

- typeof
- instanceof
- 对象的constructor
- Object.prototype.toString.call()

## null和undefined的区别？

undefined表示未定义，不是保留字，可以赋值。可以使用void 0获取安全的undefined值。

null表示空对象。

```ts
// obj一定存在的前提下,判断obj.age不是undefined
obj.age !== undefined
// obj一定存在的情况下,判断obj.age不是undefined,也不是null
obj.age != null
// obj一定存在的情况下,xxx不一定存在,判断obj.xxx.age不是undefined,也不是null
obj.xxx?.age != null
```

??操作符也是这个作用.

总结:

- 在Vue组件或HTML元素的属性设置上使用**!=**,可以使用三元运算符
- 在{{}}中使用 **??** ,为取值操作,不是三元操作符的?,不要混淆.

## ==，===，Object.is()

==：如果类型不一致，先转换，后比较

===：如果类型不一致，直接返回false。-0和+0相等，NaN和NaN不相等

Object.is()：和===基本一致，但有不一样的地方，-0和+0不相等，两个NaN相等

## 什么是JavaScript中的包装类型？

在调用基本类型的属性或方法时，JavaScript自动将基本类型的值转换为对象。

使用Object显示转为对象。

调用对象的valueOf()获取原始值。

```js
let ok = new Boolean(false)
if (!ok) {
  console.log('不OK')
}
```

没有输出，因为ok为对象，始终为true，if内部始终为false。

## 为什么会有BigInt的提案？

大数计算有问题。

## 如何判断1个对象是空对象？

- Object.keys()
- JSON.stringify()

## 箭头函数可以new吗

不可以。箭头函数相当于其它语言的lambda表达式.

## 箭头函数内部的this指向哪里？

箭头函数没有自己的作用域，其this指向所在的作用域。

```js
// ES6
function A() {
  const add = () => {
    this.a = 1
  }
}

// ES5
function A() {
  var _this = this;
  var add = function add() {
    _this.a = 1;
  };
}
```

## 箭头函数的简便返回值

如果非对象字面量,可直接写;对象字面量需要加()

```ts
const f1 = () => false
const f2 = () => []
const f3 = () => 1
const f4 = () => null

const f5 = () => ({
  name: '韩佩江',
  age: 25,
})
```



## Proxy是什么？

Proxy是ES6引入新的全局内置对象，可以创建一个对象的代理，定义拦截方法。

可以监听整个对象的任何操作。

## 正则表达式

使用一个正则表达式字面量，其由包含在斜杠之间的模式组成，

```js
// \ 转义字符

// ^ 匹配输入的开始
// $ 匹配输入的结束

// ? 匹配前一个表达式0次或1次，等效于{0,1}
// * 匹配前一个表达式0次或多次，等效于{0,}
// + 匹配前一个表达式1次或多次，等效于{1,}
// {n} 匹配了前面一个字符刚好出现了 n 次
// {n,} 匹配前一个字符至少出现了 n 次
// {n,m} 匹配前面的字符至少 n 次，最多 m 次

// . 默认匹配除换行符之外的任何单个字符
// x|y 匹配x或y
// [xyz] [0-9] 一个字符集合
// [^xyz] [^0-9] 一个反向字符集
// \d 等价于[0-9]
// \D 等价于[^0-9]
// \w 等价于[A-Za-z0-9_]
// \W 等价于[^A-Za-z0-9_]

// ^匹配开头
const reg1 = /^158/
reg1.test('15800001111')// true
reg1.test('18600001111')// false

// $匹配结尾
const reg1 = /江$/
reg1.test('韩佩江')
reg1.test('江思雨')

// {n,m}匹配次数，*等效于{0,}
// []表示字符集合,-指定范围
const reg1 = /^[0-9]{11}$/
reg1.test('110')// false
reg1.test('6066566')// false
reg1.test('15800001111')// true
```

## 什么是尾调用？

尾调用是指函数的最后一个操作时调用一个函数，并且直接返回函数的返回值。

```js
// 非尾递归版本
function factorial(n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1); // 非尾调用，因为需要乘以 n
    }
}

// 尾递归版本
function factorialTail(n, acc = 1) {
    if (n <= 1) {
        return acc;
    } else {
        return factorialTail(n - 1, acc * n); // 尾调用，直接返回递归调用的结果
    }
}
```

尾调用可以被V8引擎优化为循环，避免堆栈溢出。

## 作用域，作用域链

作用域分类：

- **全局作用域**：当程序开始执行时创建，可以在任何作用域中访问，this指向window
- **模块作用域**：ES6引入,每个js文件作为module使用时，每个文件一个自己的作用域,其它文件不可见。
- **函数作用域**：仅存在于定义他们的函数体内，并且有效期为函数执行期，函数执行完毕，局部作用域会被释放。也就是说，每次调用函数时都会产生不同的局部作用域。仅函数内部可以访问。
- **块作用域**：默认不支持，ES6引入的**let**， **const**关键字声明的变量支持。

作用域包含1个**词法环境**对象,1个**词法环境**对象包含：

- **环境记录**：保存在当前作用域中声明的变量和函数。静态确定。包含**this上下文**属性,执行调用该函数的对象,确定`this`的值。动态确定。**函数的调用方式**决定了this的值(运行时绑定)，上下文是基于对象的。
- **外部词法环境**：指向父级作用域的词法环境对象。静态确定.



**作用域链**：作用域的词法环境对象保存着外部词法环境对象的引用，直到全局词法环境，形成一条链称为作用域链。JavaScript解释器访问一个变量时，会先从当前作用域对应的词法环境对象的**环境记录**查找。如果找不到，则顺着当前作用域的**词法环境**对象保存的**外部词法环境**引用查找，直到全局作用域。

**执行上下文** 是 **作用域**的别名。

作用域可以被封装和保存。

单独使用{}可以创建块级作用域.

```ts
function f() {
  let a = 1;
  { 
    let b = 2; 
  }
  let c = 3;
}
```

```ts
function FetchUrl() {
  this.beforeFetchHookSet = new Set()
  // 普通函数定义,this取决于调用对象,动态绑定.
  // 需要灵活使用this时推荐
  this.fetchHook = function () {
    for (const beforeFetchHook of this.beforeFetchHookSet) {
      beforeFetchHook()
    }
  }
}

function FetchUrl2() {
  this.beforeFetchHookSet = new Set()
  // 箭头函数定义,箭头函数没有自己的this,其内部this始终指向定义时的this,静态确定.
  // this不需要灵活使用,定义内部方法时推荐
  this.fetchHook = () => {
    for (const beforeFetchHook of this.beforeFetchHookSet) {
      beforeFetchHook()
    }
  }
}
```

## 谷歌浏览器作用域汇总

- 全局: 全局作用域,代表window对象
- 脚本: 全局作用域,当前执行的js文件
- 模块: 模块作用域,通过type='module'使用的js文件
- 闭包: 函数作用域
- 本地: 函数作用域
- 块级: 块作用域

## this对象

this是作用域的一个属性，指向调用这个方法的对象，运行时确定。

- 函数调用：指向window
- 方法调用：指向调用对象
- 构造器内部调用：指向新创建的对象
- apply，call，bind可以改变this指向

**globalThis**是ES2020引入的一个全局对象的标准引用

- 浏览器:window
- Node: global
- Web Workers: self

## 闭包

一个函数返回另一个函数，该函数称为工厂函数，返回的函数称为闭包，它保持对外部函数的局部变量、参数和内部函数声明，作用域链的访问。

因为**闭包对应的作用域没有被释放**，闭包的作用域的词法环境保存着对应的作用域链，因此可以访问对应的作用域链上定义的变量。

- 作用域链是一个指向外部函数作用域的指针列表，它保证了内部函数能够访问外部函数的作用域。
- 创建函数的私有变量
- 柯里化函数就是函数工厂，返回闭包
- 非必要不使用，因为闭包内存消耗大

## 如何创建微任务？

- queueMicrotask()
- Promise.resolve().then(fn)

```ts
Promise.resolve().then(() => {
    console.log('This is a microtask');
})

queueMicrotask(() => {
    console.log('This is a microtask created with queueMicrotask');
})
```

## 什么情况会产生内存泄漏？

- 闭包

  ```js
  function createClosure() {
      let localVar = 'some data';
      return function() {
          // 使用 localVar
      };
  }
  let closureFunc = createClosure();
  // closureFunc 持有了 localVar 的引用，如果不再需要，应该释放 closureFunc
  ```

- 未释放不再使用的引用

  ```js
  let element = document.getElementById('someElement');
  let obj = {
      domElement: element,
      // 其他属性和方法
  };
  // 如果不再需要 obj，应该将 obj 置为 null 或者手动解除 domElement 的引用
  ```

- 计时器

  ```js
  let obj = {
      // 其他属性和方法
      init: function() {
          this.timer = setInterval(() => {
              // 定时器回调
          }, 1000);
      },
      // 其他方法
      destroy: function() {
          clearInterval(this.timer); // 清除定时器
      }
  };
  obj.init();
  // 如果不再需要 obj，应该调用 obj.destroy() 清除定时器
  ```

- 循环引用

  ```js
  let obj1 = {};
  let obj2 = {};
  obj1.ref = obj2;
  obj2.ref = obj1;
  // 如果不再需要 obj1 和 obj2，应该解除它们之间的引用
  obj1 = null;
  obj2 = null;
  ```

## 手写Promise

```ts
function MyPromise(executor) {
	// 3个状态,pending,fulfilled,rejected
	this.state = 'pending'
	// 成功的值
	this.value = undefined
	// 失败的原因
	this.reason = undefined
	// 成功回调
	this.onFulfilledCallbacks = []
	// 失败回调
	this.onRejectedCallbacks = []
	
	// 成功时调用的函数
	const resolve = value => {
		if (!(this.state === 'pending')) {
			return
		}
		
		this.state = 'fulfilled'
		this.value = value
		queueMicrotask(() => {
			this.onFulfilledCallbacks.forEach(cb => cb(value))
		})
	}
	
	// 失败时的回调
	const reject = reason => {
		if (!(this.state === 'pending')) {
			return
		}
		
		this.state = 'rejected'
		this.reason = reason
		queueMicrotask(() => {
			this.onRejectedCallbacks.forEach(cb => cb(reason))
		})
	}
	
	try {
		executor(resolve, reject)
	} catch (error) {
		reject(error)
	}
}

// then里面的方法必须异步执行
// 用来为Promise对象注册或执行回调函数
MyPromise.prototype.then = function (onFulfilledCallback, onRejectedCallback) {
	// 处理参数不是函数的情况
	onFulfilledCallback = typeof onFulfilledCallback === 'function' ? onFulfilledCallback : value => value
	onRejectedCallback = typeof onRejectedCallback === 'function' ? onRejectedCallback : reason => {throw reason}
	
	if (this.state === 'pending') {
		// 状态1 pending
		this.onFulfilledCallbacks.push(onFulfilledCallback)
		this.onRejectedCallbacks.push(onRejectedCallback)
	} else if (this.state === 'fulfilled') {
		// 状态2 fulfilled
		console.log('sssssss')
		queueMicrotask(() => {
			onFulfilledCallback(this.value)
		})
	} else if (this.state === 'rejected') {
		// 状态3 rejected
		queueMicrotask(() => {
			onRejectedCallback(this.reason)
		})
	}
}

// catch方法是then的封装
MyPromise.prototype.catch = function (onRejectedCallback) {
  this.then(undefined, onRejectedCallback)
}

// finally方法也是then的封装
MyPromise.prototype.finally = function (onFinallyCallback) {
  this.then(onFinallyCallback, onFinallyCallback)
}

MyPromise.resolve = function (value) {
	return new MyPromise((resolve, reject) => {
		resolve(value)
	})
}

MyPromise.reject = function (reason) {
	return new MyPromise((resolve, reject) => {
		reject(reason)
	})
}

// 参数为可迭代对象,返回一个新Promise.
// 当可迭代对象的所有Promise都成功时,返回的Promise会成功,并得到一个包含所有成功值的数组.
// 如果任何Promise失败,则返回的Promise失败,并得到第一个失败的原因.
MyPromise.all = function (iteratorObject) {
  
}

// 和all方法类似,不同是所有promise都会被完整执行
MyPromise.allSettled = function (iteratorObject) {
  
}

// 和all类似,不同是只要有1个成功即可,返回成功的值;否则全部失败,返回包含失败原因的数组
MyPromise.any = function (iteratorObject) {
  
}

// 只要有1个Promise成功或拒绝,返回的Promise便会成功或拒绝.
MyPromise.race = function (iteratorObject) {
  
}


// 测试代码
// const p2 = new MyPromise((resolve, reject) => {
// 	console.log('进入Promise')
// 	setTimeout(() => {
// 		resolve(2)
// 	}, 2000)
// })
//
// p2.then(value => {
// 	console.log('ok')
// }, reason => {
// 	console.log('error')
// })


MyPromise.resolve().then(() => {
	console.log('微任务执行')
})

console.log('end')
```

解决了传递代码回调地狱的问题。

Promise**构造函数立即执行**，Promise对象的.**then()定义的函数作为微任务**执行。

3个状态：

- pending（进行中）
- fulfilled（已完成）
- rejected（已拒绝）



特点：

- 一旦从pending变为其它状态，就永远不能再次更改状态。
- 对象的状态不受外界影响。
- 已经确定状态的then或catch会执行
- 无法取消promise
- 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部

```js
Promise.resolve('hello')

// 等效
new Promise(resolve => resolve('hello'))
```

**then()需要返回一个Promise对象**,如果返回非Promise对象,会被自动包装为Promise对象.

## async，await

是语法糖，可以像编写同步代码似的编写异步代码。

**async返回一个Promise对象**，如果return一个直接量，async会使用Promise.resolve()封装成Promise对象。

错误处理友好，可以使用try...catch，无需使用Promise.catch()

```ts
async function getData() {
	const result = await fetch('http://localhost:8080/search', {
		method: 'GET'
	})
	if (result.ok) {
		const data = await result.json()
		console.log(data)
	}
}

getData()

function getData2() {
	fetch('http://localhost:8080/search', {
		method: 'GET'
	})
		.then(result => {
			if (result.ok) {
				return result.json(); // 返回解析后的 JSON 数据
			}
			throw new Error('Network response was not ok.'); // 处理非200响应
		})
		.then(data => {
			console.log(data); // 打印数据
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error); // 处理错误
		});
}

getData();
```



## ['1', '2', '3'].map(parseInt)的输出是？

```js
['1', '2', '3'].map(parseInt)// [1, NaN, NaN]

['1', '2', '3'].map(str => parseInt(str))// [1, 2, 3]
```

## setTimeout和setInternal

setTimeout中的函数为任务。

setTimeout

setInternal

不在JavaScript规范中,但大部分浏览器实现了.

## 代码输出

```js
var a = {
	n: 1
}
var b = a

a.x = a = {
	n: 2
}

console.log(a.x)// undefined
console.log(b.x)// {n: 2}
```

## 如何将ES6代码转为ES5？

- Babel
- polyfill

## 为什么forEach的性能差？

参数为函数，会创建n个函数，有额外的函数调用栈。

## Object.defineProperty和Proxy的区别

Object.defineProperty
不能监听到数组length属性的变化；
不能监听对象的添加；
只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历。
Proxy
可以监听数组length属性的变化；
可以监听对象的添加；
可代理整个对象，不需要对对象进行遍历，极大提高性能；
多达13种的拦截远超Object.defineProperty只有get和set两种拦截。 

## 手动实现函数

## instanceof操作符的实现原理

```js
const obj = {}
console.log(obj instanceof Object)// true
console.log(obj instanceof Array)// false

// 自己实现instanceof
function myInstanceof(obj, func) {
  while(obj) {
    if (Object.getPrototypeOf(obj) === func.prototype) {
      return true
    }
    obj = Object.getPrototypeOf(obj)
  }
  return false
}
```

## js中如何实现深拷贝

- **structuredClone()**,不支持函数,会舍弃原型链
- lodash的cloneDeep
- JSON.parse(JSON.stringify())，会忽略undefined，函数，如果想保存函数,可以把函数转为字符串,读取时再还原.
- 手写

浅拷贝:

- 对于对象或数组，使用扩展运算符...
- Object.assign创建对象或数组和浅拷贝
- slice创建数组的浅拷贝

```js
// 手写深度克隆函数
function deepClone(obj, map = new WeakMap()) {
	// 如果不是对象,直接返回
	if (typeof obj !== 'object' || obj === null) {
		return obj
	}
	
	// 如果已经缓存,避免循环引用
	if (map.has(obj)) {
		return map.get(obj)
	}
	
	let result = undefined
	// 1. 如果obj是数组
	if (Array.isArray(obj)) {
		result = []
		for (const [key, value] of obj.entries()) {
			result[key] = deepClone(value, map)
		}
	} else if (obj instanceof Set) {
		// 2. 如果obj是set
		result = new Set()
		for (const [key, value] of obj.entries()) {
			result.add(deepClone(value, map))
		}
	} else if (obj instanceof Map) {
		// 3. 如果obj是map
		result = new Map()
		for (const [key, value] of obj.entries()) {
			result.set(key, deepClone(value, map))
		}
	} else if (obj instanceof Date) {
		// 4. 如果obj是Date
		result = new Date(obj)
	} else {
		// 5. 如果obj是普通对象
		result = {}
		for (const [key, value] of Object.entries(obj)) {
			result[key] = deepClone(value, map)
		}
	}
	
	map.set(obj, result)
	return result
}

const obj = {
	name: '韩佩江',
	age: 25,
	love: [
		{
			name: '夏翀',
			age: 25,
		},
		{
			name: '吕凤凤',
			age: 24,
		}
	],
}
const obj2 = deepClone(obj)
console.log(obj)
console.log(obj2)
console.log(obj === obj2)
```

## 实现call,apply,bind函数

call()和apply()区别

- call：参数为一个个的
- apply：参数为一个数组

```js
Function.prototype.myCall = function(context, ...args) {
  // 如果没有传入 context 或者 context 是 null 或 undefined，则默认指向全局对象（在浏览器中是 window）
  context = context || globalThis;
  // 创建一个唯一的属性，防止覆盖已有属性
  const fnSymbol = Symbol();
  // 将当前函数（即 this）作为 context 的一个方法
  context[fnSymbol] = this;
  // 使用 context 调用该方法，并传入参数
  const result = context[fnSymbol](...args);
  // 删除临时添加的方法
  delete context[fnSymbol];
  // 返回执行结果
  return result;
};

Function.prototype.myApply = function (context, arr) {
  context = context || globalThis;
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  const result = context[fnSymbol](...arr)
  delete context[fnSymbol]
  return result
}

Function.prototype.myBind = function (context, ...args) {
  // 保存调用bind的原函数
  const fn = this
  
  // 创建一个新函数
  const boundFunction = function (...newArgs) {
   // 使用apply调用原函数,并绑定this和传入的参数
   // 如果作为构造函数使用,则this指向实例对象
   return fn.apply(this instanceof boundFunction ? this : context, [...args, ...newArgs])
  }
  
  // 维护原型链
  boundFunction.prototype = Object.create(fn.prototype)
  boundFunction.prototype.constructor = boundFunction
  
  return boundFunction
}
```

## 实现节流和防抖函数

```ts
// 防抖函数
export function debounce(fn: () => void, delay: number = 1000) {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function () {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
		timer = setTimeout(() => {
			// @ts-ignore
      // arguments是一个类数组,存在于非箭头函数中,包含了调用函数时传递的所有参数.
			fn.apply(this, arguments)
			clearTimeout(timer!)
			timer = null
		}, delay)
	}
}

// 节流函数
export function throttle(fn: () => void, delay: number = 1000) {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function () {
		if (!timer) {
			// @ts-ignore
			fn.apply(this, arguments)
			timer = setTimeout(() => {
				clearTimeout(timer!)
				timer = null
			}, delay)
		}
	}
}
```

## 实现柯里化函数

```ts
function curry(fn) {
  return function curried(...args) {
   return args.length >= fn.length
    ? fn(...args)
    : (...nextArgs) => curried(...args, ...nextArgs)
  }
}
```

## 实现函数组合

```ts
function compose(...fns) {
  return (initialValue) => {
   return fns.reduceRight((acc, fn) => fn(acc), initialValue)
  }
}

const add1 = x => x + 1
const mul2 = x => x * 2
const sub3 = x => x - 3

const composeFunction = compose(sub3, mul2, add1)

console.log(composeFunction(5))// (5+1)*2-3=9
```

## 实现Object.create()

```ts
Object.myCreate = function (prototype) {
  function F() {}
  F.prototype = prototype
  return new F()
}
```

## 实现Event Bus

是发布-订阅模式,vm._events是事件中心.和Vue的事件系统基本一致,参见Vue面试题.

```ts
function EventBus() {
  this.events = Object.create(null)
}

EventBus.prototype.on = function (event, handler) {
  if (!this.events[event]) {
   this.events[event] = []
  }
  this.events[event].push(handler)
}

EventBus.prototype.emit = function (event, ...args) {
  this.events[event]?.forEach(handler => handler(...args))
}

EventBus.prototype.off = function(event, deleteHandler) {
  if (this.events[event]) {
    this.events[event] = this.events[event].filter(handler => handler !== deleteHandler)
  }
}

const eventBus = new EventBus()

eventBus.on('say', (params) => {
  console.log(`Hello, my name's ${params.name}, age: ${params.age}`)
})

eventBus.emit('say', {
  name: '夏翀',
  age: 25,
})
```

## JavaScript事件循环是什么?

JavaScript是单线程语言,但通过事件循环机制可以编写异步代码.

事件循环主要由3部分组成:

- 调用堆栈: 保存当前正在执行的函数调用，当执行到一个函数时，将其压入栈中；执行完毕后，将其弹出。(同步任务)
- 任务队列: 存放宏异步任务,例如setTimeout,setInternal.事件处理等的回调函数.(异步任务)
- 微任务队列: (异步任务)



工作原理:

- JavaScript 引擎首先执行调用堆栈中的同步代码
- 当调用堆栈清空后，事件循环会执行所有微任务
- 从任务队列中取出一个任务放入调用堆栈中执行.

## js,mjs,cjs的关系

- js: JavaScript 文件的通用扩展名，可以根据文件内容或配置来决定是作为 cjs 还是 mjs 模块来处理。
- mjs: ES Modules（ES 模块），是 JavaScript 的标准模块化语法，被广泛应用于现代前端开发。它使用 `import` 语句来导入模块，使用 `export` 语句来导出模块。
- cjs: CommonJS 模块，是 Node.js 最初采用的模块化规范。它使用 `require` 语句来导入模块，使用 `module.exports` 或 `exports` 对象来导出模块。

## JSON是什么?

JSON会忽略一些值

- 函数
- Symbol类型的键和值
- 值为undefined的属性

## 类

JavaScript中的类建立在原型的基础上,同时还具有一些类独有的语法和语义.

```ts
/**
 * 类是特殊的函数,类的主体会执行在严格模式下
 */
class Person {
  // 构造函数,相当于不使用class语法时的普通函数
  constructor(name, age) {
   this.name = name
   this.age = age
  }
  
  // 定义到Person函数上,相当于Person.number = 10
  static number = 10
  // 定义到Person函数上,相当于Person.getNumber = function () {}
  static getNumber() {
   return Person.number
  }
  
  // 定义到实例上,相当于在constructor构造函数中执行this.address = '安阳市'
  address = '安阳市'
  // 定义到实例上,私有属性,不能通过this[#phone]访问
  #phone = '17796723651'
  
  // 定义到Person.prototype上
  hello() {
   console.log(this.name + this.age + this.#phone)
  }
  // get也会被设置到Person.prototype上
  get privatePhone() {
   return this.#phone
  }
}

console.dir(Person)
const p1 = new Person('夏翀', 25)
console.dir(p1)
p1.hello()

// 继承
// Student.__proto__ === Person 为true
// Student.prototype.__proto__ === Person.prototype 为true
class Student extends Person {
  
  constructor(name, age, school) {
   super(name, age);
   this.school = school
  }
  
  hello() {
   // super.hello()
   console.log('我是学生')
  }
}

console.dir(Student)
const s = new Student('江思雨', 32, '清华大学')
console.dir(s)
s.hello()
```

## ES6添加了哪些东西?

### 文件相关

- ES模块,import,export

### 类型和类型定义

- let，存在块作用域，同样**会被提升**，但不可以使用,处在暂时性死区,如果使用,会报引用错误.
- const
- Symbol新基本类型
- class,extends

### 全局内置对象添加和已有全局内置对象添加方法

####新的

- Promise，ES2017引入了async
- Proxy
- Set
- Map
- WeakSet
- WeakMap

#### 已有的

- Array
- String

### 函数相关

- 箭头函数
- 参数默认值

### 操作相关

- 解构赋值  在解构操作和其他使用默认值的地方,只有对应属性为**undefined**时,才会使用默认属性.
- 展开语法，别名扩展运算符(剩余参数的逆运算)
- 迭代器和for of

## ES2020引入了什么?

### 操作相关

?.

??

## JavaScript如何实现继承?

在ES5中，实现继承的主要方法是通过构造函数和原型链。这是最常见的实现继承的方式，涉及到将子构造函数的原型设置为父构造函数的实例，从而使子类继承父类的属性和方法。以下是实现继承的主要步骤和示例：

### 1. 使用构造函数

首先，我们定义父类和子类的构造函数。构造函数用于创建对象并初始化它们的属性。

```javascript
function Parent(name) {
  this.name = name;
  this.play = [1, 2, 3];
}

function Child(name, type) {
  // 调用 Parent 构造函数，使用 .call() 将 this 绑定到 Child 的实例
  Parent.call(this, name); 
  this.type = type;
}
```

### 2. 设置原型链

为了实现继承，我们需要将子类的原型设置为父类的实例，这样子类就会继承父类的属性和方法。

```javascript
// 将 Child 的原型设置为 Parent 的一个实例
Child.prototype = Object.create(Parent.prototype); // 这是实现继承的关键步骤
Child.prototype.constructor = Child; // 重新设置 constructor 为 Child 构造函数
```

### 3. 添加原型方法

我们可以在父类的原型上添加方法，这样子类也会继承这些方法。

```javascript
// 为 Parent 的原型添加一个方法
Parent.prototype.getName = function() {
  return this.name;
};

// 为 Child 的原型添加一个方法
Child.prototype.getType = function() {
  return this.type;
};
```

### 4. 创建实例并验证继承

我们可以创建子类的实例，并验证继承的属性和方法。

```javascript
const c1 = new Child('Child1', 'Type1');
const c2 = new Child('Child2', 'Type2');

console.log(c1.name); // 输出: 'Child1'
console.log(c2.name); // 输出: 'Child2'

console.log(c1.play); // 输出: [1, 2, 3]
c1.play.push(4);
console.log(c1.play); // 输出: [1, 2, 3, 4]
console.log(c2.play); // 输出: [1, 2, 3]

console.log(c1.getName()); // 输出: 'Child1'
console.log(c2.getType()); // 输出: 'Type2'
```

这个示例展示了如何在ES5中使用构造函数和原型链实现继承。我们通过设置原型链，确保子类可以继承父类的属性和方法，并且子类还可以添加自己的特定属性和方法。

















































