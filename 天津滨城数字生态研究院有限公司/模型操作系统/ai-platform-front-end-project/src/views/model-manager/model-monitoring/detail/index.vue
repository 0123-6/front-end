<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-06 19:46:16
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-30 11:23:27
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\model-monitoring\detail\other.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="flex flex-direction monitoring-detail-container">
    <div v-if="false" class="flex align-center monitoring-detail-options">
      <el-row>
        <el-col :span="24">
          <el-input
            v-model="searchModelName"
            class="modelName-search-input"
            placeholder="请输入关键词搜索"
            prefix-icon="el-icon-search"
            @keyup.enter.native="searchModelOptions"
          />
          <div class="model-tags-container">
            <div
              v-for="item of modelNameSelectOptions"
              :key="item.id"
              class="model-tags-detail"
              :class="{'active': currentModelId === item.modelId }"
              :title="item.modelNameCh"
              @click="changeModelName(item)"
            >
              {{ item.modelNameCh }}
            </div>
            <div v-show="isShowOptions" class="operation-button" @click="changeOpenState">
              {{ isOpenState?'收缩':'展开' }}<i :class="isOpenState?'el-icon-arrow-up':'el-icon-arrow-down'" />
            </div>
          </div>
          <div v-show="isShowOptions" class="flex justify-center monitoring-detail-pagination-container">
            <el-pagination
              background
              layout="total,prev, pager, next,slot,jumper"
              :current-page="currentPage"
              :total="total"
              @current-change="changeCurrentPage"
            >
              <span key="1">
                <el-select v-model="pageSize" placeholder="请选择" size="mini" @change="changePageSize">
                  <el-option
                    v-for="item in pageSizeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <iframe class="flex flex-direction" width="100%" height="100%" :src="iframeSrc" frameborder="0" />
  </div>
