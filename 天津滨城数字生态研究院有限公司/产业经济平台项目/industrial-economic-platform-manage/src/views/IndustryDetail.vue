<template>
  <div class="ee-view page-IndustryDetail">
    <el-breadcrumb class="ee-breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/industry' }">产业链管理</el-breadcrumb-item>
      <el-breadcrumb-item class="is-active">产业链详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ee-view__inner">
      <div class="ee-view__head d-flex ai-center jc-between">
        <div class="ee-view__title">产业链详情</div>
        <el-button class="ee-button--back" type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
      </div>
      <div class="ee-view__body">
        <div class="d-flex">
          <el-image class="avatar" :src="form.imageUrl" fit="contain" :preview-src-list="[form.imageUrl]">
            <div slot="error" class="image-slot flex-center flex-y">暂无图片</div>
          </el-image>
          <div class="flex-1">
            <div class="f18 f500">{{ form.name }}</div>
            <div class="d-flex ai-center mt24">
              <el-tooltip effect="dark" content="产业链节点" placement="top">
                <svg-icon icon-class="node" />
              </el-tooltip>
              <span>{{ form.totalNode || '-' }}</span>
              <el-tooltip effect="dark" content="企业数量" placement="top">
                <svg-icon class-name="ml32" icon-class="firm" />
              </el-tooltip>
              <span>{{ form.totalCompany || '-' }}</span>
            </div>
          </div>
          <!-- <div>
            <el-button type="primary" plain @click="handleEdit">编辑</el-button>
          </div> -->
        </div>
        <div v-loading="loading && 0" class="mt24">
          <div class="ee-form-item">
            <div class="ee-form-label">选择区域：</div>
            <el-cascader
              v-model="regionCode"
              :options="CITY_OPTIONS"
              :props="{ checkStrictly: true, ...$regionProps, emitPath: false }"
              placeholder="选择区域"
              filterable
              clearable
              size="small"
              @change="changeArea"></el-cascader>
          </div>
          <G6Tree class="mt24" :chartData="treeData" @nodeClick="changeTreeNodes" />
          <el-table class="mt24" :data="tableData" stripe @filter-change="filterHandler">
            <el-table-column label="序号" prop="$index" width="80" align="left" />
            <el-table-column show-overflow-tooltip label="企业名称" sortable prop="companyName" min-width="160" align="left">
              <template slot-scope="scope">
                <el-button class="ee-button--grid ell" type="text" @click="toCorporatePortrait(scope.row.companyId)">
                  {{ scope.row.companyName || scope.row.legalPersonName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="资质类别"
              prop="type"
              width="120"
              align="left"
              column-key="type"
              :filters="filterCompanyType">
              <template slot-scope="scope">
                <span
                  v-for="item of scope.row.typeCodes"
                  :key="item"
                  :style="{
                    padding: '2px 5px',
                    marginRight: '5px',
                    color: companyTypeMap?.get(item)?.color,
                    background: companyTypeMap?.get(item)?.backgroundColor
                  }">
                  {{ companyTypeMap?.get(item)?.itemName }}
                </span>
                <span
                  v-for="item of scope.row.types"
                  :key="item"
                  :style="{
                    padding: '2px 5px',
                    marginRight: '5px',
                    color: keyCompanyMap?.get(item)?.color,
                    background: keyCompanyMap?.get(item)?.backgroundColor
                  }">
                  {{ keyCompanyMap?.get(item)?.itemName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="所属区域" min-width="150" align="left">
              <template slot-scope="scope">
                {{ scope.row.provinceName }}
                {{ scope.row.cityName ? `/${scope.row.cityName}` : '' }}
                {{ scope.row.countyName ? `/ ${scope.row.countyName}` : '' }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="tableListTotal > pageSize"
            class="ee-pagination"
            background
            layout="total,prev, pager, next,sizes,jumper"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            :total="tableListTotal"
            @size-change="searchTable"
            @current-change="changePage">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import * as api from '@/api/industryChain';
import G6Tree from '@/components/G6Tree.vue';

export default {
  name: 'IndustryDetail',
  components: {
    G6Tree
  },
  data() {
    return {
      form: {},
      tabId: '1',
      isUserDetail: false,
      hash: '',
      regionCode: 'china',
      treeData: {},
      loadings: 0,
      tableData: [],
      tableListTotal: 0,
      currentPage: 1,
      pageSize: 10,
      companyStatusMap: {},
      keyCompanyMap: {},
      companyTypeMap: {},
      filterCompanyType: [],
      filterType: []
    };
  },
  computed: {
    ...mapGetters(['CITY_OPTIONS']),
    loading() {
      return this.loadings === 0;
    }
  },
  created() {
    const allDict = JSON.parse(localStorage.getItem('iep_platform_all_dict'));
    this.handleColor(allDict);
    this.handleCompanyType(allDict.key_company.concat(allDict.company_type));
    this.form.id = this.$route.params.id;
    this.getChainDataById();
  },
  mounted() {},
  methods: {
    handleColor(data) {
      this.companyStatusMap = new Map(data?.company_status?.map((item) => [item.itemCode, item]));
      this.keyCompanyMap = new Map(data?.key_company?.map((item) => [item.itemCode, item]));
      this.companyTypeMap = new Map(data?.company_type?.map((item) => [item.itemCode, item]));
    },
    handleCompanyType(list) {
      this.filterCompanyType = list.map((item) => ({
        backgroundColor: item.backgroundColor,
        color: item.color,
        value: item.itemCode,
        text: item.itemName
      }));
    },
    changeArea() {
      this.chainCode = '';
      this.clearData();
      this.getChainDataById();
    },
    getChainDataById() {
      const { regionCode } = this;
      this.loadings += 1;
      api
        .getChainById({
          id: this.form.id,
          regionCode
        })
        .then((result) => {
          this.treeData = {};
          this.treeData.datas = result.data;
          this.getEnterprisesDataByChainId();
          this.loadings -= 1;
        })
        .catch((err) => {
          console.log(err);
          this.loadings -= 1;
        });
    },
    changeTreeNodes(val) {
      this.chainCode = val.code;
      this.searchTable();
    },
    // 分页
    changePage(val) {
      this.currentPage = val;
      this.getEnterprisesDataByChainId();
    },
    searchTable() {
      this.currentPage = 1;
      this.getEnterprisesDataByChainId();
    },
    // 图谱表格
    getEnterprisesDataByChainId() {
      const params = {
        types: this.filterType,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        chainCode: this.chainCode
      };
      this.loadings += 1;
      api
        .getEnterprisesByChainId(params)
        .then((result) => {
          this.tableData = result.data.list.map((n, i) => {
            n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
            return n;
          });
          this.tableListTotal = result.data.total;
          this.loadings -= 1;
        })
        .catch((err) => {
          this.loadings -= 1;
          console.log(err);
        });
    },
    filterHandler(value) {
      this.filterType = value.type;
      // console.log(value.type, this.filterType);
      this.searchTable();
    },
    clearData() {
      this.tableData = [];
      this.tableListTotal = 0;
      this.currentPage = 1;
    },
    handleEdit() {
      this.$router.push(`/tenant/form/${this.form.id}`);
    },
    getDetail() {
      api.getIndustryDetail({ id: this.$route.params.id }).then(({ data }) => {
        if (data) {
          this.form = data;
        }
      });
    }
  }
};
</script>
<style lang='less'>
.page-IndustryDetail {
  .avatar {
    margin: 0 25px 0 12px;
    width: 204px;
    height: 114px;
    background: #ccc;
  }
  .image-slot {
    height: 100%;
    color: #f5f5f5;
  }
}
</style>
