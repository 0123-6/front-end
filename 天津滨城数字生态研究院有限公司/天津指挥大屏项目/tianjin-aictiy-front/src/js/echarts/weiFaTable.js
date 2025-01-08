let config = {
    grid: {
        left: '3%',
        right: '5%',
        bottom: '0',
        top: '15%',
        containLabel: true,
    },
    color: ['#64D5A7', '#4BA7F1', '#FBFE9A', '#5FCCF6', '#99C3FA'],
    title: {
        text: '问题类型分布',
        textStyle: {
            color: '#9EB5CD',
            fontSize: '16px'
        },
        textAlign: 'center',
        x: 'center',
        y: 'top',
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        width: '9px',
        // top: '5%',
        // left: 'center',
        right: '10%',
        top: '19%',

        orient: 'vertical',
        align: 'left',
        textStyle: {
            //图例文字的样式
            color: '#9EB5CD',
            fontSize: '12px'
        },
        icon: 'rect',
        itemHeight: 9, //修改icon图形大小
        itemWidth: 9,
        itemGap: 18,
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['33%', '55%'],
            avoidLabelOverlap: false,

            label: {
                normal: {
                    show: true,
                    position: 'center',
                    color: '#4c4a4a',
                    formatter:
                        '{total|' + 484 + '}' + '\n\r' + '{active|交管}',
                    rich: {
                        total: {
                            fontSize: 28,
                            fontFamily: '微软雅黑',
                            color: '#E2F3FF',
                        },
                        active: {
                            fontFamily: '微软雅黑',
                            fontSize: 16,
                            color: '#E2F3FF',
                        }
                    }
                },
                emphasis: {
                    //中间文字显示
                    show: true
                }
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            lableLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                },
                tooltip: {
                    show: false
                }
            },
            data: [
                {value: 1048, name: '问题1'},
                {value: 735, name: '问题2'},
                {value: 580, name: '问题3'},
                {value: 484, name: '问题4'},
                {value: 300, name: '问题5'}
            ]
        }
    ]
}

export default config
