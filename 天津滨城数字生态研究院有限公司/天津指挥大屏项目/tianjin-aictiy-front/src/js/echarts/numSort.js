let config = {
    grid: {
        left: '3%',
        right: '10%',
        bottom: 20,
        top: '13%',
        containLabel: true,
    },
    title: {
        text: '所属街道数量排名TOP5',
        textStyle: {
            color: '#9EB5CD',
            fontSize: '16px'
        },
        textAlign: 'center',
        x: 'center',
        y: 'top',
        left: '50%',
    },
    color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
            {
                offset: 0,
                color: 'rgba(71,138,247,0.54)' // 0% 处的颜色
            },
            {
                offset: 1,
                color: 'rgba(71,138,247,1)' // 100% 处的颜色
            }
        ],
        globalCoord: false // 缺省为 false
    },

    xAxis: {
        type: 'value',
        splitLine: {
            show: false,
        },
        axisLabel: {
            color: '#889EB9',
            margin: 1,
        },

    },
    yAxis: {
        axisLabel: {
            color: '#889EB9',
        },

        axisTick: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        type: 'category',
        data: ['中华路', '黄河大道', '长江大道', '文明路', '文昌路'],
        inverse: true,
        // animationDuration: 300,
        // animationDurationUpdate: 300,
        max: 4 // only the largest 3 bars will be displayed
    },
    series: [
        {
            realtimeSort: true,
            // name: '销量',
            type: 'bar',
            barWidth: '9px',
            data: [23, 14, 39, 8, 22],
            label: {
                show: true,
                position: 'right',
                valueAnimation: true,
                color: '#889EB9',

            }
        }
    ],
    legend: {
        show: true
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
}

export default config