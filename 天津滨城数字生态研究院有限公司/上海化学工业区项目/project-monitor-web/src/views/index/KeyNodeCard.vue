<template>
  <div v-loading="loading" element-loading-background="transparent" element-loading-spinner="none"
    class="KeyNodeCard ee-card">
    <ProjectTypeCount :data="countData" @change="changeType" />
    <div class="d-flex ai-center mt16">
      <KeyNodeDist class="w-[32.5%] min-w-[560px]" :data="keyNodeList" @change-node="changeNode" />
      <ProjectSimpleList class="flex-1" :data="projectData" @view="handleView" style="min-width: 0;" />
    </div>
  </div>
</template>

<script>
import KeyNodeDist from '../../components/KeyNodeDist.vue';
import ProjectTypeCount from '../../components/ProjectTypeCount.vue'
import ProjectSimpleList from '../../components/ProjectSimpleList.vue';
import { dataItem_queryKeyStepsAll } from '@/api/pm/dataItem.js'
import { ruProjectBaseinfo_keyStepDistribution } from '@/api/pm/ruProjectBaseinfo.js'
export default {
  name: 'KeyNodeCard',
  components: {
    KeyNodeDist,
    ProjectTypeCount,
    ProjectSimpleList
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      loading: false,
      projectType: '0',
      keyNodeList: [
        {
          name: '立项',
          code: 'approval'
        },
        {
          name: '拿地',
          code: 'landPermit'
        },
        {
          name: '方案',
          code: 'scheme'
        },
        {
          name: '开工',
          code: 'start'
        },
        {
          name: '竣工',
          code: 'completed'
        },
      ],
      keyNodeData: [],
      curNode: '',
      countData: {},
      keyNodeCount: {},
      projectData: [],
    }
  },
  computed: {
    projectTypeAlias() {
      return this.projectType === 'industry_project' ? 'industry' : 'other'
    }
  },
  created() {
    this.curNode = this.keyNodeList[0].code
    this.getKeyNode()
  },
  methods: {
    changeType(e) {
      this.projectType = e
      this.getProject()
    },
    getKeyNode() {
      dataItem_queryKeyStepsAll().then(({ result }) => {
        this.keyNodeData = result
        this.getProject()
      })
    },
    changeNode(e) {
      this.curNode = e.code
      this.getProject()
    },
    getProject() {
      const stepList = this.keyNodeData[`${this.curNode}List`]
      this.loading = false
      ruProjectBaseinfo_keyStepDistribution({
        projectType: this.projectType === '0' ? '' : this.projectType,
        stepList: this.projectType === '0' ? stepList : stepList.filter(n => n.projectType === this.projectTypeAlias)
      }).then(({ result }) => {
        const { allProjectNum, bridgeProjectNum, facilityProjectNum, industryProjectNum, municipalProjectNum } = result
        this.countData = {
          all: allProjectNum,
          bridge: bridgeProjectNum,
          facility: facilityProjectNum,
          industry: industryProjectNum,
          municipal: municipalProjectNum,
        }
        this.keyNodeList.forEach(n => {
          n.num = result[`${n.code}Num`]
          n.steps = {
            industry: this.keyNodeData[`${n.code}List`].filter(n => n.projectType === 'industry'),
            other: this.keyNodeData[`${n.code}List`].filter(n => n.projectType === 'other'),
          }
        })
        this.projectData = result.projectList
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleView() {
      const allSteps = this.keyNodeData[`${this.curNode}List`]
      let steps = allSteps
      if (this.projectType !== '0') {
        steps = allSteps.filter(n => n.projectType === this.projectTypeAlias)
      }
      const pSteps = []
      steps.forEach(n => {
        if (!pSteps.find(m => m.periodId === n.periodId)) {
          const theSteps = steps.filter(m => m.periodId === n.periodId)
          pSteps.push({
            periodId: n.periodId,
            periodName: n.periodName,
            stepIds: theSteps.map(m => m.stepId),
            stepNames: theSteps.map(m => m.stepName).join('、'),
          })
        }
      })
      this.$router.push({
        name: 'ProjectList',
        state: {
          params: {
            projectTypeCodeList: this.projectType === '0' ? [] : [
              this.projectType
            ],
            periodStepReps: pSteps,
          }
        }
      })
    }
  }
};
</script>

<style lang="scss">
.KeyNodeCard {
  padding: 0 20px 20px;

  .KeyNodeDist {
    margin-right: 20px;
    border-right: 1px dashed #DBE1E9;
  }
}
</style>