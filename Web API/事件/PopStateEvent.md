# PopStateEvent

popStateEvent是一个window.popstate事件的接口。

一个window.popstate事件被触发每当前一个标签页当前记录改变时在历史记录中改变时。如果一个记录是被history.pushState() 或者history.replaceState()创建的，那这个window.popstate事件包含一个state属性，是那个记录的state属性的拷贝。

## 继承关系

Event <-- PopStateEvent

## 属性

### state

state是一个只读属性。