import request from '@/utils/request';

export const baseApis = {
  // 获取企业画像基本信息
  getBaseInfoData: (params) => request({
    url: '/analysis/company/basicInfo',
    method: 'get',
    params
  }),
  getEvaluationData: (params) => request({
    url: '/analysis/company/companyEvaluate',
    method: 'get',
    params
  }),
  // 获取企业画像tab
  getCompanyTabsData: (params) => request({
    url: '/analysis/company/catalog',
    method: 'get',
    params
  })
};

export const baseInfoApis = {
  getIndustrialCommercialData: (params) => request({
    url: '/analysis/company/basic/businessInfo',
    method: 'get',
    params
  }),
  getStockholderTableData: (params) => request({
    url: '/analysis/company/basic/shareholderInfo',
    method: 'get',
    params
  }),
  getMainPersonalTableData: (params) => request({
    url: '/analysis/company/basic/mainStaff',
    method: 'get',
    params
  }),
  getInvestmentTableData: (params) => request({
    url: '/analysis/company/basic/foreignInvestment',
    method: 'get',
    params
  }),
  getBranchOfficeTableData: (params) => request({
    url: '/analysis/company/basic/branchList',
    method: 'get',
    params
  }),
  getChangeLogTableData: (params) => request({
    url: '/analysis/company/basic/changeInfo',
    method: 'get',
    params
  })
};

export const managementAbilityApis = {
  getCorporateReportTableData: (params) => request({
    url: '/analysis/company/operate/annualReportList',
    method: 'get',
    params
  }),
  getCorporateReportDetailData: (params) => request({
    url: '/analysis/company/operate/annualReportDetail',
    method: 'get',
    params
  }),
  getTenderTableData: (params) => request({
    url: '/analysis/company/operate/biddingInfo',
    method: 'get',
    params
  }),
  getAdministrativeLicenseTableData: (params) => request({
    url: '/analysis/company/operate/licenseInfo',
    method: 'get',
    params
  }),
  getLandInformationTableData: (params) => request({
    url: '/analysis/company/operate/landInfo',
    method: 'get',
    params
  })
};

export const yearReportApis = {
  getYearReportInfoData: (params) => request({
    url: '/analysis/company/operate/annualReportDetail',
    method: 'get',
    params
  })
};

export const innovationAbilityApis = {
  getPatentInformationTableData: (params) => request({
    url: '/analysis/company/innovation/patentInfo',
    method: 'get',
    params
  }),
  getSoftwareLiteratureInformationTableData: (params) => request({
    url: '/analysis/company/innovation/workCopyright',
    method: 'get',
    params
  }),
  getTrademarkInformationTableData: (params) => request({
    url: '/analysis/company/innovation/trademarkInfo',
    method: 'get',
    params
  }),
  getStandardInformationTableData: (params) => request({
    url: '/analysis/company/innovation/standardInfo',
    method: 'get',
    params
  })
};

export const financingCapacityApis = {
  getListingDateTableData: (params) => request({
    url: '/analysis/company/financing/listedInfo',
    method: 'get',
    params
  }),
  getFinancingHistoryTableData: (params) => request({
    url: '/analysis/company/financing/course',
    method: 'get',
    params
  })
};

export const qualificationRewardApis = {
  getQualificationRecognitionTableData: (params) => request({
    url: '/analysis/company/cert/certification',
    method: 'get',
    params
  }),
  getFilingPermitTableData: (params) => request({
    url: '/analysis/company/cert/certIcp',
    method: 'get',
    params
  })
};

export const socialContributionApis = {
  getEmployeeRecordTableData: (params) => request({
    url: '/analysis/company/social/regEmployees',
    method: 'get',
    params
  }),
  getRecruitmentSituationTableData: (params) => request({
    url: 'analysis/company/social/recruitment',
    method: 'get',
    params
  }),
  getTaxEvaluationTableData: (params) => request({
    url: '/analysis/company/social/taxCredit',
    method: 'get',
    params
  }),
  getTaxPaymentTableData: (params) => request({
    url: '/analysis/company/social/taxPayment',
    method: 'get',
    params
  }),
  getCreditRatingTableData: (params) => request({
    url: '/analysis/company/social/creditLevel',
    method: 'get',
    params
  })
};
