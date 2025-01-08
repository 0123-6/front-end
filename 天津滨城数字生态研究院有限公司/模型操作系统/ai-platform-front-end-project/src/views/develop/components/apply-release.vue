<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-suffix=":">
      <!--      <el-form-item label="实例数" prop="minInstance">-->
      <!--        <el-row>-->
      <!--          <el-col :span="11">-->
      <!--            &lt;!&ndash;            <el-input v-model="form.minInstance" placeholder="请输入最大实例数" clearable />&ndash;&gt;-->
      <!--            <el-input-number v-model="form.minInstance" placeholder="请输入最大实例数" controls-position="right" :min="1" :max="form.maxInstance - 1" />-->
      <!--          </el-col>-->
      <!--          <el-col :span="2" style="text-align: center;">-</el-col>-->
      <!--          <el-col :span="11">-->
      <!--            &lt;!&ndash;            <el-input v-model="form.maxInstance" placeholder="请输入最大实例数" clearable />&ndash;&gt;-->
      <!--            <el-input-number v-model="form.maxInstance" placeholder="请输入最大实例数" controls-position="right" :min="form.minInstance + 1" :max="1000" />-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--      </el-form-item>-->
      <el-form-item label="实例配置" prop="cpu">
        <el-row style="margin: 10px 10px;">
          <el-col :span="4">CPU</el-col>
          <el-col :span="20">
            <el-input-number
              v-model="form.cpu"
              :min="1"
              :max="9999"
              :step="1"
              :step-strictly="true"
              size="small"
              style="width: 100%;"
            />
          </el-col>
        </el-row>
        <el-row style="margin: 10px 10px;">
          <el-col :span="4">GPU</el-col>
          <el-col :span="20">
            <el-input-number
              v-model="form.gpu"
              :min="0"
              :max="9999"
              :step="1"
              :step-strictly="true"
              size="small"
              style="width: 100%;"
            />
          </el-col>
        </el-row>
        <el-row style="margin: 10px 10px;">
          <el-col :span="4">Memory</el-col>
          <el-col :span="20">
            <el-input-number
              v-model="form.memory"
              :min="1"
              :max="9999"
              :step="1"
              :step-strictly="true"
              size="small"
              style="width: 100%;"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { applyReleaseModel } from '@/api/model.js';

export default {
  name: 'ApplyRelease',
  data() {
    return {
      form: {
        id: '',
        minInstance: 1, // 最小实例数
        maxInstance: 5, // 最大实例数
        cpu: 1,
        gpu: 0,
        memory: 1,
        modelId: ''
      },
      rules: {
        minInstance: [
          {
            required: true,
            message: '实例数不能为空',
            trigger: 'blur'
          }
        ],
        maxInstance: [
          {
            required: true,
            message: '实例数不能为空',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    getInfo(id) {
      this.form.modelId = id;
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          applyReleaseModel(this.form).then(res => {
            if (res.code === '000000') {
              this.$message({
                type: 'success',
                message: '模型发布申请已提交',
                duration: 1000,
                onClose: () => {
                  this.$emit('update:showDialog', false);
                  this.$emit('refreshDataList');
                }
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep{
  .el-form-item__label {
    font-weight: 400;
  }
}
</style>
