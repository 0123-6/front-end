<template>
  <!--最外层-->
  <div class="flex flex-direction margin-16 font-size-14 color-content" style="min-height: calc(100% - 32px);">
    <!--上-->
    <div class="flex" style="width: 100%;height: 120px;">
      <card
        v-for="(item,index) in cardList"
        :key="index"
        :img-url="item.imgUrl"
        :number="item.number"
        :title="item.title"
        :class="[index>0?'margin-left-16':'']"
        :color="item.color"
      ></card>
    </div>
    <!--下-->
    <div class="flex margin-top-16" style="width: 100%;height: calc(100% - 120px - 16px);">
      <!--左-->
      <div class="flex bgc-white padding-left-16 padding-right-16 box-shadow-1 border-radius-4" style="width: 70%;height: 100%;">
        <ModelTable style="width: 100%;height: 100%;"></ModelTable>
      </div>
      <!--右-->
      <div class="flex flex-direction margin-left-16" style="width: calc(100% - 70% - 16px);height: 100%;">
        <TwoCircles
          v-if="isCreated"
          style="width: 100%;height: 100%;"
          :model-type-echarts="modelTypeEcharts"
          :use-scene-echarts="useSceneEcharts"
        >
        </TwoCircles>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "@/views/model-manager/model-monitoring/index/components/Card";
import TwoCircles from "@/views/model-manager/model-monitoring/index/components/TwoCircles";
import ModelTable from "@/views/model-manager/model-monitoring/index/components/ModelTable";
import {getMonitorIndex} from "@/api/model-monitoring";
export default {
  name: "index",
  components: {
    ModelTable,
    TwoCircles,
    Card,
  },
  data(){
    return{
      isCreated:false,
      cardList:[
        {
          title:'在线模型数',
          number:0,
          imgUrl:'/monitor/bg-online.svg',
          color:'#00B1B2',
        },
        {
          title:'预测总量',
          number:0,
          imgUrl:'/monitor/bg-predict.svg',
          color:'#0164FF',
        },
        {
          title:'预警模型数',
          number:0,
          imgUrl:'/monitor/bg-warning.svg',
          color:'#FD5E3A',
        }
      ],
      modelTypeEcharts:null,
      useSceneEcharts:null,
    }
  },
  created() {
    this.getMonitorIndex()
  },
  methods:{
    getMonitorIndex(){
      getMonitorIndex().then(res => {
        let data = res.data
        this.cardList[0].number = data.onlineModelNumber
        this.cardList[1].number = data.predictNumber
        this.cardList[2].number = data.warningNumber
        this.modelTypeEcharts = data.modelTypeEcharts
        this.useSceneEcharts = data.useSceneEcharts
      }).finally(res => {
        this.isCreated = true
      })
    }
  },
}
</script>

<style scoped>

</style>
