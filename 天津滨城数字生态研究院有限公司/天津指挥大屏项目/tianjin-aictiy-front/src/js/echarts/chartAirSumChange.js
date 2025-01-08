let config = {
    grid: {
        left: '3%',
        right: '5%',
        bottom: '10%',
        top: '20%',
        containLabel: true
    },
    title: {
        text: '近七日总供气量变化',
        textStyle: {
            color: '#9EB5CD',
            fontSize: '14px'
        },
        // textAlign: 'center',
        // x: 'center',
        // y: 'top'
        left: '5px',
        top: '6px'
    },
    xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五'],
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
        max: 200,
        min: 0,
        splitLine: {
            lineStyle: {
                color: '#0a3155'
            }
        },
        axisLabel: {
            color: '#919CBE'
        }
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
                color: 'rgba(71,138,247,0.54)' // 0% 处的颜色
            },
            {
                offset: 1,
                color: 'rgba(71,138,247,1)' // 100% 处的颜色
            }
        ],
        globalCoord: false // 缺省为 false
    },
    series: [
        {
            data: [30, 100, 100, 150, 120],
            type: 'bar',
            areaStyle: {},
            barWidth: '8px',
            symbol: 'none', //取消折点圆圈

            // smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#12d3a1'
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