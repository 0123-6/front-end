// 导入THREE
import * as THREE from '/modules/three.module.js'

// 导入轨道控制器
import { OrbitControls } from '/modules/OrbitControls.js'

// 创建场景,scene本质是一个Javascript对象
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
	45,// 视野角度
	window.innerWidth / window.innerHeight,// 宽高比
	0.1,// 近平面
	1000,// 远平面
)
// 设置相机位置
camera.position.z = 8
camera.position.y = 4
camera.position.x = 4
camera.lookAt(0, 0, 0)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
// 和DOM相关操作
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 创建立方体,数学表示
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
// 创建可添加到scene场景的物体
const cube = new THREE.Mesh(geometry, material)
// 将立方体添加到场景
scene.add(cube)

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 再创建几个物体
const geometry2 = new THREE.BoxGeometry(1, 1, 1)
const material2 = new THREE.MeshBasicMaterial({color: 0xff0000})
const cube2 = new THREE.Mesh(geometry2, material2)
cube2.position.set(2, 1, 1)

const cube3 = new THREE.Mesh(geometry2, material2)
cube3.position.set(-1, -2, 0)

const group = new THREE.Group()
group.add(cube2)
group.add(cube3)

scene.add(group)

// 使用原始方式
const geometry3 = new THREE.BufferGeometry()
// 创建一个简单的矩形,在这里我们左上和右下顶点被复制了2次
// 因为在2个三角形中,这2个顶点都被使用了
const vertices = new Float32Array([
	-1.0, -1.0, 1.0,
	1.0, -1.0, 1.0,
	1.0, 1.0, 1.0,
	
	// 1.0, 1.0, 1.0,
	// -1.0, 1.0, 1.0,
	// -1.0, -1.0, 1.0
])
// itemSize=3因为每个顶点有3个值(x,y,z)
geometry3.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material3 = new THREE.MeshBasicMaterial({
	color: 0x7000f0,
	side: THREE.DoubleSide,
})
const mesh = new THREE.Mesh(geometry3, material3)
mesh.position.set(0, 0, 2)
scene.add(mesh)

// 添加轨道控制器,可以控制相机的位置和其它属性
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼
controls.enableDamping = true
controls.dampingFactor = 0.05
// 设置自动旋转
controls.autoRotate = true

function loopFunc() {
	controls.update()
	cube.rotation.x += 0.01
	cube.rotation.y += 0.01
	renderer.render(scene, camera)
	
	requestAnimationFrame(loopFunc)
}

loopFunc()


























