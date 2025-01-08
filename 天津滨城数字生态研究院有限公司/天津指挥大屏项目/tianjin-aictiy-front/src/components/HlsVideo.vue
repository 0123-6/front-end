<template>
  <div class="flex justify-center align-center" style="width: 100%;height: 100%">
    <video ref="videoPlayer" class="video-js" width="100%" height="100%"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import "video.js/dist/video-js.css";

export default {
  name: "HlsVideo",
  props: ['src', 'poster'],
  data() {
    return {
      options: {
        // playbackRates: [0.25, 0.5, 1.0, 1.25, 2.0], // 可选择的播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: "auto", //auto metadata none
        language: "zh-CN",
        aspectRatio: "16:9",
        controls: true,
        notSupportedMessage: "前方视频信号中断，请稍后再试。",
        sources: [{
          type: "application/x-mpegURL",
          src: ""
        }],
      },
    };
  },
  mounted() {
    this.options.sources[0].src = this.src;
    if (this.poster != null && this.poster != "") {
      this.options.poster = this.poster
    }

    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      this.player.log('onPlayerReady', this);
      this.player.on('error', function (e, b, c) {
          this.errorDisplay.contentEl().innerText = '前方视频信号中断，请稍后再试。'
      })
    });
  },
  activated() {
    if(this.player.paused()){
      this.player.play()
    }
  },
  deactivated() {
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

<style scoped>
</style>
