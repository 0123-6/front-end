<template>
  <div class="flex color-content font-size-14 line-height-22 margin-bottom-24">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'ContentStyle',
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
