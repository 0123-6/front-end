<template>
  <div v-loading="loading" class="OrgAuthForm">
    <div v-if="!readonly" class="ee-buttons text-right">
      <el-button type="primary" @click="saveAuth">保存</el-button>
    </div>
    <div class="table-wrap">
      <template v-if="!readonly">
        <el-checkbox class="check-all" v-model="checkAll" @change="handleCheckAll"></el-checkbox>
        <el-table ref="elTable" :data="metaMenu" border stripe default-expand-all row-key="id" :tree-props="{ children: 'children' }">
          <el-table-column type="selection" width="70" align="center">
            <template v-slot="sc">
              <el-checkbox
                v-model="sc.row.checked"
                @change="
                  (e) => {
                    handleCheck(e, sc.row);
                  }
                "></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="menuName" label="菜单名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="featureName" label="详细功能" min-width="200">
            <template v-slot="sc">
              <el-select
                v-if="sc.row.featureList && sc.row.checked"
                :class="{ 'is-error': errorKey === `feature${sc.row.id}` && (!sc.row.features || sc.row.features.length < 1) }"
                v-model="sc.row.features"
                placeholder="请选择详细功能"
                clearable
                multiple
                size="small"
                style="width: 100%">
                <el-option v-for="n in sc.row.featureList" :label="n.menuName" :value="n.id" :key="n.id"></el-option>
              </el-select>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="dataScopeName" label="数据范围" min-width="200" show-overflow-tooltip>
            <template v-slot="sc">
              <div v-if="sc.row.allowsDataRange && sc.row.checked">
                <el-cascader
                  v-if="activeRegionCascader[sc.row.id]"
                  :class="{ 'is-error': errorKey === `region${sc.row.id}` && (!sc.row.regionCode || sc.row.regionCode.length < 1) }"
                  :ref="'regionCascader' + sc.row.id"
                  v-model="sc.row.regionCode"
                  :options="
                    sc.row.perms === 'cyzhdb'
                      ? nationTreeData
                      : sc.row.regionTree && sc.row.regionTree[0].level != 0
                      ? sc.row.regionTree
                      : CITY_OPTIONS
                  "
                  placeholder="请选择数据范围"
                  :props="props"
                  :show-all-levels="false"
                  clearable
                  @change="
                    (e) => {
                      changeRegion(e, sc.row);
                    }
                  "
                  style="width: 100%"></el-cascader>
                <div v-else>
                  <el-button
                    class="ee-button--grid ell"
                    :class="{ 'is-error': errorKey === `region${sc.row.id}` && (!sc.row.regionCode || sc.row.regionCode.length < 1) }"
                    type="text"
                    @click="handleRegion(sc.row)"
                    >{{ sc.row.dataScopeName || '请选择数据范围' }}</el-button
                  >
                </div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="otherName" label="其他" min-width="200">
            <template v-slot="sc">
              <div v-if="sc.row.checked">
                <el-select
                  v-if="sc.row.relationType === 'index'"
                  :class="{ 'is-error': errorKey === `index${sc.row.id}` && (!sc.row.otherId || sc.row.otherId.length < 1) }"
                  v-model="sc.row.otherId"
                  placeholder="请选择指数"
                  clearable
                  multiple
                  size="small"
                  style="width: 100%">
                  <el-option v-for="n in sc.row.indexes" :label="n.name" :value="n.id" :key="n.id"></el-option>
                </el-select>
                <el-select
                  v-else-if="sc.row.relationType === 'chain'"
                  :class="{ 'is-error': errorKey === `chain${sc.row.id}` && (!sc.row.otherId || sc.row.otherId.length < 1) }"
                  v-model="sc.row.otherId"
                  placeholder="请选择产业链"
                  clearable
                  multiple
                  size="small"
                  style="width: 100%">
                  <el-option v-for="n in sc.row.chains" :label="n.name" :value="n.id" :key="n.id"></el-option>
                </el-select>
                <span v-else>-</span>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-else>
        <el-table ref="elTable" :data="metaMenu" border stripe default-expand-all row-key="id" :tree-props="{ children: 'children' }">
          <el-table-column prop="menuName" label="菜单名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="featureName" label="详细功能" min-width="200">
            <template v-slot="sc">
              {{
                sc.row.features && sc.row.features.length > 0
                  ? sc.row.featureList
                      .filter((n) => sc.row.features.indexOf(n.id) > -1)
                      .map((n) => n.menuName)
                      .join(',')
                  : '-'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="dataScopeName" label="数据范围" min-width="200" show-overflow-tooltip>
            <template v-slot="sc">
              {{ sc.row.dataScopeName || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="otherName" label="其他" min-width="200">
            <template v-slot="sc">
              <span v-if="sc.row.otherId && sc.row.relationType === 'index'">{{
                sc.row.indexes
                  .filter((n) => sc.row.otherId.indexOf(n.id) > -1)
                  .map((n) => n.name)
                  .join(',')
              }}</span>
              <span v-else-if="sc.row.otherId && sc.row.relationType === 'chain'">{{
                sc.row.chains
                  .filter((n) => sc.row.otherId.indexOf(n.id) > -1)
                  .map((n) => n.name)
                  .join(',')
              }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import * as api from '@/api/tenant-manage';
import { flatNodes, findNodeByDFS } from '@/utils';
import MultipleRegionCascader from '@/components/MultipleRegionCascader/index.vue';

export default {
  name: 'OrgAuthForm',
  components: {
    MultipleRegionCascader
  },
  props: {
    form: {},
    mode: {
      type: String,
      default: 'org'
    }
  },
  data() {
    return {
      props: { multiple: true, checkStrictly: true, ...this.$regionProps },
      loading: false,
      metaMenu: [],
      activeRegionCascader: {},
      nationTreeData: [],
      checkAll: false,
      errorKey: ''
    };
  },
  computed: {
    ...mapGetters(['CITY_OPTIONS', 'META_MENU']),
    isUserAuth() {
      return this.mode === 'user';
    },
    isAdmin() {
      return this.form.roleName === '管理员';
    },
    readonly() {
      return this.isAdmin;
    }
  },
  created() {
    this.nationTreeData = [
      {
        ...this.CITY_OPTIONS[0],
        children: []
      }
    ];
    this.flatRegions = flatNodes(this.CITY_OPTIONS, false);
  },
  mounted() {
    if (!this.isUserAuth || this.isAdmin) {
      let metaMenu = JSON.parse(JSON.stringify(this.META_MENU));
      metaMenu.forEach((m) => {
        this.filterMenu(m);
      });
      this.metaMenu = metaMenu;
      console.log('this.metaMenu', this.metaMenu);
      this.getTenantDetailData();
    } else {
      this.getOrgUserMetaMenu();
    }
  },
  methods: {
    getOrgUserMetaMenu() {
      this.loading = true;
      api
        .getOrgUserMetaMenu({ tenantId: this.form.orgId })
        .then(({ data }) => {
          let metaMenu = data;
          metaMenu.forEach((m) => {
            this.filterMenu(m);
          });
          this.metaMenu = metaMenu;
          console.log('this.metaMenu', this.metaMenu);
          this.getOrgUserMenuDetail();
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    getOrgUserMenuDetail() {
      api
        .getOrgUserMenuDetail({ id: this.form.id })
        .then(({ data }) => {
          this.handleAuthData(data);
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    handleRegion(row) {
      Object.keys(this.activeRegionCascader).forEach((n) => {
        this.$set(this.activeRegionCascader, n, false);
      });
      this.$set(this.activeRegionCascader, row.id, !this.activeRegionCascader[row.id]);
    },
    changeRegion(e, row) {
      this.$set(row, 'dataScopeName', this.getRegionNames(e));
    },
    filterMenu(m) {
      if (m.children.find((c) => c.menuType === 'F')) {
        m.featureList = [].concat(m.children);
        m.children = [];
      } else {
        m.children.forEach((c) => {
          this.filterMenu(c);
        });
      }
    },
    getTenantDetailData() {
      this.loading = true;
      api
        .getTenantLimitDetailData({ id: this.isAdmin ? this.$route.params.id : this.form.id })
        .then((res) => {
          this.handleAuthData(res.data);
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },
    getRegionNames(paths) {
      return []
        .concat(paths)
        .map((n) => n[n.length - 1])
        .map((n) => this.flatRegions.find((r) => r.value == n).label)
        .join(',');
    },
    setMenuFormValue(m, data) {
      const { checkedMenu = [], checkedRegion = [], checkedOther = [] } = data;
      // 详情功能
      if (m.featureList && m.featureList.length > 0) {
        this.$set(
          m,
          'features',
          checkedMenu.filter((n) => m.featureList.find((f) => f.id == n))
        );
      }
      // 数据范围
      if (m.allowsDataRange) {
        let menuRegion = checkedRegion.find((r) => r.menuId == m.id);
        if (menuRegion) {
          this.$set(m, 'regionCode', menuRegion.regionCode);
          this.$set(m, 'dataScopeName', this.getRegionNames(menuRegion.regionCode));
        }
      }
      // 指数、产业链
      if (m.relationType !== 'none') {
        let menuOther = checkedOther.find((r) => r.menuId == m.id);
        if (menuOther) {
          this.$set(m, 'otherId', m.relationType === 'index' ? menuOther.otherId : menuOther.otherId.map((o) => o.toString()));
        }
      }
      m.children.forEach((c) => {
        this.setMenuFormValue(c, data);
      });
    },
    handleAuthData(data) {
      const { checkedMenu } = data;
      if (this.isAdmin) {
        this.metaMenu = this.metaMenu.filter((n) => checkedMenu.indexOf(n.id) > -1);
        this.metaMenu.forEach((n) => {
          n.children = n.children.filter((c) => checkedMenu.indexOf(c.id) > -1);
        });
      }
      this.metaMenu.forEach((m) => {
        this.setMenuFormValue(m, data);
      });
      if (!this.readonly) {
        this.$nextTick(() => {
          this.setCheckedByIds(this.metaMenu, checkedMenu);
          this.setCheckAll();
        });
      }
    },
    saveAuth() {
      let pass = true;
      let selectedMenuList = [];
      this.getCheckedList(this.metaMenu, selectedMenuList);
      for (let index = 0; index < selectedMenuList.length; index++) {
        const element = selectedMenuList[index];
        if (element.featureList && (!element.features || element.features.length < 1)) {
          this.$message({
            message: `请选择${element.menuName}的详细功能`,
            type: 'error'
          });
          pass = false;
          this.errorKey = `feature${element.id}`;
          break;
        }
        if (element.allowsDataRange && (!element.regionCode || element.regionCode.length < 1)) {
          this.$message({
            message: `请选择${element.menuName}的数据范围`,
            type: 'error'
          });
          pass = false;
          this.errorKey = `region${element.id}`;
          break;
        }
        if (element.relationType === 'index' && (!element.otherId || element.otherId.length < 1)) {
          this.$message({
            message: `请选择${element.menuName}的指数权限`,
            type: 'error'
          });
          pass = false;
          this.errorKey = `index${element.id}`;
          break;
        }
        if (element.relationType === 'chain' && (!element.otherId || element.otherId.length < 1)) {
          this.$message({
            message: `请选择${element.menuName}的产业链权限`,
            type: 'error'
          });
          pass = false;
          this.errorKey = `chain${element.id}`;
          break;
        }
      }
      if (!pass) return;
      let menuIds = selectedMenuList.map((n) => n.id);
      selectedMenuList.forEach((n) => {
        if (n.features && n.features.length > 0) {
          menuIds = menuIds.concat(n.features);
        }
      });
      const params = {
        ...this.form,
        menuIds,
        reginCodes: selectedMenuList
          .filter((n) => n.regionCode && n.regionCode.length > 0)
          .map((n) => ({
            menuId: n.id,
            regionCode: n.regionCode.map((r) => ({
              regionLevel: r[0] === 'china' ? r.length - 1 : r.length,
              regionNode: r
            }))
          })),
        otherIds: selectedMenuList
          .filter((n) => n.relationType !== 'none')
          .map((n) => ({
            menuId: n.id,
            otherId: n.otherId || []
          }))
      };
      console.log('OrgDetail params', params);
      this.loading = true;
      api[this.isUserAuth ? 'updateUserAuth' : 'updateTenantLimitData'](params)
        .then(({ code }) => {
          if (code === '00000') {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },
    handleCheck(checked, row) {
      // console.log('handleCheck', selection, row);
      if (row.parentId === 0) {
        //父节点
        row.children.forEach((c) => {
          this.$set(c, 'checked', checked);
        });
      } else {
        //子节点
        for (let index = 0; index < this.metaMenu.length; index++) {
          const parent = findNodeByDFS(this.metaMenu[index], (n) => n.id === row.parentId);
          if (parent) {
            this.$set(parent, 'checked', parent.children.findIndex((c) => c.checked) > -1);
            break;
          }
        }
      }
      if (!checked) {
        this.checkAll = false;
      } else {
        this.setCheckAll();
      }
    },
    handleCheckAll(checked) {
      this.setChecked(this.metaMenu, checked);
    },
    setCheckAll() {
      this.checkAll = this.getUnCheckedNum() < 1;
    },
    getCheckedList(srcList, list) {
      srcList.forEach((n) => {
        if (n.checked) {
          list.push(n);
          this.getCheckedList(n.children, list);
        }
      });
    },
    getUnCheckedNum() {
      let num = this.metaMenu.filter((n) => !n.checked).length;
      this.metaMenu.forEach((n) => {
        num += n.children.filter((c) => !c.checked).length;
      });
      return num;
    },
    setChecked(list, checked) {
      list.forEach((n) => {
        this.$set(n, 'checked', checked);
        this.setChecked(n.children, checked);
      });
    },
    setCheckedByIds(list, ids) {
      list.forEach((n) => {
        this.$set(n, 'checked', ids.indexOf(n.id) > -1);
        if (n.children.length > 0) this.setCheckedByIds(n.children, ids);
      });
    }
  }
};
</script>
<style lang='less'>
.OrgAuthForm {
  .table-wrap {
    position: relative;
    .check-all {
      position: absolute;
      top: 15px;
      left: 27px;
      z-index: 1;
    }
  }
  th {
    .el-checkbox {
      display: none;
    }
  }
  .is-error {
    .el-input__inner {
      border-color: #f56c6c !important;
    }
    &.el-button {
      color: #f56c6c !important;
    }
  }
}
</style>
