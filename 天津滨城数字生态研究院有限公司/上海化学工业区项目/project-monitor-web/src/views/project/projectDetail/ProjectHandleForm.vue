<template>
  <el-dialog class="ProjectHandleForm" v-model="visible" :title="title" width="500px" :draggable="true"
    :close-on-click-modal="false" align-center>
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" :label-width="labelWidth">
      <template v-if="mode === 'nodeShift' || mode === 'shift'">
        <el-form-item label="提醒对象：" prop="userIds">
          <DeptUserCascader v-model="form.userIds" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="提醒内容：" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </template>
      <template v-else-if="mode === 'nodeRemark'">
        <el-form-item label="备注：" prop="remark" label-width="70px">
          <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </template>
      <template v-else-if="mode === 'projectEnd'">
        <el-form-item label="终止原因：" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </template>
      <template v-else-if="mode === 'projectRemark'">
        <el-form-item label="备注：" prop="remark" label-width="70px">
          <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </template>
      <template v-else-if="isOperateNode">
        <el-form-item :label="nodeLabels.date + '：'" prop="operateDate">
          <div v-loading="timeLoading" class="d-flex ai-center full-w">
            <el-date-picker class="flex-1 full-w" v-model="form.operateDate" type="date" :placeholder="nodeLabels.date"
              :clearable="false" :disabled-date="disabledDate" :format="dateFormat" :value-format="dateFormat"
              @change="changeComplateTime"></el-date-picker>
            <div v-if="mode === 'nodeComplete' && isTimeout" class="d-flex ai-center ml8 f-alert">
              <el-icon class="mr4">
                <InfoFilled />
              </el-icon>已超时
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="nodeLabels.remark + '：'" prop="operateReason">
          <el-input v-model="form.operateReason" type="textarea" :rows="5" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </template>
      <div class="d-flex ai-center jc-end">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { ruProjectBaseinfo_terminate, ruProjectBaseinfo_addRemarks, ruProjectBaseinfo_dispatchTransfer } from '@/api/pm/ruProjectBaseinfo'
import { sysUser_list } from '@/api/admin/sysUser.js'
import { ruStepAct_updateStepStatus, ruStepAct_getDelayWorked } from '@/api/pm/ruStepAct.js'
import DeptUserCascader from '../../../components/DeptUserCascader.vue'

const config = {
  projectEnd: {
    title: '项目终止',
    api: ruProjectBaseinfo_terminate,
    baseParams: {
      projectIds: 'projectId'
    },
    props: {
      reason: 'remark'
    },
  },
  projectRemark: {
    title: '添加备注',
    api: ruProjectBaseinfo_addRemarks,
    baseParams: {
      projectIds: 'projectId'
    },
    props: {
      remark: 'remark'
    }
  },
  shift: {
    title: '调度转办',
    api: ruProjectBaseinfo_dispatchTransfer,
    baseParams: {
      projectId: '',
    },
    props: {
      msg: 'remark',
    }
  },
  nodeShift: {
    title: '调度转办',
    api: ruProjectBaseinfo_dispatchTransfer,
    baseParams: {
      projectId: '',
      stepId: '',
    },
    props: {
      msg: 'remark',
    }
  },
  nodeRemark: {
    title: '添加备注',
    api: ruProjectBaseinfo_addRemarks,
    baseParams: {
      projectIds: 'projectId',
      stepId: 'stepId'
    },
    props: {
      remark: 'remark'
    }
  },
  nodeComplete: {
    title: '已完成',
    labelWidth: '125px',
    api: ruStepAct_updateStepStatus,
    baseParams: {
      projectId: '',
      periodId: '',
      stepId: '',
      statusCode: '',
    },
    props: {
      completeDate: 'operateDate',
      operateDate: 'operateDate',
      operateReason: 'operateReason'
    }
  },
  nodeContinue: {
    title: '正常推进',
    labelWidth: '125px',
    api: ruStepAct_updateStepStatus,
    baseParams: {
      projectId: '',
      periodId: '',
      stepId: '',
      statusCode: '',
    },
    props: {
      operateDate: 'operateDate',
      operateReason: 'operateReason'
    }
  },
  nodeStop: {
    title: '暂停',
    labelWidth: '125px',
    api: ruStepAct_updateStepStatus,
    baseParams: {
      projectId: '',
      periodId: '',
      stepId: '',
      statusCode: '',
    },
    props: {
      operateDate: 'operateDate',
      operateReason: 'operateReason'
    }
  }
}

