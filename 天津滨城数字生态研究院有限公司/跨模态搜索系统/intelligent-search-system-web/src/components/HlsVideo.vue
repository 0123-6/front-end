<template>
  <div class="flex justify-center items-center" style="width: 100%;height: 100%">
    <video preload="auto"  muted controls autoplay loop
           ref="videoPlayer" class="video-js vjs-default-skin vjs-livevjs-progress-control" width="100%" height="100%"
           id="my-video">
    </video>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

import 'videojs-contrib-hls';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@videojs/http-streaming';
// import 'video.js/dist/lang/zh-CN.js';

export default {
  name: 'HlsVideo',
  props: ['src', 'poster'],
  data() {
    return {
      options: {
        // playbackRates: [0.25, 0.5, 1.0, 1.25, 2.0], // 可选择的播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '528:278',
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        controls: true,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        },
        notSupportedMessage: '前方视频信号中断，请稍后再试。',
        sources: [{
          type: 'application/x-mpegURL',
          src: ''
        }],
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: true,
        poster: '' // 你的封面地址
      }
    };
  },
  mounted() {
    videojs.addLanguage('zh-CN', {
      Play: '播放',
      Pause: '暂停',
      'Current Time': '当前时间',
      Duration: '时长',
      'Remaining Time': '剩余时间',
      'Stream Type': '媒体流类型',
      LIVE: '直播',
      Loaded: '加载完成',
      Progress: '进度',
      Fullscreen: '全屏',
      'Non-Fullscreen': '退出全屏',
      'Picture-in-Picture': '画中画',
      'Exit Picture-in-Picture': '退出画中画',
      Mute: '静音',
      Unmute: '取消静音',
      'Playback Rate': '播放速度',
      Subtitles: '字幕',
      'subtitles off': '关闭字幕',
      Captions: '内嵌字幕',
      'captions off': '关闭内嵌字幕',
      Chapters: '节目段落',
      'Close Modal Dialog': '关闭弹窗',
      Descriptions: '描述',
      'descriptions off': '关闭描述',
      'Audio Track': '音轨',
      'You aborted the media playback': '视频播放被终止',
      'A network error caused the media download to fail part-way.': '网络错误导致视频下载中途失败。',
      // eslint-disable-next-line max-len
      'The media could not be loaded, either because the server or network failed or because the format is not supported.': '视频因格式不支持或者服务器或网络的问题无法加载。',
      // eslint-disable-next-line max-len
      'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.': '由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。',
      'No compatible source was found for this media.': '无法找到此视频兼容的源。',
      'The media is encrypted and we do not have the keys to decrypt it.': '视频已加密，无法解密。',
      'Play Video': '播放视频',
      Close: '关闭',
      'Modal Window': '弹窗',
      'This is a modal window': '这是一个弹窗',
      'This modal can be closed by pressing the Escape key or activating the close button.': '可以按ESC按键或启用关闭按钮来关闭此弹窗。',
      ', opens captions settings dialog': ', 开启标题设置弹窗',
      ', opens subtitles settings dialog': ', 开启字幕设置弹窗',
      ', opens descriptions settings dialog': ', 开启描述设置弹窗',
      ', selected': ', 选择',
      'captions settings': '字幕设定',
      'Audio Player': '音频播放器',
      'Video Player': '视频播放器',
      Replay: '重新播放',
      'Progress Bar': '进度条',
      'Volume Level': '音量',
      'subtitles settings': '字幕设定',
      'descriptions settings': '描述设定',
      Text: '文字',
      White: '白',
      Black: '黑',
      Red: '红',
      Green: '绿',
      Blue: '蓝',
      Yellow: '黄',
      Magenta: '紫红',
      Cyan: '青',
      Background: '背景',
      Window: '窗口',
      Transparent: '透明',
      'Semi-Transparent': '半透明',
      Opaque: '不透明',
      'Font Size': '字体尺寸',
      'Text Edge Style': '字体边缘样式',
      None: '无',
      Raised: '浮雕',
      Depressed: '压低',
      Uniform: '均匀',
      Dropshadow: '下阴影',
      'Font Family': '字体库',
      'Proportional Sans-Serif': '比例无细体',
      'Monospace Sans-Serif': '单间隔无细体',
      'Proportional Serif': '比例细体',
      'Monospace Serif': '单间隔细体',
      Casual: '舒适',
      Script: '手写体',
      'Small Caps': '小型大写字体',
      Reset: '重置',
      'restore all settings to the default values': '恢复全部设定至预设值',
      Done: '完成',
      'Caption Settings Dialog': '字幕设定窗口',
      'Beginning of dialog window. Escape will cancel and close the window.': '打开对话窗口。Escape键将取消并关闭对话窗口',
      'End of dialog window.': '结束对话窗口',
      'Seek to live, currently behind live': '尝试直播，当前为延时播放',
      'Seek to live, currently playing live': '尝试直播，当前为实时播放',
      'progress bar timing: currentTime={1} duration={2}': '{1}/{2}',
      '{1} is loading.': '正在加载 {1}。'
    });
    console.log('this.src: ', this.src);
    this.options.sources[0].src = this.src;
    if (this.poster != null && this.poster !== '') {
      this.options.poster = this.poster;
    }

    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      this.player.log('onPlayerReady', this);
      this.player.on('error', function (e, b, c) {
        this.errorDisplay.contentEl().innerText = '前方视频信号中断，请稍后再试。';
      });
      this.player.on('retryplaylist', () => {
        console.log('ts文件获取失败404.....');
        // this.load();
        this.play();
      });
      // 当前视频加载到足够持续播放的数据后触发 loadeddata
      // 也可以使用 loadedmetadata 事件，它在加载完视频元数据后触发，也足够播放视频了
      this.player.on('loadeddata', () => {
        // 先设置静音
        this.player.muted(true);
        // 再执行播放
        this.player.play();
      });
    });
    videojs.hook('beforeerror', (player, err) => {
      console.log('hook - beforeerror', player.src(), err);
      // Video.js 在切换/指定 source 后立即会触发一个 err=null 的错误，这里过滤一下
      if (err !== null) {
        setTimeout(() => {
          console.log('hh');
          player.src(this.src);
        }, 3000);
      }
      // 清除错误，避免 error 事件在控制台抛出错误
      return null;
    });
    this.player.ready(() => {
      // 丢失 source 事件处理
      this.player.tech().on('retryplaylist', () => {
        setTimeout(() => {
          console.log('event - retryplaylist');
          this.player.src(this.src);
        }, 3000);
      });
    });
  },
  activated() {
    if (this.player.paused()) {
      this.player.play();
    }
  },
  deactivated() {
  },
  beforeDestroy() {
    this.closeVideo();
  },
  methods: {
    // 手动在外部关闭
    closeVideo() {
      if (this.player) {
        this.player.dispose();
      }
    }
  }
};
</script>

<style scoped>
.vjs-livevjs-progress-control {
  display: block;
}
</style>
