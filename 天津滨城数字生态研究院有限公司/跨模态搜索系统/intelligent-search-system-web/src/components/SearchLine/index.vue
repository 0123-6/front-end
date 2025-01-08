<template>
  <!--最外层-->
  <div class="flex items-center rounded-lg bg-white-button shadow-button-lg hover:shadow-search-line relative"
       :class="[isInputFocus?'shadow-search-line':'']"
       :style="{width:width,height:height}"
       style="z-index: 200;"
       @click.stop="setInputFocus(true)"
       @mousedown.stop="mouseDown">
    <!--左侧-->
    <div class="flex items-center" :style="{width: height==='70px'?'calc(100% - 158px)':'calc(100% - 142px)'}">
      <!--搜素图标-->
      <img class="ml-4 cursor-pointer" title="搜索" src="@/assets/icons/search.svg" alt="" width="19" height="19">
      <!--文字和input 564px-->
      <div class="ml-4 relative" style="width: calc(100% - 51px);">
        <input v-model="keyword"
               id="input"
               type="text"
               autocomplete="off"
               placeholder="请输入关键词，如“十字路口积雪路面白色轿车”"
               class="appearance-none outline-none w-full bg-white-button"
               :class="[keyword===''?'text-base text-black-light':'text-lg font-semibold text-black-dark']"
               @input.stop="change"
               @keydown.stop="keydown"
               @focus.stop="inputGetFocus"
               @blur.stop="inputBlurFocus">
      </div>
    </div>
    <!--右侧-->
    <div v-if="keyword !== ''" class="flex items-center" :style="{width: height==='70px'?'158px':'142px'}">
      <!--叉号-->
      <span class="fill-current cursor-pointer text-black-svg hover:text-black-svg-hover"
            title="清空"
            @click="clearKeyword"
            @mousedown.stop>
          <close-svg width="18" height="18"></close-svg>
        </span>
      <div class="flex ml-5 mr-6 bg-white-border" style="width: 1px;height: 40px;"></div>
      <!--搜索按钮-->
      <span @mousedown.stop>
        <search-button @search="search"
                       :size="height==='70px'?'medium':'small'"></search-button>
      </span>
    </div>
    <!--历史记录悬浮框-->
    <candidate-card v-if="candidateShow"
                    ref="candidate"
                    class="absolute left-0"
                    :style="{top:height==='70px'?'89px': height==='56px' ? '75px' : '69px'}"
                    style="width: 100%;z-index: 999;"
                    :lastUserKeyword="lastUserKeyword"
                    :data="candidateData"
                    :selected-index="candidateSelectedIndex"
                    @deleteHistory="deleteHistory"
                    @deleteAllHistory="deleteAllHistory"
                    @setSelectedIndex="setSelectedIndex"
                    @changeKeyword="changeKeyword"></candidate-card>
  </div>
</template>

<script>
import _ from 'lodash';
import SearchButton from '@/components/SearchLine/components/SearchButton';
import CloseSvg from '@/components/SvgIcon/CloseSvg';
import CandidateCard from '@/components/SearchLine/components/CandidateCard';
import {
  deleteAllHistory, deleteHistory, getHistory, search
} from '@/api/search';

