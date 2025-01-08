<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-04 16:06:12
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 15:18:18
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\MessageDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    append-to-body
    top="10vh"
    :title="title"
    :width="width+'px'"
    visible
    :close-on-click-modal="false"
    :custom-class="'message-dialog'"
    :before-close="cancelCreate"
  >
    <el-form
      ref="paramsRef"
      :model="params"
      :rules="rules"
      label-width="128px"
      label-suffix=":"
      style="margin: 28px 0 22px 0;width: 424px;"
    >
      <el-form-item label="账号" prop="userName">
        <div class="flex justify-between align-center" style="width: 100%;">
          <el-input v-model="params.userName" disabled style="width: 100%;" placeholder="" />
        </div>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="params.password" disabled style="width: 212px;" placeholder="请输入密码" />
        <el-button class="operation-primary-button" style="height: 32px;margin-left: 8px;" @click="showResetPasswordDialog = true">重置密码</el-button>
      </el-form-item>
      <el-form-item label="姓名" prop="nickName">
        <el-input v-model="params.nickName" style="width: 100%;" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="单位" prop="company">
        <el-input v-model="params.company" style="width: 100%;" placeholder="请输入单位名称" />
      </el-form-item>
      <el-form-item label="角色" prop="roleKey">
        <el-select v-model="params.roleKey" disabled style="width: 100%;" placeholder="请选择角色">
          <el-option v-for="(item,index) in roleList" :key="index" :value="item.roleKey" :label="item.roleName" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber" style="width: 100%;">
        <el-input v-model="params.phonenumber" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" style="width: 100%;">
        <el-input v-model="params.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="params.createTime"
          disabled
          style="width: 100%;"
          type="date"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="到期时间" prop="endTime">
        <el-date-picker
          v-model="params.endDate"
          style="width: 100%;"
          type="date"
          placeholder="选择结束时间"
          :picker-options="pickerOptions"
        />
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="cancelCreate">{{ cancelBtnTitle }}</el-button>
      <el-button class="blue-btn" @click="saveCreate">{{ saveBtnTitle }}</el-button>
    </span>
    <!--重置密码弹框-->
    <reset-password
      v-if="showResetPasswordDialog"
      :form="params"
      @ok="resetPasswordDialogOk"
      @cancel="resetPasswordDialogCancel"
    />
  </el-dialog>
</template>
<script>
import ResetPassword from '@/views/permission-management/user-management/components/ResetPassword';
import { resetPassword } from '@/api/user';
import { changeTimeToLast, parseTime } from '@/utils';
import qs from 'qs';
export default {
  components: {
    ResetPassword
  },
  props: {
    title: {
      type: String,
      default: '修改用户信息'
    },
    width: {
      type: Number,
      default: 480
    },
    cancelBtnTitle: {
      type: String,
      default: '取消'
    },
    saveBtnTitle: {
      type: String,
      default: '确认'
    },
    userInfo: {
      type: Object,
      required: true
    },
    roleList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: {
        userName: [
          {
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }
        ],
        nickName: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        company: [
          {
            required: true,
            message: '单位不能为空',
            trigger: 'blur'
          }
        ],
        phonenumber: [
          {
            required: false,
            message: '请输入正确的手机格式',
            pattern: /^1[3456789]\d{9}$/,
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: false,
            message: '请输入正确的邮箱格式',
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+[- | a-z0-9A-Z . _]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            trigger: 'blur'
          }
        ]
      },

      params: {},
      // 弹框相关
      showResetPasswordDialog: false,
      // 日期选择相关
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 86400000;
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
  created() {
    this.params = JSON.parse(JSON.stringify(this.userInfo));
  },
  methods: {
    // 取消按钮
    cancelCreate() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveCreate() {
      this.$refs['paramsRef'].validate((valid) => {
        if (valid) {
          delete this.params.password;
          this.params.endDate = parseTime(this.params.endDate);
          this.params.endDate = changeTimeToLast(this.params.endDate);
          this.$emit('ok', this.params);
        } else {
          return false;
        }
      });
    },
    // 重置密码
    async resetPasswordDialogOk() {
      const params = {
        userId: this.userInfo.userId
      };
      await resetPassword(qs.stringify(params)).then(res => {
        if (res.desc === 'success') {
          this.$message({
            type: 'success',
            message: '重置密码成功，新密码为' + res.data
          });
        } else {
          this.$message({
            type: 'error',
            message: '重置密码失败'
          });
        }
      });
      this.resetPasswordDialogCancel();
    },
    resetPasswordDialogCancel() {
      this.showResetPasswordDialog = false;
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
