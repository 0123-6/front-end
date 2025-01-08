<template>
  <div class="ee-flowchart relative" :style="{ width, height: realHeight }">
    <div v-if="image" ref="output" class="ee-flowchart__inner full-w full-h y-hidden">
      <embed type="image/svg+xml" :src="`/flowchart/${image}.svg`" :id="flowId" />
    </div>
    <div v-else ref="output" class="ee-flowchart__inner full-w full-h y-hidden"></div>
    <div class="ee-flowchart__tool d-flex ai-center absolute">
      <el-button class="is-single" size="small" :disabled="zoom == minZoom" title="缩小" @click="handleZoom(-zoomStep)">
        <el-icon>
          <Minus />
        </el-icon>
      </el-button>
      <div class="text-center" style="width: 72px;">{{ (zoom * 100).toFixed(0) }}%</div>
      <el-button class="is-single" size="small" :disabled="zoom == maxZoom" title="放大" @click="handleZoom(zoomStep)">
        <el-icon>
          <Plus />
        </el-icon>
      </el-button>
      <el-button v-if="showFullscreen" class="is-single" size="small" :title="!fullscreen ? '全屏' : '退出全屏'"
        @click="$emit('fullscreen'); fullscreen = !fullscreen">
        <svg-icon :class="{ 'is-fullscreen': fullscreen }"
          :icon="fullscreen ? 'exit-fullscreen' : 'fullscreen'"></svg-icon>
      </el-button>
    </div>
  </div>
</template>

<script>
import svgPanZoom from 'svg-pan-zoom'

