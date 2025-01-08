<template>
  <div class="ProjectMilestone">
    <div class="ee-title jc-between">
      <span class="ee-title__text">进度总览</span>
      <!-- <el-button type="primary" link @click="timeGridVisible = !timeGridVisible">
        环节时间表<el-icon class="el-icon--right f-l3"><arrow-right /></el-icon>
      </el-button> -->
    </div>
    <div class="ee-card mt12">
      <div class="ee-thead d-flex ai-center">
        <div class="ee-th ell" v-for="n in stageList" :key="n.periodId" :title="n.periodName"
          :style="{ width: `${n.periodLocation}%` }">
          {{ n.periodName }}</div>
      </div>
      <div class="ee-tbody d-flex ai-center relative"
        :class="`progress-style-${progressStatus} ${buildStarted ? 'is-build-started' : ''}`">
        <div class="progress-area area-build absolute" :style="{ width: `${buildStep.stepLocation}%` }"></div>
        <div class="progress-area area-plan absolute" :style="{ width: `${progressData.esStepProgress}%` }"></div>
        <div class="progress-area area-current absolute"
          :style="{ width: `${buildStarted ? 0 : progressData.startBuildProgress}%` }">
        </div>
        <div class="milestone-progress absolute">
          <div class="apply-step absolute"><span class="ddin-n">{{ baseInfo.startTime || '' }}</span>{{
            baseInfo.projectTypeCode == 'industry_project' ? '准入申请' : '提出建设需求' }}</div>
          <div v-if="progressData.startBuildProgress || buildStarted" class="milestone-progress__inner"
            :style="{ width: `${progressData.startBuildProgress}%` }">
            <div class="milestone-progress__txt d-flex ai-center jc-end">
              <template v-if="buildCompleted && progressData.endBuildDays">已竣工<span class="f20 ddin">{{
                progressData.endBuildDays || 0
              }}</span>天</template>
              <template v-else-if="buildStarted && progressData.startedBuildDays">已开工<span class="f20 ddin">{{
                progressData.startedBuildDays || 0
              }}</span>天</template>
              <template v-else-if="progressData.differenceDays < 0">超时<span class="f20 ddin">{{
                Math.abs(progressData.differenceDays)
                || 0
              }}</span>天</template>
              <template v-else-if="progressData.differenceDays > 0">提前<span class="f20 ddin">{{
                progressData.differenceDays
                || 0 }}</span>天</template>
            </div>
          </div>
          <el-icon class="icon-caret-right" :size="68" color="#DBE1E9">
            <CaretRight />
          </el-icon>
        </div>
        <div class="current-step absolute" :style="currentStepStyle">
          <el-tooltip v-if="!buildStarted" popper-class="milestone-tooltip" effect="dark" placement="right"
            trigger="hover">
            <svg-icon :icon-class="'rocket-' + progressStatus" width="38px" height="38px" />
            <template #content>
              <div class="f16 txt-label">当前环节：</div>
              <div class="f16 mt4">{{ progressData.currentSteps || '-' }}</div>
            </template>
          </el-tooltip>
          <svg-icon v-else :icon-class="'rocket-' + progressStatus" width="38px" height="38px" />
        </div>
        <div v-if="!buildStarted" class="plan-step absolute"
          :style="{ left: progressData.esStepProgress == 0 ? '13px' : `${progressData.esStepProgress}%` }">
          <el-tooltip popper-class="milestone-tooltip is-hidden" effect="dark" placement="right" trigger="hover">
            <div class="plan-step__inner flex-center relative">计划节点</div>
            <template #content>
              <div class="f16 txt-label">计划节点：</div>
              <div class="f16 mt4">{{ progressData.esSteps }}</div>
            </template>
          </el-tooltip>
        </div>
        <div class="milestone-node" v-for="(n, i) in milestones" :key="n.keyStep"
          :class="`status-${n.statusCode} position-${i % 2}`" :style="{ left: `${n.stepLocation}%` }">
          <el-icon v-if="n.statusCode == 2" class="icon-circle-check" :size="20" color="#658EAD">
            <CircleCheck />
          </el-icon>
          <div v-else class="icon-circle"></div>
          <el-tooltip
            :popper-class="`milestone-tooltip space-pre ${n.keyStep == '投产' || n.keyStep == '达产' ? 'is-hidden' : ''}`"
            effect="dark" placement="right" trigger="hover">
            <template #content>
              <template v-if="n.statusCode == 0 || n.statusCode == 1">
                <div v-if="i == 3" class="milestone-tooltip__row f16">
                  <span>预计 </span>
                  <span class="ddin f20 f-success">{{ n.esDays || 0 }}</span>
                  <span> 天后开工</span>
                </div>
                <div v-else-if="['竣工', '拿证', '投产', '达产'].indexOf(n.keyStep) < 0" class="milestone-tooltip__row f16">
                  <span class="txt-label">预计结束时间：</span>
                  <span class="ddin-n f18">{{ n.esEndDate || '-' }}</span>
                </div>
              </template>
              <template v-else-if="n.statusCode">
                <div v-if="i < 4" class="milestone-tooltip__row f16 d-flex ai-center">
                  <span>准入申请到{{ n.keyStep }}，承诺用时 </span>
                  <span class="ddin f20 f-success">{{ n.esDays || 0 }}</span>
                  <span> 天，实际用时 </span>
                  <span class="ddin f20 f-success">{{ n.usedDays || 0 }}</span>
                  <span> 天</span>
                </div>
                <div v-if="i > 0" class="milestone-tooltip__row f16 d-flex ai-center">
                  <span>{{ milestones[i - 1].keyStep }}到{{ n.keyStep }}，承诺用时 </span>
                  <span class="ddin f20 f-success">{{ n.subEsDays || 0 }}</span>
                  <span> 天，实际用时 </span>
                  <span class="ddin f20 f-success">{{ n.subUsedDays || 0 }}</span>
                  <span> 天</span>
                </div>
                <div class="milestone-tooltip__row f16">
                  <span class="txt-label">实际结束时间：</span>
                  <span class="ddin-n f18">{{ n.endDate || '-' }}</span>
                </div>
              </template>
              <div class="milestone-tooltip__row f16">
                <span class="txt-label">{{ n.keyStep }}：</span>
                <span>{{ n.stepDesc }}</span>
              </div>
            </template>
            <div class="milestone-node__inner">
              {{ n.keyStep }}
              <el-icon class="icon-caret-top" :size="20" :color="n.statusCode == 0 ? '#B0BFC9' : '#658EAD'">
                <CaretTop v-if="i % 2 == 0" />
                <CaretBottom v-else />
              </el-icon>
            </div>
          </el-tooltip>
        </div>
        <div class="count-days d-flex ai-center" :style="{ width: `${buildStep.stepLocation}%` }">
          <el-icon class="ml20">
            <Clock />
          </el-icon>
          <span> 法定：</span>
          <span class="ddin f18">{{ progressData.fdEsDays || 0 }}</span>
          <span>天 <span class="divider">|</span> 承诺：</span>
          <span class="ddin f18">{{ progressData.promiseEsDays || 0 }}</span>
          <span>天 <span class="divider">|</span> 已用时：</span>
          <span class="ddin f18">{{ progressData.usedDays || 0 }}</span>
          <span>天</span>
        </div>
        <div class="ee-td" v-for="n in stageList" :key="n.periodId" :style="{ width: `${n.periodLocation}%` }"></div>
      </div>
      <div class="step-count d-flex ai-center relative">
        <span class="ddin f20">{{ countStep.totalStep || 0 }}</span>
        <span> 个环节：已完成 </span>
        <span class="ddin f20 f-success pointer" @click="openNodeDetail(['3', '5'])">{{ countStep.completeStep || 0
        }}</span>
        <span> 个环节，其中 </span>
        <span class="ddin f20 f-primary pointer" @click="openNodeDetail(['3'])">{{ countStep.normalStep || 0 }}</span>
        <span> 个按时完成，</span>
        <span class="ddin f20 f-alert pointer" @click="openNodeDetail(['5'])">{{ countStep.delayStep || 0 }}</span>
        <span> 个超时完成</span>
      </div>
    </div>
    <ProjectNodeTime :show="drawerVisible" :params="nodeTimeParams" />
    <!-- <ProjectNodeTimeGrid :show="timeGridVisible" /> -->
  </div>
