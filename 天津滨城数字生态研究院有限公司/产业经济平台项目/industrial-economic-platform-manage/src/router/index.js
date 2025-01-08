/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-01-29 11:22:22
 * @FilePath: \smart search web\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';
import Layout from '@/layout';

Vue.use(VueRouter);
const redirectPath = store.getters.MENU_TREE[0]?.children[0]?.path;

const routes = [
  {
    // 首页
    path: '/',
    component: Layout,
    redirect: redirectPath,
    children: [
      {
        path: '/user/list',
        name: 'User',
        component: () => import('@/views/account-page/user'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/user/auth',
        name: 'Role',
        component: () => import('@/views/account-page/role'),
        meta: {
          title: '角色列表'
        }
      },
      {
        path: '/policy',
        name: 'PolicyList',
        component: () => import('@/views/PolicyList'),
        meta: {
          title: '政策管理'
        }
      },
      {
        path: '/policy/detail/:id',
        name: 'PolicyDetail',
        component: () => import('@/views/PolicyDetail'),
        meta: {
          title: '政策详情'
        }
      },
      {
        path: '/industry',
        name: 'IndustryChainList',
        component: () => import('@/views/IndustryChainList'),
        meta: {
          title: '产业链管理'
        }
      },
      {
        path: '/industry/detail/:id',
        name: 'IndustryDetail',
        component: () => import('@/views/IndustryDetail'),
        meta: {
          title: '产业链详情'
        }
      },
      {
        path: '/company',
        name: 'CompanyList',
        component: () => import('@/views/CompanyList'),
        meta: {
          title: '企业管理'
        }
      },
      {
        path: '/company/detail/:id',
        name: 'CompanyDetail',
        component: () => import('@/views/CompanyDetail'),
        meta: {
          title: '企业详情'
        }
      },
      {
        path: '/tenant/list',
        name: 'OrgList',
        component: () => import('@/views/OrgList'),
        meta: {
          title: '机构管理'
        }
      },
      {
        path: '/tenant/detail/:id',
        name: 'OrgDetail',
        component: () => import('@/views/OrgDetail'),
        meta: {
          title: '机构详情'
        }
      },
      {
        path: '/tenant/form/:id',
        name: 'OrgForm',
        component: () => import('@/views/OrgForm'),
        meta: {
          title: '新增机构'
        }
      },
      {
        path: '/tenant/user/:id/:userId',
        name: 'OrgUserDetail',
        component: () => import('@/views/OrgUserDetail'),
        meta: {
          title: '机构用户详情'
        }
      },
      // 指数管理 /index
      {
        path: '/index',
        name: 'IndexManage',
        component: () => import('@/views/index-manage/IndexManage'),
        meta: {
          title: '指数管理'
        },
      },
      // 指数管理详情 /index/detail/:id
      {
        path: '/index/detail/:id',
        name: 'IndexManageDetail',
        component: () => import('@/views/index-manage/detail/IndexManageDetail'),
        meta: {
          title: '指数详情'
        },
      },
      // 问答管理 /question
      // 问答管理会话列表 /question/session
      {
        path: '/question/session',
        name: 'QuestionSession',
        component: () => import('@/views/question/session/QuestionSession'),
        meta: {
          title: '会话列表',
        },
      },
      // 问答管理会话列表会话详情 /question/session/detail
      {
        path: '/question/session/detail/:id',
        name: 'QuestionSessionDetail',
        component: () => import('@/views/question/session/detail/QuestionSessionDetail'),
        meta: {
          title: '会话详情',
        },
      },
      // 问答管理问题列表 /question/list
      {
        path: '/question/list',
        name: 'QuestionList',
        component: () => import('@/views/question/list/QuestionList'),
        meta: {
          title: '问题列表',
        },
      },
      // 问答管理问题列表问题详情 /question/list/detail
      {
        path: '/question/list/detail/:id',
        name: 'QuestionListDetail',
        component: () => import('@/views/question/list/QuestionListDetail'),
        meta: {
          title: '问题详情',
        },
      },
      // 问答管理问题模版 /question/tmpl
      {
        path: '/question/tmpl',
        name: 'QuestionTmpl',
        component: () => import('@/views/question/tmpl/QuestionTmpl'),
        meta: {
          title: '问题模版',
        },
      },
    ]
  },
  {
    // 登录
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login-page')
  }

];

const router = new VueRouter({
  routes, base: '/admin/'
});

// 菜单处理-系统管理只能管理员进入
router.beforeEach((to, from, next) => {
  const userInfo = store.getters?.USER_INFO || {};
  store.commit('Common/ADD_ROUTER_TAG', { title: to.meta.title, path: to.path });
  if (to.path.indexOf('/system') >= 0) {
    if (userInfo?.user?.roleId.toString() === '1') {
      next();
    } else {
      next('/index');
    }
  } else {
    next();
  }
});

export default router;
