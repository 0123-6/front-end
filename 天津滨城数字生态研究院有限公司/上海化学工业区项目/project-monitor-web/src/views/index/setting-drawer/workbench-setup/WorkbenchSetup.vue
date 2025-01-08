<template>
  <!--最外层-->
  <div class="workbench-setup flex-grow flex-shrink-0 w-full flex flex-col">
    <!--上面内容-->
    <div class="w-full flex-1 flex flex-col" v-loading="loading">
      <!--项目处理进度分布-->
      <div class="flex justify-between items-center">
        <title-comp title="项目处理进度分布" :type="2" />
        <el-checkbox v-model="show1" label="不显示" size="large" />
      </div>
      <div class="w-full flex flex-col">
        <!--即将处理项目规则设置-->
        <div class="mt-3.5 w-full flex flex-col">
          <span class="text-sm text-black leading-6">即将处理项目规则设置</span>
          <div class="mt-2.5 w-full h-[56px] rounded-lg bg-[#F5F6F7] flex items-center pl-[15px] gap-1.5">
            <span class="text-sm text-black-three leading-[22px]">环节状态为“未开始”且</span>
            <el-select v-model="deptTypeList1" placeholder="请选择" multiple collapse-tags>
              <el-option v-for="(item, index) in deptTypeList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <span class="text-sm text-black-three leading-[22px]">包含</span>
            <el-tree-select v-model="includeDeptList1" :data="department" placeholder="请选择部门" multiple show-checkbox
              collapse-tags check-strictly check-on-click-node :props="treeProps" node-key="id" label="name" value="id"
              default-expand-all />
            <span class="text-sm text-black-three leading-[22px]">的项目</span>
          </div>
        </div>
        <!--正在处理项目规则设置-->
        <div class="mt-5 w-full flex flex-col">
          <span class="text-sm text-black leading-6">正在处理项目规则设置</span>
          <div class="mt-2.5 w-full h-[56px] rounded-lg bg-[#F5F6F7] flex items-center pl-[15px] gap-1.5">
            <span class="text-sm text-black-three leading-[22px]">环节状态为“正常推进”“已延期”“已暂停”且</span>
            <el-select v-model="deptTypeList2" placeholder="请选择" multiple collapse-tags>
              <el-option v-for="(item, index) in deptTypeList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <span class="text-sm text-black-three leading-[22px]">包含</span>
            <el-tree-select v-model="includeDeptList2" :data="department" placeholder="请选择部门" multiple show-checkbox
              collapse-tags check-strictly check-on-click-node :props="treeProps" node-key="id" label="name" value="id"
              default-expand-all />
            <span class="text-sm text-black-three leading-[22px]">的项目</span>
          </div>
        </div>
        <!--已处理项目规则设置-->
        <div class="mt-5 w-full flex flex-col">
          <span class="text-sm text-black leading-6">已处理项目规则设置</span>
          <div class="mt-2.5 w-full h-[56px] rounded-lg bg-[#F5F6F7] flex items-center pl-[15px] gap-1.5">
            <span class="text-sm text-black-three leading-[22px]">当上一环节状态为“已完成”且</span>
            <el-select v-model="deptTypeList3" placeholder="请选择" multiple collapse-tags>
              <el-option v-for="(item, index) in deptTypeList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <span class="text-sm text-black-three leading-[22px]">包含</span>
            <el-tree-select v-model="includeDeptList3" :data="department" placeholder="请选择部门" multiple show-checkbox
              collapse-tags check-strictly check-on-click-node :props="treeProps" node-key="id" label="name" value="id"
              default-expand-all />
            <span class="text-sm text-black-three leading-[22px]">的项目</span>
          </div>
        </div>
      </div>
      <!--项目状态分布-->
      <div class="mt-6 flex justify-between items-center">
        <title-comp title="项目状态分布" :type="2" />
        <el-checkbox v-model="show2" label="不显示" size="large" />
      </div>
      <div class="mt-6 flex justify-between items-center">
        <title-comp title="关键环节分布" :type="2" />
        <el-checkbox v-model="show7" label="不显示" size="large" />
      </div>
      <!--项目阶段分布-->
      <div class="mt-6 flex justify-between items-center">
        <title-comp title="项目阶段分布" :type="2" />
        <el-checkbox v-model="show3" label="不显示" size="large" />
      </div>
    </div>
    <!--底部按钮-->
    <div class="mt-6 mb-6 flex justify-end items-center">
      <!--取消-->
      <el-button @click="onCancel">取消</el-button>
      <!--确定-->
      <el-button type="primary" @click="onOk">确定</el-button>
    </div>
  </div>
</template>

<script>
import TitleComp from "@/views/index/components/TitleComp";
import request from "@/utils/request";

