<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-29 14:21:57
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 15:17:25
 * @FilePath: \ai-platform-front-end-project\src\views\model-manager\components\PushToData.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    title="终审"
    visible
    append-to-body
    :before-close="cancel"
    width="480px"
  >
    <div class="flex justify-center font-size-14 color-content margin-bottom-24">
      <div>确定终审通过请配置，不符合要求请驳回。</div>
    </div>
    <el-form :model="params" label-width="100px" label-suffix=":">
      <!--      <el-form-item label-width="120px" label="实例数">-->
      <!--        <el-input v-model="params.minInstance" style="width: 128px;" />-->
      <!--        <span style="display: inline-block; position: relative; bottom: 4px; width:44px; border-bottom: 1px solid #CFD5DE" />-->
      <!--        <el-input v-model="params.maxInstance" style="width: 128px;" />-->
      <!--      </el-form-item>-->
      <el-form-item label-width="120px" label="实例配置 CPU">
        <el-input-number v-model="params.cpu" style="width: 300px;" :min="1" :max="10" label="描述文字" />
      </el-form-item>
      <el-form-item label-width="120px" label="GPU">
        <el-input-number v-model="params.gpu" style="width: 300px;" :min="0" :max="10" label="描述文字" />
      </el-form-item>
      <el-form-item label-width="120px" label="Memory">
        <el-input-number v-model="params.memory" style="width: 300px;" :min="1" :max="10" label="描述文字" />
      </el-form-item>
      <el-form-item label-width="120px" label="审核信息">
        <el-input
          v-model="params.remark"
          style="width:300px"
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
        />
      </el-form-item>
      <div class="flex justify-center">
        <el-button class="white-btn" @click="reject">驳回</el-button>
        <el-button class="blue-btn" @click="ok">通过</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'PushToData',
  props: {
    params: {
      type: Object,
      required: true
    },
    text: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      // params:{
      //   minInstance:0,
      //   maxInstance:10,
      //   cpu:0,
      //   gpu:0,
      //   memory:0,
      //   remark:'',
      //   resourceConfigureId:1,
      // },
    };
  },
  created() {
    this.params.resourceConfigureId = 1;
    if (this.text !== undefined && this.text !== null) {
      this.params.remark = this.text;
    }
  },
  methods: {
    ok() {
      this.$emit('ok', this.params);
    },
    reject() {
      this.$emit('reject', this.params);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    height: 40px;
    line-height: 40px;
    padding: 0 24px;
    border-bottom: 1px solid rgba(242, 242, 242, 1);
    .el-dialog__title {
      font-size: 14px;
      color: #262626;
      font-weight: 700;
    }
  }
  .el-form-item__label {
    font-weight: 400;
  }
}
</style>
