<template>
  <div class="w-full flex flex-col shadow-card rounded hover:shadow-card-hover hover:cursor-pointer"
       style="height: 291px;background: rgba(255,255,255,0.82);"
       @click="viewModelDetail(modelData.id)">
    <!--图片区-->
    <img :src="modelData.coverUrl" style="height: 149px;border-radius: 4px 4px 0 0;" class="w-full" alt="">
    <!--下面-->
    <div class="flex flex-col pl-4 pr-5">
      <!--标题-->
      <div class="model-card-title text-hidden text-sm font-semibold text-black-dark"
           style="margin-top: 11px;">{{ modelData.modelNameCh }}</div>
      <!--标签-->
      <div class="mt-2 flex text-xs items-center"
           style="height: 22px;">
        <div class="h-full rounded text-blue flex items-center"
             style="padding: 0 13px;background: rgba(12, 97, 170, 0.16);">
          {{ modelData.scenesName }}
        </div>
        <div class="h-full ml-2 rounded flex items-center"
             style="padding: 0 13px;color: #098E98;background: rgba(9 ,142, 152, 0.16);">
          {{ modelData.typeName }}
        </div>
      </div>
      <!--内容简介-->
      <div class="w-full text-hidden-3 text-black text-xs"
           style="margin-top: 7px;line-height: 17px;">
        {{modelData.modelShortDescribe}}
      </div>
      <TextTooltip v-if="false" class="model-card-desc" :text="modelData.modelShortDescribe"></TextTooltip>
    </div>
  </div>
</template>

<script>
import TextTooltip from '@/components/TextTooltip';

export default {
  name: 'model-card',
  components: {
    TextTooltip
  },
  props: {
    modelData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
    };
  },
  methods: {
    viewModelDetail(id) {
      const params = {
        buttonVisible: false
      };
      sessionStorage.setItem('modelApplyButtonParams', JSON.stringify(params));
      const routeData = this.$router.resolve({
        path: `/library/detail/${id}`
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style scoped lang="less">
.model-card-desc {
  margin: 12px 0px;
  font-size: 12px;
  color: #646464;
  line-height: 17px;
}
</style>