export default {
  name: 'WorkbenchSetup',
  components: {
    TitleComp,
  },
  emits: [
    'on-ok',
    'on-cancel',
  ],
  data() {
    return {
      loading: false,
      show1: false,
      deptTypeList1: [],
      includeDeptList1: [],
      deptTypeList2: [],
      includeDeptList2: [],
      deptTypeList3: [],
      includeDeptList3: [],

      show2: false,
      show3: false,
      show7: false,

      deptTypeList: [
        { label: '发起部门', value: 0, },
        { label: '受理/经办部门', value: 1, },
      ],
      department: [],
      commonShow: null,
      result: null,
      resultMap: {},
      treeProps: {
        label: 'name',
        children: 'children',
      }
    };
  },
  created() {
    this.getDepartment();
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const { result } = await request({
        url: '/admin/homePageShow/list',
        method: 'get',
      });
      this.result = result;
      for (let i = 0; i < result.workList.length; i++) {
        this.resultMap[result.workList[i].moduleName] = result.workList[i].homePageShowDTO;
      }
      // 设置项目处理进度分布是否展示
      const item1 = result.workList.find(item => item.moduleName === '项目处理进度分布');
      console.log('item1', item1)
      if (item1) {
        this.show1 = item1.homePageShowDTO.isShow === 1;
      }
      // 设置项目状态分布是否展示
      const item2 = result.workList.find(item => item.moduleName === '项目状态分布');
      if (item2) {
        this.show2 = item2.homePageShowDTO.isShow === 1;
      }
      const item7 = result.workList.find(item => item.moduleName === '关键环节分布');
      if (item7) {
        this.show7 = item7.homePageShowDTO.isShow === 1;
      }
      // 设置项目阶段分布是否展示
      const item3 = result.workList.find(item => item.moduleName === '项目阶段分布');
      if (item3) {
        this.show3 = item3.homePageShowDTO.isShow === 1;
      }
      // 设置即将处理项目规则
      const item4 = result.workList.find(item => item.moduleName === '即将处理');
      console.log('item4', item4);
      if (item4) {
        this.deptTypeList1 = item4.homePageShowDTO.deptTypeList || [];
        this.includeDeptList1 = item4.homePageShowDTO.includeDeptList || [];
      }
      // 设置正在处理项目规则
      const item5 = result.workList.find(item => item.moduleName === '正在处理');
      if (item5) {
        this.deptTypeList2 = item5.homePageShowDTO.deptTypeList || [];
        this.includeDeptList2 = item5.homePageShowDTO.includeDeptList || [];
      }
      // 设置已处理项目规则
      const item6 = result.workList.find(item => item.moduleName === '已处理');
      if (item6) {
        this.deptTypeList3 = item6.homePageShowDTO.deptTypeList || [];
        this.includeDeptList3 = item6.homePageShowDTO.includeDeptList || [];
      }
      this.loading = false;
    },
    async onOk() {
      // deptTypeList1, includeDeptList1, deptTypeList2, includeDeptList2, deptTypeList3, includeDeptList3不能为空
      if (this.deptTypeList1?.length === 0
        || this.includeDeptList1?.length === 0
        || this.deptTypeList2?.length === 0
        || this.includeDeptList2?.length === 0
        || this.deptTypeList3?.length === 0
        || this.includeDeptList3?.length === 0) {
        this.$message({
          message: '即将处理项目规则、正在处理项目规则、已处理项目规则不能为空',
          type: 'warning',
        });
        return;
      }
      const params = {
        homePageShowDTOS: [
          {
            ...this.resultMap['项目处理进度分布'],
            isShow: this.show1 ? 1 : 0,
          },
          {
            ...this.resultMap['项目状态分布'],
            isShow: this.show2 ? 1 : 0,
          },
          {
            ...this.resultMap['项目阶段分布'],
            isShow: this.show3 ? 1 : 0,
          },
          {
            moduleName: '即将处理',
            ...this.resultMap['即将处理'],
            deptTypeList: this.deptTypeList1,
            includeDeptList: this.includeDeptList1,
          },
          {
            moduleName: '正在处理',
            ...this.resultMap['正在处理'],
            deptTypeList: this.deptTypeList2,
            includeDeptList: this.includeDeptList2,
          },
          {
            moduleName: '已处理',
            ...this.resultMap['已处理'],
            deptTypeList: this.deptTypeList3,
            includeDeptList: this.includeDeptList3,
          },

        ],
      }
      if (this.resultMap['关键环节分布']) {
        params.homePageShowDTOS.push({
          ...this.resultMap['关键环节分布'],
          isShow: this.show7 ? 1 : 0,
        })
      }
      await request({
        url: '/admin/homePageShow/edit',
        method: 'put',
        data: params,
      })
      this.$message({
        message: '修改工作台设置成功',
        type: 'success',
      });
      this.$emit('on-ok');
    },
    onCancel() {
      this.$emit('on-cancel');
    },
    async getDepartment() {
      const { result } = await request({
        url: '/admin/sysDepartment/getAll',
        method: 'get',
      });
      this.department = result
    },
  },
};
</script>

<style lang="scss">
.workbench-setup {
  .el-select {
    width: 170px;
    height: 32px;
  }
}
</style>
