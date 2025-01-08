<template>
  <div class="audio-player-container">
    <!-- 音频容器 -->
    <div id="waveform" ref="waveform" />
    <!-- 时间线容器 -->
    <div id="timeline" ref="timeline" />
    <div class="controls-container">
      <img :src="zoomOutIcon" alt="" class="zoomOut-icon" @click="zoomInWaveform">
      <el-slider v-model="currentZoom" :show-tooltip="false" class="progress-bar" @change="changeCurrentZoom" />
      <img :src="zoomInIcon" alt="" class="zoomIn-icon" @click="zoomOutWaveform">
      <el-slider v-model="currentVolume" :show-tooltip="false" class="volume-bar" @change="changeCurrentVolume" />
      <img :src="volumeIcon" alt="" class="volume-icon">
      <img v-if="!currentPlayState" :src="playIcon" alt="" class="play-icon" @click="onPlay">
      <img v-else :src="pauseIcon" alt="" class="pause-icon" @click="onPause">
      <el-select v-model="currentSpeed" placeholder="1" class="speed-selection" @change="changeCurrentSpeed">
        <el-option
          v-for="item in speedOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>
<script>
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline'; // Timeline插件
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
export default {
  props: {
    audioSrc: {
      type: String,
      required: true
    },
    labelConfig: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      wavesurfer: '',
      volumeIcon: require('@/assets/images/volume.png'),
      zoomInIcon: require('@/assets/images/zoomIn.png'),
      zoomOutIcon: require('@/assets/images/zoomOut.png'),
      playIcon: require('@/assets/images/play-circle.png'),
      pauseIcon: require('@/assets/images/pause-circle.png'),
      currentZoom: 1,
      currentVolume: 50,
      currentPlayState: true,
      speedOptions: [
        // { value: 0.25, label: '0.25X' },
        { value: 0.5, label: '0.5X' },
        // { value: 0.75, label: '0.75X' },
        { value: 1, label: '1X' },
        { value: 1.25, label: '1.25X' },
        { value: 1.5, label: '1.5X' },
        // { value: 1.75, label: '1.75X' },
        { value: 2, label: '2X' }
      ],
      currentSpeed: 1,
      interactionClick: false,
      audioProcessTime: 0
    };
  },
  watch: {
    audioSrc: function() {
      this.$nextTick(() => {
        document.getElementById('waveform').innerHTML = '';
        this.initAudio();
      });
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     document.getElementById('waveform').innerHTML = ''
  //     this.initAudio()
  //   })
  // },
  methods: {
    initAudio() {
      this.wavesurfer = WaveSurfer.create({
        container: this.$refs.waveform, // 绑定容器，第一种方法
        audioRate: this.currentSpeed, // 控制播放速度
        forceDecode: true,
        waveColor: '#9AC1FF',
        progressColor: '#0164FF',
        backend: 'MediaElement',
        plugins: [
          Timeline.create({
            container: this.$refs.timeline, // 绑定容器
            secondaryColor: '#FF0000', // 次要时间标签颜色，红色
            secondaryFontColor: '#FF0000',
            secondaryLabelInterval: this._secondaryLabelInterval,
            primaryColor: '#3498DB', // 主要时间标签颜色，蓝色
            primaryFontColor: '#3498DB',
            primaryLabelInterval: this._primaryLabelInterval,
            formatTimeCallback: this._formatTimeCallback,
            timeInterval: this._timeInterval,
            labelPadding: 2
          }),
          Regions.create()
        ]
      });
      this.wavesurfer.load(this.audioSrc);
      this.wavesurfer.on('ready', () => { this.onPlay(); });
      this.wavesurfer.on('finish', () => {
        this.wavesurfer.stop();
        this.currentPlayState = false;
      });
      this.wavesurfer.on('interaction', (e) => {
        this.interactionClick = true;
      });
      this.wavesurfer.on('audioprocess', (e) => {
        this.audioProcessTime = e;
        if (this.interactionClick) {
          this.$emit('process', this.audioProcessTime);
          this.interactionClick = false;
        }
      });
      if (this.labelConfig.length > 0) {
        this.labelConfig.map(item => {
          this.wavesurfer.addRegion({
            start: item.start,
            end: item.end,
            loop: false,
            drag: false,
            resize: false,
            color: item.fillStyle
          });
        });
      }
    },
    // 重写时间线的时间格式：
    _formatTimeCallback(seconds, pxPerSec) {
      seconds = Number(seconds);
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      var secondsStr = Math.round(seconds).toString();
      if (pxPerSec >= 25 * 10) {
        secondsStr = seconds.toFixed(2);
      } else if (pxPerSec >= 25) {
        secondsStr = seconds.toFixed(1);
      }
      if (minutes > 0) {
        if (seconds < 10) {
          secondsStr = '0' + secondsStr;
        }
        return `${minutes}:${secondsStr}`;
      }
      return secondsStr;
    },
    // 重写时间间隔数，以分钟为单位的持续时间：
    _timeInterval(pxPerSec) {
      let retval = 1;
      if (pxPerSec >= 100) { // 0.5,1,1.5,2,...,9.5,10
        retval = 0.5;
      } else if (pxPerSec >= 80) { // 1,2,...,9,10
        retval = 1;
      } else if (pxPerSec >= 60) { // 2,4,6,8,10
        retval = 2;
      } else if (pxPerSec >= 40) { // 5,10
        retval = 1;
      } else if (pxPerSec >= 20) {
        retval = 5;
      } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
      }
      return retval;
    },
    // 重写主要时间标签的数量：
    _primaryLabelInterval(pxPerSec) {
      let retval = 1;
      if (pxPerSec >= 100) {
        retval = 2;
      } else if (pxPerSec >= 80) {
        retval = 1;
      } else if (pxPerSec >= 60) {
        retval = 1;
      } else if (pxPerSec >= 40) {
        retval = 5;
      } else if (pxPerSec >= 20) {
        retval = 2;
      } else {
        retval = 1;
      }
      return retval;
    },
    // 重写次要时间标签的数量：
    _secondaryLabelInterval(pxPerSec) {
      if (pxPerSec >= 20 && pxPerSec < 40) {
        return 12;
      } else if (pxPerSec >= 0 && pxPerSec < 20) {
        return 10;
      } else {
        return Math.floor(10 / this._timeInterval(pxPerSec));
      }
    },
    // 暂停
    onPause() {
      this.wavesurfer.pause();
      this.currentPlayState = false;
      this.$emit('pause');
    },
    // 播放
    onPlay() {
      this.wavesurfer.play();
      this.currentPlayState = true;
      this.$emit('play');
    },
    // 拖动进度条，改变缩放比例 index是进度条改变时的回调函数的参数 值为0~100之间
    changeCurrentZoom(index) {
      this.wavesurfer.zoom(Number(index));
    },
    // 缩小
    zoomInWaveform() {
      if (this.currentZoom <= 1) return;
      this.currentZoom -= 1;
      this.changeCurrentZoom(this.currentZoom);
    },
    // 放大
    zoomOutWaveform() {
      if (this.currentZoom >= 100) return;
      this.currentZoom += 1;
      this.changeCurrentZoom(this.currentZoom);
    },
    // 拖动进度条，改变当前音量 index是进度条改变时的回调函数的参数 值为0~100之间，需要换算成实际音量0-1
    changeCurrentVolume(index) {
      this.wavesurfer.setVolume(index / 100);
      this.$emit('volume', index / 100);
    },
    // 改变当前播放倍速
    changeCurrentSpeed(value) {
      this.wavesurfer.setPlaybackRate(value);
      this.$emit('speed', value);
    },
    // 增加选区
    addRegion() {
      this.labelConfig.map(item => {
        this.wavesurfer.addRegion({
          start: item.start,
          end: item.end,
          loop: false,
          drag: false,
          resize: false,
          color: item.fillStyle
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.audio-player-container {
  padding: 32px;
  .controls-container {
    margin-top: 32px;
    .progress-bar {
      display: inline-block;
      width: 40%;
    }
    .zoomOut-icon {
      position: relative;
      top: -6px;
      right: 8px;
    }
    .zoomIn-icon {
      position: relative;
      top: -6px;
      left: 8px;
    }
    .volume-bar {
      display: inline-block;
      width: 100px;
      margin-left: 50px;
    }
    .volume-icon {
      position: relative;
      top: -6px;
      left: 8px;
    }
    .play-icon {
      position: relative;
      top: -6px;
      left: 24px;
      cursor: pointer;
    }
    .pause-icon {
      position: relative;
      top: -6px;
      left: 24px;
      cursor: pointer;
    }
    .speed-selection {
      margin-left: 50px;
      width: 100px;
      position: relative;
      top: -15px;
    }
  }
}
::v-deep #waveform {

  ::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
</style>
