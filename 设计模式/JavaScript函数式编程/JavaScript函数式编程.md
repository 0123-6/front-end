# JavaScript函数式编程

函数式编程是一种编程范式，函数式编程是一个很大的命题，在本文中将介绍几个基本概念：

- 纯函数
- 柯里化 curry
- 组合 compose
- 容器 container
- 函子 functor
- 工厂函数：一个简便的方法来创建容器实例

## 如何实现链式调用

这里是一个例子，实现了一个链式调用。

```javascript
// Container函数定义了一个容器类型，这个容器可以包含任意类型的值。容器的目的是为了提供一种封装值的机制，使得对值进行操作更加方便。
var Container = function(x) {
  this._value = x;
}

// Container.of是一个静态方法，用来创建一个包含给定值的容器实例。它接收一个参数x，并返回一个新的Container实例，将参数x封装到容器中。
Container.of = function(x) {
  return new Container(x);
}

// map方法允许对容器中的值进行映射操作。它接收一个函数f作为参数，对容器中的值应用这个函数，并将结果封装到新的容器中返回。这个方法符合函子(functor)的定义，即可以对容器中的值可以进行操作而不破坏容器结构。
Container.prototype.map = function(f) {
  return Container.of(f(this._value));
}

//---------------------------------------------
var MyContainer = function(x) {
  this._value = x;
}

MyContainer.prototype.map = function(f) {
  return new MyContainer(f(this._value))
}
```

上述代码实现了一个简单的链式调用，让我们看看如何使用它

```javascript
Container.of(3); // Container {_value: 3}
Container.of(4); // Container {_value: 4}

var add1 = function (num) {
  return num + 1;
}
var add2 = function (num) {
  return num + 2;
}

Container.of(3).map(add1).map(add2) // Container {_value: 6}
Container.of(4).map(add2).map(add2).map(add2) // Container {_value: 10}
```

在这个实例中出现的**Container**是一个容器，通过**Container.of**来实例化保存值到this._value。

add1，add2都是纯函数，我们通过map函数来操作容器内的值，我们把Container看做数据结构，这种数据结构可以通过map操作，那么它就叫**函子functor**。

## 纯函数

什么是纯函数？纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

```javascript
var xs = [1, 2, 3, 4, 5];

// 纯函数
xs.slice(0, 3);// [1,2,3]
xs.slice(0, 3);// [1,2,3]

// 不纯的
xs.splice(0, 3);// [1,2,3]
xs.splice(0, 3);// [4, 5]
```

比如slice和splice，这2个函数的作用别无二致，但是我们说slice符合纯函数的定义是因为对相同的输入它保证返回相同的输出。而splice的调用却会产生可观察到的副作用，这个数组被永久的改变了。

在函数式编程中，我们尽量杜绝splice这种会改变数据的函数。我们追求的是slice那种可靠的，每次都返回同样结构的函数。

在看另一个例子

```javascript
// 不纯的
var num_1 = 1;
var add1 = function (num) {
  return num + num_1;
}

// 纯的
var add1 = function (numm) {
  return num + 1;
}
```

在不纯的版本中，add1的结果取决于num_1这个可变变量的值。换句话说，它取决于系统状态(System state)。因为它引入了外部的环境，从而增加了认知负荷(cognitive load)。这种依赖状态时影响系统复杂度的罪魁祸首，不仅让它变得不纯，而且导致我们每次思考整个软件的时候都痛苦不堪。

为什么要使用纯函数呢？举例容易看到的好处：1. 可缓存性，因为纯函数对于相同的输入有相同的输出，所以纯函数是可以缓存运算结果的；2. 可移植性，因为不会受`环境变量`等外部状态的影响，可以方便移植；3. 可测试性，无需配置外部变量，一个输入一个输出，直接断言；等等。

有哪些不纯的情况呢？1. IO 操作，你不知道你读取的内容会是怎样；2. 接口请求，你确定返回的内容是什么；3. dom 操作，引起了副作用；4. 甚至连 console.log 都是不纯的，因为它有副作用；等等。对于不纯的函数我们尽量把它控制在可控范围内发生，这个会在文章后面提到。

### 什么是副作用

在编程中，副作用（Side Effect）是指函数或表达式对除了返回值之外的其他部分造成的影响。这些影响可能是对函数外部的变量进行修改、对文件系统进行读写、对网络进行通信、对数据库进行操作等。副作用通常是在函数内部执行的，而不是通过函数返回值暴露给调用者。

在函数式编程中，副作用被视为不好的，因为它们会引入不确定性和不可控性，使得程序更难理解、调试和测试。函数式编程的理念之一就是尽可能地避免副作用，使函数纯粹（Pure）。

一个纯粹的函数（Pure Function）是指在相同的输入条件下，始终会产生相同的输出，并且没有任何副作用。纯粹函数不依赖于外部状态，不会修改外部变量或对象，也不会触发外部事件。这种特性使得纯粹函数更容易推理、测试和并发执行。

