<template>
  <el-container class="FlowList full-vh">
    <el-header class="ee-header pdl20 pdr20" height="64px">
      <ee-title class="mt20" title="模板管理" level="2" />
    </el-header>
    <el-main class="pdl12 pdr12" style="padding-top: 0;">
      <div class="d-flex flex-wrap">
        <div v-for="n in dataList" :key="n.name" class="FlowList__item pd12">
          <el-card class="radius16 border0 pointer" :body-style="{ padding: '0' }" shadow="always"
            @click="handleDetail(n)">
            <img class="avatar" :src="`/flowchart/cover-${n.id}.svg`">
            <div style="padding: 0 24px 3px;margin-top: 15px;">
              <div class="f20 f500">{{ n.name }}</div>
              <div class="d-flex ai-center mt8">
                <el-tag class="mr10 radius4" type="info"><span class="el-tag__val ddin f14 mr4">{{ n.stageNum
                }}</span>个阶段</el-tag>
                <el-tag class="mr10 radius4" type="info"><span class="el-tag__val ddin f14 mr4">{{ n.nodeNum
                }}</span>个环节</el-tag>
                <el-tag class="radius4" type="info"><span class="el-tag__val ddin f14 mr4">{{ n.judgeNum
                }}</span>个判断</el-tag>
              </div>
              <el-descriptions class="mt8" :column="1">
                <el-descriptions-item label="创建时间：" label-align="left" align="left" class-name="ddin-n f16">{{
                  n.createTime
                }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <!-- <el-divider class="mg0" />
            <div class="d-flex ai-center jc-around pd12">
              <el-button type="danger" link @click="handleDel(n)">
                <el-icon class="el-icon--left">
                  <Delete />
                </el-icon>删除
              </el-button>
              <el-divider direction="vertical" />
              <el-button type="primary" link @click="handleDetail(n)">
                <svg-icon class="el-icon--left" icon="eye" width="16px" height="16px" />查看
              </el-button>
              <el-divider direction="vertical" />
              <el-button type="primary" link @click="handleUse(n)">
                <svg-icon class="el-icon--left" icon="use" width="16px" height="16px" />使用
              </el-button>
            </div> -->
          </el-card>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'FlowList',
  components: {},
  data() {
    return {
      dataList: [
        {
          id: 0,
          name: '产业项目流程',
          stageNum: 6,
          nodeNum: 103,
          judgeNum: 34,
          createTime: '2022-12-23 13:02:18',
        },
        {
          id: 1,
          name: '其它项目流程',
          stageNum: 6,
          nodeNum: 74,
          judgeNum: 18,
          createTime: '2022-12-23 13:02:18',
        }
      ]
    }
  },
  computed: {

  },
  created() { },
  mounted() { },
  methods: {
    handleDel(obj) {
      this.$confirm(
        `确认删除${obj.name}吗`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        })
        .catch(() => {

        })
    },
    handleDetail(obj) {
      this.$router.push(`/flow/detail/${obj.id || 0}`)
    },
    handleUse(obj) {
      this.$router.push(`/project/form/0/${obj.id || 0}`)

    },
  }
}

</script>
<style lang='scss'>
.FlowList {
  &__item {
    width: 25%;
    min-width: 350px;
  }

  .el-card {
    position: relative;

    .avatar {
      width: 100%;
      pointer-events: none;
    }

    &:hover {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 16px;
        background: rgba(95, 95, 95, 0.20);
      }
    }
  }
}
</style>