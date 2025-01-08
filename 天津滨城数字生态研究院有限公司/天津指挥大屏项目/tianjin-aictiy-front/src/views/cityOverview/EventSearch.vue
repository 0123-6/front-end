<template>
  <div class="flex flex-direction" style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
    <!-- 上 -->
    <div class="flex justify-between align-center"
         style="width: 499px;height: 40px;background: linear-gradient(90deg, #0A304E, rgba(21, 40, 71, 0.53));box-shadow: 0px 1px 0px 0px rgba(9, 70, 118, 0.74);">
      <!-- 左 -->
      <div class="flex align-center">
        <div class="flex my-class-title"
             style="margin-left: 16px;width: 6px;height: 6px;background-color: #71B5FF;"></div>
        <div class="flex"
             style="margin-left: 4px;font-size: 16px;font-weight: 500;color: #9eb5cd">
          事件搜索
        </div>
      </div>
    </div>
    <!--Tab选择器-->
    <div class="flex justify-center align-center" style="width: 100%;margin-top: 8px">
      <div id="my-id-3" class="flex">
        <RadioGroup v-model="searchMode" type="button" button-style="solid">
          <Radio label="s0">简单搜索</Radio>
          <Radio label="s2">高级搜索</Radio>
        </RadioGroup>
      </div>
    </div>
    <!-- 简单内容 -->
    <div class="flex justify-center align-center" style="width: 100%;height: 72px;">
      <div id="my-id-1" class="flex flex-direction"
           style="font-size: 14px;font-weight: 400;color: #87B3C9;">
        <Input ref="my-input-1" id="my-input-1" v-model="searchCondition.key" placeholder="搜索事件" search
               @on-search="search" :border="false" style="width: 478px;height: 46px;"/>
      </div>
    </div>
    <!-- 详情内容 -->
    <div v-show="searchMode=='s2'" class="flex flex-direction"
         style="background: linear-gradient(0deg, rgba(9, 29, 59, 0.93), rgba(9, 39, 72, 0.91));">
      <!-- 时间 -->
      <div class="flex" style="margin-top: 16px;">
        <!-- 左 -->
        <div class="flex justify-end color-white"
             style="margin-left: 6px;width: 90px;font-size: 16px;">
          时间:
        </div>
        <!-- 右 -->
        <div class="flex flex-direction flex-1" style="margin-left: 20px">
          <!-- 上 -->
          <div class="flex" style="width: 100%;">
            <RadioGroup v-model="searchCondition.searchTimeType">
              <div class="flex justify-around" style="width: 373px;">
                <Radio label="0">时间不限</Radio>
                <Radio label="1">1天内</Radio>
                <Radio label="2">一周内</Radio>
                <Radio label="5">自定义</Radio>
              </div>
            </RadioGroup>
          </div>
          <!-- 下 -->
          <div v-show="searchCondition.searchTimeType=='5'" class="flex justify-center"
               style="margin-top: 18px;width: 100%;padding-right: 20px">
            <DatePicker v-model='startTimeAndEndTime' :split-panels="true" :options="optionDatePicker"
                        separator=" 至 "
                        :disabled='searchCondition.searchTimeType != "5"' type="daterange"
                        placement="bottom-end" placeholder="选择日期范围" style="width: 345px">
            </DatePicker>
          </div>
        </div>
      </div>
      <!-- 地点 -->
      <div id="my-id-2" class="flex align-center" style="margin-top: 16px;">
        <div class="flex justify-end color-white font-size-16"
             style="margin-left: 6px;width: 90px;">
          地点:
        </div>
        <div class="flex" style="margin-left: 30px;">
          <Input v-model="searchCondition.street_name" placeholder="输入地点" :border="false" style="width: 345px;" search @on-search="search"/>
        </div>


      </div>
      <!-- 车辆颜色 -->
      <div class="flex align-center" style="margin-top: 16px;">
        <div class="flex justify-end font-size-16 color-white"
             style="margin-left: 6px;width: 90px;">
          车辆颜色:
        </div>
        <div class="flex flex-1 justify-center align-center">
          <Select v-model="searchCondition.color" multiple style="width:345px;">
            <Option v-for="(item,index) in carColorList" :value="item.value" :key="index">{{
                item.label
              }}
            </Option>
          </Select>
        </div>
      </div>
      <!-- 车辆类型 -->
      <div class="flex align-center" style="margin-top: 16px;">
        <div class="flex justify-end color-white font-size-16"
             style="margin-left: 6px;width: 90px;">
          车辆类型:
        </div>
        <div class="flex flex-1 justify-center align-center">
          <Select v-model="searchCondition.category" multiple style="width:345px;">
            <Option v-for="(item,index) in carClassList" :value="item.value" :key="index">{{
                item.label
              }}
            </Option>
          </Select>
        </div>
      </div>
    </div>
    <!-- 2个按钮 -->
    <div class="flex justify-end flex-1 align-center" style="margin: 15px 0px;">
      <Button @click="clearSearchCondition" type="primary"
              style="margin-right: 30px;height: 36px;width: 133px;">清空筛选条件
      </Button>
      <Button @click="search" type="primary" style="margin-right: 30px;height: 36px;width: 133px;">搜索</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventSearch",
  data(){
    return{
      searchCondition: {
        key: '',
        street_name: '',
        searchTimeType: 0,
        color: [],
        category: [],
        startTime: null,
        endTime: null,
      },
      startTimeAndEndTime: null,//自定义时间范围
      optionDatePicker: {
        disabledDate(date) {
          const disabledYear = date.getFullYear()
          return disabledYear < 2022;
        }
      },
      carColorList: [{
        label: '黑色',
        value: 0,
      }, {
        label: '蓝色',
        value: 1,
      }, {
        label: '棕色',
        value: 2,
      }, {
        label: '灰色',
        value: 3,
      }, {
        label: '绿色',
        value: 4,
      }, {
        label: '粉色',
        value: 5,
      }, {
        label: '红色',
        value: 6,
      }, {
        label: '白色',
        value: 7,
      }, {
        label: '黄色',
        value: 8,
      }
      ],
      carClassList: [{
        label: '客车',
        value: 0,
      }, {
        label: '轿车',
        value: 1,
      }, {
        label: '工程车',
        value: 2,
      }, {
        label: 'SUV',
        value: 3,
      }, {
        label: '拖车',
        value: 4,
      }, {
        label: '卡车',
        value: 5,
      }, {
        label: '货车',
        value: 6,
      }, {
        label: '运货车',
        value: 7,
      },
      ],
    }
  },
  computed:{
    searchMode:{
      get(){
        console.log('searchMode:',this.$store.state.indexPage.searchMode)
        return this.$store.state.indexPage.searchMode
      },
      set(value){
        this.$store.commit('indexPage/setSearchMode',value)
      },
    },
  },
  activated() {
  },
  deactivated() {
    this.init()
  },
  methods:{
    init(){
      // this.$store.commit('indexPage/init')
      this.clearSearchCondition()
    },
    clearSearchCondition() {
      this.searchCondition.key = ''
      this.searchCondition.street_name = ''
      this.searchCondition.searchTimeType = 0
      this.searchCondition.color = []
      this.searchCondition.category = []
      this.searchCondition.startTime = null
      this.searchCondition.endTime = null
    },
    // 搜索事件
    search() {
      if (this.searchCondition.searchTimeType == '5') {
        if (this.startTimeAndEndTime == null) {
          this.$Message['error']({
            background: true,
            content: '请选择时间范围!',
          });
          return
        }
        this.searchCondition.startTime = new Date(this.startTimeAndEndTime[0]).format("yyyy-MM-dd hh:mm:ss")
        this.searchCondition.endTime = new Date(this.startTimeAndEndTime[1]).format("yyyy-MM-dd hh:mm:ss")
      }
      this.$store.commit('indexPage/setSearched',true)
      this.$store.commit('indexPage/setSearching',true)
      this.$store.commit('indexPage/setSearchResult',[])
      this.$emit('mapClearOverlays')
      let params = JSON.parse(JSON.stringify(this.searchCondition))
      if(this.searchMode=='s0'){
        params.street_name = ''
        params.searchTimeType = 0
        params.color = []
        params.category = []
        params.startTime = null
        params.endTime = null
      }
      let _this = this
      this.$request.post('/tianjin-aictiy-demo/query',params).then(res => {
        _this.$store.commit('indexPage/setSearchResult',res.data.data)
        _this.$emit('searchSuccess',res)
        _this.$store.commit('indexPage/setSearching',false)
      })
    },
  },

}
</script>

<style scoped>
#my-id-2 .ivu-input {
  height: 36px;
  border: 1px solid rgba(171, 230, 255, 0.4);
  background: rgba(21, 84, 152, 0.09);
  border-radius: 6px;
  color: white;
}
#my-id-3 .ivu-radio-group-button-solid .ivu-radio-wrapper-checked:not(.ivu-radio-wrapper-disabled) {
  height: 34px;
  width: 239px;
  text-align: center;
}

#my-id-3 .ivu-radio-group-button-solid .ivu-radio-wrapper-checked:not(.ivu-radio-wrapper-disabled):hover {
  height: 34px;
  width: 239px;
  text-align: center;
}

#my-id-3 .ivu-radio-group-button .ivu-radio-wrapper {
  height: 34px;
  width: 239px;
  text-align: center;
}
#my-id-1 .ivu-input {
  height: 46px;
  border: 1px solid rgba(171, 230, 255, 0.4);
  background: rgba(21, 84, 152, 0.09);
  border-radius: 6px;
  color: white;
}
</style>
