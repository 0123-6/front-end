# React Router6学习笔记

## React Router6.4有什么新内容？

v6.4是一个重要版本，带来了新的数据抽象，用于读取，写入和导航钩子，使UI和数据轻松保持同步。

## 安装

```cmd
npm install react-router-dom
```

## 常用属性

### Link

```tsx
<Link to={'/contacts/1'}>Your Name</Link>
```

### Outlet

```
<Outlet/>
```

### useNavigate

```tsx
import {useNavigate} from "react-router-dom";

export default function ModuleOne() {
	// state
	const navigate = useNavigate()
	// methods
	function goDetail() {
		navigate('/module-one/detail/' + 12)
	}
	// render
	return (
		<div className={"w-full h-[600px] bg-red-400 flex flex-col"}>
			<span className={"text-3xl"}>模块1</span>
			<button onClick={goDetail}>跳转</button>
		</div>
	)
}

```

### useParams

```tsx
import {useNavigate, useParams} from "react-router-dom";

export default function ModuleOneDetail() {
	// state
	const {id} = useParams()
	const navigate = useNavigate()
	// methods
	function goBack() {
		navigate(-1)
	}
	// render
	return (
		<div className={"w-full h-[600px] flex flex-col bg-amber-300"}>
			<span className={"text-3xl"}>模块1详情页面,id: {id}</span>
			<button onClick={goBack}>返回</button>
		</div>
	)
}

```

## v5版本属性

### BrowserRouter

### HashRouter

### MemoryRouter

### useHistory

```tsx
const history = useHistory();

history.replace('/login')
history.push({
  pathname: '/data-element/api-serve/create',
})

history.push({
  pathname: '/data-element/api-serve/detail/'+selectedItem.current.id,
  params: {
    isEdit: true,
  },
})

this.props.history.push({
  pathname: "/template",
  search: "?name=sudheer",
  state: { detail: response.data },
});
```

## 功能介绍

### 客户端路由

React Router实现了客户端路由。

```tsx
// 路由相关
const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout/>,
	},
	{
		path: 'about',
		element: <div>关于页面</div>,
	}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		{/*antd包装组件，影响全局antd*/}
		<ConfigProvider
			// 设置antd为中文
			locale={zhCN}
			// 自定义主题
			theme={{
				token: {
					colorPrimary: '#1677ff',
					colorError: '#ff4d4f',
				},
			}}
		>
			<RouterProvider router={router}/>
		</ConfigProvider>
	</React.StrictMode>,
)
```

### 嵌套路由

main.tsx

```tsx
// 路由相关
const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage/>,
	},
	{
		path: '*',
		element: <NotFound/>,
	},
	{
		path: '/',
		element: <Layout/>,
		children: [
			{
				path: 'index',
				element: <Index/>,
			},
			{
				path: 'module-one',
				element: <ModuleOne/>,
			},
			{
				path: 'module-two',
				element: <ModuleTwo/>,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		{/*antd包装组件，影响全局antd*/}
		<ConfigProvider
			// 设置antd为中文
			locale={zhCN}
			// 自定义主题
			theme={{
				token: {
					colorPrimary: '#1677ff',
					colorError: '#ff4d4f',
				},
			}}
		>
			<RouterProvider router={router}/>
		</ConfigProvider>
	</React.StrictMode>,
)
```

LayoutPage.tsx

```tsx
import {Link, Outlet} from "react-router-dom";

export default function Layout() {
	// state
	// mounted
	// methods
	// render
	return (
		<div className={"w-screen h-screen bg-pink-200 flex flex-col"}>
			{/*导航*/}
			<div className={"h-[100px] flex items-center"}>
				<Link to={'/index'}>首页</Link>
				<Link to={'/module-one'}>模块1</Link>
				<Link to={'/module-two'}>模块2</Link>
			</div>
			{/*内容*/}
			<Outlet/>
		</div>
	)
}
```

### 动态参数

main.tsx

```tsx
// 路由相关
const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage/>,
	},
	{
		path: '*',
		element: <NotFound/>,
	},
	{
		path: '/',
		element: <Layout/>,
		children: [
			{
				path: 'index',
				element: <Index/>,
			},
			{
				path: 'module-one',
				element: <ModuleOne/>,
			},
			{
				path: 'module-one/detail/:id',
				element: <ModuleOneDetail/>,
			},
			{
				path: 'module-two',
				element: <ModuleTwo/>,
			},
		],
	},
])
```

ModuleOneDetail.tsx

```tsx
import {useNavigate, useParams} from "react-router-dom";

export default function ModuleOneDetail() {
	// state
	const {id} = useParams()
	const navigate = useNavigate()
	// methods
	function goBack() {
		navigate(-1)
	}
	// render
	return (
		<div className={"w-full h-[600px] flex flex-col bg-amber-300"}>
			<span className={"text-3xl"}>模块1详情页面,id: {id}</span>
			<button onClick={goBack}>返回</button>
		</div>
	)
}

```

### 排名路由匹配

顺序无关，智能匹配。

### 数据加载

？？？为什么在路由获取数据？

### 重定向

#### v6

```tsx
// 路由相关
const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout/>,
		children: [
			{
				path: '',
				element: <Navigate to={'/index'} replace/>,
			},
		],
	},
])
```

#### v5

```tsx
{/*首页*/}
<Route path="/" component={Layout}/>
{/*默认实验页面*/}
<Redirect to='/'/>
```

### 待定导航界面

### 具有暂停的骨架界面

### 数据突变

### 数据重新验证

### 繁忙指示器

### 乐观UI

### 数据获取器

### 竞态条件处理

### 错误处理

#### 通配符

```tsx
export const router = createBrowserRouter([
  {
    path: '*',
    element: <NotFound/>,
  },
])
```

#### errorElement

```tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <NotFound/>,
  },
])
```



### 滚动恢复

### Web标准API

## 导航守卫

