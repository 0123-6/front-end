<template>
  <div class="scroll-item">
    <div class="line-title scroll-anchor">
      <h3><svg-icon icon-class="region"></svg-icon>{{ title }}</h3>
    </div>
    <div v-loading="loading" class="chart-CompanyRegionDist shadow-row">
      <div class="chart-buttons">
        <el-button-group>
          <el-button :class="{ primary: regionDataType === 'company' }" @click="changeRegionDataType('company')">企业分布</el-button>
          <el-button :class="{ primary: regionDataType === 'patent' }" @click="changeRegionDataType('patent')">专利分布</el-button>
        </el-button-group>
      </div>
      <el-row type="flex">
        <el-col :span="10">
          <!-- 企业/专利区域分布 -->
          <MapChart
            v-if="mapData.code"
            ref="chart1"
            :chartData="mapData"
            :height="'640px'"
            :visualMap="{ text: [`单位：(${regionDataType === 'company' ? '万家' : '件'})\n\n高`, '低'] }"
            :visualDivisor="regionDataType === 'company' ? 10000 : 1"
            @changeAreaCode="changeAreaCode"
            @mouseover="handleMouseover"
            @mouseout="handleMouseover"></MapChart>
        </el-col>
        <el-col :span="14" class="chart-table-content">
          <el-table v-if="regionDataType === 'company'" ref="companyTable" :data="regionData" stripe height="600px" :row-class-name="rowClassName">
            <el-table-column label="排名" type="index" width="50" align="left">
              <template slot-scope="scope">
                <svg-icon :icon-class="`table-ranking${scope.row.$index}`" v-if="scope.row.$index < 4"></svg-icon>
                <template v-else>{{ scope.row.$index }}</template>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="区域" prop="regionName" min-width="80" align="left" />
            <el-table-column show-overflow-tooltip label="企业总数(家)" sortable prop="companyNum" min-width="115" align="left">
              <template v-slot="sc">
                <el-button v-if="sc.row.companyNum > 0" class="ee-button--grid ell" type="text" @click="goCompanyList(sc.row, 'typeCodes', '')">
                  {{ sc.row.companyNum }}
                </el-button>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="高新技术" prop="gxjsNum" min-width="70" align="left">
              <template v-slot="sc">
                <el-button
                  v-if="sc.row.gxjsNum > 0"
                  class="ee-button--grid ell"
                  type="text"
                  @click="goCompanyList(sc.row, 'typeCodes', 'high_and_new_technology')">
                  {{ sc.row.gxjsNum }}
                </el-button>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="上市" prop="listedNum" min-width="50" align="left">
              <template v-slot="sc">
                <el-button v-if="sc.row.listedNum > 0" class="ee-button--grid ell" type="text" @click="goCompanyList(sc.row, 'typeCodes', 'list')">
                  {{ sc.row.listedNum }}
                </el-button>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="专精特新" prop="zjtxNum" min-width="70" align="left">
              <template v-slot="sc">
                <el-button
                  v-if="sc.row.zjtxNum > 0"
                  class="ee-button--grid ell"
                  type="text"
                  @click="goCompanyList(sc.row, 'typeCodes', 'specialized_refined_innovative')">
                  {{ sc.row.zjtxNum }}
                </el-button>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <!-- <el-table-column show-overflow-tooltip label="链主" prop="lzCompanyNum" min-width="50" align="left">
            <template v-slot="sc">
              <el-button
                v-if="sc.row.lzCompanyNum > 0"
                class="ee-button--grid ell"
                type="text"
                @click="goCompanyList(sc.row, 'typeCodes', 'chain_master')">
                {{ sc.row.lzCompanyNum }}
              </el-button>
              <span v-else>0</span>
            </template>
          </el-table-column> -->
            <el-table-column show-overflow-tooltip label="瞪羚" prop="dlCompanyNum" min-width="50" align="left">
              <template v-slot="sc">
                <el-button
                  v-if="sc.row.dlCompanyNum > 0"
                  class="ee-button--grid ell"
                  type="text"
                  @click="goCompanyList(sc.row, 'typeCodes', 'antelope')">
                  {{ sc.row.dlCompanyNum }}
                </el-button>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="独角兽" prop="unicornNum" min-width="60" align="left">
              <template v-slot="sc">
                <el-button
                  v-if="sc.row.unicornNum > 0"
                  class="ee-button--grid ell"
                  type="text"
                  @click="goCompanyList(sc.row, 'typeCodes', 'unicorn')">
                  {{ sc.row.unicornNum }}
                </el-button>
                <span v-else>0</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="regionDataType === 'patent'" ref="patentTable" :data="regionData" stripe height="600px" :row-class-name="rowClassName">
            <el-table-column label="排名" type="index" width="50" align="left">
              <template slot-scope="scope">
                <svg-icon :icon-class="`table-ranking${scope.row.$index}`" v-if="scope.row.$index < 4"></svg-icon>
                <template v-else>{{ scope.row.$index }}</template>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="区域" prop="regionName" min-width="80" align="left" />
            <el-table-column show-overflow-tooltip label="专利总数(件)" sortable prop="patentNum" min-width="115" align="left" />
            <el-table-column show-overflow-tooltip label="发明专利" prop="inventionNum" min-width="70" align="left" />
            <el-table-column show-overflow-tooltip label="实用新型" prop="innovationNum" min-width="70" align="left" />
            <el-table-column show-overflow-tooltip label="外观专利" prop="appearanceNum" min-width="70" align="left" />
          </el-table>
          <el-pagination
            v-show="tableListTotal > pageSize"
            class="mt16 pb16"
            layout="prev, pager, next, jumper"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            background
            :total="tableListTotal"
            @current-change="changePage">
          </el-pagination>
        </el-col>
      </el-row>
      <el-dialog title="企业查询结果" :visible.sync="dialogVisible" top="10vh" width="73.33%" :modal-append-to-body="false">
        <company-list-common
          v-if="dialogVisible"
          mode="region"
          :params="companyParams"
          placeholder="请输入企业名称、法人名称"
          :show-pagination="true" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { analysisApis } from '@/api/structural-analysis';
