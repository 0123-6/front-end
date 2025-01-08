<template>
  <!--最外层-->
  <div class="flex flex-direction bgc-white font-size-14 color-content" style="width: 100%;height: 100%;overflow: auto;">
    <div class="flex flex-direction" style="width: 100%;overflow: visible;">
      <div
        v-for="(item,index) in data"
        :key="index"
        style="width: 100%;"
        class="hand text-hidden padding-left-24 padding-right-24 padding-top-12 padding-bottom-12"
        :class="[dataIndex===index?'bgc-blue-light box-shadow-1':'']"
        @click="changeDataIndex(index)"
      >
        <!--文本-->
        <div style="width: 100%;height:40px;line-height: 20px" class="text-hidden-2">
          <span v-light="[item.text, highLightWordList[index],modelExperienceIndex!==-1?colorList[colorRules[modelExperienceIndex]%colorList.length].color:'#646464']" />
        </div>
        <!--标签-->
        <div class="flex flex-wrap" style="width: 100%;">
          <div
            v-for="(label,labelIndex) in item.labels"
            :key="labelIndex"
            class="flex align-center margin-top-8 margin-right-8"
            style="min-width: 100px;width: max-content;height: 28px;"
          >
            <div style="width: 4px;height: 100%;border-radius: 4px 0 0 4px;" :style="{'background-color':colorList[colorRules[label.type]%colorList.length].color}" />
            <div
              class="padding-left-8 flex align-center padding-right-8"
              :class="[label.type===modelExperienceIndex?'color-white':'']"
              style="height: 100%;min-width: calc(100% - 4px);"
              :style="{'background-color':label.type===modelExperienceIndex?colorList[colorRules[label.type]%colorList.length].color:colorList[colorRules[label.type]%colorList.length].bgcColor}"
            >
              {{ label.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'TextEntityExtractionLeft',
  props: {
    data: {
      type: Array,
      required: true
    },
    colorList: {
      type: Array,
      required: true
    },
    colorRules: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataIndex: -1,
      highLightWordList: []
    };
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

  },
  watch: {
    modelExperienceIndex() {
      this.setHighLightWordList();
    }
  },
  created() {
    for (let i = 0; i < this.data.length; i++) {
      this.highLightWordList.push([]);
    }
    this.setHighLightWordList();
  },
  methods: {
    changeDataIndex(value) {
      this.dataIndex = value;
    },
    setHighLightWordList() {
      const list = [];
      for (let i = 0; i < this.data.length; i++) {
        const wordList = [];
        for (let j = 0; j < this.data[i].labels.length; j++) {
          if (this.modelExperienceIndex === this.data[i].labels[j].type) {
            wordList.push(this.data[i].labels[j].name);
          }
        }
        list.push(wordList);
      }
      this.highLightWordList = list;
    }

  }
};
</script>

<style scoped>

</style>
