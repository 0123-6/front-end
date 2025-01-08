<template>
  <div class="content">
    <div class="statistics">
      <div><span>{{ data.labeledNum || 0 }}/</span>{{ data.taskNumber || 0 }}</div>
      <div>
        <span v-if="data.labeledNum === 0">未标注/</span>
        <span v-if="data.taskNumber !== 0 && data.labeledNum === data.taskNumber">标注完成/</span>
        <span v-if="data.labeledNum !== 0 && data.labeledNum < data.taskNumber">标注中/</span>
        全部</div>
    </div>
    <div class="info">
      <div>数据类型：{{ typeMap[data.type] }}</div>
      <div>{{ type === 'audit' ? '申请者' : '创建者' }}：{{ type === 'audit' ? data.createByName : data.applyName }}</div>
      <div>{{ type === 'audit' ? '申请时间' : '发布时间' }}：{{ data.createTime }}</div>
    </div>
    <div class="desc">
      <div style="font-weight: 400">描述</div>
      <div style="display: flex">
        <OverflowEllipsis :content="data.description" />
      </div>
    </div>
  </div>
</template>

<script>
import OverflowEllipsis from '@/components/OverflowEllipsis';

export default {
  name: 'AlDescribe',
  components: {
    OverflowEllipsis
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      typeMap: {
        PICTURE: '图像',
        TEXT: '文本',
        VIDEO: '视频',
        VOICE: '音频',
        TABLE: '表格'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.content{
  padding: 15px 24px;
  margin-bottom: 14px;
  background: #FFFFFF;
  box-shadow: 0 2px 4px 0 rgba(223,210,210,0.5);
  border-radius: 4px;
  .statistics{
    display: flex;
    flex-direction: row;
    >div:nth-child(1){
      margin-right: 50px;
    }
    div{
      font-size: 14px;
    }
    span{
      color: #0164FF;
      letter-spacing: -0.6px;
      line-height: 20px;
      font-weight: 600;
    }
  }
  .info{
    display: flex;
    margin: 10px 0 20px;
    div{
      margin-right: 40px;
      font-size: 14px;
      color: #8C8C8C;
      letter-spacing: -0.6px;
      text-align: center;
      line-height: 14px;
      font-weight: 400;
    }
  }
  .desc{
    position: relative;
    >div:nth-child(1){
      display: inline;
      font-size: 14px;
      color: #323232;
      letter-spacing: -0.6px;
      text-align: center;
      font-weight: 400;
    }
    .more-text{
      display: inline-block;
      font-size: 14px;
      color: #646464;
      letter-spacing: -0.6px;
      text-align: justify;
      line-height: 25px;
      font-weight: 400;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      &::before {
        content: '';
        float: right;
        width: 5px;
        height: calc(100% - 25px);
      }
      .more-btn{
        float: right;
        clear: both;
        color: #0164FF;
        cursor: pointer;
      }
    }
    .content-copy{
      position: absolute;
      display: inline-block;
      visibility: hidden;
      width: 100%;
      font-size: 14px;
      color: #646464;
      letter-spacing: -0.6px;
      text-align: justify;
      line-height: 25px;
      font-weight: 400;
    }
  }
}
</style>
