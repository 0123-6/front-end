<template>
		<!--内容最外层-->
		<el-scrollbar wrap-style="width: 100%; height: 100%;"
		              view-style="width: 100%; min-height: 100%;display: flex; flex-direction: column;">
			<div class="w-full flex-1 flex flex-col px-8">
				<!--tab栏-->
				<el-radio-group class="ee-capsule mt-5 flex-shrink-0"
				                v-model="type">
					<el-radio-button label="常用功能设置" />
					<el-radio-button label="工作台设置" />
				</el-radio-group>
				<!--说明文本-->
				<div class="flex-shrink-0 mt-4 mb-4 h-[46px] flex items-center rounded-lg pl-4"
				     style="background-color: rgba(2, 173, 236, 0.10);">
					<svg-icon icon-class="info-circle" width="16px" height="16px" />
					<span class="ml-2.5 text-sm text-black-two leading-[22px]">说明：关注内容会根据配置的规则显示，若规则都清空，则关注内容模块隐藏不显示</span>
				</div>
				<!--常用功能设置-->
				<function-panel-setting v-if="type === '常用功能设置'"
				                        @on-ok="functionPanelSettingOnOk"
				                        @on-cancel="onCancel"
				/>
				<!--工作台设置-->
				<workbench-setup v-if="type === '工作台设置'"
				                 @on-ok="workbenchSetupOnOk"
				                 @on-cancel="onCancel"
				/>
			</div>
		</el-scrollbar>
</template>

<script>
import FunctionPanelSetting from "@/views/index/setting-drawer/function-panel-setting/FunctionPanelSetting";
import WorkbenchSetup from "@/views/index/setting-drawer/workbench-setup/WorkbenchSetup";

export default {
	name: 'SettingDrawer',
	components: {
		WorkbenchSetup,
		FunctionPanelSetting
	},
	emits: [
		'function-panel-setting-on-ok',
		'workbench-setup-on-ok',
		'on-cancel',
	],
	data() {
		return {
			type: '常用功能设置',
		};
	},
	methods: {
		// 常用功能设置
		functionPanelSettingOnOk() {
			this.$emit('function-panel-setting-on-ok');
		},
		// 工作台设置
		workbenchSetupOnOk() {
			this.$emit('workbench-setup-on-ok');
		},
		onCancel() {
			this.$emit('on-cancel');
		},
	},
};
</script>
