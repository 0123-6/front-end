<template>
  <!-- 主体 -->
  <div class="flex flex-1" id="test" style="overflow: auto;background-color:#0f2747;width: 1880px;">
    <div class="flex" style="position: fixed;top: 0;left: 0;width: 1920px;height: 1080px;">
      <!-- 百度地图2 -->
      <div id="baiduMap3D" @contextmenu="mapContextMenu" class="flex" style="position: fixed;left:0px;top:0px;width: 1920px;height: 1080px;z-index: 2;background-color:#1d5486;">
      </div>

      <!--遮罩3-->
      <div class="flex" style="width: 1920px;height: 1080px;pointer-events: none;z-index: 3;top: 0px;left: 0px;position: fixed;">
        <img src="/image/pic1.png" width="1920" height="1080" alt="">
      </div>
    </div>
    <!--百度地图画圈-->
    <!--百度地图插件-->
    <div v-show="drawingStatus==0" class="flex my-border-when-hover hand"
         style="position: fixed;z-index: 6;border: 1px solid #4b84c0;border-radius: 4px;width: 52px;height: 52px;background-color:#16467b;"
         :style="{left:(ShowFlag?'1280px':'1730px'),top:(ShowFlag?'700px':'900px'),}">
      <img
          data-cy="shou"
           @click="draw"
           style="z-index: 999"
           src="/image/shou.png"
           alt=""
           width="100%"
           height="100%">
    </div>
    <!-- 配置模型弹框 -->
    <dialog-mask v-if="moastShowMode!=null && moastShowMode!=''" @cancel="closeModal">
      <div class="flex flex-direction" id="myMoast"
           style="position: fixed;z-index: 4;width: 636px;height: 743px;background: linear-gradient(169deg, rgba(14,58,124,0.82), rgba(1,18,36,1));border: 1px solid #2C5C9B;border-radius: 6px"
           :style="{'left':'883px','top':'208px'}">
        <div class="flex justify-end align-center head" style="width: 100%;">
          <div @click="closeModal" @mouseover="changeColorClose1" @mouseout="resetColorClose1"
               class="flex justify-center align-center hand" style="width: 30px;height: 30px;">
            <Icon type="md-close" :color="colorClose1" size="26"/>
          </div>
        </div>
        <!-- 上 -->
        <div class="flex align-center" style="margin: 2px 30px 0px 30px;">
          <!-- 左 -->
          <div class="flex justify-center align-center" style="" :key="showMoastData.videoId">
            <video muted autoplay loop width="206" height="115">
              <source src="http://47.93.19.134:9068/data/Insight-MVT_Annotation_Test/MVI_39211/video.mp4"
                      type="video/mp4" width="206" height="115"></source>
            </video>
          </div>
          <!-- 右 -->
          <div class="flex flex-direction justify-around" style="height: 100%;margin-left: 20px;width: 350px;">
            <!-- 上 -->
            <div class="flex align-center color-white"
                 style="font-size: 18px;font-weight: 400;">
              {{ showMoastData.streetName }}
            </div>
            <!-- 下 -->
            <div class="flex align-center"
                 style="font-size: 16px;font-weight: 400;color: #9EB5CD;">
              <!-- 左 -->
              <div class="flex">
                {{ showMoastData.time }}
              </div>
              <!-- 右 -->
              <div class="flex" style="margin-left: 30px">
                <Button @click="addFollow(showMoastData)" v-show="!showMoastData.alreadyFollow" type="primary"
                        style="font-size: 16px;margin-right: 30px;height: 36px;width: 133px;border-radius: 6px;">重点关注路口
                </Button>
                <Button @click="cancelFollow(showMoastData)" v-show="showMoastData.alreadyFollow" type="primary"
                        style="font-size: 16px;margin-right: 30px;height: 36px;width: 133px;border-radius: 6px;">取消关注路口
                </Button>
              </div>
            </div>
          </div>
        </div>
        <!-- 下 -->
        <div class="flex flex-direction flex-1" style="margin: 25px 16px 0px 16px;">
          <!-- 上 -->
          <div class="flex margin-left-16" >
            <RadioGroup v-model="moastShowMode" type="button" button-style="solid">
              <Radio label="车流量信息"></Radio>
              <Radio label="人流量信息"></Radio>
              <Radio label="配置模型"></Radio>
            </RadioGroup>
          </div>
          <!-- 下 -->
          <div v-show="moastShowMode=='车流量信息'" class="flex flex-1">
            <!-- 左 -->
            <div class="flex" style="width: 286px;height: 100%;" id="carSpeedChange" key='carSpeedChange'>
            </div>
            <!-- 右 -->
            <div class="flex" style="width: 286px;height: 100%;" id="carSumChange" key='carSumChange'>
            </div>
          </div>
          <div v-show="moastShowMode=='人流量信息'" class="flex flex-1">
            <!-- 左 -->
            <div class="flex" style="width: 572px;height: 100%" id="peopleSumChange" key='peopleSumChange'>
            </div>
          </div>
          <configuration-model v-show="moastShowMode=='配置模型'" class="flex-1" :show-bar="false"
                               :street-id="showMoastData.streetId"
                               style="width: 100%;height: 100%;"
                               :key="showMoastData.videoId"
                               @selected="selectedConfigurationModel"
                               @close="closeModal"></configuration-model>
        </div>
      </div>
    </dialog-mask>
    <!-- 视频弹窗 -->
    <dialog-mask v-if="ShowVideoMoast" @cancel="closeShowVideoMoast">
      <div class="flex flex-direction align-center" id="ShowVideoMoastId"
           style="position: fixed;z-index: 4;width: 636px;background: linear-gradient(169deg, rgba(31, 92, 184, 0.32), rgba(9, 39, 72, 0.92));border: 1px solid #2C5C9B;border-radius: 6px"
           :style="{'left':'647px','top':'245px'}">
        <div class="flex justify-end align-center head" style="width: 100%;">
          <close-icon @close="closeShowVideoMoast"></close-icon>
        </div>
        <!-- 上 -->
        <div class="flex justify-center" style="margin: 2px 30px 0px 30px;width: 576px;height: 324px;">
          <video muted controls autoplay loop width="576" height="324">
            <source src="http://47.93.19.134:9068/data/Insight-MVT_Annotation_Test/MVI_39211/video.mp4"
                    type="video/mp4"></source>
          </video>
        </div>
        <!-- 下 -->
        <div class="flex justify-center align-center flex-1" style="width: 100%;margin: 15px 0 15px 0">
          <Button @click="cancelFollowOnFirstPage(followList[ShowVideoMoastIndex])" type="primary"
                  style="font-size: 16px;height: 40px;width: 140px;border-radius: 6px;">取消关注路口
          </Button>
        </div>
      </div>
    </dialog-mask>
    <!-- 左 -->
    <div v-show="drawingStatus==0" class="flex flex-direction" style="width: 499px;height: 100%;z-index: 3">
      <!-- 事件搜索 -->
      <event-search style="z-index: 4;margin-top: 11px;width: 100%;" @searchSuccess="searchSuccess" @mapClearOverlays="mapClearOverlays"></event-search>
      <!-- 搜索结果列表 -->
      <search-results-list v-show="Searched" @clickSearchItem="clickSearchItem" class="flex-1" @mapClearOverlays="mapClearOverlays"
                           style="height: 0px;z-index: 3;margin-top: 10px;"></search-results-list>
      <!-- 区域概括 -->
      <keep-alive>
        <regional-overview v-show="ShowFlag"
                           style="z-index: 3;margin-top: 8px;width: 100%;height: 180px;"></regional-overview>
      </keep-alive>

      <!-- 12345接诉即办 -->
      <keep-alive>
        <do-when-receive-lawsuit v-show="ShowFlag"
                                 style="z-index: 3;width: 499px;height: 542px;margin-top: 14px;"></do-when-receive-lawsuit>
      </keep-alive>
    </div>
    <!-- 中 -->
    <div v-show="ShowFlag && drawingStatus==0" class="flex flex-direction justify-end align-center"
         style="width: calc(100% - 998px);height: 100%;">
      <!-- 底部视频栏 -->
      <div class="flex flex-direction"
           style="z-index: 3;margin-bottom: 17px;width: 852px;height: 209px;background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
        <!-- 重点路口实时监测 -->
        <div class="flex align-center"
             style="width: 852px;height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
          <div class="flex my-class-title"
               style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
          <div class="flex"
               style="margin-left: 4px;font-size: 16px;font-weight: 500;color: #ABD2F6;">
            重点路口实时监测
          </div>
        </div>
        <!-- 视频栏 -->
        <div class="flex flex-1 justify-around align-center" style="width: 100%;">
          <!-- 左 -->
          <div @click="clickVideoAreaToLeft" class="flex hand">
            <img src="/image/right.png">
          </div>
          <!-- 中 -->
          <div id="videoArea" class="flex align-center"
               style="width: calc(100% - 58px);overflow-x: auto;overflow-y: hidden">
            <!-- 动态视频 -->
            <div v-for="(item,index) in followList" class="flex flex-direction justify-around align-center hand"
                 style="width: 25%;min-width: 25%;border: 1px solid rgba(75,132,192,0.01);">
              <div @click="showVideoMoast(index)" class="flex justify-center align-center"
                   style="width: 186px;height: 105px;">
                <video muted autoplay loop width="186.67" height="105">
                  <source src="http://47.93.19.134:9068/data/Insight-MVT_Annotation_Test/MVI_39211/video.mp4"
                          type="video/mp4"></source>
                </video>
              </div>
              <div class="text-hidden text-center"
                   :title="item.streetName.length>13?item.streetName:null"
                   style="color: #B3D1F3;margin-top: 13px;width: 186px;height: 21px;background: linear-gradient(90deg, #0A304E, #152847);box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
                {{ item.streetName }}
              </div>
            </div>
            <!-- 视频数不够，图片补齐 -->

            <div v-show="followList!==undefined && followList.length < 4" v-for="(item,index) in NoVideoNum"
                 class="flex flex-direction justify-around align-center" style="width: 25%;">
              <div class="flex justify-center align-center" style="width: 100%;height: 105px;">
                <img src="/image/noFollow.jpg" width="186.67" height="105">
              </div>
              <div class="flex justify-center align-center"
                   style="color: #B3D1F3;margin-top: 13px;width: 170px;background: linear-gradient(90deg, #0A304E, #152847);box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
                暂无视频
              </div>
            </div>
          </div>
          <!-- 右 -->
          <div @click="clickVideoAreaToRight" class="flex hand">
            <img src="/image/left.png">
          </div>
        </div>
      </div>
    </div>
    <!-- 右 -->
    <div v-show="ShowFlag && drawingStatus==0" class="flex flex-direction" style="width: 499px;height: 100%;">
      <!-- 生态环境 -->
      <keep-alive>
        <ecological-environment
            style="z-index: 3;margin-top: 14px;width: 499px;height: 499px;"></ecological-environment>
      </keep-alive>

      <!-- 交通出行 -->
      <keep-alive>
        <transportation-travel
            style="z-index: 3;margin-top: 21px;width: 499px;height: 170px;"></transportation-travel>
      </keep-alive>

      <!-- 城市管理 -->
      <keep-alive>
        <city-management style="z-index: 3;margin-top: 10px;width: 498px;height: 261px;"></city-management>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import * as mapJson from '../../../public/custom_map_config.json'

