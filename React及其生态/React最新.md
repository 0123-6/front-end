# React最新

# React是什么

React是由Facebook公司创建的，React是用于构建Web的库。

React组件必须以大写字母开头。

我们遵循react中createElement和使用useState,useEffect,useRef,指定一个DOM,可以借助react构建前端页面.

# React的主要特点

- 使用jsx语法
- 使用虚拟DOM
- 单向数据流

# JSX是什么?

jsx是react的createElement()的语法糖，非JavaScript标准。

# 元素和组件的关系

- 元素: 虚拟DOM
- 函数式组件: 创建元素的方式

# 和Vue的异同

|              | Vue                                                          | React                                                        |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 原生使用方式 | 组件是一个普通对象，在template属性上，编写类似于HTML的模板语法，或者使用render直接编写渲染函数 | 组件是一个函数，该函数返回一个普通对象，普通对象为React.createElement()创建的对象，不支持直接编写类HTML模板语法 |
| 借助工具     | .vue文件，支持编写HTML模板语法                               | .jsx文件，支持编写类HTML语法                                 |
|              |                                                              |                                                              |

# Vue2 Vue3 React定义方式比较

## Vue2

```ts
new Vue({
  // 绑定的HTML根元素
  el: '#app',
  // 渲染函数,也可以使用template
  render: h => h('RouterView'),
  // 路由器
  router,
})
```

## Vue3

```ts
const app = Vue.createApp({
  // Vue3的render不好用，使用template定义
  template: `<RouterView/>`,
})
app.use(router)
app.mount('#app')
```

## React18

```ts
// 先绑定DOM
const dom = ReactDOM.createRoot(document.getElementById('app'))
// 再创建一个React组件，并渲染到dom上
dom.render(React.createElement(LayoutPage))
```

# React的事件和普通事件的区别?

## 定义语法和参数事件对象不一样

## 事件管理和执行顺序

- 原生: 没有事件管理,原生事件先执行,如果阻止冒泡,可能导致React合成事件不执行,因为需要冒泡到document的合成事件才会执行.
- React: React的合成事件后执行,使用事件委托机制,将所有的事件监听器绑定到DOM树的顶层document上,可以减少内存消耗和提升性能.

## 绑定和解绑

- HTML: 自动绑定,手动解绑
- JS: 手动绑定,手动解绑
- React: 自动绑定,组件卸载时,自动解绑.

## 阻止方式

- 原生: 返回false,或preventDefault()
- React: 必须preventDefault()

# React什么时候重新渲染组件

- useState触发
- 组件的props发生变化
- hook依赖变化: 使用useEffect，useMemo，useCallback钩子，对应的依赖项发生变化时

# React可以在render中访问refs吗?

不可以.

- render过程中,是生成react元素的过程,尚未挂载
- render为纯函数,不应该操作DOM

# React setState调用后发生了什么?

- 将传入的值或函数放入hook.queue中,同步代码,值未改变.
- 异步重新渲染DOM树,在渲染时会得到最新值

# React组件的state和props的区别

- props: 函数参数
- state: 内部属性

# 为什么React的props是只读的

单向数据流和纯函数思想.

# React如何校验props?

使用ts.

# React18的生命周期

在React18.3.1中,函数式组件没有生命周期方法,但可以通过React提高的Hooks钩子函数来实现类似的生命周期行为.比如useState,useRef,useEffect,useMemo.

```tsx
import { useState, useEffect } from 'react'

function MyComponent() {
  // state
  const [count, setCount] = useState(0)
  // effect
  // 空数组作为依赖项,确保只在初次渲染时执行一次
  useEffect(() => {
    // 组件挂载时运行(初次渲染时)
    console.log('mounted')
    
    // 返回一个清理函数,它将在组件卸载时执行
    return () => {
      console.log('组件将要卸载')
    }
  }, [])
  
  // 在count变化时执行
  useEffect(() => {
    console.log('count更新了')
  }, [count])
  
  return (
    <div></div>
  )
}
```

# React的hook是什么?

hook配合fiber数据结构,实现了在函数式组件中定义**状态**和**生命周期**的功能.hook必须在顶层定义.hook让我们无需使用类组件.

# React的diff算法

- 生成一棵新的fiber树,可中断.
- render新fiber树,调和算法,遍历子节点是更新,添加or删除.

# key的作用?

调和算法,快速判断是否是同一个节点.

# ref的作用?

返回对元素的引用.

```tsx
import React, { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```

# 为什么ref使用string是过时的?

- 会造成全局污染
- 函数式组件没有this,无法访问.

# react的fiber是什么?

fiber是react16引入的数据结构,react使用fiber重写了核心算法,

- 将工作分为可中断和可恢复的小任务,防止浏览器卡顿

# 受控组件,非受控组件

- 受控组件: 与react状态同步(推荐)
- 非受控组件: 不受控制,自己维护自己的状态,通过访问DOM或事件如何或修改值.

# React的状态提升是什么?

当多个组件需要共享相同的可变数据时,建议将共享数据提升到他们最近的共同祖先中.

# 什么是HOC高阶组件?

高阶组件本质是一个参数为组件,返回新组件的函数.

# 什么是Context?

Context提供了一种在组件树中传递数据的方式,而不必在每个层次中手动传递.

# Fragment组件是什么?

Fragment组件通常使用<></>代替，他们允许你在**不添加额外节点**的情况下将子元素组合。

# StrictMode组件的作用

Strict帮助程序员在开发过程中尽早发现组件的错误.

# useSyncExternalStore API





# React参考总览

本部分提供了使用React的详细参考文档.React参考文档分为以下内容:

react.js源码0.3w行

react-dom.js源码3w行

## React

- **Hook**: 在函数式组件中使用,可以保存状态和模拟生命周期.
- **内置组件**: 官方提供的内置组件
- API: 一些API

## React DOM

React-dom仅支持在web应用程序中使用.

- Hook: 在浏览器环境的Hook
- 组件: 内置组件
- API: 内置API

## React规则

待补充.



# React内置Hook

Hook可以帮助在函数式组件中使用不同的React功能.可以使用内置的Hook或使用自定义Hook.

本页面列出了React中所有内置Hook.

## State Hook

一般函数是纯函数和没有状态的,这类hook可以让函数式组件**拥有自己的状态**.

- **useState**: 可以直接更新
- **useReducer**: 在reducer函数中声明带有更新逻辑的state变量.

## Context Hook

帮助组件从祖先组件接收信息,而无需将其作为props传递.

- **useContext**

## Ref Hook

保存不用于渲染的信息,更新ref不会更新组件.

- **useRef**

## Effect Hook

- **useEffect**

## 性能Hook

- **useMemo**: 计算属性
- **useCallback**: 将函数传递给优化组件之前缓存函数定义.

## 其它Hook

- **useSyncExternalStore**: 订阅外部store

## 自定义Hook

开发者可以自定义Hook作为JavaScript函数.

# useCallback

useCallback是一个允许你在多次渲染中缓存函数的React Hook.

```ts
const cachedFn = useCallback(fn, dependencies)
```

使用useCallback仅在少数情况下有意义:

- 将其作为props传递给包装在memo()中的组件.如果props未更改,则希望跳过重新渲染.
- 传递的函数可能作为某些hook的依赖.比如useEffect的依赖数组存在函数,但是,最好消除对函数依赖项的需求.























