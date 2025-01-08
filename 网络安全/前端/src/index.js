const { createApp } = Vue
import { router } from './util/router.js'

createApp({
  template: `<RouterView/>`,
}).use(router).mount('#app')
