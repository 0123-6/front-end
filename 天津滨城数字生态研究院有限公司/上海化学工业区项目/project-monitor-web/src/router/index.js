import { createWebHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout/Layout'

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/demo',
    component: () => import('@/views/demo'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    name: 'Layout',
    redirect: '/index',
    children: [
      // 首页
      {
        path: '/index',
        component: () => import('@/views/index/Index'),
        name: 'Index',
        meta: { code: 'home' }
      },
      {
        path: '/project',
        component: () => import('@/views/project/ProjectList'),
        name: 'ProjectList',
        meta: { code: 'project_manage' }
      },
      {
        path: '/project/draft',
        component: () => import('@/views/project/ProjectDraft'),
        name: 'ProjectDraft',
        meta: { code: 'project_manage' }
      },
      {
        path: '/project/form/:id/:type',
        component: () => import('@/views/project/ProjectForm'),
        name: 'ProjectForm',
        meta: { code: 'project_manage' }
      },
      {
        path: '/project/detail/:id',
        component: () => import('@/views/project/projectDetail/ProjectDetail'),
        name: 'ProjectDetail',
        meta: { code: 'project_manage' }
      },
      // 项目态势
      {
        path: '/analysis',
        component: () => import('@/views/analysis/Analysis'),
        name: 'Analysis',
        meta: { code: 'project_analysis' }
      },
      {
        path: '/message',
        component: () => import('@/views/message/MessageList'),
        name: 'MessageList',
        meta: { code: 'message_notify' }
      },
      {
        path: '/check',
        component: () => import('@/views/check/CheckAnalysis'),
        name: 'CheckAnalysis',
        meta: { code: 'performence' }
      },
      {
        path: '/check/list',
        component: () => import('@/views/check/CheckList'),
        name: 'CheckList',
        meta: { code: 'performence' }
      },
      {
        path: '/policy',
        component: () => import('@/views/policy/Policy'),
        name: 'Policy',
        props: true,  // 将params作为组件的props
        meta: { code: 'knowledge' }
      },
      {
        path: '/help',
        component: () => import('@/views/help/Help'),
        meta: { code: 'home' }
      },
      {
        path: '/manage',
        component: () => import('@/views/ManageLayout'),
        name: 'ManageLayout',
        redirect: '/flow',
        children: [
          {
            path: '/flow',
            component: () => import('@/views/flow/FlowList'),
            name: 'FlowList',
            meta: { code: 'flow_template' }
          },
          {
            path: '/flow/detail/:id/',
            component: () => import('@/views/flow/FlowDetail'),
            name: 'FlowDetail',
            meta: { code: 'flow_template' }
          },
          {
            path: '/flow/demo',
            component: () => import('@/views/flow/FlowDemo'),
            name: 'FlowDemo',
          },
          {
            path: '/user/list',
            component: () => import('@/views/user-manage/user-list/UserList'),
            name: 'UserList',
            meta: { code: 'user_list' }
          },
          {
            path: '/user/role',
            component: () => import('@/views/user-manage/user-role/UserRole'),
            name: 'UserRole',
            meta: { code: 'role_auth' }
          },
        ]
      },
      // 个人中心
      {
        path: '/person-center',
        component: () => import('@/views/person-center/PersonCenter'),
        meta: { code: 'home' }
      },
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = []

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

if (location.origin.indexOf('localhost:') < 0) {
  router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
      window.location.reload();
    }
    if (isChunkLoadFailed === null) {
      window.location.reload();
    }
  });
}

export default router;
