<template>
  <!--最外层-->
  <div id="layoutRef"
       ref="layoutRef"
       class="chat-right tw-flex-1 tw-h-full tw-relative tw-bg-[#f8f9fb] tw-overflow-auto tw-overflow-scroll"
       style="scroll-behavior: smooth;"
  >
    <!--地理位置选择组件-->
    <div v-if="type==='policy'"
         class="tw-absolute tw-top-[3.80vh] tw-left-[5.21vw] tw-flex tw-items-center">
      <cascader-select
        v-if="regionTree[0]?.children"
        ref="CascaderSelect"
        mode="text"
        :multiple="false"
        :showValueList="false"
        :strictly="true"
        placeholder="选择区域"
        :show-button-icon="false"
        :options="regionTree[0]?.children"
        :defaultValue="{}"
        :defaultProps="defaultProps"
        :show-country="true"
        level-prop="regionLevel"
        @confirm="confirmRegion" />
    </div>
    <!--内容区域-->
    <div class="tw-flex tw-flex-col tw-relative"
         style="width: calc(71.15vw - 240px);min-width: 630px;padding-left: 5vw;margin-top: 10.19vh;margin-bottom: 30vh;">
      <!--对话区域-->
      <span class="tw-w-full tw-flex tw-justify-center tw-font-bold tw-text-[#262626] tw-text-[24px] tw-leading-[24px]">关于{{typeToTitle[type]}}信息，您可以这样问我</span>
      <!--提示语区域-->
      <!--加载完成-->
