<template>
  <!--知识库-->
  <div class="policy w-full full-vh flex flex-col px-5 pb-5">
    <!--上-->
    <div class="w-full h-[66px] flex-shrink-0 flex justify-between items-center">
      <!--左-->
      <title-comp :type="1" title="知识库列表" class="" />
      <!--右-->
      <el-button type="primary" class="more-width" @click="showUploadFileDialog = true">
        <img src="./icon/UploadFileSvg.svg" alt="">
        <span class="ml-1 text-white text-sm">上传文件</span>
      </el-button>
    </div>
    <!--下-->
    <div v-loading="loading" class="w-full flex flex-col flex-1 pl-5 py-5 pr-5 rounded-2xl bg-white"
      style="min-height: 0;">
      <!--标签-->
      <div ref="tagWrap" class="flex tags-wrap" :class="{ 'is-expanded': showExpand && expandTags }">
        <!--左边-->
        <span class="h-[29px] text-sm text-black-three flex-shrink-0 flex items-center">标签：</span>
        <!--标签列表-->
        <div class="flex flex-wrap">
          <div v-for="(item, index) in labelList" :key="index"
            class="h-[29px] px-2.5 mr-[14px] mb-[14px] rounded-lg group cursor-pointer flex items-center" :class="[
              index === selectedLabelIndex ? 'bg-[#E5F6FD]' : 'bg-[#F4F4F4] hover:bg-[#FAFAFA]',
            ]" @click="clickLabel(index)">
            <span class="text-sm" :class="[
              index === selectedLabelIndex ? 'text-main' : 'text-[#1D2129] group-hover:text-[#5D6168]',
            ]">{{ item.labelName }} x{{ item.labelNumber }}</span>
          </div>
        </div>
        <div v-if="showExpand" class="ml20">
          <el-button link type="primary" @click="expandTags = !expandTags">{{ expandTags ? '收起' : '展开' }}
            <el-icon v-if="expandTags" class="ml4 f-l3">
              <ArrowUp />
            </el-icon>
            <el-icon v-else class="ml4 f-l3">
              <ArrowDown />
            </el-icon>
          </el-button>
        </div>
      </div>
      <!--搜索框+按钮-->
      <div class="mt-[3px] flex justify-between items-center">
        <!--左-->
        <el-input type="text" placeholder="请输入关键词搜索" clearable v-model="keyword" style="width: 270px;"
          @clear="changeKeyword" @keyup.enter.native="changeKeyword" />
        <!--右-->
        <div class="flex items-center button-h-34">
          <!---失效#B4B4B4-->
          <el-button :disabled="multipleSelection.length === 0 || multipleSelection.some(item => item.fileStatus != 1)"
            type="primary" plain @click="showLoseEffectDialog = true">
            <lose-efficacy-svg />
            <span class="ml-1">失效</span>
          </el-button>
          <!--删除-->
          <el-button :disabled="multipleSelection.length === 0" type="danger" plain @click="showDeleteDialog = true">
            <delete-svg style="width: 16px;height: 16px;" />
            <span class="ml-1">删除</span>
          </el-button>
        </div>
      </div>
      <!--已选择-->
      <div class="mt-[13px] w-full h-[46px] flex justify-between items-center rounded-lg"
        style="background-color: rgba(2, 173, 236, 0.1);">
        <!--左-->
        <div class="flex items-center pl-4">
          <img src="./icon/info.svg" alt="" class="w-4 h-4">
          <span class="ml-2.5 text-[#555555] text-sm font-medium leading-[22px]">已选择</span>
          <span class="mx-1.5 text-main ddin-n font-bold text-base leading-[22px]">{{ multipleSelection?.length ||
            0 }}</span>
          <span class="text-[#555555] text-sm font-medium leading-[22px]">项数据</span>
        </div>
        <!--右-->
        <div v-show="multipleSelection?.length" class="flex items-center mr-8">
          <span
            class="text-sm leading-[22px] select-none text-main hover:text-main-hover active:text-main-active cursor-pointer"
            @click="cancelSelection">取消选择</span>
        </div>
      </div>
      <!--表格-->
      <el-table ref="table" :data="list" tooltip-effect="dark" style="width: 100%" class="mt-3.5 full-w flex-1"
        :row-class-name="rowClassName" @selection-change="selectionChange">
        <!--多选-->
        <el-table-column type="selection" width="40" />
        <!--文件名称-->
        <el-table-column label="文件名称" prop="fileName" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <span class="cursor-pointer hover:text-main" @click="handleView(scope.row)">{{ scope.row?.fileName }}</span>
          </template>
        </el-table-column>
        <!--标签-->
        <el-table-column label="标签" prop="fileLabel" width="210" show-overflow-tooltip>
          <template #default="sc">
            <div class="d-flex ai-center">
              <div v-if="sc.row.fileLabel" class="h-[29px] px-2.5 bg-[#F4F4F4] rounded-lg text-black text-sm ell"
                style="max-width:150px;line-height: 29px;">
                {{ sc.row.fileLabel[0] }}</div>
              <el-popover v-if="sc.row.fileLabel && sc.row.fileLabel.length > 1" placement="top" trigger="hover"
                effect="dark">
                <template #reference>
                  <div
                    class="h-[29px] px-2.5 flex justify-start items-center bg-[#F4F4F4] rounded-lg text-black text-sm ml8">
                    +{{ sc.row.fileLabel.length - 1 }}</div>
                </template>
                <div v-for="(n, i) in sc.row.fileLabel" style="text-align: left;">{{ n }}</div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <!--发布时间,可排序-->
        <el-table-column label="发布时间" prop="publishTime" width="130" show-overflow-tooltip />
        <!--生效时间,可排序-->
        <el-table-column label="生效时间" prop="effectTime" width="130" show-overflow-tooltip />
        <!--状态-->
        <el-table-column label="状态" prop="fileStatus" width="100" show-overflow-tooltip>
          <template #default="scope">
            <div class="w-[62px] h-[29px] flex justify-center items-center rounded-lg text-sm" :class="[
              scope.row.fileStatus == 0 ? 'bg-[#fef4ee] text-[#F28C53]' : '',
              scope.row.fileStatus == 1 ? 'bg-[#e6f7fe] text-[#02ADEC]' : '',
              scope.row.fileStatus == 2 ? 'bg-[#f7f7f7] text-[#A8ACAD]' : '',
              scope.row.fileStatus == null ? 'bg-[#f7f7f7] text-[#A8ACAD]' : '',
            ]">
              <span class="">{{ (scope.row.fileStatus != undefined && scope.row.fileStatus != null) ?
                fileStatusNumToTextMap[scope.row.fileStatus] : '-' }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination v-show="totalNum > 10" :current-page="current" :page-size="size" :page-sizes="[10, 20, 50, 100]"
        background layout="total, sizes, prev, pager, next, jumper" :total="totalNum" @size-change="changeSize"
        @current-change="changeNum" />
    </div>
    <!--弹窗-->
    <!--上传知识文件-->
    <el-dialog v-model="showUploadFileDialog" append-to-body draggable destroy-on-close :close-on-click-modal="false"
      :close-on-press-escape="false" class="change-password-dialog" title="上传知识文件" width="636px">
      <upload-file-dialog @on-ok="uploadFileDialogOnOk" @on-cancel="uploadFileDialogOnCancel" />
    </el-dialog>
    <!--失效-->
    <prompt-dialog v-model:show="showLoseEffectDialog" content="确定要失效吗？" @on-ok="loseEffectDialogOnOk"
      @on-cancel="loseEffectDialogOnCancel" />
    <!--删除-->
    <prompt-dialog v-model:show="showDeleteDialog" content="是否确认删除文件？" @on-ok="deleteDialogOnOk"
      @on-cancel="deleteDialogOnCancel" />
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import LoseEfficacySvg from "@/views/policy/icon/LoseEfficacySvg";
import DeleteSvg from "@/views/user-manage/user-role/icon/DeleteSvg";
import mixinList from "@/utils/mixinList";
import UploadFileDialog from "@/views/policy/components/UploadFileDialog";
import PromptDialog from "@/views/user-manage/user-role/components/PromptDialog";
import request from "@/utils/request";

export default {
  name: "Policy",
  mixins: [mixinList],
  components: {
    PromptDialog,
    UploadFileDialog,
    DeleteSvg,
    LoseEfficacySvg,
    TitleComp,
  },
  data() {
    return {
      isFirst: true,
      // 上传文件弹窗
      showUploadFileDialog: false,
      // 失效弹框
      showLoseEffectDialog: false,
      // 删除弹框
      showDeleteDialog: false,
      // 标签列表
      labelList: [],
      selectedLabelIndex: -1,
      fileStatusNumToTextMap: {
        0: '待生效',
        1: '生效中',
        2: '已失效',
      },
      showExpand: true,
      expandTags: true
    };
  },
  created() {
    const keyword = history?.state?.params?.keyword;
    if (keyword) {
      this.keyword = keyword;
    }
  },
  methods: {
    rowClassName({ row }) {
      return this.multipleSelection.findIndex(n => row.fileId === n.fileId) > -1 ? 'is-checked' : ''
    },
    clickLabel(index) {
      if (index === this.selectedLabelIndex) {
        this.selectedLabelIndex = -1;
      } else {
        this.selectedLabelIndex = index;
      }
      this.current = 1;
      this.getData();
    },
    handleView(item) {
      if (item?.fileLink) {
        window.open(item.fileLink);
      } else {
        this.$message.warning('抱歉，暂无对应的文件');
      }
    },
    async getData() {
      let labelId = this.selectedLabelIndex === -1 ? null : this.labelList[this.selectedLabelIndex].labelId;
      let labelType = this.selectedLabelIndex === -1 ? null : this.labelList[this.selectedLabelIndex].labelType;
      let periodId = this.selectedLabelIndex === -1 ? null : this.labelList[this.selectedLabelIndex].periodId;
      if (this.isFirst) {
        // 从？后面的参数中获取labelId和labelType
        labelId = this.$route?.query?.labelId;
        labelType = this.$route?.query?.labelType ? Number(this.$route?.query?.labelType) : null;
        periodId = this.$route?.query?.periodId;
      }
      const params = {
        keyword: this.keyword,
        current: this.current,
        size: this.size,
        labelId,
        labelType,
        periodId,
      }
      this.loading = true;
      const { result } = await request({
        url: '/repository/knowledgeBase/list',
        method: 'post',
        data: params,
      });
      // const {result} = await this.getFalseData(params);
      console.log('result', result);
      this.list = result.knowledgeBaseDataList;
      this.labelList = result.knowledgeLabelDataList;
      this.totalNum = result.totalNum;
      if (this.isFirst) {
        // 通过labelId和labelType获取selectedLabelIndex
        this.selectedLabelIndex = this.labelList.findIndex(n => n.labelId == labelId && n.labelType == labelType && n.periodId == periodId);
        this.isFirst = false;
      }
      this.expandTags = true
      this.$nextTick(() => {
        this.showExpand = this.$refs.tagWrap.getBoundingClientRect().height > 70;
      });
      this.loading = false;
    },
    // 弹框
    async uploadFileDialogOnOk(params) {
      console.log('uploadFileDialogOnOk', params);
      await request({
        url: '/repository/knowledgeBase/editKnowledgeFile',
        method: 'post',
        data: params,
      });
      this.showUploadFileDialog = false;
      this.$message.success('上传知识文件成功');
      this.current = 1;
      this.getData();
    },
    uploadFileDialogOnCancel() {
      this.showUploadFileDialog = false;
    },
    async loseEffectDialogOnOk() {
      const params = {
        ids: this.multipleSelection.map(item => item.fileId),
      }
      await request({
        url: '/repository/knowledgeBase/invalidateBatch',
        method: 'post',
        data: params,
      });
      this.$message.success('失效知识文件成功');
      this.showLoseEffectDialog = false;
      this.getData();
    },
    loseEffectDialogOnCancel() {
      this.showLoseEffectDialog = false;
    },
    async deleteDialogOnOk() {
      console.log('select', this.multipleSelection);
      const params = {
        ids: this.multipleSelection.map(item => item.fileId),
      }
      await request({
        url: '/repository/knowledgeBase/deleteBatch',
        method: 'post',
        data: params,
      });
      this.$message.success('删除知识文件成功');
      this.showDeleteDialog = false;
      this.current = 1;
      this.getData();
    },
    deleteDialogOnCancel() {
      this.showDeleteDialog = false;
    },
  },
};
</script>

<style lang="scss">
.policy {
  .el-button+.el-button {
    margin-left: 8px;
  }

  .more-width.el-button {
    padding-left: 9px;
    padding-right: 9px;
  }

  .button-h-34 {
    .el-button {
      height: 34px;
      padding-left: 9px;
      padding-right: 9px;
    }
  }

  .el-table td.el-table__cell {
    height: 50px;
  }

  .tags-wrap {
    height: 39px;
    overflow-y: hidden;

    &.is-expanded {
      height: auto;
      overflow-y: visible;
    }
  }
}
</style>
