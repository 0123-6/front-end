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
      <!--数据title-->
      <el-table-column label="数据" prop="title" min-width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="tw-cursor-pointer hover:tw-text-main" @click="handleView(scope.row)">{{scope.row?.title}}</span>
        </template>
      </el-table-column>
      <!--指数时间index_date-->
      <el-table-column label="指数时间" prop="index_date" width="200"/>
      <!--上传时间created_at-->
      <el-table-column label="上传时间" prop="created_at" width="200" sortable="custom"/>
      <!--状态-->
      <el-table-column label="状态" prop="status" width="100" :filters="[{text: '已上线',value: 1, }, {text: '已下线',value: 2, }]" column-key="status">
        <template slot-scope="scope">
          <div v-show="scope.row.status === 1"
               class="tw-flex tw-items-center">
            <div class="tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#52C51A]"/>
            <span class="tw-ml-[5px] tw-text-sm tw-text-[#1A262C]">已上线</span>
          </div>
          <div v-show="scope.row.status === 2"
               class="tw-flex tw-items-center">
            <div class="tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#C1C4BF]"/>
            <span class="tw-ml-[5px] tw-text-sm tw-text-[#1A262C]">已下线</span>
          </div>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleView(scope.row)">查看</el-button>
          <el-button type="text" size="medium" :disabled="scope.row.status === 1" @click="handleOnline(scope.row)">上线</el-button>
          <el-button type="text" size="medium" :disabled="scope.row.status === 2" @click="handleOffline(scope.row)">下线</el-button>
          <el-button type="text" size="medium" :disabled="scope.row.status === 1" @click="handleDelete(scope.row)">删除</el-button>
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
    <!--弹框-->
    <!--上线弹框-->
    <dialog-prompt v-if="showOnlineDialog"
                   @on-ok="onlineDialogOnOk({status: 1,})"
                   @on-cancel="onlineDialogOnCancel">
      <template slot="content">
        <span class="tw-mt-[44px] tw-text-base tw-text-[#262626] tw-flex tw-items-center">确定上线<span class="tw-max-w-[180px] tw-text-[#356DF6] tw-pl-[4px] tw-pr-[4px] hpj-text-hidden">{{singleSelection?.title}}</span>吗？</span>
      </template>
    </dialog-prompt>
    <!--下线弹框-->
    <dialog-prompt v-if="showOfflineDialog"
                   @on-ok="offlineDialogOnOk({status: 2,})"
                   @on-cancel="offlineDialogOnCancel">
      <template slot="content">
        <span class="tw-mt-[44px] tw-text-base tw-text-[#262626] tw-flex tw-items-center">确定下线<span class="tw-max-w-[180px] tw-text-[#356DF6] tw-pl-[4px] tw-pr-[4px] hpj-text-hidden">{{singleSelection?.title}}</span>吗？</span>
      </template>
    </dialog-prompt>
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
  name: 'IndexTable',
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
      url: '/oam/economy/index-history/index',
    };
  },
  created() {
    this.extraParams.index_type_id = this.index_type_id;
    this.idKey = 'index_history_id';
  },
  methods: {
    handleView(item) {
      console.log('item', item);
    },
  },
};
</script>

<style scoped>

</style>