<!--      v-if="!hintLoading && hintList.length > 0"-->
      <div v-loading="hintLoading"
           class="tw-w-full tw-grid tw-grid-cols-3 tw-gap-[24px] tw-mt-[5.65vh]"
           :style="{height: hintLoading ? 'calc(27.76vh + 70px)' : ''}"
      >
        <div v-for="(item, index) in hintList.slice(0, 6)"
             :key="index"
             class="tw-group tw-relative tw-w-full tw-box-border tw-bg-white tw-rounded-2xl tw-p-[20px] tw-text-base tw-leading-[24px] tw-text-[#262626] tw-flex tw-items-center hover:tw-shadow-[0px_2px_8px_0px_rgba(217,222,238,1)]"
             :class="[!(isThinking || errorCount >= 10) ? 'tw-cursor-pointer' : 'tw-cursor-not-allowed']"
             style="height: 13.88vh;min-height: 128px;"
             @click="!(isThinking || errorCount >= 10) ? clickHint(item) : null"
        >
          <span class="hpj-text-hidden-5">{{item}}</span>
          <div class="tw-hidden group-hover:tw-flex tw-absolute tw-right-[24px] tw-bottom-[9px] tw-w-[56px] tw-h-[24px] tw-bg-[#eaf0fe] tw-rounded-lg tw-justify-center tw-items-center">
            <span class="tw-text-sm tw-text-main">马上问</span>
          </div>
        </div>
      </div>
      <!--对话区域内容-->
      <div class="tw-w-full tw-flex tw-flex-col">
        <div v-for="(item, index) in chatList"
             :key="index"
             class="tw-w-full tw-flex tw-flex-col">
          <!--问题-->
          <div class="tw-mt-[43px] tw-w-full tw-flex tw-justify-end tw-items-start">
            <!--问题-->
            <div class="tw-rounded-2xl tw-flex tw-justify-center tw-items-center tw-pt-[10px] tw-pb-[10px] tw-pl-[34px] tw-pr-[34px] tw-relative tw-group"
                 style="background-image: linear-gradient(-47deg, #2554FF 2%, #53A9FF 100%);box-shadow: 0px 2px 8px 0px rgba(217,222,238,0.5);max-width: 70.25%;"
            >
              <span class="tw-text-base tw-leading-[24px] tw-text-white tw-break-all">{{item?.question}}</span>
              <!--悬浮组件-->
              <like-or-unlike-or-copy @inner-click="name => clickLikeOrUnlikeOrCopyQuestion(item, name, index)"
                                      :onlyShowCopy="true"
                                      class="tw-hidden group-hover:tw-flex tw-absolute tw-right-0 tw-top-[-50px]"/>
            </div>
            <!--头像-->
            <div class="tw-w-[48px] tw-min-w-[48px] tw-h-[50px] tw-min-h-[50px] tw-ml-[8px] tw-rounded-full tw-overflow-hidden tw-outline-2 tw-outline tw-outline-[#f2f2f2]"
                 style="">
              <img :src="iep_platform_USER_INFO?.avatar ? iep_platform_USER_INFO?.avatar : DefaultAvatarSvg" alt="" style="width: 100%;height: 100%;">
            </div>
          </div>
          <!--回答-->
          <answer-comp :index="index"
                       :item="item"
                       @click-relation-zc="clickRelationZc"
                       @click-like-or-unlike-or-copy="clickLikeOrUnlikeOrCopyAnswer"
                       @on-ok="answerOnOk"/>
          <!--点赞，踩-->
          <div v-if="item?.like !== 0"
               class="tw-mt-5 tw-w-full tw-flex tw-items-start">
            <div class="tw-w-[48px] tw-h-[64px] tw-min-h-[64px] tw-flex tw-flex-col tw-mr-[9px]">
            </div>
            <div class="tw-bg-white tw-rounded-2xl tw-flex tw-items-center tw-pt-[20px] tw-pr-[24px] tw-pb-[20px] tw-pl-[24px] my-viewer"
                 style="max-width: 70.25%;box-shadow: 0px 2px 8px 0px rgba(217,222,238,1);">
              <viewer-timeout v-if="item.like === 1" key="很高兴您喜欢这个答案" content="很高兴您喜欢这个答案" :just-show="item?.justShow"/>
              <viewer-timeout v-if="item.like === -1" key="感谢您的提醒" content="感谢您的提醒" :just-show="item?.justShow"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--底部固定区域-->
    <div class="tw-fixed tw-bottom-0 tw-flex tw-flex-col"
         style="width: calc(71.15vw - 240px - 5px);min-width: 630px;">
      <!--超出次数的提示语部分-->
      <div v-if="errorCount >= 10"
           class="tw-w-full tw-flex tw-items-center" style="margin-left: calc(5vw);">
        <div class="tw-flex-1 tw-h-[2px] tw-self-end tw-bg-[#E5E5E5]"/>
        <span class="tw-pl-[30px] tw-pr-[30px] tw-text-base tw-text-[#646464]">对不起，此对话已达到其限制。使用“新建会话”按钮进行更多问答</span>
        <div class="tw-flex-1 tw-h-[2px] tw-self-end tw-bg-[#E5E5E5]"/>
      </div>
      <!--输入框-->
      <div class="tw-mt-[19px] tw-w-full tw-flex tw-flex-col" style="padding-left: calc(5vw);">
        <!--停止生成等按钮-->
        <div v-if="isThinking"
             class="tw-mb-[29px] tw-w-full tw-flex tw-justify-center tw-items-center">
          <button class="tw-w-[139px] tw-h-[44px] tw-flex tw-justify-center tw-items-center tw-bg-white tw-rounded-2xl tw-text-base tw-text-main tw-box-border tw-border tw-border-solid tw-border-main tw-cursor-pointer hover:tw-text-main-hover
           hover:tw-border-main-hover active:tw-text-main-active active:tw-border-main-active"
                  style=""
                  @click="clickStopThinking">
            <div class="tw-flex tw-items-center">
              <div class="tw-w-[16px] tw-h-[16px] tw-bg-main tw-rounded-sm"></div>
              <span class="tw-ml-[6px] tw-flex tw-items-center">停止生成</span>
            </div>
          </button>
        </div>
        <!--重新回答按钮-->
        <div v-if="!isThinking && chatList.length > 0 && errorCount < 10"
             class="tw-mb-[16px] tw-w-full tw-flex tw-justify-end tw-items-center">
          <!--:disabled="chatList.length >= 10"-->
          <button class="tw-w-[139px] tw-h-[44px] tw-flex tw-justify-center tw-items-center tw-bg-white tw-rounded-2xl tw-text-base tw-text-main tw-box-border tw-border tw-border-solid tw-border-main tw-cursor-pointer hover:tw-text-main-hover
           hover:tw-border-main-hover active:tw-text-main-active active:tw-border-main-active"
                  style=""
                  :disabled="errorCount >= 10"
                  @click="clickReAddQuestion">
            <div class="tw-flex tw-items-center">
              <div class="tw-text-base tw-flex tw-items-center">
                <re-add-question-svg/>
              </div>
              <span class="tw-ml-[6px] tw-flex tw-items-center">重新回答</span>
            </div>
          </button>
        </div>
        <!--输入框-->
        <div class="tw-w-full tw-min-h-[60px] tw-flex tw-items-end tw-z-20 tw-relative tw-bg-cover"
             style="background-image: none;">
          <!--新建对话按钮-->
          <div class="tw-h-[60px] tw-flex tw-justify-center tw-items-center tw-rounded-2xl tw-cursor-pointer tw-bg-white"
               :class="[!isInputFocus ? 'tw-w-[153px]' : 'tw-w-[75px]']"
               style="box-shadow: 0px 2px 8px 0px rgba(217,222,238,1);transition: all 0.3s;"
               @click="clickNewChat">
            <img src="./icon/newChatSvg.svg" alt="" style="width: 26px;height: 26px;">
            <span class="tw-text-base tw-font-medium tw-overflow-hidden tw-flex tw-box-border"
                  :class="[!isInputFocus ? 'tw-w-[78px] tw-pl-[14px]' : 'tw-w-0']"
                  style="
                    background-image: linear-gradient(-47deg, #2554FF 50%, #53A9FF 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    transition: all 0.3s;
                    white-space: nowrap;"
            >新建会话</span>
          </div>
          <!--输入框-->
          <div class="tw-box-border tw-ml-[21px] tw-flex-1 tw-min-h-[60px] tw-flex tw-justify-between tw-items-start tw-bg-white tw-rounded-2xl tw-pl-[24px] tw-pr-[20px] tw-pt-[16px] tw-pb-[16px]"
               :class="[!(recording || recognizing || errorCount >= 10) ? 'tw-cursor-pointer' : 'tw-cursor-not-allowed']"
               style="box-shadow: 0px 2px 8px 0px rgba(217,222,238,1);"
               @click="!(recording || recognizing || errorCount >= 10) ? setInputFocus() : null">
            <span class="tw-w-[20px] tw-h-[28px] tw-text-[#8c8c8c] tw-flex tw-items-center">
              <chat-second-svg v-if="!(recording || recognizing)" style="width: 20px;height: 20px;"/>
            </span>
            <div class="tw-flex-1 tw-flex tw-flex-col">
              <div class="tw-w-full tw-min-h-[28px] tw-flex tw-items-center">
                <!--textarea-->
                <textarea ref="inputRef"
                          v-model="inputValue"
                          name=""
                          id=""
                          cols="30"
                          :rows="1"
                          :disabled="(recording || recognizing || errorCount >= 10)"
                          :maxlength="150"
                          autocomplete="off"
                          class="tw-ml-[12px] tw-flex-1"
                          :class="[!(recording || recognizing) ? '' : 'hidden']"
                          placeholder="有问题尽管问我…"
                          @keydown="onKeyDown"
                          @blur="isInputFocus = false"
                          @input="handleInput"
                ></textarea>
                <!--span-->
                <span class="tw-text-base tw-text-[#262626] tw-mb-[16px]"
                      :class="[!(recording || recognizing) ? 'tw-hidden' : 'tw-w-full tw-flex tw-justify-center tw-items-center']">
                  {{recognizing ? '正在识别…' : '正在听您说…'}}
                </span>
              </div>
              <div v-if="(recording || recognizing)"
                   class="tw-w-full tw-flex tw-justify-center tw-items-center tw-relative tw-h-[34px]">
                <div v-if="recording"
                     class="tw-w-full tw-flex tw-justify-center tw-items-center tw-relative">
                  <div class="tw-relative tw-flex tw-justify-center tw-items-center tw-w-[34px] tw-h-[34px] tw-text-white tw-text-[24px] mic-icon tw-bg-white tw-box-border tw-border tw-border-main tw-cursor-pointer"
                       style="border-radius: 50%;transition: all 0.3s ease-in-out;"
                       @click="handleStopRecording">
                    <div class="tw-flex tw-justify-center tw-items-center tw-text-main tw-w-[20px] tw-h-[20px]">
                      <sound-input-svg style="width: 100%;height: 100%;"/>
                    </div>
                  </div>
                </div>
                <div v-if="recognizing"
                     class="tw-w-full tw-flex tw-justify-center tw-items-center tw-relative tw-h-[34px]">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
            </div>
            <!--3-->
            <div class="tw-w-[26px] tw-h-[28px] tw-flex tw-items-center"
                 :class="[
                     (inputValue && !isThinking) ? 'tw-cursor-pointer tw-text-main' : 'tw-cursor-not-allowed tw-text-[#E5E5E5]',
                     !(recording || recognizing || errorCount >= 10) ? '' : 'tw-cursor-not-allowed'
                   ]"
                 @click="!(recording || recognizing || errorCount >= 10) ? clickAddQuestion($event) : null"
            >
              <send-svg v-if="!(recording || recognizing)"/>
            </div>
            <!--4-->
            <!--    @click="!(recording || recognizing) ? handleStartRecording($event) : null"           -->
            <div class="tw-ml-4 tw-w-[26px] tw-h-[28px] tw-flex tw-items-center tw-text-[#E5E5E5]"
                 :class="[
                     !isThinking ? 'tw-cursor-pointer hover:tw-text-main' : 'tw-cursor-not-allowed tw-text-[#E5E5E5]',
                     !(recording || recognizing || errorCount >= 10) ? '' : 'tw-cursor-not-allowed',
                   ]"
                 style="cursor: not-allowed;color: #E5E5E5;"
            >
              <sound-input-svg v-if="!(recording || recognizing)"/>
            </div>
          </div>
        </div>
      </div>
      <!--底部备案区域-->
      <div class="tw-flex tw-justify-center tw-items-center tw-bg-[#f8f9fb]"
           style="height: 40px;min-height: 40px;width: calc(100vw - 240px);"
      >
        <!--备案部分-->

      </div>
    </div>
    <!--悬浮右边区域，宽度过小不展示-->
    <div class="tw-hidden normal:tw-flex tw-fixed tw-right-[24px] tw-flex-col"
         style="width: calc((100vw - 240px) / 100 * 19);min-width: 220px;top: 17vh;">
      <span class="tw-text-base tw-text-[#262626] tw-font-medium">历史记录</span>
      <div style="box-shadow: 0px 2px 4px 0px rgba(198,198,198,0.5);"
           v-if="historyLoading || historyList.length > 0"
           class="tw-w-full tw-mt-[14px] tw-flex tw-flex-col tw-bg-[white] tw-rounded-lg tw-box-border"
           v-loading="historyLoading">
        <div class="tw-w-full tw-h-[10px]"/>
        <div class="tw-w-full tw-flex tw-flex-col tw-overflow-y-auto tw-box-border tw-pl-[4px] tw-pr-[4px]"
             style="min-height: 400px;max-height: 69.72vh;">
          <div v-for="(item, index) in historyList"
               :key="index"
               :class="[index > 0 ? 'tw-border-t tw-border-[#F5F5F5]' : '']"
               class="tw-group tw-w-full tw-h-[45px] tw-flex-shrink-0 tw-flex tw-items-center tw-text-sm tw-text-[#262626] tw-cursor-pointer tw-box-border"
               @click="clickHistory(index)">
            <div class="tw-w-full tw-h-[38px] tw-flex tw-items-center tw-rounded-lg group-hover:tw-bg-white group-hover:tw-shadow-[0px_0px_2px_0px_rgba(198,198,198,0.5)]"
                 :class="[index === historyEditIndex ? 'tw-bg-white tw-shadow-[0px_0px_2px_0px_rgba(198,198,198,0.5)]' : '']">
              <div class="tw-mr-[5px] tw-w-[5px] tw-h-full group-hover:tw-bg-main"
                   :class="[index === historyEditIndex ? 'tw-bg-main' : '']"
                   style="border-radius: 8px 0 0 8px;"/>
              <div v-if="index !== historyEditIndex"
                   class="tw-flex-1 tw-h-full tw-flex tw-items-center">
                <span class="tw-flex-1 hpj-text-hidden">{{item?.title}}</span>
                <span class="tw-flex tw-items-center group-hover:tw-hidden tw-text-[#8c8c8c]">{{item?.created_at}}</span>
                <el-tooltip popper-class="like-or-unlike-or-copy" content="编辑" placement="top">
                  <div class="tw-w-[28px] tw-h-[28px] tw-rounded tw-hidden group-hover:tw-flex tw-justify-center tw-items-center tw-text-[#646464] hover:tw-bg-[#F7F7F7] hover:tw-text-main"
                       @click="clickHistoryEdit($event,index)"
                  >
                    <edit-svg/>
                  </div>
                </el-tooltip>
                <el-tooltip popper-class="like-or-unlike-or-copy" content="删除" placement="top">
                  <div class="tw-ml-[4px] tw-mr-[4px] tw-w-[28px] tw-h-[28px] tw-rounded tw-hidden group-hover:tw-flex tw-justify-center tw-items-center tw-text-[#646464] hover:tw-bg-[#F7F7F7] hover:tw-text-[#EC1515]"
                       @click="clickHistoryDelete($event,index)">
                    <delete-svg/>
                  </div>
                </el-tooltip>
              </div>
              <div v-if="index === historyEditIndex"
                   class="tw-flex-1 tw-h-full tw-flex tw-items-center"
              >
                <input autocomplete="off"
                       autofocus
                       class="tw-flex-1"
                       style="font-size: 14px;line-height: 14px;height: 26px;border: 1px solid rgba(37,84,255,1);border-radius: 8px;color: #262626!important;"
                       @click="(e)=>e.stopPropagation()"
                       @keydown="historyEditOnKeyDown($event)"
                       ref="historyEditInputRef">
                <el-tooltip popper-class="like-or-unlike-or-copy" content="保存" placement="top">
                  <div class="tw-ml-[4px] tw-w-[28px] tw-h-[28px] tw-rounded tw-flex tw-justify-center tw-items-center tw-text-[#646464] hover:tw-bg-[#F7F7F7] hover:tw-text-main"
                       @click="historyEditOnOk($event)">
                    <img src="./icon/SuccessSvg.svg" alt="">
                  </div>
                </el-tooltip>
                <el-tooltip popper-class="like-or-unlike-or-copy" content="取消" placement="top">
                  <div class="tw-mr-[4px] tw-w-[28px] tw-h-[28px] tw-rounded tw-flex tw-justify-center tw-items-center tw-text-[#646464] hover:tw-bg-[#F7F7F7] hover:tw-text-main"
                       @click="historyEditOnCancel($event)">
                    <close-svg/>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="tw-w-full tw-h-[10px]"/>
      </div>
    </div>
    <!--弹框-->
    <dialog-prompt v-if="showDeleteModal"
                   @on-ok="deleteModalOnOk"
                    @on-cancel="deleteModalOnCancel">
      <template slot="content">
        <span class="tw-mt-[44px] tw-text-base tw-text-[#262626] tw-flex tw-items-center">确定删除<span class="tw-max-w-[180px] tw-text-main tw-pl-[4px] tw-pr-[4px] hpj-text-hidden">{{historyList[historyDeleteIndex]?.title}}</span>会话吗？</span>
      </template>
    </dialog-prompt>
  </div>
