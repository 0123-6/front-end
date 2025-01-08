import {useEffect} from "react";
// 导入three.js
import * as THREE from 'three'
import './App.css'

export default function App() {
	// state
	// mounted
	useEffect(() => {
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
		camera.lookAt(0, 0, 0)
		
		// 创建渲染器
		const renderer = new THREE.WebGLRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(renderer.domElement)

		// 创建立方体
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		// 创建材质
		const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
		// 创建网格
		const cube = new THREE.Mesh(geometry, material)
		// 将立方体添加到场景
		scene.add(cube)
		
		// 渲染函数
		function animate() {
			cube.rotation.x += 0.01
			cube.rotation.y += 0.01
			renderer.render(scene, camera)
			
			requestAnimationFrame(animate)
		}
		// 渲染
		animate()
	}, []);
	// methods
	// render
	return (
		<>
			<div className='App'></div>
		</>
	)
}