export default {
  name: 'SearchLine',
  props: {
    width: {
      type: String,
      required: false,
      default: '777px'
    },
    height: {
      type: String,
      required: false,
      default: '70px'
    },
    focus: {
      type: Boolean,
      required: false,
      default: false
    },
    // 默认关键字
    defaultKeyword: {
      type: String,
      required: false,
      default: ''
    }
  },
  components: {
    CandidateCard,
    CloseSvg,
    SearchButton
  },
  data() {
    return {
      // 搜索关键字
      keyword: '',
      // 搜素框长度限制
      keywordMaxLength: 38,
      // 最后一次用户输入的值
      lastUserKeyword: '',
      // 输入框是否获得焦点
      isInputFocus: false,
      // 联系组件相关,联系数组列表
      candidateData: [],
      // 选中的项
      candidateSelectedIndex: -1,
      // 联想组件是否正在搜索
      candidateGetting: false,
      // 展示联想框
      show: false
    };
  },
  computed: {
    // 联想区域的展示
    candidateShow() {
      return this.candidateData.length > 0 && (this.isInputFocus || this.show);
    }
  },
  created() {
    this.keyword = this.defaultKeyword;
    // 鼠标释放时触发的事件
    document.addEventListener('mouseup', this.mouseUpEvent, false);
  },
  beforeDestroy() {
    // 取消事件监听
    document.removeEventListener('mouseup', this.mouseUpEvent, false);
  },
  mounted() {
    if (this.focus) {
      this.setInputFocus(true);
    }
    // 加载时，首先获取历史记录
    // this.getHistory();
  },
  watch: {
    // 真正的关键词改变时
    lastUserKeyword() {
      console.warn('监听到lastUserKeyword改变事件');
      this.keyword = this.lastUserKeyword;
      this.getHistory();
    },
    // keyword改变
    keyword(newValue, oldValue) {
      console.log('into keyword');
      console.log('newValue: ', newValue);
      console.log('oldValue: ', oldValue);
      this.$emit('changeKeyword', this.keyword);
    }
  },
  methods: {
    // 事件监听
    mouseUpEvent(d) {
      console.log('candidateShow:', this.candidateShow);
      console.log('mouseup');
      this.show = false;
      console.log('candidateShow:', this.candidateShow);
      this.lastUserKeyword = this.keyword;
      this.candidateSelectedIndex = -1;
    },
    // 搜索事件
    search: _.debounce(function () {
      // 前置处理
      this.lastUserKeyword = this.keyword;
      const params = {
        keyword: this.keyword,
        keyworld: this.keyword
      };
      this.$emit('search', params);
    }, 100),
    // 用户输入改变事件
    change() {
      console.log('into change');
      console.log('this.keyword: ', this.keyword);
      console.log('this.lastUserKeyword: ', this.lastUserKeyword);
      if (this.keyword.length > this.keywordMaxLength) {
        this.$message({
          type: 'warning',
          message: `搜索框最多${this.keywordMaxLength}个字符`
        });
        this.keyword = this.keyword.substring(0, this.keywordMaxLength);
        return;
      }
      this.lastUserKeyword = this.keyword;
      console.log('this.keyword: ', this.keyword);
      console.log('this.lastUserKeyword: ', this.lastUserKeyword);
    },
    // 清空用户输入,也就是清空keyword,lastKeyword,candidateData,candidateSelectedIndex
    clearKeyword() {
      this.keyword = '';
      this.lastUserKeyword = '';
      this.candidateData = [];
      this.candidateSelectedIndex = -1;
    },
    // #input框获取焦点,true获取焦点,false释放焦点
    setInputFocus(status) {
      if (status) {
        document.getElementById('input').focus();
      } else {
        document.getElementById('input').blur();
      }
    },
    // 键盘按下事件
    keydown(e) {
      const evt = window.event || e;
      // 回车
      if (evt.keyCode === 13) {
        this.setInputFocus(false);
        this.search();
      }
      if (evt.keyCode === 38) { // ↑
        console.log('↑');
        if (this.candidateData.length > 0) {
          evt.preventDefault();
        }
        this.decSelectedIndex();
        this.setKeyword();
      } else if (evt.keyCode === 40) { // ↓
        console.log('↓');
        this.addSelectedIndex();
        this.setKeyword();
      }
    },
    // input框获取焦点触发的事件,默认情况不触发搜索联想,可以设置为触发.
    inputGetFocus() {
      console.log('into inputGetFocus');
      this.isInputFocus = true;
      this.getHistory();
    },
    // input框失去焦点触发的事件
    inputBlurFocus() {
      console.log('into inputBlurFocus');
      this.isInputFocus = false;
    },
    // 设置keyword的值
    setKeyword() {
      if (this.candidateSelectedIndex !== -1) {
        this.keyword = this.candidateData[this.candidateSelectedIndex];
      } else {
        this.keyword = this.lastUserKeyword;
      }
    },
    // 根据关键字获取历史记录
    getHistory: _.debounce(function () {
      console.log('into getHistory');
      this.candidateSelectedIndex = -1;
      const params = {
        keyword: this.keyword
      };
      this.candidateGetting = true;
      getHistory(params).then((res) => {
        const { data } = res;
        this.candidateData = data.map((item) => item.value);
        this.candidateGetting = false;
      });
    }, 200),
    // 删除一项历史记录
    deleteHistory(index) {
      const params = {
        value: this.candidateData[index]
      };
      deleteHistory(params).then((res) => {
      });
      this.candidateData.splice(index, 1);
    },
    // 删除所有历史记录
    deleteAllHistory() {
      deleteAllHistory().then((res) => {
      });
      this.candidateData = [];
      this.candidateSelectedIndex = -1;
    },
    // 加大selectedIndex的值
    addSelectedIndex() {
      if (this.candidateSelectedIndex !== this.candidateData.length - 1) {
        this.candidateSelectedIndex += 1;
      } else {
        this.candidateSelectedIndex = -1;
      }
    },
    // 减小selectedIndex的值
    decSelectedIndex() {
      if (this.candidateSelectedIndex !== -1) {
        this.candidateSelectedIndex -= 1;
      } else {
        this.candidateSelectedIndex = this.candidateData.length - 1;
      }
    },
    // 设置选中项
    setSelectedIndex(index) {
      this.candidateSelectedIndex = index;
    },
    // 改变用户关键字
    changeKeyword(index) {
      console.log('into changeKeyword ');
      this.lastUserKeyword = this.candidateData[this.candidateSelectedIndex];
      this.search();
    },
    // 组件区域，鼠标按下事件
    mouseDown() {
      console.log('组件mouseDown');
      this.show = true;
    }
  }
};
</script>