</template>

<script>
import copy from 'copy-to-clipboard';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { del, get, post } from '@/utils/request';
import DefaultAvatarSvg from './icon/DefaultAvatarSvg.svg';
import LikeOrUnlikeOrCopy from '@/views/chat-page/components/LikeOrUnlikeOrCopy';
import AnswerComp from '@/views/chat-page/components/AnswerComp';
import ViewerTimeout from '@/views/chat-page/components/ViewerTimeout';
import DialogPrompt from '@/views/chat-page/components/dialog/DialogPrompt';
import ChatSecondSvg from '@/views/chat-page/icon/ChatSecondSvg';
import SendSvg from '@/views/chat-page/icon/SendSvg';
import SoundInputSvg from '@/views/chat-page/icon/SoundInputSvg';
import EditSvg from '@/views/chat-page/icon/EditSvg';
import DeleteSvg from '@/views/chat-page/icon/DeleteSvg';
import CloseSvg from '@/views/chat-page/icon/CloseSvg';
import ReAddQuestionSvg from '@/views/chat-page/icon/ReAddQuestionSvg';
import mixinRegion from '@/utils/mixinRegion';
import CascaderSelect from '@/views/economy-index/digital-economy/components/CascaderSelect';

export default {
  name: 'ChatRight',
  mixins: [mixinRegion],
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  components: {
    ReAddQuestionSvg,
    CloseSvg,
    DeleteSvg,
    EditSvg,
    SoundInputSvg,
    SendSvg,
    ChatSecondSvg,
    ViewerTimeout,
    LikeOrUnlikeOrCopy,
    AnswerComp,
    DialogPrompt,
    CascaderSelect,
  },
  data() {
    return {
      // 已经出错了，前端回复用户问题的次数
      errorCount: 0,
      // 出错代码
      errorCode: null,
      // 对比区域
      defaultProps: {
        value: 'regionCode',
        label: 'regionName',
        level: 'regionLevel'
      },
      typeToTitle: {
        economy: '经济',
        industrial: '企业',
        policy: '政策',
      },
      // 提示加载中
      hintLoading: false,
      // 提示列表
      hintList: [],
      // 是否正在思考
      isThinking: false,
      // 对话列表
      chatList: [],
      DefaultAvatarSvg,
      // 是否输入框聚焦
      isInputFocus: false,
      // chat页面input value
      inputValue: '',
      // 历史记录
      historyList: [],
      // 历史记录加载中
      historyLoading: false,
      // 当前会话id
      converseId: null,
      // 是否是新建会话
      isNewConverse: true,
      // 历史记录编辑id
      historyEditIndex: null,
      // 历史记录删除id
      historyDeleteIndex: null,
      showDeleteModal: false,
      // 语音输入中
      recording: false,
      // 语音识别中
      recognizing: false,
      mediaRecorder: null,
      audioChunks: [],
      area_code: null,
      cancelToken: null,
    };
  },
  computed: {
    ...mapGetters(['iep_platform_TOKEN', 'iep_platform_USER_INFO', 'iep_platform_ROUTERS_INFO', 'iep_platform_MENU_ID']),
    // 是否登录
    isLogin() {
      return this.iep_platform_TOKEN?.token || false;
    },
    menuList() {
      return this.iep_platform_ROUTERS_INFO?.filter((item) => item.menuName !== '其他' && item.menuName !== '首页');
    },
  },
  watch: {
    isLogin(val) {
      if (val) {
        this.getHistory();
      }
    },
    chatList: {
      handler(val, oldVal) {
        this.isNewConverse = this.chatList.length === 0;
        if (this.chatList.length > 0 && !this.isThinking) {
          const last = this.chatList[this.chatList.length - 1];
          if (last.answer === null && last?.stopGenerate !== true) {
            this.isThinking = true;
            this.getAnswer(last.question);
          }
          // const valLength = val.length;
          // const oldValLength = oldVal.length ? oldVal.length : 0;
          // if (valLength > oldValLength) {
          //
          // }
          // 先渲染，再滚动
          this.$nextTick(() => {
            console.log('ChatRight scroll');
            const div = document.getElementById('layoutRef');
            div.scrollTo(0, div.scrollHeight);
          });
        }
      },
      deep: true,
    },
    inputValue(val) {
      console.log('inputValue', val);
    },
  },
  created() {
    this.chatList = [];
    this.converseId = null;
    this.isNewConverse = true;
    console.log('ChatRight created');
    // 待完成，判断用户是否登录
    if (this.isLogin) {
      this.getHistory();
    }
    this.getHintList();
  },
  mounted() {
    console.log('ChatRight mounted');
  },
  beforeDestroy() {
    console.log('ChatRight beforeDestroy');
    this.userInfo = null;
    this.init();
  },
  destroyed() {
    console.log('ChatRight destroyed');
  },
  methods: {
    // 初始化变量
    async init() {
      this.errorCount = 0;
      this.errorCode = null;
      this.hintLoading = false;
      // this.hintList = [];
      this.isThinking = false;
      this.chatList = [];
      this.isInputFocus = false;
      this.inputValue = '';
      // this.historyList = [];
      this.historyLoading = false;
      this.converseId = null;
      this.isNewConverse = true;
      this.historyEditIndex = null;
      this.historyDeleteIndex = null;
      this.showDeleteModal = false;
      this.recording = false;
      this.recognizing = false;
      this.mediaRecorder = null;
      this.audioChunks = [];
      this.area_code = null;
      // 如果有取消请求的token，取消请求
      if (this.cancelToken) {
        this.cancelToken.cancel();
      }
      this.cancelToken = null;
      // 强制渲染
      await this.$forceUpdate();
    },
    // 对比区域组件的方法
    confirmRegion(list) {
      this.area_code = list[0]?.regionCode ? Number(list[0].regionCode) : null;
    },
    changeInputValue(value) {
      this.inputValue = value;
      console.log('changeInputValue', value);
    },
    // 获取提示列表
    async getHintList() {
      this.hintLoading = true;
      const params = {
        type: this.type,
      };
      const { data } = await get('/chat/template/config', params);
      this.hintList = data?.question_list || [];
      this.hintLoading = false;
    },
    // 点击提示
    clickHint(item) {
      this.addQuestion(item);
    },
    // 获取历史记录
    async getHistory(showLoading = true) {
      // 判断是否登录
      if (!this.isLogin) {
        return;
      }
      const params = {
        page_num: 1,
        page_size: 10000,
      };
      if (showLoading) {
        this.historyLoading = true;
      }
      const { data } = await get(`/chat/converse/${this.type}`, params);
      console.log('getHistory', data);
      this.historyList = data?.list || [];
      this.historyLoading = false;
    },
    // 获取答案接口
    async getAnswer(question) {
      // chatList可能不是最新的，所以要重新获取
      const newChatList = [...this.chatList];
      let params = {
        type: this.type,
        prompt: question,
        converse_id: this.converseId,
      };
      if (this.type === 'policy') {
        params = {
          ...params,
          area_code: this.area_code,
        };
      }
      let data = null;
      try {
        // 如果errorCode存在，就不再请求接口，前端自己生成
        if (this.errorCode) {
          if (this.errorCode === 100) {
            // 这是备注
          } else if (this.errorCode === 101) {
            // 这是备注
          }
        } else if (this.chatList.length > 10) { // 如果chatList的长度>10,则不再请求接口，前端自己生成
          this.errorCode = 101;
        } else {
          // 创建取消令牌
          this.cancelToken = axios.CancelToken.source();
          const res = await post('/chat/chat', params, {
            cancelToken: this.cancelToken.token,
          });
          data = res.data;
        }
      } catch (errorRes) {
        console.error('chat errorRes: ', errorRes);
        // 如果是主动取消请求，就不要再更新了
        if (axios.isCancel(errorRes)) {
          console.log('请求被取消: ', errorRes.message);
          return;
        }
        // 其他错误处理
        const response = errorRes?.response?.data?.data?.response;
        const errorCode = errorRes?.response?.data?.code;
        if (errorCode === 100 || errorCode === 101) {
          this.errorCode = errorCode;
        }
        data = {
          response: response || '后端异常，请稍后再试',
        };
      }
      // 如果这个问题已经停止生成，就不要再更新了
      // if (newChatList[newChatList.length - 1]?.stopGenerate) {
      //   return;
      // }
      // 如果isNewConverse.current，说明是新建会话，忽略回答
      // if (this.isNewConverse) {
      //   console.log('新建会话，忽略回答');
      //   return;
      // }
      // if (this.errorCode) {
      //   // 备注信息
      // } else {
      //   // 如果converseId存在，而且converseId不等于data.converse_id，说明点击了历史记录，忽略回答
      //   // eslint-disable-next-line no-lonely-if
      //   // if (this.converseId && this.converseId !== data?.converse_id && data?.response !== '后端异常，请稍后再试' && data?.response !== '对不起，单次会话只支持10个提问，请点击“新建会话”再向我提问~') {
      //   //   console.log('点击了历史记录，忽略回答');
      //   //   return;
      //   // }
      // }
      console.log('data', data);
      newChatList[newChatList.length - 1].answer = data?.response;
      newChatList[newChatList.length - 1].id = data?.question_id;
      newChatList[newChatList.length - 1].relation_zc = data?.relation_zc;
      newChatList[newChatList.length - 1].justShow = false;
      // 添加异常errorCode
      if (this.errorCode) {
        newChatList[newChatList.length - 1].errorCode = this.errorCode;
        this.errorCount += 1;
      }
      // 如果是第一次对话，记录会话id，更新历史记录
      if (this.converseId === null) {
        this.converseId = data?.converse_id;
        // this.isNewConverse = false;
        this.getHistory(false);
      }
      this.chatList = newChatList;
    },
    // onKeyDown
    onKeyDown(e) {
      if (e.keyCode === 13) {
        e.stopPropagation();
        e.preventDefault();
        const { value } = e.target;
        // 没有登录
        if (!this.isLogin) {
          this.$message({
            message: '请先登录',
            type: 'warning',
          });
        } else if (value && !this.isThinking) {
          this.addQuestion(value);
          e.target.value = '';
          this.handleInput();
          this.inputValue = '';
        }
      }
    },
    // 添加问题
    addQuestion(question) {
      // 没有登录
      if (!this.isLogin) {
        this.$message({
          message: '请先登录',
          type: 'warning',
        });
      } else if (!this.isThinking && question !== undefined && question !== null && question !== '') {
        this.chatList.push({
          id: null,
          question,
          answer: null,
          like: 0,
        });
      }
    },
    clickStopThinking() {
      // 如果存在取消令牌，就取消请求
      if (this.cancelToken) {
        this.cancelToken.cancel('取消请求');
      }
      this.isThinking = false;
      // 更新chatList,将最后一个问题的stopGenerate设置为true
      const newChatList = [...this.chatList];
      newChatList[newChatList.length - 1].stopGenerate = true;
      this.chatList = JSON.parse(JSON.stringify(newChatList));
    },
    // 重新提问
    clickReAddQuestion() {
      // 将chatList的最后一个问题作为新问题重新问
      const last = this.chatList[this.chatList.length - 1];
      const { question } = last;
      this.chatList.push({
        id: null,
        question,
        answer: null,
        like: 0,
      });
    },
    clickAddQuestion(e) {
      console.log('into clickAddQuestion');
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      const { value } = this.$refs.inputRef;
      // 没有登录
      if (!this.isLogin) {
        this.$message({
          message: '请先登录',
          type: 'warning',
        });
      } else if (value && !this.isThinking) {
        this.addQuestion(value);
        this.$refs.inputRef.value = '';
        this.handleInput();
        this.inputValue = '';
      }
    },
    setInputFocus() {
      this.$refs.inputRef.focus();
      this.isInputFocus = true;
    },
    async handleStartRecording(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!this.isLogin) {
        this.$message({
          message: '请先登录',
          type: 'warning',
        });
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('浏览器不支持录音功能');
        this.$message({
          message: '浏览器不支持录音功能',
          type: 'warning',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        // eslint-disable-next-line no-shadow
        this.mediaRecorder.ondataavailable = (e) => {
          console.log('ondataavailable:', e.data);
          if (e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
        this.mediaRecorder.onstop = async () => {
          const file = new File(
            this.audioChunks,
            `my-file.${this.mediaRecorder.mimeType.match(/\/([\w\d]+);?/)[1]}`,
            { type: this.mediaRecorder.mimeType }
          );
          const params = {
            file
          };
          this.recording = false;
          this.recognizing = true;
          const { data } = await post('/chat/speech/recognition', params, { headers: { 'Content-Type': 'multipart/form-data' } });
          this.recognizing = false;
          // 最长只能输入150个字符
          // eslint-disable-next-line no-unsafe-optional-chaining
          this.$refs.inputRef.value = (`${this.$refs.inputRef.value + data?.text}`).slice(0, 150);
          this.inputValue = this.$refs.inputRef.value;
          this.handleInput();
          this.$refs.inputRef.focus();
          this.isInputFocus = true;
          this.audioChunks = [];
        };
        this.mediaRecorder.start();
        this.recording = true;
      } catch (error) {
        console.error('获取麦克风权限失败:', error);
        this.$message({
          message: '获取麦克风权限失败',
          type: 'error',
        });
      }
    },
    handleStopRecording(_e = null) {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
    },
    // 处理输入框高度
    handleInput() {
      const textarea = this.$refs.inputRef;
      textarea.style.height = 'auto'; // 先重置高度
      textarea.style.height = `${textarea.scrollHeight <= 300 ? textarea.scrollHeight : 300}px`; // 设置高度为内容的实际高度
    },
    async clickNewChat() {
      await this.init();
    },
    // 点击了历史记录
    async clickHistory(index) {
      console.log('into clickHistory');
      await this.init();
      // 获取历史记录详情
      const { data } = await get(`/chat/converse/${this.historyList[index].id}`);
      data.question_list = data?.question_list.map((item) => ({
        ...item,
        justShow: true,
      }));
      this.chatList = JSON.parse(JSON.stringify(data?.question_list));
      this.converseId = this.historyList[index].id;
      const statusToErrorCodeMap = {
        1: null,
        2: 100,
        3: 101,
      };
      this.errorCode = statusToErrorCodeMap[data?.status] ? statusToErrorCodeMap[data?.status] : null;
    },
    // 问题点击
    async clickLikeOrUnlikeOrCopyQuestion(item, name, _index) {
      if (name === '复制') {
        copy(item.question);
        this.$message({
          message: '复制成功',
          type: 'success',
        });
      }
    },
    // 点击了点赞或者踩或者复制,其中name为点赞，踩，复制，或null代表取消点赞或者踩
    async clickLikeOrUnlikeOrCopyAnswer({ item, name, index }) {
      console.log('into clickLikeOrUnlikeOrCopyAnswer');
      console.log('item:', item);
      console.log('name:', name);
      console.log('index:', index);
      if (name === '复制') {
        copy(item.answer);
        this.$message({
          type: 'success',
          message: '复制成功',
        });
      } else {
        const params = {
          question_id: item.id,
          // eslint-disable-next-line no-nested-ternary
          like: name === '点赞' ? 1 : (name === '踩' ? -1 : 0),
        };
        await post('/chat/question/like', params);
        // 更新chatList
        const newChatList = [...this.chatList];
        // eslint-disable-next-line no-nested-ternary
        newChatList[index].like = name === '点赞' ? 1 : (name === '踩' ? -1 : 0);
        this.chatList = newChatList;
      }
    },
    // 点击了历史记录的编辑
    clickHistoryEdit(e, index) {
      e.stopPropagation();
      e.preventDefault();
      this.historyEditIndex = index;
      console.log('index: ', index);
      console.log('this.historyList[index]: ', this.historyList[index]);
      // 等待dom更新完成后，再聚焦
      this.$nextTick(() => {
        // 设置输入框的值
        this.$refs.historyEditInputRef[0].value = this.historyList[this.historyEditIndex].title;
        this.$refs.historyEditInputRef[0].focus();
      });
    },
    // 历史记录编辑保存
    historyEditOnKeyDown(e) {
      if (e.keyCode === 13) {
        this.historyEditOnOk(e);
      }
    },
    async historyEditOnOk(e) {
      e.stopPropagation();
      e.preventDefault();
      const params = {
        id: this.historyList[this.historyEditIndex].id,
        title: this.$refs.historyEditInputRef[0].value,
      };
      await post('/chat/converse', params);
      // 直接更新历史记录
      const newHistoryList = [...this.historyList];
      newHistoryList[this.historyEditIndex].title = this.$refs.historyEditInputRef[0].value;
      this.historyList = newHistoryList;
      this.historyEditIndex = -1;
    },
    historyEditOnCancel(e) {
      e.stopPropagation();
      e.preventDefault();
      this.historyEditIndex = -1;
    },
    // 点击了历史记录删除
    clickHistoryDelete(e, index) {
      e.stopPropagation();
      e.preventDefault();
      this.historyDeleteIndex = index;
      this.showDeleteModal = true;
    },
    async deleteModalOnOk() {
      // 当前对话不可删除
      if (this.historyList[this.historyDeleteIndex].id === this.converseId) {
        this.$message({
          type: 'error',
          message: '不可删除正在进行的当前对话',
        });
        return;
      }
      const params = {
        id: this.historyList[this.historyDeleteIndex].id,
      };
      this.showDeleteModal = false;
      this.historyDeleteIndex = -1;
      await del(`/chat/converse/${params.id}`, null);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      this.getHistory();
    },
    deleteModalOnCancel() {
      console.log('into deleteModalOnCancel');
      this.showDeleteModal = false;
      this.historyDeleteIndex = -1;
    },
    // 点击了关联知识点
    clickRelationZc(id) {
      // 跳转到search detail页面
      // window.open(location.origin + `/search/detail/${id}?source=chat`)
    },
    answerOnOk() {
      this.isThinking = false;
    },
  },
};
</script>

<style lang="less" scoped>
.chat-right {
  input {
    color: #646464!important;
    outline: none;
    font-size: 16px;
  }

  input:focus {
    outline: none;
  }

  textarea {
    resize: none;
    overflow-y: auto;
    overflow-x: hidden;
    height: 22px;
    line-height: 22px;
    color: #646464;
    outline: none;
    font-size: 14px;
    word-break: break-all;
    border: none;
    padding: 0;
  }
  textarea:focus {
    outline: none;
  }
  button {
    //border: none;
    //background: none;
    outline: none;
  }
}
</style>
