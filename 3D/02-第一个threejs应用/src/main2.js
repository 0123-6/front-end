import * as THREE from 'three';
// 导入加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器添加到body
document.body.appendChild(renderer.domElement);
// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true

// 创建boxGeometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const materialList = [
	new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
	new THREE.MeshBasicMaterial({ color: 0x0000ff }),
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
	new THREE.MeshBasicMaterial({ color: 0xffff00 }),
	new THREE.MeshBasicMaterial({ color: 0x00ffff }),
	new THREE.MeshBasicMaterial({ color: 0xff00ff })
]
// 创建立方体
const cube = new THREE.Mesh(boxGeometry, materialList);
cube.position.set(0, 0, 0);
// 将立方体添加到场景
// scene.add(cube);
// 创建axesHelper
const axesHelper = new THREE.AxesHelper(5);
// 将axesHelper添加到场景
scene.add(axesHelper);

// 创建光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2);
// 将光源添加到场景
scene.add(light);



// 创建加载器
const loader = new GLTFLoader();
// 加载模型
loader.load(
	'/assets/model/bear.gltf',
	(gltf) => {
		console.log(gltf)
		scene.add(gltf.scene)
	},
);

function loopFunction() {
	controls.update()
	renderer.render(scene, camera)
	
	requestAnimationFrame(loopFunction)
}

loopFunction()
