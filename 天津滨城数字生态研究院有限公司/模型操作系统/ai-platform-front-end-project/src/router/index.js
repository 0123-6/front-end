import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/lost-message',
    component: () => import('@/views/login/lost-message/index'),
    hidden: true
  },
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: (resolve) => require(['@/views/redirect'], resolve)
  //     }
  //   ]
  // },
  {
    path: '/'
    // component: Layout,
    // redirect: '/model-base/index'
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 模型库
  {
    path: '/model-base',
    component: Layout,
    redirect: '/model-base/index',
    meta: { title: '模型库', icon: '/pic/moxingku_zhengchang_line_icon.svg', activeIcon: '/pic/moxingku_zhengchang_line_click_icon.svg' },
    children: [
      {
        path: 'index',
        name: 'ModelBase',
        hidden: true,
        component: () => import('@/views/model-base/model-list/index'),
        meta: { title: '模型库' }
      },
      {
        path: 'detail/:id',
        name: 'ModelBaseDetail',
        hidden: true,
        component: () => import('@/views/model-base/model-detail/index'),
        meta: { title: '模型库模型详情' }
      },
      {
        path: 'user-model-detail/:id',
        name: 'userModelDetails',
        hidden: true,
        component: () => import('@/views/model-base/user-model-detail'),
        meta: { title: '用户模型详情' }
      },
      {
        path: 'experience/:id/:modelName/:modelTypeName',
        name: 'ModelBaseExperience',
        hidden: true,
        component: () => import('@/views/model-base/model-experience/index'),
        meta: { title: '模型库体验Demo', icon: 'dashboard' }
      }
    ]
  },
  // 模型开发
  {
    path: '/model',
    component: Layout,
    redirect: 'noredirect',
    name: 'Model',
    meta: { title: '模型开发', icon: '/pic/moxingkaifa_zhengchang_line_icon.svg', activeIcon: '/pic/moxingkaifa_zhengchang_line_click_icon.svg' },
    children: [
      {
        path: 'notebooks',
        name: 'Notebooks',
        component: () => import('@/views/develop/notebooks'),
        meta: { title: 'Notebooks' }
      },
      {
        path: 'notebooks/create',
        name: 'CreateNotebooks',
        hidden: true,
        component: () => import('@/views/develop/notebooks/create'),
        meta: { title: 'Notebooks' }
      },
      {
        path: 'notebooks/link',
        name: 'NotebookLink',
        component: () => import('@/views/develop/notebooks/WorkerFrame.vue'),
        hidden: true,
        meta: { title: 'Notebooks' },
        props: true
      },
      {
        path: 'model-file',
        name: 'ModelFile',
        component: () => import('@/views/develop/model-file'),
        meta: { title: '模型文件' }
      },
      {
        // mode null || 0:直接进去 1：通过模型文件，创建模型进去 2：通过我的模型，查看进去
        path: 'create-model',
        name: 'CreateModel',
        component: () => import('@/views/develop/create-model'),
        meta: { title: '创建模型' },
        redirect: to => {
          return { name: 'CreateModelFrom', params: { mode: ':mode', id: ':id' }};
        },
        children: [
          {
            path: 'create/:mode/:id',
            name: 'CreateModelFrom',
            hidden: true,
            component: () => import('@/views/develop/create-model/create'),
            meta: { title: '创建模型' }
          },
          {
            path: 'preview/:id',
            name: 'CreateModelPreview',
            hidden: true,
            component: () => import('@/views/develop/mine-model/model-detail'),
            meta: { title: '预览模型' }
          }
        ]
      },
      {
        path: 'mine-model',
        name: 'MineModel',
        component: () => import('@/views/develop/mine-model'),
        meta: { title: '我的模型' },
        redirect: '/model/mine-model/list',
        children: [
          {
            path: 'list',
            name: 'ModelList',
            hidden: true,
            component: () => import('@/views/develop/mine-model/list'),
            meta: { title: '我的模型' }
          },
          {
            path: 'detail/:id',
            name: 'ModelDetails',
            hidden: true,
            component: () => import('@/views/develop/mine-model/model-detail'),
            meta: { title: '模型详情' }
          },
          {
            path: 'experience/:id/:modelName/:modelTypeName',
            name: 'ModelBaseExperience',
            hidden: true,
            component: () => import('@/views/model-base/model-experience/index'),
            meta: { title: '模型库体验Demo', icon: 'dashboard' }
          },
          {
            path: 'validate/:id',
            name: 'ModelValidate',
            hidden: true,
            component: () => import('@/views/develop/mine-model/validate'),
            meta: { title: '模型校验' }
          }
        ]
      }
    ]
  },
  // hpj begin
  // 数据管理
  {
    path: '/data-manager',
    component: Layout,
    redirect: 'noredirect',
    name: 'DataManager',
    meta: { title: '数据管理', icon: '/pic/shujuguanli_zhengchang_line_icon.svg', activeIcon: '/pic/shujuguanli_zhengchang_line_click_icon.svg' },
    children: [
      {
        path: 'data-set',
        name: 'DataSet',
        component: () => import('@/views/data-manager/dataSet'),
        meta: { title: '数据集' },
        redirect: '/data-manager/data-set/list',
        children: [
          {
            path: 'list',
            name: 'DataSetList',
            hidden: true,
            component: () => import('@/views/data-manager/dataSet/list'),
            meta: { title: '数据集列表' }
          },
          {
            path: 'common-detail/:webType/:id/:tagType',
            name: 'DataSetCommonDetail',
            hidden: true,
            component: () => import('@/views/data-manager/dataSet/detail/common'),
            meta: { title: '平台数据集详情' }
          },
          {
            path: 'common-label/:webType/:id/:tagType',
            name: 'DataSetCommonLabelList',
            hidden: true,
            component: () => import('@/views/data-manager/dataSet/detail/common/labelList'),
            meta: { title: '平台数据集标注详情' },
            redirect: '/data-manager/data-set/common-label/:webType/:id/:tagType/detail/:labelId/:labelIndex',
            children: [
              {
                path: 'detail/:labelId/:labelIndex',
                name: 'DataSetCommonLabelDetail',
                hidden: true,
                component: () => import('@/views/data-manager/dataSet/detail/common/labelDetail'),
                meta: { title: '平台数据集详情' }
              }
            ]
          },
          {
            path: 'mine-detail/:webType/:id',
            name: 'DataSetMineDetail',
            hidden: true,
            component: () => import('@/views/data-manager/dataSet/detail/mine'),
            meta: { title: '我的数据集详情' }
          }
        ]
      },
      {
        path: 'audit',
        name: 'Audit',
        component: () => import('@/views/data-manager/audit-manager'),
        meta: { title: '审核管理' },
        redirect: '/data-manager/audit/list',
        children: [
          {
            path: 'list',
            name: 'AuditList',
            hidden: true,
            component: () => import('@/views/data-manager/audit-manager/list'),
            meta: { title: '审核列表' }
          },
          {
            path: 'al-type-list/:id/:type',
            name: 'AuditAlTypeList',
            hidden: true,
            component: () => import('@/views/data-manager/audit-manager/al-type-list'),
            meta: { title: '算法列表' }
          },
          {
            path: 'common-label/:id',
            name: 'AuditCommonLabelList',
            hidden: true,
            meta: { title: '审核列表标注详情' },
            component: () => import('@/views/data-manager/audit-manager/al-type-list/labelList'),
            redirect: '/data-manager/audit-manager/common-label/:id/:labelId/:labelIndex',
            children: [
              {
                path: 'detail/:labelId/:labelIndex',
                name: 'PushCommonDetail',
                hidden: true,
                component: () => import('@/views/data-manager/audit-manager/al-type-list/labelDetail'),
                meta: { title: '数据集详情' }
              }
            ]
          }
        ]
      },
      {
        path: 'push',
        name: 'Push',
        component: () => import('@/views/data-manager/push-manager'),
        meta: { title: '上线管理' },
        redirect: '/data-manager/push/list',
        children: [
          {
            path: 'list',
            name: 'PushList',
            hidden: true,
            component: () => import('@/views/data-manager/push-manager/list'),
            meta: { title: '上线列表' }
          },
          {
            path: 'al-type-list/:id/:type',
            name: 'PushAlTypeList',
            hidden: true,
            component: () => import('@/views/data-manager/push-manager/al-type-list'),
            meta: { title: '算法列表' }
          },
          {
            path: 'common-label/:id',
            name: 'PushCommonLabelList',
            hidden: true,
            meta: { title: '上线列表标注详情' },
            component: () => import('@/views/data-manager/push-manager/al-type-list/labelList'),
            redirect: '/data-manager/push-manager/common-label/:id/:labelId/:labelIndex',
            children: [
              {
                path: 'detail/:labelId/:labelIndex',
                name: 'PushCommonDetail',
                hidden: true,
                component: () => import('@/views/data-manager/push-manager/al-type-list/labelDetail'),
                meta: { title: '数据集详情' }
              }
            ]
          }
        ]
      }
    ]
  },
  // 模型管理
  {
    path: '/model-manager',
    component: Layout,
    redirect: 'noredirect',
    name: 'ModelManager',
    meta: { title: '模型监管', icon: '/pic/moxingguanli_zhengchang_line_icon.svg', activeIcon: '/pic/moxingguanli_zhengchang_line_click_icon.svg' },
    children: [
      {
        path: 'push',
        name: 'Push',
        component: () => import('@/views/model-manager/push-manager'),
        meta: { title: '模型管理' },
        redirect: '/model-manager/push/list',
        children: [
          {
            path: 'list',
            name: 'PushList',
            hidden: true,
            component: () => import('@/views/model-manager/push-manager/list'),
            meta: { title: '上线列表' }
          },
          {
            path: 'detail/:id',
            name: 'PushDetail',
            hidden: true,
            component: () => import('@/views/model-manager/push-manager/model-detail'),
            meta: { title: '模型详情' }
          },
          {
            path: 'experience/:id/:modelName/:modelTypeName',
            name: 'ModelBaseExperience',
            hidden: true,
            component: () => import('@/views/model-base/model-experience/index'),
            meta: { title: '模型库体验Demo', icon: 'dashboard' }
          },
          {
            path: 'create/:mode/:id',
            name: 'CreateModelFrom',
            hidden: true,
            component: () => import('@/views/develop/create-model/create'),
            meta: { title: '创建模型' }
          },
          {
            path: 'common-detail/:webType/:id/:tagType',
            name: 'CreateModelFrom',
            hidden: true,
            component: () => import('@/views/data-manager/dataSet/detail/common'),
            meta: { title: '数据集详情' }
          }
        ]
      },
      {
        path: 'evaluation',
        name: 'Evaluation',
        component: () => import('@/views/model-manager/model-evaluation'),
        meta: { title: '模型评估' },
        redirect: '/model-manager/evaluation/list',
        children: [
          {
            path: 'list',
            name: 'EvaluationList',
            hidden: true,
            component: () => import('@/views/model-manager/model-evaluation/list'),
            meta: { title: '任务列表' }
          },
          {
            path: 'create-task',
            name: 'EvaluationCreateTask',
            hidden: true,
            component: () => import('@/views/model-manager/model-evaluation/create-task'),
            meta: { title: '创建任务' }
          },
          {
            path: 'evaluation-result',
            name: 'EvaluationResult',
            hidden: true,
            component: () => import('@/views/model-manager/model-evaluation/evaluation-result'),
            meta: { title: '评估结果' }
          }
        ]
      },
      {
        path: 'comparison',
        name: 'comparison',
        component: () => import('@/views/model-manager/model-comparison'),
        meta: { title: '模型对比' },
        redirect: '/model-manager/comparison/list',
        children: [
          {
            path: 'list',
            name: 'ComparisonList',
            hidden: true,
            component: () => import('@/views/model-manager/model-comparison/list'),
            meta: { title: '模型对比列表' }
          },
          {
            path: 'create',
            name: 'CreateComparison',
            hidden: true,
            component: () => import('@/views/model-manager/model-comparison/create'),
            meta: { title: '模型对比创建' }
          },
          {
            path: 'result/:id',
            name: 'ComparisonResult',
            hidden: true,
            component: () => import('@/views/model-manager/model-comparison/result'),
            meta: { title: '模型对比对比结果' }
          }
        ]
      },
      {
        path: 'monitoring',
        name: 'Monitoring',
        component: () => import('@/views/model-manager/model-monitoring'),
        meta: { title: '模型监控' },
        redirect: '/model-manager/monitoring/index',
        children: [
          {
            path: 'overview',
            name: 'MonitoringOverview',
            hidden: true,
            component: () => import('@/views/model-manager/model-monitoring/overview'),
            meta: { title: '模型监控总览' }
          },
          {
            path: 'detail',
            name: 'MonitoringDetail',
            hidden: true,
            component: () => import('@/views/model-manager/model-monitoring/detail'),
            meta: { title: '模型监控详情' }
          },
          {
            path: 'index',
            name: 'MonitoringIndex',
            hidden: true,
            component: () => import('@/views/model-manager/model-monitoring/index/index.vue'),
            meta: { title: '模型监控总览' }
          },
          {
            path: 'monitor-detail/:id/:modelNameCh/:namespace/:deployment/:tab/:type',
            name: 'MonitorDetail',
            hidden: true,
            props: true,
            component: () => import('@/views/model-manager/model-monitoring/detail2'),
            meta: { title: '模型监控详情' }
          }
        ]
      }
    ]
  },
  // hpj end
  {
    path: '/personal-center',
    name: 'personalCenter',
    component: () => import('@/views/PersonalCenter/index'),
    hidden: true
  },
  // dym end
  {
    path: '/reasoning-result',
    name: 'reasoningResult',
    component: () => import('@/views/model-manager/push-manager/reasoning-result'),
    hidden: true
  },
  {
    path: '/interface-demo',
    name: 'InterfaceDemo',
    hidden: true,
    component: () => import('@/components/InterfaceDemo')
  },
  // 权限管理
  {
    path: '/permission-management',
    component: Layout,
    // redirect: '/permission-management/user-management',
    meta: { title: '权限管理', icon: '/pic/permission-management-icon.svg', activeIcon: '/pic/permission-management-icon.svg' },
    children: [
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/views/permission-management/user-management'),
        meta: { title: '用户管理' },
        redirect: '/permission-management/user-management/list',
        children: [
          {
            path: 'list',
            name: 'UserManagementList',
            hidden: true,
            component: () => import('@/views/permission-management/user-management/list'),
            meta: { title: '用户管理列表' }
          },
          {
            path: 'detail/:id',
            name: 'UserManagementDetail',
            hidden: true,
            component: () => import('@/views/permission-management/user-management/detail'),
            meta: { title: '用户管理详情' }
          }
        ]
      },
      {
        path: 'role-management',
        name: 'RoleManagement',
        hidden: false,
        component: () => import('@/views/permission-management/role-management/index'),
        meta: { title: '角色管理' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  console.log('err', isChunkLoadFailed);
  if (isChunkLoadFailed) {
    // 用路由的replace方法，并没有相当于F5刷新页面，失败的js文件并没有从新请求，会导致一直尝试replace页面导致死循环，而用 location.reload 方法，相当于触发F5刷新页面，虽然用户体验上来说会有刷新加载察觉，但不会导致页面卡死及死循环，从而曲线救国解决该问题
    location.reload();
    // const targetPath = router.history.pending.fullPath;
    // router.replace(targetPath);
  }
  if (isChunkLoadFailed === null) {
    location.reload();
  }
});
export default router;
