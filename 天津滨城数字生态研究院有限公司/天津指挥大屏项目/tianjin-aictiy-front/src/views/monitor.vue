<template>

  <!--最外层-->
  <div class="flex flex-direction bgc-image-1"
       style="width: 1920px;min-height: 1080px;height: auto;padding-left: 20px;padding-right: 20px;padding-bottom: 24px;">

    <!-- 视频弹窗 -->
    <dialog-mask v-if="ShowVideoMoast" @cancel="closeShowVideoMoast">
      <div class="flex flex-direction align-center" id="ShowVideoMoastId"
           style="position: absolute;z-index: 4;width: 636px;background: linear-gradient(169deg, rgba(31, 92, 184, 0.32), rgba(9, 39, 72, 0.92));border: 1px solid #2C5C9B;border-radius: 6px"
           :style="{ 'left': '647px', 'top': '245px' }">
        <div class="flex justify-end align-center head" style="width: 100%;">
          <div @click="closeShowVideoMoast" @mouseover="changeColorClose2" @mouseout="resetColorClose2"
               class="flex justify-center align-center hand" style="width: 30px;height: 30px;">
            <Icon type="md-close" :color="colorClose2" size="26"/>
          </div>
        </div>
        <!-- 上 -->
        <div class="flex justify-center" style="margin: 2px 30px 32px 30px;width: 576px;height: 324px;">
          <video muted autoplay loop width="576" height="324">
            <source src="http://47.93.19.134:9068/data/Insight-MVT_Annotation_Test/MVI_39211/video.mp4" type="video/mp4">
            </source>
            <!--                    <source :src="VideoMoastUrl" type="video/mp4"></source>-->
          </video>
        </div>
      </div>
    </dialog-mask>

    <!--添加监控位置弹窗-->
    <dialog-mask v-if="ShowAddPopUp" @cancel="closeShowAddPopUp">
      <div class="flex flex-direction align-center padding-left-16 padding-right-16"
           style="position: absolute;z-index: 4;width: 660px;height: 517px;background: linear-gradient(169deg, rgba(15, 51, 101, 0.9), rgba(9, 39, 72, 0.9));border: 1px solid #2C5C9B;border-radius: 6px"
           :style="{'left':'647px','top':'245px'}">
        <!--上-->
        <div class="flex justify-between align-center head" style="width:100%;height: 40px;border-bottom: 1px solid #1d5486">
          <div class="flex">
            监控位置
          </div>
          <div @click="closeShowAddPopUp" @mouseover="changeColorClose3" @mouseout="resetColorClose3"
               class="flex justify-center align-center hand" style="width: 30px;height: 30px;">
            <Icon type="md-close" :color="colorClose3" size="26"/>
          </div>
        </div>
        <!--搜索框-->
        <div class="flex" style="margin-top: 11px;align-self: flex-start">
          <Input v-model="searchStreetName" search @on-search="searchStreetByName" enter-button="搜索"
                 placeholder="请输入位置信息"/>
        </div>
        <!--搜索结果列表-->
        <div class="flex flex-direction" style="overflow-y: auto;height: 410px;margin-top: 11px;border-radius: 6px;">
          <!--搜索结果列表-->
          <div class="flex align-center my-border-when-hover-monitor justify-between bgc-main-color-2"
               v-for="(item, index) in searchResults"
               :key="index"
               style="border-bottom: 1px solid #183d6c;width: 620px;min-height: 66px;">
            <!--左-->
            <div class="flex"
                 style="margin-left: 24px;width: 466px;">
              {{ item.streetName }}
            </div>
            <!--右-->
            <div class="flex" style="margin-right: 16px">
              <div>
                <Button v-if="!isAlreadyInStreets(item.streetId)" type="primary" :disabled="labeling"
                        style="margin-right: 16px;height: 32px;width: 88px;" @click="addIntersection(item)">添加监控
                </Button>
                <Button v-else style="margin-right: 16px;height: 32px;width: 88px;" :disabled="true">已监控</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog-mask>


    <!--退出确认对话框-->
    <dialog-mask v-if="ShowQuitPopUp" @cancel="ShowQuitPopUp = false">
      <div class="flex flex-direction align-center"
           style="position: absolute;z-index: 5;width: 517px;height: 308px;background: linear-gradient(169deg, rgba(15, 51, 101, 0.9), rgba(9, 39, 72, 0.9));border: 1px solid #2C5C9B;border-radius: 6px"
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
    </dialog-mask>

    <!--配置模型弹窗-->
    <dialog-mask v-if="ShowConfigurationModel" @cancel="closeConfigurationModel">
      <configuration-model :show-bar="true" :selected-model-list="SelectedModelList"
                           style="left:647px;top:245px;position: absolute;z-index: 4;width: 660px;height: 570px;"
                           :is-monitor="false"
                           @close='closeConfigurationModel'
                           @selected="selectedConfigurationModel">
      </configuration-model>
    </dialog-mask>
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
    <!--选项层-->
    <div class="flex justify-between align-center" style="margin-top: 16px">
      <!--左-->
      <div class="flex align-center">
        <Button @click="showConfigurationModel" type="primary" icon="md-cube" :disabled="labeling"
                style="margin-right: 30px;height: 36px;width: 133px;">+配置模型
        </Button>
        <Button @click="showAddPopUp" type="primary" icon="md-videocam" :disabled="labeling"
                style="margin-right: 30px;height: 36px;width: 133px;">+监控位置
        </Button>
      </div>
      <!--右-->
      <div v-if="false" class="flex" style="margin-right: 8px">
        <div v-if="streets != undefined && streets != null && streets.length > 0">
          {{ streets[0].streetName }}周围5公里监控
        </div>
        <div v-else>
          中天大道与中生大道周围5公里监控
        </div>
      </div>
    </div>
    <!--用户操作层-->
    <div class="flex align-center justify-between bgc-main-color"
         style="min-height: 80px; border: 1px solid #173e65;margin-top: 8px">
      <!--左-->
      <div class="flex flex-direction justify-around" style="height: 100%;padding: 16px 0px 16px 16px">
        <div class="flex flex-wrap" style="width: 1200px;">
          <div class="flex align-center margin-bottom-16"
               style="width: 300px;min-width: 300px;max-width: 300px;"
               v-for="(item,index) in modelTypeList.slice(0,16)"
               v-if="showMoreThan16?true:index<16"
               :key="index">
            <div>
              <Checkbox v-model="item.modelChecked" :disabled="labeling" :label="item.id" @on-change="handleModelChecked($event,item)" >
                <span class="text-hidden" :title="item.modelNameCh.length>15?item.id + ' ' + item.modelNameCh:null">{{ item.id + ' ' + item.modelNameCh }}</span>
              </Checkbox>
            </div>
            <Poptip
                :disabled="labeling"
                confirm
                popper-class="labelWrapper"
                transfer-class-name="labelWrapper"
                width="210"
                placement="bottom"
                word-wrap transfer
            >
              <Icon color="#b2c7e4" class="hand" type="ios-funnel" v-if="Object.keys(item.labelMappingObject).length>1"/>
              <template #title>
                <CheckboxGroup :disabled="labeling" v-model="item.labelChecked" @on-change="setStatus($event,index)">
                  <Checkbox v-for="(label, key) of item.labelMappingObject" :key="key" :label="label" style="width: 150px">
                    <span class="text-hidden" :title="label.length>18?label:null">{{ label }}</span>
                  </Checkbox>
                </CheckboxGroup>
              </template>
            </Poptip>
          </div>
          <Button v-if="modelTypeList.length > 16" :icon="showMoreThan16?'ios-arrow-up':'ios-arrow-down'" type="text"
                  @click="showMoreThan16 = !showMoreThan16"></Button>
        </div>
      </div>
      <!--右-->
      <div class="flex" style="margin-right: 80px">
        <Button v-if="!labeling" @click="mark(true)" type="primary"
                style="margin-right: 30px;height: 36px;width: 133px;">开始标注
        </Button>
        <Button v-else @click="closeMark" type="primary" style="margin-right: 30px;height: 36px;width: 133px;">关闭标注
        </Button>
      </div>
    </div>
    <input type="hidden" name="videoUrl" id="videoUrl" :value="m3u8"/>
    <!--页面主体-->
    <div class="flex justify-between" style="margin-top: 16px;height: 730px">
      <!--左-->
      <div class="flex bgc-main-color" style="width: 1490px;height: 100%;overflow-y: auto">
        <!--一排-->
        <div class="flex flex-wrap align-center" style="width: 1470px;height: 242px;padding-top: 24px;">
          <!--一个-->
          <div class="flex flex-direction align-center" v-for="(item, index) in streets" :key="item.streetId"
               style="margin-left: 22px;margin-bottom: 24px">
            <div style="width: 270px;height: 152px;">
              <HlsVideo :src="item.videoUrl" :poster="item.imageUrl"></HlsVideo>
            </div>
            <!--下方文字-->
            <div class="flex align-center"
                 style="color: #B3D1F3;margin-top: 8px;width: 270px;height: 32px;background: linear-gradient(90deg, #0A304E, #152847);box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
              <div class="flex justify-center align-center" style="width: 230px;height: 100%;">
                <div class="text-hidden text-center"
                     :title="item.streetName.length>16?item.streetName:null"
                     style="width: 230px;">
                  {{ item.streetName }}
                </div>
              </div>
              <div class="flex justify-center align-center"
                   style="width: 30px;height: 100%"
                   :class="[labeling?'cursor-not-allowed':'hand']">
                <div style="width: 100%;height: 100%;"
                     class="flex justify-center align-center"
                     :class="[labeling?'pointer-events-none':'']"
                     @click="decStreet(item.streetId)">
                  <Icon type="md-trash" size="26"/>
                </div>
              </div>
            </div>
          </div>
          <!--加号-->
          <div v-if="streets.length < 15"  class="flex justify-center align-center" :class="[labeling?'cursor-not-allowed':'hand']"
               style="margin-left: 22px;margin-bottom: 24px">
            <div :class="[labeling?'pointer-events-none':'']" style="width: 272px;" @click="showAddPopUp">
              <div class="flex justify-center align-center" style="width: 100%;height: 152px;" :style="[{'background-color':labeling?'#1d344d':'#0d335d'}]">
                <Icon type="md-add" size="48" color="#1e4672"/>
              </div>
              <!--下方文字-->
              <div class="flex justify-center align-center"
                   style="color: #B3D1F3;margin-top: 8px;width: 100%;height: 32px;background: linear-gradient(90deg, #0A304E, #152847);box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
                添加
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--右-->
      <div class="flex flex-direction bgc-main-color" style="width: 360px;height: 100%;">
        <!--标题-->
        <div class="flex align-center"
             style="height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
          <div class="flex my-class-title" style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;">
          </div>
          <div class="flex" style="margin-left: 4px;font-size: 16px;font-weight: 500;color: #9eb5cd;">
            预警信息({{ earlyWarningInformationNum }}条)
          </div>
        </div>
        <!--内容-->
        <div class="flex flex-direction flex-1" style="overflow:auto;height: 630px;">
          <div v-for="(item, index) in earlyWarningInformation" :key="index"
               class="flex flex-direction"
               style="min-height: 110px;border: 1px solid rgba(75,132,192,0.1);border-bottom: 1px solid #0F366D;">
            <!--上-->
            <div class="flex text-color" style="width: 100%;padding: 16px 0 0 16px">
              {{ item.warningInfo }}
            </div>
            <!--下-->
            <div class="flex justify-end" style="margin-top: 26px;margin-right: 16px">
              <div class="flex hand" @click="goFind(item)" style="color: #79b5f9; margin-bottom: 5px">
                去追踪&gt;
              </div>
            </div>
          </div>
        </div>
        <!--更多信息-->
        <div v-if="labeling && earlyWarningInformationNum>6" class="flex justify-end align-center" style="width: 100%;min-height: 50px;height: 50px">
          <div @click="goMonitoringRecord" class="flex hand text-color justify-center align-center"
               style="margin: 16px 16px 16px 0px">
            更多预警信息
          </div>

        </div>
      </div>

    </div>

  </div>


