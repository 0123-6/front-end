<template>
  <!--最外层-->
  <div class="flex flex-direction bgc-image-1"
       style="width: 1920px;min-height: 1080px;padding-left: 20px;padding-right: 20px;padding-bottom: 20px;">
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
    <!-- 上面菜单栏good -->
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
    <div class="flex flex-direction"
         style="height: 136px;width: 100%;margin-top: 16px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.2))">
      <!--标题-->
      <div class="flex align-center justify-between"
           style="width: 100%;height: 56px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
        <!--左-->
        <div class="flex align-center">
          <div class="flex my-class-title"
               style="margin-left:32px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
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
      <!--内容-->
      <div class="flex align-center justify-between" style="height: 80px;">
        <!--左-->
        <div class="flex">
          <!--图片-->
          <div class="flex" style="margin-left: 24px;">
            <img src="/image/jinggao提示.png" alt="">
          </div>
          <!--文字描述-->
          <div class="flex" style="line-height: 63px;text-align: center;margin-left: 16px;">
            {{ info.warningInfo }}
          </div>
        </div>
        <!--右-->
        <div class="flex">
          <Button @click="updateStatus(1)" type="primary" style="margin-right: 18px;height: 36px;width: 107px;">重点跟踪
          </Button>
          <Button @click="updateStatus(2)" type="primary" style="margin-right: 18px;height: 36px;width: 107px;">暂缓处理
          </Button>
          <Button @click="updateStatus(3)" type="primary" style="margin-right: 24px;height: 36px;width: 107px;">已处理
          </Button>
        </div>
      </div>
    </div>
    <!--中间部分-->
    <div class="flex flex-direction" style="width: 100%;min-height: 556px;margin-top: 16px;background:rgba(11,46,76,0.6)">
      <!--上-->
      <div class="flex flex-direction" style="margin-top: 16px;">
        <!--筛选-->
        <div v-if="false" class="flex" style="">
          <div class="flex" style="margin-right: 32px;">
            <Input search enter-button="搜索" placeholder="输入模型名称" style="margin-left: 24px"/>
          </div>
          <div class="flex align-center">
            <div class="flex">
              时间
            </div>
            <div>
              <DatePicker v-model='startTimeAndEndTime' :split-panels="true" :options="optionDatePicker" separator=" 至 "
                          type="daterange"
                          placement="bottom-end" placeholder="选择日期范围" style="width: 243px;margin-left: 16px">
              </DatePicker>
            </div>
          </div>

        </div>
        <!--汽车颜色和 车型-->
        <div v-if="false" class="flex align-center justify-between  bgc-main-color-1"
             style="height: 100px;margin-top: 8px">
          <!--左-->
          <div class="flex flex-direction justify-around" style="height: 100%">
            <!--上-->
            <div class="flex align-center">
              <!--图片-->
              <div class="flex" style="margin-left: 24px">
                <img src="/image/车辆颜色识别.png" alt="">
              </div>
              <!--文字-->
              <div class="flex flex-text" style="width: 105px;margin-left: 16px">车辆颜色识别</div>
              <!--多选-->
              <!-- 上 -->
              <div class="flex" style="">
                <CheckboxGroup v-model="selectedColors">
                  <div class="flex text-color" style="">
                    <Checkbox label="黑色" style="width: 100px">
                    </Checkbox>
                    <Checkbox label="白色" style="width: 100px">
                    </Checkbox>
                    <Checkbox label="灰色" style="width: 100px">
                    </Checkbox>
                    <Checkbox label="绿色" style="width: 100px">
                    </Checkbox>
                    <Checkbox label="红色" style="width: 100px">
                    </Checkbox>
                  </div>
                </CheckboxGroup>
              </div>
            </div>
            <!--下-->
            <div class="flex align-center" style="">
              <!--图片-->
              <div class="flex " style="margin-left: 24px">
                <img src="/image/车辆识别.png" alt="">
              </div>
              <!--文字-->
              <div class="flex flex-text" style="width: 105px;margin-left: 16px">车型识别</div>
              <CheckboxGroup v-model="selectedCars">
                <div class="flex text-color" style="">
                  <Checkbox label="客车" style="width: 100px">
                  </Checkbox>
                  <Checkbox label="轿车" style="width: 100px">
                  </Checkbox>
                  <Checkbox label="工程车" style="width: 100px">
                  </Checkbox>
                  <Checkbox label="SUV" style="width: 100px">
                  </Checkbox>
                  <Checkbox label="卡车" style="width: 100px">
                  </Checkbox>
                </div>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <!--实时监控页面选择的模型-->
        <div class="flex flex-direction margin-left-24 margin-right-24 padding-left-16 padding-top-8 padding-bottom-8" style="max-height: 214px;border:1px solid rgb(23, 62, 101);overflow-y: auto;">
          <div class="flex color-content font-size-14 margin-top-8 margin-left-8"
               v-for="(item,index) in modelTypeList"
               :key="index"
               v-if="item.modelChecked">
            <!--模型名称-->
            <div class="margin-right-24  color-title " style="width: 300px;">
              <span style="height: 20px;line-height: 20px;" :title="item.modelNameCh.length>14?item.id + ' - ' + item.modelNameCh:null" class="font-size-16 text-hidden">{{item.id + ' - ' + item.modelNameCh}}</span>
            </div>
            <div class="flex flex-wrap" style="width: 1500px;">
              <span v-for="(item2,index2) in item.labelChecked"
                    :key="index2"
                    class="padding-top-4 padding-bottom-4 padding-left-8 padding-right-8 margin-right-8 flex margin-bottom-8"
                    style="background-color:#043667;border-radius: 2px;">
                {{item2}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!--下-->
      <div class="flex flex-1" style="margin-top: 24px;width: 100%;height: 394px;">
        <!--左-->
        <div class="flex flex-direction justify-center align-center" style="width: 680px;height: 100%;">
          <div class="flex" style="width: 610px;height: 340px;">
            <video :src="info.video_url" id="myVideo" controls width=610 height="340" style="margin-top: -20px">
            </video>


          </div>
          <div class="flex justify-center align-center"
               style="color: #B3D1F3;margin-top: -14px;width: 610px;height: 21px;background: linear-gradient(90deg, #0A304E, #152847);box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
            {{ info.streetName }}
          </div>
        </div>
        <!--中-->
        <div class="flex strip-Bj text-color" style="width: 1162px; height:100%">
          <!--中左-->
          <div class="flex flex-direction " style="width: 480px;height: 100%;padding-left: 40px;">
            <div class="flex" style="margin-top: 48px;">
              基本信息
            </div>
            <!--一条线-->
            <div class="flex" style="width: 90%;height: 0px;border-bottom: 1px solid #122a4c;margin-top: 16px;"></div>
            <div class="flex" style="margin-top: 32px;">
              车主：王XX
            </div>
            <div class="flex" style="margin-top: 16px;">
              车牌号：津AXXXXX
            </div>
            <div class="flex" style="margin-top: 16px;">
              颜色：白色
            </div>
            <div class="flex" style="margin-top: 16px;">
              违章信息：闯红灯
            </div>


          </div>
          <!--中右-->
          <div class="flex flex-direction text-color" style="width: 682px;height: 100%;padding-left: 40px;">
            <div class="flex flex-direction" style="width: 480px;height: 100%;">
              <div class="flex" style="margin-top: 48px;">
                线索信息
              </div>
              <!--一条线-->
              <div class="flex" style="width: 90%;height: 0px;border-bottom: 1px solid #122a4c;margin-top: 16px;"></div>
              <div class="flex" style="margin-top: 32px;">
                2022-1-21 出现在中天大道与中生大道交口 由北向南
              </div>
              <div class="flex" style="margin-top: 16px;">
                2022-1-21 出现在中新大道与和旭路交口 由北向南
              </div>
              <div class="flex" style="margin-top: 16px;">
                2022-1-21 出现在中新大道与中泰大道交口 由西向东 停留1小时25分
              </div>
              <div class="flex" style="margin-top: 16px;">
                2022-1-21 出现在动漫中路与文二路交口 由东向西
              </div>
              <div class="flex" style="margin-top: 16px;">
                2022-1-21 出现在中生大道与静湖南路 由南向北
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--处置结果备注-->
    <div class="flex flex-direction" style="margin-top: 16px;width: 100%;height: 220px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.9))">
      <!--标题-->
      <div class="flex text-color" style="margin: 16px 24px;">
        处理结果备注
      </div>
      <!--内容-->
      <div class="flex text-color" style="margin: 8px 24px 0px;background-color:#0d2341;">
        <Input v-model="inputValue" type="textarea" :rows="4" placeholder="输入内容"/>
      </div>
      <!--按钮-->
      <div class="flex" style="margin-top: 16px;justify-items: flex-end;align-self: flex-end">
        <Button @click="submitChangeNote" type="primary" style="margin-right: 24px;height: 28px;width: 78px;">提交
        </Button>
      </div>
    </div>
  </div>

</template>

<script>
import ScaleBox from "@/components/ScaleBox";

export default {
  name: "EarlyWarningInformation",
  components: {ScaleBox},

  data() {
    return {
      startTimeAndEndTime: null,
      optionDatePicker: {
        disabledDate(date) {
          const disabledYear = date.getFullYear()
          return disabledYear < 2022;
        }
      },
      inputValue: '',
      menuList: ['实时监控'],
      menuListIndex:0,
      menuListIndexReal:0,
      //选择的颜色
      // selectedColors: [],
      // //选择的汽车
      // selectedCars: [],
      //弹框
      ShowQuitPopUp:false,
      colorClose2: '#158acc',
    }
  },
  computed:{
    info:{
      get(){
        return this.$store.state.earlyInfo
      },
      set(value){
        this.$store.commit('setEarlyInfo',value)
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
  },
  mounted() {
    //获取video元素
    var myVideo = document.getElementById('myVideo');

    myVideo.currentTime = this.info.second;
    // myVideo.play();
    this.inputValue = this.info.comment

  },
  methods: {
    //返回上一级
    returnMonitor() {
      // this.$router.go(-1)
      this.$emit('return')
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
    //修改状态
    updateStatus(index) {
      let _this = this
      let params = {
        "status": index,
        "warningId": _this.info.id
      }
      this.$request.post('/warning/status/update',params).then(res => {
        let ok = res.data.data
        if (ok) {
          this.$Message['success']({
            background: true,
            content: '状态修改成功!',
          });
        } else {
          this.$Message['error']({
            background: true,
            content: '状态修改失败!',
          });
        }
      })
    },
    //提交备注
    submitChangeNote() {
      let _this = this
      let params = {
        "comment": _this.inputValue,
        "warningId": _this.info.id
      }
      this.$request.post('/warning/comment/update',params).then(res => {
        let ok = res.data.data
        if (ok) {
          this.$Message['success']({
            background: true,
            content: '备注成功!',
          });
        } else {
          this.$Message['error']({
            background: true,
            content: '备注失败!',
          });
        }
      })
    }
  },
}
</script>

<style scoped>

.t132 {
  background-image: url(../../public/image/daohanglan.png);
}


.my-border-when-hover:hover {
  background-color: #1857a4 !important;
  border: 1px solid #72a9e4 !important;
  border-radius: 4px
}

/*把中右合并起来放在一个大盒子里然后引入线条背景图片*/
.strip-Bj {
  background-image: url("../../public/image/边框.png");
  background-repeat: no-repeat;
}

.class-1-5 {
  margin-left: 12px;
  font-size: 16px;
  font-weight: normal;
  color: #9EB5CD;
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

.class-2 {
  flex: 1 0 auto;
  background-color: aquamarine;
}

</style>