</template>

<script>
import ProjectNodeTime from './ProjectNodeTime';
import * as api from '@/api/pm/ruProjectBaseinfo.js'
import * as stepActApi from '@/api/pm/ruStepAct.js'
import useDictStore from '@/store/modules/dict'
import ProjectNodeTimeGrid from '../ProjectNodeTimeGrid';
export default {
  name: 'ProjectMilestone',
  components: {
    ProjectNodeTime,
    // ProjectNodeTimeGrid
  },
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      ...useDictStore().getDicts(['step_status']),
      drawerVisible: false,
      form: {},
      nodeTimeParams: {},
      countStep: {},
      stageList: [],
      milestones: [],
      progressData: {},
      buildStep: {},
      buildStarted: false,
      buildCompleted: false,
      timeGridVisible: false
    }
  },
  computed: {
    periodId() {
      return this.stageList.length > 0 && this.curStage !== '' ? this.stageList[this.curStage].periodId : ''
    },
    progressStatus() {
      if (this.buildStarted || this.buildCompleted) return 'primary'
      if (typeof this.progressData.differenceDays === 'undefined') return ''
      if (this.progressData.differenceDays >= 0) return 'success'
      return 'danger'
    },
    currentStepStyle() {
      return {
        left: this.progressData.startBuildProgress == 0 ? `16px` : `${this.progressData.startBuildProgress}%`
      }
    }
  },
  watch: {
    params: {
      handler() {
        this.getDetail()
      },
      deep: true
    }
  },
  created() {
    this.projectId = this.$route.params.id
    this.getDetail()
  },
  methods: {
    getDetail() {
      stepActApi.ruStepAct_stepStatusStatistics({ projectId: this.projectId }).then(({ result }) => {
        const { total, statusList } = result
        const normalStep = statusList.find(n => n.name == '按时完成').value
        const delayStep = statusList.find(n => n.name == '超时完成').value
        this.countStep = {
          totalStep: total,
          completeStep: normalStep + delayStep,
          normalStep,
          delayStep
        }
      })
      api.ruProjectBaseinfo_projectAllProgress({ projectId: this.projectId }).then(({ result }) => {
        const { keyStepRespList, periodProgressRespList } = result
        // keyStepRespList[3].statusCode = 2
        // keyStepRespList[4].statusCode = 2
        // result.differenceDays = 10
        this.stageList = periodProgressRespList
        this.milestones = keyStepRespList.map(n => {
          n.statusCode = n.statusCode || 0
          return n
        })
        this.buildStep = keyStepRespList.find(n => n.keyStep === '开工')
        this.buildStarted = this.buildStep.statusCode == 2
        this.buildCompleted = keyStepRespList.find(n => n.keyStep === '竣工').statusCode == 2
        this.progressData = {
          ...result,
          keyStepRespList: null,
          // esStepProgress: 75,
          // startBuildProgress: 78,
          // differenceDays: 3
        }
      })
    },
    openNodeDetail(stepStatusList) {
      this.nodeTimeParams = {
        stepStatusList,
        stepType: ''
      }
      this.drawerVisible = !this.drawerVisible
    },
    handleBack() {
      this.$router.go(-1)
    },
  }
};
</script>

