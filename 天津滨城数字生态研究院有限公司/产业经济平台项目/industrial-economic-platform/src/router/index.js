/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-07-04 15:52:11
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-12 10:43:25
 * @FilePath: /industrial-economic-platform/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';
import Layout from '@/layout';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'HomePage',
        component: () => import('@/views/home-page')
      },
      {
        // 产业结构分析
        path: 'structural-analysis',
        name: 'StructuralAnalysis',
        component: () => import('@/views/StructureAnalysis')
      },
      {
        // 产业链图谱
        path: 'industry-map',
        name: 'IndustryMap',
        component: () => import('@/views/industry-map-page'),
      },
      {
        // 产业链图谱详情
        path: 'industry-map/detail/:id',
        name: 'IndustryMapDetail',
        component: () => import('@/views/industry-map-page/IndustryMapDetail')
      },
      {
        // 产业综合对比
        path: 'comprehensive-comparison',
        name: 'ComprehensiveComparison',
        component: () => import('@/views/ComprehensiveCompare')
      },
      {
        // 产业招商
        path: 'industrial-investment',
        name: 'IndustrialInvestment',
        component: () => import('@/views/CompanyList.vue')
      },
      {
        // 企业画像
        path: 'corporate-portrait/:id',
        name: 'CorporatePortrait',
        component: () => import('@/views/corporate-portrait-page'),
      },
      {
        // 企业年报
        path: 'corporate-portrait/year-report/:id/:year?',
        name: 'YearReport',
        component: () => import('@/views/corporate-portrait-page/year-report.vue'),
      },
      {
        // 政策查询
        path: 'policy-inquiries',
        name: 'PolicyInquiries',
        component: () => import('@/views/PolicyQuery')
      },
      // 政策查询结果
      {
        path: 'policy-list',
        name: 'PolicyList',
        component: () => import('@/views/PolicyList')
      },
      {
        // 政策文件
        path: 'policy-documents',
        name: 'PolicyDoc',
        component: () => import('@/views/PolicyDoc')
      },
      {
        // 政策文件详情
        path: 'policy-detail/:id',
        name: 'PolicyDocDetail',
        component: () => import('@/views/PolicyDocDetail')
      },
      {
        // 匹配企业
        path: 'policy-company/:id',
        name: 'PolicyCompany',
        component: () => import('@/views/PolicyCompany')
      },
      {
        // 问答
        path: 'chat',
        name: 'ChatPage',
        component: () => import('@/views/chat-page'),
      },
      {
        // 经济运行监测
        path: 'economy-monitor',
        name: 'EconomyMonitor',
        component: () => import('@/views/EconomyMonitor')
      },
      {
        // 经济指标归因
        path: 'economy-target',
        name: 'EconomyTarget',
        component: () => import('@/views/economy-target')
      },
      {
        // 经济指数分析
        path: 'economy-index',
        name: 'EconomyIndex',
        component: () => import('@/views/economy-index')
      },
      {
        // 个人中心
        path: 'person-center',
        name: 'PersonCenter',
        redirect: '/person-center/person-message',
        component: () => import('@/views/person-center-page'),
        children: [
          {
            // 个人信息
            path: 'person-message',
            name: 'PersonMessage',
            component: () => import('@/views/person-center-page/person-message-page'),
          },
          {
            // 所属机构
            path: 'person-company',
            name: 'PersonCompany',
            component: () => import('@/views/person-center-page/person-company-page'),
          },
          {
            // 关注企业
            path: 'follow-company',
            name: 'FollowCompany',
            component: () => import('@/views/person-center-page/follow-company-page'),
          },
          {
            // 用户管理
            path: 'user-manager',
            name: 'UserManager',
            component: () => import('@/views/person-center-page/user-manager-page'),
          },
          {
            // 角色管理
            path: 'role-manager',
            name: 'RoleManager',
            component: () => import('@/views/person-center-page/role-manager-page'),
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/login-page')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

function getMenuId(path, name) {
  let menuId = '';
  let authPath = path
  switch (name) {
    case 'PolicyCompany':
      authPath = '/policy-documents'
      break;
    case 'PolicyList':
    case 'ChatPage':
      authPath = '/policy-inquiries'
      break;
    default:
      break;
  }
  // console.log(store.getters.iep_menuMap);
  Object.keys(store.getters.iep_menuMap).forEach((n) => {
    if (authPath.indexOf(n) > -1) {
      menuId = store.getters.iep_menuMap[n];
    }
  });
  return menuId;
}

const originalPush = router.push;
const originalReplace = router.replace;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};
router.beforeEach((to, from, next) => {
  // console.log('into router.beforeEach, to: ', to, ' from: ', from, ' next: ', next);
  // 将当前路由信息存入localStorage
  localStorage.setItem('beforePath', from.path);
  const userToken = store.getters?.iep_platform_TOKEN || {};
  const routersInfo = store.getters?.iep_platform_ROUTERS_INFO || [];
  if (to.path === '/login' || to.path === '/home') {
    if (to.path === '/home' && userToken?.token && routersInfo.length === 0) {
      store.dispatch('user/getUserInfo', {
        isRedirect: false,
        callback: () => { }
      });
    }
    next();
  } else if (userToken?.token) {
    // console.log('routersInfo: ', routersInfo);
    if (routersInfo.length > 0 || to.path.indexOf('/person-center') > -1) {
      store.commit('Common/ADD_MENU_ID', getMenuId(to.path, to.name));
      next();
    } else {
      store.dispatch('user/getUserInfo', {
        isRedirect: false,
        callback: () => {
          store.commit('Common/ADD_MENU_ID', getMenuId(to.path, to.name));
          next();
        }
      });
    }
  } else {
    next('/login');
  }
});

if (process.env.ENV !== 'development') {
  router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
      // 用路由的replace方法，并没有相当于F5刷新页面，失败的js文件并没有从新请求，会导致一直尝试replace页面导致死循环，而用 location.reload 方法，相当于触发F5刷新页面，虽然用户体验上来说会有刷新加载察觉，但不会导致页面卡死及死循环，从而曲线救国解决该问题
      window.location.reload();
    }
    if (isChunkLoadFailed === null) {
      window.location.reload();
    }
  });
}

export default router;
