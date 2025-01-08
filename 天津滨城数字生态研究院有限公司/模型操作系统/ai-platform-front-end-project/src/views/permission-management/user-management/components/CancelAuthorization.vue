<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-05 22:28:21
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-01 14:34:01
 * @FilePath: \ai-platform-front-end-project\src\views\permission-management\user-management\components\CancelAuthorization.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <generator-dialog :width="400" title="提示" @ok="ok" @cancel="cancel">
    <template slot="content">
      <div class="flex justify-center align-center" style="width: 100%;padding: 24px 72px;">
        <span v-if="type=='模型'">确定取消授权<span class="color-blue">{{ form.modelNameCh }}</span>模型吗?</span>
        <span v-else-if="type=='数据集'">确定取消授权<span class="color-blue">{{ form.name }}</span>数据集吗?</span>
      </div>
    </template>
  </generator-dialog>
</template>

<script>
import GeneratorDialog from '@/views/permission-management/user-management/components/GeneratorDialog';
export default {
  name: 'CancelAuthorization',
  components: {
    GeneratorDialog
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    type: {
      type: String,
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
