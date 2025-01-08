<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-04 16:06:12
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-22 16:00:10
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\MessageDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    v-dialogDrag
    top="12vh"
    :title="title"
    :width="width+'px'"
    visible
    :close-on-click-modal="false"
    :custom-class="'message-dialog'"
    :before-close="cancelCreate"
  >
    <!--最外层-->
    <div class="flex flex-direction id123" style="width: 100%;height: 512px;">
      <!--步骤条-->
      <div style="width: 100%;" class="flex justify-center margin-top-24">
        <AiSteps :active="active" :steps="steps"></AiSteps>
      </div>
      <!--内容区-->
      <div class="flex flex-1 flex-direction" style="width: 100%;">
        <!--上传文件-->
        <div v-if="active===0" class="flex flex-direction" style="width: 100%;">
          <el-form
            ref="ref1"
            :model="params1"
            :rules="rules1"
            label-width="308px"
            label-suffix=":"
            style="margin: 28px 0 22px 0;width: 710px;"
          >
            <el-form-item label="下载">
              <div class="flex align-center" style="width: 100%;">
                <span class="font-size-14 color-blue hand" @click="downloadTemplate">下载模板</span>
              </div>
            </el-form-item>
            <el-form-item label="上传" prop="file">
              <div class="flex flex-direction" style="width: 100%;">
                <upload-excel :before-upload="beforeUpload" :on-success="handleUploadSuccess" />
                <div v-if="isUploadFile" class="flex align-center font-size-14">
                  <div v-if="uploadFileOk" class="flex color-blue" style="line-height: 20px;">
                    {{ excelFileName }}
                  </div>
                  <div v-else class="flex color-red " style="line-height: 20px;">
                    {{ excelFileName }} 文件内部格式错误，请重新上传
                  </div>
                </div>
                <div v-if="!isUploadFile && showError" class="flex align-center font-size-14 color-red" style="line-height: 20px;">
                  未选择任何文件，请上传文件
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!--数据校验-->
        <div
          v-if="active===1"
          class="flex flex-1 flex-direction"
          style="width: 100%;padding-left: 22px;padding-right: 22px;"
        >
          <!--提示语-->
          <div
            class="flex align-center font-size-12 color-content"
            style="width: 100%;height: 34px;background: rgba(0,177,178,0.07);padding-left:24px;border-radius: 4px;"
          >
            <span v-if="data2.totalFalse!==0">共<span class="color-blue">{{ data2.total }}</span>条数据，可导入<span
              class="color-green"
            >{{ data2.totalSuccess }}</span>条数据，<span
              class="color-red"
            >{{ data2.totalFalse }}</span>条数据校验未通过，按照以下提示修改源文件后重新导入。</span>
            <span v-if="data2.totalFalse===0">共<span class="color-blue">{{ data2.total }}</span>条数据，可导入<span
              class="color-green"
            >{{ data2.totalSuccess }}</span>条数据，确定要全部导入吗？确定请点击【下一步】</span>
          </div>
          <!--table-->
          <div class="flex flex-1 flex-direction margin-top-8" style="width: 100%;">
            <el-table
              ref="filterTable"
              key="filter"
              style="width: 100%;border: 1px solid rgba(207,213,222,1);border-radius: 2px;"
              highlight-current-row
              height="calc(100% - 8px - 60px)"
              border
              :data="data2.showTableData"
            >
              <el-table-column
                label="序号"
                align="left"
                show-overflow-tooltip
                min-width="60"
                type="index"
                :index="indexMethod"
              />
              <el-table-column label="姓名" align="left" prop="nickName" show-overflow-tooltip min-width="150">
                <template slot-scope="scope" class="flex align-center font-size-14" style="width: 100%;">
                  <span v-if="scope.row.nickName!==''" class="color-content">{{ scope.row.nickName }}</span>
                  <span v-if="scope.row.nickName===''" class="color-red">*必填</span>
                </template>
              </el-table-column>
              <el-table-column label="手机号" align="left" prop="phonenumber" show-overflow-tooltip min-width="120">
                <template slot-scope="scope" class="flex align-center font-size-14" style="width: 100%;">
                  <span v-if="scope.row.phonenumber===''" class="color-content">{{ scope.row.phonenumber }}</span>
                  <span
                    v-else-if="!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(scope.row.phonenumber)"
                    class="color-red"
                  >{{ scope.row.phonenumber }}</span>
                  <span v-else class="color-content">{{ scope.row.phonenumber }}</span>
                </template>
              </el-table-column>
              <el-table-column label="单位" align="left" prop="company" show-overflow-tooltip min-width="100">
                <template slot-scope="scope" class="flex align-center font-size-14" style="width: 100%;">
                  <span v-if="scope.row.company!==''" class="color-content">{{ scope.row.company }}</span>
                  <span v-if="scope.row.company===''" class="color-red">*必填</span>
                </template>
              </el-table-column>
              <el-table-column label="邮箱" align="left" prop="email" show-overflow-tooltip min-width="130">
                <template slot-scope="scope" class="flex align-center font-size-14" style="width: 100%;">
                  <span v-if="scope.row.email===''" class="color-content">{{ scope.row.email }}</span>
                  <span
                    v-else-if="!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(scope.row.email)"
                    class="color-red"
                  >{{ scope.row.email }}</span>
                  <span v-else class="color-content">{{ scope.row.email }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div
            v-if="data2.pageItemTotal > data2.pageSize"
            class="flex justify-center align-center"
            style="width: 100%;height: 60px;"
          >
            <el-pagination
              background
              :page-size="data2.pageSize"
              layout="total,prev, pager, next,sizes,jumper"
              :page-sizes="[10,20,30,40]"
              :current-page="data2.currentPage"
              :total="data2.pageItemTotal"
              @size-change="changePageSize"
              @current-change="changePageNum"
            />
          </div>
        </div>
        <!--设置角色-->
        <div
          v-if="active===2"
          class="flex flex-1 flex-direction"
          style="width: 100%;padding-left: 22px;padding-right: 22px;"
        >
          <!--提示语-->
          <div
            class="flex justify-between align-center font-size-12 color-content"
            style="line-height: 12px;width: 100%;height: 34px;background: rgba(0,177,178,0.07);padding-left:24px;border-radius: 4px;"
          >
            <!--左-->
            <div class="flex align-center">
              <span>已成功创建共<span class="color-blue">{{ data2.total }}</span>个账号，请设置角色。</span>
            </div>
            <!--右-->
            <div class="flex align-center">
              <div class="flex align-center">
                <span style="">已选<span class="color-blue">{{ data3.selectNum }}</span>项</span>
              </div>
              <div class="flex align-center margin-left-16 margin-right-16" style="height: 24px;">
                <el-select
                  v-model="data3.selectedRole"
                  placeholder="批量设置角色"
                  clearable
                  style="width: 138px;height: 100%;"
                  :disabled="data3.selectedItemList && data3.selectedItemList.length==0"
                  @change="setBatchRole"
                >
                  <el-option
                    v-for="(item,index) in roleList"
                    :key="index"
                    :label="item.text"
                    :value="item.roleId"
                  />
                </el-select>
              </div>
            </div>
          </div>
          <!--table-->
          <div v-loading="data3.showTableData && data3.showTableData.length === 0" class="flex flex-1 flex-direction margin-top-8" style="width: 100%;">
            <el-table
              ref="setRoleTable"
              key="setRole"
              style="width: 100%;border: 1px solid rgba(207,213,222,1);border-radius: 2px;"
              highlight-current-row
              height="calc(100% - 8px - 60px)"
              border
              :data="data3.showTableData"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" align="center" min-width="55" />
              <el-table-column type="index" label="序号" min-width="50" :index="indexMethod" />
              <!--              <el-table-column label="ID" align="left" prop="id" show-overflow-tooltip min-width="60" />-->
              <el-table-column label="账号" align="left" prop="userName" show-overflow-tooltip min-width="90" />
              <el-table-column label="密码" align="left" prop="password" show-overflow-tooltip min-width="60">
                <template class="flex align-center font-size-14" style="width: 100%;">
                  <span>******</span>
                </template>
              </el-table-column>
              <el-table-column label="姓名" align="left" prop="nickName" show-overflow-tooltip min-width="70" />
              <el-table-column label="手机号" align="left" prop="phonenumber" show-overflow-tooltip min-width="110" />
              <el-table-column label="单位" align="left" prop="company" show-overflow-tooltip min-width="130" />
              <el-table-column label="邮箱" align="left" prop="email" show-overflow-tooltip min-width="130" />
              <el-table-column
                label="角色"
                align="left"
                prop="roleId"
                fixed="right"
                show-overflow-tooltip
                min-width="150"
              >
                <template slot-scope="scope" class="flex align-center font-size-14" style="width: 100%;">
                  <el-select
                    v-model="scope.row.roleId"
                    placeholder="请选择角色"
                    clearable
                    style="width: 120px;height: 100%;"
                  >
                    <el-option
                      v-for="(item,index) in roleList"
                      :key="index"
                      :label="item.text"
                      :value="item.roleId"
                    />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div
            v-if="data3.pageItemTotal > data3.pageSize"
            class="flex justify-center align-center"
            style="width: 100%;height: 60px;"
          >
            <el-pagination
              background
              :page-size="data3.pageSize"
              layout="total,prev, pager, next,sizes,jumper"
              :page-sizes="[10,20,30,40]"
              :current-page="data3.currentPage"
              :total="data3.pageItemTotal"
              @size-change="changePageSize"
              @current-change="changePageNum"
            />
          </div>
        </div>
        <!--完成创建-->
        <div v-if="active===3" v-loading="!createFinish" class="flex justify-center flex-direction" style="width: 100%;">
          <!--图标-->
          <div v-if="createFinish && createResult" class="flex justify-center" style="margin-top: 100px;">
            <img src="@/assets/images/permission-management/success.svg" width="54" height="54" alt="">
          </div>
          <!--创建成功文字-->
          <div v-if="createFinish && createResult" class="flex justify-center font-size-14 color-content" style="margin-top: 26px;">
            成功创建<span class="color-blue">{{ data3.pageItemTotal }}</span>个账号
          </div>
          <!--创建失败文字-->
          <div v-if="createFinish && !createResult" class="flex justify-center font-size-14 color-red" style="margin-top: 26px;">
            创建<span class="color-red">{{ data3.pageItemTotal }}</span>个账号失败
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer margin-top-24">
      <el-button
        v-if="active!=0"
        class="white-btn"
        @click="beforeStep"
      >上一步</el-button>
      <el-button
        v-else
        class="white-btn"
        @click="cancelCreate"
      >取消</el-button>
      <el-button
        v-if="active!==3"
        class="blue-btn"
        :disabled="active===3 || (active===1 && data2.totalFalse!==0) || (active===2 && !data3AllHasRole)"
        @click="afterStep"
      >下一步</el-button>
      <el-button v-if="active===3" class="blue-btn" @click="ok">完成</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _debounce from 'lodash/debounce';
import UploadExcel from '@/components/UploadExcel';
import { batchCreateUser, getUsername } from '@/api/user';
import qs from 'qs';
import AiSteps from "@/components/AiSteps";

export default {
  components: {AiSteps, UploadExcel },
  props: {
    title: {
      type: String,
      default: '批量创建'
    },
    width: {
      type: Number,
      default: 900
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
      showError: false,
      active: 0, // 活跃的步骤条
      isUploadFile: false, // 是否上传文件
      uploadFileOk: true, // 上传的文件是否ok
      excelFileName: '',
      steps: ['上传文件', '数据校验', '设置角色', '完成创建'],
      params1: {
        file: ''
      },
      rules1: {
        // file: [
        //   {
        //     required: true,
        //   }
        // ]
      },
      data2: {
        total: 0,
        totalSuccess: 0,
        totalFalse: 0,
        tableData: [], // 全部数据
        showTableData: [], // 展示的数据,用来分页
        // 分页
        pageItemTotal: 0,
        pageSize: 10,
        currentPage: 1
      },

      data3: {
        tableData: [], // 全部数据
        showTableData: [], // 展示的数据,用来分页
        // 分页
        pageItemTotal: 0,
        pageSize: 10,
        currentPage: 1,

        selectNum: 0,
        selectedRole: '',
        selectedItemList: []
      },
      createResult: false, // 创建结果
      createFinish: false, // 创建是否完成

      // 默认步骤数
      milepostActive: 0,
      // 动态添加类名
      stepActive: 'stepActive'
    };
  },
  computed: {
    data3AllHasRole() {
      let ok = true;
      if(this.data3.tableData){
        for (let i = 0; i < this.data3.tableData.length; i++) {
          if (this.data3.tableData[i].roleId === '') {
            ok = false;
          }
        }
      }
      return ok;
    }
  },
  watch: {
    active(newVal, oldVal) {
      if (newVal === 0) { // 上传文件

      } else if (newVal === 1) { // 数据校验
        this.getList();
      } else if (newVal === 2) { // 设置角色
        this.data3.showTableData = null;
        this.data3.tableData = this.data2.tableData;
        this.data3.pageItemTotal = this.data3.tableData.length;
        this.data3.pageSize = 10;
        this.data3.currentPage = 1;
        // 虚拟创建用户账号
        this.batchCreateUsername();
      } else if (newVal === 3) { // 开始创建
        this.batchCreateUser();
      } else {
        console.error('不应该到达的代码，有bug，请排查!');
      }
    }
  },
  methods: {
    // 创建用户账号
    batchCreateUsername() {
      const params = {
        num: this.data3.pageItemTotal
      };
      getUsername(qs.stringify(params)).then(res => {
        const data = res.data;
        console.log('this.data3.tableData:',this.data3.tableData)
        for (let i = 0; i < this.data3.tableData.length; i++) {
          this.data3.tableData[i].userName = data.data[i];
        }
        this.getList();
      });
    },
    // 批量创建用户
    batchCreateUser() {
      const data = this.data3.tableData;
      batchCreateUser(data).then(res => {
        if (res.desc === 'success') {
          this.$message({
            type: 'success',
            message: '批量创建用户成功'
          });
          this.createResult = true;
        } else {
          this.$message({
            type: 'error',
            message: '批量创建用户失败'
          });
          this.createResult = false;
        }
        this.createFinish = true;
      });
    },
    // 取消按钮
    cancelCreate() {
      this.$emit('cancel');
    },
    // 确定按钮
    saveCreate: _debounce(function() {
      this.$refs['paramsRef'].validate((valid) => {
        if (valid) {
          this.$emit('ok', this.params);
        } else {
          return false;
        }
      });
    }, 300),
    ok() {
      this.$emit('ok');
    },
    beforeStep() {
      this.active--;
    },
    afterStep() {
      if (this.active === 0) {
        this.$refs['ref1'].validate(value => {
          if (value) {
            let ok = true;
            if (!this.isUploadFile) {
              this.showError = true;
              ok = false;
            } else if (!this.uploadFileOk) {
              this.$message({
                type: 'warning',
                message: '文件内部格式错误，请重新上传'
              });
              ok = false;
            } else if (this.data2.total === 0) {
              this.$message({
                type: 'warning',
                message: '上传的文件中用户数据为空，请重新上传文件!'
              });
              ok = false;
            }
            if (ok) {
              this.active++;
            }
          } else {
            return;
          }
          return;
        });
      } else {
        this.active++;
      }
    },
    downloadTemplate() {
      const endIndex = this.findNCharAtString(location.href, '/', 2);
      window.open(location.href.substring(0, endIndex + 1) + '新建用户名单模板.xlsx', 'new');
      window.close('new');
    },
    findNCharAtString(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    /** 上传模型格式校验 */
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      } else {
        this.$message({
          message: '文件最大为1M，超出限制，上传失败',
          type: 'error'
        });
        return false;
      }
    },
    /** 模型上传成功 */
    handleUploadSuccess({ results, header, fileName }) {
      this.excelFileName = fileName;
      this.uploadFileOk = header.length === 4;
      const okHeaderList = ['*姓名', '手机号', '*单位', '邮箱'];
      for (let i = 0; i < okHeaderList.length; i++) {
        if (header.indexOf(okHeaderList[i]) === -1) {
          this.uploadFileOk = false;
        }
      }
      this.isUploadFile = true;
      const userList = [];
      for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const params = {
          nickName: item['*姓名'] ? item['*姓名'] : '',
          phonenumber: item.手机号 ? item.手机号 : '',
          company: item['*单位'] ? item['*单位'] : '',
          email: item.邮箱 ? item.邮箱 : '',
          roleId: ''
        };
        userList.push(params);
      }
      this.data2.tableData = userList;
      this.data2.total = this.data2.tableData.length;
      this.data2.pageItemTotal = this.data2.total;
      this.data2.currentPage = 1;
      this.data2.pageSize = 10;
      this.data2.totalSuccess = 0;
      this.data2.totalFalse = 0;
      // 验证
      for (let i = 0; i < this.data2.tableData.length; i++) {
        let ok = true;
        const item = this.data2.tableData[i];
        if (item.nickName === '') {
          ok = false;
        }
        if (item.phonenumber !== '' && !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(item.phonenumber)) {
          ok = false;
        }
        if (item.company === '') {
          ok = false;
        }
        if (item.email !== '' && !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(item.email)) {
          ok = false;
        }
        if (ok) {
          this.data2.totalSuccess++;
        } else {
          this.data2.totalFalse++;
        }
      }
      // 分页
      this.getList();
    },
    // 每页选择
    changePageSize(value) {
      if (this.active === 1) { // 数据校验
        this.data2.currentPage = 1;
        this.data2.pageSize = value;
      } else if (this.active === 2) { // 设置角色
        this.data3.currentPage = 1;
        this.data3.pageSize = value;
      }
      this.getList();
    },
    // 分页
    changePageNum(value) {
      if (this.active === 1) { // 数据校验
        this.data2.currentPage = value;
      } else if (this.active === 2) { // 设置角色
        this.data3.currentPage = value;
      }
      this.getList();
    },
    // 动态生成展示的showTableData
    getList() {
      if (this.active === 1) { // 数据校验
        this.data2.showTableData = this.data2.tableData.slice(10 * (this.data2.currentPage - 1), 10 * (this.data2.currentPage - 1) + this.data2.pageSize);
        this.$nextTick();
      } else if (this.active === 2) { // 设置角色
        this.data3.showTableData = this.data3.tableData.slice(10 * (this.data3.currentPage - 1), 10 * (this.data3.currentPage - 1) + this.data3.pageSize);
        this.$nextTick();
      }
    },
    handleSelectionChange(data) {
      this.data3.selectedItemList = data;
      this.data3.selectNum = this.data3.selectedItemList.length;
      if (this.data3.selectedRole !== '') {
        this.data3.selectedRole = '';
      }
    },
    setBatchRole() {
      for (let i = 0; i < this.data3.selectedItemList.length; i++) {
        for (let j = 0; j < this.data3.tableData.length; j++) {
          if (this.data3.selectedItemList[i].userName === this.data3.tableData[j].userName) {
            this.data3.tableData[j].roleId = this.data3.selectedRole;
          }
        }
      }
    },
    indexMethod(index) {
      if (this.active === 1) { // 数据校验
        return (this.data2.currentPage - 1) * this.data2.pageSize + index + 1;
      } else if (this.active === 2) { // 设置角色
        return (this.data3.currentPage - 1) * this.data3.pageSize + index + 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .message-dialog {
    border-radius: 4px;

    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(242, 242, 242, 1);

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


  label {
    font-weight: 400;
  }
  .el-input__inner {
    height: 23px;
  }
  .el-input--medium .el-input__icon {
    line-height: 24px;
  }
}
</style>
