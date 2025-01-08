let config = {
    grid: {
        left: '3%',
        right: '5%',
        bottom: '0',
        top: '20%',
        containLabel: true,
    },
    title: {
        text: '环境绩效评估总览',
        textStyle: {
            color: '#9EB5CD',
            fontSize: '14px'
        },
        // textAlign: 'center',
        // x: 'center',
        // y: 'top'
        // left: '10%'
        top: '0',
        left: '5px',
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
        ],
        axisTick: false,
        axisLine: {
            lineStyle: {
                color: '#163d63'
            }
        },
        axisLabel: {
            color: '#919DBE'
        }
    },
    yAxis: {
        axisLine: {
            show: true,
            lineStyle: {
                color: '#123753'
            }
        },
        type: 'value',
        max: 500,
        min: 100,
        splitLine: {
            lineStyle: {
                color: '#0a3155'
            }
        },
        axisLabel: {
            color: '#919CBE'
        },
    },
    color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
            {
                offset: 0,
                color: 'rgba(71,138,247,1)' // 0% 处的颜色
            },
            {
                offset: 1,
                color: 'rgba(71,138,247,0)' // 100% 处的颜色
            }
        ],
        globalCoord: false // 缺省为 false
    },
    series: [
        {
            data: [300, 310, 305, 330, 340, 360, 400, 350, 360, 340, 400, 410],
            type: 'line',
            areaStyle: {},
            symbol: 'none', //取消折点圆圈

            // smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#55b1f8'
                    }
                },
                itemStyle: {
                    color: '#55b1f8'
                }
            }
        }
    ]
}

export default config