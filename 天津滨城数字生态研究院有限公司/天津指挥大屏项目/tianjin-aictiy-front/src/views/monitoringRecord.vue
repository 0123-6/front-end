<template>
  <!--最外层-->
  <div class="flex flex-direction bgc-image-1"
       style="width: 1920px;height: 1080px;padding-left: 20px;padding-right: 20px;">
    <!--退出确认对话框-->
    <div v-dialogDrag v-if="ShowQuitPopUp" class="flex flex-direction align-center"
         style="position: absolute;z-index: 4;width: 517px;height: 308px;background: linear-gradient(169deg, rgba(15, 51, 101, 0.9), rgba(9, 39, 72, 0.9));border: 1px solid #2C5C9B;border-radius: 6px"
         :style="{ 'left': '647px', 'top': '245px' }">
      <div class="flex justify-between align-center head" style="width: 90%;height: 40px;border-bottom: 1px solid #1d5486">
        <div class="flex">
          提示
        </div>
        <div @click="ShowQuitPopUp = false" @mouseover="changeColorClose2" @mouseout="resetColorClose2"
             class="flex justify-center align-center hand" style="width: 30px;height: 30px;">
          <Icon type="md-close" :color="colorClose2" size="26"/>
        </div>
      </div>
      <div class="flex" style="margin-top: 78px;">
        <div class="flex">
          确定退出实时监控吗？退出则关闭标注任务。
        </div>
      </div>
      <div class="flex justify-center" style="margin-top: 86px">
        <!--左-->
        <div class="flex">
          <Button type="primary" style="margin-right: 16px;height: 32px;width: 88px;" @click="ShowQuitPopUp = false">取消
          </Button>
          <Button type="primary" style="height: 32px;width: 88px;" @click="quit">确定</Button>
        </div>
        <!--右-->
      </div>
    </div>
    <!-- 上面菜单栏 -->
    <div class="flex align-center t132" style="width: 1880px;height: 68px;margin-top: 12px;">
      <!-- 天津生态城 -->
      <div class="flex class-1-1 hand" @click="showQuitPopUp">天津生态城指挥中心</div>
      <div class="flex flex-1 align-center" style="margin-left: 143px">
        <div v-for="(item, index) in menuList" :key="index" class="flex class-1-2 hand"
             :class="[index === menuListIndex ? 'class-1-3' : '']" @mouseover="overMenuList(index)"
             @mouseout="outMenuList">
          {{ item }}
        </div>
      </div>
      <!--退出监控-->
      <div class="flex justify-center align-center hand" @click="showQuitPopUp" style="margin-right: 32px">
        <div class="flex">退出监控</div>
        <div>
          <Icon type="md-power" color="#486586" size="26"/>
        </div>
      </div>

    </div>
    <!--跟踪预警信息-->
    <div class="flex flex-direction" style="height: 136px;width: 100%;margin-top: 16px;">
      <!--标题-->
      <div class="flex align-center justify-between"
           style="width: 100%;height: 56px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
        <!--左-->
        <div class="flex align-center">
          <div class="flex my-class-title"
               style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
          <div class="flex"
               style="margin-left: 4px;font-size: 16px;font-family: Source Han Sans SC;font-weight: 500;color: #9eb5cd;">
            跟踪预警信息
          </div>
        </div>
        <!--右-->
        <div class="flex hand align-center" @click="returnMonitor" style="margin-right: 24px;">
          <Icon type="md-left" size="26" color="#cfd6e1"/>
          返回
        </div>

      </div>
      <!--表格-->
      <div class="text-color">
        <Table :columns="columns" :data="earlyWarningInformation">
          <template slot-scope="{ row, index }" slot="status">
            <div v-if="row.status==0" class="flex align-center">
              <div class="flex"
                   style="width: 14px;height: 14px;background-color:#dbc271;border-radius: 1000px;margin-right: 8px;"></div>
              <div>未处理</div>
            </div>
            <div v-if="row.status==1" class="flex align-center">
              <div class="flex"
                   style="width: 14px;height: 14px;background-color:#ff5b5a;border-radius: 1000px;margin-right: 8px;"></div>
              <div>重点处理</div>
            </div>
            <div v-if="row.status==2" class="flex align-center">
              <div class="flex"
                   style="width: 14px;height: 14px;background-color:#7cbad7;border-radius: 1000px;margin-right: 8px;"></div>
              <div>暂缓处理</div>
            </div>
            <div v-if="row.status==3" class="flex align-center">
              <div class="flex"
                   style="width: 14px;height: 14px;background-color:#6affbd;border-radius: 1000px;margin-right: 8px;"></div>
              <div>已处理</div>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="caozuo">
            <div @click="goEarlyInfo(row)" class="flex align-center hand">
              查看
            </div>
          </template>
        </Table>
      </div>
      <!--分页-->
      <div class="flex justify-end" style="margin-top: 32px;margin-right: 32px;">
        <Page @on-change="changePage" :total="earlyWarningInformationNum" :page-size="10" show-elevator/>
      </div>
    </div>
  </div>

