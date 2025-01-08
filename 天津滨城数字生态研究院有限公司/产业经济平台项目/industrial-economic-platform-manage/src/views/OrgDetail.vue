<template>
  <div class="ee-view page-orgDetail">
    <el-breadcrumb class="ee-breadcrumb" separator="/">
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tenant/list' }">机构列表</el-breadcrumb-item>
      <template v-if="!isUserDetail">
        <el-breadcrumb-item class="is-active">机构详情</el-breadcrumb-item>
      </template>
      <template v-else>
        <el-breadcrumb-item :to="{ path: hash }">机构详情</el-breadcrumb-item>
        <el-breadcrumb-item class="is-active">用户详情</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <div class="ee-view__inner">
      <div class="ee-view__head d-flex ai-center jc-between">
        <div class="ee-view__title">{{ isUserDetail ? '用户' : '机构' }}详情</div>
        <el-button class="ee-button--back" type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
      </div>
      <div class="ee-view__body">
        <div class="d-flex">
          <el-image v-if="form.logoPath" class="avatar" :src="form.logoPath" fit="contain" :preview-src-list="[form.logoPath]"> </el-image>
          <img v-else class="avatar" src="@/assets/images/user.png" />
          <div class="flex-1">
            <div class="d-flex ai-center">
              {{ form.organizationFullName || '-' }}
              <span v-if="form.status !== undefined" class="ee-tag--dot is-success" :class="['is-success', 'is-danger', 'is-revoke'][[form.status]]">
                {{ ['使用中', '已禁用', '已过期'][form.status] }}
              </span>
            </div>
            <div class="info-row d-flex flex-wrap">
              <span class="ee-ilabel">管理员：</span>
              <span class="ee-ivalue">{{ form.contactPerson || '-' }}</span>
              <span class="ee-ilabel">手机号：</span>
              <span class="ee-ivalue">{{ form.mobile || '-' }}</span>
            </div>
            <div class="info-row d-flex flex-wrap">
              <span class="ee-ilabel">行政地区：</span>
              <span class="ee-ivalue">{{ form.regionName || '-' }}</span>
              <span class="ee-ilabel">详细地址：</span>
              <span class="ee-ivalue">{{ form.address || '-' }}</span>
            </div>
            <div class="d-flex ai-center flex-wrap info-row">
              <span class="ee-ilabel">用户验证码：</span>
              <span class="ee-ivalue">{{ form.verificationCode || '-' }}</span>
              <el-button v-if="form.verificationCode" type="text" @click="copyToClipboard(form.verificationCode)" style="margin-left: 5px">
                复制
              </el-button>
              <span class="ee-ilabel">销售人员：</span>
              <span class="ee-ivalue">{{ form.salesperson || '-' }}</span>
              <span class="ee-ilabel">服务时长：</span>
              <span class="ee-ivalue" v-if="form.serviceStartTime"
                >{{ getTimeDiff(form.serviceStartTime + ' 00:00:00', form.serviceEndTime + ' 23:59:59') }}天（{{ form.serviceStartTime || '-' }}至{{
                  form.serviceEndTime || '-'
                }}）</span
              >
              <span class="ee-ilabel">购买价格：</span>
              <span class="ee-ivalue">{{ form.referencePurchasePrice || '-' }}</span>
            </div>
          </div>
          <div>
            <el-button type="primary" plain @click="handleEdit">编辑</el-button>
          </div>
        </div>
        <el-tabs v-if="!isUserDetail" v-model="tabId">
          <el-tab-pane label="成员列表" name="1">
            <member-list v-if="form.id" :orgInfo="form" />
          </el-tab-pane>
          <el-tab-pane label="功能/数据权限" name="2">
            <org-auth-form v-if="form.id" :form="form" />
          </el-tab-pane>
        </el-tabs>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import mixinListPage from '@/utils/mixinListPage';
import { flatNodes, getTimeDiff, copyToClipboard } from '@/utils';
import * as api from '@/api/tenant-manage';
import OrgAuthForm from './OrgAuthForm.vue';
import MemberList from './MemberList.vue';

export default {
  name: 'OrgDetail',
  components: {
    OrgAuthForm,
    MemberList
  },
  mixins: [mixinListPage],
  data() {
    return {
      form: {},
      tabId: '1',
      isUserDetail: false,
      hash: ''
    };
  },
  computed: {
    ...mapGetters(['CITY_OPTIONS'])
  },
  created() {
    this.isUserDetail = this.$route.name === 'OrgUserDetail';
    this.flatRegions = flatNodes(this.CITY_OPTIONS, false);
    this.form.id = this.$route.params.id;
    this.getTenantDetailData();
  },
  mounted() {
    this.hash = `/tenant/detail/${this.$route.params.id}`;
  },
  methods: {
    getTimeDiff,
    copyToClipboard,
    handleEdit() {
      this.$router.push(`/tenant/form/${this.form.id}`);
    },
    getTenantDetailData() {
      api.getTenantDetailData({ tenantId: this.$route.params.id }).then(({ data }) => {
        const { province, city, district } = data;
        this.form = data;
        this.form.regionName = [province, city, district]
          .filter((n) => n)
          .map((n) => this.flatRegions.find((r) => r.value == n).label)
          .join('/');
      });
    }
  }
};
</script>
<style lang='less'>
.page-orgDetail {
  .avatar {
    margin: 0 25px 0 0;
    max-width: 286px;
    height: 40px;
  }
  .ee-tag--dot {
    margin-left: 13px;
  }
  .info-row {
    margin-top: 8px;
    line-height: 20px;
    .ee-ilabel {
      margin-left: 50px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .el-tabs {
    margin-top: 20px;
  }
}
</style>
