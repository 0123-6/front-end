<template>
  <!--最外层-->
  <div id="tableOutter" class="flex flex-direction">
    <!--标题和搜索-->
    <div class="flex align-center" style="margin-top: 10px;">
      <div class="flex color-title font-size-14 font-weight-600">模型</div>
      <InputWithSearch placeholder="请输入模型名称" style="margin-left: 34px;" @search="search" />
    </div>
    <!--表格-->
    <div class="margin-top-16" style="width: 100%;">
      <el-table
        v-loading="loading"
        style="width: 100%;border-radius: 2px;"
        border
        :data="data"
        :max-height="tabHeight"
      >
        <el-table-column label="序号" type="index" width="60" :index="indexMethod" />
        <el-table-column label="ID" align="left" prop="model.id" show-overflow-tooltip min-width="60" />
        <el-table-column label="模型名称" align="left" prop="model.modelNameCh" show-overflow-tooltip min-width="180">
          <template slot-scope="scope" class="flex align-center">
            <span class="hand hover-to-blue" @click="goMonitorDetail(scope.row,'性能')">{{ scope.row.model.modelNameCh }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性能监控" align="left" prop="effect.status" show-overflow-tooltip min-width="80">
          <template slot-scope="scope" class="flex align-center" style="width: 100%;">
            <div class="flex justify-center align-center" style="width: 100%;">
              <div class="flex" :class="[scope.row.effect.status!=='noData'?'hand':'cursor-not-allow']" style="width: 20px;height: 20px;" @click="goMonitorDetail(scope.row,'性能')">
                <el-tooltip :key="scope.row.model.id+'性能正常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'性能')">模型性能正常</span>
                  </div>
                  <img v-if="scope.row.effect.status==='success'" src="/monitor/success.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'性能异常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'性能')">模型性能异常</span>
                  </div>
                  <img v-if="scope.row.effect.status==='warning'" src="/monitor/warning.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'性能未监控'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="cursor-not-allow">未配置监控</span>
                  </div>
                  <img
                    v-if="scope.row.effect.status==='noData'"
                    src="/monitor/no-data.svg"
                    alt=""
                    width="100%"
                    height="100%"
                    @click.stop=""
                  >
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="输入监控" align="left" prop="input.status" show-overflow-tooltip min-width="80">
          <template slot-scope="scope" class="flex align-center" style="width: 100%;">
            <div class="flex justify-center align-center" style="width: 100%;">
              <div class="flex" :class="[scope.row.input.status!=='noData'?'hand':'cursor-not-allow']" style="width: 20px;height: 20px;" @click="goMonitorDetail(scope.row,'输入')">
                <el-tooltip :key="scope.row.model.id+'输入正常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'输入')">模型输入正常</span>
                  </div>
                  <img v-if="scope.row.input.status==='success'" src="/monitor/success.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'输入异常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'输入')">模型输入异常</span>
                  </div>
                  <img v-if="scope.row.input.status==='warning'" src="/monitor/warning.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'输入未监控'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="cursor-not-allow">未配置监控</span>
                  </div>
                  <img
                    v-if="scope.row.input.status==='noData'"
                    src="/monitor/no-data.svg"
                    alt=""
                    width="100%"
                    height="100%"
                    @click.stop=""
                  >
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="输出监控" align="left" prop="output.status" show-overflow-tooltip min-width="80">
          <template slot-scope="scope" class="flex align-center" style="width: 100%;">
            <div class="flex justify-center align-center" style="width: 100%;">
              <div class="flex" :class="[scope.row.output.status!=='noData'?'hand':'cursor-not-allow']" style="width: 20px;height: 20px;" @click="goMonitorDetail(scope.row,'输出')">
                <el-tooltip :key="scope.row.model.id+'输出正常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'输出')">模型输出正常</span>
                  </div>
                  <img v-if="scope.row.output.status==='success'" src="/monitor/success.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'输出异常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'输出')">模型输出异常</span>
                  </div>
                  <img v-if="scope.row.output.status==='warning'" src="/monitor/warning.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'输出未监控'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="cursor-not-allow">未配置监控</span>
                  </div>
                  <img
                    v-if="scope.row.output.status==='noData'"
                    src="/monitor/no-data.svg"
                    alt=""
                    width="100%"
                    height="100%"
                    @click.stop=""
                  >
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资源监控" align="left" prop="resource.status" show-overflow-tooltip min-width="80">
          <template slot-scope="scope" class="flex align-center" style="width: 100%;">
            <div class="flex justify-center align-center" style="width: 100%;">
              <div class="flex" :class="[scope.row.resource.status!=='noData'?'hand':'cursor-not-allow']" style="width: 20px;height: 20px;" @click="goMonitorDetail(scope.row,'资源')">
                <el-tooltip :key="scope.row.model.id+'资源正常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'资源')">模型资源正常</span>
                  </div>
                  <img v-if="scope.row.resource.status==='success'" src="/monitor/success.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'资源异常'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="hand" @click="goMonitorDetail(scope.row,'资源')">模型资源异常</span>
                  </div>
                  <img v-if="scope.row.resource.status==='warning'" src="/monitor/warning.svg" alt="" width="100%" height="100%">
                </el-tooltip>
                <el-tooltip :key="scope.row.model.id+'资源未监控'" effect="dark" placement="top">
                  <div slot="content">
                    <span class="cursor-not-allow">未配置监控</span>
                  </div>
                  <img
                    v-if="scope.row.resource.status==='noData'"
                    src="/monitor/no-data.svg"
                    alt=""
                    width="100%"
                    height="100%"
                    @click.stop=""
                  >
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="过去30天预测量" align="left" prop="predict.total" show-overflow-tooltip min-width="130" />
      </el-table>
    </div>
    <!--分页-->
    <div
      v-if="pageItemTotal > pageSize || pageSize!==10 || dev"
      class="flex justify-center align-center"
      style="width: 100%;height: 60px;"
    >
      <el-pagination
        background
        :page-size="pageSize"
        layout="total,prev, pager, next,sizes,jumper"
        :page-sizes="[10,20,30,40]"
        :current-page="currentPage"
        :total="pageItemTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import TitleStyle from '@/components/TitleStyle';
import InputWithSearch from '@/components/InputWithSearch';
import _ from 'lodash';
import { getModelList } from '@/api/model-monitoring';
import { windowAddReSizeEvent } from '@/utils';
export default {
  name: 'ModelTable',
  components: {
    TitleStyle,
    InputWithSearch
  },
  data() {
    return {
      // 开发环境
      dev: false,

      // 加载
      loading: false,

      // 搜索
      keyword: null,
      currentPage: 1,
      pageSize: 10,

      // 列表数据
      data: [],
      pageItemTotal: 0, // 列表总条数
      tabHeight: 0
    };
  },
  created() {
    this.init();
  },
  mounted() {
    windowAddReSizeEvent(_.debounce(() => {
      this.tabHeight = document.getElementById('tableOutter').offsetHeight - 120;
    }, 200));
  },
  methods: {
    init() {
      this.getList();
    },
    // 搜索函数
    search: _.debounce(function(val) {
      this.keyword = val;
      this.currentPage = 1;
      this.getList();
    }, 200),
    // 分页改变每页个数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getList();
    },
    // 分页改变页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 获取模型列表
    getList() {
      const params = {
        keywords: this.keyword,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      this.loading = true;
      getModelList(params).then(res => {
        // 成功
        if (res.code === '000000') {
          const data = res.data;
          this.pageItemTotal = data.total;
          this.data = data.records;
          this.$nextTick(() => {
            this.tabHeight = document.getElementById('tableOutter').offsetHeight - 120;
          });
        }
        // 失败
        else {

        }
      }).finally(res => {
        this.loading = false;
      });
    },
    // 获取列表序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 点击模型名称，进入该模型监控页面
    goMonitorDetail(row, tab) {
      let type = '';
      type = row.model.type.typeCode;
      if (type === 'ImageCategory') {
        // 图像二分类
        if (Object.keys(JSON.parse(row.model.labelMapping)).length === 2) {
          type += 'Single';
        }
      }
      this.$router.push({
        name: 'MonitorDetail',
        params: {
          id: String(row.model.id),
          modelNameCh: row.model.modelNameCh,
          namespace: row.resource.deployment.namespace,
          deployment: row.resource.deployment.deployment,
          tab,
          type
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
