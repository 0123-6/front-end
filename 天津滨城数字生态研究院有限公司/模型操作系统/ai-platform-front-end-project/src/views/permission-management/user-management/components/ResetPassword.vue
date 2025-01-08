<template>
  <generator-dialog :width="400" title="提示" @ok="ok" @cancel="cancel">
    <template slot="content">
      <div class="flex justify-center align-center" style="width: 100%;padding: 24px 72px;">
        <span>账号 <span class="color-blue">{{ form.userName }}</span> 确定要重置密码吗?</span>
      </div>
    </template>
  </generator-dialog>
</template>

<script>
import GeneratorDialog from '@/views/permission-management/user-management/components/GeneratorDialog';
export default {
  components: {
    GeneratorDialog
  },
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    };
  },
  methods: {
    ok() {
      this.$emit('ok');
    },
    cancel() {
      this.$emit('cancel');
    }
  }

};
</script>

<style scoped>

</style>
