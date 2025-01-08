<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-04 09:48:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-13 11:39:12
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\dataCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="card-container">
    <el-card class="card-page" shadow="hover" @click.native="(e) => clickCard(e)">
      <div v-if="isShowMineCon" class="card-con">
        <div class="card-text mine">我发布的</div>
      </div>
      <div v-else-if="roleName !== '超级管理员' && !isShowMineCon && isShowPermissionCon" class="card-con">
        <div class="card-text permission">平台授权</div>
      </div>
      <div slot="header" class="header-container">
        <div class="title-container" :title="cardData.id +'-'+ cardData.name">
          {{ cardData.id }}-{{ cardData.name }}
        </div>
        <div v-if="isShowOperation" class="buttons-container">
          <el-popover
            placement="bottom"
            trigger="click"
            width="100"
            :popper-class="'operation-popover-container'"
          >
            <div>
              <div v-if="cardData.status !== 'ON_LINE'" class="operation-icon-container" @click.stop="onlineCard">
                <svg-icon
                  class-name="card-online-icon"
                  icon-class="card-online"
                /> 发布
              </div>
              <div class="operation-icon-container" @click.stop="editCard">
                <svg-icon
                  class-name="card-edit-icon"
                  icon-class="card-edit"
                /> 编辑
              </div>
              <div class="operation-icon-container" @click.stop="deleteCard">
                <svg-icon
                  class-name="card-delete-icon"
                  icon-class="card-delete"
                /> 删除
              </div>
            </div>
            <i slot="reference" class="el-icon-more" />
          </el-popover>

        </div>
        <div class="state-container">
          <span class="label-color">{{ cardData.labeledNum }}</span>/{{ cardData.taskNumber }}
          <template v-if="isShowState">
            <template v-if="cardData.remark">
              <el-tooltip
                v-if="cardData.status === 'ON_LINE' || cardData.status === 'REJECT'"
                :content="cardData.remark"
                placement="top"
                :popper-class="'tip-tool-container'"
              >
                <div class="state-detail" :style="setStateStyle(cardData.status)">{{ cardData.status | filter_status(stateOptions) }}</div>
              </el-tooltip>
              <div v-else class="state-detail" :style="setStateStyle(cardData.status)">{{ cardData.status | filter_status(stateOptions) }}</div>
            </template>
            <template v-else>
              <div class="state-detail" :style="setStateStyle(cardData.status)">{{ cardData.status | filter_status(stateOptions) }}</div>
            </template>
          </template>
        </div>
      </div>
      <div class="detail-container">
        {{ cardData.description }}
      </div>
      <div class="footer-container">
        <span class="type-container"><svg-icon :class-name="setTypeIcon(cardData.type) + '-icon'" :icon-class="setTypeIcon(cardData.type)" />{{ cardData.type | filter_status(typeOptions) }}</span>
        <span class="time-container"><svg-icon class-name="card-time-icon" icon-class="card-time" />{{ cardData.createTime }}</span>
      </div>
    </el-card>
  </div>
