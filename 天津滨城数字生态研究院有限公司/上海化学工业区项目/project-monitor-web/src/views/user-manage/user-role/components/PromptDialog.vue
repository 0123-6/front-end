<template>
	<!--最外层-->
	<el-dialog
		v-model="showInner"
		append-to-body
		draggable
		destroy-on-close
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		class="prompt-dialog"
		width="328px"
	>
		<!--头部-->
		<template #header="{ close, titleId, titleClass }">
			<div class="flex items-center">
				<img src="../icon/info-circle.svg" alt="">
				<span class="ml-2 text-black text-lg font-medium leading-6">提示</span>
			</div>
		</template>
		<!--内容-->
		<div class="w-full flex flex-col">
			<span class="text-black text-sm leading-6">{{content}}</span>
			<!--底部按钮-->
			<div class="mt-6 flex justify-end items-center">
				<el-button @click="onCancel">取消</el-button>
				<el-button type="primary"
				           style="margin-left: 8px;"
				           @click="onOk"
				>确定</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script>
export default {
	name: "PromptDialog",
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
	},
	data() {
		return {

		};
	},
	computed: {
		showInner: {
			get() {
				return this.show;
			},
			set(val) {
				this.$emit('update:show', val);
			}
		},
	},
	methods: {
		onOk() {
			this.$emit('on-ok');
		},
		onCancel() {
			this.$emit('on-cancel');
		},
	},
};
</script>

<style lang="scss">

</style>
