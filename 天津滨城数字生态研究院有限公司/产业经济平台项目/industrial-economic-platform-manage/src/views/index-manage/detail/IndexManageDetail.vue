<template>
  <!--最外层-->
  <div class="index-manage-detail tw-w-full tw-min-h-full tw-flex tw-flex-col tw-bg-[#F2F3F5] tw-pl-[24px] tw-pr-[24px]">
    <!--面包屑-->
    <bread-crumbs :list="[{name: '指数管理', path: '/index',}, {name: '指数详情', }]" class="tw-mt-[12px]"/>
    <!--白色区域-->
    <div class="tw-min-h-[500px] tw-mt-[6px] tw-pb-[23px] tw-mb-[23px] tw-bg-white tw-rounded tw-flex-1 tw-pl-[23px] tw-pr-[23px] tw-flex tw-flex-col"
         v-loading="loading">
      <!--第一行-->
      <div class="tw-w-full tw-h-[54px] tw-flex tw-justify-between tw-items-center">
        <span class="tw-font-medium tw-text-[#000000] tw-text-base tw-leading-[22px]">指数详情</span>
        <el-button type="text" size="medium" @click="goBack">返回</el-button>
      </div>
      <!--分割线-->
      <div class="tw-h-[1px] tw-bg-[#F3F1F1]" style="width: calc(100% + 23px);"/>
      <!--标题和描述-->
      <div class="tw-mt-[24px] tw-w-full tw-pl-[8px] tw-pr-[8px] tw-flex tw-flex-col">
        <div class="tw-flex tw-items-center">
          <span class="tw-mr-[24px] tw-font-medium tw-text-[#000000] tw-text-[20px] tw-leading-[28px]">{{data?.title}}</span>
          <div v-show="data?.status === 1"
               class="tw-flex tw-items-center">
            <div class="tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#52C51A]"/>
            <span class="tw-ml-[5px] tw-text-sm tw-text-[#1A262C]">已上线</span>
          </div>
          <div v-show="data?.status === 2"
               class="tw-flex tw-items-center">
            <div class="tw-w-[7px] tw-h-[7px] tw-rounded-full tw-bg-[#C1C4BF]"/>
            <span class="tw-ml-[5px] tw-text-sm tw-text-[#1A262C]">已下线</span>
          </div>
        </div>
        <span class="tw-mt-[6px] tw-text-sm tw-text-[#86909C] tw-leading-[20px]">更新时间：{{data?.updated_at}}</span>
        <span class="tw-mt-[16px] tw-max-w-[1390px] tw-text-sm tw-text-[#1A262C] tw-leading-[20px]">{{data?.description}}</span>
      </div>
      <!--指数，报告-->
      <tab-comp :list="['指数', '报告']"
                class="tw-mt-[18px] tw-mb-[14px]"
                :selectedItem="type"
                @changeItem="changeType"/>
      <!--指数-->
      <div v-if="type === '指数'"
           class="tw-w-full tw-flex tw-flex-col">
        <!--上传指数-->
        <div class="tw-w-full tw-flex tw-justify-between tw-items-center">
          <!--左-->
          <div class="tw-flex tw-items-center">
            <el-cascader clearable
                         size="small"
                         :options="index_date_list"
                         :props="{ checkStrictly: true }"
                         placeholder="请选择上传指数日期"
                         @change="changeIndexDate"
            ></el-cascader>
            <el-button type="primary"
                       :disabled="!index_date"
                       plain
                       size="medium"
                       class="tw-ml-[18px]"
                       @click="uploadIndex">+上传指数</el-button>
          </div>
          <!--右-->
          <div class="tw-flex tw-items-center tw-cursor-pointer"
               @click="clickDownloadTemplate">
            <img src="./icon/DownloadLightTwoSvg.svg" alt="" />
            <span class="tw-ml-1 tw-text-sm tw-text-[#356EF5]">下载模板</span>
          </div>
        </div>
        <!--指数表格-->
        <index-table ref="indexTable"
                     class="tw-mt-[8px] tw-flex tw-flex-col"
                     :index_type_id="Number($route.params.id)"
        ></index-table>
      </div>
      <!--报告-->
      <div v-if="type === '报告'"
           class="tw-w-full tw-flex tw-flex-col">
        <!--上传报告-->
        <div class="tw-w-full tw-flex tw-items-center">
          <el-select clearable
                     v-model="report_date"
                     size="small"
                     placeholder="请选择上传报告日期"
                     @change="changeReportDate"
          >
            <el-option v-for="(item, index) in report_date_list"
                       :key="index"
                       :label="item.label"
                       :value="item.value"/>
          </el-select>
          <el-button type="primary"
                     :disabled="!report_date"
                     plain
                     size="medium"
                     class="tw-ml-[18px]"
                     @click="uploadReport">+上传报告</el-button>
        </div>
        <!--报告表格-->
        <report-table ref="reportTable"
                      class="tw-mt-[8px] tw-flex tw-flex-col"
                      :index_type_id="Number($route.params.id)"
        ></report-table>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/utils/request';
