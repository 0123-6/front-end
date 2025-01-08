<template>
  <el-dialog class="ProjectNodeForm" v-model="dialogVisible" :title="`${Math.abs(data.nodeId)}.${data.name}`"
    width="432px" :draggable="true" :close-on-click-modal="false" align-center>
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="发起部门:" prop="startDept">
        <el-tree-select v-model="form.startDept" :data="deptList" placeholder="请选择部门" multiple show-checkbox collapse-tags
          check-strictly check-on-click-node :props="treeProps" node-key="id" label="name" value="id" default-expand-all
          style="width: 100%;" />
      </el-form-item>
      <el-form-item label="受理或经办部门:" prop="acceptDept">
        <el-tree-select v-model="form.acceptDept" :data="deptList" placeholder="请选择部门" multiple show-checkbox
          collapse-tags check-strictly check-on-click-node :props="treeProps" node-key="id" label="name" value="id"
          default-expand-all style="width: 100%;" />
      </el-form-item>
      <el-form-item label="协调部门:" prop="coordinateDept">
        <el-tree-select v-model="form.coordinateDept" :data="deptList" placeholder="请选择部门" multiple show-checkbox
          collapse-tags check-strictly check-on-click-node :props="treeProps" node-key="id" label="name" value="id"
          default-expand-all style="width: 100%;" />
      </el-form-item>
      <el-form-item label="联系人:" prop="stepContact">
        <el-select v-model="form.stepContact" placeholder="请选择" filterable style="width: 100%;">
          <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
        </el-select>
      </el-form-item>
      <div class="d-flex ai-center">
        <el-form-item class="flex-1" label="法定时限:" prop="stepDurationFd">
          <el-input v-model="form.stepDurationFd" type="number" placeholder="请输入" min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item class="ml16" label-width="0px" style="width: 120px;">

        </el-form-item>
      </div>
      <div class="d-flex ai-center">
        <el-form-item class="flex-1" label="承诺时限:" prop="stepDuration">
          <el-input v-model="form.stepDuration" type="number" placeholder="请输入" min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item class="ml16" prop="durationTypeCode" label-width="0px" style="width: 120px;">
          <el-select v-model="form.durationTypeCode" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in duration_type" :key="item.itemCode" :label="item.itemName" :value="item.itemCode" />
          </el-select>
        </el-form-item>
      </div>
      <div class="d-flex ai-center jc-end">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import useDictStore from '@/store/modules/dict'
import { dayTypeList } from '@/utils/constant.js'
import { sysUser_list } from '@/api/admin/sysUser.js'
import { sysDepartment_getAll } from '@/api/admin/sysDepartment.js'

let initialFormVal = {}

export default {
  name: 'ProjectNodeForm',
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      ...useDictStore().getDicts(['duration_type']),
      dialogVisible: false,
      dayTypeList,
      testOptions: [{ itemName: '选项', itemCode: '1' },],
      userList: [],
      deptList: [],
      form: {
        durationTypeCode: 'work_day'
      },
      rules: {
        stepDuration: [{ required: true, message: '请输入' }],
        stepDurationFd: [{ required: true, message: '请输入' }],
        durationTypeCode: [{ required: true, message: '请选择' }],
      },
      treeProps: {
        label: 'name',
        children: 'children',
      }
    }
  },
  computed: {},
  watch: {
    show() {
      this.dialogVisible = true
    },
    data(val) {
      initialFormVal = JSON.parse(JSON.stringify(val))
      this.form = val
    }
  },
  created() {
    this.dialogVisible = !!this.show
    this.getUserList()
    this.getDeptList()
  },
  methods: {
    getUserList() {
      sysUser_list().then(({ result }) => {
        this.userList = result.userList
      })
    },
    getDeptList() {
      sysDepartment_getAll().then(({ result }) => {
        this.deptList = result
      })
    },
    handleCancel() {
      this.dialogVisible = false
      this.form = JSON.parse(JSON.stringify(initialFormVal))
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.$message({
          //   type: 'success',
          //   message: '保存成功'
          // })
          this.dialogVisible = false
        }
      })
    },
  }
};
</script>

<style lang="scss">
.ProjectNodeForm {}
</style>

