<script>
/* eslint-disable */
import HierarchyLayout from '@antv/hierarchy';
import minusCircle from '@/assets/images/minus-circle.svg';
import plusCircle from '@/assets/images/plus-circle.svg';

const Hierarchy = HierarchyLayout || window.Hierarchy;

export default {
  name: 'G6Tree',
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
      type: Number,
      default: 600
    },
    // 父组件传递过来的图表数据
    chartData: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: '#356DF6'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    paddingY: {
      type: Number,
      default: 130
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      graph: null,
      isFullScreen: false,
      containerId: ''
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        const data = JSON.parse(JSON.stringify(val.datas));
        this.handleData(data);
        if (this.graph) {
          this.graph.data(data[0]);
          this.graph.render();
          let paddingY = this.getPaddingY(data[0]);
          this.graph.fitView([paddingY, 20, paddingY, 20]);
          this.selectedNode = null;
          this.selectedGroups = [];
          this.selectedNodes = [];
        }
      }
    }
  },
  created() {
    this.selectedNodes = [];
    this.selectedGroups = [];
    this.containerId = `TreeG6_${new Date().getTime()}`;
    this.isFullScreen = this.fullscreen;
  },
  mounted() {
    this.$nextTick(() => {
      this.initGraph();
    });
  },
  methods: {
    getPaddingY(data) {
      let paddingY = 0;
      if (data.children.length === 0) {
        paddingY = (this.height - 60) / 2;
      } else {
        let childNum = 0;
        data.children.forEach((c) => {
          childNum += c.children.length;
        });
        paddingY = Math.max((this.height - 34 * childNum - (childNum - 1) * 10) / 2, 5);
      }
      return paddingY;
    },
    handleData(data) {
      data?.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.collapsed = item.chainLevel >= 3;
          this.handleData(item.children);
        }
      });
    },
    // 全屏事件处理函数
    toggleFullscreen() {
      this.isFullScreen = !this.isFullScreen;
      this.$nextTick(() => {
        // 修改画布的大小
        this.graph.changeSize(this.$refs.container.clientWidth, this.isFullScreen ? document.documentElement.clientHeight : this.height);
        // 将图移动到画布中心位置
        if (this.isFullScreen) {
          this.graph.fitCenter();
        } else {
          this.graph.fitView();
        }
      });
    },
    highlightNode(group, highlight) {
      const rectBox = group.findByClassName('rect-box');
      const textShape = group.findByClassName('text-shape');
      if (highlight) {
        rectBox.attr('fill', '#ecf0fd');
        rectBox.attr('stroke', '#356DF6');
        rectBox.attr('lineWidth', 1);
        textShape.attr('fill', '#356DF6');
      } else {
        rectBox.attr('fill', '#F2F2F2');
        rectBox.attr('stroke', '#F2F2F2');
        rectBox.attr('lineWidth', 0);
        textShape.attr('fill', '#898989');
      }
    },
    removeChecked(ids) {
      this.selectedNodes = this.selectedNodes.filter((n) => ids.indexOf(n.id) == -1);
      this.selectedGroups.forEach((n, i) => {
        if (ids.indexOf(n.cfg.item.getModel().id) > -1) {
          this.highlightNode(n, false);
        }
      });
      this.selectedGroups = this.selectedGroups.filter((n) => ids.indexOf(n.cfg.item.getModel().id) == -1);
    },
    initGraph() {
      this.$G6.registerNode(
        'tree-node',
        {
          drawShape: (cfg, group) => {
            const rectWrap = group.addShape('rect', {
              attrs: {
                // fill: 'rgba(255,0,0,0.1)',
                radius: 0,
                x: 0,
                y: 0,
                width: 1,
                height: 1
              },
              name: 'rect-shape'
            });

            const rect = group.addShape('rect', {
              attrs: {
                fill: '#F2F2F2',
                stroke: '#F2F2F2',
                radius: 3,
                x: 0,
                y: 0,
                width: 1,
                height: 1
              },
              name: 'rect-box',
              className: 'rect-box'
            });
            const content = cfg.name.substr(0, 8) + (cfg.name.length > 8 ? '...' : '');
            const contentNumber = cfg.companyNums;
            const text = group.addShape('text', {
              attrs: {
                text: `${content} (${contentNumber})`,
                x: 0,
                y: 0,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: '#898989',
                fontSize: 12,
                fontWeight: 500
              },
              name: 'text-shape',
              className: 'text-shape'
            });
            const bbox = text.getBBox();
            const hasChildren = cfg.children && cfg.children.length > 0;
            rect.attr({
              x: bbox.minX - 8,
              y: bbox.minY - 9,
              width: bbox.width + 16,
              height: bbox.height + 18
            });

            group.addShape('rect', {
              attrs: {
                fill: 'transparent',
                // fill: 'rgba(255, 165, 0,0.1)',
                x: bbox.minX - 8,
                y: bbox.minY - 9,
                width: bbox.width + 16,
                height: bbox.height + 18,
                cursor: this.multiple ? (cfg.parentId === '0' ? 'default' : 'pointer') : 'pointer'
              },
              className: 'rect-over'
            });

            rectWrap.attr({
              x: bbox.minX - 14,
              y: bbox.minY - 8,
              width: bbox.width + 12 + 28,
              height: bbox.height + 18
            });

            if (hasChildren) {
              group.addShape('rect', {
                attrs: {
                  x: bbox.width + 8.5,
                  y: bbox.height / 2 - 6,
                  width: 6,
                  height: 1,
                  fill: '#356DF6'
                }
              });
              group.addShape('image', {
                attrs: {
                  x: bbox.width + 13.5,
                  y: bbox.height / 2 - 12.5,
                  width: 14,
                  height: 14,
                  img: cfg.collapsed ? plusCircle : minusCircle,
                  cursor: 'pointer'
                },
                className: 'collapse-icon'
              });
              group.addShape('text', {
                attrs: {
                  text: cfg.children.length,
                  x: bbox.width + 30,
                  y: devicePixelRatio < 2 ? 1 : 0,
                  textBaseline: 'middle',
                  fill: cfg.collapsed ? '#356DF6' : 'transparent',
                  fontSize: 10,
                  fontWeight: 500
                },
                className: 'text-children-num'
              });
            }
            return rectWrap;
          },
          afterDraw: (cfg, group) => {
            var icon = group.findByClassName('collapse-icon');
            var rectOver = group.findByClassName('rect-over');
            if (icon) {
              icon.on('click', (e) => {
                const collapseIcon = e.currentTarget.cfg.parent.findByClassName('collapse-icon');
                const childrenNum = e.currentTarget.cfg.parent.findByClassName('text-children-num');
                const nodeModel = e.currentTarget.cfg.parent.cfg.item.getModel();
                const { collapsed } = nodeModel;
                const collapsedNew = !collapsed;
                collapseIcon.attr('img', collapsedNew ? plusCircle : minusCircle);
                childrenNum.attr('fill', collapsedNew ? '#356DF6' : 'transparent');
              });
            }
            if (rectOver) {
              rectOver.on('click', (e) => {
                e.stopPropagation();
                const item = e.currentTarget.cfg.parent.cfg.item;
                if (!item) return;
                const model = item.getModel();
                if (!model) return;
                // console.log(model);
                if (this.multiple) {
                  if (model.parentId !== '0') {
                    const { id, name, code } = model;
                    if (!this.selectedNodes.find((n) => n.id == id)) {
                      this.highlightNode(e.currentTarget.cfg.parent, true);
                      this.selectedNodes.push({ id, name, code });
                      this.selectedGroups.push(e.currentTarget.cfg.parent);
                      this.$emit('change', JSON.parse(JSON.stringify(this.selectedNodes)));
                    } else {
                      this.removeChecked([id]);
                      this.$emit('change', JSON.parse(JSON.stringify(this.selectedNodes)));
                    }
                  }
                } else {
                  this.$emit('nodeClick', model);
                  if (!this.selectedNode || this.selectedNode.getModel().id !== item.getModel().id) {
                    this.highlightNode(e.currentTarget.cfg.parent, true);
                  }
                  if (this.selectedNode && this.selectedNode.getModel().id !== item.getModel().id) {
                    this.highlightNode(this.selectedNode._cfg.group, false);
                  }
                  this.selectedNode = item;
                }
              });
            }
          }
        },
        'single-node'
      );
      const width = this.isFullScreen ? document.documentElement.clientWidth : this.$refs.container.offsetWidth;
      const height = this.isFullScreen ? document.documentElement.clientHeight : this.height;
      const toolbar = new this.$G6.ToolBar({
        position: { x: 20, y: 20 },
        className: 'toolbar',
        getContent: () => `
          <ul
          class="toolbar"
          style="
          position: absolute;
          display: flex;
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid #e2e2e2;
          border-radius: 4px;
          padding: 6px;
          list-style-type: none;">
          <li code="zoomIn"><i class="tool el-icon-zoom-in" style="font-size: 24px; "></i></li>
          <li code="zoomOut"><i class="tool el-icon-zoom-out" style="font-size: 24px; "></i></li>
          <li code="autoZoom"><i class="tool el-icon-c-scale-to-original" style="font-size: 24px; "></i></li>
          ${this.fullscreen ? '' : '<!--<li code="fullScreen"><i class="tool el-icon-full-screen" style="font-size: 24px; "></i></li>-->'}
          ${this.fullscreen ? '<li code="close"><i class="tool el-icon-circle-close" style="font-size: 24px; "></i></li>' : ''}
          </ul>`,
        handleClick: (code) => {
          switch (code) {
            case 'zoomIn':
              this.graph.zoom(1.2);
              break;
            case 'zoomOut':
              this.graph.zoom(0.8);
              break;
            case 'autoZoom':
              this.graph.fitView();
              break;
            case 'fullScreen':
              this.toggleFullscreen();
              break;
            case 'close':
              this.$emit('close');
              break;
            default:
              break;
          }
        }
      });
      const graph = new this.$G6.TreeGraph({
        container: this.containerId,
        height,
        width,
        plugins: [toolbar],
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: (item, collapsed) => {
                // debugger;
                const data = item.getModel();
                data.collapsed = collapsed;
                return true;
              }
            },
            'drag-canvas'
            // 'zoom-canvas'
          ]
        },
        defaultNode: {
          type: 'tree-node',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5]
          ]
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            endArrow: {
              path: this.$G6.Arrow.triangle(4, 3, 0),
              fill: '#8B8B8B'
            },
            stroke: '#8B8B8B'
          }
        },
        nodeStateStyles: {
          selected: {
            'rect-box': {
              fill: '#ecf0fd',
              stroke: '#356DF6',
              lineWidth: 1
            },
            'text-shape': {
              fill: '#356DF6'
            }
          }
        },
        layout: (data) => {
          let subtree;
          this.$G6.Util.traverseTree(data, (sub) => {
            subtree = sub;
          });
          const indentedConfig = {
            direction: 'LR',
            indent: 60,
            getHeight: () => 10
          };
          const subtreeLayoutData = Hierarchy.indented(subtree, indentedConfig);
          let minY = Infinity;
          let maxY = -Infinity;
          this.$G6.Util.traverseTree(subtreeLayoutData, (child) => {
            if (child.y < minY) minY = child.y;
            if (child.y > maxY) maxY = child.y;
          });
          const height = maxY - minY;

          const config = {
            type: 'compactBox',
            direction: 'LR',
            getId: function getId(d) {
              return d.id;
            },
            getHeight: function getHeight(d) {
              return 16;
            },
            getWidth: function getWidth() {
              return 16;
            },
            getVGap: function getVGap(d) {
              return 10;
            },
            getHGap: function getHGap() {
              return 100;
            }
          };
          const treeLayoutData = Hierarchy.mindmap(data, config);
          let x;
          let y;
          this.$G6.Util.traverseTree(treeLayoutData, (sub) => {
            // if (sub.id === 'Consensus') {
            //   x = sub.x;
            //   y = sub.y;
            // }
          });
          this.$G6.Util.traverseTree(subtreeLayoutData, (sub) => {
            sub.x += x;
            sub.y += y;
          });

          return treeLayoutData;
        }
      });
      this.graph = graph;
      // debugger;
    }
  }
};
</script>

<template>
  <div>
    <div :id="containerId" class="gSix-tree" :class="{ fullscreen: isFullScreen }" ref="container" style="background: #fff"></div>
  </div>
</template>

<style lang="less">
.gSix-tree {
  font-size: 0;
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2999;
    background: rgba(0, 0, 0, 0.7);

    .toolbar {
      left: 50% !important;
      top: initial !important;
      bottom: 20px !important;
      transform: translateX(-50%);
      background-color: transparent !important;
    }

    .tool {
      color: #fff;
    }
  }
  .tool {
    margin: 0 4px;
    cursor: pointer;
  }
  li {
    height: 24px;
  }
}
</style>
