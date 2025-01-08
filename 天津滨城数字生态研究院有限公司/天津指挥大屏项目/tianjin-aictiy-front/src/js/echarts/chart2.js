let config = {
    grid: {
        left: '3%',
        right: '5%',
        bottom: '8%',
        top: '20%',
        containLabel: true,
    },
    title: {
        text: ''
    },
    color: ['#4BA7F1', '#64D5A7'],

    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 5,
        orient: 'horizontal',
        align: 'left',
        show: true,
        itemStyle: {},
        icon: 'rect',
        itemHeight: 9, //修改icon图形大小
        itemWidth: 9,
        itemGap: 47,
        textStyle: {
            //图例文字的样式
            color: '#9EB5CD',
            fontSize: '12px'
        },
    },


    xAxis: {
        type: 'category',

        axisTick: false,

        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLabel: {
            color: '#919DBE',
            // margin: 0,
        },
        axisLine: {
            lineStyle: {
                color: '#163d63'
            }
        },
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            color: '#919DBE',
        },
        splitLine: {
            lineStyle: {
                color: '#163d63',
            },
        },
        max: 200,
    },
    series: [
        {
            name: '总数',
            type: 'line',
            data: [99, 110, 80, 140, 70, 75, 150],
            markPoint: {
                data: [
                    {type: 'max', name: 'Max'},
                    {type: 'min', name: 'Min'}
                ]
            },
        },
        {
            name: '受理数',
            type: 'line',
            data: [2, 36, 23, 14, 25, 13, 23],
            markPoint: {
                data: [
                    {type: 'max', name: 'Max'},
                    {type: 'min', name: 'Min'}
                ]
            },
        }
    ]
}

export default config