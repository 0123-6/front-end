<template>
  <!--最外层-->
  <div class="w-full flex flex-col items-center">
    <!--搜索栏-->
    <div class="w-full bg bg-cover flex justify-center items-center"
         style="height: 111px;min-height: 111px;">
      <InputSearch :search-value="searchValue" placeholder="请输入模型名称" @ok="searchModel($event)"></InputSearch>
    </div>
    <!--数据区-->
    <div class="flex flex-col"
         v-loading="mode==='searching'"
         style="width: 1200px;">
      <!--haveData-->
      <div v-if="data.list.length > 0"
           class="w-full flex flex-col">
        <div class="w-full mt-4 grid grid-cols-4 gap-4">
          <ModelCard
            v-for="(item, index) of data.list"
            :key="index"
            :model-data="item"
          />
        </div>
        <el-pagination
          v-if="data.total > 8"
          class="self-center mt-6 pb-6 pagination"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="data.total"
          :page-sizes="[8, 16, 24]"
          background
          layout="total, prev, pager, next, sizes, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <!--searched && noData-->
    <div v-if="data.list && data.list.length === 0"
         class="w-full flex flex-col items-center"
         style="margin-top: 184px;">
      <img src="@/assets/no-data.svg" alt="" style="width: 190px;height: 190px;">
      <span class="mt-4 text-base text-black-light">暂无数据</span>
    </div>
  </div>
</template>
<script>
import ModelCard from '@/views/model-library/components/model-card';
import { getModelListData } from '@/api/model-library';
import InputSearch from '@/components/InputSearch';
import EmptyState from '@/components/EmptyState';

export default {
  name: 'model-library',
  components: {
    InputSearch,
    ModelCard
  },
  data() {
    return {
      // 模式，init初始状态,searching搜索中,searched已搜索
      mode: 'init',
      pageSize: 8,
      pageNum: 1,
      searchValue: '',
      // 查询到的结果
      data: {
        // 总条数
        total: 0,
        // 具体数据
        list: []
      }
    };
  },
  mounted() {
    this.getModelList();
  },
  methods: {
    searchModel(value) {
      this.searchValue = value;
      this.pageNum = 1;
      this.getModelList();
    },
    getModelList() {
      this.mode = 'searching';
      const params = {
        keywords: this.searchValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getModelListData(params).then((res) => {
        this.mode = 'searched';
        if (res.code === '000000') {
          this.data.list = res.data.records;
          this.data.total = res.data.total;
        } else {
          //
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getModelList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getModelList();
    }
  }
};
</script>

<style scoped>
.bg {
  background-image: url('../../assets/search-bg.png');
}
</style>
