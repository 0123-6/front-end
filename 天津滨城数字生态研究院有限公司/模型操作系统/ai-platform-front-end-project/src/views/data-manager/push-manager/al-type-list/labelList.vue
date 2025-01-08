<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-06 16:17:02
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-31 09:50:29
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\detail\common\labelDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="common-dataSet-label-list-container">
    <DetailCard :card-detail="dataSetDetail" :is-show-fork="false" :info-type="'push'" @back="backList" />
    <div class="detail-container">
      <div class="operation-container">
        <el-button class="prev-button" :disabled="currentIndex === 1" @click="toPrev">上一条</el-button>
        <span class="label-container">
          <span class="label-color">{{ currentIndex }}</span>/{{ dataSetDetail.taskNumber }}
        </span>
        <el-button class="next-button" :disabled="currentIndex === dataSetDetail.taskNumber" @click="toNext">下一条</el-button>
      </div>
      <router-view :key="key" />
    </div>
  </div>
</template>
<script>
import DetailCard from '@/views/data-manager/dataSet/components/DetailCard';
import { getDataSetPlatDetail, getDataSetPlatTaskList } from '@/api/data-set';
import { mapGetters } from 'vuex';
export default {
  components: {
    DetailCard
  },
  data() {
    return {
      dataSetDetail: {},
      currentIndex: 1
    };
  },
  computed: {
    ...mapGetters(['IDList', 'pageNumber']),
    key() {
      return this.$route.path;
    }
  },
  mounted() {
    this.currentIndex = this.$route.params.labelIndex * 1;
    this.getCardDetail();
  },
  methods: {
    // 返回
    backList() {
      this.$router.push({ path: `/data-manager/push/al-type-list/${this.$route.params.id}/push` });
    },
    // 获取详情信息
    getCardDetail() {
      getDataSetPlatDetail(this.$route.params.id).then(res => {
        if (res.code === '000000') {
          this.dataSetDetail = res.data;
          this.dataSetDetail.labelId = this.$route.params.labelId;
        }
      });
    },
    toPrev() {
      if (this.currentIndex === 1) {
        return;
      }
      const index = this.IDList.findIndex(item => { return item + '' === this.$route.params.labelId; });
      // 列表换页了
      if (index === -1 || index === 0) {
        getDataSetPlatTaskList({
          labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
          token: 'Token d080a2576954dd32d250b2a94380d20292c67322',
          pageNum: this.pageNumber - 1,
          pageSize: 50
        }).then(res => {
          if (res.code === '000000') {
            this.$router.push({ path: `/data-manager/push/common-label/${this.$route.params.id}/detail/${res.data.tasks[49].id}/${this.currentIndex - 1}` });
            this.$store.commit('dataSet/CLEAR_ID_LIST');
            this.$store.commit('dataSet/ADD_ID_LIST', { tableData: res.data.tasks, pageNum: this.pageNumber - 1 });
            this.currentIndex += -1;
          }
        }).catch(err => {
          console.log(err);
        });
      } else {
        this.$router.push({ path: `/data-manager/push/common-label/${this.$route.params.id}/detail/${this.IDList[index - 1]}/${this.currentIndex - 1}` });
        this.currentIndex += -1;
      }
    },
    toNext() {
      if (this.currentIndex === this.dataSetDetail.taskNumber) {
        return;
      }
      const index = this.IDList.findIndex(item => { return item + '' === this.$route.params.labelId; });
      // 列表换页了
      if (index === -1 || index === 49) {
        if (this.pageNumber === Math.ceil(this.dataSetDetail.taskNumber / 50)) {
          this.$router.push({ path: `/data-manager/push/common-label/${this.$route.params.id}/detail/${this.IDList[0]}/${this.currentIndex + 1}` });
          this.currentIndex += 1;
        } else {
          getDataSetPlatTaskList({
            labelStudioProjectId: this.dataSetDetail.labelStudioProjectId,
            token: 'Token d080a2576954dd32d250b2a94380d20292c67322',
            pageNum: this.pageNumber + 1,
            pageSize: 50
          }).then(res => {
            if (res.code === '000000') {
              this.$router.push({ path: `/data-manager/push/common-label/${this.$route.params.id}/detail/${res.data.tasks[0].id}/${this.currentIndex + 1}` });
              this.$store.commit('dataSet/CLEAR_ID_LIST');
              this.$store.commit('dataSet/ADD_ID_LIST', { tableData: res.data.tasks, pageNum: this.pageNumber + 1 });
              this.currentIndex += 1;
            }
          }).catch(err => {
            console.log(err);
          });
        }
      } else {
        this.$router.push({ path: `/data-manager/push/common-label/${this.$route.params.id}/detail/${this.IDList[index + 1]}/${this.currentIndex + 1}` });
        this.currentIndex += 1;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.common-dataSet-label-list-container {
  width: 1200px;
  padding: 16px 0;
  margin: auto;
  .detail-container {
    background: #FFFFFF;
    border-radius: 4px;
    margin-top: 16px;
    min-height: calc(100vh - 320px);
    .operation-container {
      height: 40px;
      background: #F9F8F8;
      text-align: center;
      line-height: 40px;
      .label-container {
        margin: 0 32px
      }
    }
  }
  .label-color {
    color: #0164FF;
  }

  .prev-button,.next-button {
    padding: 8px 16px;
    border-radius: 4px;
    color: #0164FF;
    &:hover {
      background: rgba(15,109,255,0.07);
    }
    &:focus {
      background: rgba(15,109,255,0.07);
    }
    &:active{
      background: rgba(15,109,255,0.07);
    }
    &:disabled{
      color: #B7B7B7;
      border: 1px solid rgba(183,183,183,1);
      background: #FFFFFF;
    }
  }
}
</style>
