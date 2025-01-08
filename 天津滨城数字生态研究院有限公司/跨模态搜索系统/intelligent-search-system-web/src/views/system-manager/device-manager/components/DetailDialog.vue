<template>
  <el-dialog
    v-dialogDrag
    :title="state === 'create'?'添加监控点':'编辑监控点'"
    visible
    width="480px"
    :close-on-click-modal="false"
    :custom-class="'detail-dialog'"
    :before-close="cancelOperation"
  >
    <el-form ref="ruleFormEL" :model="ruleForm" :rules="rules" label-width="120px" label-suffix=":">
      <el-form-item label="监控点UUID" prop="monitorPointId">
        <el-input v-model="ruleForm.monitorPointId" placeholder="请输入监控点UUID" clearable :disabled="state !== 'create'"/>
      </el-form-item>
      <el-form-item label="监控点位置" prop="monitorPointName">
        <el-input v-model="ruleForm.monitorPointName" placeholder="请输入监控点位置" clearable />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="ruleForm.longitude" placeholder="请输入经度" clearable />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="ruleForm.latitude" placeholder="请输入纬度" clearable />
      </el-form-item>
      <el-form-item label="位置类型" prop="locationId">
        <el-select v-model="ruleForm.locationId" placeholder="请选择位置类型">
          <el-option
            v-for="item in LOCATION_DICT"
            :key="item.id"
            :label="item.itemText"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="朝向" prop="orientationId">
        <el-select v-model="ruleForm.orientationId" placeholder="请选择朝向">
          <el-option
            v-for="item in ORIENTATION_DICT"
            :key="item.id"
            :label="item.itemText"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="deviceTypeId">
        <el-select v-model="ruleForm.deviceTypeId" placeholder="请选择类型">
          <el-option
            v-for="item in DEVICE_TYPE_DICT"
            :key="item.id"
            :label="item.itemText"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-input v-model="ruleForm.brand" placeholder="请输入品牌" clearable />
      </el-form-item>
      <el-form-item label="行政区划代码" prop="divisonCode">
        <el-input v-model="ruleForm.divisonCode" placeholder="请输入行政区划代码" clearable />
      </el-form-item>
      <el-form-item label="单位名称" prop="company">
        <el-input v-model="ruleForm.company" placeholder="请输入单位名称" clearable />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="cancel" @click="cancelOperation">取消</el-button>
      <el-button class="primary" @click="saveOperation">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _debounce from 'lodash/debounce.js';
import { mapGetters } from 'vuex';

export default {
  props: {
    state: {
      type: String,
      default: 'create',
      required: true
    },
    detailForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        monitorPointId: [
          { required: true, message: '请输入监控点UUID', trigger: 'blur' }
        ],
        monitorPointName: [
          { required: true, message: '请输入监控点位置', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '最多输入30个字符',
            trigger: 'blur'
          }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (/^(-?\d+)(\.\d+)?$/.test(value)) {
                callback();
              } else {
                callback(new Error('经度为数字类型'));
              }
            }
          }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (/^(-?\d+)(\.\d+)?$/.test(value)) {
                callback();
              } else {
                callback(new Error('纬度为数字类型'));
              }
            }
          }
        ],
        locationId: [
          { required: true, message: '请选择位置类型', trigger: 'change' }
        ],
        orientationId: [
          { required: true, message: '请选择朝向', trigger: 'change' }
        ],
        deviceTypeId: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        brand: [
          {
            max: 30,
            message: '最多输入30个字符',
            trigger: 'blur'
          }
        ],
        company: [
          {
            max: 30,
            message: '最多输入30个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['LOCATION_DICT']),
    ...mapGetters(['ORIENTATION_DICT']),
    ...mapGetters(['DEVICE_TYPE_DICT']),
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
    saveOperation: _debounce(function () {
      this.$refs.ruleFormEL.validate((valid) => {
        if (valid) {
          this.$emit('save', this.ruleForm);
          return true;
        }
        return false;
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
<style lang="less" scoped>
.detail-dialog {
  .el-select {
    width: 100%;
  }
}
::v-deep .el-dialog__body {
  padding: 12px 48px;
}
</style>
