<template>
  <el-dialog
    v-dialogDrag
    width="900"
    visible
    :close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    :before-close="cancel"
    :title="'选择模型'"
  >
    <div class="dialog-header">
      <el-form :model="params" :inline="true" label-suffix=":">
        <el-form-item label-width="100">
          <!-- <el-input v-model="params.modelName" prefix-icon="el-icon-search" placeholder="请输入模型名称" /> -->
          <InputWithSearch class="inline-search" :placeholder="'请输入模型名称'" @search="searchModel" />
        </el-form-item>
        <el-form-item label-width="100">
          <el-select v-model="params.modelClass" placeholder="请选择模型类型" clearable @change="changeModelType">
            <el-option
              v-for="item in modelTypeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100">
          <div class="comparison-tool-container">
            {{ operateType === 'comparison' && selectedRows.length > 0? `已选择${selectedRows.length}条数据` : '' }}
            {{ operateType === 'comparison' ? '最多选择10个同类型模型' : '' }}
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="loading" style="height: 400px; overflow: auto">
      <el-table
        ref="multipleTable"
        border
        :height="tableHeight"
        :data="modelList"
        :class="operateType === 'evaluation'?'evaluation':'comparison'"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
        @select="handleRadioChange"
      >
        <el-table-column align="center" type="selection" width="55" :reserve-selection="true" />
        <el-table-column label="序号" type="index" width="55" :index="indexMethod" />
        <el-table-column label="模型名称" prop="modelNameCh" show-overflow-tooltip />
        <el-table-column label="模型类型" prop="typeName" show-overflow-tooltip />
        <el-table-column label="版本" prop="versionName" show-overflow-tooltip />
        <el-table-column label="上线时间" prop="onlineTime" show-overflow-tooltip />
        <el-table-column label="创建者" prop="createUser.nickName" show-overflow-tooltip />
      </el-table>
    </div>
    <el-pagination
      v-if="total > pageSize"
      background
      class="flex justify-center margin-top-8"
      :total="total"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      layout="total, prev, pager, next,sizes, jumper"
      @current-change="changeCurrentPage"
    />
    <!--下-->
    <template slot="footer">
      <div class="flex justify-center align-center margin-top-16" style="width: 100%;">
        <el-button class="white-btn margin-right-16" @click="cancel">取消</el-button>
        <el-button class="blue-btn" @click="ok">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getModelList, modelTypeList } from '@/api/model';
import InputWithSearch from '@/components/InputWithSearch';

export default {
  name: 'SelectModel',
  components: {
    InputWithSearch
  },
  props: {
    operateType: {
      type: String,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    recordSelectedData: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      params: {
        modelName: '',
        modelClass: ''
      },
      modelTypeList: [],
      loading: false,
      modelList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      searchModelName: '',
      selectedRows: [],
      initSelectedData: [],
      selectedRadioRow: null,
      labelMapping: null,
      tableHeight: 0
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initSelectedData = this.recordSelectedData;
      this.getModelTypeList();
      this.getModelList();
    },
    getModelTypeList() {
      modelTypeList().then(res => {
        if (res.code === '000000') {
          this.modelTypeList = res.data;
        }
      });
    },
    getModelList() {
      this.loading = true;
      const params = {
        modelName: this.params.modelName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        modelTypeId: this.params.modelClass
      };
      getModelList(params).then(res => {
        this.modelList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
        this.$nextTick(() => {
          this.tableHeight = 400;
          this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
        });
        if (this.initSelectedData.length > 0) {
          this.initSelectedData.forEach(row => {
            if (row) {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          });
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    // 分页
    changeCurrentPage(value) {
      this.pageNum = value;
      this.getModelList();
    },
    searchModel(value) {
      this.params.modelName = value;
      this.pageNum = 1;
      this.getModelList();
    },
    changeModelType() {
      this.pageNum = 1;
      this.clearSelect();
      this.getModelList();
    },
    ok() {
      if (this.operateType === 'evaluation') {
        this.$emit('ok', this.selectedRadioRow);
      } else if (this.operateType === 'comparison') {
        const typeArray = this.selectedRows.map(item => { return item.modelTypeId; });
        if (new Set(typeArray).size < 2) {
          if (this.selectedRows.length >= 2 && this.selectedRows.length <= 10) {
            this.$emit('ok', this.selectedRows, this.labelMapping);
          } else {
            this.$message.warning('请选择2-10个模型!');
          }
        } else {
          this.$message.warning('只能选择相同类型的模型!');
        }
      }
    },
    cancel() {
      this.$emit('cancel');
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
    },

    // 列表选择,val选中的表格行数据
    handleSelectionChange(val) {
      this.selectedRows = val;
      this.labelMapping = val.labelMapping;
      this.initSelectedData = [];
    },
    handleRadioChange(selection, val) {
      if (this.operateType === 'evaluation') {
        this.clearSelect();
        if (val.length === 0) {
          return;
        }
        if (val) {
          this.selectedRadioRow = val;
          this.labelMapping = val.labelMapping;
          this.$refs.multipleTable.toggleRowSelection(val);
        }
      }
    },

    // 清空选择的值
    clearSelect() {
      this.$refs.multipleTable.clearSelection();
    },
    indexMethod(index) {
      return (this.pageNum - 1) * this.pageSize + index + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    height: 40px;
    line-height: 40px;
    padding: 0 24px;
    border-bottom: 1px solid rgba(242,242,242,1);
    .el-dialog__title {
      font-family: SourceHanSansSC-Bold;
      font-size: 14px;
      color: #262626;
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 700;
    }
  }
  .el-dialog__body {
    padding: 8px 24px;
  }
  .el-dialog__footer {
    padding: 24px;
    padding-top: 0;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .title-container {
    height: 40px;
    line-height: 40px;
    padding: 0 24px;
    border-bottom: 1px solid #f2f2f2;
    font-size: 14px;
    color: #262626;
    font-weight: 700;
  }
}
.comparison-tool-container {
  font-size: 12px;
  color: #B7B7B7;
  letter-spacing: 0;
  font-weight: 400;
  position: relative;
  top: 6px;
}
::v-deep {
  .el-table__cell .gutter{
    width: 0;
  }
  .el-form-item__label {
    font-weight: 400;
  }
}
::v-deep .el-table {
  &.evaluation {
    .el-table__header-wrapper {
      .el-checkbox { // 找到表头那一行，然后把里面的复选框隐藏掉
        display: none !important;
      }
    }
  }
}
.empty-state-container {
  margin-bottom: 10vh;
}
</style>
