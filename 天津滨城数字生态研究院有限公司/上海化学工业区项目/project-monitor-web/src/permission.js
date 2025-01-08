import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import useDictStore from '@/store/modules/dict'

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/demo', '/doc', '/401', '/404'];

async function onBeforeEach(to, from, next) {
  console.log('to', to)
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!useUserStore().info.id) {
        await useUserStore().getInfo()
        await useDictStore().initDict()
        next({ ...to, replace: true })
      } else if (useUserStore().permissions.find(n => n.code === to.meta.code)) {
        next()
      } else {
        next('/index')
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  onBeforeEach(to, from, next)
})

router.afterEach((to, from) => {
  NProgress.done()
})
