<template>
  <div class="flex flex-direction">
    <!--上-->
    <div style="width: 100%;">
      <!--左-->
      <!-- <div class="flex justify-direction"> -->
      <div class="margin-top-8" style="position: relative; padding: 0 24px">
        <InputWithSearch class="inline-search" :placeholder="'请输入文件名称'" @search="handleQuery" />
        <!--右-->
        <el-button
          class="upload-button"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >上传</el-button>
      </div>
      <!-- </div> -->
    </div>
    <div class="margin-top-8" style="padding: 0 24px">
      <el-table
        ref="filterTable"
        v-loading="loading"
        class=""
        :height="tableHeight"
        style="width: 100%;border-radius: 2px;"
        highlight-current-row
        border
        :data="modelFileList"
        @current-change="handleCurrentChange"
      >
        <el-table-column label="ID" prop="id" align="left" show-overflow-tooltip min-width="60">
          <template slot-scope="scope" class="flex align-center" style="width: 100%;">
            <el-radio v-model="selectedIndex" :label="scope.row.id" @change="handleCurrentChange(scope.row)" />
          </template>
        </el-table-column>
        <!--      <el-table-column label="模型文件" align="left" prop="modelFileName" show-overflow-tooltip>-->
        <!--        <template slot-scope="scope" class="flex justify-center align-center">-->
        <!--          <span style="color: #0164FF;font-weight: 500" type="primary" :underline="false" class="hand" @click="handleView(scope.row.id)">{{ scope.row.modelFileName }}</span>-->
        <!--        </template>-->
        <!--      </el-table-column>-->
        <el-table-column label="模型文件" min-width="120" align="left" prop="modelFileName" show-overflow-tooltip />
        <!--      <el-table-column label="文件名称" align="center" prop="userDefinedFileName" min-width="100" show-overflow-tooltip/>-->
        <el-table-column label="模型格式" align="left" prop="modelFileType" min-width="100" show-overflow-tooltip />
        <el-table-column label="上传时间" align="left" prop="createTime" min-width="100" show-overflow-tooltip />
        <!--        <el-table-column label="操作" align="left" class-name="small-padding fixed-width" min-width="100" show-overflow-tooltip>-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-button-->
        <!--              style="color: #0164FF;"-->
        <!--              size="mini"-->
        <!--              type="text"-->
        <!--              icon="el-icon-position"-->
        <!--              @click="handleSelectModel(scope.row.id)"-->
        <!--            >选择</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
    </div>
    <!--分页-->
    <div v-if="pageItemTotal > pageSize" class="flex justify-center align-center" style="width: 100%;height: 60px;min-height: 60px;">
      <el-pagination
        background
        :page-size="pageSize"
        layout="total,prev, pager, next,sizes,jumper"
        :page-sizes="[10,20,30,40]"
        :current-page="currentPage"
        :total="pageItemTotal"
        @size-change="handleSizeChange"
        @current-change="changePageNum"
      />
    </div>
    <div class="flex justify-center align-center margin-top-8" style="width: 100%;">
      <el-button style="border-radius: 4px;" @click="handleSelectModelCancel">取 消</el-button>
      <el-button type="primary" style="border-radius: 4px;" @click="handleSelectModel">确 定</el-button>
    </div>
    <!--新增、修改弹窗-->
    <el-dialog
      v-if="showDialog"
      v-dialogDrag
      :title="title"
      visible
      width="480px"
      :close-on-click-modal="false"
      append-to-body
      :custom-class="'detail-dialog'"
      :before-close="() => { showDialog = false }"
    >
      <upload-model-file ref="uploadModelFile" :show-dialog.sync="showDialog" @refreshDataList="getList" />
      <div v-if="flag !== 2" slot="footer" class="dialog-footer">
        <el-button style="border-radius: 4px;" @click="showDialog = false">取 消</el-button>
        <el-button type="primary" style="border-radius: 4px;" @click="$refs['uploadModelFile'].submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { modelFilePage } from '@/api/model.js';
import uploadModelFile from './upload-model-file.vue';
import InputWithSearch from '@/components/InputWithSearch';
import _ from 'lodash';
export default {
  name: 'SelectModelFile',
  components: {
    uploadModelFile,
    InputWithSearch
  },
  data() {
    return {
      flag: 0,
      showDialog: false,
      title: '',
      loading: false, // 页面加载
      modelFileList: [], // 模型文件列表
      multiple: true, // 非多个禁用
      ids: [],
      showSearch: true, // 显示隐藏搜索条件
      runFrameOptions: [
        { value: 'ModelServe', label: 'ModelServe' },
        { value: 'TFServing', label: 'TFServing' },
        { value: 'TrochServe', label: 'TrochServe' }
      ],
      pageItemTotal: 0, // 总记录数
      // runFrame: '', //  运行框架
      // beginTime: '', // 上传开始时间
      // endTime: '', // 上传结束时间
      currentPage: 1,
      pageSize: 10,
      runFrame: '',
      beginTime: '',
      endTime: '',
      keyword: '',
      tableHeight: 0,
      selectedIndex: -1
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getList();
    },
    // 分页
    changePageNum(val) {
      this.currentPage = val;
      this.getList();
    },
    // 选择
    handleCurrentChange(item) {
      this.selectedIndex = item.id;
    },
    /** 选择模型文件 */
    handleSelectModel() {
      if (this.selectedIndex === -1) {
        this.$message({
          type: 'warning',
          message: '请选择模型文件'
        });
        return;
      }
      this.$emit('update:showDialog', false);
      this.$emit('refreshDataList', this.selectedIndex);
    },
    handleSelectModelCancel() {
      this.$emit('update:showDialog', false);
    },
    getList() {
      this.loading = true;
      const params = {
        runFrame: this.runFrame, //  运行框架
        beginTime: this.beginTime, // 上传开始时间
        endTime: this.endTime, // 上传结束时间
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        modelFileName: '',
        userDefinedFileName: this.keyword
      };
      modelFilePage(params).then(res => {
        if (res.code === '000000') {
          this.modelFileList = res.data.records;
          this.pageItemTotal = res.data.total;
          this.$nextTick(() => {
            this.tableHeight = 400;
            this.$refs.filterTable.bodyWrapper.scrollTop = 0;
          });
        }
        this.loading = false;
      });
    },
    /** 上传模型文件 */
    handleAdd() {
      this.flag = 0;
      this.title = '上传模型文件';
      this.showDialog = true;
    },
    /** 搜索按钮操作 */
    handleQuery: _.debounce(function(value) {
      this.keyword = value;
      this.getList();
    }, 200)
  }
};
</script>

<style lang="scss" scoped>
.title-container {
  height: 40px;
  line-height: 40px;
  padding: 0 24px;
  border-bottom: 1px solid #f2f2f2
}
.upload-button {
  position: absolute;
  right: 24px;
  top: 0;
}
::v-deep {
  .detail-dialog {
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      .el-dialog__title {
        font-size: 14px;
        color: #262626;
        font-weight: 700;
      }
    }
  }
}
</style>