export default {
  name: 'EeFlowchart',
  props: {
    flowId: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    image: {},
    mode: {
      type: String,
      default: 'dark'
    },
    currentNode: {
      type: [String, Number],
      default: ''
    },
    showFullscreen: {
      type: Boolean,
      default: true
    },
    nodePlacementStrategy: {
      type: String,
      default: 'SIMPLE'
    }
  },
  data() {
    return {
      zoom: 1,
      zoomStep: 0.1,
      baseZoom: 1,
      minZoom: 0.2,
      maxZoom: 3,
      fullscreen: false,
      realHeight: '100%'
    }
  },
  watch: {
    text(val) {
      this.render(val)
    },
    image() {
      this.$nextTick(() => {
        this.renderImage()
      })
    }
  },
  created() {
    this.realHeight = this.height
  },
  mounted() {
    if (!this.image) {
      this.$mermaid.initialize({
        startOnLoad: false,
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'cardinal',
          defaultRenderer: "elk",
          layoutOptions: {
            'elk.layered.spacing.edgeNodeBetweenLayers': '20',
            'elk.layered.mergeEdges': 'true',
            'elk.layered.nodePlacement.strategy': this.nodePlacementStrategy,
            'elk.layered.layering.strategy': 'MIN_WIDTH',
          }
        },
        securityLevel: 'loose'
      });
      this.render(this.text)
    } else {
      this.renderImage()
    }
  },
  methods: {
    renderImage() {
      this.$el.querySelector(`#${this.flowId}`).removeEventListener('load', this.initPanZoom)
      this.$el.querySelector(`#${this.flowId}`).addEventListener('load', this.initPanZoom)
    },
    defineCallback() {
      window[`mermaid${this.flowId}`] = (id, name) => {
        this.$emit('node-click', { id, name })
      }
    },
    async render(val) {
      if (!val) {
        this.$refs.output.innerHTML = ''
        return
      }
      this.defineCallback()
      if (this.panZoomTiger) {
        this.oldPan = this.panZoomTiger.getPan()
        this.oldZoom = this.panZoomTiger.getZoom()
      }
      // TODO
      document.body.classList.add('over-h')
      const { svg } = await this.$mermaid.render(this.flowId, val);
      document.body.classList.remove('over-h')
      this.$refs.output.innerHTML = svg;
      if (this.height === 'auto' && !this.image) {
        const svgHeight = document.getElementById(this.flowId).height.baseVal.value
        this.realHeight = `${Math.max(svgHeight + 20, 300)}px`
        console.log('realHeight', this.realHeight)
      }
      this.$nextTick(() => {
        this.changeMarkerSize()
        this.adjustForeignObject()
        this.initPanZoom()
        this.initPosition()
        this.$emit('ready')
      })
      // console.log('render', this.flowId)
    },
    changeMarkerSize() {
      const marker = this.$el.querySelector(`#${this.flowId}_flowchart-elk-pointEnd`)
      marker.setAttribute('markerWidth', '6')
      marker.setAttribute('markerHeight', '6')
      marker.setAttribute('refX', '2')
      marker.setAttribute('refY', '5')
    },
    initPosition(remember = true) {
      if (remember && this.flowId === this.oldFlowId) {
        this.panZoomTiger.pan(this.oldPan)
        this.panZoomTiger.zoom(this.oldZoom)
        return
      }
      if (!this.currentNode) {
        if (this.svgWidth > this.domWidth) {
          this.panZoomTiger.panBy({ x: (this.svgWidth - this.domWidth) / 2, y: 0 })
          // console.log('initPosition', (this.svgWidth - this.domWidth) / 2)
        }
      } else {
        const gs = this.$el.querySelectorAll('.nodes .node')
        gs.forEach(n => {
          if (n.getAttribute('id').includes(`flowchart-${this.currentNode}`)) {
            const transform = n.getAttribute('transform')
            const x = Number(transform.replace('translate(', '').split(',')[0])
            if (x + 80 > this.domWidth) {
              this.panZoomTiger.panBy({ x: (this.svgWidth / 2 - x), y: 0 })
            }
          }
        })
      }
      this.oldFlowId = `${this.flowId}`
    },
    adjustForeignObject() {
      if (this.mode === 'dark') {
        this.$refs.output.querySelectorAll(`.node:not(.endpoint) foreignObject`).forEach(n => {
          n.setAttribute('width', Number(n.getAttribute('width')) + 15)
          n.setAttribute('height', Number(n.getAttribute('height')) + 15)
        })
      }
      this.$refs.output.querySelectorAll(`.endpoint foreignObject`).forEach(n => {
        n.setAttribute('width', 76)
        n.setAttribute('height', 39)
      })
    },
    getSvgSize() {
      let svgDom = document.getElementById(this.flowId)
      if (this.image) {
        svgDom = svgDom.getSVGDocument().querySelector('svg')
      }
      const svgWidth = svgDom.width.baseVal.value
      const svgHeight = svgDom.height.baseVal.value
      this.svgWidth = svgWidth
      this.svgHeight = svgHeight
    },
    initPanZoom() {
      this.baseZoom = 1
      this.zoom = 1
      if (this.panZoomTiger) {
        this.panZoomTiger.destroy()
      }
      this.panZoomTiger = svgPanZoom(`#${this.flowId}`, {
        zoomEnabled: false,
        dblClickZoomEnabled: false,
        // controlIconsEnabled: true,
        // fit: true,
        center: true,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom
      })
      this.getSvgSize()
      this.initZoom()
    },
    initZoom() {
      const { width } = this.$el.getBoundingClientRect()
      this.domWidth = width
      this.baseZoom = this.svgWidth / width
      this.panZoomTiger.zoom(this.baseZoom)
    },
    handleZoom(step) {
      this.zoom = Number((this.zoom + step).toFixed(1))
      this.panZoomTiger.zoom(this.zoom * this.baseZoom)
    },
    fit() {
      const { width, height } = this.$el.getBoundingClientRect()
      if (this.svgWidth > width || this.svgHeight > height) {
        this.panZoomTiger.fit()
        this.zoom = this.panZoomTiger.getZoom().toFixed(2)
      }
    },
    reset() {
      this.initPanZoom()
      this.initPosition(false)
    }
  }
};
</script>
<style lang="scss">
.ee-flowchart {

  &__inner {

    svg,
    embed {
      width: 100% !important;
      height: 100%;
    }
  }

  &__tool {
    top: 20px;
    right: 20px;

    .el-button {
      width: 28px;

      svg {
        width: 12px;
        height: 12px;

        &.is-fullscreen {
          width: 14px;
          height: 14px;
        }

      }
    }

  }

  .edge-thickness-normal {
    stroke-width: 1px !important;
    opacity: 0.5;
  }

  .node {
    .ee-tag {
      cursor: pointer;

      .iconfont {
        position: relative;
        top: -2px;
        margin-left: 6px;
        color: #BFBFBF;
        font-size: 8px;
      }

      &.is-primary,
      &.is-alert,
      &.is-disabled {
        cursor: default;

        .iconfont {
          display: none;
        }
      }
    }

    &.endpoint {
      rect {
        stroke-width: 0 !important;
      }

      .nodeLabel {
        color: #ffffff !important;
      }

      foreignObject {
        transform: translate(-7.5px, -7.5px);
        background: linear-gradient(180deg, #3478A9 -50%, #86B3D3 129.06%) !important;
        border-radius: 19.5px !important;
        border: none !important;
        line-height: 37px;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }

  .edgePath .path {
    stroke-width: 1px !important;
    stroke: #a1a9ad !important;
  }

  .marker {
    fill: #a1a9ad !important;
    stroke: #a1a9ad !important;
  }

  &.is-plain {

    .nodeLabel {
      color: #1A262C !important;
    }

    .clickable {
      .nodeLabel {
        &:hover {
          color: #02ADEC !important;
        }
      }
    }

    .node {
      rect {
        fill: rgba(2, 173, 236, 0.10) !important;
        stroke-dasharray: 2 2;
        stroke: #02ADEC !important;
        rx: 5;
        ry: 5;
      }

      &.endpoint {
        rect {
          fill: transparent !important;
        }
      }


      &.judgement {
        polygon {
          fill: rgba(170, 55, 198, 0.10) !important;
          stroke-dasharray: 2 2;
          stroke: #AA37C6 !important;
        }

        .nodeLabel {
          color: #854F98 !important;
        }
      }
    }

    .edgeLabel {
      background: #F6F6F6 !important;
      color: #929DA3 !important;
    }

  }

  &.is-dark {
    .node {
      foreignObject {
        overflow: visible;
        transform: translate(-7.5px, -7.5px);
        background: #fff;
        border-radius: 6px;
        border: 1px solid #DEE4E7;

        >div {
          display: block !important;
        }
      }
    }

    .nodeLabel {
      position: relative;
    }

    .node-head {
      padding: 2px 12px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      background: #E9ECEE;
    }

    .node-name {
      padding: 4px 12px;
      width: 160px !important;
      text-align: left;
      color: #1A262C;
      font-size: 16px;
    }

    .node-foot {
      padding: 1px 10px 0;
      border-top: 1px dashed #DBE1E9;
    }

    .node-link {
      padding: 2px;
      color: #929DA3;

      .iconfont {
        font-size: 16px;
      }

      &:hover {
        color: #02ADEC;
      }
    }

    .split-line {
      width: 1px;
      height: 10px;
      background: #DBE1E9;
    }

    .node {
      rect {
        stroke: transparent !important;
        fill: transparent !important;
      }

      &.node-status-primary {
        .node-head {
          background: #E6F7FD;
          border-top: 4px solid #02ADEC;
        }
      }

      &.node-status-danger {
        .node-head {
          background: #FDEDED;
          border-top: 4px solid #E85050;
        }

      }

      &.node-status-warning {
        .node-head {
          background: #FEF8EE;
          border-top: 4px solid #FAB752;
        }

      }

      &.node-status-alert {
        .node-head {
          background: #FEF4EE;
          border-top: 4px solid #F28C53;
        }

      }

      &.node-status-success {
        .node-head {
          background: #F0FAEC;
          border-top: 4px solid #68CD44;
        }
      }

      &.node-status-info {
        .node-head {
          background: #F8F9F9;
          border-top: 4px solid #B7C1C5;
        }
      }

      .node-index {
        font-family: D-DIN;
        font-size: 20px;
        background: linear-gradient(180deg, #3478A9 0%, #86B3D3 93.51%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .node-name.pointer {
        &:hover {
          color: #02ADEC;
        }
      }
    }

  }

  &.show-status {
    foreignObject {
      border-top: none !important;
    }
  }

  .node-dropdown {
    position: absolute;
    top: 28px;
    left: 50%;
    margin-left: -50px;
    width: 100px;

    &__arrow {
      position: absolute;
      top: -10px;
      left: 0;
      width: 100px;
      height: 10px;
      background: transparent;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 10px;
        height: 10px;
        background: #fff;
      }
    }

    &__inner {
      background: #FFF;
      box-shadow: 0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px 0px rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      overflow: hidden;
    }

    &__item {
      height: 30px;
      line-height: 30px;
      color: #1A262C;
      font-weight: 400;

      &:hover {
        background: #F8F8F8;
      }
    }
  }

  .ee-tag {
    &:hover {

      .node-dropdown {
        display: block !important;
        height: auto !important;
      }

    }
  }

  .node-mask {
    position: absolute;
    top: 0;
    left: 0;
  }

  &.is-loading {
    .node-mask {
      display: block !important;
      height: 220px !important;
      width: 175px;
      z-index: 1;
    }
  }

}
</style>