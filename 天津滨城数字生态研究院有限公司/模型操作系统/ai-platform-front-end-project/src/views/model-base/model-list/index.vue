<template>
  <!--最外层-->
  <div class="flex flex-direction bgc-main model-base border-top">
    <!--搜索栏-->
    <div class="flex align-center model-base-head box-shadow-1 my-search">
      <!--标题-->
      <div class="flex font-size-16 color-content margin-left-24 font-weight">
        模型库
      </div>
      <!--状态-->
      <div class="flex align-center" style="margin-left: 44px;">
        <div
          v-for="item in filterList"
          :key="item.code"
          class="flex justify-center align-center margin-right-8 hand font-size-14 text-no-wrap border-radius-4"
          :class="[item.code==filterCode?'color-blue':'color-title-2 ']"
          style="width: 96px;height: 28px;"
          :style="[{'background':item.code==filterCode?'#E4EDF8':'#E9EEEF'}]"
          @click="clickFilterItem(item.code)"
        >
          {{ item.label }}({{ item.value }})
        </div>
      </div>
      <!--搜索-->
      <div style="margin-left: 24px;">
        <input-with-search placeholder="请输入模型名称" class="notebook-search-container" @search="search" />
      </div>
    </div>
    <!--分类-->
    <div
      class="flex flex-direction justify-around model-base-filter box-shadow-1 margin-top-16 margin-left-24 margin-right-24 bgc-white padding-bottom-8"
    >
      <!--上-->
      <div class="flex margin-left-16">
        <div class="flex" style="width: 170px;min-width: 170px;">
          <img
            src="@/assets/pic/changjingleibie-mian-icon.png"
            width="16"
            height="16"
            class="margin-right-8 margin-top-16"
            alt=""
          >
          <div class="flex font-size-14 color-title margin-top-16">
            使用场景：
          </div>
          <div
            class="flex padding-8 margin-top-8 margin-left-16 margin-right-16 hand font-size-14 color-content"
            :class="[SceneIndex==-1?'color-blue-light bgc-blue-light border-radius-4':'']"
            style="height: 32px"
            @click="clickSceneItem(-1,-1)"
          >
            全部
          </div>
        </div>
        <div class="flex flex-direction">
          <div class="flex flex-wrap align-center margin-top-8">
            <template v-for="(item,index) in SceneList">
              <div
                v-if="index<8"
                :key="item.id"
                class="flex padding-8 margin-left-16 margin-right-16 hand font-size-14 color-content text-no-wrap"
                :class="[index==SceneIndex?'color-blue-light bgc-blue-light border-radius-4':'']"
                @click="clickSceneItem(index,item.id)"
              >
                {{ item.scenesName }}
              </div>
            </template>
            <div v-if="SceneList.length>8" @click="changeSceneNextLine">
              <i v-if="ShowSceneMoreLine==false" class="el-icon-arrow-down hand" />
              <i v-else class="el-icon-arrow-up hand" />
            </div>
          </div>
          <div v-if="ShowSceneMoreLine" class="flex flex-wrap align-center">
            <template v-for="(item,index) in SceneList">
              <div
                v-if="index>=8"
                :key="item.id"
                class="flex flex-wrap padding-8 margin-left-16 margin-right-16 hand font-size-14 color-content"
                :class="[index==SceneIndex?'color-blue-light bgc-blue-light border-radius-4':'']"
                @click="clickSceneItem(index,item.id)"
              >
                {{ item.scenesName }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <!--下-->
      <div class="flex margin-left-16">
        <div class="flex" style="width: 170px;min-width: 170px;">
          <img
            src="@/assets/pic/moxingfenlei-mian-icon.png"
            width="16"
            height="16"
            class="margin-right-8 margin-top-16"
            alt=""
          >
          <div class="flex font-size-14 color-title margin-top-16">
            模型类型：
          </div>
          <div
            class="flex padding-8 margin-top-8 margin-left-16 margin-right-16 hand font-size-14 color-content"
            :class="[ModelFilterIndex==-1?'color-blue-light bgc-blue-light border-radius-4':'']"
            style="height: 32px"
            @click="clickModelFilterItem(-1,-1)"
          >
            全部
          </div>
        </div>
        <div class="flex flex-direction">
          <div class="flex flex-wrap align-center margin-top-8">
            <template v-for="(item,index) in ModelFilterList">
              <div
                v-if="index<8"
                :key="item.id"
                class="flex padding-8 margin-left-16 margin-right-16 hand font-size-14 color-content text-no-wrap"
                :class="[index==ModelFilterIndex?'color-blue-light bgc-blue-light border-radius-4':'']"
                @click="clickModelFilterItem(index,item.id)"
              >
                {{ item.typeName }}
              </div>
            </template>
            <div v-if="ModelFilterList.length>8" @click="changeModelFilterNextLine">
              <i v-if="ShowModelFilterMoreLine==false" class="el-icon-arrow-down hand" />
              <i v-else class="el-icon-arrow-up hand" />
            </div>
          </div>
          <div v-if="ShowModelFilterMoreLine" class="flex flex-wrap align-center">
            <template v-for="(item,index) in ModelFilterList">
              <div
                v-if="index>=8"
                :key="item.id"
                class="flex padding-8 margin-left-16 margin-right-16 hand font-size-14 color-content text-no-wrap"
                :class="[index==ModelFilterIndex?'color-blue-light bgc-blue-light border-radius-4':'']"
                @click="clickModelFilterItem(index,item.id)"
              >
                {{ item.typeName }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!--内容-->
    <div
      class="flex flex-1 model-base-content padding-left-24 padding-right-24"
      style="width: 100%;"
    >
      <!--      <div v-if="pageItemTotal>0" class="flex flex-wrap  align-start bgc-main" style="width: 100%;height: 194px;">-->
      <div v-if="loading || pageItemTotal>0" class="bgc-main" style="width: 100%;">
        <div v-loading="loading" class="card-container margin-top-16" style="width: 100%;min-height: 296px;padding-bottom: 16px;">
          <div
            v-for="item in ModelList"
            :key="item.id"
            class="flex flex-direction bgc-white model-base-content-1 hand model-base-content-container"
            style="position: relative"
            @click="clickModel(item)"
          >
            <div v-if="roleName !== '超级管理员' && item.permissionParam.mine === 0 && item.permissionParam.permission === 1" class="card-con">
              <div class="card-text permission">平台授权</div>
            </div>
            <div v-if="item.permissionParam.mine === 1" class="card-con">
              <div class="card-text mine">我发布的</div>
            </div>
            <div v-else-if="roleName !== '超级管理员' && item.permissionParam.mine === 0 && item.permissionParam.permission === 1 && item.permissionParam.valid === 0" class="card-con">
              <div class="card-text valid">已过期</div>
            </div>
            <!--图片-->
            <div class="flex model-base-content-1-image justify-center align-center">
              <img
                v-if="item.coverUrl!=undefined && item.coverUrl!=null"
                style="border-radius: 4px 4px 0 0;"
                :src="item.coverUrl"
                alt=""
                height="100%"
                width="100%"
              >
              <img v-else src="@/assets/images/pic1.png" alt="" height="100%" width="100%">
            </div>
            <!--图片下面-->
            <div class="flex flex-direction padding-left-16 padding-right-16">
              <!--标题-->
              <div class="flex font-size-16 font-weight-500 color-title model-base-content-1-title margin-top-16" style="width: 100%;">
                <span class="text-hidden" style="width: 100%;">{{ item.modelNameCh }}</span>
              </div>
              <!--标签-->
              <div class="flex model-base-content-1-bottom margin-top-8">
                <!--            background-color:#f0f0f0;    -->
                <div
                  class="flex model-base-content-1-bottom-1 font-size-12 margin-right-8 padding-top-4 padding-bottom-4 padding-left-8 padding-right-8 color-blue bgc-blue-light "
                  style="border-radius: 4px;"
                >
                  {{ item.scenesName }}
                </div>
                <!--              background-color:#f0f0f0;  -->
                <div
                  style="border-radius: 4px;"
                  class="flex model-base-content-1-bottom-1 font-size-12 margin-right-8 padding-top-4 padding-bottom-4 padding-left-8 padding-right-8 color-green bgc-green-light"
                >
                  {{ item.typeName }}
                </div>
              </div>
              <!--简介-->
              <div
                class="flex font-size-14 color-content model-base-content-1-content margin-top-8 text-hidden-3 margin-bottom-16"
                style="height: 60px;line-height: 20px;"
              >
                {{ item.modelShortDescribe }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="pageItemTotal > 12"
          class="flex justify-center align-center"
          style="width: 100%;height: 60px;"
        >
          <el-pagination
            background
            :page-size="pageSize"
            layout="total,prev, pager, next,sizes,jumper"
            :page-sizes="[12,24,36,48]"
            :current-page="pageNum"
            :total="pageItemTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div
        v-if="pageItemTotal == 0 && !loading"
        class="flex flex-1 flex-direction justify-center align-center"
        style="height: 100%;"
      >
        <div class="flex" style="width: 160px;height: 140px;">
          <img src="@/assets/images/no_search_result.png" width="100%" height="100%" alt="">
        </div>
        <div class="margin-top-8 color-title-2">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSceneCategory, getModelClassification, getModelBase, getStatusList } from '@/api/model';
import _ from 'lodash';
import InputWithSearch from '@/components/InputWithSearch';
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
  components: {
    InputWithSearch
  },
  data() {
    return {
      keyword: '',
      SceneList: [],
      SceneIndex: -1,
      SceneId: -1,
      ModelFilterIndex: -1,
      ModelFilterId: -1,
      ModelFilterList: [],
      ModelList: [],
      pageNum: 1,
      ShowSceneMoreLine: false,
      ShowModelFilterMoreLine: false,
      pageSize: 12,
      pageItemTotal: 0,
      filter: '', // 顶部搜索
      filterCode: 'all',
      filterList: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roleName', 'userId'])
  },
  created() {
    if (this.roleName === '超级管理员') {
      this.filterList = [
        {
          label: '全部',
          value: 0,
          code: 'all'
        },
        {
          label: '我发布的',
          value: 0,
          code: 'mine'
        }
      ];
    } else {
      this.filterList = [
        {
          label: '全部',
          value: 0,
          code: 'all'
        },
        {
          label: '平台授权',
          value: 0,
          code: 'common'
        },
        {
          label: '我发布的',
          value: 0,
          code: 'mine'
        },
        {
          label: '已过期',
          value: 0,
          code: 'over'
        }
      ];
    }
    this.getSceneCategory();
    this.getModelClassification();
    this.getModelBase();
    this.getStatusList();
  },
  mounted() {
  },
  methods: {
    // 获取状态列表
    getStatusList() {
      getStatusList(this.userId).then(res => {
        const data = res.data;
        if (this.roleName === '超级管理员') {
          this.filterList[0].value = data.total;
          this.filterList[1].value = data.mine;
        } else {
          this.filterList[0].value = data.total;
          this.filterList[1].value = data.permission;
          this.filterList[2].value = data.mine;
          this.filterList[3].value = data.permissionExpire;
        }
      });
    },
    // 搜索函数
    search: _.debounce(function(val) {
      this.keyword = val;
      this.pageNum = 1;
      this.getModelBase();
    }, 200),

    getModelBase() {
      this.loading = true;
      const params = {
        keywords: this.keyword,
        modelScenesId: this.SceneId === -1 ? '' : this.SceneId,
        modelTypeId: this.ModelFilterId === -1 ? '' : this.ModelFilterId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userId: this.userId
      };
      if (this.filterCode === 'all') { // 全部
        params.tag = 0;
      } else if (this.filterCode === 'common') { // 平台授权
        params.tag = 1;
      } else if (this.filterCode === 'mine') { // 我发布的
        params.tag = 5;
      } else if (this.filterCode === 'over') { // 已过期
        params.tag = 2;
      } else {
        console.error('不应该到达的地方,请检查bug!');
      }
      getModelBase(params).then(res => {
        this.ModelList = res.data.records;
        this.pageItemTotal = res.data.total;
        this.loading = false;
        document.getElementById('layout-container').scrollTop = 0;
      });
    },
    getSceneCategory() {
      getSceneCategory().then(res => {
        this.SceneList = res.data;
      });
    },
    getModelClassification() {
      getModelClassification().then(res => {
        this.ModelFilterList = res.data;
      });
    },
    clickSceneItem(index, id) {
      this.SceneIndex = index;
      this.SceneId = id;
      this.getModelBase();
    },
    // 顶部筛选按钮
    clickFilterItem(code) {
      this.filterCode = code;
      this.getModelBase();
    },
    clickModelFilterItem(index, id) {
      this.ModelFilterIndex = index;
      this.ModelFilterId = id;
      this.getModelBase();
    },
    clickModel(item) {
      // item['permissionParam']['status'] = item.modelPermissionStatusEnum;
      // 模型库都是上线的
      item['permissionParam']['status'] = 'ON_LINE';
      sessionStorage.setItem('permissionParam', JSON.stringify(item.permissionParam));
      this.$router.push({
        path: '/model-base/detail/' + item.id
      });
    },
    changeSceneNextLine() {
      this.ShowSceneMoreLine = !this.ShowSceneMoreLine;
    },
    changeModelFilterNextLine() {
      this.ShowModelFilterMoreLine = !this.ShowModelFilterMoreLine;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getModelBase();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getModelBase();
    }
  }
};
</script>

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
  height: 100%;

  .model-base-head {
    width: 100%;
    height: 50px;
    background: #FFFFFF;
  }

  .model-base-filter {
    width: calc(100% - 48px);
  }

  .model-base-content {
    width: 100%;
    border: 1px solid #EBEEF5;
    transition:.3s;
    -webkit-transition:.3s;
    .card-con {
      width: 100px;
      height: 100px;
      overflow: hidden;
      position: absolute;
      top: 0;
      right: 0;
      .card-text {
        text-align: center;
        transform: rotate(45deg);
        position: relative;
        left: 30px;
        top: 16px;
        width: 90px;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        &.mine {
          color: white;
          background-color: rgba(0, 171, 90, 1);
        }
        &.permission {
          color: white;
          background: rgba(1, 100, 255, 1);
        }
        &.valid {
          color: white;
          background: #928B85;
        }
      }
    }

    .model-base-content-container {
      &:hover {

        position: relative;
        //top: -4px;
        // background:rgba(0,0,0,0.14);
        //box-shadow: 0px 2px 18px 0px rgba(74,83,97,0.61);
        box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%);
        .buttons-container {
          display: block !important;
        }

        transition:.3s;
        -webkit-transition:.3s;
        //box-shadow: 0px 8px 8px 0px rgba(1, 100, 255, 0.14);
      }

      &:active {
        //box-shadow: 0px 8px 8px 0px rgba(1, 100, 255, 0.31);
        //top: -2px;

        //border: 1px solid #0164FF;
      }
    }

    .model-base-content-1 {
      //width: 228.37px;
      width: 100%;
      //height: 196px;
      height: 296px;
      border-radius: 4px;

      .model-base-content-1-image {
        width: 100%;
        height: 128px;
      }

    }
  }

}

</style>
