<template>
  <div class="flex flex-direction" style="width: 100%;height: 100%;overflow: auto;">
    <div
      v-for="(item,index) in data"
      :key="index"
      class="flex align-center margin-top-16 hand"
      style="min-width: 100%;width: max-content;height: 28px;line-height: 28px;"
      @click="modelExperienceIndex = item === modelExperienceIndex ? -1 : item"
    >
      <div style="width: 4px;height: 100%;border-radius: 4px 0 0 4px;" :style="{'background-color':colorList[index%colorList.length].color}" />
      <div
        class="padding-left-8 padding-right-8 flex align-center text-hidden"
        :class="[item===modelExperienceIndex?'color-white':'color-content']"
        style="width: calc(100% - 8px);min-width: 130px;height: 100%;"
        :style="{'background-color':item===modelExperienceIndex?colorList[index%colorList.length].color:colorList[index%colorList.length].bgcColor}"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextEntityExtractionRight',
  props: {
    data: {
      type: Array,
      required: true
    },
    colorList: {
      type: Array,
      required: true
    }

  },
  computed: {
    modelExperienceIndex: {
      get() {
        return this.$store.state.modelBase.modelExperienceIndex;
      },
      set(value) {
        this.$store.commit('setModelExperienceIndex', value);
      }
    }
  }
};
</script>

<style scoped>

</style>
