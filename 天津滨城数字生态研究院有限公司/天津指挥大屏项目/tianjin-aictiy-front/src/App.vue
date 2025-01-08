<template>
  <div id="app">
      <div class="fill" style="background-color:#0d2749;">
        <scale-box>
          <keep-alive :include="keepAliveComponentList">
            <router-view></router-view>
          </keep-alive>
<!--          <router-view v-if="!$route.meta.keepAlive"></router-view>-->
        </scale-box>
      </div>
  </div>
</template>

<script>
import ScaleBox from "@/components/ScaleBox";
export default {
  components: {
    ScaleBox
  },
  data(){
    return{
      keepAliveComponentList:['index'],
      notAliveComponentList:['realTimeMonitoring'],
    }
  },
}
</script>
