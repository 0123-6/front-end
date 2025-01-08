<template>
  <generator-dialog title="设置期限" @ok="ok" @cancel="cancel">
    <template slot="content">
      <el-form
        ref="setTimeDialogRef"
        :model="setTimeDialogObject"
        :rules="setTimeDialogRules"
        label-width="128px"
        label-suffix=":"
        style="margin: 44px 0;width: 424px;"
      >
        <el-form-item label="开始时间" prop="beginDate">
          <el-date-picker
            v-model="setTimeDialogObject.beginDate"
            style="width: 100%;"
            type="date"
            :picker-options="beginPickerOptions"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="setTimeDialogObject.endDate"
            style="width: 100%;"
            type="date"
            :picker-options="endPickerOptions"
            placeholder="选择结束时间"
          />
        </el-form-item>
      </el-form>
    </template>
  </generator-dialog>
</template>

<script>
import GeneratorDialog from '@/views/permission-management/user-management/components/GeneratorDialog';
import { changeTimeToLast, parseTime } from '@/utils';
export default {
  name: 'SetTimeDialog',
  components: {
    GeneratorDialog
  },
  props: {
    beginDate: {
      type: String,
      default: '',
      required: false
    },
    endDate: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      setTimeDialogObject: {
        beginDate: '',
        endDate: ''
      },
      setTimeDialogRules: {
        beginDate: [
          {
            required: true,
            message: '开始时间不能为空',
            trigger: 'blur'
          }
        ],
        endDate: [
          {
            required: true,
            message: '结束时间不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 日期选择相关
      beginPickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 86400000 || time.getFullYear()>9999;
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }]
      },
      // 日期选择相关
      endPickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 86400000 || time.getFullYear()>9999;
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }]
      }
    };
  },
  // 可以为同一天，不需要此限制
  // watch: {
  //   setTimeDialogObject: {
  //     handler(val) {
  //       this.endPickerOptions = {
  //         disabledDate(time) {
  //           const time1 = new Date(val.beginDate).getTime();
  //           return time.getTime() <= time1;
  //         },
  //       };
  //       this.beginPickerOptions = {
  //         disabledDate(time) {
  //           const time1 = new Date(val.endDate).getTime();
  //           return time.getTime() > time1 || time.getTime() <= Date.now() - 86400000;
  //         }
  //       };
  //     },
  //     deep: true
  //   }
  // },
  created() {
    if (this.beginDate) {
      this.setTimeDialogObject.beginDate = new Date(JSON.parse(JSON.stringify(this.beginDate)));
    }
    if (this.endDate) {
      this.setTimeDialogObject.endDate = new Date(JSON.parse(JSON.stringify(this.endDate)));
    }
  },
  methods: {
    ok() {
      this.$refs['setTimeDialogRef'].validate((valid) => {
        if (valid) {
          this.setTimeDialogObject.endDate = new Date(changeTimeToLast(this.setTimeDialogObject.endDate));
          if (this.setTimeDialogObject.beginDate.getTime() > this.setTimeDialogObject.endDate.getTime()) {
            this.$message({
              type: 'warning',
              message: '结束时间不能早于开始时间'
            });
            return;
          }
          const object = JSON.parse(JSON.stringify(this.setTimeDialogObject));
          object.beginDate = parseTime(object.beginDate);
          object.endDate = changeTimeToLast(object.endDate);
          this.$emit('ok', object);
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$emit('cancel');
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