下面是一个副作用的例子：

```javascript
let counter = 0;

function incrementCounter() {
    counter++;
}

incrementCounter();
console.log(counter); // 输出: 1
```

在这个例子中，`incrementCounter` 函数对外部变量 `counter` 造成了影响，修改了它的值。因此，`incrementCounter` 函数具有副作用。

避免副作用是函数式编程的一个重要原则，它通过使用纯粹函数来减少副作用，从而使得代码更易于理解、测试和维护。

## 函数柯里化

什么事柯里化(curry)？柯里化的概念很简单，只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

简单的实例：

```javascript
// 正常函数
var add = function(x, y) {
  return x + y;
}
add(1,2)// 3
add(10,1)// 11
add(10,2)// 12
add(10,3)// 13

// 柯里化函数
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = add(1);
var addTen = add(10);

increment(2)// 3
addTen(1)// 11
addTen(2)// 12
addTen(3)// 13
```

我们把add函数通过柯里化变成了接受部分参数并返回一个处理剩余参数的且返回结果的函数。在实际环境中，我们可能用到**ramda**这样的库来帮助我们实现柯里化。

```javascript
var R = require('ramda');
var add = function(x, y) {
  return x + y;
}
var addTen = R.curry(add)(10)

addTen(1);// 11
addTen(2);// 12
```

柯里化是函数式编程的工具，它能实现预加载函数，分步取值，避免重复传参，锁定函数运行环境等功能。

## 函数组合

这就是组合

```javascript
// 简单实现，复杂实现可以传递多个函数用于组合
var compose = function(f, g) {
  return function(x) {
    return f(g(x));
  }
}
```

组合多个函数生成一个新的函数，并且函数从右往左运行。

```javascript
var double = function(num) {
  return num * 2;
}
var add = R.curry(function(x, y){
  return x + y;
});
var price = compose(double, add(10));

price(10);// 40
price(20);// 60
```

通过函数组合我们可以，一次性的合并多个处理函数，并且可以方便的改变函数的执行顺序。

## 容器和函子

让我们回顾开头的例子

```javascript
var Container = function(x) {
  this._value = x;
}

Container.of = function(x) {
  return new Container(x);
}

Container.prototype.map = function(f) {
  return Container.of(f(this._value));
}
```

现在我们转换角度，把调用Container.of返回的对象看做一种数据结构，这种数据结构只能使用map方法进行操作，类似这样的数据结构被称为**函子**。

这样做的好处是什么呢？我们能在不离开容器的情况下去操作容器里面的值，操作完成之后又放回容器。我们可以不断的进行这一操作，就像组合函数一样。这是一种抽象，我们让容器保存值，并且请求容器通过map里的函数去操作值。



容器和函子都是函数式编程中的重要概念，它们之间存在着密切的关系。

1. **容器（Container）：** 容器是一个通用的概念，用于表示一种封装值的机制。在函数式编程中，容器通常是一个对象或者数据结构，用来包含某个值，并提供一些操作来处理这个值。典型的容器包括 Maybe、Either、Array 等。容器可以简单地用一个对象来实现，也可以是一个具有特定接口的类。例如：

```javascript
class Maybe {
    constructor(value) {
        this.__value = value;
    }
    map(f) {
        return this.__value ? new Maybe(f(this.__value)) : new Maybe(null);
    }
}
```

2. **函子（Functor）：** 函子是一个特殊的容器，它实现了 `map` 方法。在数学上，函子是一个范畴理论的概念，用来描述一种从一个范畴到另一个范畴的映射。在函数式编程中，函子通常表示一种可以被映射的数据类型，它提供了 `map` 方法用来对容器中的值进行操作，而不会改变容器本身的结构。因此，函子可以看作是对容器的一种特殊抽象，它具有更加严格的规范。

容器和函子之间的关系可以描述为：函子是一种特殊的容器，它实现了 `map` 方法。换句话说，凡是实现了 `map` 方法的容器都可以称为函子。函子提供了一种通用的方式来操作容器中的值，这种方式是不依赖于容器具体实现的，从而使得我们可以在不同的容器类型之间进行通用的操作。

## 总结

在文章里，我们提到了纯函数，柯里化curry，组合compose，容器container，函子functor，不要看他们很遥远其实已经或多或少的出现在我们身边。举个例子，箭头函数。

```javascript
// 实现2个数加法的柯里化函数
const curryAdd = x => y => x + y;
// 组合函数，用于将两个函数组合成一个新的函数
const compose = (f, g) => x => f(g(x));

const double = num => num * 2;

const price = y => compose(double, curryAdd(10))(y)

console.log(price(0));// 20
```

仅仅几行代码就可以体验curry柯里化和组合compose工具。



















































