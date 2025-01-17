图表的外层div为v-show控制时，echarts容易获取不到DOM的宽高，导致无法正常渲染。外层div为v-if的时候，没有这个问题。

也就是说，echarts只会渲染一次。

```ts
// 1. 获取承载图表的DOM元素
const basicLineChartRef = this.$refs.basicLineChartRef as HTMLDivElement
// 2. 获取图表对象
const basicLineChart = echarts.init(basicLineChartRef)
// 3. 设置echarts配置项
const basicLineChartOption: echarts.EChartsOption = {
  // 标题
  title: {
   text: '一级标题',
  },
  // x坐标轴
  xAxis: {
   type: 'category',
   data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',],
   // 坐标轴2边留白策略,类目轴和非类目轴设置和表现不一样
   // 类目轴可以设置true或false,默认为true,此时内容在2个刻度线之间,否则内容在刻度线上
   boundaryGap: true,
   // 坐标轴刻度对齐方式
   axisTick: {
    // 仅在类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
    alignWithLabel: true,
    // 坐标轴刻度是否朝内，默认朝外
    inside: false,
   },
    axisLabel: {
      color: '#646464',
      // 显示所有label
      interval: 0,
      // 隐藏文字溢出的label
      hideOverlap: true,
    },
  },
  // y坐标轴,为value时可以不指定data,而是从series中获取
  yAxis: {
   type: 'value',
   // 最小间隔
   minInterval: 1,
   // 坐标轴的分割段数,预估值
   splitNumber: 5,
   // 一个两个值的数组，分别表示数据最小值和最大值的延伸范围
   // boundaryGap: ['20%', '20%'],
  },
  // 系列
  series: [
   // 第一组数据
   {
    // 类型
    type: 'line',
    name: '销量',
    // 数据
    data: [10, 20, 30, 40, 50, 60, 70,],
    // 数值是否显示
    label: {
     show: true,
     position: 'top',
    },
    // 是否是平滑曲线,默认为false
    smooth: true,
    // 面积图,默认为undefined,设置为真值则表示启用面积图
    areaStyle: {},
    // 堆叠
    stack: 'aaa',
    // emphasis: {
    //   focus: 'series'
    // },
   },
   // 第二组数据
   {
    type: 'line',
    name: '销售额',
    data: [10, 20, 30, 40, 50, 60, 70,],
    label: {
     show: true,
     position: 'top',
    },
    smooth: false,
    areaStyle: {},
    stack: 'aaa',
    // emphasis: {
    //   focus: 'series'
    // },
   },
   // 第三组数据
   {
    type: 'bar',
    name: '回头客',
    data: [
     5,
     10,
     15,
     // 设置单个柱子颜色
     {
      value: 20,
      itemStyle: {
       color: 'blue',
      },
     },
     25,
     30,
     25,
    ],
    label: {
     show: true,
     position: 'top',
    },
    // 柱状图的宽度,默认自适应,10, '40%',
    barWidth: 10,
    // barMinWidth和barMaxWidth的优先级更高
    barMinWidth: undefined,
    barMaxWidth: undefined,
    // 设置柱状图背景颜色
    showBackground: true,
    backgroundStyle: {
     color: 'red',
    },
   },
  ],
  // 图例组件
  legend: {
   show: true,
   // 类型, 'plain'(默认,普通图例), 'scroll'(可滚动图例)
   type: 'plain',
   // 无需设置,自动从series数组中读取
   data: undefined,
  },
  // 坐标轴位置
  grid: {
   // left默认'10%'
   left: '3%',
   // right默认'10%'
   right: '10%',
   // top默认60
   top: 30,
   // bottom默认60
   bottom: 30,
   // 坐标轴区域是否包含标签,默认为false,设置为true可以防止标签溢出
   containLabel: true,
  },
  // 悬浮效果,默认为undefined表示不启用,设置为真值表示启用
  tooltip: {
   // 何时触发,触发条件,可选 'item'(默认,悬浮触发), 'axis'(坐标轴触发), 'none'(不触发)
   trigger: 'axis',
   axisPointer: {
    // "line" | "none" | "shadow" | "cross" | undefined
    type: 'shadow',
    label: {
     backgroundColor: '#6a7985',
    },
   },
  },
}
// 4. 图表对象设置配置项
basicLineChart.setOption(basicLineChartOption)
```

