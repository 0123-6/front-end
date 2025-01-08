<template>
  <el-container v-loading="loading" class="ProjectForm full-vh" :class="{ 'is-fullscreen': fullscreen }">
    <el-header class="ee-header d-flex ai-center pdl20" height="58px">
      <el-button class="is-single" size="small" @click="$router.go(-1)">
        <el-icon><arrow-left-bold /></el-icon>
      </el-button>
      <div class="d-flex ai-center f14 f-l3 ml12">
        <svg-icon icon-class="home-bread" width="24px" height="24px" />当前位置：
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/project' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ isEdit ? '编辑' : '创建' }}项目</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-container style="min-height:0">
      <el-aside class="ProjectForm__aside pd20 relative y-auto full-h transition-all" width="216px">
        <div class="ee-title">
          <span class="ee-title__text">{{ isEdit ? '编辑' : '创建' }}项目</span>
        </div>
        <el-form ref="form" class="mt24" :model="form" :rules="rules" label-position="top">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" type="text" placeholder="请输入" :disabled="isEdit && !isDraft" clearable />
          </el-form-item>
          <el-form-item label="项目代码" prop="projectCode">
            <el-input v-model="form.projectCode" type="text" placeholder="请输入" :disabled="codeDisabled && !isDraft"
              clearable />
          </el-form-item>
          <el-form-item v-if="!isEdit">
            <div class="flex-center full-w">
              <el-button :disabled="!form.projectName" @click="handleGetData">一键获取数据</el-button>
            </div>
          </el-form-item>
          <el-form-item label="工程性质" prop="projectTypeCode">
            <el-select v-model="form.projectTypeCode" placeholder="请选择" style="width: 100%;"
              @change="changeProjecCategory">
              <el-option v-for="item in project_type" :key="item.itemCode" :label="item.itemName"
                :value="item.itemCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="供地方式" v-if="form.projectTypeCode == 'industry_project'" prop="landSupplyTypeCode">
            <el-select v-model="form.landSupplyTypeCode" placeholder="请选择" style="width: 100%;" @change="changeLandType">
              <el-option v-for="item in land_supply_type" :key="item.itemCode" :label="item.itemName"
                :value="item.itemCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="收储" v-if="form.projectTypeCode && form.projectTypeCode != 'industry_project'"
            prop="storageTypeCode">
            <el-select v-model="form.storageTypeCode" placeholder="请选择" @change="changeStorage" style="width: 100%;">
              <el-option v-for="item in storage_type" :key="item.itemCode" :label="item.itemName"
                :value="item.itemCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目单位" prop="projectOrg">
            <el-input v-model="form.projectOrg" type="text" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="地块号" prop="dkCode">
            <el-input v-model="form.dkCode" type="text" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="总用地面积" prop="landArea">
            <el-input v-model="form.landArea" type="number" placeholder="平方米" clearable />
          </el-form-item>
          <el-form-item label="项目金额(万元)" prop="projectAmount">
            <el-input v-model="form.projectAmount" type="number" placeholder="请输入" min="0" />
          </el-form-item>
          <el-form-item label="项目开始时间" prop="startTime">
            <el-date-picker v-model="form.startTime" type="date" placeholder="项目准入申请时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width:100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="项目联系人" prop="projectContact">
            <el-input v-model="form.projectContact" type="text" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="联系人电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" type="text" placeholder="请输入" clearable />
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main class="ProjectForm__main">
        <ProjectStage ref="ProjectStage" v-show="stageList.length > 0" :isDraft="isDraft"
          :projectTypeCode="form.projectTypeCode" :default-form="defaultForm" :stageList="stageList" :autoFill="autoFill"
          @validate="validForm" @save="handleSave" @confirm="handleConfirm" :fullscreen="fullscreen"
          @fullscreen="handleFullscreen" />
        <el-empty v-show="stageList.length < 1" class="full-h ee-empty-data"
          :description="`请选择工程性质和${form.projectTypeCode === 'industry_project' ? '供地方式' : '收储'}`">
          <template #image>
            <svg-icon icon-class="empty" />
          </template>
        </el-empty>
      </el-main>
    </el-container>

    <el-dialog class="ee-messagebox" v-model="dialogVisible" title="" width="328px" draggable
      :close-on-click-modal="false" align-center :show-close="false">
      <div v-show="saveType === 0">
        <div class="d-flex ai-center">
          <el-icon color="#68CD44" size="18">
            <SuccessFilled />
          </el-icon>
          <span class="f18 f500 ml8">项目{{ isEdit ? '编辑' : '新增' }}成功</span>
        </div>
        <div class="f14 mt12 pdl28">项目中包含{{ saveResult.periodNum }}个阶段，{{ saveResult.stepNum }}个环节</div>
        <div class="d-flex ai-center jc-end mt24">
          <el-button type="primary" plain @click="handleBack">返回</el-button>
          <el-button type="primary" plain @click="goList">查看项目列表</el-button>
          <el-button type="primary" @click="handleDetail">详情</el-button>
        </div>
      </div>
      <div v-show="saveType === 1">
        <div class="d-flex ai-center">
          <el-icon color="#68CD44" size="18">
            <SuccessFilled />
          </el-icon>
          <span class="f18 f500 ml8">项目已保存</span>
        </div>
        <div class="f14 mt12 pdl28">可在草稿箱中进行查看编辑</div>
        <div class="d-flex ai-center jc-end mt24">
          <el-button type="primary" plain @click="handleBack">返回</el-button>
          <el-button type="primary" @click="goDraftList">查看草稿列表</el-button>
        </div>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { validMobile, validTel } from '@/utils/validate.js'