</template>
<script>
import _debounce from 'lodash/debounce';
import { mapGetters } from 'vuex';
export default {
  filters: {
    filter_status(value, list) {
      const typeArr = list.find((item) => item.value === value);
      return typeArr ? typeArr.label : '';
    }
  },
  props: {
    cardData: {
      type: Object,
      default: () => {}
    },
    isShowOperation: {
      type: Boolean,
      default: true
    },
    isShowMineCon: {
      type: Boolean,
      default: false
    },
    isShowPermissionCon: {
      type: Boolean,
      default: false
    },
    isShowState: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      typeOptions: [
        { label: '全部', value: 'ALL' },
        { label: '图像', value: 'PICTURE' },
        { label: '音频', value: 'VOICE' },
        { label: '文本', value: 'TEXT' },
        { label: '表格', value: 'TABLE' },
        { label: '视频', value: 'VIDEO' }
      ], // 类型数据源
      stateOptions: [
        { label: '全部', value: 'ALL' },
        { label: '未发布', value: 'WAIT_RELEASE' },
        { label: '待审核', value: 'WAIT_JUDGE' },
        { label: '已发布', value: 'ON_LINE' },
        { label: '被驳回', value: 'REJECT' },
        { label: '已下线', value: 'OFF_LINE' }
      ], // 状态数据源
      hoverButtonType: ''
    };
  },
  computed: {
    ...mapGetters(['roleName'])
  },
  methods: {
    // 设置状态图标样式
    setStateStyle(state) {
      const style = {};
      if (state === 'WAIT_RELEASE') {
        style.background = 'rgba(1,100,255,0.2)';
        style.color = 'rgba(1,100,255,1)';
      } else if (state === 'WAIT_JUDGE') {
        style.background = 'rgba(246,102,0,0.2)';
        style.color = 'rgba(246,102,0,1)';
      } else if (state === 'ON_LINE') {
        style.background = 'rgba(0,180,180,0.2)';
        style.color = 'rgba(0,180,180,1)';
      } else if (state === 'REJECT') {
        style.background = 'rgba(255,78,37,0.2)';
        style.color = 'rgba(255,78,37,1)';
      } else if (state === 'OFF_LINE') {
        style.background = 'rgba(86,92,102,0.2)';
        style.color = 'rgba(86,92,102,1)';
      }
      return style;
    },
    // 设置类型图标
    setTypeIcon(type) {
      return `card-${type.toLowerCase()}`;
    },
    // 点击
    clickCard: _debounce(function(e) {
      if (e.target.classList.contains('el-icon-more')) return;
      this.$emit('singleClick', this.cardData);
    }, 300),
    // 删除
    deleteCard: _debounce(function() {
      this.$emit('delete', this.cardData);
    }, 300),
    // 编辑
    editCard: _debounce(function() {
      this.$emit('edit', this.cardData);
    }, 300),
    // 发布
    onlineCard: _debounce(function() {
      this.$emit('online', this.cardData);
    }, 300),
    changeHoverButtonType(value) {
      this.hoverButtonType = value;
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  display: flex;
  text-decoration: none;
  &:hover {
    .card-page {
      box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%);
    }
  }
  .card-page {
    cursor: pointer;
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    width: 100px; // 给一个宽度，不会出现某一个卡片过大挤压其他卡片宽度的情况
    ::v-deep {
      .el-card__header,.el-card__body {
        padding: 16px
      }
    }
    .card-con {
      width: 100px;
      height: 100px;
      overflow: hidden;
      position: absolute;
      top: 0;
      right: 0;
      .card-text {
        text-align: center;
        transform: rotate(45deg);
        position: relative;
        left: 30px;
        top: 16px;
        width: 90px;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        &.mine {
          color: #00AB5A;
          background-color: rgba(0, 171, 90, 0.14);
        }
        &.permission {
          color: rgb(1, 100, 255);
          background: rgba(1, 100, 255, 0.2);
        }
      }
    }
    .header-container {
      .title-container {
        font-size: 16px;
        color: #262626;
        height: 24px;
        font-family: SourceHanSansSC-Medium;
        letter-spacing: -0.69px;
        line-height: 24px;
        font-weight: 400;
        width: calc(100% - 32px);
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .buttons-container {
        float: right;
        margin-top: 4px;
        .el-icon-more {
          color: #B7B7B7;
          &:hover {
            color: #646464;
          }
          &:focus {
            color: #646464;
          }
        }
      }
      .state-container {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        margin-top: 16px;
        .state-detail {
          font-size: 12px;
          text-align: center;
          font-weight: 400;
          float: right;
          background: rgba(246,102,0,0.20);
          width: 70px;
          height: 24px;
          line-height: 24px;
          border-radius: 16px 1px 16px 1px;
        }
      }
    }
    .detail-container {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
      height: 60px;
      font-family: SourceHanSansSC-Normal;
      font-size: 14px;
      color: #646464;
      letter-spacing: -0.51px;
      line-height: 20px;
      font-weight: 400;
    }
    .footer-container {
      margin-top: 32px;
      font-size: 12px;
      .time-container {
        float: right;
      }
      .type-container,.time-container {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        .svg-icon {
          margin-right: 4px;
        }
      }
      .type-container {
        color: #8C8C8C;
      }
      .time-container {
        color: #646464;
      }
    }
    .label-color {
      color: #0164FF;
    }
  }
}
</style>
<style lang="scss">
.operation-popover-container {
  padding: 4px 0;
  min-width: 100px;
  margin-top: 0 !important;
  .operation-icon-container {
    // width: 100px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background:#F5F7FA;
    }
    .svg-icon {
      margin-right: 12px;
    }
  }
  .popper__arrow {
    display: none;
  }
}
.tip-tool-container {
  max-width: 300px;
}
</style>
