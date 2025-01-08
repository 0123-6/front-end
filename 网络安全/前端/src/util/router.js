// 路由配置文件
const { createRouter, createWebHashHistory } = VueRouter

const routes = [
  // 登录页面
  {
    name: 'login',
    path: '/login',
    
    component: () => import('../views/login-page/LoginPage.js'),
    beforeEnter: (to, from) => {
      const user = localStorage.getItem('user')
      if (user) {
        return '/index'
      }
    },
  },
  // 普通页面
  {
    path: '/',
    redirect: '/index',
    meta: {
      requiresAuth: true,
    },
    
    component: () => import('../layout-page/LayoutPage.js'),
    children: [
      // 首页
      {
        name: 'index',
        path: '/index',
        
        component: () => import('../views/index-page/IndexPage.js'),
      },
      // 第2个模块
      {
        name: 'moduleTwo',
        path: '/module-two',
        
        component: () => import('../views/module-two/ModuleTwo.js'),
      },
      // 个人中心
      {
        name: 'personCenter',
        path: '/person-center',
        
        component: () => import('../views/person-center/PersonCenter.js'),
      },
    ],
  },
  // 404页面
  {
    name: 'notFound',
    path: '/:pathMatch(.*)*',
    
    component: () => import('../views/not-found/NotFound.js')
  }
]

export const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
})

// 设置全局前置守卫
router.beforeEach((to, from) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const user = localStorage.getItem('user')
    if (user) {
      return true
    } else {
      // 返回false代表失败，
      // 返回对象代表希望重定向的url
      return '/login'
    }
  }
  // 无需显示返回true
})

router.onError((error) => {
  console.log('error: ', error)
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
  }
  if (isChunkLoadFailed === null) {
    window.location.reload();
  }
})
