<template>
  <!--最外层-->
  <div class="w-full rounded shadow-card-light bg-white border-[1px] hover:shadow-card-hover hover:cursor-pointer"
       style="height: 233px;border-color: rgba(234,234,234,1);">
    <!--图片区-->
    <img :src="img" style="height: 165px;border-radius: 4px 4px 0 0;" class="w-full" alt="">
    <!--文字区域-->
    <div class="w-full pl-4 pr-4">
      <!--名称区域-->
      <span class="w-full text-hidden font-semibold text-black-dark text-sm"
            style="margin-top: 12px;"
            :title="name.length > 20 ? name : null">{{name}}</span>
      <!--日期区域-->
      <span class="w-full text-hidden text-sm text-black mt-2">{{date}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoCard2',
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
