<template>
  <OrgDetail>
    <div class="OrgUserDetail">
      <div class="user-row d-flex ai-center">
        <div class="role">{{ form.roleName || '成员' }}</div>
        <div class="username">{{ form.username || '-' }}</div>
        <span class="ee-ilabel">手机号：</span>
        <span class="ee-ivalue">{{ form.mobile || '-' }}</span>
        <span class="ee-ilabel">注册时间：</span>
        <span class="ee-ivalue">{{ form.createTime || '-' }}</span>
      </div>
      <org-auth-form v-if="form.id" :form="form" mode="user" style="margin-top: 20px" />
    </div>
  </OrgDetail>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from 'vuex';
import * as api from '@/api/tenant-manage';
import OrgAuthForm from './OrgAuthForm.vue';
import OrgDetail from '@/views/OrgDetail.vue';

export default {
  name: 'OrgUserDetail',
  components: {
    OrgAuthForm,
    OrgDetail
  },
  mixins: [],
  data() {
    return {
      form: {}
    };
  },
  computed: {
    ...mapGetters([])
  },
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    getDetail() {
      const { userId, id } = this.$route.params;
      api.getOrgUserDetail({ userId }).then(({ data }) => {
        this.form = {
          ...data,
          orgId: id
        };
      });
    }
  }
};
</script>
<style lang='less'>
.OrgUserDetail {
  .user-row {
    margin-top: 25px;
    padding: 16px 20px;
    background: rgba(53, 109, 246, 0.11);
    border-radius: 8px;
    .role {
      padding: 0 24px;
      height: 26px;
      line-height: 26px;
      background: #7ca2fe;
      border-radius: 26px;
      font-size: 16px;
      color: #fff;
    }
    .username {
      margin-left: 18px;
      font-size: 18px;
      font-weight: 500;
      color: #000000;
    }
    .ee-ilabel {
      margin-left: 50px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