import MapChart from '@/components/MapChart';
import CompanyListCommon from '@/views/CompanyListCommon.vue';
export default {
  name: 'CompanyRegionDist',
  components: {
    MapChart,
    CompanyListCommon
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      chartAmount: 1,

      mapData: {
        code: '',
        name: '',
        min: 0,
        max: 0,
        data: []
      },

      regionDataType: 'company',
      currentPage: 1,
      pageSize: 80,
      tableListTotal: 0,
      regionData: [],
      curRowName: '',

      companyParams: {},
      dialogVisible: false
    };
  },
  watch: {
    params(val, oldVal) {
      this.currentPage = 1;
      if (this.$refs.chart1) this.$refs.chart1.historyList = [];
      this.getData();
    }
  },
  created() {
    this.mapAllData = {};
  },
  methods: {
    rowClassName({ row }) {
      return row.regionName === this.curRowName ? 'is-active' : '';
    },
    handleMouseover({ name, dataIndex }) {
      this.curRowName = name;
      // console.log('params', params);
      this.$refs[`${this.regionDataType}Table`].$el
        .querySelector('.el-table__body-wrapper')
        .scrollTo({ top: (Math.ceil((dataIndex + 1) / 11) - 1) * 550 });
    },
    // 切换企业发布/专利发布
    changeRegionDataType(type) {
      if (type !== this.regionDataType) {
        this.regionDataType = type;
      }
      if (type === 'patent') {
        this.mapData.code = this.mapAllData.patentLocation.regionCode;
        this.mapData.name = this.mapAllData.patentLocation.regionName;
        this.mapData.min = this.mapAllData.patentLocation.minValue;
        this.mapData.max = this.mapAllData.patentLocation.maxValue;
        this.mapData.data = this.mapAllData.patentLocation.locationListResp.list?.map((item) => ({
          name: item.regionName,
          value: item.patentNum
        }));
        this.regionData = (this.mapAllData.patentLocation.locationListResp.list || []).map((n, i) => {
          n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
          return n;
        });
        this.tableListTotal = this.mapAllData.patentLocation.locationListResp.total;
      } else {
        this.mapData.code = this.mapAllData.enterpriseLocation.regionCode;
        this.mapData.name = this.mapAllData.enterpriseLocation.regionName;
        this.mapData.min = this.mapAllData.enterpriseLocation.minValue;
        this.mapData.max = this.mapAllData.enterpriseLocation.maxValue;
        this.mapData.data = this.mapAllData.enterpriseLocation.locationListResp.list?.map((item) => ({
          name: item.regionName,
          value: item.companyNum
        }));
        this.regionData = (this.mapAllData.enterpriseLocation.locationListResp.list || []).map((n, i) => {
          n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
          return n;
        });
        this.tableListTotal = this.mapAllData.enterpriseLocation.locationListResp.total;
      }
    },
    // 下钻地图或返回上级改变数据
    changeAreaCode(historyList) {
      this.currentPage = 1;
      const regionCode = historyList[historyList.length - 1].code;
      this.getData({
        regionCode,
        regionLevel: this.$getLevelByCode(regionCode)
      });
    },
    // 区域分布图表
    getData(regionObj = {}) {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...this.params,
        ...regionObj
      };
      this.loading = true;
      this.$emit('loading', 1);
      analysisApis
        .getRegionAnalyse(params)
        .then((result) => {
          if (!result.data.patentLocation.locationListResp) {
            result.data.patentLocation.locationListResp = {
              list: [],
              pageNum: 1,
              pageSize: this.pageSize,
              total: 0,
              pages: 0
            };
          }
          this.mapAllData = result.data;
          const data = result.data[this.regionDataType === 'company' ? 'enterpriseLocation' : 'patentLocation'];
          const { regionCode, regionName, minValue, maxValue, locationListResp = {} } = data;
          this.mapData = {
            code: regionCode,
            name: regionName,
            min: minValue,
            max: maxValue,
            data: locationListResp.list?.map((item) => ({
              name: item.regionName,
              value: item[this.regionDataType === 'company' ? 'companyNum' : 'patentNum']
            }))
          };
          this.regionData = (locationListResp.list || []).map((n, i) => {
            n.$index = this.$getRowIndex(i, this.currentPage, this.pageSize);
            return n;
          });
          this.tableListTotal = locationListResp.total;
          this.loading = false;
          this.$emit('loading', -1);
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$emit('loading', -1);
        });
    },
    changePage(val) {
      this.currentPage = val;
      this.getData();
    },
    goCompanyList(row, prop, val) {
      const { chainCode, industryCode } = this.params;
      const params = {
        chainCodes: chainCode ? [chainCode] : [],
        regions: [
          {
            regionCode: row.regionCode,
            regionLevel: row.regionLevel,
            names: row.regionName
          }
        ],
        industryCode
      };
      params[prop] = prop === 'typeCodes' ? (val ? [val] : []) : val;
      this.companyParams = params;
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang='less'>
.chart-CompanyRegionDist {
  .chart-buttons {
    padding: 32px 24px;
    background-color: #ffffff;
  }
  .chart-table-content {
    background-color: #ffffff;
    padding: 0 16px 16px 0;
    &.enterprises-table {
      padding: 32px 24px;
    }
    .el-table {
      .svg-icon {
        height: 23px;
        width: 23px;
      }
    }
  }
  th {
    .cell {
      padding-left: 5px !important;
      padding-right: 5px !important;
    }
  }
}
</style>
