<template>
  <div class="ee-flow d-flex ai-center jc-center" :style="wrapStyle">
    <div class="ee-flow__inner">
      <div v-for="(g, gi) in groups" :key="gi" :class="{ 'is-even': gi % 2 > 0, 'is-end': gi === groups.length - 1 }"
        class="ee-flow__row d-flex ai-center jc-between">
        <template v-for="(n, i) in g" :key="i">

          <div v-if="n.nodeType === 'begin'" class="ee-flow__begin f18 f500 text-center">开始</div>

          <div v-else-if="n.nodeType === 'end'" class="ee-flow__begin f18 f500 text-center">结束</div>

          <div v-else class="ee-flow__node relative"
            :class="{ 'group-end': n.order % groupSize < 1 && n.order < data.length }" @click="handleClickNode(n)">
            <div class="ee-flow__node-head d-flex ai-center">
              <span class="flex-1 ee-flow__node-index f20 f700 ddin">{{ n.order }}</span>
              <!-- <el-button class="mr20" type="primary" link>
                <svg-icon icon-class="primary-policy" width="18px" height="18px" />
              </el-button>
              <el-button class="mr20" type="primary" link>
                <svg-icon icon-class="edit" width="18px" height="18px" />
              </el-button> -->
            </div>
            <div class="ee-flow__node-body f18 ell">{{ n.name }}</div>
          </div>

          <svg-icon
            v-if="n.nodeType !== 'end' && (n.nodeType === 'begin' || n.order % groupSize > 0 || n.order === data.length)"
            class="node-arrow" icon-class="node-arrow" width="36px" height="36px" />

        </template>
      </div>
    </div>

    <ProjectNodeForm :show="dialogVisible" :data="nodeData" />

  </div>
</template>

<script>
import ProjectNodeForm from './ProjectNodeForm.vue'
export default {
  name: 'FlowChart',
  components: {
    ProjectNodeForm
  },
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      groupSize: 4,
      dialogVisible: false,
      nodeData: {
        name: '准入申请'
      }
    }
  },

  computed: {
    wrapStyle() {
      return {
        width: this.width,
        height: this.height
      }
    },
    groups() {
      const data = [].concat(this.data)
      const groups = []
      const groupNum = Math.ceil(data.length / this.groupSize)
      for (let index = 0; index < groupNum; index++) {
        let nodes = data.splice(0, this.groupSize)
        if (index === 0) {
          groups.push([{ nodeType: 'begin' }].concat(nodes))
        } else if (index === groupNum - 1) {
          groups.push(nodes.concat([{ nodeType: 'end' }]))
        } else {
          groups.push(nodes)
        }
      }
      console.log('groups', groups)
      return groups
    }
  },

  created() {

  },

  mounted() {

  },

  methods: {
    handleClickNode(n) {
      this.nodeData = n
      this.dialogVisible = !this.dialogVisible
    }
  }
}

</script>
<style lang='scss'>
.ee-flow {
  &__inner {
    width: 1000px;
    min-height: 300px;
  }

  &__row {
    margin-top: 48px;

    &:first-child {
      margin-top: 0;
    }

    &.is-even {
      flex-direction: row-reverse;

      .node-arrow {
        transform: rotate(180deg);
      }
    }
  }

  &__begin,
  &__end {
    width: 56px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 8px;
    background: linear-gradient(180deg, #3478A9 -50%, #86B3D3 129.06%);
    color: #FFF;
    line-height: 32px;
  }

  &__node {
    width: 190px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid #DEE4E7;
    background: #FFF;

    &-head {
      padding: 0 16px;
      height: 35px;
      background: #E9ECEE;
    }

    &-index {
      color: #3478A9;
    }

    &-body {
      padding: 0 16px;
      height: 44px;
      line-height: 44px;
    }

    &.group-end {
      &::after {
        content: '';
        position: absolute;
        bottom: -42px;
        left: 50%;
        transform: translateX(-50%) rotate(90deg);
        width: 36px;
        height: 36px;
        background: url(@/assets/icons/svg/node-arrow.svg) center no-repeat;
      }
    }
  }

}
</style>