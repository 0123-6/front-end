import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout/index2';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    // 首页
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    children: [
      {
        path: 'index',
        name: 'HomePage',
        component: () => import('@/views/home-page')
      }
    ]
  },
  {
    // 高级搜索
    path: '/search',
    component: Layout,
    redirect: '/search/index',
    children: [
      {
        path: 'index',
        name: 'AdvancedSearch',
        props: true,
        component: () => import('@/views/advanced-search')
      }
    ]
  },
  {
    // 模型库
    path: '/library',
    component: Layout,
    redirect: '/library',
    children: [
      {
        path: '/',
        name: 'ModelLibrary',
        component: () => import('@/views/model-library')
      },
      {
        path: 'detail/:id',
        name: 'ModeDetail',
        component: () => import('@/views/model-library/components/model-detail')
      }
    ]
  },
  {
    // 管理
    path: '/system',
    component: Layout,
    redirect: '/system/',
    children: [
      {
        path: '/',
        name: 'SystemManager',
        redirect: '/system/model',
        component: () => import('@/views/system-manager'),
        children: [
          {
            path: 'model',
            name: 'ModelManager',
            component: () => import('@/views/system-manager/model-manager')
          },
          {
            path: 'device',
            name: 'DeviceManager',
            component: () => import('@/views/system-manager/device-manager')
          },
          {
            path: 'device-detail/:id',
            name: 'DeviceDetail',
            component: () => import('@/views/system-manager/device-manager/detail')
          },
          {
            path: 'user',
            name: 'UserManager',
            component: () => import('@/views/system-manager/user-manager')
          },
          {
            path: 'user-detail/:id',
            name: 'UserDetail',
            component: () => import('@/views/system-manager/user-manager/detail')
          }
        ]
      }
    ]
  },
  {
    path: '/personal-center',
    name: 'personalCenter',
    component: Layout,
    redirect: '/personal-center/index',
    children: [
      {
        path: 'index',
        name: 'PersonalCenter',
        component: () => import('@/views/personal-center')
      }
    ]
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/login-page')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test')
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

// 菜单处理-系统管理只能管理员进入,未登录的，跳转到登录页面
router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
  if (to.path !== '/login' && !userInfo?.isLogin) {
    next('/login');
  }
  if (to.path.indexOf('/system') >= 0) {
    if (userInfo && userInfo.roleId === 1) {
      next();
    }
  } else {
    next();
  }
});

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  console.log('err', isChunkLoadFailed);
  if (isChunkLoadFailed) {
    // 用路由的replace方法，并没有相当于F5刷新页面，失败的js文件并没有从新请求，会导致一直尝试replace页面导致死循环，而用 location.reload 方法，相当于触发F5刷新页面，虽然用户体验上来说会有刷新加载察觉，但不会导致页面卡死及死循环，从而曲线救国解决该问题
    window.location.reload();
    // const targetPath = router.history.pending.fullPath;
    // router.replace(targetPath);
  }
  if (isChunkLoadFailed === null) {
    window.location.reload();
  }
});

export default router;
