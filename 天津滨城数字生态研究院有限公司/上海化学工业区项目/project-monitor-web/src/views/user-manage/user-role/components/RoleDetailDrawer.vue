<template>
  <div class="role-detail-drawer w-full full-h flex-1 flex flex-col items-center pd20">
    <!--表格-->
    <el-table class="flex-1 full-w" :data="list" tooltip-effect="dark">
      <!--姓名，固定在左侧-->
      <el-table-column prop="realName" label="姓名" align="left" min-width="80" show-overflow-tooltip
        fixed="left"></el-table-column>
      <!--账号-->
      <el-table-column prop="userName" label="账号" align="left" min-width="100" show-overflow-tooltip />
      <!--手机号-->
      <el-table-column prop="mobile" label="手机号" align="left" min-width="100" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="ddin-n f16">{{ row.mobile || '-' }}</span>
        </template>
      </el-table-column>
      <!--用户状态-->
      <el-table-column prop="status" label="用户状态" align="center" width="100" show-overflow-tooltip>
        <template #default="{ row }">
          <ee-tag v-if="row.statusCode == 0" type="primary" shape="round-rect">使用中</ee-tag>
          <ee-tag v-else-if="row.statusCode == 1" type="info" shape="round-rect">已停用</ee-tag>
        </template>
      </el-table-column>
      <!--所属部门-->
      <el-table-column prop="deptName" label="所属部门" align="left" min-width="160" show-overflow-tooltip />
      <!--创建时间-->
      <el-table-column prop="createTime" label="创建时间" align="left" width="110" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="ddin-n f16">{{ row.createTime.substr(0, 10) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination v-show="totalNum > 10" v-model:current-page="current" v-model:page-size="size"
      :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper" :total="totalNum"
      @size-change="changeSize" @current-change="changeNum" />
  </div>
</template>

<script>
import mixinList from "@/utils/mixinList";
import request from "@/utils/request";

export default {
  name: "RoleDetailDrawer",
  mixins: [mixinList],
  props: {
    info: {
      type: Object,
      required: false,
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const params = {
        keyword: this.keyword,
        current: this.current,
        size: this.size,
        roleId: this.info.id,
      }
      this.loading = true;
      const { result } = await request({
        url: '/admin/sysUser/list',
        method: 'get',
        params,
      });
      // console.log('result', result);
      this.list = result.userList;
      this.totalNum = result.total;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
.role-detail-drawer {
  .el-tag.tag-primary {
    background-color: rgba(2, 173, 236, 0.1);
  }
}
</style>
