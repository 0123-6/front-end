<template>
  <svg :width="width" :height="height" viewBox="0 0 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="色版" transform="translate(-1710.000000, -609.000000)" fill="currentColor" fill-rule="nonzero">
        <path d="M1713.25,610.3 L1713.25,609 L1719.75,609 L1719.75,610.3 L1723,610.3 L1723,611.6 L1721.7,611.6 L1721.7,621.35
        C1721.7,621.708985 1721.40899,622 1721.05,622 L1711.95,622 C1711.59101,622 1711.3,621.708985 1711.3,621.35 L1711.3,611.6 L1710,611.6
        L1710,610.3 L1713.25,610.3 Z M1712.6,611.6 L1712.6,620.7 L1720.4,620.7 L1720.4,611.6 L1712.6,611.6 Z M1714.55,613.55
        L1715.85,613.55 L1715.85,618.75 L1714.55,618.75 L1714.55,613.55 Z M1717.15,613.55 L1718.45,613.55 L1718.45,618.75
        L1717.15,618.75 L1717.15,613.55 Z" id="shanchu_正常"></path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'DeleteSvg',
  props: {
    width: {
      type: String,
      required: false,
      default: '13'
    },
    height: {
      type: String,
      required: false,
      default: '13'
    }
  }
};
</script>

<style scoped>

</style>
