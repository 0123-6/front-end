<template>
  <!--最外层-->
  <div class="flex flex-direction model-base" style="width: 1880px;">
    <!--授权弹框-->
    <dialog-mask v-if="showMoast" @cancel="showMoast=false">
      <model-application ref="modelApp"
                         :id="id"
                         style="width: 748px;height: 808px;position: absolute;left: 620px;top: 140px;z-index: 2;"
                         @close="showMoast=false">
      </model-application>
    </dialog-mask>
    <!--搜索-->
    <div class="flex" style="margin-top: 11px;align-self: flex-start">
      <Input id="my-id-1" v-model="keyword" search enter-button="搜索" placeholder="请输入模型名称" @on-search="getModelListByKeyWord" style="color: #9EB5CD;"/>
    </div>
    <!--内容-->
    <div class="flex model-base-content" style="width: 100%;">
      <!--有数据-->
      <div v-if="loading || listNumber>0" style="width: 100%;">
        <!--列表页面-->
        <div v-if="!loading" class="card-container margin-top-16" style="width: 100%;min-height: 296px;padding-bottom: 16px;">
          <div
              class="flex flex-direction model-base-content-1 hand model-base-content-container"
              v-for="(item,index) in list" :key="item.id"
              style="position: relative;background: linear-gradient(178deg, rgba(18,44,83,0.44), rgba(9,39,72,0.89));"
              @click="clickModel(item)">
            <!--图片-->
            <div class="flex model-base-content-1-image justify-center align-center">
              <img v-if="item.coverUrl!=undefined && item.coverUrl!=null"
                   style="border-radius: 4px 4px 0 0;"
                   :src="item.coverUrl"
                   alt=""
                   height="100%"
                   width="100%">
            </div>
            <!--图片下面-->
            <div class="flex flex-direction padding-left-16 padding-right-16">
              <!--标题-->
              <div class="flex font-size-16 font-weight-500 model-base-content-1-title" style="width: 100%;margin-top: 22px;">
                <span class="text-hidden" style="width: 100%;color: #E2F3FF;">{{ item.modelNameCh }}</span>
              </div>
              <!--标签-->
              <div class="flex model-base-content-1-bottom margin-top-12">
                <div
                    class="flex model-base-content-1-bottom-1 font-size-12 margin-right-8 padding-top-4 padding-bottom-4 padding-left-8 padding-right-8"
                    style="border-radius: 13px;background: linear-gradient(264deg, rgba(169,191,242,0.3), rgba(116,152,233,0.6));color: #B4D1E7;">
                  {{ item.scenesName }}
                </div>
                <div
                    style="border-radius: 13px;background: linear-gradient(90deg, rgba(66,189,189,0.3), rgba(12,95,95,0.6));color: #ABE1F6;"
                    class="flex model-base-content-1-bottom-1 font-size-12 margin-right-8 padding-top-4 padding-bottom-4 padding-left-8 padding-right-8" >
                  {{ item.typeName }}
                </div>
              </div>
              <!--简介-->
              <div class="flex font-size-14 margin-top-16 text-hidden-3"
                   style="height: 60px;line-height: 20px;color: #9EB5CD;min-height: 60px;">
                {{ item.modelShortDescribe }}
              </div>
              <!--应用按钮-->
              <div class="flex justify-end align-center" style="margin-top: 30px;">
                <Button @click.stop="applicate(item)" type="primary" style="height: 32px;width: 88px;color: #9EB5CD;" >应用</Button>
              </div>
            </div>
          </div>
        </div>
        <!--加载效果-->
        <div v-if="loading"  class="flex justify-center align-center" style="width: 100%;min-height: 888px;">
          <div class="flex flex-direction align-center">
            <div class="loading"></div>
          </div>
        </div>
      </div>
      <!--无数据-->
      <div v-if="listNumber == 0 && !loading" class="flex flex-direction justify-center align-center"
           style="height: 888px;width: 100%;">
        <div class="flex" style="width: 160px;height: 140px;">
          <img src="@/assets/images/no_search_result.png" width="100%" height="100%" alt="">
        </div>
        <div class="margin-top-8 color-title-2">暂无数据</div>
      </div>
    </div>
    <!--分页-->
    <div v-show="!loading && listNumber>0" class="flex justify-end" style="margin-right: 16px;">
      <Page :total="listNumber" :page-size="pageSize" show-elevator @on-change="changePageIndex"/>
    </div>
  </div>
