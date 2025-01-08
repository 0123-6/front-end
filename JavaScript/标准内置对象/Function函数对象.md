# Function

在JavaScript中，每个函数都是Function对象。Function对象提供了处理函数的方法。

# Function属性(1个)

## prototype

prototype属性指向该构造函数创建的实例的原型对象。

# Function方法(3个)

## Function.prototype.apply()

为构造函数提供this参数和另一个参数，格式为数组，返回使用指定的this值和参数调用函数的结果。与call()几乎一样。

通常情况下，在调用函数时，函数内部的this值是访问该函数的对象。使用apply()或call(),你可以将任意值分配给this，而无需先将函数作为属性附加到对象上，这使得你可以将一个对象的方法作为通用的实用函数。

## Function.prototype.call()

call()方法会给定this值和每一个参数。

call()的性能更好，对比apply。

## Function.prototype.bind()

bind()方法会以给定的this值创建一个新函数。

同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。
