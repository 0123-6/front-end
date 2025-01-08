<template>
  <generator-dialog title="提示" @ok="setTimeDialogOk" @cancel="setTimeDialogCancel">
    <template slot="content">
      <div class="flex flex-direction" style="width: 100%;padding-left: 56px;padding-right: 56px;padding-top: 54px;height: 200px;">
        <div class="flex color-content font-size-14" style="line-height: 20px;">
          <span>账号作为通行证，各模块功能之间存在必要的业务关联关系，一旦注销本账号(<span class="color-blue">{{ item.userName }}</span>)，账号将无法登陆与使用，用户权益将被清空且无法恢复。</span>
        </div>
      </div>
    </template>
  </generator-dialog>
</template>

<script>
import generatorDialog from '@/views/permission-management/user-management/components/GeneratorDialog';
export default {
  name: 'DeleteDialog',
  components: { generatorDialog },
  props: {
    item: {
      required: true,
      type: Object
    }
  },
  data() {
    return {

    };
  },
  methods: {
    setTimeDialogOk() {
      this.$emit('ok');
    },
    setTimeDialogCancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>

</style>