</template>

<script>
import ModelApplication from "@/views/modelBase/ModelApplication";
import DialogMask from "@/components/DialogMask";
export default {
  name: "ModelList",
  components:{
    DialogMask,
    ModelApplication,
  },
  data(){
    return{
      //列表
      list:[],
      listNumber:0,
      //分页
      keyword:'',
      pageIndex:1,//分页从1开始
      pageSize:8,
      loading:false,
      //弹框
      showMoast:false,
      //选中的模型
      id:0,
    }
  },
  created() {
    // let token = this.$store.state.user.token
    this.getModelList()
  },
  activated() {

  },
  deactivated() {
    this.keyword = ''
  },
  methods:{
    //点击应用事件
    applicate(item){
      this.id = item.id
      this.showMoast = true
    },
    getModelListByKeyWord(){
      this.pageIndex = 1
      this.getModelList()
    },
    //获取模型列表
    getModelList() {
      this.loading = true
      let params = {
        modelName: this.keyword,
        startPage: this.pageIndex,
        pageSize: this.pageSize,
        userId:229,
        whetherConfigureModel:null,
      }
      // if (this.StreetId != undefined && this.StreetId != null && this.StreetId != '') {
      //   params.streetId = this.StreetId
      // }
      this.$request.get('/v2/models',params).then(res => {
        this.list = res.data.data.object
        this.listNumber = res.data.data.count
        this.loading = false
      }).catch(err => {

      })
    },
    //分页
    changePageIndex(index){
      this.pageIndex = index
      this.getModelList()
    },
    //模型项点击事件
    clickModel(item) {
      this.$router.replace({
        name:'modelBaseDetail',
        params:{
          id:item.id,
        },
      })
    },
  },
}
</script>
<style scoped>
#my-id-1 .ivu-input {
  height: 46px;
  border: 1px solid rgba(171, 230, 255, 0.4);
  background: rgba(21, 84, 152, 0.09);
  border-radius: 6px;
  color: white;
}

</style>
<style lang="scss" scoped>
.card-container {
  grid-autoflow: columns;
  grid-gap: 16px;
  box-sizing: border-box;
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(4, 1fr);
  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr)
  }
  @media (min-width: 1200px) and (max-width: 1366px) {
    grid-template-columns: repeat(3, 1fr)
  }
  @media (min-width: 1366px) and (min-width: 1460px) {
    grid-template-columns: repeat(4, 1fr)
  }
}


.model-base {
  width: 100%;
  min-width: 800px;

  .model-base-head {
    width: 100%;
    height: 50px;
    background: #E2F3FF;
  }

  .model-base-filter {
    width: calc(100% - 48px);
  }

  .model-base-content {
    width: 100%;
    transition:.3s;
    -webkit-transition:.3s;
    .model-base-content-container {
      &:hover {
        position: relative;
        //box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%);
        //box-shadow: 0 1px 2px -2px rgb(0 0 0 / 100%), 0 3px 6px 0 rgb(0 0 0 / 100%), 0 5px 12px 4px rgb(0 0 0 / 100%);
        //box-shadow: 0 6px 6px -6px ;
        box-shadow: 0px 5px 36px #174684;
        .buttons-container {
          display: block !important;
        }
        transition:.3s;
        -webkit-transition:.3s;
      }
    }
    .model-base-content-1 {
      width: 100%;
      height: 436px;
      border-radius: 4px;
      .model-base-content-1-image {
        width: 100%;
        height: 204px;
      }

    }
  }
}
</style>