</template>
<script>
import { getInfomationList } from '@/api/model-monitoring';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      iframeSrc: '',
      searchModelName: '',
      currentModelName: '',
      currentModelId: '',
      currentModelDeployment: '',
      total: 0,
      currentPage: 1,
      pageSize: 6,
      pageSizeOptions: [
        { label: '6行/页', value: 6 },
        { label: '12行/页', value: 12 },
        { label: '18行/页', value: 18 },
        { label: '24行/页', value: 24 }
      ],
      modelNameAllOptions: [],
      modelNameSelectOptions: [],
      screenWidth: null, // 当前dom尺寸
      colNum: 7, // 分割的列数，向下取整
      isShowOptions: false,
      isOpenState: false
    };
  },
  computed: {
    ...mapGetters(['grafanaUrl'])
  },
  watch: {
    screenWidth: {
      handler: function(val) {
        this.colNum = Math.floor(val / 218); // 分割的列数，向下取整
        this.formatModelNameSelectOptions(this.colNum);
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.screenWidth = document.getElementsByClassName('monitoring-detail-container')[0].clientWidth - 32;
      window.onresize = () => { // 屏幕尺寸变化就重新赋值
        return (() => {
          this.screenWidth = document.getElementsByClassName('monitoring-detail-container')[0].clientWidth - 32;
        })();
      };
      this.getInfomationLists();
    });
  },
  methods: {
    // 获取下拉数据
    getInfomationLists() {
      const params = {
        pageSize: this.colNum === 0 ? this.pageSize * 7 : this.pageSize * this.colNum,
        pageNum: this.currentPage,
        keyword: this.searchModelName
      };
      getInfomationList(params).then(res => {
        this.modelNameAllOptions = res.data.records;
        this.total = res.data.total;
        if (this.modelNameAllOptions.length <= 0) return;
        this.colNum = Math.floor(this.screenWidth / 218); // 分割的列数，向下取整
        this.formatModelNameSelectOptions(this.colNum);
        this.changeModelName(this.modelNameSelectOptions[0]);
      });
    },
    // 每页选择
    changePageSize(value) {
      this.pageSize = value;
      this.currentPage = 1;
      this.getInfomationLists();
    },
    // 分页
    changeCurrentPage(value) {
      this.currentPage = value;
      this.getInfomationLists();
    },
    // 搜索模型
    searchModelOptions() {
      this.currentPage = 1;
      this.getInfomationLists();
    },
    // 选中
    changeModelName(command) {
      this.currentModelName = command.modelNameCh;
      this.currentModelId = command.modelId;
      this.currentModelDeployment = command.deployment;
      this.iframeSrc = `${this.grafanaUrl}/d/5J05uyr7z/devopsprodigy-kubegraf-deployments-dashboard?orgId=1&refresh=1m&var-cluster=ai-base-monitor&var-prom_ds=prometheus&var-PromDs=prometheus&var-namespace=ai-base&var-deployment=${this.currentModelDeployment}&var-pod=all&var-container=All&theme=light&kiosk`;
      // 目前写死s
      // this.iframeSrc = 'http://8.219.125.128:31451/d/5J05uyr7z/fu-wu-ren-wu-zi-yuan-jian-kong-xiang-qing?orgId=1&refresh=1m&var-cluster=ai-base-monitor&var-prom_ds=prometheus&var-PromDs=prometheus&var-namespace=ai-base&var-deployment=tensorflow-serve-predictor-default-00001-deployment&var-pod=All&var-container=All&kiosk'
    },
    // 格式化展示的模型名称
    formatModelNameSelectOptions() {
      if (this.colNum === 0) return;
      this.isShowOptions = false;
      const rowNum = Math.ceil((this.modelNameAllOptions.length) / this.colNum); // 分割的行数，向上取整
      if (rowNum <= 1) {
        this.modelNameSelectOptions = this.modelNameAllOptions.slice(0, this.colNum);
      } else if (rowNum > 1 && rowNum <= 3) {
        this.modelNameSelectOptions = this.modelNameAllOptions.slice(0, rowNum * this.colNum);
      } else {
        this.isShowOptions = true;
        // 大于3，重新算列数，存在一个展开/收缩的按钮
        // this.colNum = Math.floor((this.screenWidth - 70) / 218);
        // console.log(this.colNum, 3 * this.colNum)
        // rowNum = Math.ceil((this.modelNameAllOptions.length) / this.colNum);
        this.modelNameSelectOptions = this.modelNameAllOptions.slice(0, (3 * this.colNum));
      }
      return this.modelNameSelectOptions;
    },
    // 切换展开/收缩的状态
    changeOpenState() {
      this.isOpenState = !this.isOpenState;
      if (this.isOpenState) {
        this.modelNameSelectOptions = this.modelNameAllOptions.slice(0, (this.pageSize * this.colNum));
      } else {
        const index = this.modelNameAllOptions.findIndex(item => item.modelId === this.currentModelId) + 1;
        const row = Math.ceil(index / this.colNum);
        const maxRow = Math.ceil(this.modelNameAllOptions.length / this.colNum);
        if (row === 1) {
          // 高亮在第一行，取前三行
          this.modelNameSelectOptions = this.modelNameAllOptions.slice(0, (3 * this.colNum));
        } else if (row === maxRow) {
          // 高亮在当前页最后一行，取最后三行
          this.modelNameSelectOptions = this.modelNameAllOptions.slice((row - 3) * this.colNum);
        } else {
          // 其余，前后个一行
          this.modelNameSelectOptions = this.modelNameAllOptions.slice((row - 2) * this.colNum, (row + 1) * this.colNum);
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.monitoring-detail-container {
  //margin: 16px 217px 24px;
  //padding: 44px 56px;
  background: #f6faff;
  box-shadow: 0 2px 6px 0 rgba(194, 199, 199, 0.5);
  border-radius: 1px;
  // height: calc( 100% - 68px);
  height: 100%;
  .monitoring-detail-options {
    // margin-bottom: 8px;
    padding: 16px;
    .modelName-search-input {
      width: 300px;
      margin-bottom: 8px;
    }
    .model-tags-detail {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      background: #E4EDF8;
      margin: 4px;
      width: 210px;
      text-align: center;
      cursor: pointer;
      padding: 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      &.active {
        background: #0164FF;
        color: #ffffff;
      }
    }
    .operation-button {
      color: #0164FF;
      cursor: pointer;
      display: inline-block;
      width: 50px;
      margin-left: 20px;
      position: relative;
      top: -12px;
    }
    .monitoring-detail-pagination-container {
      width: 100%;
      height: 60px;
      margin-top: 16px;
      ::v-deep {
        .el-pagination.is-background .btn-prev,
        .el-pagination.is-background .btn-next,
        .el-pagination.is-background .el-pager li {
          background-color: white;
          border: 1px solid #DCDFE6;
        }
        .el-pagination.is-background .el-pager li:not(.disabled).active{
          background-color: #0164FF;
        }
      }
    }
  }
}
</style>
