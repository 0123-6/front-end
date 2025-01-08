import './style/index.css'
import './index.css'
import {cloneDeep, curry} from "lodash";
import axios from "axios";
import * as echarts from 'echarts';
import {onLCP, onFID, onCLS} from 'web-vitals';

const obj = cloneDeep({
	name: 'hpj',
	age: 25,
});
console.log(obj);

document.getElementById('app').innerHTML = `
<div>
	<img src="/ACM.jpg" alt="" style="width: 100vw;">
	<span class="text-blue-700 text-6xl">你好,无框架</span>
	<div id="test-echarts"
	 class="w-[500px] h-[500px]"></div>
</div>
`;

const getData = async () => {
	const res = await axios.get('https://mock.apifox.com/m1/4213473-0-default/pet/1')
	console.log('res: ', res);
};

getData();

// 测试echarts
var chartDom = document.getElementById('test-echarts');
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

onCLS(console.log);
onFID(console.log);
onLCP(console.log);

window.curry = curry;
