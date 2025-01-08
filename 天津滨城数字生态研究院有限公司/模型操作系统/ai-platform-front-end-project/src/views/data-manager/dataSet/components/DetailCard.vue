<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-05 14:15:17
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-19 14:05:25
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\detailCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card class="detail-card-container">
    <div slot="header" class="header-container">
      <div class="title-container">
        <!-- <el-tooltip class="item" effect="dark" :content="cardDetail.id + '-' + cardDetail.name" placement="top-start"> -->
        <div>{{ cardDetail.id }}-{{ cardDetail.name }}</div>
        <!-- </el-tooltip> -->
        <div class="button-container">
          <el-button icon="el-icon-caret-left" class="card-back-button" @click="backCard">返回</el-button>
        </div>
      </div>
      <div class="label-container">
        <span class="number-container"><span class="label-color">{{ cardDetail.labeledNum }}</span>/{{ cardDetail.taskNumber }}</span>
        <span class="trans-container"><span class="label-color">已标注</span>/全部</span>
      </div>
      <div class="other-container">
        <span class="type-container"><span class="type-content">数据类型:</span>{{ cardDetail.type | filter_status(typeOptions) }}</span>
        <span v-if="infoType !== 'data-set'" class="time-container"><span class="type-content">{{ infoType === 'audit' ? '申请者' : '创建者' }}:</span>{{ infoType === 'audit' ? cardDetail.createByName : cardDetail.applyName }}</span>
        <span v-if="!(infoType === 'data-set' && tagType == 'mine')" class="time-container"><span class="type-content">{{ infoType === 'audit' ? '申请时间' : tagType == 'mine' ? '创建时间' : '发布时间' }}:</span>{{ infoType === 'audit' ? cardDetail.createTime : tagType == 'mine' ? cardDetail.createTime : cardDetail.releaseTime }}</span>
      </div>
      <div v-if="isShowFork" class="button-container">
        <el-button class="blue-btn card-fork-button" @click="forkCard">Fork</el-button>
      </div>
    </div>
    <div class="detail-container">
      <div class="title-container">描述</div>
      <div class="description-container">
        <OverflowEllipsis :content="cardDetail.description" />
      </div>
    </div>
  </el-card>
</template>
<script>
import OverflowEllipsis from '@/components/OverflowEllipsis';
import _debounce from 'lodash/debounce';
export default {
  components: {
    OverflowEllipsis
  },
  filters: {
    filter_status(value, list) {
      const typeArr = list.find((item) => item.value === value);
      return typeArr ? typeArr.label : '';
    }
  },
  props: {
    cardDetail: {
      type: Object,
      default: () => {},
      required: true
    },
    isShowFork: {
      type: Boolean,
      default: true
    },
    infoType: {
      type: String,
      required: true
    },
    tagType: {
      type: String,
      default: 'common'
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
      ] // 类型数据源
    };
  },
  methods: {
    // 返回
    backCard() {
      this.$emit('back', this.cardDetail);
    },
    // fork
    forkCard: _debounce(function() {
      this.$emit('fork', this.cardDetail);
    }, 300)
  }
};
</script>
<style lang="scss" scoped>
.detail-card-container {
  padding: 24px;
  position: relative;
  ::v-deep {
    .el-card__header,.el-card__body {
      padding: 0;
      border: none;
    }
  }
  .header-container {
    .title-container {
      height: 24px;
      font-family: SourceHanSansSC-Medium;
      font-size: 14px;
      color: #232323;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: 400;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .card-back-button {
        border: none;
        padding: 8px;
        position: absolute;
        top: 0;
        right: 0;
        color: #262626;
        .el-icon-caret-left {
          color: #d8d8d8;
        }
        &:hover {
          background: #ffffff;
          color: #262626;
          .el-icon-caret-left {
            color: #d8d8d8;
          }
        }
        &:focus {
          color: #0164FF;
          background: #ffffff;
          .el-icon-caret-left {
            background: #0164FF;
          }
        }
      }
    }
    .label-container {
      margin-top: 12px;
      font-size: 14px;
      .trans-container {
        margin-left: 60px;
      }
    }
    .other-container {
      margin-top: 12px;
      color: #8C8C8C;
      font-size: 14px;
      .time-container {
        margin-left: 60px;
      }
      .type-content {
        margin-right: 4px;
      }
    }
    .card-fork-button {
      position: absolute;
      right: 24px;
      top: 40px;
    }
  }
  .detail-container {
    margin-top: 24px;
    .title-container {
      font-family: SourceHanSansSC-Medium;
      font-size: 14px;
      color: #323232;
      letter-spacing: -0.6px;
      font-weight: 400;
      height: 20px;
      line-height: 20px;
    }
  }
  .label-color {
    color: #0164FF;
    font-weight: 600;
  }
}
</style>
