<template>
  <div class="page-policy-doc-detail">
    <div class="ee-view-content wrap-inner">
      <div class="wrap-body d-flex">
        <div class="wrap-main flex-1">
          <div class="wrap-top">
            <div class="ee-view-title d-flex ai-center">
              <el-button class="ee-button--back" type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
            </div>
            <div class="wrap-top__title">
              <div class="title text-center">{{ form.title || '--' }}</div>
              <div class="doc-info flex-center ai-center">
                <span class="label">发布机构：</span>
                <span class="value">{{ form.publish_department || '--' }}</span>
                <span class="label">发布时间：</span>
                <span class="value">{{ form.publish_date || '--' }}</span>
              </div>
            </div>
          </div>
          <div class="wrap-content" v-html="form.content_html"></div>
        </div>
        <div class="wrap-side">
          <template v-if="form.source_url">
            <div class="label d-flex ai-center"><svg-icon icon-class="link" />原文链接：</div>
            <div class="value">
              <el-link class="ee-link" type="primary" :underline="false" :title="form.source_url" :href="form.source_url" target="_blank">
                {{ form.source_url }}
              </el-link>
            </div>
          </template>
          <template v-if="form.attachmentList && form.attachmentList.length > 0">
            <div class="label d-flex ai-center"><svg-icon icon-class="attachment" />附件：</div>
            <div v-for="(n, i) in form.attachmentList" :key="i" class="value d-flex ai-center">
              <el-link class="ee-link ell" type="primary" :underline="false" :href="n.url" target="_blank">{{ n.name }}</el-link>
              <svg-icon icon-class="arrow-down-circle-line" style="margin-left: 5px" />
            </div>
          </template>
          <template v-if="form.declare_url">
            <div class="label d-flex ai-center"><svg-icon icon-class="edit" />申报入口：</div>
            <div class="value">
              <el-link class="ee-link" type="primary" :underline="false" :href="form.declare_url" target="_blank">{{ form.declare_url }}</el-link>
            </div>
          </template>
          <!-- <template v-if="form.source_url">
            <div class="label d-flex ai-center"><svg-icon icon-class="policy" />政策解读：</div>
            <div class="value">
              <el-link class="ee-link" type="primary" :underline="false" :title="form.source_url" :href="form.source_url" target="_blank">
                {{ form.source_url }}
              </el-link>
            </div>
          </template> -->
        </div>
      </div>
    </div>
    <el-backtop target=".app-main" :visibility-height="100"></el-backtop>
  </div>
</template>

<script>
/* eslint-disable */
import * as api from '@/api/policy';

export default {
  name: 'PolicyDocDetail',
  components: {},
  data() {
    return {
      form: {}
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      api
        .getPolicyDetail({ policy_id: this.$route.params.id })
        .then(({ data }) => {
          if (data.code === 0) {
            const { attachments } = data.data;
            let attachmentList = [];
            try {
              if (attachments) {
                let list = JSON.parse(attachments);
                if (Array.isArray(list)) {
                  attachmentList = list;
                } else {
                  attachmentList = Object.keys(list).map((n) => ({
                    name: n,
                    url: list[n]
                  }));
                }
              }
            } catch (error) {}
            this.form = {
              ...data.data,
              attachmentList
            };
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleBack() {}
  }
};
</script>
<style lang='less'>
.page-policy-doc-detail {
  padding-bottom: 33px;
  .wrap-inner {
    padding: 22px 24px 24px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0px 0px 16px 0px rgba(20, 38, 82, 0.07);
  }
  .ee-view-title {
    padding-top: 0;
    border-bottom: none;
  }
  .wrap-top {
    &__title {
      margin: 0 auto;
      width: 800px;
    }
    .title,
    .doc-info {
      padding: 0 34px 0 40px;
    }
    .title {
      color: #1d2129;
      font-size: 28px;
      font-weight: 500;
      line-height: 32px;
    }
    .doc-info {
      margin-top: 25px;
      font-size: 14px;
      line-height: 22px;
      .label {
        color: #86909c;
      }
      .value {
        margin-right: 30px;
        color: #1a262c;
      }
    }
  }
  .wrap-content {
    margin: 34px auto 0;
    padding: 0 0 30px;
    width: 800px;
    min-height: calc(100vh - 303px);
    box-sizing: border-box;
  }
  .wrap-body {
    .wrap-main {
      border-right: 1px solid #f9f9f9;
    }
    .wrap-side {
      padding: 50px 0 24px 10px;
      width: 245px;
      .label {
        margin-top: 24px;
      }
      .value {
        margin-top: 4px;
      }
      .svg-icon {
        margin-right: 8px;
        width: 20px;
        cursor: pointer;
      }
      .ee-link {
        max-width: 100%;
        .el-link--inner {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
