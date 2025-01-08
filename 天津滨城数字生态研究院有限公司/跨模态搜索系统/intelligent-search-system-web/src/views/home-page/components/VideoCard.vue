<template>
  <!--最外层-->
  <div class="w-full rounded shadow-card bg-white-card hover:shadow-card-hover hover:cursor-pointer"
       style="height: 196px;">
    <!--图片区-->
    <img :src="img" style="height: 139px;border-radius: 4px 4px 0 0;" class="w-full" alt="">
    <!--文字区域-->
    <div class="w-full pl-4 pr-4">
      <!--名称区域-->
      <span class="w-full text-hidden font-semibold text-black-dark text-sm"
            style="margin-top: 10px;"
            :title="name.length > 18 ? name : null">{{name}}</span>
      <!--日期区域-->
      <span class="w-full text-hidden text-xs text-black mt-2">{{date}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoCard',
  props: {
    img: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
};
</script>