<style lang="scss">
.ProjectMilestone {
  .ee-card {
    min-height: 379px;
    background: #f5f5f5;
  }

  .ee-thead {
    height: 45px;
  }

  .ee-th {
    position: relative;
    padding: 0 5px;
    // min-width: 10%;
    height: 45px;
    line-height: 45px;
    background: linear-gradient(180deg, rgba(52, 120, 169, 0.80) 5.12%, rgba(134, 179, 211, 0.80) 127.99%);
    text-align: center;
    color: #fff;
    font-size: 18px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      background: #fff;
    }

    &:first-child {
      border-top-left-radius: 16px;
    }

    &:last-child {
      border-top-right-radius: 16px;

      &::after {
        width: 0;
      }
    }
  }

  .ee-tbody {
    height: 276px;
  }

  .ee-td {
    position: relative;
    // min-width: 10%;
    height: 276px;
    z-index: 4;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      background: rgba(0, 0, 0, 0.1);
    }

    &:last-child {
      &::after {
        width: 0;
      }
    }
  }

  .progress-area {
    top: 0;
    left: 0;
    height: 100%;
  }

  .area-build {
    width: 50%;
    background: #f4f7fb;
    box-shadow: 3px 0px 8px rgba(17, 35, 41, 0.09);
    z-index: 1;
  }

  .area-plan {
    width: 40%;
    background: #f4f7fb;
    z-index: 2;
  }

  .area-current {
    width: 30%;
    background: #f4f7fb;
    z-index: 3;
  }

  .milestone-progress {
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    height: 30px;
    background: #DBE1E9;
    border-radius: 15px;
    z-index: 4;

    &__inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      color: #fff;
      text-align: right;
      // transition: width .3s;

      &.is-build {
        border-radius: 0;
      }
    }

    &__txt {
      position: absolute;
      right: 20px;
      top: 0;
      bottom: 0;
      min-width: 100px;
    }

    .icon-caret-right {
      position: absolute;
      top: 50%;
      right: -16px;
      transform: translateY(-50%);
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 20px;
      background: #f5f5f5;
    }
  }

  .progress-style- {
    &danger {
      .milestone-progress__inner {
        background: #E85050;
      }

      .current-step {
        background: #E85050;
      }

      .area-plan {
        background: rgba(232, 80, 80, 0.1);
      }
    }

    &success {
      .milestone-progress__inner {
        background: #68CD44;
      }

      .current-step {
        background: #68CD44;
      }


      .area-plan {
        background: #f4f7fb;
        z-index: 3;
      }

      .area-current {
        background: rgba(104, 205, 68, 0.1);
        z-index: 2;
      }
    }

    &primary {
      .milestone-progress__inner {
        background: #02ADEC;
      }

      .current-step {
        background: #02ADEC;
      }
    }
  }

  .is-build-started {
    .area-plan {
      background: #f4f7fb !important;
    }
  }

  .apply-step {
    top: -40px;
    left: 13px;
    padding-left: 8px;
    color: #4C687B;

    &::before {
      content: '';
      position: absolute;
      left: -3px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: #4C687B;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateX(-50%);
      height: 29px;
      border-left: 1px dashed #4C687B;
    }
  }

  .current-step {
    top: 0;
    bottom: 0;
    left: 13px;
    width: 1px;
    background: #02ADEC;
    z-index: 6;
    color: #fff;
    transition: left 0.3s;

    .svg-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 38px;
      height: 38px;
    }
  }

  .plan-step {
    left: 13px;
    top: 24px;
    width: 20px;
    height: 80px;
    z-index: 5;
    transform: translateX(-10px);

    &__inner {
      width: 20px;
      height: 80px;
      background: #FAB752;
      color: #fff;
      text-align: center;
      line-height: 18px;
      z-index: 2;
      border-radius: 4px;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -22px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: #FAB752;
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: -24px;
      bottom: -172px;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      background: #FAB752;
      z-index: 1;
    }
  }

  .milestone-node {
    position: absolute;
    top: 43px;
    margin-left: -22px;
    width: 44px;
    height: 80px;
    z-index: 7;

    &__inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 44px;
      height: 28px;
      line-height: 28px;
      border-radius: 4px;
      background: #658EAD;
      color: #fff;
      text-align: center;
      z-index: 1;

      .icon-caret-top {
        position: absolute;
        top: 19px;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .icon-circle,
    .icon-circle-check {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #fff;
      border-radius: 100%;
      z-index: 2;
    }

    .icon-circle {
      width: 18px;
      height: 18px;
      border-radius: 100%;
      border: 1px solid #658EAD;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: #658EAD;
      z-index: 2;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      border-left: 1px dashed #658EAD;
    }

    &.status-0 {
      .milestone-node {
        &__inner {
          background: #B0BFC9;
        }
      }

      .icon-circle {
        border-color: #BBBBBB;
      }

      &::before {
        content: '';
        background: #BBBBBB;
      }


      &::after {
        border-color: #BBBBBB;
      }
    }

    &.position-0 {
      top: 153px;

      .milestone-node {
        &__inner {
          top: initial;
          bottom: 0;

          .icon-caret-top {
            top: -12px;
          }
        }
      }

      .icon-circle,
      .icon-circle-check {
        bottom: initial;
        top: 16px;
      }

      &::before {
        content: '';
        top: -3px;
        bottom: initial;
      }
    }
  }

  .count-days {
    position: absolute;
    bottom: 0;
    left: 0px;
    height: 40px;
    line-height: 40px;
    background: rgba(216, 225, 233, 0.5);
    border-left: 3px solid #3374A4;
    border-right: 3px solid #3374A4;
    color: #6F8290;
    white-space: pre;
    z-index: 5;

    .divider {
      margin: 0 4px;
      color: #ADADAD;
    }
  }

  .step-count {
    padding: 14px 20px;
    background: #fff;
    box-shadow: 0px 0px 8px rgba(17, 35, 41, 0.09);
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    white-space: pre;
    z-index: 5;
  }
}

.milestone-tooltip {
  padding: 8px 10px;

  &.is-hidden {
    display: none !important;
  }

  &__row {
    padding: 3px 0;
  }

  .txt-label {
    color: #C1C1C1;
  }
}
</style>

