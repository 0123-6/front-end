<template>
  <!--最外层-->
  <div class="flex bg-white-bg justify-center w-full min-h-full pt-6"
       style="min-width: 1400px;padding-bottom: 38px;">
    <!--白色区域-->
    <div class="flex rounded outline-2 outline outline-white shadow bg-white-opacity"
         style="width: auto;min-height: 100%;min-height: calc(100vh - 60px - 38px - 24px);">
      <!--左，高级搜索-->
      <div class="overflow-auto h-full max-h-full max-h-fit"
           style="width: 302px;">
        <search-filter @conditionChange="conditionChange"></search-filter>
      </div>
      <!--左右分割线-->
      <div class="flex h-full bg-white-divide" style="width: 1px;"></div>
      <!--右，内容展示-->
      <div class="flex flex-col pl-6 pr-4 min-h-full"
           style="width: 1097px;">
        <!--搜索-->
        <div class="flex mt-6 w-full" style="height: 50px;">
          <!--左-->
          <search-line :focus="false"
                       :default-keyword="keyword"
                       @search="keywordChange"
                       height="50px"></search-line>
          <!--右,暂无-->
        </div>
        <!--分割线-->
        <div class="flex w-full mt-4 bg-white-divide" style="height: 1px;"></div>
        <!--展示内容区域,min-height待修改-->
        <div class="w-full flex flex-col"
             style="min-height: 600px;">
          <!--init-->
          <div v-if="mode === 'init'"
               class="w-full h-full min-h-full flex flex-col items-center"
               style="margin-top: 184px;">
            <img src="@/assets/no-data.svg" alt="" style="width: 190px;height: 190px;">
            <span class="mt-4 text-base text-black-light">暂无数据</span>
          </div>
          <!--searching && searched-->
          <div v-if="mode==='searching' || data.list.length > 0"
               v-loading="mode === 'searching'"
               class="w-full min-h-full">
            <!--searched && haveData-->
            <div v-if="data.list.length > 0"
                 class="w-full flex flex-col">
              <!--结果数量-->
              <span class="flex text-black font-semibold text-sm mt-3">
                共查询到<span class="text-blue">{{data.total}}</span>条结果
              </span>
              <!--卡片区域-->
              <div style="margin-top: 10px;"
                   class="w-full grid grid-cols-3 gap-4">
                <div class="w-full"
                     v-for="(item,index) in (isFrontEndPaginate ? data.list.slice((pageNum-1)*pageSize, pageNum*pageSize) : data.list)"
                     :key="index"
                     @click="showVideoDetail(index)">
                  <video-card-2 :img="item.cover"
                                :name="item.monitoringPointLocation"
                                :date="item.monitoringTime"
                  ></video-card-2>
                </div>
              </div>
              <!--分页-->
              <el-pagination
                v-if="data.total > pageSize || pageSize !== 9"
                class="self-center mt-7 pb-4"
                background
                layout="total, prev, pager, next, sizes, jumper"
                :page-size="pageSize"
                :page-sizes="[9, 18, 27, 36]"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :total="data.total">
              </el-pagination>
            </div>
          </div>
          <!--searched && noData-->
          <div v-if="mode==='searched' && data.list.length === 0"
               class="w-full min-h-full flex flex-col items-center"
               style="margin-top: 184px;">
            <img src="@/assets/no-search-data.svg" alt="" style="width: 190px;height: 190px;">
            <span class="mt-4 text-base text-black-light">暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    <!--详情信息弹框-->
    <video-detail v-if="showDetailDialog"
                  @cancel="detailDialogCancel"
                  :monitor-point-id="data.list[selectedVideoIndex].monitorPointId"
                  :monitoring-time="data.list[selectedVideoIndex].monitoringTime"
                  :poster="data.list[selectedVideoIndex].cover">
    </video-detail>
  </div>
</template>
<script>
import SearchFilter from '@/views/advanced-search/components/SearchFilter';
import SearchLine from '@/components/SearchLine';
import { search } from '@/api/search';
import VideoCard2 from '@/views/advanced-search/components/VideoCard2';
import VideoDetail from '@/views/home-page/components/VideoDetail';

export default {
  name: 'AdvancedSearch',
  components: {
    SearchFilter,
    SearchLine,
    VideoCard2,
    VideoDetail
  },
  created() {
    this.getKeyword();
  },
  mounted() {
    if (this.keyword !== '') {
      setTimeout(() => {
        this.search();
      }, 1000);
    }
  },
  updated() {
    this.getKeyword();
  },
  data() {
    return {
      // 搜索状态,init未搜索，searching搜索中，searched已搜索
      mode: 'init',
      // 关键字
      keyword: '',
      // 高级筛选条件改变
      isFilterChange: false,
      // 搜索类型
      searchType: 'complex',
      // 当前页码
      pageNum: 1,
      // 每页个数
      pageSize: 9,
      // 高级搜素条件
      searchFilter: null,
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
      // init函数初始化到此
    };
  },
  methods: {
    // 从vuex获取keyword
    getKeyword() {
      console.log('into getKeyword');
      const myKey = this.$store.state.Common.search_keyword;
      if (myKey !== '') {
        this.keyword = myKey;
        this.$store.commit('Common/setSearchKeyword', '');
      }
    },
    // 初始化数据
    init() {
      this.mode = 'init';
      this.keyword = '';
      this.isFilterChange = false;
      this.pageNum = 1;
      this.pageSize = 9;
      this.searchFilter = null;
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
        this.pageNum = 1;
        this.search();
      }
    },
    // 当筛选条件改变时触发
    conditionChange(searchFilter) { // 待修改检查
      console.log('conditionChange');
      this.isFilterChange = true;
      this.searchFilter = searchFilter;
      if (this.keyword !== '') {
        this.search();
      }
    },
    // 搜索函数
    search() {
      this.mode = 'searching';
      // 前端分页
      if (this.isFrontEndPaginate) {
        // 如果高级筛选条件变动，则pageNum重置为1
        if (this.isFilterChange) {
          this.pageNum = 1;
          this.isFilterChange = false;
        }
        const params = {
          keyword: this.keyword,
          searchType: this.searchType,
          pageNum: 1,
          pageSize: 999999
        };
        // 如果存在高级筛选条件，则添加入相关条件
        if (this.searchFilter !== null) {
          Object.assign(params, this.searchFilter);
        }
        search(params).then((res) => {
          console.log(res);
          const { data } = res;
          this.data.total = data.total;
          this.data.list = data.records;
        }).finally(() => {
          this.mode = 'searched';
        });
      } else { // 后端分页
        // 如果高级筛选条件变动，则pageNum重置为1
        if (this.isFilterChange) {
          this.pageNum = 1;
          this.isFilterChange = false;
        }
        const params = {
          keyword: this.keyword,
          searchType: this.searchType,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        // 如果存在高级筛选条件，则添加入相关条件
        if (this.searchFilter !== null) {
          Object.assign(params, this.searchFilter);
        }
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
    }
  }
};
</script>
