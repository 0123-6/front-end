<template>
	<!--最外层-->
	<div class="bg-primary flex flex-col">
		<span class="text-xl">{{number}}</span>
		<span class="mt-4 text-xl text-red-500">你好,vue2</span>
		<div ref="testEchartsRef"
		     class="w-[500px] h-[500px]"></div>
		<el-button type="primary" @click="clickButton">主要按钮,hhh</el-button>
		<el-button type="success">成功按钮,hhh</el-button>
		<el-button type="danger">失败按钮,hhh</el-button>
		<el-button type="warning">警示按钮,hhh</el-button>
		<test-comp/>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {cloneDeep} from "lodash";
import * as echarts from 'echarts';
import {copyTextToClipboard} from "@/util/copyTextToClipboard.ts";
import dayjs from "dayjs";
import TestComp from "@views/index/TestComp.vue";

export default defineComponent({
	name: "IndexPage",
	components: {TestComp},
	data() {
		return {
			number: 10,
		};
	},
	created() {
		const obj = cloneDeep({});
		console.log(obj);
		const getData = async () => {
			const res = await fetch('https://mock.apipark.cn/m1/1998724-1718330-default/pet/1')
			const resData = await res.json()
			console.log('resData: ', resData);
		};
		getData();
		const day = dayjs('2018-05-05').locale('zh-cn').format()
		console.log(day)
	},
	mounted() {
		// 测试echarts
		var chartDom = this.$refs.testEchartsRef!
		console.log(chartDom)
		console.log(chartDom.offsetWidth)
		console.log(chartDom.offsetHeight)
		var myChart = echarts.init(chartDom);
		var option;

		option = {
			xAxis: {
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					data: [150, 230, 224, 218, 135, 147, 260],
					type: 'line'
				}
			]
		};

		option && myChart.setOption(option);
		copyTextToClipboard('你好')
	},
	methods: {
		clickButton() {
			debugger
			this.number++;
			debugger
		},
	}
})
</script>
