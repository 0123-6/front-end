<template>
	<!--最外层-->
	<div class="module-four flex flex-col">
		<span>模块4</span>
		<div class="w-full flex flex-col">
			<span class="mt-2">展示复制到剪贴板功能</span>
			<textarea v-model="text"></textarea>
			<button class="mt-2 w-[100px]"
			        @click="copy">复制
			</button>
			<div class="w-full h-[300px] bg-red-400">
				<span>hh</span>
				<div class="w-full h-[100px ]">
					<span>s</span>
					<div class="el-slider__bar">测试</div>
				</div>
			</div>
			<el-slider v-model="value1"></el-slider>
			<el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
			<vxe-table
				border
				show-overflow
				ref="xTable1"
				height="300"
				:row-config="{isHover: true}"
				:sort-config="{trigger: 'cell'}"
				:scroll-y="{enabled: true}">
				<vxe-column type="seq" width="100"></vxe-column>
				<vxe-column field="name" title="Name" sortable></vxe-column>
				<vxe-column field="sex" title="Sex"></vxe-column>
				<vxe-column field="age" title="Age"></vxe-column>
				<vxe-column field="address" title="Address" show-overflow></vxe-column>
			</vxe-table>
			<draggable-comp/>
			<div class="w-full h-[1000px] bg-[blue]"></div>
			<MarkdownEditor :show-import-and-export="true"/>
			<MarkdownViewer class="mt-6" value="# 标题1 \n## 标题2"/>
			<div class="mt-5 flex items-center">
				<button @click="getData">发送请求</button>
				<button @click="getData2" class="ml-4">发送请求</button>
			</div>
			<div class="mt-5 flex items-center">
				<button ref="xlsx">解析XLSX</button>
				<button @click="clickExport">导出XLSX</button>
			</div>
		</div>
		<!--弹框-->
		<el-dialog
			v-dialog-drag
			title="提示"
			:visible.sync="dialogVisible"
			:modal-append-to-body="false"
			width="30%">
			<span>这是一段信息</span>
			<span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {copyTextToClipboard} from "@/util/copyTextToClipboard.ts";
import DraggableComp from "@/components/vue-draggable-plus/DraggableComp.vue";
import {isPhoneRegExp} from "@/util/validator.ts";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import {debounce, throttle} from "@/util/api.ts";
import {ableSelectFileByClick, ISelectFileProps} from "@/util/file.ts";
import {excelExport, excelParse, IExcelExportProps} from "@/util/excel.ts";

export default defineComponent({
	name: "ModuleFour",
	components: {
		MarkdownViewer,
		MarkdownEditor,
		DraggableComp,
	},
	data() {
		return {
			text: '',
			value1: 0,
			dialogVisible: false,
			// 防抖函数必须这样创建
			debounceGetData: () => {},
			debounceGetData2: () => {},
		}
	},
	created() {
		const phone = '186372738252'
		console.log(isPhoneRegExp.test(phone))
		// 创建防抖函数,防止多个组件共有debounce导致bug
		this.debounceGetData = debounce(this.getData, 600)
		this.debounceGetData2 = throttle(this.getData2, 3000)
	},
	mounted() {
		const clickProps: ISelectFileProps = {
			element: this.$refs.xlsx as HTMLElement,
			accept: '.xlsx, .xls',
			callback: async file => {
				excelParse({
					file,
					expectedKeyList: ['编号', '姓名', '性别', '年龄', '单位'],
					callback: excelData => {
						console.log(excelData)
					},
					callbackError: text => {
						this.$message({
							type: 'error',
							message: text,
							showClose: true,
						})
					}
				})
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

		this.$nextTick(() => {
			const $table = this.$refs.xTable1
			this.mockList(500).then(data => {
				if ($table) {
					$table.loadData(data)
				}
			})
		})
	},
	methods: {
		copy() {
			copyTextToClipboard(this.text)
			this.$message({
				type: 'success',
				message: '复制成功',
				showClose: true,
			})
		},
		mockList (size) {
			return new Promise(resolve => {
				const list = []
				for (let index = 0; index < size; index++) {
					list.push({
						name: `名称${index}`,
						sex: '0',
						num: 123,
						age: 18,
						num2: 234,
						rate: 3,
						address: 'shenzhen'
					})
				}
				resolve(list)
			})
		},
		getData() {
			console.log('点击了发送请求')
		},
		getData2() {
			console.log('点击了节流函数')
		},
		clickExport() {
			const data = [
				{
					'姓名': '夏翀',
					'年龄': 25,
				},
				{
					'姓名': '吕凤凤',
					'年龄': 24,
				},
				{
					'姓名': '江思雨',
					'年龄': 31,
				},
				{
					'姓名': '申梦瑶',
					'年龄': 32,
				},
				{
					'姓名': '唐建飞',
					'年龄': 33,
				},
				{
					'姓名': '马晓琪',
					'年龄': 28,
				},
				{
					'是': 's',
				}
			]
			const exportProps: IExcelExportProps = {
				fileName: '美女名单.xlsx',
				data,
				callback: () => {
					this.$message({
						type: 'success',
						message: '导出成功',
						showClose: true,
					})
				},
				callbackError: text => {
					this.$message({
						type: 'error',
						message: text,
						showClose: true,
					})
				}
			}
			excelExport(exportProps)
		},
	},
})
</script>

<style scoped>
.module-four {
	::v-deep .el-slider__bar {
		background-color: black;
	}
}
</style>


