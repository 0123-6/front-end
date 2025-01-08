import {App, inject, isReactive, isRef, markRaw, reactive, ref, Ref} from "vue";

// Pinia接口定义
interface IPinia {
  // 安装函数,可以被app使用,app.use(pinia)将pinia注册为app的插件
  // app为Vue中通过createApp()函数创建的Vue实例
  install: (app: App) => void
  // 根state
  state: Ref
  // 该pinia注册的store
  storeMap: Map<string, IStore>
}

interface IStore {
  $patch: (state: object | ((obj: object) => void)) => void
}

// 提供给app,值为pinia
const piniaSymbol = Symbol()

function isPlainObject(obj) {
	return (
    obj &&
		typeof obj === 'object' &&
		Object.getPrototypeOf(obj) === Object.prototype
	)
}

function isComputed(o: any) {
	return !!(isRef(o) && (o as any).effect)
}

// 合并对象
function mergeReactiveObjects(target, patchToApply) {
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key)) continue
    const subPatch = patchToApply[key]
    if (
      isPlainObject(target[key]) &&
      isPlainObject(subPatch) &&
      target.hasOwnProperty(key) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      target[key] = mergeReactiveObjects(target[key], subPatch)
    } else {
      target[key] = subPatch
    }
  }

  return target
}

// createPinia是一个全局函数,创建一个Pinia实例,给createApp()创建的app实例使用
export function createPinia(): IPinia {
	// markRaw表示该对象不需要被Vue的响应式系统管理和影响
	// 创建一个符合Pinia接口的pinia对象并返回
	const pinia: IPinia = markRaw({
		install(app: App) {
			// 2种注入方法
			// 通过provide提供数据,在setup中可以通过inject获取
			app.provide(piniaSymbol, pinia)
			// 注入到Vue实例的this中
			app.config.globalProperties.$pinia = pinia
		},
		// 创建一个ref对象,用来保存全部store,每一个store是一个key为string,value为StateTree的键值对
		state: ref({}),
		storeMap: new Map<string, IStore>(),
	})

	return pinia
}

export function defineStore(
	id: string,
	setup: () => object,
) {
	// 返回的函数
	function useStore() {
		// 如果提供了pinia实例,则使用pinia实例,否则使用绑定到app的pinia的实例
		// 因此在调用组件前,需要先执行app.use(pinia),通过pinia的install方法,
		// 设置app.provide(piniaSymbol, pinia),从而在这里可以获取到
		const pinia = inject(piniaSymbol)! as IPinia

		// 如果该pinia实例的storeMap没有这个id对应的store,则创建
		if (!pinia.storeMap.has(id)) {
			const initialState = pinia.state.value[id]
			if (!initialState) {
				pinia.state.value[id] = {}
			}

      // 创建Store对象
			const store: IStore = reactive({
				$patch: state => {
					// 2种更新方法,如果参数是函数,则调用这个函数,参数是pinia.state.value[id]
					// 如果是对象,则调用mergeReactiveObjects方法合并新数据和原数据
					if (typeof state === 'function') {
						state(pinia.state.value[id])
					} else {
						mergeReactiveObjects(pinia.state.value[id], state)
					}
				},
			})

      // 执行setup函数,获取返回值
			const setupStore = setup()!

      // 遍历返回值,将ref()定义的和reactive()定义的设置到pinia.state.value[id]上
			for (const [key, userRefOrFunction] of Object.entries(setupStore)) {
				if ((isRef(userRefOrFunction) && !isComputed(userRefOrFunction)) || isReactive(userRefOrFunction)) {
					if (initialState) {
						if (isRef(userRefOrFunction)) {
							userRefOrFunction.value = initialState[key]
						} else {
							mergeReactiveObjects(userRefOrFunction, initialState[key])
						}
					}
					pinia.state.value[id][key] = userRefOrFunction
				}
			}

      // 将返回值也设置到store对象上
			Object.assign(store, setupStore)

			pinia.storeMap.set(id, store)
		}

		// 获取对应的store对象,并返回
		return pinia.storeMap.get(id)!
	}

	return useStore
}
