<template>
  <div class="flex align-center t1">
    <!-- 天津生态城 -->
    <div class="flex class-1-1 hand" @click="init">天津生态城指挥中心</div>
    <div class="flex flex-1 justify-center align-center">
      <div v-for="(item,index) in menuList" :key="index" class="flex class-1-2 hand"
           :class="[index==menuListIndex?'class-1-3':'']" @click="clickMenuList(index)"
           @mouseover="overMenuList(index)" @mouseout="outMenuList">
        {{ item.name }}
      </div>
    </div>
    <div style="width: 20px;height: 20px;">
      <img v-if="weather_icon" :src="`/image/weather/${weather_icon}.svg`" width="100%" height="100%">
    </div>
    <div class="flex" style="margin-left: 12px;font-size: 16px;color: #9EB5CD;">
      {{ temperature_curr }}℃
    </div>
    <div class="flex" style="margin-right: 22px;margin-left: 39px;font-size: 16px;">{{ dateTime }}</div>
  </div>
</template>

<script>
export default {
  name: "MenuBar",
  data(){
    return{
      menuList: [{
        name:'城市概览',
        routeName:'cityOverview',
      },{
        name:'事件搜索',
        routeName:null,
      },{
        name:'模型库',
        routeName:'modelBaseList',
      },{
        name:'区域概括',
        routeName:null,
      },{
        name:'经济运行',
        routeName:null,
      },{
        name:'交通出行',
        routeName:null,
      },{
        name:'生态环境',
        routeName:null,
      },{
        name:'政务服务',
        routeName:null,
      },{
        name:'监控记录',
        routeName:null,
      }],
      dateTime: '',//当前时间
      whether: '',//天气
      weather_icon:'',//天气图标
      temperature_curr: 0,//温度
    }
  },
  computed:{
    menuListIndex:{
      get(){
        return this.$store.state.menuListIndex
      },
      set(value){
        this.$store.commit('setMenuListIndex',value)
      },
    },
    menuListHoverIndex:{
      get(){
        return this.$store.state.menuListHoverIndex
      },
      set(value){
        this.$store.commit('setMenuListHoverList',value)
      },
    },
  },
  created() {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" +
              o[k]).length)));
        }
      }
      return fmt;
    }
    this.datetime()
    setInterval(this.datetime, 1000)
    //获取天气
    this.getWhether()
  },
  mounted() {

  },
  methods:{
    init(){
      this.clickMenuList(0)
    },
    //点击事件
    clickMenuList(index) {
      if(this.menuListIndex == index){
        console.log('跳转的路由与当前路由相同，取消跳转')
        if(this.menuListIndex == 0){
          this.$store.commit('indexPage/setNeedInit',true)
        }
      }else {
        this.menuListHoverIndex = index
        this.menuListIndex = index
        if(this.menuList[this.menuListIndex].routeName){
          this.$router.replace({
            name:this.menuList[this.menuListIndex].routeName
          })
        }
      }
    },
    overMenuList(index) {
      this.menuListHoverIndex = index
    },
    outMenuList() {
      this.menuListHoverIndex = this.menuListIndex
    },
    datetime() {
      this.dateTime = new Date().format("yyyy-MM-dd hh:mm:ss")
    },
    //获取天气
    getWhether() {
      let _this = this
      this.$request.get('/v2/weather/now').then(res => {
        console.log(res)
        _this.whether = res.data.data.weather
        _this.weather_icon = res.data.data.weather_icon
        _this.temperature_curr = res.data.data.temperature_curr
      })
    },
  }
}
</script>

<style scoped>
.t1 {
  background-image: url('../../public/image/daohanglan.png');
}
.class-1-1 {
  margin-left: 33px;
  font-size: 24px;
  font-weight: 600;
  color: #9EB5CD;
}

.class-1-1:hover {
  color: #b9e9fb;
  text-shadow: 0px 0px 2px #67c2c9;
}

.class-1-2 {
  width: 138px;
  height: 41px;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: normal;
  color: #9EB5CD;
}

.class-1-2:hover {
  background-image: url(../../public/image/选中状态.png);
  color: #B1CCE8;
}

.class-1-3 {
  background-image: url(../../public/image/选中状态.png);
  color: #B1CCE8;
}
</style>