import ProjectStage from './ProjectStage'
import useProjectStore from '@/store/modules/project'
import useDictStore from '@/store/modules/dict'
import { periodBaseinfo_periodFlow } from '@/api/pm/periodBaseinfo.js'
import { ruProjectBaseinfo_create, ruProjectBaseinfo_edit, ruProjectBaseinfo_selectDraftProject, ruProjectBaseinfo_existCodeOrName, ruProjectBaseinfo_getAllInfo } from '@/api/pm/ruProjectBaseinfo'
let projectId = 0
const isDev = import.meta.env.VITE_APP_ENV === 'development'
export default {
  name: 'ProjectForm',
  components: { ProjectStage },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value && !validMobile(value) && !validTel(value)) {
        callback(new Error('请输入正确的联系人电话'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value) {
        // 校验项目代码
        ruProjectBaseinfo_existCodeOrName({
          remark: 0,
          projectInfo: value.trim(),
          projectId
        }).then(({ result }) => {
          if (!result) {
            callback()
          } else {
            callback(new Error('项目代码已存在'))
          }
        })
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value) {
        // 校验项目名称
        ruProjectBaseinfo_existCodeOrName({
          remark: 1,
          projectInfo: value.trim(),
          projectId
        }).then(({ result }) => {
          if (!result) {
            callback()
          } else {
            callback(new Error('项目名称已存在'))
          }
        })
      } else {
        callback()
      }
    }
    return {
      loading: false,
      visible: false,
      ...useDictStore().getDicts(['project_type', 'land_supply_type', 'storage_type']),
      form: {},
      rules: {
        projectCode: [
          { max: 50, message: '最多输入50个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' },
        ],
        projectName: [
          { required: true, message: '请输入' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' },
        ],
        projectTypeCode: [{ required: true, message: '请选择', trigger: 'change' }],
        landSupplyTypeCode: [{ required: true, message: '请选择', trigger: 'change' }],
        storageTypeCode: [{ required: true, message: '请选择', trigger: 'change' }],
        projectOrg: [
          { required: true, message: '请输入', trigger: 'change' },
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
        ],
        projectAmount: [{ required: false, message: '请输入' }],
        dkCode: [
          { max: 100, message: '最多输入100个字符', trigger: 'blur' }
        ],
        startTime: [{ required: true, message: '请选择' }],
        projectContact: [
          { required: false, message: '请输入' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' }
        ],
        contactPhone: [
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      dialogVisible: false,
      saveType: 1,
      isEdit: false,
      fullscreen: false,
      stageList: [],
      saveResult: {
        periodNum: 0,
        stepNum: 0
      },
      codeDisabled: false,
      isDraft: false,
      autoFill: false
    }
  },
  computed: {
    defaultForm() {
      return {
        land_supply_type: this.form.landSupplyTypeCode
      }
    }
  },
  watch: {
    show() {
      this.visible = true
    }
  },
  created() {
    const { id, type } = this.$route.params
    const today = this.$dayjs().format('YYYY-MM-DD')
    if (id && id !== '0') {
      projectId = id
      this.isEdit = true
      this.getDetail()
    } else {
      this.form.startTime = today
    }
    if (type && type !== '0') {
      this.form.projectTypeCode = type
      if (isDev) {
        this.form = {
          "contactPhone": "13312341234",
          "landSupplyTypeCode": type === 'industry_project' ? "land_transfer" : '',
          "projectAmount": 10000,
          "projectCode": `${this.$dayjs().format('DDHHmm')}`,
          "projectContact": "张先生",
          "projectName": `新能源zywu${this.$dayjs().format('DDHHmm')}`,
          "projectOrg": "合肥人工智能与大数据研究院",
          "projectTypeCode": type,
          "startTime": today
        }
      }
    }
    this.getStages()
  },
  mounted() {
    window.addEventListener('beforeunload', this.beforeunload);
  },
  unmounted() {
    window.removeEventListener('beforeunload', this.beforeunload);
  },
  methods: {
    formatStageList(periodActs) {
      return periodActs.map(n => ({
        ...n,
        ...n.periodBase,
        conditionList: [].concat(n.conditions),
        conditions: n.conditions.map(c => ({
          ...c,
          conditionValue: c.selectConditionItemCode,
        })),
        flowData: {
          nodeData: n.stepacts.map(n => ({
            ...n,
            name: n.stepName,
            nodeId: n.stepId,
            status: n.statusCode,
            startDept: n.startDept ? n.startDept.split(',').map(n => parseInt(n)) : [],
            acceptDept: n.acceptDept ? n.acceptDept.split(',').map(n => parseInt(n)) : [],
            coordinateDept: n.coordinateDept ? n.coordinateDept.split(',').map(n => parseInt(n)) : [],
            stepContact: n.stepContact ? parseInt(n.stepContact) : ''
          })),
          lineData: []
        },
      }))
    },
    getDetail() {
      ruProjectBaseinfo_selectDraftProject({
        projectId: this.$route.params.id
      }).then(({ result }) => {
        const { projectBase, periodActs, draftFlag } = result
        this.form = projectBase
        this.codeDisabled = !!this.form.projectCode
        this.stageList = this.formatStageList(periodActs)
        this.isDraft = draftFlag == 1
      })
    },
    handleGetData() {
      const { projectCode, projectName } = this.form
      ruProjectBaseinfo_getAllInfo({
        projectCode,
        projectName
      }).then(({ result }) => {
        const { projectBase, periodActs, draftFlag } = result
        if (!projectBase) {
          return this.$message.warning('暂无相关数据')
        }
        this.autoFill = true
        this.form = projectBase
        this.stageList = this.formatStageList(periodActs)
        this.isDraft = draftFlag == 1
      })
    },
    getStages() {
      const { landSupplyTypeCode, storageTypeCode, projectTypeCode } = this.form
      if (!projectTypeCode) return
      if (projectTypeCode === 'industry_project' && !landSupplyTypeCode) return
      if (projectTypeCode !== 'industry_project' && !storageTypeCode) return
      periodBaseinfo_periodFlow({
        landSupplyType: projectTypeCode === 'industry_project' ? landSupplyTypeCode : storageTypeCode,
        projectType: projectTypeCode
      }).then(({ result }) => {
        this.autoFill = false
        this.stageList = []
        this.$nextTick(() => {
          this.stageList = result.map(n => ({
            ...n,
            flowData: {
              nodeData: [],
              lineData: []
            },
            conditions: []
          }))
        })
      })
    },
    handleFullscreen(val) {
      this.fullscreen = val
      this.$nextTick(() => {
        setTimeout(this.$refs.ProjectStage.resetFlow, 250)
      })
    },
    beforeunload(e) {
      e.preventDefault();
    },
    changeProjecCategory() {
      this.form.landSupplyTypeCode = ''
      this.stageList = []
      this.getStages()
    },
    changeLandType() {
      this.getStages()
    },
    changeStorage() {
      this.getStages()
    },
    validForm(action) {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = false
          this.$refs.ProjectStage[action]()
        } else {
          this.loading = false
        }
      })
    },
    handleSave(stages) {
      this.saveType = 1
      this.doSave(stages)
    },
    handleConfirm(stages) {
      this.saveType = 0
      this.doSave(stages)
    },
    async doSave(stages) {
      const params = {
        draftFlag: this.saveType,
        projectBase: {
          ...this.form,
          amountUnit: "万元",
        },
        periodActs: stages
      }
      // console.log('doSave', params)
      const api = this.isEdit ? ruProjectBaseinfo_edit : ruProjectBaseinfo_create
      this.loading = true
      try {
        const { success, message, result } = await api(params)
        this.loading = false
        if (success) {
          this.onSaved(result)
        }
      } catch (error) {
        this.loading = false
      }
    },
    onSaved(result) {
      this.preventClose = false
      this.saveResult = result
      this.projectId = result.id
      this.dialogVisible = true
      useProjectStore().setRefresh()
    },
    handleBack() {
      this.$router.go(-1)
    },
    goDraftList() {
      this.$router.push(`/project/draft`)
    },
    handleDetail() {
      this.$router.push(`/project/detail/${this.projectId || 0}`)
    },
    goList() {
      this.$router.push(`/project`)
    },
  },
  async beforeRouteLeave() {
    if (this.preventClose === false || isDev) return true
    const answer = await this.$confirm(
      this.isEdit ? '是否取消编辑？取消后已修改的内容都不保存' : '是否终止项目创建？终止后已填写的内容都不保存',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    if (!answer) return false
  }
};
</script>

<style lang="scss">
.ProjectForm {
  &__aside {
    background: #FFF;
    box-shadow: 3px 0px 8px rgba(17, 35, 41, 0.09);
  }

  &__main {
    padding: 0;
    background: #F6F6F6;
  }

  &.is-fullscreen {
    .ProjectForm__aside {
      margin-left: -216px;
    }

    .ProjectStage {
      .el-header {
        margin-top: -118px;
      }
    }

    .condition-wrap {
      display: none;
    }

    .el-footer {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      height: 0 !important;
    }
  }
}
</style>

