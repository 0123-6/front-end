# TypeScript中!.是什么

在TypeScript中，`!` 是非空断言操作符（Non-null Assertion Operator）的一部分。这个操作符告诉编译器，你确定一个表达式的值不会为 `null` 或 `undefined`，即使编译器认为它可能为 `null` 或 `undefined`。

这个操作符通常用于告诉编译器一个变量在某个特定的上下文中是非空的。使用 `!` 操作符时，你在告诉编译器“我知道这里可能有空值，但是在这种情况下，我确信它不会为空。”

举个例子，假设有一个变量 `name`，编译器认为它可能为 `null` 或 `undefined`。如果你确定在某种情况下 `name` 不可能为 `null` 或 `undefined`，你可以使用 `!` 来告诉编译器：

```typescript
let name: string | null = "John";
console.log(name.length); // 编译错误：Object is possibly 'null'.
console.log(name!.length); // 使用!操作符告诉编译器，name不会为空。
```

但要小心使用 `!` 操作符，因为它可以绕过 TypeScript 的类型检查，如果你误用它，可能会导致运行时错误。最好的做法是尽量避免使用 `!` 操作符，而是在可能的情况下编写更严谨的代码，以避免空值的出现。

- Omit：`Omit` 是一个内置的泛型工具类型，用于从给定类型中排除指定的属性。

  ```ts
  interface Person {
    name: string;
    age: number;
    address: string;
  }
  
  type PersonWithoutAddress = Omit<Person, 'address'>;
  
  const person: PersonWithoutAddress = {
    name: 'John Doe',
    age: 30
    // address 属性被省略了
  };
  ```

- Record可以为object详细定义

  ```ts
  interface A {
    stud: Record<string, number>
  }
  ```

  

- 试试