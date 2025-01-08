<template>
  <div class="chart-legend">
    <div v-for="(n, i) in data" :key="n.name" class="chart-legend__item d-flex ai-center">
      <div class="chart-legend__item-icon" :style="{ background: color[i] }"></div>
      <div class="chart-legend__item-name ml10 f-l2 f14" :style="{ width: nameWidth }">{{ n.name }}</div>
      <div class="chart-legend__item-split"></div>
      <div class="chart-legend__item-value text-right" :style="{ width: valueWidth }">
        <template v-if="!boldValue">
          <span class="f16 ddin-n f-l3">{{ n.value }}</span>
          <span class="f12 f-l3">{{ unit }}</span>
        </template>
        <template v-else>
          <span class="f18 ddin">{{ n.value }}</span>
          <span class="f12">{{ unit }}</span>
        </template>
      </div>
      <div v-if="showPercent" class="chart-legend__item-percent f18 ddin text-right" :style="{ width: percentWidth }">{{
        n.percent }}%</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChartLegend',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    color: {
      type: Array,
      default() {
        return []
      }
    },
    boldValue: {
      type: Boolean,
      default: false
    },
    showPercent: {
      type: Boolean,
      default: true
    },
    unit: {
      type: String,
      default: ''
    }
  },
  computed: {
    nameWidth() {
      const strLens = this.data.map(n => n.name.length)
      return `${Math.max(...(strLens)) * 14 + 12}px`
    },
    valueWidth() {
      const strLens = this.data.map(n => n.value.toString().length)
      return `${Math.max(...(strLens)) * 10 + 22}px`
    },
    percentWidth() {
      const strLens = this.data.map(n => n.percent.toString().length)
      return `${Math.max((Math.max(...(strLens)) - 1) * 14 + 28, 40)}px`
    }
  }
};
</script>

<style lang="scss">
.chart-legend {
  &__item {
    padding: 2px 0;

    &-icon {
      width: 8px;
      height: 8px;
      border-radius: 100%;
    }

    &-split {
      width: 1px;
      height: 10px;
      background: #DBE1E9;
    }
  }
}
</style>