<template>
  <div
    class="ee-chart ee-chart--ring"
    :class="{ 'is-empty': isShowEmpty, 'use-dom-title': options.domTitle }"
    :style="{ minHeight: height, width: width }">
    <div class="ee-chart__title">{{ title }}</div>
    <div class="ee-chart__inner" :style="{ height: height, width: width }" />
    <div class="ee-chart__empty">暂无数据</div>
  </div>
</template>

<script>
/* eslint-disable */
import mixinChart from '@/utils/mixinChart';

export default {
  name: 'BaseRingChart',
  mixins: [mixinChart],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    // 父组件传递过来的图表数据
    chartData: {
      type: Object,
      required: true
    },
    colorList: {
      type: Array,
      default: () => ['#356DF6', '#8C7BF1', '#D260B2', '#B4D2FF', '#88CDFF', '#7DE0FF', '#83EDC7']
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    setOptions({ title, datas = [], totalNum, xdata = [], ydata = [] } = {}) {
      // if (this.className === 'companyTypeDistribute') {
      //   xdata = ['央企(国家和地方)1', '央企(国家和地方)2', '央企(国家和地方)3', '央企(国家和地方)4', '央企(国家和地方)5', '央企(国家和地方)'];
      //   ydata = [999999, 999999, 999999, 999999, 999999, 999999];
      //   totalNum = 999999;
      // }
      this.title = title;
      this.isShowEmpty = xdata.length === 0 && (datas.length === 0 || totalNum === 0);
      if (this.isShowEmpty) return;
      const { domTitle } = this.options;
      const self = this;
      const options = {
        title: {
          show: !domTitle,
          text: title,
          padding: 16,
          textStyle: {
            fontSize: 16,
            color: '#1a262c'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          right: 20,
          top: 20,
          orient: 'vertical',
          itemGap: 10,
          icon: 'circle',
          textStyle: {
            fontSize: 14,
            rich: {
              name: {
                color: '#86909C',
                fontSize: 12,
                fontFamily: 'PingFang SC'
              },
              percent: {
                color: '#4B5666',
                fontSize: 24,
                fontFamily: 'D-DIN-Bold',
                fontWeight: 700
              }
            }
          },
          selectedMode: false,
          formatter: (name) => {
            const index = datas.findIndex((v) => v.name === name);
            const percent = `${Math.round((datas[index].value / totalNum) * 10000) / 100}%`;
            return `{name| ${name}}：{percent|${percent}}`;
          }
        },
        series: [
          {
            show: false,
            type: 'pie',
            minAngle: 3,
            width: '96%',
            left: '2%',
            radius: ['35%', '50%'],
            center: ['50%', '64%'],
            label: {
              alignTo: 'edge',
              formatter: '{time|{c}} 件\n{name|{b}}',
              minMargin: 5,
              edgeDistance: 20,
              lineHeight: 24,
              rich: {
                time: {
                  fontSize: 22,
                  color: 'inherit'
                }
              }
            },
            labelLayout(params) {
              const isLeft = params.labelRect.x < self.chart.getWidth() / 2;
              const points = params.labelLinePoints;
              // Update the end point.
              if (points) {
                points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
              }
              return {
                labelLinePoints: points || []
              };
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              color: (colors) => self.colorList[colors.dataIndex]
            },
            avoidLabelOverlap: true,
            data: datas
          }
        ]
      };

      if (this.className === 'companyNumDistribute') {
        const rankStyle = {
          width: 17,
          height: 20
        };
        const iconStyle = {
          width: 8,
          height: 8,
          borderRadius: 8
        };
        options.color = ['#1448C7', '#497EFF', '#7EB2FF', '#B4D2FF', '#88CDFF', '#7DE0FF', '#83EDC7'];
        options.legend = {
          right: 20,
          top: '20%',
          orient: 'vertical',
          itemGap: 20,
          itemWidth: 9,
          itemHeight: 9,
          icon: 'circle',
          formatter: (name) => {
            let index = xdata.indexOf(name);
            var arr = [
              `{space|}`,
              `{rank${index + 1}|}`,
              `{space|}`,
              '{name|' + name + '}',
              '{split|}',
              '{value|' + this.$thousands(ydata[index]) + '}',
              '{unit|家}'
            ];
            return arr.join('');
          },
          textStyle: {
            rich: {
              rank1: {
                ...rankStyle,
                backgroundColor: {
                  image: location.origin + '/resource/img/rank1.png'
                }
              },
              rank2: {
                ...rankStyle,
                backgroundColor: {
                  image: location.origin + '/resource/img/rank2.png'
                }
              },
              rank3: {
                ...rankStyle,
                backgroundColor: {
                  image: location.origin + '/resource/img/rank3.png'
                }
              },
              rank4: {
                ...rankStyle,
                backgroundColor: {
                  image: location.origin + '/resource/img/rank4.png'
                }
              },
              rank5: {
                ...rankStyle,
                backgroundColor: {
                  image: location.origin + '/resource/img/rank5.png'
                }
              },
              rank6: {
                ...rankStyle,
                backgroundColor: {
                  image: location.origin + '/resource/img/rank6.png'
                }
              },
              rank7: {
                ...rankStyle,
                backgroundColor: {
                  image: location.origin + '/resource/img/rank7.png'
                }
              },
              space: {
                width: 8
              },
              icon1: {
                ...iconStyle,
                backgroundColor: options.color[0]
              },
              icon2: {
                ...iconStyle,
                backgroundColor: options.color[1]
              },
              icon3: {
                ...iconStyle,
                backgroundColor: options.color[2]
              },
              icon4: {
                ...iconStyle,
                backgroundColor: options.color[3]
              },
              icon5: {
                ...iconStyle,
                backgroundColor: options.color[4]
              },
              icon6: {
                ...iconStyle,
                backgroundColor: options.color[5]
              },
              icon7: {
                ...iconStyle,
                backgroundColor: options.color[6]
              },
              name: {
                fontSize: 14,
                width: 100,
                align: 'left',
                color: '#86909C'
              },
              split: {
                width: 1,
                height: 10,
                backgroundColor: '#86909C'
              },
              value: {
                fontSize: 18,
                width: 100,
                align: 'right',
                fontFamily: 'D-DIN-Bold',
                color: '#86909C'
              },
              unit: {
                fontSize: 12,
                color: '#86909C'
              }
            }
          }
        };
        options.tooltip = {
          trigger: 'item',
          renderMode: 'html',
          padding: [8, 14],
          extraCssText: '0px 0px 7px rgba(19, 34, 64, 0.12)',
          formatter: (params, ticket, callback) => {
            return `<div style="color:#86909C;">${params.name}</div>
            <div style="color:${options.color[params.dataIndex]};">
            <span class="f-ddin-b" style="font-size:16px;">${this.$thousands(params.value)}</span><span style="font-size:12px;">家</span>
            </div>`;
            // console.log('ring map', params);
          }
        };
        options.series = [
          {
            type: 'pie',
            minAngle: 3,
            center: [140, '50%'],
            radius: [0, 110],
            roseType: 'radius',
            label: {
              show: false
            },
            emphasis: {
              scaleSize: 12,
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            },
            data: ydata.map((n, i) => {
              return {
                name: xdata[i],
                value: ydata[i],
                selected: i === 0
              };
            })
          }
        ];
      } else if (this.className === 'companyTypeDistribute') {
        const maxNameLen = Math.max(...xdata.map((n) => n.length));
        const maxValueLen = Math.max(...ydata.map((n) => n.toString().length));
        options.color = ['#356DF6', '#D260B2', '#7784DE', '#6BCDBD', '#F1C37E', '#79A7F0', '#B85CE3'];
        options.tooltip = {
          trigger: 'item',
          renderMode: 'html',
          padding: [8, 14],
          extraCssText: '0px 0px 7px rgba(19, 34, 64, 0.12)',
          formatter: (params, ticket, callback) => {
            // console.log('ring map', params);
            return `<div style="color:#86909C;">${params.name}</div>
            <div style="color:${options.color[params.dataIndex]};">
            <span class="f-ddin-b" style="font-size:16px;">${params.percent.toFixed(2)}</span><span style="font-size:12px;">%</span>
            </div>`;
          }
        };
        options.legend = {
          right: 20,
          top: (this.chart.getHeight() - xdata.length * 16 - (xdata.length - 1) * 25) / 2,
          orient: 'vertical',
          itemGap: 25,
          itemWidth: 9,
          itemHeight: 9,
          icon: 'circle',
          itemStyle: {
            borderWidth: 0
          },
          formatter: (name) => {
            let index = xdata.indexOf(name);
            var arr = [`{space|}`, '{name|' + name + '}', '{value|' + this.$thousands(ydata[index]) + ' }', '{unit|家}'];
            return arr.join('');
          },
          textStyle: {
            rich: {
              space: {
                width: 5
              },
              name: {
                fontSize: 14,
                width: maxNameLen * 14 + 10,
                align: 'left',
                color: '#86909C'
              },
              value: {
                fontSize: 16,
                width: maxValueLen * 16,
                align: 'right',
                fontFamily: 'D-DIN-Bold',
                color: '#4B5666'
              },
              unit: {
                fontSize: 12,
                color: '#86909C'
              }
            }
          },
          emphasis: {
            backgroundColor: 'red'
          }
        };
        options.series = [
          {
            type: 'pie',
            center: [140, '50%'],
            radius: [90, 110],
            minAngle: 3,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'center',
              formatter: '{name|企业总数}\n\n{value|' + this.$thousands(totalNum) + '}',
              rich: {
                name: {
                  fontSize: 16,
                  fontFamily: 'PingFang SC',
                  color: '#4B5666'
                },
                value: {
                  fontSize: 32,
                  fontFamily: 'D-DIN-Bold',
                  color: '#4B5666'
                }
              }
            },
            emphasis: {
              scaleSize: 12,
              label: {
                show: true
              }
            },
            data: ydata.map((n, i) => {
              return {
                name: xdata[i],
                value: ydata[i]
              };
            })
          }
        ];
      }
      this.$nextTick(() => {
        this.chart.setOption(options);
        if (this.options.defaultHighlight) {
          this.chart.dispatchAction({
            type: 'highlight',
            dataIndex: 0
          });
        }
      });
    }
  }
};
</script>