</template>

<script>
import ScaleBox from "@/components/ScaleBox";

export default {
  name: "MonitoringRecord",
  components: {ScaleBox},
  data() {
    return {
      columns: [
        {
          title: '序号',
          key: 'id',
          sortable: true,
          // align: 'center',
          width: '150',
        },
        {
          title: '预警信息',
          key: 'warningInfo',
          sortable: true,
          // align: 'center',
          width: '480',
        },
        {
          title: '发生位置',
          key: 'streetName',
          sortable: true,
          // align: 'center',
        },
        {
          title: '预警时间',
          key: 'warningTime',
          sortable: true,
          // align: 'center',
        },
        {
          title: '处置结果',
          key: 'status',
          sortable: true,
          slot: 'status',
          // align: 'center',
        },
        {
          title: '处置时间',
          key: 'update_time',
          sortable: true,
          // align: 'center',
        },
        {
          title: '备注信息',
          key: 'comment',
          sortable: true,
          // align: 'center',
        },
        {
          title: '操作',
          key: 'caozuo',
          sortable: true,
          slot: 'caozuo',
          // align: 'center',
        },

      ],
      //预警信息列表
      earlyWarningInformation: [],
      //预警信息总数量
      earlyWarningInformationNum: 0,
      //页码
      pageIndex: 0,

      menuList: ['实时监控'],
      menuListIndex: 0,
      menuListIndexReal:0,
      ScheduledTask:null,

      //弹框
      ShowQuitPopUp:false,
      colorClose2: '#158acc',
    }
  },
  computed:{
    streetIdList:{
      get(){
        return this.$store.state.monitorPage.streetIdList
      },
      set(value){
        this.$store.commit('monitorPage/setStreetIdList',value)
      },
    },
  },
  mounted() {
    this.ScheduledTask = setInterval(() => {
      this.getEarlyWarningInformation()
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.ScheduledTask)
    this.ScheduledTask = null
  },
  methods: {
    //改变页码
    changePage(e) {
      this.pageIndex = e - 1
      this.getEarlyWarningInformation()
    },
    //展示退出监控弹框
    showQuitPopUp() {
      this.ShowQuitPopUp = true
    },
    //退出实时监控页面
    quit() {
      this.ShowQuitPopUp = false
      this.$router.go(-1)
    },
    //返回上一级
    returnMonitor() {
      // this.$router.back()
      this.$emit('return')
    },
    //点击菜单
    clickMenuList(index) {
      this.menuListIndex = index
      this.menuListIndexReal = index
      if (index == 0) {
        this.$router.go(-1)
      }
    },
    //进入菜单
    overMenuList(index) {
      this.menuListIndexReal = this.menuListIndex
      this.menuListIndex = index
    },
    //离开菜单
    outMenuList() {
      this.menuListIndex = this.menuListIndexReal
    },
    changeColorClose2() {
      this.colorClose2 = '#72a9e4'
    },
    resetColorClose2() {
      this.colorClose2 = '#158acc'
    },
    //获取预警信息列表
    getEarlyWarningInformation() {
      let _this = this
      let params = {
        "pageSize": 10,
        "startPage": this.pageIndex,
        "streetIdList": this.streetIdList,
      }
      this.$request.post('/warning/list',params).then(res => {
        _this.earlyWarningInformation = res.data.data.object
        _this.earlyWarningInformationNum = res.data.data.count
      })
    },
    //跳转到预警信息页面
    goEarlyInfo(data) {
      this.$store.commit('setEarlyInfo',data)
      // this.$router.replace('earlyWarningInformation')
      this.$emit('goEarlyWarningInformationPage')
    },

  },
}
</script>

<style scoped>


.t132 {
  background-image: url(../../public/image/daohanglan.png);
}

.class-1-1 {
  margin-left: 33px;
  font-size: 24px;
  font-weight: 600;
  color: #9EB5CD;
}

.class-1-1:hover {
  color: #b9e9fb;
  text-shadow: 0px 0px 2px #67c2c9;
}

.class-1-2 {
  width: 138px;
  height: 41px;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: normal;
  color: #9EB5CD;
}

.class-2 {
  flex: 1 0 auto;
  background-color: aquamarine;
}

.class-1-3 {
  background-image: url(../../public/image/选中状态.png);
  color: #B1CCE8;
}
</style>
