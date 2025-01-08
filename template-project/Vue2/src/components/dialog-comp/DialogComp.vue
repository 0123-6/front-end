<template>
	<!--最外层 -->
	<el-dialog :key="key"
	           :visible="show"
	           v-dialog-drag
	           :title="title"
	           :width="width"
	           :top="top"
	           :append-to-body="true"
	           class="dialog-comp"
	           :close-on-click-modal="false"
	           :close-on-press-escape="false"
	           @close="dialogOnCancel"
	           @closed="dialogOnClosed"
	>
		<!--弹框内容-->
		<template v-slot:default>
			<slot name="default"/>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "DialogComp",
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			default: '提示',
		},
		width: {
			type: String,
			default: '500px',
		},
		top: {
			type: String,
			default: '15vh',
		},
	},
	data() {
		return {
			key: 0,
		}
	},
	methods: {
		dialogOnCancel() {
			this.$emit('update:show', false)
		},
		dialogOnClosed() {
			this.$nextTick(() => {
				this.key++
			})
		},
	},
})
</script>

<style>
/*最外层包裹*/
.dialog-comp {
	.el-dialog {
		margin: auto;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

		.el-dialog__header {
			height: 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20px;
			.el-dialog__title {
				font-size: 16px;
				line-height: 16px;
			}
			.el-dialog__headerbtn {
				position: static;
				top: unset;
				right: unset;
				padding: 4px;
				font-size: 22px;
			}
		}

		.el-dialog__body {
			padding: 0;
		}
	}
}
</style>