import BreadCrumbs from '@/components/BreadCrumbs';
import IndexTable from '@/views/index-manage/detail/components/IndexTable';
import ReportTable from '@/views/index-manage/detail/components/ReportTable';
import TabComp from '@/views/index-manage/detail/components/TabComp';

export default {
  name: 'IndexManageDetail',
  components: {
    TabComp,
    ReportTable,
    IndexTable,
    BreadCrumbs,
  },
  data() {
    return {
      // 加载中
      loading: false,
      // 数据
      data: {},
      // 指数表格,报告表格
      type: '指数',
      index_date: '',
      index_date_list: [],
      // 报告相关
      report_date: '',
      report_date_list: [],
    };
  },
  created() {
    // 初始化index_date_list，一级为2016 - 2023年，二级为1 - 12月
    const year = new Date().getFullYear();
    const yearList = [];
    for (let i = year; i >= 2016; i -= 1) {
      const monthList = [];
      // 给月份加0
      for (let j = 1; j <= 12; j += 1) {
        monthList.push({
          value: `${i}-${j < 10 ? `0${j}` : j}`,
          label: `${j}月`,
        });
      }
      yearList.push({
        value: `${i}`,
        label: `${i}年`,
        children: monthList,
      });
    }
    this.index_date_list = yearList;
    // 初始化report_date_list,只有1级，为2016 - 今年
    const reportYearList = [];
    for (let i = year; i >= 2016; i -= 1) {
      reportYearList.push({
        value: `${i}`,
        label: `${i}年`,
      });
    }
    this.report_date_list = reportYearList;
    console.log('report_date_list', this.report_date_list);
    this.getData();
  },
  methods: {
    init() {
      this.index_date = '';
      this.report_date = '';
    },
    changeType(type) {
      this.type = type;
      // 初始化
      this.init();
    },
    // 获取数据
    async getData() {
      const params = {
        id: Number(this.$route.params.id),
      };
      this.loading = true;
      const { data } = await get(`/oam/economy/index-type/${params.id}`);
      this.data = data;
      this.loading = false;
    },
    goBack() {
      this.$router.back();
    },
    changeIndexDate(valueList) {
      this.index_date = valueList[valueList.length - 1];
    },
    changeReportDate(value) {
      // this.report_date = value;
    },
    uploadIndex() {
      // 上传指数，选取本地文件，格式为excel，创建一个input，然后触发input的click事件
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx, .xls';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        // index_type_id
        formData.append('index_type_id', Number(this.$route.params.id));
        // index_date
        formData.append('index_date', this.index_date);
        // business_type,为economy_index
        formData.append('business_type', 'economy_index');
        // file
        formData.append('file', file);
        await post('/oam/economy/index/file/upload', formData);
        this.$message({
          type: 'success',
          message: '上传成功',
        });
        // 重新获取数据
        if (this.$refs.indexTable) {
          this.$refs.indexTable.getData();
        } else if (this.$refs.reportTable) {
          this.$refs.reportTable.getData();
        }
      };
      input.click();
    },
    // 上传报告，文件格式为pdf，index_date的值为report_date，business_type为economy_report
    uploadReport() {
      // 上传指数，选取本地文件，格式为pdf，创建一个input，然后触发input的click事件
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        // index_type_id
        formData.append('index_type_id', Number(this.$route.params.id));
        // index_date
        formData.append('index_date', this.report_date);
        // business_type,为economy_report
        formData.append('business_type', 'economy_report');
        // file
        formData.append('file', file);
        await post('/oam/economy/index/file/upload', formData);
        this.$message({
          type: 'success',
          message: '上传成功',
        });
        // 重新获取数据
        if (this.$refs.indexTable) {
          this.$refs.indexTable.getData();
        } else if (this.$refs.reportTable) {
          this.$refs.reportTable.getData();
        }
      };
      input.click();
    },
    clickDownloadTemplate() {
      window.open('https://zhishu-economy.oss-cn-hangzhou.aliyuncs.com/index-report/%E4%B8%AD%E5%9B%BD%E6%95%B0%E5%AD%97%E7%BB%8F%E6%B5%8E%E4%BA%A7%E4%B8%9A%E5%8F%91%E5%B1%95%E6%8C%87%E6%95%B0%E6%95%B0%E6%8D%AE%E6%A8%A1%E6%9D%BF.xlsx');
    },
  },
};
</script>

<style scoped lang="less">
.index-manage-detail {
  box-sizing: border-box;
  line-height: 1;
  * {
    box-sizing: border-box;
  }
}
</style>
