<template>
  <!--最外层-->
  <div class="index-manage tw-w-full tw-min-h-full tw-flex tw-flex-col tw-bg-[#F2F3F5] tw-pl-[24px] tw-pr-[24px]">
    <!--面包屑-->
    <bread-crumbs :list="[{name: '指数管理',},]" class="tw-mt-[12px]"/>
    <!--白色区域-->
    <div class="tw-mt-[6px] tw-mb-[23px] tw-bg-white tw-rounded tw-flex-1 tw-pl-[23px] tw-pr-[23px] tw-flex tw-flex-col">
      <span class="tw-mt-[16px] tw-font-medium tw-text-[#000000] tw-text-base tw-leading-[22px]">指数管理</span>
      <!--筛选-->
      <el-input
        class="ee-input tw-mt-[15px]"
        v-model="keyword"
        placeholder="请输入指数名称"
        size="small"
        @keydown.enter.native="changeKeyword"
        style="width: 300px">
        <i slot="suffix" class="el-icon el-icon-search" @click="changeKeyword"></i>
      </el-input>
      <!--分割线-->
      <div class="tw-mt-[16px] tw-h-[1px] tw-bg-[#F3F1F1]"
           style="width: calc(100% + 23px);"/>
      <!--表格和分页-->
      <div class="tw-mt-[19px] tw-flex tw-flex-col">
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
          <el-table-column label="序号" prop="id" width="80" align="center"/>
          <!--名称-->
          <el-table-column label="名称" prop="title" show-overflow-tooltip width="200">
            <template slot-scope="scope">
              <span class="tw-cursor-pointer hover:tw-text-main" @click="handleView(scope.row)">{{scope.row?.title}}</span>
            </template>
          </el-table-column>
          <!--描述-->
          <el-table-column label="描述" prop="description" show-overflow-tooltip/>
          <!--更新时间-->
          <el-table-column label="更新时间" prop="updated_at" width="200" sortable="custom"/>
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
              <el-button type="text" size="medium" :disabled="scope.row.status === 1" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="medium" :disabled="scope.row.status === 1" @click="handleOnline(scope.row)">上线</el-button>
              <el-button type="text" size="medium" :disabled="scope.row.status === 2" @click="handleOffline(scope.row)">下线</el-button>
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
      </div>
    </div>
    <!--弹框-->
    <!--编辑弹框-->
    <edit-dialog v-if="showEditDialog"
                 :single-selection="singleSelection"
                 @on-ok="editDialogOnOk"
                 @on-cancel="editDialogOnCancel"/>
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
  </div>
</template>

<script>
import mixinList from '@/utils/mixinList';
import BreadCrumbs from '@/components/BreadCrumbs';
import EditDialog from '@/views/index-manage/components/EditDialog';
import DialogPrompt from '@/components/DialogPrompt';

export default {
  name: 'IndexManage',
  mixins: [
    mixinList
  ],
  components: {
    EditDialog,
    BreadCrumbs,
    DialogPrompt,
  },
  data() {
    return {
      // url
      url: '/oam/economy/index-type',
    };
  },
  methods: {
  },
};
</script>

<style scoped lang="less">
.index-manage {
  box-sizing: border-box;
  line-height: 1;
  * {
    box-sizing: border-box;
  }
}
</style>
