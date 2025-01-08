<template>
  <!--最外层-->
  <div class="flex flex-direction" style="width: 1880px;">
    <div v-loading="loading" class="flex flex-direction align-center" style="width: max-content;min-width: 100%;min-height: 100%;max-height: 1000px;overflow: auto;">
      <!--授权弹框-->
      <dialog-mask v-if="showMoast" @cancel="showMoast=false">
        <model-application ref="modelApp"
                           :id="modelInfo.id"
                           style="width: 748px;height: 808px;position: absolute;left: 620px;top: 140px;z-index: 2;"
                           @close="showMoast=false">
        </model-application>
      </dialog-mask>
      <div v-if="!loading" class="flex flex-direction align-center padding-bottom-16" style="width: 100%;min-width: var(--main-div-min-width);">
        <div class="flex flex-direction margin-top-16 padding-bottom-16"
             style="width: calc(100% - 112px);min-width: var(--main-div-min-width);background-color:#122c53;max-width: 1200px;padding-left: 56px;padding-right: 56px;padding-bottom: 80px;"
        >
          <!--Demo-->
          <div class="flex align-center border-bottom padding-bottom-24 margin-top-24" style="width: 100%;position: relative;">
            <!--大左-->
            <div class="flex justify-between" style="width: 80%;">
              <!--左-->
              <div class="flex" style="width: 40%;height: 140px;">
                <img v-if="modelInfo.coverUrl!==undefined && modelInfo.coverUrl!=null" :src="modelInfo.coverUrl" alt="" height="100%" width="100%">
              </div>
              <!--中-->
              <div class="flex flex-direction" style="width: 55%;">
                <div class="flex font-weight font-size-16 color-title margin-bottom-8">
                  {{ modelInfo.id }}-{{ modelInfo.modelNameCh }}
                </div>
                <content-style
                    :text="modelInfo.modelShortDescribe"
                    style="margin-bottom: 24px;"
                />
                <div class="flex font-size-14 color-content margin-bottom-24">
                  <div class="flex">
                    版本 {{ modelInfo.versionName }}
                  </div>
                  <div class="flex margin-left-16">
                    更新时间 {{ modelInfo.updateTime }}
                  </div>
                </div>
                <div class="flex">
                  <div class="flex model-base-content-1-bottom-1 font-size-12 margin-right-8 padding-top-4 padding-bottom-4 padding-left-8 padding-right-8"
                       style="border-radius: 13px;background: linear-gradient(264deg, rgba(169,191,242,0.3), rgba(116,152,233,0.6));color: #B4D1E7;">
                    {{ modelInfo.scenesName }}
                  </div>
                  <div style="border-radius: 13px;background: linear-gradient(90deg, rgba(66,189,189,0.3), rgba(12,95,95,0.6));color: #ABE1F6;"
                       class="flex model-base-content-1-bottom-1 font-size-12 margin-right-8 padding-top-4 padding-bottom-4 padding-left-8 padding-right-8" >
                    {{ modelInfo.modelTypeName }}
                  </div>
                </div>
              </div>
            </div>
            <!--右-->
            <div class="flex flex-1 justify-end align-center">
              <Button @click="applicate" type="primary" style="height: 32px;width: 88px;color: #9EB5CD;" >应用</Button>
            </div>
            <!--返回-->
            <div class="color-white flex align-center hand hover-to-change" style="position: absolute;top: 0px;right: 0px;" @click="returnModelBase">
              <Icon type="md-arrow-back"/>
              <span class="font-size-14">返回</span>
            </div>
          </div>
          <!--模型描述-->
          <div class="flex flex-direction margin-top-24">
            <title-style title="模型描述" :font-size="16" :not-margin-bottom="true" />
            <!--          <content-style-->
            <!--            :text="modelInfo.modelDescribe">-->
            <!--          </content-style>-->
            <!--          <markdown-editor :is-edit="false" v-model="modelInfo.modelDescribe" />-->
            <viewer :initial-value="modelInfo.modelDescribe" height="500px" />
          </div>
        </div>
      </div>
      <!--加载效果-->
      <div v-if="loading" class="flex justify-center align-center" style="width: 100%;min-height: 592px;">
        <div class="flex flex-direction align-center">
          <div class="loading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/vue-editor';
import ModelApplication from "@/views/modelBase/ModelApplication";
import DialogMask from "@/components/DialogMask";
import 'public/css/markdown.css'

export default {
  props:{
    id:{
      type:Number,
      required:true,
    }
  },
  components: {
    TitleStyle: () => import('@/components/TitleStyle'),
    ContentStyle: () => import('@/components/ContentStyle'),
    viewer: Viewer,
    ModelApplication,
    DialogMask,
  },
  data() {
    return {
      loading: false,
      modelInfo: {},
      showMoast:false,//授权弹框

    };
  },
  created() {
    this.previewModel();
  },
  methods: {
    //点击应用事件
    applicate(){
      this.showMoast = true
    },
    //获取模型信息
    previewModel() {
      this.loading = true
      this.$request.get('/v2/models/'+this.id).then(res => {
        this.modelInfo = res.data.data;
        this.loading = false;
      });
    },
    returnModelBase() {
      this.$router.replace({
        name:'modelBaseList',
      })
    },
  }
};
</script>

<style scoped>
.hover-to-change:hover{
  color: #accdf3;
}
</style>
