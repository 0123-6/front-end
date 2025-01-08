<template>
  <!--最外层-->
  <div class="tw-w-full tw-flex tw-flex-col">
    <el-table
      ref="table"
      v-loading="loading"
      :data="list"
      tooltip-effect="dark"
      stripe
      @filter-change="changeFilter"
      @sort-change="changeSort"
    >
      <!--序号-->
      <el-table-column label="序号" prop="id" width="80" align="left"/>
      <!--名称title-->
      <el-table-column label="名称" prop="title" min-width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="tw-cursor-pointer hover:tw-text-main" @click="handleView(scope.row)">{{scope.row?.title}}</span>
        </template>
      </el-table-column>
      <!--年份index_date-->
      <el-table-column label="年份" prop="index_date" width="200"/>
      <!--操作-->
      <el-table-column label="操作" width="100" fixed="right" align="left">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total_num > 10"
      class="ee-pagination tw-mb-[24px]"
      background
      layout="total,prev, pager, next,sizes,jumper"
      :current-page.sync="page_num"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page_size"
      :total="total_num"
      @size-change="changeSize"
      @current-change="changeNum">
    </el-pagination>
    <!--删除弹框-->
    <dialog-prompt v-if="showDeleteDialog"
                   @on-ok="deleteDialogOnOk"
                   @on-cancel="deleteDialogOnCancel">
      <template slot="content">
        <span class="tw-mt-[44px] tw-text-base tw-text-[#262626] tw-flex tw-items-center">确定删除<span class="tw-max-w-[180px] tw-text-[#356DF6] tw-pl-[4px] tw-pr-[4px] hpj-text-hidden">{{singleSelection?.title}}</span>吗？</span>
      </template>
    </dialog-prompt>
  </div>
</template>

<script>
import mixinList from '@/utils/mixinList';
import DialogPrompt from '@/components/DialogPrompt';

export default {
  name: 'ReportTable',
  props: {
    index_type_id: {
      type: Number,
      required: true,
    },
  },
  mixins: [
    mixinList,
  ],
  components: {
    DialogPrompt,
  },
  data() {
    return {
      url: '/oam/economy/index-history/report',
    };
  },
  created() {
    this.extraParams.index_type_id = this.index_type_id;
  },
  methods: {
    // 操作列部分
    handleView(item) {
      if (!item?.report_url) {
        this.$message({
          message: '暂无报告',
          type: 'warning',
        });
      } else {
        window.open(item.report_url);
      }
    },
  },
};
</script>

<style scoped>

</style>
