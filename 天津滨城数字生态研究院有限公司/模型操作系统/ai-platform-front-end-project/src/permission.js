/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-08-22 10:02:08
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-14 11:36:34
 * @FilePath: \ai-platform-front-end-project\src\permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import router, { constantRoutes } from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/lost-message']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  // document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    // console.log('has Token')
    // console.log('to.path:', to.path)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else if (to.path === '/') {
      await store.dispatch('user/getInfo');
      await store.dispatch('user/getMenu');
      await store.dispatch('user/getExternalLink');
      let firstMenu = store.getters.menuList.find(item => { return store.getters.whiteMenuList.indexOf(item.path) < 0; });
      let path = '';
      if (firstMenu === undefined) {
        firstMenu = [];
        constantRoutes.map(item => {
          // 这几个不用判断
          if (item.path === '/404') {
            firstMenu.push(item);
          }
        });
        path = firstMenu[0].path;
      } else {
        path = firstMenu.redirect === 'noredirect' ? firstMenu.path + '/' + firstMenu.children[0].path : firstMenu.path;
      }
      next(path);
    } else if (to.path === '/404') {
      next();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        if (store.getters.menuNameList.indexOf(to.name) >= 0) {
          next();
        } else {
          next('/');
        }
      } else {
        try {
          // get user info
          // console.log('get user info')
          await store.dispatch('user/getInfo');
          await store.dispatch('user/getMenu');
          await store.dispatch('user/getExternalLink');
          if (store.getters.menuNameList.length > 0) {
            if (store.getters.menuNameList.indexOf(to.name) >= 0) {
              next();
            } else {
              next('/');
            }
          } else {
            next('/login');
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next('/login');
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/
    // console.log('no token')
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
