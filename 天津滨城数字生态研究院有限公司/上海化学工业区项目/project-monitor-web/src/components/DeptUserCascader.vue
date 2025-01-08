<template>
  <el-cascader :props="props" :options="options" collapse-tags />
</template>

<script>
import { sysDepartment_list } from '@/api/admin/sysDepartment.js'
import { sysUser_list } from '@/api/admin/sysUser.js'
export default {
  name: 'DeptUserCascader',
  data() {
    return {
      props: {
        value: 'id',
        label: 'name',
        multiple: true,
        checkStrictly: true,
        emitPath: false,
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data } = node
          if (level == 1) {
            this.getUserList(data.id.replace('dept', ''), resolve)
          } else {
            resolve([])
          }
        },
      },
      options: []
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    getUserList(deptId, resolve) {
      sysUser_list({ deptId }).then(({ result }) => {
        resolve((result.userList || []).map(n => ({
          id: `user${n.id}`,
          name: n.realName,
          leaf: true
        })))
      })
    },
    getDeptList() {
      sysDepartment_list().then(({ result }) => {
        this.options = result.records.map(n => ({
          id: `dept${n.id}`,
          name: n.name,
        }))
      })
    },
  }
};
</script>