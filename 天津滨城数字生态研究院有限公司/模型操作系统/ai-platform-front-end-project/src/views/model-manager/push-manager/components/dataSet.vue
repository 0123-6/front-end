<template>
  <el-dialog
    v-dialogDrag
    :title="!itemInfo.hasUnionDataSet ? '关联体验数据集' : '更新体验数据集'"
    :custom-class="'dialog'"
    style="line-height:30px;font-size: 14px;color: #262626;letter-spacing: 0;font-weight: 700;"
    visible
    append-to-body
    :before-close="cancel"
    width="900px"
  >
    <div class="content">
      <AiSteps :active="active-1" :steps="steps" />

      <div v-if="active === 1" class="info">
        <InputWithSearch class="inline-search" :placeholder="'请输入数据集名称'" @search="handleQuery" />
        <el-table
          ref="multipleTable"
          v-loading="loading"
          border
          :data="dataSetList"
          class="table"
          :height="tableHeight"
          @sort-change="sortChange"
          @mousedown.native="mouseDownHandler"
          @mouseup.native="mouseUpHandler"
          @mousemove.native="mouseMoveHandler"
        >
          <el-table-column width="60" align="center">
            <template
              v-slot="scope"
              class="flex align-center"
              style="width: 100%"
            >
              <el-radio
                v-model="selectedIndex"
                :label="scope.row.id"
                @change="handleSelectChange(scope.row)"
              >{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" width="60" :index="indexMethod" />
          <el-table-column label="ID" prop="id" width="80" sortable="custom" />
          <el-table-column label="数据集名称" width="400">
            <template
              v-slot="scope"
              class="flex align-center"
            >
              <span
                class="dataSetName hover-to-blue"
                :style="{'color': scope.row.isSelected === false ? '#606266' : '#0164FF'}"
                @click="toDataSet(scope.row)"
              >{{ scope.row.name }}
                <el-tooltip content="已关联数据集" effect="dark" placement="top">
                  <i v-if="scope.row.isChecked" style="color: #0164FF" class="el-icon-star-on" />
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="150">
            <template v-slot="scope">
              <span>{{ typeMap[scope.row.type] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="样本" prop="taskNumber" width="90" sortable="custom" />
        </el-table>
        <div class="hint">提示：模型体验最多支持10个样本推理，如选择的数据集样本超过10，则取前10个样本。</div>
        <div v-if="total > 10" class="flex justify-center align-center" style="width: 100%;height: 60px;">
          <el-pagination
            background
            :page-size="pageSize"
            layout="total,prev, pager, next,sizes,jumper"
            :page-sizes="[10, 20, 50]"
            :current-page="currentPage"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div v-if="active === 2" class="info">
        <div class="title">
          <span>模型</span> : {{ itemInfo.modelNameCh }}
        </div>
        <div class="title">
          <span>数据集</span> : {{ selectedDataSet.name }}
        </div>
        <div class="statusInfo">
          <div v-if="iconLoading" style="color: #0164FF;"><i class="el-icon-loading" />推理中</div>
          <div v-if="!iconLoading && iconSuccess" style="color: #00AB5A;"><i class="el-icon-success" />推理成功</div>
          <div
            v-if="!iconLoading && iconSuccess"
            style="font-size:14px;color: #0164FF;cursor: pointer;text-decoration: underline;text-underline-offset: 3px;"
            @click="toResult"
          >查看结果</div>
          <div v-if="!iconLoading && iconFail" style="color: #FD5E3A">
            <i class="el-icon-warning" />
            推理失败</div>
          <div v-if="!iconLoading && iconFail" style="font-size: 14px;font-weight: 400;color: #FD5E3A">模型推理失败，请重新选择数据集</div>
        </div>
      </div>
      <div v-if="active === 3" class="info">
        <div style="text-align: center; margin-top: 40px"><i class="el-icon-success" style="font-size: 50px;color: #00AB5A;" /></div>
        <div style="text-align: center">关联数据集体验成功</div>
      </div>
      <div v-if="active !== 3" class="flex justify-center" style="margin-bottom: 10px">
        <el-button class="white-btn" :disabled="(active === 2 && iconLoading)" @click="prev">{{ active === 1 ? '取消' : '上一步' }}</el-button>
        <el-button :disabled="(active === 1 && selectedIndex === null) || (active === 2 && (!iconSuccess || iconLoading))" class="blue-btn" @click="next">下一步</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import InputWithSearch from '@/components/InputWithSearch';
import { dataSetPredict, getDataSetList, getSelectedDataSet, unionDataSet } from '@/api/model';
import AiSteps from '@/components/AiSteps';

export default {
  name: 'Index',
  components: {
    AiSteps,
    InputWithSearch
  },
  props: {
    itemInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      active: 1,
      steps: ['选择数据集', '推理预测', '完成'],
      loading: false,
      selectedIndex: null,
      searchModelName: null,
      dataSetList: [],
      selectedDataSet: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      typeMap: {
        PICTURE: '图像',
        TEXT: '文本',
        VIDEO: '视频',
        VOICE: '音频',
        TABLE: '表格'
      },
      iconLoading: true,
      iconFail: false,
      iconSuccess: false,
      dataResult: null,
      errDesc: '',
      tableHeight: 0 // 处理闪现暂无数据
    };
  },
  mounted() {
    this.getDataSetList();
  },
  methods: {
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    mouseDownHandler(e) {
      this.mouseOffset = e.clientX;
      this.mouseFlag = true;
    },
    mouseUpHandler(e) {
      this.mouseFlag = false;
    },
    mouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.multipleTable) return;
      const divData = this.$refs.multipleTable.bodyWrapper;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },
    async getDataSetList() {
      this.loading = true;
      if (!this.itemInfo.hasUnionDataSet) {
        const params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          keywords: this.searchModelName,
          modelTypeId: this.itemInfo.modelTypeId,
          modelId: this.itemInfo.id,
          column: this.sortColumn,
          order: this.sortOrder
        };
        getDataSetList(params).then(res => {
          if (res.code === '000000') {
            this.dataSetList = res.data.records;
            this.$nextTick(() => {
              this.tableHeight = 300;
              this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            });
            this.dataSetList.map(item => {
              this.$set(item, 'isChecked', false);
              this.$set(item, 'isSelected', false);
            });
            this.loading = false;
            this.total = res.data.total;
            this.loading = false;
          } else {
            this.dataSetList = [];
            this.loading = false;
          }
        }).catch(() => {
          this.dataSetList = [];
          this.loading = false;
        });
      } else {
        await this.getSelectedDataSet();
        const params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize - 1,
          keywords: this.searchModelName,
          modelTypeId: this.itemInfo.modelTypeId,
          modelId: this.itemInfo.id,
          column: this.sortColumn,
          order: this.sortOrder
        };
        getDataSetList(params).then(res => {
          if (res.code === '000000') {
            this.dataSetList = res.data.records;
            this.$nextTick(() => {
              this.tableHeight = 300;
              this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            });
            this.dataSetList.map(item => {
              this.$set(item, 'isChecked', false);
              this.$set(item, 'isSelected', false);
            });
            this.loading = false;
            this.dataSetList.unshift(this.selectedDataSet);
            this.total = res.data.total;
            this.loading = false;
          } else {
            this.dataSetList = [];
            this.loading = false;
          }
        }).catch(() => {
          this.dataSetList = [];
          this.loading = false;
        });
      }
    },
    async getSelectedDataSet() {
      await getSelectedDataSet(this.itemInfo.id).then(res => {
        if (res.code === '000000') {
          this.selectedDataSet = res.data;
          this.$set(this.selectedDataSet, 'isChecked', true);
          this.$set(this.selectedDataSet, 'isSelected', true);
          this.selectedIndex = res.data.id;
        }
      });
    },
    cancel() {
      if (this.active === 3) {
        this.$emit('ok');
      } else {
        this.$emit('cancel');
      }
    },
    /** 搜索按钮操作 */
    handleQuery(value) {
      this.searchModelName = value;
      this.currentPage = 1;
      this.getDataSetList();
    },
    prev() {
      this.iconLoading = true;
      this.iconSuccess = false;
      this.iconFail = false;
      this.active === 1 ? this.cancel() : this.active--;
    },
    next() {
      const params = {
        dataSetId: this.selectedIndex,
        modelId: this.itemInfo.id
      };
      if (this.active === 1) {
        dataSetPredict(params).then(res => {
          if (res.code === '000000') {
            this.iconLoading = false;
            this.iconSuccess = true;
            this.dataResult = res.data;
          } else {
            this.iconLoading = false;
            this.iconFail = true;
            this.errDesc = res.desc === '未知错误' ? '推理失败' : res.desc;
          }
        });
      } else if (this.active === 2) {
        unionDataSet(params).then(res => {
          if (res.code === '000000') {
            setTimeout(() => {
              this.$emit('ok');
            }, 2000);
          }
        });
      }
      this.active++;
    },
    toDataSet(data) {
      let tagType = ''; // permission, common, mine
      if (data.mine === 1) {
        tagType = 'permission';
      } else {
        if (data.judgePermission && data.judgePermission.permissionExpire === 2) {
          tagType = 'permission';
        } else {
          tagType = 'common';
        }
      }
      sessionStorage.setItem('isShowLabelView', true);
      sessionStorage.setItem('isShowForkButton', false);
      const routeData = this.$router.resolve({ path: `/model-manager/push/common-detail/self/${data.id}/${tagType}` });
      window.open(routeData.href, '_blank');
    },
    toResult() {
      const routeData = this.$router.resolve({
        path: '/reasoning-result',
        query: { data: JSON.stringify({
          datasetId: this.selectedIndex,
          modelId: this.itemInfo.id,
          datasetName: this.selectedDataSet.name,
          modelName: this.itemInfo.modelNameCh }) }
      });
      window.open(routeData.href, '_blank');
    },
    // 选择
    handleSelectChange(item) {
      this.selectedIndex = item.id;
      this.selectedDataSet = item;
      // 立即刷新
      this.dataSetList.forEach(ele => {
        ele.isSelected = ele.id === item.id;
      });
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.sortOrder = order;
      this.selectedIndex = null;
      this.getDataSetList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataSetList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataSetList();
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .dialog {
    border-radius: 4px;
    .el-dialog__header {
      height: 45px;
      line-height: 45px;
      padding: 0 24px;
      border-bottom: 1px solid #f2f2f2;
      .el-dialog__title {
        font-size: 14px;
      }
    }
    .dialog-footer {
      margin-bottom: 20px;
    }
  }
}

.content{
  .info{
    min-height: 300px;
    .title{
      font-weight: 400;
      margin-left: 360px;
      >span{
        display: inline-block;
        width:60px;
        text-align-last: justify;
      }
    }
    .statusInfo{
      margin-top: 30px;
      font-size: 18px;
      font-weight: 400;
      >div {
        display: flex;
        justify-content: center;
        align-items: center;
        >i{
          font-size: 28px;
          margin: 0 12px;
        }
      }
    }
  }
  .table{
    margin-top: 10px;
    font-weight: 400;
  }
  .hint{
    margin: 6px 0;
    font-size: 14px;
    color: #B7B7B7;
    letter-spacing: 0;
    font-weight: 400;
  }
  .dataSetName{
    cursor: pointer;
  }
}
</style>
