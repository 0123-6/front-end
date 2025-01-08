// 导入three.js
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 导入GUI
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

// 创建场景
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
	45, // 视野角度
	window.innerWidth / window.innerHeight, // 宽高比
	0.1, // 近平面
	1000 // 远平面
)
// 设置相机位置
camera.position.z = 5
camera.position.y = 2
camera.position.x = 2
camera.lookAt(0, 0, 0)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 创建立方体数学模型
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, })
const materialList = [
	new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
	new THREE.MeshBasicMaterial({ color: 0x0000ff }),
	new THREE.MeshBasicMaterial({ color: 0xffff00 }),
	new THREE.MeshBasicMaterial({ color: 0x00ffff }),
	new THREE.MeshBasicMaterial({ color: 0xff00ff }),
]
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

// 创建一个父元素cube
// const group = new THREE.Group()
const parentCube = new THREE.Mesh(geometry, parentMaterial)
// 创建多边形网格，将立方体模型和材质添加到网格中
const cube = new THREE.Mesh(geometry, materialList)
parentCube.add(cube)
parentCube.position.set(-3,0,0)
cube.rotation.x = Math.PI / 4


cube.position.set(3,0,0)

cube.scale.set(0.5, 0.5, 0.5)
parentCube.scale.set(4, 4, 4)
parentCube.rotation.x = Math.PI / 4

const mesh3 = new THREE.Mesh(geometry, material)
mesh3.position.set(0, 0, 0)
mesh3.rotation.x = Math.PI / 4
scene.add(mesh3)


// 将立方体添加到场景
scene.add(parentCube)

// 创建几何体
const geometry2 = new THREE.BufferGeometry()
// 创建顶点
const vertices = new Float32Array([
	-1, -1, 0,
	1, -1, 0,
	1, 1, 0,
	-1, 1, 0,
])
// 创建索引
const indices = new Uint16Array([
	0, 1, 2,
	2, 3, 0,
])
// 创建顶点属性
geometry2.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// 创建索引属性
geometry2.setIndex(new THREE.BufferAttribute(indices, 1))
// 设置2个顶点组，形成2个材质
geometry2.addGroup(0, 3, 0)
geometry2.addGroup(3, 3, 1)

// 创建材质
const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff,wireframe:false,side:THREE.DoubleSide })
const material3 = new THREE.MeshBasicMaterial({ color: 0xff0000,wireframe:true,side:THREE.DoubleSide })

// 创建网格
const mesh2 = new THREE.Mesh(geometry2, [material2, material3])
// 设置网格位置
mesh2.position.set(0, 0, 0)
// 将网格添加到场景
scene.add(mesh2)

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的鼠标拖拽
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.05
// 设置自动旋转
controls.autoRotate = false

// 渲染函数
function animate() {
	controls.update()
	requestAnimationFrame(animate)
	// cube.rotation.x += 0.01
	// cube.rotation.y += 0.01
	// 使mesh绕着z轴旋转
	// mesh.rotation.z += 3.14159*2 / 480
	renderer.render(scene, camera)
}
// 渲染
animate()

// 监听窗口变化
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

// const btn = document.createElement('button')
// btn.innerHTML = '点击全屏'
// document.body.appendChild(btn)
// btn.style.position = 'absolute'
// btn.style.top = '10px'
// btn.style.left = '10px'
// btn.style.zIndex = '300'
// btn.onclick = function () {
// 	document.body.requestFullscreen()
// }
//
// // 退出全屏
// const exitBtn = document.createElement('button')
// exitBtn.innerHTML = '退出全屏'
// document.body.appendChild(exitBtn)
// exitBtn.style.position = 'fixed'
// exitBtn.style.top = '10px'
// exitBtn.style.left = '100px'
// exitBtn.style.zIndex = '900'
// exitBtn.onclick = function () {
// 	document.exitFullscreen()
// }

const eventObj = {
	fullScreen: function () {
		document.body.requestFullscreen()
	},
	exitFullScreen: function () {
		document.exitFullscreen()
	}
}
const gui = new GUI()
const folder = gui.addFolder('全屏')
folder.add(eventObj, 'fullScreen').name('点击全屏')
folder.add(eventObj, 'exitFullScreen').name('退出全屏')
folder.open()
// 控制立方体的位置
const cubeFolder = gui.addFolder('立方体位置')
cubeFolder.add(cube.position, 'x', -5, 5).name('x轴位置')
cubeFolder.add(cube.position, 'y', -5, 5).name('y轴位置')
cubeFolder.add(cube.position, 'z', -5, 5).name('z轴位置')
cubeFolder.open()
// 控制立方体的旋转
const rotationFolder = gui.addFolder('立方体旋转')
rotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2).name('x轴旋转')
rotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2).name('y轴旋转')
rotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2).name('z轴旋转')
rotationFolder.open()
// 控制立方体的缩放
const scaleFolder = gui.addFolder('立方体缩放')
scaleFolder.add(cube.scale, 'x', 0, 5).name('x轴缩放')
scaleFolder.add(cube.scale, 'y', 0, 5).name('y轴缩放')
scaleFolder.add(cube.scale, 'z', 0, 5).name('z轴缩放')
scaleFolder.open()
// 控制立方体是否是线框模式
// const wireframeFolder = gui.addFolder('立方体线框模式')
// wireframeFolder.add(cube.material, 'visible').name('是否可见')
// wireframeFolder.add(cube.material, 'wireframe').name('线框模式')
// wireframeFolder.open()
// 控制立方体的颜色
// const colorFolder = gui.addFolder('立方体颜色')
// colorFolder.addColor({ color: 0x00ff00 }, 'color').name('立方体颜色').onChange((color) => {
// 	cube.material.color.set(color)
// })
// colorFolder.open()
// 控制相机的位置
// const cameraFolder = gui.addFolder('相机位置')
// cameraFolder.add(camera.position, 'x', -5, 5).name('x轴位置')
// cameraFolder.add(camera.position, 'y', -5, 5).name('y轴位置')
// cameraFolder.add(camera.position, 'z', -5, 5).name('z轴位置')
// cameraFolder.open()

const geometry100 = new THREE.BoxGeometry(1, 1, 1)
const material100 = new THREE.MeshBasicMaterial({color: 0xff0000})

const cube100 = new THREE.Mesh(geometry100, material100)
cube100.position.set(10, 10, 0)

const cube101 = new THREE.Mesh(geometry100, material100)
cube101.position.set(-10, -10, 0)

const group = new THREE.Group()
group.add(cube100)
group.add(cube101)

scene.add(group)

console.log(group)