export default {
  name: 'ProjectHandleForm',
  components: {
    DeptUserCascader
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    propList: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: {},
      rules: {
        remark: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符' }
        ],
        reason: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符' }
        ],
        userIds: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        condition: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        operateDate: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        operateReason: [
          { required: false, message: '请输入', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符' }
        ],
      },
      userList: [],
      isTimeout: false,
      timeLoading: false,
      dateFormat: 'YYYY-MM-DD'
    }
  },
  computed: {
    title() {
      const { name } = this.params
      return `${this.mode ? config[this.mode].title : '-'}${name ? '-' + name : ''}`
    },
    labelWidth() {
      return !this.mode || !config[this.mode].labelWidth ? '100px' : config[this.mode].labelWidth
    },
    isOperateNode() {
      return ['nodeComplete', 'nodeContinue', 'nodeStop'].indexOf(this.mode) > -1
    },
    nodeLabels() {
      if (this.mode === 'nodeComplete') {
        return {
          date: '实际完成时间',
          remark: this.isTimeout ? '超时完成原因' : '备注'
        }
      } else if (this.mode === 'nodeContinue') {
        return {
          date: this.params.curStatusCode == 2 ? '重新启动时间' : '实际开始时间',
          remark: '备注'
        }
      } else if (this.mode === 'nodeStop') {
        return {
          date: '实际暂停时间',
          remark: '暂停原因'
        }
      }
    }
  },
  watch: {
    show() {
      this.form = {}
      this.visible = true
      this.isTimeout = false
      this.rules.operateReason[0].required = false
      if (this.isOperateNode) {
        this.form.operateDate = this.$dayjs().format(this.dateFormat)
      }
      if (this.mode === 'nodeComplete') {
        this.changeComplateTime()
      } else if (this.mode === 'nodeStop') {
        this.rules.operateReason[0].required = true
      }
    },
    isTimeout(val) {
      this.rules.operateReason[0].required = val
    },
  },
  created() {
    this.visible = this.show
  },
  methods: {
    disabledDate(date) {
      return this.params.startTime && (this.mode === 'nodeStop' || this.mode === 'nodeComplete' || this.mode === 'nodeContinue') && this.$dayjs(date).isBefore(this.$dayjs(this.params.startTime))
    },
    changeComplateTime() {
      if (this.mode !== 'nodeComplete') return
      this.timeLoading = true
      const { projectId, periodId, stepId } = this.params
      ruStepAct_getDelayWorked({
        projectId, periodId, stepId,
        completeDate: this.form.operateDate,
        operateDate: this.form.operateDate,
      }).then(({ result }) => {
        this.isTimeout = result
        this.timeLoading = false
      }).catch(() => [
        this.timeLoading = false
      ])
    },
    getUserList() {
      sysUser_list().then(({ result }) => {
        this.userList = result.records
      })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { api, baseParams, props } = config[this.mode]
          if (!api) {
            this.$message.info('功能待开发')
            return
          }
          const params = {}
          Object.keys(baseParams).forEach(n => {
            params[n] = this.params[n] || this.params[baseParams[n]]
          })
          Object.keys(props).forEach(n => {
            params[n] = this.form[props[n]]
          })
          if (this.mode === 'shift' || this.mode === 'nodeShift') {
            const { userIds } = this.form
            const users = userIds.filter(n => n.indexOf('user') > -1).map(n => n.replace('user', ''))
            const depts = userIds.filter(n => n.indexOf('dept') > -1).map(n => n.replace('dept', ''))
            params.users = [{
              scopeType: 0,
              userIds: users
            }, {
              scopeType: 1,
              userIds: depts
            }].filter(n => n.userIds.length > 0)
          }
          this.loading = true
          api(params).then(({ code, message }) => {
            if (code === '00000') {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.$emit('success', this.mode)
              this.visible = false
              this.loading = false
            } else {
              this.$message({
                type: 'error',
                message,
              })
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
  }
};
</script>