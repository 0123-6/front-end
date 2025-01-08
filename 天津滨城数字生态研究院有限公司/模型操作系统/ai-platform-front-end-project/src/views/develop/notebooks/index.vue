<template>
  <!--最外层-->
  <div
    class="flex flex-direction bgc-main padding-left-16 padding-right-16 my-id-12-class"
    style="min-width: var(--content-div-min-width);min-height: 100%;"
  >
    <!--内容区-->
    <div
      class="flex flex-direction margin-top-16 margin-bottom-16 padding-bottom-24 padding-left-24 padding-right-24 box-shadow-1 bgc-white"
      style="width: 100%;min-height: calc(100vh - 142px);"
    >
      <!--上-->
      <div class="flex justify-between align-center margin-top-16 operation-panel">
        <!--左-->
        <div class="flex align-center">
          <!--左-->
          <div class="flex font-size-16 color-content font-weight" style="">
            Notebooks
          </div>
          <!--右-->
          <div style="margin-left: 24px;">
            <input-with-search placeholder="请输入Notebook名称" class="notebook-search-container" @search="search" />
          </div>
        </div>
        <!--右-->
        <div class="flex align-center">
          <el-button
            type="primary"
            style="width: 96px;box-shadow: 0 2px 6px 1px rgba(183,217,255,0.47);border-radius: 4px;font-size: 12px;"
            @click="create"
          >新建
          </el-button>
        </div>
      </div>
      <!--中，下，表格和分页-->
      <div
        style="width: 100%;height: auto;"
      >
        <!--table-->
        <!--                  height="calc(100% - 8px - 60px)"-->
        <el-table
          ref="filterTable"
          v-loading="loading"
          class="margin-top-8"
          style="width: 100%;border-radius: 2px;"
          border
          :data="data"
          :height="tableHeight"
          @mousedown.native="mouseDownHandler"
          @mouseup.native="mouseUpHandler"
          @mousemove.native="mouseMoveHandler"
        >
          <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip width="80">
            <template slot-scope="scope" class="flex justify-center align-center" style="width: 100%;">
              <div class="flex justify-center align-center" style="width: 100%;">
                <div v-if="scope.row.status.phase==='ready'">
                  <el-tooltip
                    :key="scope.row.simpleName+scope.row.status.phase"
                    class=""
                    effect="dark"
                    content="运行中"
                    placement="top"
                    style="width: 20px;"
                  >
                    <div class="flex align-center">
                      <img src="@/assets/images/notebook/notebook_ok.svg" alt="" width="20" height="20">
                    </div>
                  </el-tooltip>
                </div>
                <div v-if="scope.row.status.phase==='waiting'">
                  <el-tooltip
                    :key="scope.row.simpleName+scope.row.status.phase+scope.row.status.message"
                    class=""
                    effect="dark"
                    :content="scope.row.status.message!=='PodInitializing'?scope.row.status.message!=='Scheduling the Pod'?(scope.row.status.message.indexOf('No')===-1?scope.row.status.message:'当前服务器资源紧缺，请删除稍后重试。'):'调度pod':'pod初始化'"
                    placement="top"
                    style="width: 20px;"
                  >
                    <div class="flex align-center">
                      <span class="el-icon-loading color-blue" style="margin-right: 4px;font-size: 20px;width: 20px;height: 20px;" />
                    </div>
                  </el-tooltip>
                </div>
                <div v-if="scope.row.status.phase==='terminating'">
                  <el-tooltip
                    v-if="!isDelete"
                    :key="scope.row.simpleName+scope.row.status.phase+'down'"
                    class=""
                    effect="dark"
                    content="notebook服务正在停止"
                    placement="top"
                    style="width: 20px;"
                  >
                    <div class="flex align-center">
                      <span class="el-icon-loading color-orange" style="margin-right: 4px;font-size: 20px;width: 20px;height: 20px;" />
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    v-if="isDelete"
                    :key="scope.row.simpleName+scope.row.status.phase+'delete'"
                    class=""
                    effect="dark"
                    content="删除中"
                    placement="top"
                    style="width: 20px;"
                  >
                    <div class="flex align-center">
                      <span class="el-icon-loading color-red" style="margin-right: 4px;font-size: 20px;width: 20px;height: 20px;" />
                    </div>
                  </el-tooltip>
                </div>
                <div v-if="scope.row.status.phase==='stopped'">
                  <el-tooltip
                    :key="scope.row.simpleName+scope.row.status.phase"
                    class=""
                    effect="dark"
                    content="当前Notebook服务没有正在运行的pod"
                    placement="top"
                    style="width: 20px;"
                  >
                    <div class="flex align-center">
                      <img src="@/assets/images/notebook/pause-status.svg" alt="" width="20" height="20">
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            align="left"
            prop="simpleName"
            show-overflow-tooltip
            min-width="110"
          />
          <el-table-column label="类型" align="left" prop="serverType" show-overflow-tooltip width="120">
            <template slot="header">
              <TableFiltersPopover
                :table-label="{
                  'type': 'serverType',
                  'label': '类型'
                }"
                :selection-list="serverTypeOptions"
                :popover-width="'160'"
                @filter="filterChange"
              />
            </template>
            <template slot-scope="scope" class="flex align-center">
              <div class="flex align-center">
                <span v-if="scope.row.serverType === 'jupyter'">jupyterlab</span>
                <span v-if="scope.row.serverType === 'group-one'">Codeserver</span>
                <span v-if="scope.row.serverType === 'group-two'">RStudio</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="时间"
            align="left"
            prop="age"
            show-overflow-tooltip
            width="100"
          />
          <el-table-column label="镜像" align="left" prop="shortImage" show-overflow-tooltip min-width="180" />
          <el-table-column label="GPU(卡数)" align="left" prop="gpus.count" show-overflow-tooltip width="100"/>
          <el-table-column label="CPU(核数)" align="left" prop="cpu" show-overflow-tooltip width="100" >
            <template slot-scope="scope">
              <div class="flex align-center" style="width: 100%;">
                {{Number(scope.row.cpu).toFixed(1)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Memory(Gi)" align="left" prop="memory" show-overflow-tooltip width="100" >
            <template slot-scope="scope">
              <div class="flex align-center" style="width: 100%;">
                {{Number(scope.row.memory).toFixed(1)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Volumes" align="center" prop="Volumes" show-overflow-tooltip width="80">
            <template slot-scope="scope" class="flex align-center" style="width: 100%;">
              <el-popover
                placement="bottom-start"
                trigger="click"
                width="170"
              >
                <div class="flex flex-direction hand" style="width: 100%;">
                  <div v-for="(item,index) in scope.row.volumes" :key="index" class="flex align-center hand volumn" style="height: 32px;">
                    <div class="flex align-center margin-left-8">
                      <img src="@/assets/images/notebook/server-fill-hui.svg" alt="" width="20" height="20">
                    </div>
                    <div class="flex align-center font-size-16 margin-left-16">
                      {{ item }}
                    </div>
                  </div>
                </div>
                <img
                  v-show="true"
                  slot="reference"
                  src="@/assets/images/notebook/dian.svg"
                  alt=""
                  width="20"
                  height="20"
                >
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            class-name="table-operation-container"
            align="center"
            prop="操作"
            show-overflow-tooltip
            width="140"
            fixed="right"
          >
            <template slot-scope="scope" class="flex align-center" style="width: 100%;">
              <div class="flex align-center">
                <TableOperationTooltip icon-class="table-link" tooltip-title="连接" :icon-disabled="scope.row.status.phase!=='ready'" style="margin-right: 8px;" @tooltipClick="connect(scope.row)" />
                <TableOperationTooltip icon-class="table-start" tooltip-title="启动" :icon-disabled="scope.row.status.phase!=='stopped'" style="margin-right: 8px;" @tooltipClick="online(scope.row)" />
                <TableOperationTooltip
                  icon-class="table-stop"
                  tooltip-title="停止"
                  :icon-disabled="scope.row.status.phase!=='ready' && scope.row.status.phase!=='waiting' && scope.row.status.phase!=='terminating'"
                  style="margin-right: 8px;"
                  @tooltipClick="downLine(scope.row)"
                />
                <TableOperationTooltip icon-class="table-delete" tooltip-title="删除" @tooltipClick="deleteItem(scope.row)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--下,分页-->
        <div v-if="pageItemTotal > pageSize" class="flex justify-center align-center nootbooks-pagination-container" style="width: 100%;height: 60px;">
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
    </div>
    <!--弹窗区-->
    <!--终止,删除-->
    <!--    <dialog-ok-->
    <!--      v-if="showPauseDialog"-->
    <!--      :title="dialogTitle"-->
    <!--      :content="dialogContent"-->
    <!--      :width="'400px'"-->
    <!--      @ok="dialogOk"-->
    <!--      @cancel="dialogCancel"-->
    <!--    />-->
    <!--新终止,删除-->
    <MessageDialog
      v-if="showPauseDialog"
      :title="dialogTitle"
      @save="dialogOk"
      @cancel="dialogCancel"
    >
      <template slot="content">
        <div class="content-container" v-html="dialogContent" />
      </template>
    </MessageDialog>
    <!--iframe-->
    <!-- <iframe :src="notebookBeforeLinkUrl" style="width: 1px;height: 1px;visibility: hidden;"></iframe> -->
  </div>
</template>

<script>
import {
  deleteNotebook,
  getAuthserviceSession,
  getNamespaceList,
  getNoteBookList, getOidcUrl,
  setNotebookStatus
} from '@/api/notebook';
import _ from 'lodash';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import InputWithSearch from '@/components/InputWithSearch';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import { mapGetters } from 'vuex';
import qs from 'qs';
import { getNotebookConfByUserId } from '@/api/user';

export default {
  name: 'Index',
  components: {
    InputWithSearch,
    MessageDialog,
    TableFiltersPopover,
    TableOperationTooltip
  },
  data() {
    return {
      loading: false, // 加载中
      keyword: '', // 搜索框
      pageItemTotal: 0, // 列表总数
      pageSize: 10, // 每页条数
      currentPage: 1, // 当前页码

      data: [], // 主要内容
      dataIndexName: '', // 选中项

      // 弹窗状态
      showPauseDialog: false,
      dialogTitle: '提示',
      dialogContent: '',
      dialogType: '', // stop delete text
      visible: false,

      selectedNotebook: null, // 选中的notebook，用于操作
      isDelete: false,

      // 定时器
      timer: null,
      mouseFlag: false,
      mouseOffset: 0,
      serverTypeOptions: [
        { code: 'jupyter', label: 'jupyterlab' },
        { code: 'group-one', label: 'Codeserver' },
        { code: 'group-two', label: 'RStudio' }
      ],
      typeList: [],
      tableHeight: 0
    };
  },
  computed: {
    // 命名空间，不知道干啥的
    namespace: {
      get() {
        return this.$store.state.modelBase.namespace;
      },
      set(value) {
        this.$store.commit('setNamespace', value);
      }
    },
    userId: {
      get() {
        return this.$store.state.user.userId;
      }
    },
    ...mapGetters(['kubeflowUrl'])
  },
  created() {
    this.loading = true;
    this.getNamespaceList();
  },
  mounted() {
    window.addEventListener('resize', this.setTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight);
    clearInterval(this.timer);
    this.timer = null;
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
      if (!this.$refs.filterTable) return;
      const divData = this.$refs.filterTable.bodyWrapper;
      if (this.mouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.mouseOffset + (this.mouseOffset = e.clientX));
      }
    },
    // 表格鼠标按下滚动 结束
    // 连接notebook
    connect(item) {
      if (item.status.phase !== 'ready') return;
      this.$message({
        message: '系统正在连接，大约需要3-5s',
        type: 'success',
        duration: 5000
      });

      // sessionStorage.setItem('notebookDetails', JSON.stringify({
      //   name: item.name, namespace: item.namespace, serverType: item.serverType
      // }));
      // const routeData = this.$router.resolve({
      //   name: 'NotebookLink'
      // });
      // window.open(routeData.href, '_blank');

      // 第一步，
      getAuthserviceSession().then(res => {
        document.cookie = res.data + ';domain=8.219.125.128:30368';
        const dataList = res.data.split(';');
        const authservice_session = dataList.find(item => {
          return item.indexOf('authservice_session=') >= 0;
        });
        // 第2步，获取oidc
        getOidcUrl().then(res => {
          const url = res.data;
          // this.notebookBeforeLinkUrl = url;
          window.open(url, 'beforeWeb');
          // this.$router.push({
          //   name:'NotebookLink',
          //   params:{
          //     src:url,
          //   }
          // })

          // 不执行
          setTimeout(() => {
            let afterUrl = '';
            // 第3步 拼接jupyter访问地址
            if (item.serverType === 'jupyter') {
              afterUrl = this.kubeflowUrl + '/notebook/' + item.namespace + '/' + item.name + '/lab' + `?${authservice_session.trim()}&domain=8.219.125.128:30368`;
            } else {
              afterUrl = this.kubeflowUrl + '/notebook/' + item.namespace + '/' + item.name + `?${authservice_session.trim()}&domain=8.219.125.128:30368`;
            }
            window.open(afterUrl, 'beforeWeb');
          }, 300);
        });
      });
    },
    // 获取namespace
    getNamespaceList() {
      getNamespaceList().then(res => {
        this.namespace = res.data[0].namespace;
        clearInterval(this.timer);
        this.timer = null;
        const _this = this;
        _this.getList();
        this.timer = setInterval(function() {
          _this.getList();
        }, 3000);
      });
    },
    // 启动
    online(item) {
      if (item.status.phase !== 'stopped') return;
      this.selectedNotebook = JSON.parse(JSON.stringify(item));
      const params = {
        namespace: this.namespace,
        name: this.selectedNotebook.name
      };
      const data = {
        stopped: false
      };
      setNotebookStatus(params, data).then(res => {
        if (res.code === '000000') {
          this.$message({
            message: '正在启动 ' + this.selectedNotebook.simpleName + ' notebook服务',
            type: 'success'
          });
        } else {
          //之前启动失败逻辑
          // this.$message({
          //   message: '启动 ' + this.selectedNotebook.simpleName + ' notebook失败',
          //   type: 'error'
          // });
          //新逻辑
          this.dialogType = 'text'
          let text = ''
          if(!res.data.gpu.enought){
            text += 'GPU剩余'+res.data.gpu.number+'卡数，'
          }
          if(!res.data.cpu.enought){
            text += 'CPU剩余'+res.data.cpu.number+'核，'
          }
          if(!res.data.memory.enought){
            text += 'Memory剩余'+res.data.memory.number+'Gi，'
          }
          this.dialogContent = '<span style="text-align: left;display: block;">您的账户可用资源不足。 <span class="color-blue">' + text + ' </span>建议暂停部分Notebook服务以释放资源，或者联系管理员申请更多资源，联系方式13201010101。</span>'
          this.showPauseDialog = true
        }
        this.getList();
      });
    },
    downLine(item) {
      if (item.status.phase !== 'ready' && item.status.phase !== 'waiting' && item.status.phase !== 'terminating') return;
      this.selectedNotebook = JSON.parse(JSON.stringify(item));
      this.isDelete = false;
      this.dialogType = 'stop';
      this.dialogContent = '<span>是否停止 <span class="color-blue">' + this.selectedNotebook.simpleName + ' </span>notebook服务</span>';
      this.showPauseDialog = true;
    },
    deleteItem(item) {
      this.selectedNotebook = JSON.parse(JSON.stringify(item));
      this.isDelete = true;
      this.dialogType = 'delete';
      this.dialogContent = '<span>是否删除 <span class="color-blue">' + this.selectedNotebook.simpleName + ' </span>notebook服务</span>';
      this.showPauseDialog = true;
    },
    // 搜索函数
    search: _.debounce(function(val) {
      this.keyword = val;
      this.currentPage = 1;
      this.getList();
    }, 200),
    jsCalc(val1,val2){
      return (val1*10 - val2*10)/10
    },
    // 新建
    create() {
      let params = {
        userId:this.userId,
      }
      getNotebookConfByUserId(qs.stringify(params)).then(res => {
        let data = res.data
        let ok = this.jsCalc(data.cpu.total,data.cpu.use)>=0.1 && this.jsCalc(data.memory.total,data.memory.use)>=0.1
        console.log('hpj test,change time: 9.30 23:15')
        if(ok){
          this.$router.push({
            name: 'CreateNotebooks'
          });
        }else {
          //新逻辑
          this.dialogType = 'text'
          let text = ''
          if((data.cpu.total-data.cpu.use) < 0.1){
            text += 'CPU剩余'+(data.cpu.total-data.cpu.use)+'核，'
          }
          if((data.memory.total-data.memory.use) < 0.1){
            text += 'Memory剩余'+(data.memory.total-data.memory.use)+'Gi，'
          }
          this.dialogContent = '<span style="text-align: left;display: block;">您的账户可用资源不足。 <span class="color-blue">' + text + ' </span>建议暂停部分Notebook服务以释放资源，或者联系管理员申请更多资源，联系方式13201010101。</span>'
          this.showPauseDialog = true
        }
      })

    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.loading = true;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loading = true;
      this.getList();
    },
    getList() {
      // this.loading = true
      const params = {
        keyword: this.keyword,
        namespace: this.namespace,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        typeList: this.typeList.join(',')
      };
      getNoteBookList(params).then(res => {
        if (res.code === '000000') {
          this.pageItemTotal = res.data.total;
          this.data = res.data.records;
          this.loading = false;

          this.$nextTick(() => {
            this.$refs.filterTable.bodyWrapper.scrollTop = 0;
            this.setTableHeight();
          });
          // 遍历结果，用于交互提示(比如用户点击了启动，结果为启动成功后，)
          for (let i = 0; this.selectedNotebook != null && i < this.data.length; i++) {
            if (this.selectedNotebook.simpleName === this.data[i].simpleName) {
              // 启动成功
              if (this.selectedNotebook.status.phase === 'stopped' && this.data[i].status.phase === 'ready') {
                this.$message({
                  message: this.selectedNotebook.simpleName + ' notebook服务启动成功!',
                  type: 'success'
                });
                this.selectedNotebook = null;
              } else if (this.selectedNotebook.status.phase === 'ready' && this.data[i].status.phase === 'stopped') { // 终止成功
                this.$message({
                  message: this.selectedNotebook.simpleName + ' notebook服务停止成功!',
                  type: 'success'
                });
                this.selectedNotebook = null;
              }
            }
          }
          // 遍历结果，用于删除效果
          let haveItem = false;
          for (let i = 0; this.selectedNotebook != null && i < this.data.length; i++) {
            if (this.selectedNotebook.simpleName === this.data[i].simpleName) {
              haveItem = true;
            }
          }
          if (this.selectedNotebook != null && haveItem === false) {
            this.$message({
              message: this.selectedNotebook.simpleName + ' notebook服务删除成功!',
              type: 'success'
            });
            this.selectedNotebook = null;
            this.isDelete = false;
          }
        } else {
          clearInterval(this.timer);
          this.timer = null;
        }
      }).catch(err => {
        console.log(err);
        clearInterval(this.timer);
        this.timer = null;
      });
    },
    // 弹窗返回ok
    dialogOk() {
      this.dialogCancel();
      if (this.dialogType === 'delete') {
        const params = {
          namespace: this.namespace,
          name: this.selectedNotebook.name
        };
        deleteNotebook(params).then(res => {
          if (res.code === '000000') {
            this.$message({
              message: '正在删除 ' + this.selectedNotebook.simpleName + ' notebook服务',
              type: 'success'
            });
          } else {
            this.$message({
              message: '删除 ' + this.selectedNotebook.simpleName + ' notebook服务失败!',
              type: 'error'
            });
          }
          this.getList();
        });
      } else if (this.dialogType === 'stop') {
        const params = {
          namespace: this.namespace,
          name: this.selectedNotebook.name
        };
        const data = {
          stopped: true
        };
        setNotebookStatus(params, data).then(res => {
          if (res.code === '000000') {
            this.$message({
              message: '正在停止' + this.selectedNotebook.simpleName + ' notebook服务',
              type: 'success'
            });
          } else {
            this.$message({
              message: '停止' + this.selectedNotebook.simpleName + ' notebook服务失败',
              type: 'error'
            });
          }
          this.getList();
        });
      }else if(this.dialogType == 'text'){

      }
    },
    // 弹框返回cancel
    dialogCancel() {
      this.showPauseDialog = false;
    },
    filterChange(type, list) {
      this.typeList = list;
      this.currentPage = 1;
      this.getList();
    },
    // 设置表格高度，做表格滚动表头不动处理
    setTableHeight() {
      const bodyHeight = document.body.offsetHeight - 50;
      const navHeight = document.getElementById('AiHeader-container').offsetHeight;
      const topOperationHeight = document.getElementsByClassName('operation-panel')[0].offsetHeight;
      const paginationHeight = document.getElementsByClassName('nootbooks-pagination-container')[0] ? document.getElementsByClassName('nootbooks-pagination-container')[0].offsetHeight : 0;
      this.tableHeight = bodyHeight - navHeight - topOperationHeight - paginationHeight - 64 - 16 - 16;
      const realTableHeight = this.data.length * 45 + 45;
      if (this.data.length === 0) {
        this.tableHeight = 60 + 45;
      } else {
        this.tableHeight > realTableHeight ? this.tableHeight = realTableHeight : '';
      }
    }
  }

};
</script>

<style lang="scss">
.volumn:hover{
  background-color: #0164FF;
  color: white;
}

.el-popover{
  padding: 8px 0;
}

::v-deep .el-popover{
  padding: 8px 0;
}

.notebook-search-container {
  width: 260px !important;
}

.content-container {
  ::v-deep {
    .label-color {
      color: #0164FF;
    }
  }
}

</style>
