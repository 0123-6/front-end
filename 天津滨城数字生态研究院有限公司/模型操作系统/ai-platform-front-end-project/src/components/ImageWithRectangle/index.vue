<template>
  <div id="myDiv" v-resize="resize" class="" style="width: 100%;height: 100%;position: relative;">
    <!--width100%-->
    <div v-if="divWidth/divHeight < picSize.width/picSize.height" class="flex flex-direction justify-center bgc-white" style="width: 100%;height: 100%;">
      <div style="width: 100%;position: relative;">
        <div
          v-for="(item, index) in rectangleList"
          :key="index"
          class="hand"
          style="position:absolute;"
          :style="{
            left: (item.cor.x1 * biliX) + '%',
            top: (item.cor.y1 * biliY) + '%',
            width: (item.cor.x2 - item.cor.x1) * biliX + '%',
            height: (item.cor.y2 - item.cor.y1) * biliY + '%',
            border: '2px solid ' + color[index%color.length].color,
            'background-color':modelExperienceIndex===index?color[index%color.length].bgcColorDeep:color[index%color.length].bgcColor,
          }"
          @click="modelExperienceIndex=index===modelExperienceIndex?-1:index"
        />
        <img :src="picUrl" alt="图片加载失败" width="100%">
      </div>
    </div>
    <!--height100%-->
    <div v-if="divWidth/divHeight >= picSize.width/picSize.height" class="flex justify-center bgc-white" style="width: 100%;height: 100%">
      <div style="height: 100%;position:relative;">
        <div
          v-for="(item, index) in rectangleList"
          :key="index"
          class="hand"
          style="position:absolute;"
          :style="{
            left: (item.cor.x1 * biliX) + '%',
            top: (item.cor.y1 * biliY) + '%',
            width: (item.cor.x2 - item.cor.x1) * biliX + '%',
            height: (item.cor.y2 - item.cor.y1) * biliY + '%',
            border: '2px solid ' + color[index%color.length].color,
            'background-color':modelExperienceIndex===index?color[index%color.length].bgcColorDeep:color[index%color.length].bgcColor,
          }"
          @click="modelExperienceIndex=index===modelExperienceIndex?-1:index"
        />
        <img :src="picUrl" alt="图片加载失败" height="100%">
      </div>
    </div>
  </div>
</template>
<script>
import elementResizeDetectorMaker from 'element-resize-detector';
export default {
  components: {
  },
  props: {
    picUrl: {
      type: String,
      required: true
    },
    picSize: {
      type: Object,
      required: true,
      default: () => {
        return {
          width: 100,
          height: 100
        };
      }
    },
    rectangleList: {
      type: Array,
      required: true
    },
    color: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      divWidth: 0,
      divHeight: 1
    };
  },
  computed: {
    biliX() {
      return 100.0 / this.picSize?.width;
    },
    biliY() {
      return 100.0 / this.picSize?.height;
    },
    modelExperienceIndex: {
      get() {
        return this.$store.state.modelBase.modelExperienceIndex;
      },
      set(value) {
        this.$store.commit('setModelExperienceIndex', value);
      }
    }
  },
  mounted() {
    const _this = this;
    var erd = elementResizeDetectorMaker();
    erd.listenTo(this.$el, function(element) {
      _this.divWidth = element.offsetWidth;
      _this.divHeight = element.offsetHeight;
    });
    console.log('picSize', this.picUrl);
  },
  methods: {
    resize() {

    }
  }
};
</script>
