/*
 * @Date: 2023-09-12 09:14:56
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-12 10:59:35
 * @FilePath: /industrial-economic-platform/src/utils/storage.js
 */
import { commonApis } from '@/api/common';
/* eslint-disable */
export function getMenuMeta(param) {
  commonApis.getMenuMeta(param)
    .then((res) => {
      if (res.code === '00000') {
        localStorage.setItem('iep_platform_menu_meta', JSON.stringify(res.data));
      }
    });
};

export function getDictAll() {
  commonApis.getDictAll()
    .then(async (res) => {
      if (res.code === '00000') {
        await handleColor(res.data);
        localStorage.setItem('iep_platform_all_dict', JSON.stringify(res.data));
      }
    });
};

export function getRegionAll() {
  commonApis.getRegionAll()
    .then(async (res) => {
      if (res.code === '00000') {
        localStorage.setItem('iep_platform_region_dict', JSON.stringify(res.data));
      }
    });
};


function handleColor(data) {
  const companyStatusColorList = [
    {
      value: 'in_camp',
      color: '#51B42E'
    },
    {
      value: 'move_out',
      color: '#7D6DF1'
    },
    {
      value: 'move_in',
      color: '#356DF6'
    },
    {
      value: 'stop',
      color: '#CC4F47'
    },
    {
      value: 'closed',
      color: '#F8AA50'
    },
    {
      value: 'revoke',
      color: '#7D7D7D'
    },
    {
      value: 'liquidation',
      color: '#6BB2B6'
    },
    {
      value: 'cancel',
      color: '#BC73A8'
    },
    {
      value: 'log_off',
      color: '#688FAB'
    }
  ];
  const companyStatusColorMap = new Map(companyStatusColorList.map((item) => [item.value, item.color]));
  const keyCompanyColorList = [
    {
      value: 'antelope',
      color: '#53B2A1',
      backgroundColor: 'rgba(64, 182, 161, 0.2)'
    },
    {
      value: 'chain_master',
      color: '#688FAB',
      backgroundColor: 'rgba(104, 143, 171, 0.2)'
    },
    {
      value: 'list',
      color: '#CA883D',
      backgroundColor: 'rgba(209, 149, 79, 0.2)'
    },
    {
      value: 'unicorn',
      color: '#084695',
      backgroundColor: 'rgba(8, 70, 149, 0.2)'
    },
    {
      value: 'specialized_refined_innovative',
      color: '#51B42E',
      backgroundColor: 'rgba(81, 180, 46, 0.2)'
    },
    {
      value: 'high_and_new_technology',
      color: '#6655DC',
      backgroundColor: 'rgba(125, 109, 241, 0.2)'
    }
  ];
  const keyCompanyColorMap = new Map(keyCompanyColorList.map((item) => [item.value, item]));
  const companyTypeList = [
    {
      value: 'yangqi',
      color: '#2455CB',
      backgroundColor: 'rgba(53, 109, 246, 0.1)'
    },
    {
      value: 'guoqi',
      color: '#3963A5',
      backgroundColor: 'rgba(76, 116, 178, 0.2)'
    },
    {
      value: 'minying',
      color: '#6E4CB4',
      backgroundColor: 'rgba(103, 64, 182, 0.2)'
    },
    {
      value: 'gangat',
      color: '#7BB168',
      backgroundColor: 'rgba(104, 183, 77, 0.2)'
    },
    {
      value: 'waizi',
      color: '#B25B9A',
      backgroundColor: 'rgba(192, 98, 166, 0.2)'
    },
    {
      value: 'other_type',
      color: '#797979',
      backgroundColor: 'rgba(122, 122, 122, 0.2)'
    }
  ];
  if (data.company_status) {
    data.company_status.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.color = companyStatusColorMap.get(item.itemCode);
    });
  }
  if (data.key_company) {
    data.key_company.forEach((item) => {
      const res = keyCompanyColorMap.get(item.itemCode) || {};
      // eslint-disable-next-line no-param-reassign
      item.color = res.color;
      // eslint-disable-next-line no-param-reassign
      item.backgroundColor = res.backgroundColor;
    });
  }
  if (data.company_type) {
    data.company_type.forEach((item) => {
      const res = companyTypeList.find((i) => i.value === item.itemCode) || {};
      // eslint-disable-next-line no-param-reassign
      item.color = res.color;
      // eslint-disable-next-line no-param-reassign
      item.backgroundColor = res.backgroundColor;
    });
  }
}
