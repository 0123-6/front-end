// 模块作用域
let rootFiber = null
let oldRootFiber = null
let nowFiber = null
let nextFiber = null

// 需要删除的节点
let deletions = []
let hookIndex = null

// 工具函数
const isEventProperty = key => key.startsWith('on')
const isProperty = key => key !== 'children' && !isEventProperty(key)
const isNewProperty = (prev, next) => key => prev[key] !== next[key]
const isGoneProperty = (prev, next) => key => !(key in next)

// 创建文本节点
function createTextElement(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

// 创建元素
export function createElement(type, props, ...children) {
	children = children.filter(child => child)
	return {
		type,
		props: {
			...props,
			children: children.map(child => (typeof child === 'object' ? child : createTextElement(child)))
		},
	}
}

// 更新DOM
function updateDom(dom, prevProps, nextProps) {
	// 移除旧属性
	Object.keys(prevProps)
		.filter(isProperty)
		.filter(isGoneProperty(prevProps, nextProps))
		.forEach(name => {
			dom[name] = ''
		})
	// 设置或更新新属性
	Object.keys(nextProps)
		.filter(isProperty)
		.filter(isNewProperty(prevProps, nextProps))
		.forEach(name => {
			dom[name] = nextProps[name]
		})
	// 移除旧的事件监听器
	Object.keys(prevProps)
		.filter(isEventProperty)
		.filter(key => !(key in nextProps) || isNewProperty(prevProps, nextProps)(key))
		.forEach(name => {
			const eventType = name.toLowerCase().substring(2)
			dom.removeEventListener(eventType, prevProps[name])
		})
	// 添加新的事件监听器
	Object.keys(nextProps)
		.filter(isEventProperty)
		.filter(isNewProperty(prevProps, nextProps))
		.forEach(name => {
			const eventType = name.toLowerCase().substring(2)
			dom.addEventListener(eventType, nextProps[name])
		})
}

// 根据element创建真实DOM
function createNode(element) {
	element.dom = element.type === 'TEXT_ELEMENT'
		? document.createTextNode('')
		: document.createElement(element.type)
	// 给创建的node设置属性
	updateDom(element.dom, {}, element.props)
}

// render函数
export function render(element, container) {
	rootFiber = {
		// 本元素,为实际DOM节点,最初为render函数的第2个参数,用户要绑定的实际DOM节点
		dom: container,
		// 已有dom,无需创建操作,貌似type对这个container无意义
		type: null,
		props: {
			// 没有额外props
			children: [element],
		},
		
		// fiber架构独有属性
		parent: null,
		child: null,
		sibling: null,
		// 对上一次根fiber(同级fiber)的引用
		alternate: oldRootFiber,
		// 保存此fiber的hook信息
		hooks: [],
	}
	nextFiber = rootFiber
	deletions = []
}

// 循环函数
function loopFunction(deadline) {
	let shouldYield = false
	while (!shouldYield && nextFiber) {
		nextFiber = runFiber(nextFiber)
		shouldYield = deadline.timeRemaining() < 1
	}
	// 运行完了
	if (rootFiber && !nextFiber) {
		// 删除无用dom
		deletions.forEach(renderFiber)
		renderFiber(rootFiber)
		oldRootFiber = rootFiber
		rootFiber = null
	}
	// 循环
	requestIdleCallback(loopFunction)
}

requestIdleCallback(loopFunction)

// 运行fiber
// 本质为createNodeAll函数的另一种写法,createNodeAll为dfs遍历,不可中断,
// runFiber为fiber树的形式,可中断,可恢复
function runFiber(fiber) {
	// 1. 创建DOM,函数式组件没有dom属性
	const isFunctionComponent = fiber.type instanceof Function
	if (!isFunctionComponent) {
		// 不是函数式组件
		if (!fiber.dom) {
			createNode(fiber)
		}
	} else {
		// 是函数式组件
		nowFiber = fiber
		hookIndex = 0
	}
	
	// 2. 遍历子元素,创建或更新fiber树
	reconcileChildren(fiber)
	// 3. 返回下一个fiber
	return getNextFiber(fiber)
}

// 获取下一个fiber
function getNextFiber(fiber) {
	if (fiber.child) {
		return fiber.child
	}
	if (fiber.sibling) {
		return fiber.sibling
	}
	let parentFiber = fiber.parent
	while (parentFiber) {
		if (parentFiber.sibling) {
			return parentFiber.sibling
		}
		parentFiber = parentFiber.parent
	}
}

// 调和算法
function reconcileChildren(fiber) {
	let prevSibling = null
	const isFunctionComponent = fiber.type instanceof Function
	// 上一个fiber的子项
	let oldChildFiber = fiber.alternate?.child
	// fiber的子项数组
	// 如果是函数组件,则创建一个空数组[],执行函数,将返回值放入数组
	const fiberChildren = isFunctionComponent
		? [fiber.type(fiber.props)]
		: fiber.props.children
	// 遍历
	for (let i = 0; i < fiberChildren.length || oldChildFiber; i++) {
		const child = fiberChildren[i]
		// 重点,将一个createElement创建的对象 -> fiber对象
		let childFiber = null
		// 比较
		// 可以优化,引入key
		const sameType = child && oldChildFiber && child.type === oldChildFiber.type
		
		// 更新
		// 可以优化,跳过无需更新的
		if (sameType) {
			childFiber = {
				dom: oldChildFiber.dom,
				type: child.type,
				props: child.props,
				
				parent: fiber,
				child: null,
				sibling: null,
				alternate: oldChildFiber,
				hooks: [],
				effectTag: 'UPDATE',
			}
		} else if (child) {
			// 添加
			childFiber = {
				dom: null,
				type: child.type,
				props: child.props,
				
				parent: fiber,
				child: null,
				sibling: null,
				alternate: null,
				hooks: [],
				effectTag: 'PLACEMENT',
			}
		} else if (oldChildFiber) {
			// 删除
			oldChildFiber.effectTag = 'DELETION'
			deletions.push(oldChildFiber)
		}
		
		// 将新创建的childFiber添加到参数fiber中
		if (i === 0) {
			fiber.child = childFiber
		} else {
			prevSibling.sibling = childFiber
		}
		prevSibling = childFiber
		
		// 获取下一个oldChildFiber
		oldChildFiber = oldChildFiber?.sibling
	}
}

// 本质是renderNode的另一种写法,renderNode为dfs写法,不可中断
// renderFiber为fiber树写法,可以中断,但一般不中断,中断会产生不完整的UI
function renderFiber(fiber) {
	// 特殊情况
	if (!fiber) {
		return
	}
	
	// 获取父DOM
	let fiberParent = fiber.parent
	let fiberParentDom = fiberParent?.dom
	
	while (!fiberParentDom && fiberParent) {
		fiberParent = fiberParent.parent
		fiberParentDom = fiberParent?.dom
	}
	
	// 添加
	if (fiber.effectTag === 'PLACEMENT' && fiberParentDom && fiber.dom) {
		console.log('添加DOM')
		fiberParentDom.appendChild(fiber.dom)
	} else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
		// 更新
		console.log('更新')
		updateDom(fiber.dom, fiber.alternate.props, fiber.props)
	} else if (fiber.effectTag === 'DELETION') {
		// 删除
		console.log('删除')
		let deleteFiber = fiber
		let deleteFiberDom = deleteFiber.dom
		while (!deleteFiberDom && deleteFiber.child) {
			deleteFiber = deleteFiber.child
			deleteFiberDom = deleteFiber.dom
		}
		if (deleteFiberDom) {
			fiberParentDom.removeChild(deleteFiberDom)
		}
	}
	
	// 遍历下一个
	if (fiber.child && fiber.effectTag !== 'DELETION') {
		renderFiber(fiber.child)
	}
	if (fiber.sibling) {
		renderFiber(fiber.sibling)
	}
	
}

