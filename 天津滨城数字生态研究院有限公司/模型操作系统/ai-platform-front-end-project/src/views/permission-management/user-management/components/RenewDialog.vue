<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-04 16:06:12
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 16:03:05
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\MessageDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    append-to-body
    top="30vh"
    :title="title"
    :width="width+'px'"
    visible
    :close-on-click-modal="false"
    :custom-class="'message-dialog'"
    :before-close="cancelCreate"
  >
    <el-form
      ref="paramsRef"
      label-width="160px"
      label-suffix=":"
      style="margin: 28px 0 22px 0;width: 380px;"
    >
      <el-form-item label="账号" prop="username">
        <div class="flex align-center color-content font-size-14">
          {{ userName }}
        </div>
      </el-form-item>
      <el-form-item label="上次授权时间" prop="lastAuthorizeTime">
        <div class="flex align-center color-content font-size-14">
          {{ beforeStartTime + ' - ' + beforeEndTime }}
        </div>
      </el-form-item>
      <!-- <el-form-item label="到期后" prop="isRenew">
        <el-radio v-model="isRenew" :label="false">不续期</el-radio>
        <el-radio v-model="isRenew" :label="true">续期</el-radio>
      </el-form-item> -->
      <el-form-item label="续期时间" prop="renewTime">
        <el-date-picker
          v-model="renewTime"
          style="width: 250px;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="cancelCreate">{{ cancelBtnTitle }}</el-button>
      <el-button class="blue-btn" @click="saveCreate">{{ saveBtnTitle }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '续期'
    },
    width: {
      type: Number,
      default: 500
    },
    cancelBtnTitle: {
      type: String,
      default: '取消'
    },
    saveBtnTitle: {
      type: String,
      default: '确认'
    },
    userName: {
      type: String,
      required: true
    },
    beforeStartTime: {
      type: String,
      required: true
    },
    beforeEndTime: {
      type: String,
      required: true
    }

  },
  data() {
    return {
      isRenew: false,
      renewTime: null,
      // 日期选择相关
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        }
      }
    };
  },
  watch: {
    isRenew(newVal, oldVal) {
      if (newVal) {
        this.renewTime = [];
        const t1 = new Date(new Date(this.beforeEndTime).getTime() + 24 * 60 * 60 * 1000);
        this.renewTime.push(t1);
        const t2 = new Date(new Date(t1).setFullYear(t1.getFullYear() + 1));
        this.renewTime.push(t2);
      } else {
        this.renewTime = null;
      }
    }
  },
  created() {
  },
  methods: {
    // 取消按钮
    cancelCreate() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveCreate() {
      this.$emit('ok', this.renewTime);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  label{
    font-weight: 400;
  }
  .message-dialog {
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
      //padding: 24px 72px;
      padding: 0;
    }
    .el-dialog__footer {
      padding: 24px;
      padding-top: 0;
    }
  }
}
</style>
