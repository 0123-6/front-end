<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-01 16:16:08
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 15:14:55
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\CreateDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    :title="state === 'add'?'创建数据集':'编辑基本信息'"
    visible
    width="480px"
    :close-on-click-modal="false"
    :custom-class="'create-dialog'"
    :before-close="cancelOperation"
  >
    <el-form ref="ruleFormEL" :model="ruleForm" :rules="rules" label-width="60px" label-suffix=":">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入数据集名称" clearable />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择数据集类型" :disabled="state==='edit'">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="ruleForm.description"
          type="textarea"
          placeholder="请输入数据集描述"
          :autosize="{ minRows: 6, maxRows: 6 }"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="cancelOperation">取消</el-button>
      <el-button class="blue-btn" @click="saveOperation">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _debounce from 'lodash/debounce';
export default {
  props: {
    state: {
      type: String,
      default: 'add',
      required: true
    },
    detailForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      typeOptions: [
        { label: '图像', value: 'PICTURE' },
        { label: '音频', value: 'VOICE' },
        { label: '文本', value: 'TEXT' },
        { label: '表格', value: 'TABLE' },
        { label: '视频', value: 'VIDEO' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 50, message: '只能输入3-50个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 1, max: 300, message: '长度小于300 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ruleForm: {
      get() {
        return this.detailForm;
      },
      set(newValue) {
        this.$emit('update:detailForm', newValue);
      }
    }
  },
  methods: {
    // 取消按钮
    cancelOperation() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveOperation: _debounce(function() {
      this.$refs.ruleFormEL.validate((valid) => {
        if (valid) {
          this.$emit('save', this.ruleForm);
        } else {
          return false;
        }
      });
    }, 300),
    // 重置
    resetForm() {
      this.$refs.ruleFormEL.resetFields();
    },
    // 清楚
    clearForm() {
      this.$refs.ruleFormEL.clearValidate();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .create-dialog {
    border-radius: 4px;
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(242,242,242,1);
      .el-dialog__title {
        font-family: SourceHanSansSC-Bold;
        font-size: 14px;
        color: #262626;
        letter-spacing: 0;
        line-height: 16px;
        font-weight: 700;
      }
    }
    .el-dialog__body {
      padding: 24px 72px;
      .el-select {
        width: 100%;
      }
      .el-textarea__inner {
        height: 140px;
      }
    }
    .el-dialog__footer {
      padding: 0 24px 24px;
    }
  }
  .el-form-item__label {
    font-weight: 400;
  }
}
</style>
