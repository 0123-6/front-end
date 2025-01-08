<template>
  <!--最外层-->
  <div class="flex w-full min-h-full">
    <!--初始-->
    <div v-if="mode==='init'"
         class="w-full min-h-full h-full bg bg-cover flex flex-col items-center">
      <!--title-->
      <div class="flex text-black-dark font-semibold"
           style="margin-top: 194px;margin-bottom: 53px;font-size: 32px;">
        城市监控视频跨模态搜索系统
      </div>
      <!--search-->
      <div class="flex items-center" style="height: 70px;">
        <!--左-->
        <search-line :focus="false" @changeKeyword="changeKeyword" @search="keywordChange"></search-line>
        <!--右-->
        <search-big-button class="ml-6"
                           @goAdvancedSearch="goAdvancedSearch"></search-big-button>
      </div>
    </div>
    <!--已搜索-->
    <div v-else
         class="w-full min-h-full flex flex-col items-center bg-white-bg-type2">
      <!--上-->
      <div class="w-full flex justify-center items-center bg2 bg-cover"
           style="height: 111px;min-height: 111px;">
        <!--搜索部分-->
        <div style="height: 56px;" class="flex items-center">
          <!--左-->
          <search-line :default-keyword="keyword"
                       :focus="false"
                       @changeKeyword="changeKeyword"
                       @search="keywordChange"
                       width="996px" height="56px"></search-line>
          <!--右-->
          <search-big-button class="ml-9" width="167px" height="56px"
                             @goAdvancedSearch="goAdvancedSearch"></search-big-button>
        </div>
      </div>
      <!--下-->
      <div class="flex flex-col"
           v-if="mode==='searching' || data.list.length > 0"
           v-loading="mode==='searching'"
           style="width: 1200px;min-height: calc(100% - 111px);">
        <!--searched && haveData-->
        <div v-if="data.list.length > 0"
             class="w-full flex flex-col">
          <!--结果数量-->
          <span class="flex text-black font-semibold text-sm"
                style="margin-top: 22px;">
          共查询到<span class="text-blue">{{data.total}}</span>条结果
        </span>
          <!--内容区-->
          <div class="mt-4 w-full grid grid-cols-4 gap-4">
            <div class="w-full"
                 v-for="(item,index) in (isFrontEndPaginate ? data.list.slice((pageNum-1)*pageSize, pageNum*pageSize) : data.list)"
                 :key="index"
                 @click="showVideoDetail(index)">
              <video-card :img="item.cover"
                          :name="item.monitoringPointLocation"
                          :date="item.monitoringTime"
              ></video-card>
            </div>
          </div>
          <!--分页-->
          <el-pagination
            v-if="data.total > pageSize || pageSize !== 12"
            class="self-center mt-9 pb-4"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :total="data.total">
          </el-pagination>
        </div>
      </div>
      <!--searched && noData-->
      <div v-if="mode==='searched' && data.list.length===0"
           class="w-full flex flex-col items-center"
           style="margin-top: 184px;">
        <img src="@/assets/no-search-data.svg" alt="" style="width: 190px;height: 190px;">
        <span class="mt-4 text-base text-black-light">暂无数据</span>
      </div>
    </div>
    <!--详情信息弹框-->
    <video-detail v-if="showDetailDialog"
                  @cancel="detailDialogCancel"
                  :monitor-point-id="data.list[selectedVideoIndex].monitorPointId"
                  :monitoring-time="data.list[selectedVideoIndex].monitoringTime"
                  :poster="data.list[selectedVideoIndex].cover"
    >
    </video-detail>
  </div>
</template>
<script>
import SearchBigButton from '@/views/home-page/components/SearchBigButton';
import { search } from '@/api/search';
import SearchLine from '@/components/SearchLine';
import VideoCard from '@/views/home-page/components/VideoCard';
import VideoDetail from '@/views/home-page/components/VideoDetail';

export default {
  name: 'HomePage',
  components: {
    VideoDetail,
    VideoCard,
    SearchLine,
    SearchBigButton
  },
  data() {
    return {
      // 模式，init初始状态,searching搜索中,searched已搜索
      mode: 'init',
      // 关键字
      keyword: '',
      // 搜索类型
      searchType: 'simple',
      // 当前页码
      pageNum: 1,
      // 每页个数
      pageSize: 12,
      // 查询到的结果
      data: {
        // 总条数
        total: 0,
        // 具体数据
        list: []
      },
      // 展示详情弹框
      showDetailDialog: false,
      // 详情弹框对应的视频index
      selectedVideoIndex: -1,
      // 前端分页
      isFrontEndPaginate: true
      // init函数，之前的参数已处理
    };
  },
  methods: {
    // 初始化函数
    init() {
      this.mode = 'init';
      this.keyword = '';
      this.pageNum = 1;
      this.pageSize = 12;
      this.data.total = 0;
      this.data.list = [];
      this.showDetailDialog = false;
      this.selectedVideoIndex = -1;
      this.isFrontEndPaginate = true;
    },
    // input框关键字改变
    keywordChange(paramsObject) {
      console.log('into keywordChange: ', paramsObject);
      if (paramsObject.keyword === '') {
        this.init();
      } else {
        this.keyword = paramsObject.keyword;
        console.log('keyword changed,keyword = ', this.keyword);
        this.pageNum = 1;
        this.search();
      }
    },
    // 搜索函数
    search() {
      this.mode = 'searching';
      // 如果是前端分页
      if (this.isFrontEndPaginate) {
        const params = {
          keyword: this.keyword,
          searchType: this.searchType,
          pageNum: 1,
          pageSize: 999999
        };
        search(params).then((res) => {
          console.log(res);
          const { data } = res;
          this.data.total = data.total;
          this.data.list = data.records;
        }).finally(() => {
          this.mode = 'searched';
        });
      } else { // 后端分页
        const params = {
          keyword: this.keyword,
          searchType: this.searchType,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        search(params).then((res) => {
          console.log(res);
          const { data } = res;
          this.data.total = data.total;
          this.data.list = data.records;
          this.mode = 'searched';
        });
      }
    },
    // 分页，size变化时触发
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.pageNum = 1;
      // 前端分页
      if (this.isFrontEndPaginate) {
        /* empty */
      } else { // 后端分页
        this.search();
      }
    },
    // 分页，pageNum变化时触发
    handleCurrentChange(newPageNum) {
      this.pageNum = newPageNum;
      // 前端分页
      if (this.isFrontEndPaginate) {
        /* empty */
      } else { // 后端分页
        this.search();
      }
    },
    // 详情信息展示弹框
    showVideoDetail(index) {
      this.selectedVideoIndex = index;
      this.showDetailDialog = true;
    },
    // 详情信息弹框关闭事件
    detailDialogCancel() {
      this.showDetailDialog = false;
      this.selectedVideoIndex = -1;
    },
    changeKeyword(keyword) {
      this.keyword = keyword;
    },
    // 跳转到高级搜索
    goAdvancedSearch() {
      const { keyword } = this;
      this.$store.commit('Common/setSearchKeyword', keyword);
      this.$router.replace({
        name: 'AdvancedSearch'
      });
    }
  }
};
</script>
<style scoped>
.bg {
  background-image: url('../../assets/bg.jpg');
}
.bg2 {
  background-image: url('../../assets/search-bg.png');
}
</style>
