<template>
  <!--最外层-->
  <el-dialog
    class="rounded shadow-dialog"
    v-dialogDrag
    title="详细信息"
    visible
    width="900px"
    :close-on-click-modal="false"
    :custom-class="'detail-dialog'"
    :before-close="cancelOperation"
  >
    <!--最外层-->
    <div class="w-full bg-white"
         style="height: 554px;padding: 18px 23px 32px 27px;border-radius: 0 0 4px 4px;">
      <!--内容区域-->
      <div class="w-full h-full rounded shadow-card-light border-[1px] flex flex-col"
           style="border-color: rgba(234,234,234,1);border-radius: 4px 4px 0 0;" v-loading="loading">
        <!--上,视频-->
        <div class="flex justify-center w-full bg-black-real" style="height: 366px;border-radius: 4px 4px 0 0;">
<!--          <source  type="video/mp4"/>autoplay-->
<!--          <video id="myVideo" v-if="data" muted loop controls-->
<!--                 :src="data.monitoringInfo.videoStreamAddress" style="width: 100%;height: 100%;"></video>-->
          <hls-video v-if="!loading && data"
                     :src="data?.monitoringInfo.videoStreamAddress"
                     :poster="poster"
                     style="width: 695px;height: 100%;"></hls-video>
        </div>
        <!--下，内容-->
        <div class="w-full pl-4 pr-4 flex flex-col text-sm text-black">
          <!--上-->
          <div class="w-full mt-4 flex">
            <!--左-->
            <div class="w-1/2 flex flex-col">
              <!--监控点位置-->
              <div class="w-full flex">
                <!--name-->
                <span class="flex">监控点位置: </span>
                <!--value-->
                <span class="ml-2 text-hidden"
                      style="width: calc(100% - 84px);"
                      :title="data && data.device.monitorPointLocation.length > 23 ? data.device.monitorPointLocation : null">
                  {{data && data.device.monitorPointLocation}}
                </span>
              </div>
              <!--经度-->
              <div class="w-full flex" style="margin-top: 10px;">
                <!--name-->
                <span class="flex">经度: </span>
                <!--value-->
                <span class="ml-2 text-hidden" style="width: calc(100% - 40px);">{{data && data.device.longitude}}</span>
              </div>
              <!--纬度-->
              <div class="w-full flex" style="margin-top: 10px;">
                <!--name-->
                <span class="flex">纬度: </span>
                <!--value-->
                <span class="ml-2 text-hidden" style="width: calc(100% - 40px);">{{data && data.device.latitude}}</span>
              </div>
            </div>
            <!--右-->
            <div class="w-1/2 flex flex-col">
              <!--监控点名称-->
              <div class="w-full flex">
                <!--name-->
                <span class="flex">监控点名称: </span>
                <!--value-->
                <span class="ml-2 text-hidden"
                      style="width: calc(100% - 84px);"
                      :title="data && data.device.monitorPointName.length > 23 ? data.device.monitorPointName : null">
                  {{data && data.device.monitorPointName}}
                </span>
              </div>
              <!--设备类型-->
              <div class="w-full flex" style="margin-top: 10px;">
                <!--name-->
                <span class="flex">设备类型: </span>
                <!--value-->
                <span class="ml-2 text-hidden"
                      style="width: calc(100% - 68px);"
                      :title="data && data.device.deviceType.length > 24 ? data.device.deviceType : null">
                  {{data && data.device.deviceType}}
                </span>
              </div>
              <!--时间-->
              <div class="w-full flex" style="margin-top: 10px;">
                <!--name-->
                <span class="flex">时间: </span>
                <!--value-->
                <span class="ml-2 text-hidden" style="width: calc(100% - 40px);">{{data && monitoringTime}}</span>
              </div>
            </div>
          </div>
          <!--下,模型名称-->
          <div class="mt-3 w-full flex items-center">
            <span class="flex" style="margin-right: 14px;">
              模型名称:
            </span>
            <div v-if="data" class="flex items-center">
              <div class="flex items-center rounded ml-2 hover:cursor-pointer"
                   style="height: 24px;background: rgba(12,97,170,0.07);"
                   v-for="(item,index) in data.model.slice(0, 3)"
                   @click="goModelDetail(item)"
                   :key="index">
                <img src="@/assets/model.svg" style="width: 12px;height: 12px;" alt="" class="ml-2 mr-2">
                <!--文字-->
                <el-tooltip effect="dark"
                            :content="item.modelName"
                            :disabled="item.modelName.length <= 10"
                            placement="top">
                  <span class="text-black text-sm text-hidden mr-2"
                        style="max-width: 140px;">{{item.modelName}}</span>
                </el-tooltip>
              </div>
            </div>
            <el-tooltip v-if="data && data.model.length >= 4" placement="right-end" effect="light">
              <div slot="content">
                <div class="flex flex-col"
                     style="width: 358px;max-height: 355px;padding: 14px;">
                  <div class="w-full flex items-center hover:cursor-pointer"
                       style=""
                       :class="[index===0 ? '' : 'mt-4']"
                       v-for="(item, index) in data.model.slice(3)"
                       @click="goModelDetail(item)"
                       :key="index">
                    <img src="@/assets/model.svg" style="width: 12px;height: 12px;" alt="" class="mr-2">
                    <span class="text-black text-sm text-hidden"
                          style="width: calc(100% - 20px);"
                          :title="item.modelName.length > 22 ? item : null">{{item.modelName}}</span>
                  </div>
                </div>
              </div>
              <div v-if="data.model.length >= 4"
                   style="background: rgba(12,97,170,0.07);width: 68px;height: 24px;"
                   class="ml-2 flex justify-center items-center rounded">
                更多&gt;
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getVideoDetail } from '@/api/search';
import HlsVideo from '@/components/HlsVideo';

export default {
  name: 'VideoDetail',
  components: {
    HlsVideo
  },
  props: {
    monitorPointId: {
      type: String,
      required: true
    },
    monitoringTime: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      required: true
    }
  },
  created() {
    this.getVideoDetail();
  },
  data() {
    return {
      data: null,
      // 加载中
      loading: false
    };
  },
  methods: {
    // 获取视频详情
    getVideoDetail() {
      const params = {
        monitorPointId: this.monitorPointId,
        monitoringTime: this.monitoringTime
      };
      this.loading = true;
      getVideoDetail(params).then((res) => {
        function setVideoTime() {
          this.currentTime = this.duration / 2;
          this.removeEventListener('canplay', setVideoTime, false);
        }
        this.data = res.data;
        // const url = this.data.monitoringInfo.videoStreamAddress.toString();
        // const arrUrl = url.split('//')[1].split('/');
        // arrUrl.shift();
        // const path = arrUrl.join('/');
        // this.data.monitoringInfo.videoStreamAddress = `${window.location.origin}/py-video/${path}`;
        this.loading = false;
        // this.$nextTick(() => {
        //   // 获取video元素
        //   const myVideo = document.getElementById('myVideo');
        //   myVideo.addEventListener('canplay', setVideoTime, false);
        //   // myVideo.play();
        // });
      });
    },
    // 取消按钮
    cancelOperation() {
      this.$emit('cancel');
    },
    // 跳转到模型详情页面
    goModelDetail(model) {
      const params = {
        buttonVisible: false
      };
      sessionStorage.setItem('modelApplyButtonParams', JSON.stringify(params));
      const routeData = this.$router.resolve({
        path: `/library/detail/${model.modelId}`
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog__body {
  padding: 0px;
}
::v-deep .el-tooltip__popper.is-light {
  padding: 0!important;
  background-color: blue!important;
}
</style>
