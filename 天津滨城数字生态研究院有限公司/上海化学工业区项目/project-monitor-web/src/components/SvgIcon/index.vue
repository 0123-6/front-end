<template>
  <svg :class="svgClass" aria-hidden="true" :style="{ width, height }">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
export default defineComponent({
  props: {
    iconClass: {
      type: String,
    },
    icon: {
      type: String,
    },
    className: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {
      iconName: computed(() => `#icon-${props.iconClass || props.icon}`),
      svgClass: computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`;
        }
        return 'svg-icon';
      })
    };
  }
});
</script>

<style scope lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
