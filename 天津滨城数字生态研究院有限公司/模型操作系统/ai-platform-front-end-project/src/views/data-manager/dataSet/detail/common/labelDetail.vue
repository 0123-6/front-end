<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-06 16:17:02
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-20 13:32:56
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\detail\common\labelDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="common-dataSet-label-detail-container">
    <ImageWithLabel
      v-if="detailType==='PICTURE'"
      :label-config="labelConfig"
      :image-url="imageUrl"
      :init-image-config="initImageConfig"
    />
    <TextWithLabel
      v-else-if="detailType==='TEXT'"
      :label-content="labelContent"
      :label-callout="labelConfig"
    />
    <AudioPlayer
      v-else-if="detailType==='VOICE'"
      :audio-src="audioUrl"
      :label-config="labelConfig"
    />
    <template v-else-if="detailType==='VIDEO'">
      <video ref="videoEL" :src="videoUrl" class="video-container" muted />
      <AudioPlayer
        :audio-src="audioUrl"
        :label-config="labelConfig"
        @play="playVideo"
        @pause="pauseVideo"
        @speed="changeVideoSpeed"
        @process="changeVideoProcess"
      />
    </template>
    <div class="label-studio-container">
      <div
        v-for="(item, index) in labelList"
        :key="index"
        class="label-container"
        :style="setStyle(item)"
      >
        <span class="label-type-container" :title="item.text">{{
          item.text
        }}</span>
        <span
          class="value-type-container"
        >
          {{ index }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import ImageWithLabel from '@/components/ImageWithLabel';
import TextWithLabel from '@/components/TextWithLabel';
import { getDataSetPlatTaskDetail } from '@/api/data-set';
import AudioPlayer from '@/components/AudioPlayer/index.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    ImageWithLabel,
    TextWithLabel,
    AudioPlayer
  },
  data() {
    return {
      webType: 'self',
      detailType: '',
      labelConfig: [],
      labelContent: '',
      imageUrl: '',
      audioUrl: '',
      videoUrl: '',
      initImageConfig: {},
      currentPage: 1
    };
  },
  computed: {
    ...mapGetters(['labelStudioUrl']),
    labelList() {
      const list = [];
      this.labelConfig.map(item => {
        const index = list.findIndex(innerItem => { return innerItem.text === item.text; });
        if (index < 0) {
          list.push(item);
        }
      });
      return list;
    }
  },
  mounted() {
    this.webType = this.$route.params.webType;
    this.detailType = sessionStorage.getItem('dataSetDetailType');
    this.getCardDetail();
  },
  methods: {
    // 获取详情信息
    getCardDetail() {
      const pageParams = {
        taskId: this.$route.params.labelId,
        token: 'Token d080a2576954dd32d250b2a94380d20292c67322'
      };
      this.labelConfig = [];
      this.imageUrl = '';
      this.audioUrl = '';
      this.videoUrl = '';
      this.initImageConfig = {};
      this.labelContent = '';
      getDataSetPlatTaskDetail(pageParams).then(res => {
        if (res.code === '000000') {
          if (this.detailType === 'PICTURE') {
            this.imageUrl = res.data.data.image.indexOf('http') >= 0 ? res.data.data.image : this.labelStudioUrl + res.data.data.image;
            if (res.data.annotations.length === 0) return;
            res.data.annotations[0].result.map((item) => {
              const obj = {};
              obj.type = item.type;
              obj.x = item.value.x / 100 * item.original_width;
              obj.y = item.value.y / 100 * item.original_height;
              obj.width = item.value.width / 100 * item.original_width;
              obj.height = item.value.height / 100 * item.original_height;
              obj.text = item.value[item.type][0];
              obj.strokeStyle = '#037CF9';
              obj.fillStyle = this.colorRgba('#037CF9');
              // label studio标注颜色8位16进制，#XXXXXX26
              this.initImageConfig.width = item.original_width;
              this.initImageConfig.height = item.original_height;
              this.labelConfig.push(obj);
            });
          } else if (this.detailType === 'TEXT') {
            this.labelContent = res.data.data.text;
            if (res.data.annotations.length === 0) return;
            res.data.annotations[0].result.map((item) => {
              const obj = {};
              obj.type = item.type;
              obj.value = item.value;
              obj.strokeStyle = '#037CF9';
              obj.fillStyle = this.colorRgba('#037CF9');
              obj.text = item.value[item.type][0];
              this.labelConfig.push(obj);
            });
          } else if (this.detailType === 'VOICE') {
            this.audioUrl = res.data.data.audio.indexOf('http') >= 0 ? res.data.data.audio : this.labelStudioUrl + res.data.data.audio;
            if (res.data.annotations.length === 0) return;
            res.data.annotations[0].result.map((item) => {
              const obj = {};
              obj.type = item.type;
              obj.start = item.value.start;
              obj.end = item.value.end;
              obj.strokeStyle = '#037CF9';
              obj.fillStyle = this.colorRgba('#037CF9');
              obj.text = item.value[item.type][0];
              this.labelConfig.push(obj);
            });
          } else if (this.detailType === 'VIDEO') {
            if (res.data.data.video_url) {
              this.videoUrl = res.data.data.video_url.indexOf('http') >= 0 ? res.data.data.video_url : this.labelStudioUrl + res.data.data.video_url;
              this.audioUrl = res.data.data.video_url.indexOf('http') >= 0 ? res.data.data.video_url : this.labelStudioUrl + res.data.data.video_url;
            } else {
              this.videoUrl = res.data.data.video_url.indexOf('http') >= 0 ? res.data.data.audio : this.labelStudioUrl + res.data.data.audio;
              this.audioUrl = res.data.data.video_url.indexOf('http') >= 0 ? res.data.data.audio : this.labelStudioUrl + res.data.data.audio;
            }
            if (res.data.annotations.length === 0) return;
            res.data.annotations[0].result.map((item) => {
              const obj = {};
              obj.type = item.type;
              obj.start = item.value.start;
              obj.end = item.value.end;
              obj.strokeStyle = '#037CF9';
              obj.fillStyle = this.colorRgba('#037CF9');
              obj.text = item.value[item.type][0];
              this.labelConfig.push(obj);
            });
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    playVideo() {
      this.$refs.videoEL.play();
    },
    pauseVideo() {
      this.$refs.videoEL.pause();
    },
    changeVideoSpeed(value) {
      this.$refs.videoEL.playbackRate = value;
    },
    changeVideoProcess(value) {
      this.$refs.videoEL.play();
      this.$refs.videoEL.currentTime = value;
    },
    setStyle(item) {
      const style = {};
      style.backgroundColor = item.fillStyle;
      style.borderColor = item.strokeStyle;
      return style;
    },
    // 颜色转换
    colorRgba(initColor) {
      // 16进制颜色值的正则
      const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      // 把颜色值变成小写
      let color = initColor.toLowerCase();
      if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
          let colorNew = '#';
          for (let i = 1; i < 4; i += 1) {
            colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
          }
          color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        const colorChange = [];
        for (let i = 1; i < 7; i += 2) {
          colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
        }
        return 'RGBA(' + colorChange.join(',') + ', 0.5)';
      } else {
        return color;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.common-dataSet-label-detail-container {
  .video-container {
    padding: 32px;
    width: 100%;
  }
  .label-studio-container {
    width: 600px;
    margin: 16px auto 0;
    padding-bottom: 40px;
    .label-container {
      padding: 8px;
      background-color: rgba(1,100,255,0.14);
      border-radius: 4px;
      border-left: 5px solid #0358DC;
      // width: 120px;
      display: inline-block;
      color: #646464;
      margin-right: 16px;
      margin-bottom: 16px;
      // & + .label-container {
      //   margin-left: 16px;
      // }
      .label-type-container {
        // width: 60px;
        display: inline-block;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
      .value-type-container {
        // width: calc(100% - 80px);
        display: inline-block;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        margin-left: 16px;
        text-align: right;
      }
    }
  }
}
</style>
