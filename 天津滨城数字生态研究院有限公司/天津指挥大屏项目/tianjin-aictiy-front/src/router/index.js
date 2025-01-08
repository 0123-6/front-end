import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewUI from "view-design";

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect:{
      name:'cityOverview',
    },
  },
  {
    path: '/index',
    name:'index',
    component: () => import('views'),
    meta:{
      keepAlive:true,
    },
    children:[
      {
        path:'city-overview',
        name:'cityOverview',
        component:() => import('views/cityOverview'),
      },
      {
        path: 'model-base-list',
        name:'modelBaseList',
        component:() => import('views/modelBase/ModelList'),
      },
      {
        path: 'model-base-detail/:id',
        name:'modelBaseDetail',
        component:() => import('views/modelBase/ModelDetail'),
        props:true,
      },
    ],
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: () => import('../views/realTimeMonitoring'),
    meta:{
      keepAlive:false,
    },
  },
  {
    path: '/test',
    name:'test',
    component:() => import('../views/test'),
  },
  // {
  //   path: '/earlyWarningInformation',
  //   name: 'earlyWarningInformation',
  //   component: () => import('../views/earlyWarningInformation.vue')
  // },
  // {
  //   path: '/monitoringRecord',
  //   name: 'monitoringRecord',
  //   component: () => import('../views/monitoringRecord.vue')
  // }
]

const router = new VueRouter({
  routes,
  mode:'history',
})

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  next();
});

router.afterEach(route => {
  ViewUI.LoadingBar.finish();
});

export default router
