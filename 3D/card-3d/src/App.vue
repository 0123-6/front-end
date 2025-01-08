<script setup>
import * as THREE from 'three';
// 轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// 加载draco压缩的模型
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// 加载环境纹理
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// 加载水面
import { Water } from 'three/examples/jsm/objects/Water2.js';
// 补间动画
import gsap from 'gsap';
import {ref} from "vue";

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(-3.23, 2.98, 4.06)
camera.lookAt(0, 0, 0);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
	// 抗锯齿
	antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 设置色调映射
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

// 添加控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-8, 2, 0);
controls.enableDamping = true;

// 添加axes辅助
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materialList = [
	new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
	new THREE.MeshBasicMaterial({ color: 0x0000ff }),
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
	new THREE.MeshBasicMaterial({ color: 0xffff00 }),
	new THREE.MeshBasicMaterial({ color: 0x00ffff }),
	new THREE.MeshBasicMaterial({ color: 0xff00ff }),
]
const mesh = new THREE.Mesh(geometry, materialList);
scene.add(mesh);
// 添加点光源
const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(0.1, 2.4, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// 创建点光源组
const pointLightGroup = new THREE.Group();
let radius = 3;
const pointLightArr = []
for(let i = 0; i < 3; i++) {
	// 创建球体
	const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		emissive: 0xffffff,
		emissiveIntensity: 10,
	});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(
		radius * Math.cos((i * 2 * Math.PI) / 3),
		Math.cos((i * 2 * Math.PI) / 3),
		radius * Math.sin((i * 2 * Math.PI) / 3),
	)
	const pointLight = new THREE.PointLight(0xffffff, 50);
	sphere.add(pointLight);
	pointLightGroup.add(sphere)
	pointLightArr.push(sphere)
}
pointLightGroup.position.set(-8, 2.5, -1.5)
scene.add(pointLightGroup);

// 添加模型
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load('/model/scene.glb', (gltf) => {
	gltf.scene.traverse((child) => {
		if (child.name === 'Plane') {
			child.visible = false
		}
		if(child.isMesh) {
			child.castShadow = true
			child.receiveShadow = true
		}
	})
	scene.add(gltf.scene)
})

// 加载环境纹理
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/sky.hdr', (texture) => {
	texture.mapping = THREE.EquirectangularReflectionMapping
	scene.environment = texture
	scene.background = texture
})

// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 32);
const water = new Water(
	waterGeometry,
	{
		textureWidth: 1024,
		textureHeight: 1024,
		color: 0xeeeeff,
		flowDirection: new THREE.Vector2(1, 1),
		scale: 100,
	}
);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.4;
scene.add(water);

// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 50, 0);
scene.add(light);



// 添加window resize事件
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

let options = {
	angle: 0,
};
gsap.to(options, {
	angle: Math.PI * 2,
	duration: 10,
	repeat: -1,
	ease: "linear",
	onUpdate: () => {
		pointLightGroup.rotation.y = options.angle;
		pointLightArr.forEach((item, index) => {
			item.position.set(
				radius * Math.cos((index * 2 * Math.PI) / 3),
				Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
				radius * Math.sin((index * 2 * Math.PI) / 3)
			);
		});
	},
});


function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}
animate();

// 使用补间动画移动相机
const timeLine1 = gsap.timeline();
const timeLine2 = gsap.timeline();

function translateCamera(position, target) {
	timeLine1.to(camera.position, {
		x: position.x,
		y: position.y,
		z: position.z,
		duration: 1,
		ease: 'power2.inOut',
	});
	timeLine2.to(controls.target, {
		x: target.x,
		y: target.y,
		z: target.z,
		duration: 1,
		ease: 'power2.inOut',
	});
}

const scenes = [
	{
		text: '圣诞快乐',
		callback: () => {
			// 执行函数切换位置
			translateCamera(
				new THREE.Vector3(-3.23, 2.98, 4.06),
				new THREE.Vector3(-8, 2, 0)
			)
		},
	},
	{
		text: '感谢在这么大的世界中遇见你',
		callback: () => {
			// 执行函数切换位置
			translateCamera(
				new THREE.Vector3(7, 0, 23),
				new THREE.Vector3(0, 0, 0)
			)
		},
	},
	{
		text: '愿和你去探索世界的每一个角落',
		callback: () => {
			// 执行函数切换位置
			translateCamera(
				new THREE.Vector3(10, 3, 0),
				new THREE.Vector3(5, 2, 0),
			)
		},
	},
	{
		text: '愿将天上的星星都摘下来送给你',
		callback: () => {
			// 执行函数切换位置
			translateCamera(
				new THREE.Vector3(7, 0, 23),
				new THREE.Vector3(0, 0, 0)
			)

		},
	},
	{
		text: '愿疫情结束，大家健康快乐',
		callback: () => {
			// 执行函数切换位置
			translateCamera(
				new THREE.Vector3(-20, 1.3, 6.6),
				new THREE.Vector3(5, 2, 0)
			)
		},
	},
]
let index = ref(0)
let isAnimte = false
window.addEventListener('wheel', (e) => {
	if(isAnimte) return
	isAnimte = true
	if(e.deltaY > 0) {
		index.value++
		if(index.value > scenes.length - 1) {
			index.value = 0
		}
	}
	scenes[index.value].callback()
	setTimeout(() => {
		isAnimte = false
	}, 1000)
}, false)

// 实例化创建满天星星
let starsInstance = new THREE.InstancedMesh(
	new THREE.SphereGeometry(0.1, 32, 32),
	new THREE.MeshBasicMaterial({
		color: 0xffffff,
		emissive: 0xffffff,
		emissiveIntensity: 10,
	}),
	100
);
// 随机生成星星位置
const starsArr = []
const endArr = []
for(let i = 0; i < 100; i++) {
const x = Math.random() * 100 - 50
	const y = Math.random() * 100 - 50
	const z = Math.random() * 100 - 50
	starsArr.push(x, y, z)
	let matrix = new THREE.Matrix4()
	matrix.setPosition(x, y, z)
	starsInstance.setMatrixAt(i, matrix)
}
scene.add(starsInstance)

// 生成爱心路径
let heartShape = new THREE.Shape()
heartShape.moveTo(25, 25)
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0)
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35)
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95)
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35)
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0)
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25)
let points = heartShape.getPoints(100)
let geometry1 = new THREE.BufferGeometry().setFromPoints(points)
let material1 = new THREE.LineBasicMaterial({ color: 0xff0000 })
let line = new THREE.Line(geometry1, material1)
scene.add(line)

</script>

<template>
	<div class="scenes"
	     style="position: fixed;z-index: 10;left: 0;top: 0;pointer-events: none;transition: all 1s;"
	     :style="{
				 transform: `translate3d(0, ${-index * 100}vh, 0)`,
	     }"
	>
		<div v-for="(item, index) in scenes"
		     style="width: 100vw;height: 100vh;"
		>
			<h1 style="padding: 100px 50px;font-size: 50px;color: white">{{item.text}}</h1>
		</div>
	</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
}
body {
	width: 100vw;
	height: 100vh;
}
.canvas {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
}
</style>
