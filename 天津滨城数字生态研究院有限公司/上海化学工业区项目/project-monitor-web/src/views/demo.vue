<template>
  <div class="Demo pd24">
    <div class="d-flex ai-center">
      <el-button type="primary" @click="goProjectList">跳转项目列表</el-button>
      <el-button type="primary" @click="goProjectForm">跳转创建项目</el-button>
      <el-button type="primary" @click="goProjectDetail">跳转项目详情</el-button>
      <el-button type="primary" @click="goMessageList">跳转消息通知</el-button>
	    <el-button type="primary" @click="goPolicyList">跳转知识库</el-button>
    </div>
    <div class="d-flex ai-center flex-wrap">
      <div v-for="n in icons" :key="n" class="mr16 mt16 pd4 flex-y-center" style="background: #f1f1f1;">
        <svg-icon :icon-class="n" width="32px" height="32px" color="#333" />
        <div>{{ n }}</div>
      </div>
    </div>
    <br>
    <el-alert title="svg图标放到src/assets/icons/svg目录下，会自动在这里展示" type="info" />
    <el-radio-group class="ee-radio-group mt24 " v-model="projectType">
      <el-radio-button label="所有项目">所有项目({{ statusData.totalNum }})</el-radio-button>
      <el-radio-button v-for="n in statusData.seriesData" :label="n.name" :key="n.name">{{ n.name }}({{ n.value
      }})</el-radio-button>
    </el-radio-group>
    <div class="mt24">
      <el-button type="success" @click="showMessage('success')">success</el-button>
      <el-button type="primary" @click="showMessage('info')">info</el-button>
      <el-button type="warning" @click="showMessage('warning')">warning</el-button>
      <el-button type="danger" @click="showMessage('error')">error</el-button>
    </div>
    <br>
    <div class="d-flex ai-center">
      <ee-title title="一级标题" />
      <ee-title class="ml24" title="二级标题" level="2" />
      <ee-title class="ml24" title="三级标题" level="3" />
    </div>
    <br>
    <div class="d-flex ai-center">
      <ee-tag v-for="n in constants.projectStatusList" :key="n.value" class="mr24" :type="n.type" shape="arrow">{{ n.text
      }}</ee-tag>
    </div>
    <div class="mt24 d-flex ai-center">
      <ee-tag v-for="n in constants.stepStatusList" :key="n.value" class="mr24" :type="n.type" shape="oval">{{ n.text
      }}</ee-tag>
    </div>
    <div class="mt24 d-flex ai-center">
      <ee-tag v-for="n in constants.nodeStatusList" :key="n.value" class="mr24" :type="n.type" shape="dot">{{ n.text
      }}</ee-tag>
    </div>
    <div class="mt24 d-flex ai-center">
      <ee-tag v-for="n in constants.fileStatusList" :key="n.value" class="mr24" :type="n.type" shape="round-rect">{{
        n.text
      }}</ee-tag>
    </div>
    <div class="mt24">
      <div class="ee-alert d-flex ai-center">
        <svg-icon icon-class="info-circle" width="16px" height="16px" />
        <div class="ee-alert__text">说明：关注内容会根据配置的规则显示，若规则都清空，则关注内容模块隐藏不显示</div>
      </div>
    </div>
    <ee-conditions class="mt20" :data="conditions" />
    <ee-checker class="mt20" :value="3" />
    <el-radio-group class="ee-capsule mt24" v-model="radio1">
      <el-radio-button label="常用功能设置" />
      <el-radio-button label="工作台设置" />
    </el-radio-group>
    <div class="mt24 d-flex ai-center">
      <ring-chart :data="progressData" :options="progressOptions" width="544px" height="266px" />
      <bar-chart class="ml24" :data="progressData" width="544px" height="266px" />
    </div>

  </div>
</template>