import carSpeedChangeConfig from '@/js/echarts/carSpeedChange'
import carSumChangeConfig from '@/js/echarts/carSumChange'
import peopleSumChangeConfig from '@/js/echarts/peopleSumChange'
import DialogMask from "@/components/DialogMask";

export default {
  name: 'CityOverview',
  components: {
    DialogMask,
    ScaleBox:()=>import("@/components/ScaleBox"),
    RegionalOverview:()=>import("@/views/cityOverview/RegionalOverview"),
    TransportationTravel:()=>import("@/views/cityOverview/TransportationTravel"),
    DoWhenReceiveLawsuit:()=>import("@/views/cityOverview/DoWhenReceiveLawsuit"),
    EcologicalEnvironment:()=>import("@/views/cityOverview/EcologicalEnvironment"),
    CityManagement:()=>import("@/views/cityOverview/CityManagement"),
    EventSearch:()=>import("@/views/cityOverview/EventSearch"),
    SearchResultsList:()=>import("@/views/cityOverview/SearchResultsList"),
    ConfigurationModel:()=>import("@/components/ConfigurationModel"),
    CloseIcon:()=>import('@/components/CloseIcon'),
  },
  data() {
    return {
      colorClose1: '#158acc',
      followList: [],//关注列表
      ShowVideoMoast: false,//控制视频弹窗的展示
      ShowVideoMoastIndex: -1,//展示哪一个
      phone: 'apple',
      ak: "Aa1fulopZQjKejNyt7c6zxyjpFisi0HF", // 百度的地图密钥
      BMapGL: null,
      map: null,
      NoVideoNum: 0,//4 - 首页视频
      mapPointSet: null,//红色点
      // 自定义样式
      mapStyle: {
        styleJson: mapJson,
      },
      drawingManager:null,//鼠标绘制工具
    }
  },
  watch: {
    moastShowMode(newVal, oldVal) {
      setTimeout(() => {
        if (newVal == '车流量信息') {
          var carSpeedChange = this.$echarts.init(document.getElementById('carSpeedChange'));
          carSpeedChange.setOption(carSpeedChangeConfig);
          var carSumChange = this.$echarts.init(document.getElementById('carSumChange'));
          carSumChange.setOption(carSumChangeConfig);
        } else if (newVal == '人流量信息') {
          var peopleSumChange = this.$echarts.init(document.getElementById('peopleSumChange'));
          peopleSumChange.setOption(peopleSumChangeConfig);
        }
      }, 1)
    },
    needInit(newVal,oldVal){
      if(newVal){
        this.init()
        this.needInit = false
      }
    },
    // Searched(newVal,oldVal){
    //   if(newVal==false){
    //     this.init()
    //   }
    // },
  },
  computed: {
    ShowFlag() {
      return this.$store.state.indexPage.searchMode == 's0' && !this.$store.state.indexPage.searched
    },
    Searched() {
      return this.$store.state.indexPage.searched
    },
    moastShowMode: {
      get() {
        return this.$store.state.indexPage.moastShowMode
      },
      set(value) {
        this.$store.commit('indexPage/setMoastShowMode', value)
      },
    },
    showMoastData: {
      get() {
        return this.$store.state.indexPage.showMoastData
      },
    },
    drawingStatus:{
      get(){
        return this.$store.state.indexPage.drawingStatus
      },
      set(value){
        this.$store.commit('indexPage/setDrawingStatus',value)
      },
    },
    needInit:{
      get(){
        return this.$store.state.indexPage.needInit
      },
      set(value){
        this.$store.commit('indexPage/setNeedInit',value)
      },
    },
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    //百度地图上，右键事件
    mapContextMenu(){
      //如果是绘制中状态的话
      if(this.drawingStatus == 1){
        this.drawingStatus = 0
        this.draw()
      }
    },
    //初始化画圈工具
    initDrawing(){
      let _this = this
      var styleOptions = {
        strokeColor: '#2565db',   // 边线颜色
        fillColor: '#5E87DB',     // 填充颜色。当参数为空时，圆形没有填充颜色
        strokeWeight: 1,          // 边线宽度，以像素为单位
        strokeOpacity: 1,         // 边线透明度，取值范围0-1
        fillOpacity: 0.2          // 填充透明度，取值范围0-1
      };
      var labelOptions = {
        borderRadius: '2px',
        background: '#FFFBCC',
        border: '1px solid #E1E1E1',
        color: '#703A04',
        fontSize: '12px',
        letterSpacing: '0',
        padding: '5px'
      };
      // 实例化鼠标绘制工具
      this.drawingManager = new BMapGLLib.DrawingManager(_this.map, {
        // isOpen: true,        // 是否开启绘制模式
        enableCalculate: false, // 绘制是否进行测距测面
        enableSorption: true,   // 是否开启边界吸附功能
        sorptiondistance: 20,   // 边界吸附距离
        circleOptions: styleOptions,     // 圆的样式
        polylineOptions: styleOptions,   // 线的样式
        polygonOptions: styleOptions,    // 多边形的样式
        rectangleOptions: styleOptions,  // 矩形的样式
        labelOptions: labelOptions,      // label样式
      });
      this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
    },
    draw() {
      //未绘制，则进行绘制
      if(!this.drawingManager._isOpen){
        this.drawingManager.open();
        this.drawingStatus = 1
      }else {
        this.drawingManager.close();
        this.drawingStatus = 0
      }
    },

    changeColorClose1() {
      this.colorClose1 = '#72a9e4'
    },
    resetColorClose1() {
      this.colorClose1 = '#158acc'
    },

    //设置百度地图中心点
    setMapCenterPoint(point) {
      // 初始化地图，设置中心点坐标和地图级别
      this.map.centerAndZoom(point, 19)
      this.map.setHeading(64.5)
      this.map.setTilt(73)
    },

    clickVideoAreaToLeft() {
      document.getElementById('videoArea').scrollLeft -= 200
    },
    clickVideoAreaToRight() {
      document.getElementById('videoArea').scrollLeft += 200
    },
    //
    showVideoMoast(index) {
      this.ShowVideoMoastIndex = index
      this.ShowVideoMoast = true
    },
    closeModal() {
      this.moastShowMode = null
      this.resetColorClose1()
    },
    init() {
      // 加载地图
      if(!this.BMapGL){
        this.initMap()
        this.initDrawing()
      }
      this.$store.commit('init')
      this.$store.commit('indexPage/init')
      this.$store.commit('monitorPage/setStreets',[])
      if(this.map){
        this.map.clearOverlays()
      }
      this.getFollowList()
    },
    mapClearOverlays(){
      if(this.map){
        this.map.clearOverlays()
      }
    },
    getFollowList() {
      this.followList = []
      let _this = this
      this.$request.get('/tianjin-aictiy-demo/follow/list').then(res => {
        _this.followList = res.data.data
        _this.NoVideoNum = 4 - _this.followList.length
        if (_this.NoVideoNum < 0) {
          _this.NoVideoNum = 0
        }
      })
    },
    clickSearchItem() {
      let item = this.$store.state.indexPage.showMoastData
      let point = new this.BMapGL.Point(item.streetLon, item.streetLat)
      this.setMapCenterPoint(point)
    },
    // 关注
    addFollow(camera) {
      let _this = this
      this.$request.post('/tianjin-aictiy-demo/follow',camera).then(res => {
        if (res.data.data == '关注成功') {
          camera.alreadyFollow = true
          _this.$Message['success']({
            background: true,
            content: '关注成功!',
          });
          _this.getFollowList()
        } else {
          _this.$Message['error']({
            background: true,
            content: '关注失败!',
          });
        }
      })
    },
    //取消关注
    cancelFollow(camera) {
      let _this = this
      this.$request.get('/tianjin-aictiy-demo/unfollow/' + camera.videoId).then(res => {
        if (res.data.data == '取消关注成功') {
          camera.alreadyFollow = false
          // 取消关注成功!
          _this.$Message['success']({
            background: true,
            content: '取消关注成功!',
          });
          _this.getFollowList()
        } else {
          //取消关注失败!
          _this.$Message['error']({
            background: true,
            content: '取消关注失败!',
          });
        }
      })
    },

    cancelFollowOnFirstPage(camera) {
      let _this = this
      this.$request.get('/tianjin-aictiy-demo/unfollow/' + camera.videoId).then(res => {
        if (res.data.data == '取消关注成功') {
          camera.alreadyFollow = false
          _this.$Message['success']({
            background: true,
            content: '取消关注成功!',
          });
        } else {
          _this.$Message['error']({
            background: true,
            content: '取消关注失败!',
          });
        }
        _this.ShowVideoMoast = false
        _this.ShowVideoMoastIndex = -1
        _this.getFollowList()
      })
    },
    //配置模型
    selectedConfigurationModel(modelList) {
      let params = []
      for (let i = 0; i < modelList.length; i++) {
        let param = {
          isUnion: modelList[i].union == true ? 1 : 0,
          modelId: modelList[i].id,
          streetId: this.showMoastData.streetId
        }
        params.push(param)
      }
      let _this = this
      this.$request.post('/model/street/union/model',params).then(res => {
        if (res.data.result) {
          _this.$Message['success']({
            background: true,
            content: '配置模型成功!',
          });
        } else {
          _this.$Message['error']({
            background: true,
            content: '配置模型失败!',
          });
        }
      })
    },

    // 关闭视频弹窗
    closeShowVideoMoast() {
      this.ShowVideoMoast = false
      this.ShowVideoMoastIndex = -1
    },


    clickSearch() {
      if (this.searchMode == 's0') {
        this.searchMode = 's2'//复杂搜索
        setTimeout(() => {
          this.$refs["my-input-1"].focus({
            preventScroll: true
          });
        }, 0.001);
      }

    },

    addMapPoint(newPoint, data) {
      let myIcon = new this.BMapGL.Icon("/image/point.png", new BMapGL.Size(34, 44));
      // 创建点标记
      let point = new BMapGL.Point(newPoint.lng, newPoint.lat)
      let marker = new BMapGL.Marker(point, {
        icon: myIcon
      });
      // 在地图上添加点标记
      this.map.addOverlay(marker);
      let opts = {
        position: new BMapGL.Point(newPoint.lng, newPoint.lat), // 指定文本标注所在的地理位置
        offset: new BMapGL.Size(-110, 27) // 设置文本偏移量
      };
      // 创建文本标注对象
      let label = new BMapGL.Label(data.streetName, opts);
      // 自定义文本标注样式
      label.setStyle({
        color: '#9eb5cd',
        fontWeight: '500',
        width: 'auto',
        minWidth:'242px',
        background: 'linear-gradient(90deg, rgba(51, 128, 187, 0.9), rgba(21, 40, 71,0.9))',
        borderRadius: '5px',
        borderBottom: '1px solid rgba(143,195,236,0.74)',
        borderTop: '0',
        borderLeft: '0',
        borderRight: '0',
        fontSize: '16px',
        height: '37px',
        lineHeight: '37px',
        textAlign: 'center',
      });
      this.map.addOverlay(label);
      // 点标记添加点击事件
      let _this = this
      marker.addEventListener('click', function (e) {
        _this.moastShowMode = '车流量信息'
        _this.$store.commit('indexPage/setShowMoastData', data)
      });
    },

    initMap() {
      this.drawingStatus = false
      let _this = this
      _this.BMapGL = BMapGL
      // 创建地图实例
      let map = new BMapGL.Map("baiduMap3D");
      //开启鼠标滚轮缩放
      map.enableScrollWheelZoom(true)
      map.setMapStyleV2({styleJson: mapJson});
      map.setDisplayOptions({
        street: true,     //是否显示路网（只对卫星图和地球模式有效）
      })
      map.setDisplayOptions({
        skyColors: ['rgba(2,33,67,0.01)', 'rgba(71,128,190,0.8)']
      })
      _this.map = map
      // 创建点坐标 axios => res ,streetLat: 39.145874
      // streetLon: 117.77722
      let point = new BMapGL.Point(117.749335, 39.131169)

      // 初始化地图，设置中心点坐标和地图级别
      //待
      _this.setMapCenterPoint(point)

      // 处理百度地图未放在标准文档流中，会出现放大或缩小后,中心点偏移(中心点不是在放大前的点)
      // 临时存储地图中心点经度和纬度
      let center_lng = 0;
      let center_lat = 0;
      let zoom_type = null;
      // 监听地图缩放开始事件 lng表示经度，lat表示纬度
      // map.addEventListener("zoomstart", function (e) {
      //   center_lng = map.getCenter().lng;
      //   center_lat = map.getCenter().lat;
      //   zoom_type = "zoomstart"
      // });
      // 监听地图缩放结束事件 lng表示经度，lat表示纬度
      // map.addEventListener("zoomend", function (e) {
      //   // 做这个判断是因为centerAndZoom的center为字符串时会触发zoomend事件但又不触发zoomstart，导致会定位到0，0位置。
      //   if (zoom_type === "zoomstart") {
      //     map.centerAndZoom(
      //         new BMapGL.Point(center_lng, center_lat),
      //         map.getZoom()
      //     );
      //     zoom_type = "zoomend";
      //   }
      // });
    },
    searchSuccess(res) {
      this.searchResult = this.$store.state.indexPage.searchResult
      this.mapPointSet = new Set()
      if (this.searchResult !== undefined) {
        for (let i = 0; i < this.searchResult.length; i++) {
          let newPoint1 = {
            lng: this.searchResult[i].streetLon,
            lat: this.searchResult[i].streetLat,
          }
          let json = JSON.stringify(newPoint1)
          if(!this.mapPointSet.has(json)){
            this.mapPointSet.add(json)
            this.addMapPoint(newPoint1, this.searchResult[i])
          }
        }
      }
    },
  },
}
</script>

<style scoped>
/*百度地图插件*/
.info {
  z-index: 999;
  width: auto;
  min-width: 22rem;
  padding: .75rem 1.25rem;
  margin-left: 1.25rem;
  position: fixed;
  top: 1rem;
  background-color: #fff;
  border-radius: .25rem;
  font-size: 14px;
  color: #666;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
</style>
