// import {
// 	computed,
// 	createApp,
// 	ref,
// 	watch,
// 	watchEffect,
// 	createVNode,
// 	onBeforeMount,
// 	onMounted,
// 	onBeforeUpdate,
// 	onUpdated, onBeforeUnmount, onUnmounted, version
// } from './vue.js'
//
// const t1 = ref(10)
// const t2 = ref(20)
//
// watchEffect(() => {
//
// 	console.log(`t1: ${t1.value}, t2: ${t2.value}, t1 + t2 = ${t1.value + t2.value}`)
// }, {
// 	flush: 'sync',
// })
//
// t1.value = 100
// t2.value = 3000
//
// const CompTwo = {
// 	setup() {
// 		console.log('Two')
// 		const number = ref(100)
//
// 		const numberChengTwo = computed(() => number.value * 2)
//
// 		const add = () => {
// 			number.value++
// 		}
//
// 		const dec = () => {
// 			number.value--
// 		}
//
// 		onBeforeMount(() => {
// 			console.log('子组件onBeforeMount')
// 		})
//
// 		onMounted(() => {
// 			console.log('子组件onMounted')
// 		})
//
// 		onBeforeUnmount(() => {
// 			console.log('子组件onBeforeUnmount')
// 		})
//
// 		onUnmounted(() => {
// 			console.log('子组件onUnmounted')
// 		})
//
// 		return () => createVNode(
// 			'div',
// 			{
// 				style: {
// 					marginTop: '40px',
// 					backgroundColor: 'orange',
// 					width: '100%',
// 					height: '600px',
// 					display: 'flex',
// 					flexDirection: 'column',
// 				},
// 			},
// 			[
// 				createVNode('span', null, number.value),
// 				createVNode(
// 					'div',
// 					{
// 						style: {
// 							width: '100%',
// 							display: 'flex',
// 							alignItems: 'center',
// 						},
// 					},
// 					[
// 						createVNode(
// 							'button',
// 							{
// 								onClick: add,
// 							},
// 							'增加'
// 						),
// 						createVNode(
// 							'button',
// 							{
// 								onClick: dec,
// 							},
// 							'减少'
// 						),
// 					],
// 				),
// 				createVNode('span', null, `原数 * 2 = ${numberChengTwo.value}`),
// 			]
// 		)
// 	},
// }
//
// const CompOne = {
// 	setup() {
// 		console.log('One')
// 		const number = ref(20)
// 		const showChild = ref(true)
//
// 		const numberAddTen = computed(() => number.value + 10)
//
// 		const add = () => {
//
// 			number.value++
// 		}
//
// 		const dec = () => {
// 			number.value--
// 		}
//
// 		watch(number, (value) => {
// 			console.log('number改变了')
// 		})
//
// 		onBeforeMount(() => {
// 			console.log('进入了onBeforeMount钩子')
// 		})
//
// 		onMounted(() => {
// 			console.log('进入了onMounted钩子')
// 		})
//
// 		onBeforeUpdate(() => {
// 			console.log('进入了onBeforeUpdate钩子')
// 		})
//
// 		onUpdated(() => {
// 			console.log('进入了onUpdated钩子')
// 		})
//
// 		const changeNumber = (newValue) => {
// 			console.log('sss')
// 			number.value = newValue
// 		}
//
// 		const switchShow = () => {
// 			showChild.value = !showChild.value
// 		}
//
// 		return () => createVNode(
// 			'div',
// 			{
// 				style: {
// 					width: '100vw',
// 					height: '100vh',
// 					backgroundColor: 'green',
// 					display: 'flex',
// 					flexDirection: 'column',
// 				},
// 			},
// 			[
// 				createVNode('span', null, number.value),
// 				createVNode(
// 					'div',
// 					{
// 						style: {
// 							width: '100%',
// 							height: '40px',
// 							display: 'flex',
// 							alignItems: 'center',
// 						},
// 					},
// 					[
// 						createVNode('button', {onClick: dec}, 'dec'),
// 						createVNode('button', {style: {marginLeft: '20px',}, onClick: add}, 'add'),
// 						createVNode('button', {style: {marginLeft: '20px',}, onClick: switchShow, }, showChild ? '隐藏' : '展示')
// 					],
// 				),
// 				createVNode(
// 					'div',
// 					{
// 						style: {
// 							marginTop: '20px',
// 							display: 'flex',
// 							alignItems: 'center',
// 						},
// 					},
// 					[
// 						createVNode('span', null, `计算属性: ${numberAddTen.value}`),
// 					],
// 				),
// 				showChild.value ? createVNode(CompTwo) : createVNode('span', null, 's')
// 			],
// 		)
// 	},
// }
//
// const app = createApp(CompOne)
// app.mount(document.body)


import {isProxy, reactive} from './vue.js'
debugger
const t1 = reactive({})
console.log(isProxy(t1))

