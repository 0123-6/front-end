<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-06-12 15:36:16
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-18 17:28:07
 * @FilePath: \industrial-economic-platform\src\views\industry-map-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home-container">
    <div class="main-container">
      <el-container>
        <el-main>
          <div class="breadcrumb-wrap">
            <el-breadcrumb class="ee-breadcrumb" separator="/">
              <el-breadcrumb-item>产业分析</el-breadcrumb-item>
              <el-breadcrumb-item class="is-active">产业链图谱</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="search-bar">
            <!--            <div class="main-title">全部图谱</div>-->
            <el-input
              class="search-input ee-input"
              v-model="keywords"
              placeholder="请输入产业链"
              clearable
              size="large"
              style="width: 30%"
              @keydown.enter.native="getTableData">
              <el-button slot="append" @click="getTableData"> <svg-icon icon-class="search" width="18px" height="18px" /> </el-button
            ></el-input>
          </div>
          <div v-if="tableData.length !== 0" class="card-box">
            <el-card v-for="item of tableData" :key="item.chainCode" @click.native="toDetail(item)">
              <div class="top">
                <img :src="item.imageUrl" alt="" />
                <div class="auth-tag text-center" :class="{ 'is-authed': item.authorized }">{{ item.authorized ? '已' : '未' }}授权</div>
              </div>
              <div class="bottom">
                <div>{{ item.name }}</div>
                <div>
                  <span>
                    <el-tooltip effect="dark" content="产业链节点" placement="top">
                      <img src="@/assets/icons/node.svg" alt="" />
                    </el-tooltip>
                    <span>{{ item.totalNode }}</span>
                  </span>
                  <span>
                    <el-tooltip effect="dark" content="企业数量" placement="top">
                      <img src="@/assets/icons/firm.svg" alt="" />
                    </el-tooltip>
                    {{ item.totalCompany }}</span
                  >
                </div>
              </div>
            </el-card>
          </div>
          <div v-else v-loading="tableData.length === 0 && loading" class="no-data">
            <div>
              <img src="@/assets/icons/no-data.svg" alt="" />
              <div style="margin-top: -80px">未搜索到相关产业链</div>
            </div>
          </div>
          <el-pagination
            v-if="tableListTotal > 16"
            style="display: flex; justify-content: center; margin: 24px"
            layout="total, prev, pager, next, jumper"
            :current-page.sync="currentPage"
            :page-size="16"
            :total="tableListTotal"
            background
            @current-change="changePage">
          </el-pagination>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import { chainApis } from '@/api/industry-map';

export default {
  name: 'IndustryMap',
  computed: {
    ...mapGetters(['iep_platform_MENU_ID'])
  },
  data() {
    return {
      tableListTotal: 0,
      currentPage: 1,
      tableData: [],
      loading: false,
      keywords: ''
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    toDetail(row) {
      if (!row.authorized) {
        return this.$alert(
          `<div style="padding:44px 0;text-align:center"><span style="color:#356DF6;">${row.name}</span>产业链未授权<br>请联系18810506962</div>`,
          '提示',
          {
            dangerouslyUseHTMLString: true,
            showConfirmButton: false
          }
        )
          .then(() => {})
          .catch(() => {});
      }
      this.$router.push(`/industry-map/detail/${row.id}`);
    },
    // 分页
    changePage(val) {
      this.currentPage = val;
      this.getTableData();
    },
    // 获取表格数据
    getTableData() {
      const params = {
        menuId: this.iep_platform_MENU_ID,
        keywords: this.keywords,
        pageSize: 16,
        pageNum: this.currentPage
      };
      this.loading = true;
      chainApis
        .getChainList(params)
        .then((result) => {
          this.tableData = result.data.list;
          this.tableListTotal = result.data.total;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/styles/variables.less';
.home-container {
  min-height: 100%;
  .main-container {
    .breadcrumb-wrap {
      margin: 0 auto;
      padding-bottom: 13px;
      width: 60%;
      min-width: 1100px;
    }
    .search-bar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 60%;
      min-width: 1100px;
      margin: 0 auto 20px;
      .main-title {
        font-size: 22px;
        color: #1d2129;
        margin-bottom: 16px;
      }

      .search-input {
        min-width: 540px;
      }
    }
    .card-box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 24px;
      width: 60%;
      margin: auto;
      min-width: 1100px;
      padding-bottom: 24px;
      .el-card {
        background: #ffffff;
        box-shadow: 0px 2px 8px 0px #dce5e7;
        border-radius: 6px;
        box-sizing: border-box;
        width: calc((100% - 72px) / 4);
        min-width: 250px;
        cursor: pointer;
        &:hover {
          box-shadow: 0px 2px 8px 0px #a4aaac;
        }
        ::v-deep .el-card__body {
          padding: 0;
        }
        .top {
          position: relative;
          overflow: hidden;
          .auth-tag {
            position: absolute;
            top: 10px;
            left: -25px;
            width: 90px;
            height: 20px;
            line-height: 20px;
            background: #a5a5a5;
            color: #fff;
            font-size: 12px;
            transform: rotate(-45deg);
            &.is-authed {
              background: #68cd44;
            }
          }
          img {
            width: 100%;
          }
        }
        .bottom {
          padding: 20px;
          div:nth-child(1) {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #262626;
            margin-bottom: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          div:nth-child(2) {
            font-size: 16px;
            font-family: Helvetica;
            color: #86909c;
            > span {
              display: inline-flex;
              align-items: end;
            }
            > span:nth-child(1) {
              margin-right: 60px;
            }
          }
        }
        .card-inner {
          min-height: 180px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .card-title {
          width: 50%;
          font-size: 18px;
          color: #1a262c;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .card-image {
          text-align: center;
          .empty {
            background-color: #dbe3f6;
            height: 150px;
          }
        }
        .nodesName-box {
          width: 50%;
          padding: 14px;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          margin: 8px 0;
          height: 50px;
        }
        .el-tag {
          font-size: 12px;
          height: 22px;
          line-height: 20px;
          & + .el-tag {
            margin-left: 8px;
          }
        }
      }
    }
    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
  ::v-deep .el-card__body {
    padding: 18px;
  }
  ::v-deep .el-card {
    border: 0;
  }
}
</style>