<script>
import * as constants from '@/utils/constant.js'
import RingChart from '@/components/RingChart'
import BarChart from '@/components/BarChart'
import icons from '@/utils/requireIcons'
import EeConditions from '@/components/EeConditions.vue'
import EeChecker from '@/components/EeChecker.vue'
export default {
  name: 'Demo',
  components: { RingChart, BarChart, EeConditions, EeChecker },
  data() {
    return {
      icons,
      constants,
      statusData: {
        totalNum: 142,
        seriesData: [
          { name: '已终止', value: 32 },
          { name: '正常推进', value: 62 },
          { name: '已延期', value: 18 },
          // { name: '即将延期', value: 15 },
          { name: '已完成', value: 15 },
        ].map(n => {
          n.percent = Math.round(n.value * 100 / 142)
          return n
        })
      },
      projectType: '所有项目',
      radio1: '常用功能设置',

      progressData: {
        totalNum: 142,
        unit: '个',
        seriesData: [
          { name: '项目准入/项目决策', value: 32 },
          { name: '土地存储', value: 47 },
          { name: '土地供应', value: 18 },
          { name: '前期审批', value: 15 },
          { name: '项目建设', value: 15 },
          { name: '绩效监管/运行维护', value: 15 },
        ].map(n => {
          n.percent = Math.round(n.value * 100 / 142)
          return n
        })
      },
      progressOptions: {
        color: ['#DDDFE1', '#BECDF9', '#9BA2E2', '#436FF6', '#74CBF6', '#BCE6F9'],
        legend: {
          right: 33
        },
        nameWidth: 129,
        series: {
          center: [126, '50%']
        }
      },
      conditions: [{
        label: '关键词',
        value: '上海',
        text: '上海',
      }, {
        label: '项目状态',
        value: '1',
        text: '正常推进',
      }]
    }
  },
  methods: {
    goProjectList() {
      // 参数参考接口：/ruProjectBaseinfo/queryProjectManagePage
      this.$router.push({
        name: 'ProjectList',
        state: {
          params: {
            projectHandleCode: 'project_start_soon',
            "projectTypeCodeList": [
              "industry_project"
            ],
            "projectStatusList": [
              "1"
            ],
            "keyword": "关键词",
            "periodStepReps": [
              {
                "periodId": "10001",
                "periodName": '项目准入',
                "stepIds": [
                  "1"
                ],
                // "stepNames": '准入申请',
              }
            ],
            "minInvestAmount": "1",
            "maxInvestAmount": "1000",
            "projectConditionReqs": [
              {
                "conditionCode": "land_supply_type",
                "conditionValue": "land_sale"
              },
              {
                "conditionCode": "energy_consumption",
                "conditionValue": "1"
              },
              {
                "conditionCode": "land_supply",
                "conditionValue": "yes"
              }
            ],
            "periodEstStartBeginTime": "2023-12-04",
            "periodEstStartEndTime": "2023-12-04",
            "periodEstEndBeginTime": "2024-01-28",
            "periodEstEndEndTime": "2024-01-28",
            "stepEstStartBeginTime": "2023-12-05",
            "stepEstStartEndTime": "2023-12-05",
            "stepEstEndBeginTime": "2023-12-30",
            "stepEstEndEndTime": "2023-12-30",
            "projectEstStartBeginTime": "2023-12-04",
            "projectEstStartEndTime": "2023-12-22",
            "projectEstEndBeginTime": "2023-12-21",
            "projectEstEndEndTime": "2023-12-21",
            "projectStartBeginTime": "2023-12-22",
            "projectStartEndTime": "2023-12-22"
          }
        }
      })
    },
    goProjectForm() {
      this.$router.push({
        path: '/project/form/0/0'
      })
    },
    goProjectDetail() {
      this.$router.push({
        path: '/project/detail/16'
      })
    },
    goMessageList() {
      this.$router.push({
        path: `/message`,
        state: {
          params: {
            messageType: 'progress'
          }
        }
      })
    },
    showMessage(type) {
      this.$message({
        message: type,
        type,
        duration: 0,
        showClose: true
      })
    },
	  // 跳转到知识库页面
	  goPolicyList() {
		  this.$router.push({
			  name: 'Policy',
			  state: {
				  params: {
					  "labelId": 'y_paiW',
					  "labelType": 1,
				  }
			  }
		  });
	  }
  }
};
</script>

