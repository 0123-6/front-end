<template>
	<!--最外层-->
	<div class="flex flex-col">
		<span class="text-xl">个人中心</span>
		<div class="mt-2 flex items-center">
			<span>姓名：</span>
			<span>{{$store.state?.user?.name || '默认姓名'}}</span>
		</div>
		<!--头像-->
		<div class="mt-5 flex items-center">
			<img ref="clickElement"
			     src="/default_avatar.jpg" alt=""
			     class="w-[400px] cursor-pointer">
			<div ref="dragElement"
			     class="ml-2 w-[400px] min-h-[400px] cursor-pointer bg-blue-700 flex justify-center items-center">
				<span>将文件拖到此处</span>
			</div>
		</div>
		<div class="mt-2 flex flex-col">
			<div class="flex items-center">
				<span>新姓名:</span>
				<input type="text" v-model="newName" autocomplete="off">
			</div>
			<button class="mt-2" @click="changeName">改变</button>
			<button class="mt-2" @click="clearState">clearState</button>
		</div>
		<img :src="imgUrl2"
		     alt=""
		     class="w-[300px] h-[300px]"
		>
		<!--弹框-->
		<dialog-comp :show.sync="dialogVisible"
		             width="1000px"
		             title="图片裁剪">
			<cropper-comp :img-url="imgUrl" @exportImg="onOk"/>
		</dialog-comp>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ableSelectFileByClick, ableSelectFileByDrag, ISelectFileProps} from "@/util/file.ts";
import DialogComp from "@/components/dialog-comp/DialogComp.vue";
import CropperComp from "@/components/CropperComp.vue";

export default defineComponent({
	name: "PersonCenter",
	components: {
		CropperComp,
		DialogComp,
	},
	data() {
		return {
			newName: '',
			dialogVisible: false,
			imgUrl: '',
			imgUrl2: '',
		}
	},
	created() {
		this.newName = this.$store.state.user.name
	},
	mounted() {
		// 设置点击选择文件元素
		const clickProps: ISelectFileProps = {
			element: this.$refs['clickElement']!,
			accept: 'image/*',
			callback: file => {
				console.log('点击读取成功')
				console.log(file)
				this.imgUrl = URL.createObjectURL(file)
				this.dialogVisible = true
			},
			callbackError: text => {
				this.$message({
					type: 'error',
					message: text,
					showClose: true,
				})
			},
		}
		ableSelectFileByClick(clickProps)

		// 设置拖拽选择文件元素
		const dragProps: ISelectFileProps = {
			element: this.$refs['dragElement']!,
			accept: 'image/*',
			callback: file => {
				console.log('拖拽读取成功')
				console.log(file)
			},
			callbackError: text => {
				this.$message({
					type: 'error',
					message: text,
					showClose: true,
				})
			},
		}
		ableSelectFileByDrag(dragProps)
	},
	methods: {
		changeName() {
			if (this.newName) {
				this.$store.commit('setUser', {
					...this.$store.state.user,
					name: this.newName,
				})
			}
		},
		clearState() {
			this.$store.commit('clear')
		},
		onOk(file) {
			this.dialogVisible = false
			this.imgUrl2 = URL.createObjectURL(file)
		},
	},
})
</script>
