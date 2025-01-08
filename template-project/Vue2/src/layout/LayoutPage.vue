<template>
	<!--最外层-->
	<div class="layout-page h-full flex flex-col">
		<!--导航栏-->
		<div class="h-[62px] flex justify-between items-center bg-white"
		     style="box-shadow: rgba(20, 38, 82, 0.06) 0 1px 4px 0;"
		>
			<!--左-->
			<div class="flex items-center pl-[60px]">
				<img src="/login/favicon.svg" alt="" class="w-[37px] h-[37px]" draggable="false">
				<span class="ml-1 text-lg font-bold">韩佩江测试网站</span>
				<!--导航区域-->
				<div class="ml-[50px] flex items-center gap-x-4">
					<RouterLink to="/index" replace class="p-2 text-[#333333] font-medium hover:text-primary active:text-primary-active">首页</RouterLink>
					<RouterLink to="/module-two" replace class="p-2 text-[#333333] font-medium hover:text-primary active:text-primary-active">模块2</RouterLink>
					<RouterLink to="/module-three" replace class="p-2 text-[#333333] font-medium hover:text-primary active:text-primary-active">模块3</RouterLink>
					<RouterLink to="/module-four" replace class="p-2 text-[#333333] font-medium hover:text-primary active:text-primary-active">模块4</RouterLink>
					<RouterLink to="/manage" replace class="p-2 text-[#333333] font-medium hover:text-primary active:text-primary-active">管理员</RouterLink>
				</div>
			</div>
			<!--右-->
			<el-popover placement="bottom"
			            trigger="hover"
			            popper-class="el-popper-layout-page"
			>
				<div slot="reference"
				     class="flex items-center mr-[90px] cursor-pointer"
				>
					<img :src="$store.state?.user?.avatar"
					     alt=""
					     class="w-[50px] h-[50px] rounded-full"
					     draggable="false">
					<span class="ml-2 text-[#333333]">{{$store.state?.user?.phone}}</span>
				</div>
				<div class="w-[200px] flex flex-col">
					<button class="mt-2 h-[40px] pl-[30px] rounded flex items-center text-sm cursor-pointer text-primary hover:text-white hover:bg-primary-hover"
					     @click="goPersonCenter">
						<span>个人中心</span>
					</button>
					<button class="mt-2 h-[40px] pl-[30px] rounded flex items-center text-sm cursor-pointer text-primary hover:text-white hover:bg-primary-hover"
					     @click="logout">
						<span>退出登录</span>
					</button>
				</div>
			</el-popover>

		</div>
		<!--内容区域-->
		<div ref="content"
		     data-overlayscrollbars-initialize
		     class="flex flex-col"
		     style="height: calc(100% - 62px);"
		>
			<div class="flex-grow flex flex-col">
				<!--组件自动width: 100%;flex-grow-->
				<RouterView class="flex-grow"/>
				<!--备案-->
				<div class="h-[60px] flex justify-center items-center bg-white">
					<!--方便选中-->
					<div class="p-4 flex items-center">
						<a href="">备案号</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import overlayScrollbar from "@/util/overlayScrollbar.ts";
import {OverlayScrollbars} from "overlayscrollbars";

export default defineComponent({
	name: "LayoutPage",
	data() {
		return {
			overlayScrollbar: null as unknown as OverlayScrollbars,
		}
	},
	watch: {
		'$route'() {
			const {scrollOffsetElement} = this.overlayScrollbar.elements()
			scrollOffsetElement.scroll(0, 0)
		},
	},
	mounted() {
		this.overlayScrollbar = overlayScrollbar({
			element: this.$refs.content as HTMLDivElement,
			autoHide: false,
		})
	},
	destroyed() {
		this.overlayScrollbar.destroy()
	},
	methods: {
		goPersonCenter() {
			this.$router.replace('/person-center')
		},
		logout() {
			this.$store.commit('setUser')
			this.$router.replace('/login')
		},
	},
})
</script>

<style>
.layout-page {
}
/*使用!important覆盖*/
.el-popover.el-popper-layout-page[x-placement^=top] {
	padding: 0;
	margin-bottom: 6px;

	/*修改箭头的颜色*/
	.popper__arrow {
		border-top-color: orange;
		/*箭头距离矩形元素的偏移值*/
		bottom: -3px;
	}
	.popper__arrow::after {
		border-top-color: orange;
	}
}
</style>
