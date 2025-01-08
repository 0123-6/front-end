<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-04 16:06:12
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-07 10:58:46
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
      :model="params"
      :rules="rules"
      label-width="128px"
      label-suffix=":"
      style="margin: 28px 0 22px 0;width: 430px;"
    >
      <el-form-item label="账号" prop="userName">
        <div class="flex justify-between align-center t1" style="width: 100%;">
          <el-input v-model="params.userName" style="width: 212px;" placeholder="请输入手机号或点击右边按钮生成账号" />
          <el-button class="operation-primary-button" style="height: 36px;font-size: 14px;" @click="createUsername">生成账号</el-button>
        </div>
      </el-form-item>
      <el-form-item label="姓名" prop="nickName">
        <el-input v-model="params.nickName" style="width: 100%;" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="单位" prop="company">
        <el-input v-model="params.company" style="width: 100%;" placeholder="请输入单位名称" />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="params.roleId" style="width: 100%;" placeholder="请选择角色">
          <el-option
            v-for="(item,index) in roleList"
            :key="index"
            :value="item.roleId"
            :label="item.text"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber" style="width: 100%;">
        <el-input v-model="params.phonenumber" placeholder="请输入正确的手机号码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" style="width: 100%;">
        <el-input v-model="params.email" placeholder="请输入正确的邮箱格式" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="white-btn" @click="cancelCreate">{{ cancelBtnTitle }}</el-button>
      <el-button class="blue-btn" @click="saveCreate">{{ saveBtnTitle }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import qs from 'qs';
import { getUsername } from '@/api/user';
export default {
  props: {
    title: {
      type: String,
      default: '创建'
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
    roleList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      params: {
        userName: '', // 账号
        nickName: '', // 姓名
        company: '', // 单位
        roleId: '', // 角色
        phonenumber: '', // 手机号
        email: ''// 邮箱
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入手机号或点击右边按钮生成账号',
            pattern: /(^AI22[a-zA-Z0-9]{4}$)|(^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$)/,
            trigger: 'blur'
          }
        ],
        nickName: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          },
          {
            required: false,
            message: '不能输入特殊字符或空格',
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
            trigger: 'blur'
          },
          {
            message: '字符长度<=20',
            min: 1,
            max: 20,
            trigger: 'blur'
          }
        ],
        company: [
          {
            required: true,
            message: '单位不能为空',
            trigger: 'blur'
          },
          { min: 1, max: 50, message: '单位名称不超过50个字符', trigger: 'blur' }

        ],
        roleId: [
          {
            required: true,
            message: '角色不能为空',
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
      }
    };
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
          this.$emit('ok', this.params);
        } else {
          return false;
        }
      });
    },
    createUsername() {
      const params = {
        num: 1
      };
      getUsername(qs.stringify(params)).then(res => {
        const data = res.data;
        this.params.userName = data.data[0];
        this.$refs['paramsRef'].validateField('userName');
      });
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

<style scoped>
.t1 >>> .el-input--medium .el-input__inner{
  font-size: 8px;
}
</style>
