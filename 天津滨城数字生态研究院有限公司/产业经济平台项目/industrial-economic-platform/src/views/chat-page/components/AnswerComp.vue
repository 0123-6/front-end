<template>
  <!--最外层-->
  <div class="answer-comp tw-w-full tw-flex tw-flex-col">
    <div v-if="(!item?.stopGenerate || item.answer!==null)"
         class="tw-mt-[20px] tw-w-full tw-flex tw-items-start">
      <div class="tw-w-[48px] tw-h-[64px] tw-min-h-[64px] tw-flex tw-flex-col tw-mr-[9px]">
        <img src="../icon/RobotSvg.svg" alt="">
      </div>
      <!--item.answer===null-->
      <div v-if="item.answer===null" class="tw-h-[48px] tw-flex tw-items-center">
        <span class="tw-text-[#646464] tw-text-base">正在为您生成答案{{text}}</span>
      </div>
      <!--!(item.answer===null)    回答-->
      <div v-if="!(item.answer===null) && item?.errorCode !== 100 && item?.errorCode !== 101"
           class="tw-bg-white tw-rounded-2xl tw-flex tw-flex-col tw-pt-[20px] tw-pr-[24px] tw-pb-[20px] tw-pl-[24px] my-viewer tw-relative tw-group"
           style="max-width: 70.25%;box-shadow: 0px 2px 8px 0px rgba(217,222,238,1);"
      >
        <ViewerTimeout :content="item?.answer"
                       :just-show="item?.justShow"
                       @on-ok="showOnOk"
                       :stop-generate="item?.stopGenerate"/>
        <!--相关政策-->
        <div v-if="(item?.justShow===undefined || showFinished) && item?.relation_zc?.length>0"
             class="tw-mt-[4px] tw-box-border tw-w-full tw-border-t tw-border-[#f2f2f2] tw-flex tw-flex-wrap"
        >
          <span class="tw-mt-[8px] tw-mr-[8px] tw-h-[28px] tw-flex tw-items-center tw-text-base tw-text-[#262626] tw-font-bold">参考信息:</span>
          <div v-if="item?.relation_zc">
            <div v-for="(item, index) in item?.relation_zc"
                 :key="index"
                 @click="$emit('click-relation-zc', item.id)"
                 class="tw-mt-2 tw-mr-2 tw-max-w-[187px] tw-pl-1 tw-pr-1 tw-h-[28px] tw-flex tw-items-center tw-bg-[#d8e0ff] tw-rounded-lg tw-cursor-pointer"
            >
              <span class="tw-flex tw-items-center tw-text-sm tw-text-main hpj-text-hidden">{{item?.title}}</span>
            </div>
          </div>
        </div>
        <!--点赞，踩-->
        <div v-if="item?.id && (showFinished || item?.justShow || item?.stopGenerate)">
<!--          (item: any, name: string, index: number) => void-->
          <like-or-unlike-or-copy class="tw-hidden group-hover:tw-flex tw-absolute tw-right-0 tw-top-[-50px]"
                                  :like="item?.like"
                                  @inner-click="name => $emit('click-like-or-unlike-or-copy', {item,name,index})"
          />
        </div>
      </div>
      <!--异常情况-->
      <div v-if="!(item.answer===null) && (item?.errorCode === 100 || item?.errorCode === 101)"
           class="tw-bg-white tw-rounded-2xl tw-flex tw-flex-col tw-pr-[19px] tw-pl-[19px] my-viewer tw-relative tw-group"
           style="max-width: 70.25%;box-shadow: 0px 2px 8px 0px rgba(217,222,238,1);"
      >
        <div class="tw-flex tw-items-center" style="height: 44px;">
          <img src="../icon/WarningSvg.svg" alt="" style="width: 20px;height: 20px;">
          <span class="tw-ml-[13px] tw-flex tw-items-center tw-text-base tw-text-[#262626] hpj-text-hidden">{{errorCodeToText[item.errorCode]}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ViewerTimeout from '@/views/chat-page/components/ViewerTimeout';
import LikeOrUnlikeOrCopy from '@/views/chat-page/components/LikeOrUnlikeOrCopy';

export default {
  name: 'AnswerComp',
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  components: {
    ViewerTimeout,
    LikeOrUnlikeOrCopy,
  },
  data() {
    return {
      // 是否答案显示完毕
      showFinished: false,
      text: '.',
      // 定时器
      timer: null,
      errorCodeToText: {
        100: '对不起，当前输入字符数已超限，请点击“新建会话”再向我提问~',
        101: '对不起，单次会话只支持10个提问，请点击“新建会话”再向我提问~',
      },
    };
  },
  watch: {
    item: {
      handler() {
        console.log('AnswerComp item change');
        console.log('this.item');
        if (this.item?.answer !== null) {
          clearInterval(this.timer);
          this.timer = null;
        }
        if (this.item?.justShow) {
          this.showFinished = true;
        }
      },
      deep: true,
    }
  },
  created() {
    if (this.item?.errorCode || this.item?.justShow) {
      this.showOnOk();
    } else if (this.item?.answer === null) {
      this.timer = setInterval(() => {
        if (this.text.length === 3) {
          this.text = '.';
        } else {
          this.text += '.';
        }
      }, 500);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    showOnOk() {
      console.log('into showOnOk');
      this.showFinished = true;
      this.$emit('on-ok');
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep {
  .answer-comp {

  }
}
</style>

<style>
.my-viewer > div {
  max-width: 100%!important;
  word-break: break-all!important;
}
</style>