export function useState(initial) {
	const oldHook = nowFiber.alternate?.hooks?.[hookIndex]
	// 创建新hook
	const hook = {
		state: oldHook ? oldHook.state : initial,
		queue: [],
	}
	// 获取hook最新值,即setState传入的函数或值
	oldHook?.queue?.forEach(action => {
		if (action instanceof Function) {
			hook.state = action(hook.state)
		} else {
			hook.state = action
		}
	})
	
	// 将新创建的hook对象放入fiber
	nowFiber.hooks.push(hook)
	hookIndex++
	
	// 这个setState的实现和Vue3 pinia的useCounterStore有类似的地方,都是使用闭包,返回值为函数.
	function setState(action) {
		hook.queue.push(action)
		rootFiber = {
			dom: oldRootFiber.dom,
			type: null,
			props: oldRootFiber.props,
			
			parent: null,
			child: null,
			sibling: null,
			alternate: oldRootFiber,
			hooks: [],
		}
		nextFiber = rootFiber
		deletions = []
	}
	
	return [hook.state, setState, hook]
}

export function useRef(initial) {
	const oldHook = nowFiber.alternate?.hooks?.[hookIndex]
	const hook = {
		current: oldHook ? oldHook.current : initial
	}
	
	// 将新创建的hook对象放入fiber
	nowFiber.hooks.push(hook)
	hookIndex++
	return hook
}

export function useEffect(callback, dependencies) {
	const oldHook = nowFiber.alternate?.hooks?.[hookIndex]
	const hasChanged = oldHook && dependencies
		? dependencies.some((dep, index) => dep !== oldHook.dependencies[index])
		: true
	const hook = {
		callback,
		dependencies,
	}
	if (hasChanged) {
		queueMicrotask(callback)
	}
	
	// 将新创建的hook对象放入fiber中
	nowFiber.hooks.push(hook)
	hookIndex++
}









