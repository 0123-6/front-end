<template>
  <div v-loading="loading" class="ee-view OrgForm">
    <el-breadcrumb class="ee-breadcrumb" separator="/">
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tenant/list' }">机构列表</el-breadcrumb-item>
      <el-breadcrumb-item class="is-active">{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ee-view__inner">
      <div class="ee-view__head d-flex ai-center jc-between">
        <div class="ee-view__title">{{ title }}</div>
        <el-button class="ee-button--back" type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
      </div>
      <div class="ee-view__body">
        <el-form :model="form" :rules="rules" ref="form" label-width="140px" style="width: 650px">
          <el-form-item label="机构全称" prop="organizationFullName">
            <el-input v-model="form.organizationFullName" clearable></el-input>
          </el-form-item>
          <el-form-item label="Logo" prop="logoPath">
            <el-upload
              ref="uploadImg"
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :multiple="false"
              :limit="1"
              accept="image/jpg,image/jpeg,image/png,image/svg+xml"
              :on-change="onFileChange">
              <div>
                <img v-if="form.logoPath" :src="form.logoPath" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">支持格式png，svg，jpg，尺寸要求，高度40px ，最大宽度不能超过286px</div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="行政地区" prop="region">
            <el-cascader style="width: 100%" v-model="form.region" :options="CITY_OPTIONS[0].children" :props="{ checkStrictly: true }"></el-cascader>
          </el-form-item>
          <el-form-item class="half-item" label="详细地址" prop="address">
            <el-input v-model="form.address" clearable></el-input>
          </el-form-item>
          <el-form-item class="half-item" label="服务周期" prop="serviceTime">
            <el-date-picker
              v-model="form.serviceTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%">
            </el-date-picker>
            <!-- <span style="margin-left: 20px; color: #86909c; font-size: 13px">服务时长：{{ updateDateValue || '- 天' }}</span> -->
          </el-form-item>
          <el-form-item label="用户验证码" prop="verificationCode">
            <div class="d-flex ai-center">
              <el-input v-model="form.verificationCode" readonly></el-input>
              <el-button v-loading="codeLoading" type="primary" plain @click="createCode" style="margin-left: 10px">生成</el-button>
            </div>
          </el-form-item>
          <el-form-item label="管理员" prop="contactPerson">
            <el-input v-model="form.contactPerson" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" clearable></el-input>
          </el-form-item>
          <el-form-item label="销售人员" prop="salesperson">
            <el-input v-model="form.salesperson" clearable></el-input>
          </el-form-item>
          <el-form-item label="购买价格（万元）" prop="referencePurchasePrice">
            <el-input v-model="form.referencePurchasePrice" type="number" min="0" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="handleSave">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog title="图片裁剪" top="10vh" :visible.sync="dialogVisible" :close-on-click-modal="false" width="448px">
      <vueCropper
        ref="cropper"
        :img="cropperImg"
        autoCrop
        :autoCropWidth="286"
        :autoCropHeight="40"
        :limitMinSize="40"
        outputType="png"
        style="width: 400px; height: 300px"></vueCropper>
      <div class="text-center" style="padding: 20px 0">
        <el-button @click="comfirmUpload">不裁剪</el-button>
        <el-button type="primary" @click="comfirmCropper">确定裁剪</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import mixinListPage from '@/utils/mixinListPage';
import { getTimeDiff } from '@/utils';
import * as api from '@/api/tenant-manage';
import { validateAccount, validatePhone } from '@/utils/validate';
import { uploadFile } from '@/api/common';
import { VueCropper } from 'vue-cropper';

function getFormProps() {
  return {
    logoPath: '',
    verificationCode: '',
    organizationFullName: '',
    address: '',
    contactPerson: '',
    mobile: '',
    salesperson: '',
    referencePurchasePrice: '',
    serviceTime: []
  };
}

export default {
  name: 'OrgForm',
  components: {
    VueCropper
  },
  mixins: [mixinListPage],
  data() {
    return {
      loading: false,
      isEdit: false,
      codeLoading: false,
      form: getFormProps(),
      rules: {
        contactPerson: [
          { required: false, message: '请输入管理员', trigger: 'blur' },
          { max: 20, message: '长度在 20 个字符以内', trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        verificationCode: [{ required: true, message: '请生成用户验证码', trigger: 'change' }],
        organizationFullName: [
          { required: true, message: '请输入机构全称', trigger: 'blur' },
          { max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择行政地区', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        logoPath: [{ required: true, message: '请上传Logo', trigger: 'change' }],
        salesperson: [
          { required: false, message: '请输入销售人员', trigger: 'blur' },
          { max: 20, message: '长度在 20 个字符以内', trigger: 'blur' }
        ],
        serviceTime: [{ required: true, message: '请选择服务周期', trigger: 'blur' }]
      },
      updateDateValue: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 24 * 60 * 60 * 1000 < Date.now();
        }
      },
      dialogVisible: false,
      cropperImg: ''
    };
  },
  computed: {
    ...mapGetters(['CITY_OPTIONS']),
    title() {
      return `${this.isEdit ? '编辑' : '新增'}机构`;
    }
  },
  created() {},
  mounted() {
    const { id } = this.$route.params;
    this.isEdit = id && id !== '0';
    if (this.isEdit) {
      this.getDataDetail();
    } else {
      this.form.id = '';
    }
  },
  methods: {
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.type = 1;
          this.form.serviceStartTime = this.form.serviceTime[0];
          this.form.serviceEndTime = this.form.serviceTime[1];
          this.form.referencePurchasePrice = Number(this.form.referencePurchasePrice);
          this.form.province = this.form.region[0];
          this.form.city = this.form.region[1] || '';
          this.form.district = this.form.region[2] || '';
          this.loading = true;
          api[this.isEdit ? 'updateTenantData' : 'addTenantData']({
            ...this.form,
            serviceTime: undefined,
            region: undefined
          })
            .then((res) => {
              if (res.code === '00000') {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.$router.go(-1);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    getDataDetail() {
      api.getTenantDetailData({ tenantId: this.$route.params.id }).then(({ data }) => {
        const { province, city, district, serviceStartTime, serviceEndTime } = data;
        this.form = {
          ...getFormProps(),
          ...data,
          region: [province, city, district].filter((n) => n),
          serviceTime: [serviceStartTime, serviceEndTime]
        };
        this.form.region = [province, city, district].filter((n) => n);
      });
    },
    createCode() {
      this.codeLoading = true;
      api
        .randomCode({ codeLength: 8 })
        .then((res) => {
          if (res.code === '00000') {
            this.form.verificationCode = res.data;
            this.$message({
              message: '验证码生成成功',
              type: 'success'
            });
          }
          this.codeLoading = false;
        })
        .catch((e) => {
          console.log(e);
          this.codeLoading = false;
        });
    },
    beforeUpload(file) {
      this.$refs.uploadImg.clearFiles();
      const typeArr = file.name.split('.');
      const ext = typeArr[typeArr.length - 1];
      const isImage = ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'svg';
      this.isSvg = ext === 'svg';
      const isLt5M = file.size / 1024 < 500;
      if (!isImage) {
        this.$message({
          type: 'warning',
          message: '只能上传后缀名为JPG/JPEG/PNG/SVG'
        });
      }
      if (!isLt5M) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 500KB!'
        });
      }
      return isImage && isLt5M;
    },
    onFileChange(file) {
      if (!this.beforeUpload(file)) return;
      console.log(file);
      if (this.isSvg) {
        this.uploadLogoFile(file.raw);
        return;
      }
      this.originLogo = file.raw;
      this.cropperImgName = file.name;
      this.cropperImg = URL.createObjectURL(file.raw);
      this.dialogVisible = true;
    },
    validLogoSize(width, height) {
      if (width > 286) {
        this.$message({
          type: 'warning',
          message: 'Logo宽度不能超过286px'
        });
        return false;
      }
      if (height != 40) {
        this.$message({
          type: 'warning',
          message: 'Logo高度必须为40px'
        });
        return false;
      }
      return true;
    },
    comfirmCropper() {
      if (!this.validLogoSize(this.$refs.cropper.cropW, this.$refs.cropper.cropH)) return;
      this.$refs.cropper.getCropBlob((blob) => {
        // console.log(blob);
        this.uploadLogoFile(new File([blob], this.cropperImgName, { type: 'image/png', lastModified: Date.now() }));
      });
    },
    comfirmUpload() {
      const { clientWidth, clientHeight } = this.$el.querySelector('.cropper-box-canvas');
      if (!this.validLogoSize(clientWidth, clientHeight)) return;
      this.uploadLogoFile(this.originLogo);
    },
    uploadLogoFile(file) {
      const formData = new FormData();
      formData.append('type', 'orgLogo');
      formData.append('file', file);
      uploadFile(formData).then((res) => {
        if (res.code === '00000') {
          this.form.logoPath = res.data;
          this.ImgFileList = [
            {
              name: 'logo',
              url: this.form.logoPath
            }
          ];
          this.dialogVisible = false;
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    }
  }
};
</script>
<style lang='less'>
.OrgForm {
  .avatar-uploader-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 28px;
    color: #8c939d;
    width: 286px;
    height: 42px;
    box-sizing: border-box;
  }
  .avatar {
    display: block;
    max-width: 286px;
    height: 42px;
    object-fit: contain;
  }
}
</style>
