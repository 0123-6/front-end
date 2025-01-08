<template>
  <!--最外层-->
  <div class="flex flex-direction padding-left-16 padding-right-16" :class="{'my-style':ShowBar}">
    <!--上-->
    <div v-if="ShowBar" class="flex justify-between align-center head"
         style="width: 100%;height: 40px;border-bottom: 1px solid #1d5486;align-self: center">
      <div class="flex">
        配置模型
      </div>
      <close-icon @close="closeShowConfigurationModel"></close-icon>
    </div>
    <!--tab栏-->
    <hpj-tabs v-if="false" :tab-list="tabList" @change="changeTab" class="margin-top-16"></hpj-tabs>
    <!--搜索框-->
    <div class="flex" style="margin-top: 16px; margin-left:5px;align-self: flex-start">
      <Input v-model="keyword" style="border-radius: 4px;" search enter-button="搜索" placeholder="请输入模型名称" @on-search="getModelListByKeyword"/>
    </div>
    <!--结果列表-->
    <div class="flex margin-bottom-16 padding-bottom-8" style="width: 100%;" :style="{height: pSize=='small'?'340px':'870px',}"
         :key="StreetId!=undefined&&StreetId!=null ? StreetId : ''">
      <!--有数据-->
      <div v-if="loading || listNumber>0" style="width: 100%;height: 133px;min-height: 133px;">
        <!--数据-->
        <div v-if="!loading" class="flex flex-wrap" style="width: 100%;overflow-y: auto;">
          <!--一个-->
          <div class="flex flex-direction hover-change-bgc padding-left-8 padding-right-8 hand" v-for="(item,index) in list" :key="item.id"
               style="margin:18px 1% 0px 1%;background: linear-gradient(135deg, rgba(149,234,255,0.1), rgba(58,130,195,0.1));border-radius: 4px;"
               @click.stop="goModelBaseDetail(item.id)"
               :style="{height: pSize=='small'?'162px':'272px',width:pSize=='small'?'31%':'22%',margin:pSize=='small'?'18px 1% 0 1%':'32px 1.5% 0 1.5%'}">
            <!--标题-->
            <div style="height: 40px;line-height: 20px;" class="text-hidden-2 font-size-16 color-white margin-top-16">
              {{ item.id + ' ' + item.modelNameCh }}
            </div>
            <!--内容-->
            <div class="flex text-hidden-3 color-content font-size-14 margin-top-16"
                 style="height: 60px;line-height: 20px;">
              {{ item.modelShortDescribe }}
            </div>
            <div @click.stop="">
              <Checkbox v-show="pSize=='small'" v-model="item.union" stule="" style="margin-top: 8px;"
                        class="flex justify-end">
                <span></span>
              </Checkbox>
            </div>
            <div v-show="pSize!='small'" class="flex justify-end" style="margin: 16px 16px 0 0;">
              <Button @click="$emit('applicate',item.id)" type="primary"
                      style="margin-right: 30px;height: 32px;width: 90px;">应用
              </Button>
            </div>
          </div>
        </div>
        <!--加载效果-->
        <div v-if="loading" class="flex justify-center align-center" style="width: 100%;min-height: 266px;height: 266px;">
          <div class="flex flex-direction align-center">
            <div class="loading-small"></div>
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
    </div>
    <!--分页-->
    <div  class="flex justify-end" style="margin-top: 16px;margin-right: 16px;">
      <Page :total="listNumber" :page-size="pSize=='small'?6:12" show-elevator
            @on-change="changeSearchModePageIndex"/>
    </div>
    <!--按钮-->
    <div v-if="pSize=='small'" class="flex justify-end align-center" style="margin-top: 16px;width: 100%">
      <div class="flex">
        <Button @click="closeShowConfigurationModel" type="primary"
                style="margin-right: 18px;height: 32px;width: 90px;">取消
        </Button>
        <Button @click="selectedModelOk" type="primary" style="margin-right: 30px;height: 32px;width: 90px;">确定
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from "@/components/CloseIcon";
import HpjTabs from "@/components/HpjTabs";


export default {
  name: "ConfigurationModel",
  components: {
    HpjTabs,
    CloseIcon,
  },
  props: {
    SelectedModelList: {
      type: Array,
      required: false,
    },
    ShowBar: {
      type: Boolean,
      required: true,
    },
    Size: {
      type: String,
      required: false,
    },
    StreetId: {
      type: Number,
      required: false,
    },
    IsMonitor: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      //搜索模型关键字
      keyword: '',
      loading:false,
      //配置模型列表
      list: [],
      //模型总数
      listNumber: 0,
      //模型分页index
      pageIndex: 0,
      pSize: 'small',
      tabList:['未配置','已配置'],
      activeTab:'',
    }
  },
  created() {
    if (this.Size != undefined && this.Size != null) {
      this.pSize = this.Size
    }
    this.showConfigurationModel()
  },
  methods: {
    showConfigurationModel() {
      this.pageIndex = 0
      this.getModelList()
    },
    closeShowConfigurationModel() {
      this.$emit('close')
    },
    selectedModelOk() {
      this.$emit('selected', this.list)
    },
    getModelListByKeyword(){
      this.pageIndex = 1
      this.getModelList()
    },
    //获取模型列表
    getModelList() {
      this.loading = true
      let params = {
        modelName: this.keyword,
        startPage: this.pageIndex,
        pageSize: this.pSize == 'small' ? 6 : 12,
        userId:229,
        // whetherConfigureModel:this.activeTab=='已配置'?true:false,
      }
      if (this.StreetId != undefined && this.StreetId != null && this.StreetId != '') {
        params.streetId = this.StreetId
      }
      this.$request.get('/v2/models',params).then(res => {
        this.list = res.data.data.object
        this.listNumber = res.data.data.count

        for(let i=0;i<this.list.length;i++){
          this.list[i].union = this.list[i].union==1?true:false
        }
        //如果不为undefined，说明是从实时监控页面进来的
        if (this.SelectedModelList != undefined && this.SelectedModelList != null) {
          for(let i=0;i<this.list.length;i++){
            if(this.SelectedModelList.indexOf(this.list[i].id)!=-1){
              this.list[i].union = true
            }
          }
        }
        this.loading = false
      })
    },
    //page分页点击事件
    changeSearchModePageIndex(index) {
      this.pageIndex = index
      this.getModelList()
    },
    //在新tab页打开模型库详情页面
    goModelBaseDetail(id){
      window.open(`/index/model-base-detail/${id}`)
    },
    //模型配置，tab的切换事件
    changeTab(tab){
      this.activeTab = tab
      this.pageIndex = 0
      this.getModelList()
    },
    //改变选中状态
    changeItemUnion(index){
      let item = JSON.parse(JSON.stringify(this.list[index]))
      item.union = !item.union
      this.$set(this.list,index,item)
    },
  },
}
</script>

<style scoped>
.my-style{
  background: linear-gradient(169deg, rgba(31,92,184,0.32), rgba(9,39,72,0.92));
  border: 1px solid #2C5C9B;
  border-radius: 6px;
}


.hover-change-bgc:hover{
    position: relative;
    box-shadow: 0px 4px 16px #174684;
    transition:.3s;
    -webkit-transition:.3s;
}
</style>
