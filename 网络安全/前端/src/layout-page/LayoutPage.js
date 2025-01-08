const { ref } = Vue
import { state } from '../util/state.js'

export default {
  setup() {
    return {
      // state,
    }
  },
  template: `
    <div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;background-color: #73abfe;">
      <!--导航部分-->
      <div style="width: 100%;height: 60px;display: flex;justify-content: space-between;align-items: center;">
        <!--左-->
        <div style="display: flex;align-items: center;">
          <RouterLink to="/index">首页</RouterLink>
          <RouterLink to="/module-two" style="margin-left: 20px;">模块2</RouterLink>
          <RouterLink to="/person-center" style="margin-left: 20px;">个人中心</RouterLink>
        </div>
        <!--右-->
        <div style="display:flex;align-items: center;">
<!--          <span>{{state?.user?.username}}</span>-->
        </div>
      </div>
      <!--显示区域-->
      <RouterView/>
    </div>
  `,
}
