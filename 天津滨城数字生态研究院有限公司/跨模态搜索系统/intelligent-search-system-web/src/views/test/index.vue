<template>
  <!--最外层-->
<!--  <div class="m-8 flex"-->
<!--       style="background-color:#11ef4f;width: calc(100vw - 64px);">-->
<!--    &lt;!&ndash;左&ndash;&gt;-->
<!--    <div class="flex flex-col bg-red" style="width: 300px;max-height: 100%;">-->
<!--      <div class="flex flex-col h-full w-full overflow-auto" style="background-color:#ca36d3;max-height: 100%">-->
<!--        <div class="w-full flex items-center pt-2 pb-2 bg-white-bg"-->
<!--             style="height: 60px;"-->
<!--             v-for="(item, index) in data.list1"-->
<!--             :key="index">-->
<!--          {{item}}-->
<!--        </div>-->
<!--        <div class="mt-6 w-full flex justify-between items-center">-->
<!--          <button @click.stop="addList1">+</button>-->
<!--          <button @click.stop="decList1">-</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    &lt;!&ndash;中&ndash;&gt;-->
<!--    <div class="bg-orange" style="width: 2px;"></div>-->
<!--    &lt;!&ndash;右&ndash;&gt;-->
<!--    <div class="flex flex-col bg-blue" style="width: calc(100% - 302px);">-->
<!--      <div class="w-full flex mt-4 mb-4 bg-orange"-->
<!--           style="height: 60px;"-->
<!--           v-for="(item, index) in data.list2"-->
<!--           :key="index">-->
<!--        {{item}}-->
<!--      </div>-->
<!--      <div class="mt-6 w-full flex justify-between items-center">-->
<!--        <button @click.stop="addList2">+</button>-->
<!--        <button @click.stop="decList2">-</button>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
  <div class="flex" style="margin: 50px;width: calc(100% - 100px);background-color: #EE3D0C;">
    <!--左-->
    <div class="pt-4 pb-4" style="width: 300px;background-color: #93c57c;overflow: auto;">
      <div class="w-full" style="height: 50px;background-color:rgba(27,61,225,0.58);"></div>
    </div>
    <!--中-->
    <div class="" style="width: 2px;background-color: slateblue;"></div>
    <!--右-->
    <div class="flex-auto" style="background-color: #3bc515;"></div>
  </div>
</template>

<script>
export default {
  name: 'TestIndex',
  data() {
    return {
      data: {
        list1: [],
        list2: []
      }
    };
  },
  methods: {
    addList1() {
      const list = ['小米', '苹果', '华为', 'VIVO', 'OPPO'];
      this.data.list1.push(list[Math.round(Number(Math.random() * 10)) % 5]);
    },
    decList1() {
      this.data.list1.pop();
    },
    addList2() {
      const list = ['c++', 'c', 'Java', 'Python', 'JavaScript'];
      this.data.list2.push(list[Math.round(Number(Math.random() * 10)) % 5]);
    },
    decList2() {
      this.data.list2.pop();
    }
  }
};
</script>

<style scoped>

</style>
