# 4 柯里化curry

## 不可或缺的curry

我父亲以前跟我说过，有些事物在你得到之前是无足轻重的，得到之后就不可或缺了。微波炉是这样，智能手机是这样，互联网也是这样——老人们在没有互联网的时候过得也很充实。对我来说，函数的柯里化（curry）也是这样。

curry柯里化的概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

你可以一次性的调用curry柯里化函数，也可以每次只传一个参数分多次调用。

```javascript
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = add(1);
var addTen = add(10);

increment(2);
// 3

addTen(2);
// 12
```

这里我们定义了一个 `add` 函数，它接受一个参数并返回一个新的函数。调用 `add` 之后，返回的函数就通过闭包的方式记住了 `add` 的第一个参数。一次性地调用它实在是有点繁琐，好在我们可以使用一个特殊的 `curry` 帮助函数（helper function）使这类函数的定义和调用更加容易。

我们来创建一些 curry 函数享受下。

```javascript
var curry = require('lodash').curry;

var match = curry(function(what, str) {
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var map = curry(function(f, ary) {
  return ary.map(f);
});
```

我在上面的代码中遵循的是一种简单，同时也非常重要的模式。即策略性地把要操作的数据（String， Array）放到最后一个参数里。到使用它们的时候你就明白这样做的原因是什么了。

```javascript
match(/\s+/g, "hello world");
// [ ' ' ]

match(/\s+/g)("hello world");
// [ ' ' ]

var hasSpaces = match(/\s+/g);
// function(x) { return x.match(/\s+/g) }

hasSpaces("hello world");
// [ ' ' ]

hasSpaces("spaceless");
// null

filter(hasSpaces, ["tori_spelling", "tori amos"]);
// ["tori amos"]

var findSpaces = filter(hasSpaces);
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findSpaces(["tori_spelling", "tori amos"]);
// ["tori amos"]

var noVowels = replace(/[aeiou]/ig);
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }

var censored = noVowels("*");
// function(x) { return x.replace(/[aeiou]/ig, "*") }

censored("Chocolate Rain");
// 'Ch*c*l*t* R**n'
```

这里表明的是一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。

## 不仅仅是双关语

curry 的用处非常广泛，就像在 `hasSpaces`、`findSpaces` 和 `censored` 看到的那样，只需传给函数一些参数，就能得到一个新函数。

用 `map` 简单地把参数是单个元素的函数包裹一下，就能把它转换成参数为数组的函数。

```javascript
var getChildren = function(x) {
  return x.childNodes;
};

var allTheChildren = map(getChildren);
```

只传给函数一部分参数通常也叫做*局部调用*（partial application），能够大量减少样板文件代码（boilerplate code）。考虑上面的 `allTheChildren` 函数，如果用 lodash 的普通 `map` 来写会是什么样的（注意参数的顺序也变了）：

```javascript
var allTheChildren = function(elements) {
  return _.map(elements, getChildren);
};
```

通常我们不定义直接操作数组的函数，因为只需内联调用 `map(getChildren)` 就能达到目的。这一点同样适用于 `sort`、`filter` 以及其他的高阶函数（higher order function）（高阶函数：参数或返回值为函数的函数）。

当我们谈论*纯函数*的时候，我们说它们接受一个输入返回一个输出。curry 函数所做的正是这样：每传递一个参数调用函数，就返回一个新函数处理剩余的参数。这就是一个输入对应一个输出啊。

哪怕输出是另一个函数，它也是纯函数。当然 curry 函数也允许一次传递多个参数，但这只是出于减少 `()` 的方便。

## 总结

curry 函数用起来非常得心应手，每天使用它对我来说简直就是一种享受。它堪称手头必备工具，能够让函数式编程不那么繁琐和沉闷。

通过简单地传递几个参数，就能动态创建实用的新函数；而且还能带来一个额外好处，那就是保留了数学的函数定义，尽管参数不止一个。 下一章我们将学习另一个重要的工具：`组合`（compose）。

## 如何实现curry函数

`curry` 函数的目的是将一个接受多个参数的函数转换为一系列接受单个参数的函数，每个函数都返回一个新的函数，直到接受到所有参数才执行原始函数。

以下是一个简单的实现 `curry` 函数的例子：

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return function(...nextArgs) {
        return curried(...args.concat(nextArgs));
      };
    }
  };
}
```

这个 `curry` 函数接受一个函数 `fn` 作为参数，并返回一个新的函数 `curried`。`curried` 函数首先检查传入参数的个数是否大于等于 `fn` 函数所需的参数个数，如果是，则直接调用 `fn` 函数并传入所有参数；如果不是，则返回一个新的函数，这个新的函数接受更多的参数，并将已有的参数与新参数拼接起来，然后递归调用 `curried` 函数。

这样就实现了柯里化功能，原始的多参数函数被转换为接受单个参数的函数序列，每个函数都负责接收一个参数并将其传递给下一个函数，直到接受到所有参数时才执行原始函数。





























































