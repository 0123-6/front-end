<template>
  <div class="ProjectBaseInfo">
    <div class="ee-title jc-between">
      <span class="ee-title__text">项目基本信息</span>
      <div class="d-flex ai-center">
        <el-button v-if="form.statusCode != 4" type="primary" @click="handleForm('projectEnd')">
          <svg-icon class="el-icon--left" icon-class="forbid" width="16px" height="16px" color="red" />项目终止
        </el-button>
        <el-button type="primary" plain @click="handleForm('projectRemark')">
          <el-icon class="el-icon--left">
            <plus />
          </el-icon>添加备注
        </el-button>
      </div>
    </div>
    <el-row class="mt12" :gutter="16">
      <el-col :span="16">
        <div ref="baseInfo" class="ee-card ee-card--shadow card1">
          <div>
            <ee-tag :type="projectStatusStyles[form.statusCode]" shape="corner">{{
              getDictName(project_status, form.statusCode) || '-' }}</ee-tag>
          </div>
          <div class="pl-l pr-l pb-l mt4">
            <div class="f24 f500">{{ form.projectName || '-' }}</div>
            <div class="project-code mt10 f-l5">项目代码：<span class="ddin-n f18">{{ form.projectCode || '-' }}</span></div>
            <div class="ee-card d-flex ai-center mt16">
              <span class="f-l3">工程性质：</span>
              <span>{{ getDictName(project_type, form.projectTypeCode) }}</span>
              <span class="f-l3 ml20">供地方式：</span>
              <span>{{ getDictName(land_supply_type, form.landSupplyTypeCode) }}</span>
              <span class="f-l3 ml20">项目金额：</span>
              <span><span class="ddin-n f18">{{ form.projectAmount }}</span>{{ form.amountUnit }}</span>
            </div>
            <div class="ee-card d-flex ai-center mt12">
              <span class="f-l3">项目单位：</span>
              <span>{{ form.projectOrg }}</span>
              <span class="f-l3 ml20">地块号：</span>
              <span>{{ form.dkCode || '-' }}</span>
              <span class="f-l3 ml20">总用地面积：</span>
              <span><span :class="{ 'ddin-n f18': form.landArea }">{{ form.landArea || '-' }}</span>{{ form.landArea ?
                '平方米'
                : '' }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="relative" :span="8">
        <div class="ee-card ee-card--shadow card2 flex-y pdr4 pdb16">
          <div class="ee-title ee-title--secondary full-w mt16 ml16">
            <span class="ee-title__text">项目日志</span>
          </div>
          <div class="flex-1 full-w mt12 pdt4 pdr12 y-auto" style="padding-left: 13px;">
            <NodeTimeline :params="remarkParams" />
          </div>
        </div>
      </el-col>
    </el-row>
    <ProjectHandleForm :show="dialogVisible" :mode="mode" :params="handleParams" @success="onHandleSuccess" />
  </div>
</template>

<script>
import { projectStatusStyles } from '@/utils/constant.js'
import ProgressChart from '@/components/ProgressChart.vue';
import ProjectHandleForm from './ProjectHandleForm';
import NodeTimeline from './NodeTimeline';
import { ruProjectBaseinfo_queryById } from '@/api/pm/ruProjectBaseinfo.js'
import { mapState } from 'pinia'
import useDictStore from '@/store/modules/dict'
import useProjectStore from '@/store/modules/project'
export default {
  name: 'ProjectBaseInfo',
  components: {
    ProgressChart,
    ProjectHandleForm,
    NodeTimeline
  },
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      projectStatusStyles,
      ...useDictStore().getDicts(['project_status', 'project_type', 'land_supply_type', 'step_status', 'storage_type']),
      stepAmountProps: ['notStartSteps', 'ongoingSteps', 'stopSteps', 'completeSteps', 'delaySteps', 'delayCompleteSteps'],
      dialogVisible: false,
      mode: '',
      form: {
        "projectCode": "",
        "projectName": "",
        "projectOrg": "",
        "statusCode": "",
        "projectTypeCode": "",
        "landSupplyTypeCode": "",
        "projectAmount": '',
        "amountUnit": "",
        "projectContact": "",
        "contactPhone": "",
        "startTime": "",
        "estBuildStartTime": "",
        "estBuildEndTime": "",
        "buildStartTime": "",
        "buildEndTime": null,
        "totalSteps": '',
        "ongoingSteps": '',
        "delaySteps": 0,
        "stopSteps": 0,
        "delayCompleteSteps": 0,
        "completeSteps": 0,
        "notStartSteps": 0,
        "projectSchedule": 0
      },
      progressData: {
        percent: 0
      },
      remarkParams: {
        projectId: this.$route.params.id
      },
      handleParams: {
        projectIds: this.$route.params.id
      },
    }
  },
  computed: {
    ...mapState(useProjectStore, ['refreshRemark']),
  },
  watch: {
    params: {
      handler() {
        this.getDetail()
        this.remarkParams.refresh = !this.remarkParams.refresh
      },
      deep: true
    },
    refreshRemark() {
      this.remarkParams.refresh = !this.remarkParams.refresh
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    onHandleSuccess(type) {
      console.log('ProjectBaseInfo onHandleSuccess')
      this.remarkParams.refresh = !this.remarkParams.refresh
      if (type === 'projectEnd') {
        this.$emit('refresh')
      }
    },
    getDetail() {
      ruProjectBaseinfo_queryById({
        id: this.$route.params.id
      }).then(({ result }) => {
        this.form = {
          ...result,
        }
        this.progressData.percent = result.projectSchedule
        this.$emit('ready', result)
      })
    },
    handleForm(mode) {
      this.mode = mode
      this.dialogVisible = !this.dialogVisible
    },
    handleBack() {
      this.$router.go(-1)
    },
    handleTempList() {
      this.$router.push(`/project`)
    },
    handleDetail() {
      this.$router.push(`/project/detail/${this.projectId || 1}/0`)
    },
  }
};
</script>

<style lang="scss">
.ProjectBaseInfo {

  .card1 {
    min-height: 256px;
    background: #F3F7FB;

    .ee-card {
      padding: 14px;
    }
  }

  .card2 {
    position: absolute;
    top: 0;
    left: 10px;
    right: 10px;
    bottom: 0;
  }

  .ee-tag--corner {
    top: 0;
    left: 0;
  }

  .w100,
  .w90,
  .w75 {
    display: inline-block;
    text-align: right;
  }

  .w100 {
    width: 100px;
  }

  .w90 {
    width: 90px;
  }

  .w75 {
    width: 75px;
  }

  .total-progress {
    padding: 0px 14px;
    background: #D0E0EC;
    height: 28px;

    span {
      color: #28628C;
    }

    .el-progress-bar__inner {
      background: linear-gradient(180deg, #3478A9 0%, #86B3D3 93.51%);
      transition: width 1.5s;
    }

    .el-progress-bar__outer {
      background: #B6CFE1;
    }

    .svg-icon {
      position: absolute;
      top: 50%;
      transform: translate(-17px, -50%);
      color: #fff;
      transition: left 1.5s;
    }
  }

  .cur-nodes {
    padding: 6px 14px;
    background: #EAEFF4;
  }

  .el-tag--info {
    background: #EAEFF4;
    border-color: #EAEFF4;
    color: #929DA3;

    .el-tag__val {
      color: #4E5D75;
    }
  }

  .el-empty {
    padding: 20px;
  }

}
</style>

