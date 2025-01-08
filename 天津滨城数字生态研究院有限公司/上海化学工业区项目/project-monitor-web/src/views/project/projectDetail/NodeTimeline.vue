<template>
  <div class="NodeTimeline">
    <div v-if="dataList.length > 0" class="ee-timeline">
      <div v-for="(n, i) in dataList" :key="i" class="ee-timeline-item d-flex"
        :class="{ 'has-buttons': n.remarkContent !== '项目创建成功' }">
        <div class="ee-timeline-item__node">
          <div class="ee-timeline-item__icon flex-y-center ddin"></div>
        </div>
        <div class="ee-timeline-item__content ml8 flex-1">
          <div class="d-flex ai-center jc-between">
            <div class="ddin-n f16">{{ n.remarkTime }}</div>
            <div class="username f12 f-l3">{{ n.dept }}-{{ n.userName }}</div>
            <div v-if="n.remarkContent !== '项目创建成功'" class="buttons d-flex ai-center">
              <el-button v-if="!n.subTitle" type="primary" link @click="handleDel(n)">
                <svg-icon icon-class="remove" />
              </el-button>
              <el-button v-if="n.remarkContent" type="primary" link @click="handleEdit(n)" style="margin-left: 8px;">
                <svg-icon icon-class="edit" />
              </el-button>
            </div>
            <!-- <el-button v-if="showPolicy" type="primary" link>上传知识文件</el-button> -->
          </div>
          <div class="f14 mt4 ee-timeline-item__description">
            <div v-if="n.subTitle" class="f-l2 f500 ">{{ n.subTitle }}</div>
            <div v-if="n.remarkContent && !n.showInput" :class="n.subTitle ? 'f-l3' : 'f-l2 f500'">{{ n.remarkContent }}
            </div>
            <div v-if="n.showInput">
              <el-input v-model="n.remarkContent" type="textarea" :rows="4" @blur="handleSave(n)"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else class="ee-empty-data" :class="'is-' + size" description="暂无备注">
      <template #image>
        <svg-icon icon-class="empty-data" />
      </template>
    </el-empty>
  </div>
</template>

<script>
import { ruRemarkBaseinfo_historyList } from '@/api/pm/ruRemarkBaseinfo.js'

export default {
  name: 'NodeTimeline',
  components: {
  },
  props: {
    showPolicy: {
      type: Boolean,
      default: false
    },
    ellipse: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'sm'
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dataList: []
    }
  },
  watch: {
    params: {
      handler() {
        this.getData()
      },
      deep: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      // console.log('NodeTimeline params', this.params)
      if (!this.params.projectId) return
      ruRemarkBaseinfo_historyList({
        ...this.params,
        refresh: undefined
      }).then(({ result }) => {
        this.dataList = result
      })
    },
    handleSave(row) {
      if (row.remarkContent) {
        row.showInput = false
      }
    },
    handleEdit(row) {
      row.showInput = true
    },
    handleDel(row) {
      this.$message({
        type: 'info',
        message: '功能正在建设中',
      })
      // this.$confirm(
      //   '是否确认删除该备注？',
      //   '提示',
      //   {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   }
      // )
      //   .then(() => {

      //     this.dataList=this.dataList.filter(n=>n.id!==row.id)
      //     api[config.api](param).then(({ success }) => {
      //       if (success) {
      //         this.$message({
      //           type: 'success',
      //           message: config.tip + '成功',
      //         })
      //         this.getData()
      //       }
      //     })
      //   })
      //   .catch(() => { })
    }
  }
};
</script>

<style lang="scss">
.NodeTimeline {

  .ee-timeline {
    &-item {
      margin-top: 8px;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        .ee-timeline-item__node {
          &::after {
            display: none;
          }
        }
      }

      &__icon {
        position: relative;
        width: 14px;
        height: 14px;
        background: #02ADEC;
        border-radius: 100%;

        &::before {
          content: '';
          position: absolute;
          top: 3px;
          right: 2px;
          width: 5px;
          height: 5px;
          border-left: 1px solid #fff;
          border-bottom: 1px solid #fff;
        }
      }

      &__node {
        position: relative;
        margin: 5px 0 0 2px;

        &::after {
          content: '';
          position: absolute;
          top: 14px;
          bottom: -14px;
          left: 50%;
          width: 1px;
          background: #DBE1E9;
          transform: translateX(-50%);
        }
      }

      &__content {
        min-width: 0;
      }

      &__description {
        padding: 8px 10px;
        border-radius: 4px;
        background: #F6F6F6;

        >div {
          padding: 2px 0;
        }
      }

      .buttons {
        display: none;
      }

      &.has-buttons {
        &:hover {
          .username {
            display: none;
          }

          .buttons {
            display: flex;
          }
        }
      }
    }
  }

}
</style>