</template>

<script>

import ScaleBox from "@/components/ScaleBox";
import ConfigurationModel from "@/components/ConfigurationModel";
import HlsVideo from "@/components/HlsVideo";
import DialogMask from "@/components/DialogMask";

export default {
  name: "monitor",
  components: {
    ScaleBox,
    ConfigurationModel,
    HlsVideo,
    DialogMask
  },
  data() {
    return {
      m3u8: 'http://220.161.87.62:8800/hls/0/index.m3u8',
      //搜索框的路口名称
      searchStreetName: '',
      menuList: ['实时监控'],
      menuListIndex: 0,
      menuListIndexReal: 0,
      SelectedModelList: [],
      selectedColors: [],
      selectedCars: [],
      selectedEleCars: [],
      selectedZhaCars: [],
      //控制视频展示
      ShowVideoMoast: false,
      VideoMoastUrl: '',
      colorClose2: '#158acc',
      colorClose3: '#158acc',
      ShowAddPopUp: false,
      ShowQuitPopUp: false,
      //添加监控位置的搜索结果列表
      searchResults: [],
      //配置模型
      ShowConfigurationModel: false,
      ScheduledTask: null,
      labelMap: false,
      labelVisible: false,
      selectedModel: [],
      selectedLabel: [],
      showMoreThan16: true,
      ModelConfig: [],
      labeling: false,//标注中
    }
  },
  computed: {
    streets: {
      get() {
        return this.$store.state.monitorPage.streets
      },
      set(value) {
        this.$store.commit('monitorPage/setStreets', value)
      },
    },
    modelTypeList:{
      get(){
        return this.$store.state.monitorPage.modelTypeList
      },
      set(value){
        this.$store.commit('monitorPage/setModelTypeList',value)
      },
    },
    earlyWarningInformation: {
      get() {
        return this.$store.state.monitorPage.earlyWarningInformation
      },
      set(value) {
        this.$store.commit('monitorPage/setEarlyWarningInformation', value)
      },
    },
    earlyWarningInformationNum: {
      get() {
        return this.$store.state.monitorPage.earlyWarningInformationNum
      },
      set(value) {
        this.$store.commit('monitorPage/setEarlyWarningInformationNum', value)
      },
    },
  },
  watch: {
    streets: {
      deep: true,
      handler(newVal, oldVal) {
        let _this = this
        this.$store.commit('monitorPage/setStreets', newVal)
        this.$store.commit('monitorPage/setOldStreetsLength', newVal.length)
      },
    },
    earlyWarningInformation: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('monitorPage/setEarlyWarningInformation', newVal)
      },
    },
    earlyWarningInformationNum: {
      handler(newVal, oldVal) {
        this.$store.commit('monitorPage/setEarlyWarningInformationNum', newVal)
      }
    },
  },
  created() {
    //从首页画圈进来
    if (window.myCircle != undefined && window.myCircle != null) {
      this.streets = []
      this.modelTypeList = []
      this.earlyWarningInformation = []
      this.earlyWarningInformationNum = 0
      this.$store.commit('setMyCircle', window.myCircle)
      window.myCircle = undefined
      //获取路口实时视频流信息
      this.getStreets()
    }else{//从页面里面退回到这个页面，需要读取vuex中的缓存

    }
  },
  beforeDestroy() {
    this.mark(false,false)
    clearInterval(this.ScheduledTask)
    this.ScheduledTask = null
  },
  methods: {
    ok() {
      console.log(this.selectedModel, this.modelTypeList, 'sdsadas')
    },
    cancel() {
    },
    //点击里面的，来设置外面的状态
    setStatus(selectedItemList,index){
      console.log(selectedItemList)
      if(selectedItemList.length>0){//不为0，选中外面的
        this.modelTypeList[index].modelChecked = true
      }else {//为0，取消外面的
        this.modelTypeList[index].modelChecked = false
      }
    },
    handleModelChecked(isChecked, val){
      console.log(isChecked, val, 'dasdasdas')
      // 数据不实时更新，
      this.modelTypeList.forEach(item => {
        if(item.id === val.id){
          if (!isChecked){
            this.$set(item,'labelChecked',[])
          } else {
            for (const label in item.labelMappingObject) {
              item.labelChecked.push(item.labelMappingObject[label])
            }
          }
        }
      })
      console.log(this.modelTypeList, 'item')
    },
    //删除路口
    decStreet(id) {
      let index = -1
      for (let i = 0; i < this.streets.length; i++) {
        if (this.streets[i].streetId == id) {
          index = i
          break
        }
      }
      if (index != -1) {
        this.streets.splice(index, 1)
      }
    },
    closeConfigurationModel() {
      this.ShowConfigurationModel = false
    },
    //配置模型ok事件
    selectedConfigurationModel(modelList) {
      for (let i = 0; i < modelList.length; i++) {
        let item = modelList[i]
        if (item.union) {//配置
          if (this.SelectedModelList.indexOf(item.id) == -1) {
            this.SelectedModelList.push(item.id)
            this.$set(item,'modelChecked',false)
            this.$set(item,'labelChecked',[])
            this.modelTypeList.push(item)
          }
        } else {//取消配置,存在则取消
          let index = this.SelectedModelList.indexOf(item.id)
          if (index != -1) {
            this.SelectedModelList.splice(index, 1)
            let index2 = -1
            for (let j = 0; j < this.modelTypeList.length; j++) {
              if (this.modelTypeList[j].id == item.id) {
                index2 = j
                break
              }
            }
            this.modelTypeList.splice(index2, 1)
          }
        }
      }
      // if(this.SelectedModelList.length>1){
      //   this.$Message['warning']({
      //     background: true,
      //     content: '由于资源压力较大，建议您选择一个模型',
      //   })
      // }
      console.log(this.modelTypeList, 'this.SelectedModelList')
      this.ShowConfigurationModel = false
    },
    jump(url) {
      this.m3u8 = url
      window.open("player/hls-stream.html", "_blank", 'height=360, width=680, top=200, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
    },
    isAlreadyInStreets(id) {
      for (let i = 0; i < this.streets.length; i++) {
        if (this.streets[i].streetId == id) {
          return true
        }
      }
      return false
    },
    //生成标注params
    createMarkParams() {
      const _this = this;
      const params = {
        street_ids: [],
        config: []
      }
      this.streets.forEach(item => {
        params.street_ids.push(item.streetId)
      })
      this.modelTypeList.forEach(item => {
        if (item.modelChecked) {
          const configItem = {
            model_id: item.id,
            pre_mode_id: '',
            label: [],
            label_mapping: item.labelMapping
          }
          if (item.labelChecked.length === 0) {
            for (const itemElement in item.labelMappingObject) {
              configItem.label.push(itemElement)
            }
          } else {
            item.labelChecked.forEach(ele => {
              if (typeof ele === 'string') {
                for (const i in item.labelMappingObject) {
                  if (item.labelMappingObject[i] === ele) {
                    configItem.label.push(i)
                  }
                }
              }
            })
          }
          params.config.push(configItem);
        }
      })
      console.log(params)
      return params
    },
    //开始标注,flag为true代表开始标注，flag为false代表关闭标注
    mark(flag,showDialog=true) {
      let _this = this
      let params = null
      if (flag) {
        params = this.createMarkParams()

        if (params.street_ids.length == 0) {//路口为空
          this.$Message['warning']({
            background: true,
            content: '请添加监控位置',
          })
          return
        } else if (params.config.length == 0) {//模型未空
          this.$Message['warning']({
            background: true,
            content: '请选择配置模型',
          })
          return
        }
      } else {
        params = {
          street_ids: [],
          config: []
        }
      }
      this.$axios({
        method: 'post',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        url: 'http://47.93.19.134:8608/setModel',
        data: params,
      }).then(res => {
        if (flag) {//开始标注
          if (res.data.is_ok) {
            _this.$Message['success']({
              background: true,
              content: '标注成功!',
            });
            _this.labeling = true
            //点击开始标注，清空预警信息
            _this.earlyWarningInformation = []
            _this.earlyWarningInformationNum = 0
            // 开始标注之后调用
            _this.ScheduledTask = setInterval(() => {
              _this.getEarlyWarningInformation()
            }, 10000);
          } else {
            _this.$Message['error']({
              background: true,
              content: '标注失败!',
            });
          }
        } else {//关闭标注
          if (res.data.is_ok) {
            //点击页面关闭标注，不清空预警信息
            if(showDialog){
              _this.$Message['success']({
                background: true,
                content: '关闭标注成功!',
              });
            }else {//退出实时监控页面，清空预警信息
              _this.earlyWarningInformation = []
              _this.earlyWarningInformationNum = 0
            }
            // 关闭标注之后调用
            clearInterval(_this.ScheduledTask)
            _this.ScheduledTask = null
            _this.labeling = false
          } else {
            if(showDialog){
              _this.$Message['error']({
                background: true,
                content: '关闭标注失败!',
              });
            }
          }
        }

      }).catch(res => {
        _this.$Message['error']({
          background: true,
          content: '网络请求错误!',
        });
      })
    },
    //关闭标注
    closeMark() {
      this.mark(false)
      this.labeling = false
      clearInterval(this.ScheduledTask)
      this.ScheduledTask = null
    },
    //根据圆的经纬度和半径获取路口信息
    getStreets() {
      let _this = this
      let myCircle = this.$store.state.myCircle
      let params = {
        circleLat: myCircle.lat,
        circleLon: myCircle.lng,
        radius: myCircle.radius,
      }
      this.$request.post('/street/inDistanceList', params).then(res => {
        //获取实时视频流信息
        // data.data[0].streetId
        for (let item of res.data.data) {
          // 获取监控信息
          _this.getVideoDetail(item.streetId, (res) => {
            Object.assign(item, res.data)
            _this.streets.push(item)
          })
        }
      })
    },
    //点击去追踪的点击事件
    goFind(item) {
      this.$store.commit('setEarlyInfo', item)
      // this.$router.push('earlyWarningInformation')
      this.$emit('goEarlyWarningInformationPage')
    },
    //获取实时视频流信息
    getVideoList() {
      let _this = this
      for (let i = 0; i < this.streets.length; i++) {
        var FormData = require('form-data');
        var params = new FormData();
        params.append('street_id', _this.streets[i].streetId);
        this.$request.post('http://47.93.19.134:8608/getStreet', params).then(res => {
          let data = res.data
          for (let i = 0; i < _this.streets.length; i++) {
            if (data.streetId == _this.streets[i].streetId) {
              Object.assign(_this.streets[i], data)
            }
          }
        })
      }
    },
    //获取实时视频流信息通过id
    // getVideoListByStreetId() {
    //   let _this = this
    //   var FormData = require('form-data');
    //   var params = new FormData();
    //   params.append('street_id', _this.streets[_this.streets.length-1].streetId);
    //   this.$axios({
    //     method: 'post',
    //     url: 'http://47.93.19.134:8608/getStreet',
    //     data: params,
    //   }).then(res => {
    //     let data = res.data
    //     for (let i = 0; i < _this.streets.length; i++) {
    //       if (data.streetId == _this.streets[i].streetId) {
    //         Object.assign(_this.streets[_this.streets.length-1], data)
    //       }
    //     }
    //   }).catch(res => {
    //     alert('网络请求错误！')
    //     console.error(res)
    //   })
    //
    // },


    //点击更多预警信息
    goMonitoringRecord() {
      // this.$router.push('monitoringRecord')
      this.$emit('goMonitoringRecordPage')
    },
    //根据路口名称搜索路口
    searchStreetByName() {
      let _this = this
      let params = {
        pageSize: 100,
        startPage: 0,
        streetName: _this.searchStreetName,
      }
      this.$request.post('/street/list', params).then(res => {
        _this.searchResults = res.data.data.object
      })
    },
    //获取预警信息列表
    getEarlyWarningInformation() {
      let _this = this
      let list = []
      for (let i = 0; i < this.streets.length; i++) {
        list.push(this.streets[i].streetId)
      }
      this.$store.commit('monitorPage/setStreetIdList', list)
      let params = {
        "pageSize": 6,
        "startPage": 0,
        "streetIdList": list,
      }
      this.$request.post('/warning/list', params, {error: false}).then(res => {
        _this.earlyWarningInformation = res.data.data.object
        _this.earlyWarningInformationNum = res.data.data.count
      })
    },
    //返回首页
    returnHome() {
      this.$router.back()
    },
    //点击菜单
    clickMenuList(index) {
      this.menuListIndex = index
      this.menuListIndexReal = index
      if (index == 0) {
        this.returnHome()
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
    //视频弹出层
    showVideoMoast(url) {
      // url = 'http://47.93.19.134:8086/hls/tj3_1002.m3u8';
      // player.src({
      //   src: url,
      //   type: "application/x-mpegURL"
      // });
      // player.play();
      // this.VideoMoastUrl = url
      this.ShowVideoMoast = true
    },
    // 关闭视频弹窗
    closeShowVideoMoast() {
      this.ShowVideoMoast = false
      this.ShowVideoMoastIndex = -1
      this.resetColorClose2()
    },
    //关闭添加路口弹框
    closeShowAddPopUp() {
      this.ShowAddPopUp = false
      this.ShowAddPopUpIndex = -1
      this.resetColorClose3()
    },

    resetColorClose2() {
      this.colorClose2 = '#158acc'
    },
    resetColorClose3() {
      this.colorClose3 = '#158acc'
    },
    changeColorClose2() {
      this.colorClose2 = '#72a9e4'
    },
    changeColorClose3() {
      this.colorClose3 = '#72a9e4'
    },
    //展示路口列表弹框
    showAddPopUp() {
      this.searchStreetByName()
      this.ShowAddPopUp = true
    },
    showConfigurationModel() {
      this.ShowConfigurationModel = true
    },
    //展示退出监控弹框
    showQuitPopUp() {
      this.ShowQuitPopUp = true
    },
    //退出实时监控页面
    quit() {
      this.ShowQuitPopUp = false
      this.returnHome()
    },
    //添加路口
    addIntersection(item) {
      let _this = this
      for (let i = 0; i < this.streets.length; i++) {
        if (item.streetId == this.streets[i].streetId) {
          this.$Message['warning']({
            background: true,
            content: '该路口已存在',
          });
          return
        }
      }
      if(this.streets.length == 15){
        this.$Message['warning']({
          background: true,
          content: '最多实时监控15个路口',
        });
        return
      }
      this.$Message['success']({
        background: true,
        content: '添加位置成功!',
      });
      // 获取监控信息
      this.getVideoDetail(item.streetId, (res) => {
        Object.assign(item, res.data)
        this.streets.push(item)
      })
    },
    // 监测网络状况
    checkUrlConnected(url, method = "get") {
      this.$axios({
        method,
        url,
      }).then(res => {
        return true
      }).catch(res => {
        return false
      })

    },
    getVideoDetail(streetId, func) {
      // 获取监控信息
      var FormData = require('form-data');
      var params = new FormData();
      params.append('street_id', streetId);
      this.$request.post('http://47.93.19.134:8608/getStreet', params).then(res => {
        func(res)
      }).catch(res => {
        this.$Message['warning']({
          background: true,
          content: '前方直播服务器繁忙，请稍后再试!',
        });
      })
    }
  },

}
</script>

<style lang="scss">


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

.class-1-3 {
  background-image: url(../../public/image/选中状态.png);
  color: #B1CCE8;
}

/*新增*/
.ivu-checkbox-wrapper {
  margin-left: 16px;
}

.labelWrapper {
  .ivu-poptip-body > .ivu-icon {
    display: none !important;
  }

  .ivu-poptip-body-message {
    padding-left: 0 !important;
  }

  .ivu-poptip-inner {
    background: #0b2242;
    border: 1px solid #4b84c0;
  }

  .ivu-poptip-footer {
    display: flex;
    justify-content: center;
  }

  .ivu-btn-text {
    background-color: #16467b;
    border: 1px solid #4b84c0;
    color: #fff;
  }

  .ivu-poptip-arrow {
    border-top-color: #4b84c0;
  }

  .ivu-poptip-arrow:after {
    border-top-color: #4b84c0;
  }

  .ivu-poptip-body {
    max-height: 360px;
    overflow: auto;
  }
  .ivu-poptip-arrow{
    display: none;
    background-color: #0b2242!important;
    border-top-color: #12345e!important;
    border-right-color: #12345e!important;
    border-bottom-color: #12345e!important;
    border-left-color: #12345e!important;
    color: #9EB5CD;
  }
  .ivu-poptip-arrow:after{
    display: none;
    background-color: #0b2242!important;
    border-top-color: #12345e!important;
    border-right-color: #12345e!important;
    border-bottom-color: #12345e!important;
    border-left-color: #12345e!important;
    color: #9EB5CD;
  }

  .ivu-poptip-footer{
    display: none;
  }

}
</style>
