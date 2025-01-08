<!--
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-07-05 14:15:17
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 10:31:01
 * @FilePath: \ai-platform-front-end-project\src\views\data-manager\dataSet\components\detailCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card class="detail-card-container">
    <div slot="header" class="header-container">
      <div class="title-container">
        {{ cardDetail.id }}-{{ cardDetail.name }}
      </div>
      <div class="other-container">
        <span class="type-container"><span class="type-content">数据类型:</span>{{ cardDetail.type | filter_status(typeOptions) }}</span>
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
  }
};
</script>
<style lang="scss" scoped>
.detail-card-container {
  // padding: 24px;
  position: relative;
  background: #FFFFFF;
  width: 100%;
  box-shadow: none;
  border: none;
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
    }
    .other-container {
      // margin-top: 12px;
      color: #8C8C8C;
      .type-content {
        margin-right: 4px;
      }
      .type-container {
        font-size: 14px;
      }
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
}
</style>
