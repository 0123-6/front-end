<template>
  <!--最外层-->
  <div class="flex flex-direction" style="background: linear-gradient(169deg, rgba(15, 51, 101, 0.9), rgba(9, 39, 72, 0.9));border: 1px solid #2C5C9B;border-radius: 6px;padding-left: 22px;padding-right: 22px;">
    <!--上-->
    <div class="flex justify-between align-center head" style="width: 100%;height: 40px;border-bottom: 1px solid #1d5486;align-self: center">
      <div class="flex color-title">
        模型应用
      </div>
      <close-icon @close="close"></close-icon>
    </div>
    <!--文字描述-->
    <div class="flex flex-direction" style="margin: 8px 0 0 0;font-size: 12px;color: #8399b2">
      将模型应用于所选择的路口
    </div>
    <!--搜索框-->
    <div class="flex" style="margin-top: 10px;align-self: flex-start">
      <Input v-model="keyword" search enter-button="搜索" placeholder="请输入路口名称" @on-search="getStreets"/>
    </div>
    <!--有数据-->
    <div v-if="loading || listNumber>0" class="" style="height: 588px;width: 100%;min-height: 588px;">
      <!--数据-->
      <div v-if="!loading" class="flex flex-direction" style="height: 100%;width: 100%;min-height: 100%;">
        <!--每一个-->
        <div class="flex align-center my-border-when-hover bgc-main-color-2 hand"
             style="border: 1px solid #4b84c0;border-radius: 4px;width: 100%;margin-top: 8px;height: calc(25% - 8px);"
             v-for="(item,index) in list" :key="item.streetId" @click="changeStreetUnion(index)">
          <!--左-->
          <div class="flex align-center" style="margin: 0 0px 0 26px;height: 100%;">
            <Checkbox stule="" v-model="item.union" :key="item.streetId">
              <span> </span>
            </Checkbox>
          </div>
          <!--右-->
          <div class="flex flex-1" style="width: 0px;height: 100%;">
            <!--左-->
            <div class="flex flex-direction" style="height: 100%;">
              <img src="/image/point.png" style="width: 32px;height: 40px;margin-top: 16px;">
            </div>
            <!--右-->
            <div class="flex flex-1 flex-direction justify-around text-color-2" style="width: 0px;margin: 24px 0px 24px 16px;">
              <div class="flex" style="color: #e2f3ff;font-size: 16px;">
                {{item.streetName}}
              </div>
              <div class="flex" style="font-size: 14px;">
                经度: {{item.streetLon}}
              </div>
              <div class="flex" style="font-size: 14px;">
                纬度: {{item.streetLat}}
              </div>
              <div class="flex align-center" style="font-size: 14px;">
                <div class="flex" style="margin-right: 24px;">
                  模型名称:
                </div>
                <!--模型列表-->
                <div class="flex align-center" v-if="index2<3" v-for="(item2,index2) in item.modelVoList" :key="item2.modelId" style="width: 126px;height: 26px;border-radius: 6px;background-color:#16467b;margin-right: 16px;">
                  <div class="flex" style="padding-left: 8px;">
                    <img src="/image/moxing.png" width="16" height="16" alt="">
                  </div>
                  <div class="text-hidden font-size-14" :title="item2.modelNameCh.length>6?item2.modelNameCh:null" style="width: 100px;margin-left: 4px">
                    {{item2.modelNameCh}}
                  </div>
                </div>
                <!--超过3个的部分-->
                <Tooltip placement="bottom left" v-if="item.modelVoList.length>3">
                  <div class="flex justify-center align-center" style="padding: 2px 8px;background-color:#16467b;">
                    ...
                  </div>
                  <div slot="content" style="width: 240px;" class="flex flex-direction">
                    <div class="flex align-center"
                         v-if="index>=3"
                         v-for="(item,index) in item.modelVoList"
                         :key="item.modelId"
                         style="padding: 8px;">
                      <div class="flex">
                        <img src="/image/moxing.png" width="24" height="24" alt="">
                      </div>
                      <div class="font-size-14 margin-left-8 text-hidden color-content"
                           style="width: 200px;"
                           :title="item.modelNameCh.length>14?item.modelNameCh:null">
                        {{item.modelNameCh}}
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--加载效果-->
      <div v-if="loading"  class="flex justify-center align-center" style="width: 100%;min-height: 100%;height: 100%;">
        <div class="flex flex-direction align-center">
          <div class="loading"></div>
        </div>
      </div>
    </div>
    <!--无数据-->
    <div v-if="listNumber === 0 && !loading" class="flex flex-1 flex-direction justify-center align-center"
         style="height: 100%;">
      <div class="flex" style="width: 160px;height: 140px;">
        <img src="@/assets/images/no_search_result.png" width="100%" height="100%" alt="">
      </div>
      <div class="margin-top-8 color-title-2">暂无数据</div>
    </div>
    <!--分页-->
    <div v-if="loading || listNumber>0" class="flex justify-end" style="margin-top: 16px;margin-right: 16px;">
      <Page :total="listNumber" :page-size="4" show-elevator @on-change="changeSearchModePageIndex"/>
    </div>
    <!--确定取消-->
    <div class="flex justify-end align-center" style="margin-top: 8px;width: 100%">
      <div class="flex">
        <Button @click="closeShowConfigurationModel" type="primary" style="margin-right: 18px;height: 32px;width: 90px;">取消
        </Button>
        <Button @click="selectedModelOk" type="primary" style="margin-right: 30px;height: 32px;width: 90px;">确定
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/components/CloseIcon";
export default {
  name: "ModelApplication",
  props:{
    //模型的ID
    id:{
      type:Number,
      required:true,
    },
  },
  components:{
    CloseIcon,
  },
  created() {
    this.getStreets()
  },
  data(){
    return{
      //数据
      list:[],
      listNumber:0,
      //分页
      loading:false,
      keyword:'',
      pageIndex:0,
      //暂不清楚
      MoastData:[],
      ShowMoreModel:false,
    }
  },
  methods:{
    close(){
      this.$emit('close')
    },
    getStreets(){
      this.loading = true
      let params = {
        startPage: this.pageIndex,
        pageSize: 4,
        streetName: this.keyword,
        needModel:true,
      }
      this.$request.get('/v2/streets',params).then(res => {
        this.list = res.data.data.object
        for(let i=0;i<this.list.length;i++){
          this.list[i].union = this.list[i].union==1?true:false
          for(let j=0;j<this.list[i].modelVoList.length;j++){
            if(this.list[i].modelVoList[j].id == this.id){
              this.list[i].union = true
              break
            }
          }
        }
        this.listNumber = res.data.data.count
        this.loading = false
      })
    },
    showMoreModel(){
      this.ShowMoreModel = true
    },
    //page分页点击事件
    changeSearchModePageIndex(index) {
      this.pageIndex = index
      this.getStreets()
    },
    closeShowConfigurationModel() {
      this.$emit('close')
    },
    //改变复选框状态
    changeStreetUnion(index){
      let s = JSON.parse(JSON.stringify(this.list[index]))
      s.union = !s.union
      this.$set(this.list,index,s)
    },
    //弹框选择事件
    selectedModelOk(){
      let list = this.list
      let params = []
      for(let i=0;i<list.length;i++){
        let param = {
          isUnion:list[i].union==true?1:0,
          modelId:this.id,
          streetId:list[i].streetId,
        }
        params.push(param)
      }
      let _this = this
      this.$request.post('/model/street/union/model',params).then(res => {
        if(res.data.result){
          _this.$Message['success']({
            background: true,
            content: '配置模型成功!',
          });
          this.getStreets()
        }else{
          _this.$Message['error']({
            background: true,
            content: '配置模型失败!',
          });
        }
      })
    },

  },

}
</script>

<style scoped>
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading {
  width: 80px;
  height: 80px;
  border: 8px solid rgba(0,0,0,0);
  border-bottom-color: rgba(74,154,242,1);
  border-radius: 50%;
  display: inline-block;
  -webkit-animation: rotation 1s linear infinite;
  animation: rotation 1s linear infinite;
}
</style>
