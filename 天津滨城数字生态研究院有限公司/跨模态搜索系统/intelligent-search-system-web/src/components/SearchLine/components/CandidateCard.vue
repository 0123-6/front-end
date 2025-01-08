<template>
  <!--最外层-->
  <div style="opacity: 0.97;background-image: linear-gradient(180deg, #F4FBFF 6%, #FDFDFD 100%);"
       class="flex flex-col items-center rounded-lg border-[3px] border-white shadow-card-light pt-4">
    <!--候选项-->
    <div class="w-full pl-5 pr-4 flex items-center hover:cursor-pointer"
         :class="[index === selectedIndex && selectedShow ? 'bg-white-candidate-hover' : '']"
         v-for="(item,index) in data"
         :key="index"
         style="height: 35px;"
         @mouseenter="setSelectedIndex(index)"
         @mouseleave="setSelectedShow(false)">
      <!--文字width: 704px-->
      <div v-if="!(index === selectedIndex && selectedShow)"
           class="h-full flex items-center"
           @click.stop="changeKeyword(index)"
           @mouseup="changeKeyword(index)"
           style="width: calc(100% - 29px);">
        <div v-if="!(index === selectedIndex && selectedShow)"
              class="text-base text-hidden text-black-dark w-full"
              :title="item.length >= 45 ? item : null">{{item}}</div>
      </div>
      <div v-if="index === selectedIndex && selectedShow"
           @click.stop="changeKeyword(index)"
           @mouseup="changeKeyword(index)"
           class="h-full flex items-center"
           style="width: calc(100% - 29px);">
        <span v-if="index === selectedIndex && selectedShow"
              class="bgc-blue text-base text-hidden text-blue font-semibold w-full"
              :title="item.length >= 45 ? item : null">{{item}}</span>
      </div>
      <!--删除-->
      <span v-show="selectedIndex === index && selectedShow"
            class="ml-4 text-black-svg hover:text-blue hover:cursor-pointer"
            @click.stop="deleteHistory(index)" @mouseup.stop>
        <delete-svg width="13" height="13"></delete-svg>
      </span>
    </div>
    <!--清除所有-->
    <div class="flex justify-end items-center pr-4 w-full mt-4 mb-2">
      <span class="text-xs text-black-svg hover:text-blue hover:cursor-pointer"
            @click.stop="deleteAllHistory"
            @mouseup.stop>清除所有</span>
    </div>
  </div>
</template>

<script>
import DeleteSvg from '@/components/SvgIcon/DeleteSvg';

export default {
  name: 'CandidateCard',
  components: {
    DeleteSvg
  },
  props: {
    // 候选项列表
    data: {
      type: Array,
      required: true
    },
    // 选中的候选项-1
    selectedIndex: {
      type: Number,
      required: true
    },
    // 真正的关键字
    lastUserKeyword: {
      type: String,
      required: true
    }
  },
  watch: {
    // 当联想区选中项发生变化且不是-1时
    selectedIndex() {
      if (this.selectedIndex !== -1) {
        this.selectedShow = true;
      }
    }
  },
  data() {
    return {
      // 选中的候选项是否激活
      selectedShow: true
    };
  },
  methods: {
    // 删除一项历史记录
    deleteHistory(index) {
      this.$emit('deleteHistory', index);
    },
    // 设置选中项
    setSelectedIndex(index) {
      this.$emit('setSelectedIndex', index);
      this.setSelectedShow(true);
    },
    // 设置选中项是否激活
    setSelectedShow(status) {
      this.selectedShow = status;
    },
    // 删除所有历史记录
    deleteAllHistory() {
      console.log('deleteAllHistory');
      this.$emit('deleteAllHistory');
    },
    // 联想框点击事件
    changeKeyword(index) {
      console.log('changeKeyword');
      this.$emit('changeKeyword', index);
    }
  }
};
</script>
