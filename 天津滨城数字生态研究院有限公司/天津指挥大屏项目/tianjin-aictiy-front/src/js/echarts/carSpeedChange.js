let config = {
    title: {
        text: '路口车速变化情况',
        textStyle: {
            color: '#9EB5CD',
            fontSize: '16px'
        },
        // textAlign: 'center',
        top: '20px',
        left: '20px',

    },
    grid: {
        left: '3%',
        right: '5%',
        bottom: '8%',
        top: '20%',
        containLabel: true,
    },
    color: ['#4BA7F1', '#64D5A7'],

    tooltip: {
        trigger: 'axis'
    },
    legend: {
        show: true,
        itemStyle: {},
        itemWidth: '9px',
        itemHeight: '9px',
        textStyle: {
            color: '#9EB5CD',
        },
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLabel: {
            color: '#889EB9',
            margin: 20,
        },
        axisLine: {
            lineStyle: {
                color: '163d63',
            },
        },
        axisTick: {
            show: false,
        },
    },
    yAxis: {
        min: 0,
        max: 200,
        type: 'value',
        axisLabel: {
            color: '#919DBE',
        },
        splitLine: {
            lineStyle: {
                color: '#163d63',
            },
        },
    },
    series: [
        {
            name: '总数',
            type: 'line',
            data: [100, 130, 100, 140, 120, 105, 142],
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
            data: [72, 90, 70, 99, 90, 75, 100],
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