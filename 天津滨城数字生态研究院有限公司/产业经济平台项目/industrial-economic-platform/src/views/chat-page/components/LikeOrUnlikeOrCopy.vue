<template>
  <!--最外层-->
  <div class="tw-h-[50px] tw-bg-white tw-rounded-lg tw-items-center tw-text-[#646464]"
       style="box-shadow: rgb(217, 222, 238) 0px 1px 1px 0px;"
  >
    <!--点赞-->
    <el-tooltip v-if="!onlyShowCopy"
                content="点赞"
                placement="top"
                popper-class="like-or-unlike-or-copy"
    >
      <div class="tw-w-[50px] tw-min-w-[50px] tw-h-full tw-flex tw-flex-col tw-justify-between tw-items-center tw-cursor-pointer hover:tw-text-main tw-group/two"
           :class="[
               like===1 ? 'tw-text-main' : '',
             ]"
           @click="innerClick('点赞')"
      >
        <div class="tw-flex-1 tw-flex tw-justify-center tw-items-center">
          <like-svg/>
        </div>
        <div class="tw-w-[25px] tw-h-[4px] tw-rounded group-hover/two:tw-bg-main"
             :class="[
                 like===1 ? 'tw-bg-main' : 'tw-bg-white',
               ]"
        ></div>
      </div>
    </el-tooltip>
    <!--踩-->
    <el-tooltip v-if="!onlyShowCopy"
                content="踩"
                placement="top"
                popper-class="like-or-unlike-or-copy"
    >
      <div class="tw-w-[50px] tw-min-w-[50px] tw-h-full tw-flex tw-flex-col tw-justify-between tw-items-center tw-cursor-pointer hover:tw-text-main tw-group/two"
           :class="[
               true ? 'tw-border-l tw-border-white-divide' : '',
               like===-1 ? 'tw-text-main' : '',
             ]"
           @click="innerClick('踩')"
      >
        <div class="tw-flex-1 tw-flex tw-justify-center tw-items-center">
          <unlike-svg/>
        </div>
        <div class="tw-w-[25px] tw-h-[4px] tw-rounded group-hover/two:tw-bg-main"
             :class="[
                 like===-1 ? 'tw-bg-main' : 'tw-bg-white',
               ]"
        ></div>
      </div>
    </el-tooltip>
    <!--复制-->
    <el-tooltip content="复制"
                placement="top"
                popper-class="like-or-unlike-or-copy"
    >
      <div class="tw-w-[50px] tw-min-w-[50px] tw-h-full tw-flex tw-flex-col tw-justify-between tw-items-center tw-cursor-pointer hover:tw-text-main tw-group/two"
           :class="[
               true ? 'tw-border-l tw-border-white-divide' : '',
             ]"
           @click="innerClick('复制')"
      >
        <div class="tw-flex-1 tw-flex tw-justify-center tw-items-center">
          <copy-svg/>
        </div>
        <div class="tw-w-[25px] tw-h-[4px] tw-rounded tw-bg-white group-hover/two:tw-bg-main"
             :class="[]"
        ></div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>

import LikeSvg from '@/views/chat-page/icon/like/LikeSvg';
import UnlikeSvg from '@/views/chat-page/icon/like/UnlikeSvg';
import CopySvg from '@/views/chat-page/icon/like/CopySvg';

export default {
  name: 'LikeOrUnlikeOrCopy',
  components: { CopySvg, UnlikeSvg, LikeSvg },
  props: {
    // 0:空 1:点赞 -1:踩
    like: {
      type: Number,
      required: false,
      default: 0,
    },
    onlyShowCopy: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    if (this.onlyShowCopy) {
      this.list = [
        {
          name: '',
          icon: '<copy-svg/>',
        }
      ];
    } else {
      this.list = [
        {
          name: '',
          icon: '<LikeSvg/>',
        },
        {
          name: '',
          icon: '<UnlikeSvg/>',
        },
        {
          name: '复制',
          icon: '<CopySvg/>',
        }
      ];
    }
  },
  methods: {
    // 点击事件
    innerClick(name) {
      console.log(name);
      let newName = name;
      // 如果是点赞或者踩，就判断是否已经点过赞或者踩，如果是就取消，否则就点赞或者踩
      if ((name === '点赞' && this.like === 1) || (name === '踩' && this.like === -1)) {
        newName = null;
      }
      this.$emit('inner-click', newName);
    },
  },
};
</script>

<style lang="less" scoped>

</style>
