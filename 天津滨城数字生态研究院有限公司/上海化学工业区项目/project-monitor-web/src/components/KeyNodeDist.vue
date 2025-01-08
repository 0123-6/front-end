<template>
  <div class="KeyNodeDist flex-y">
    <ee-title class="full-w" title="关键环节分布" level="2" />
    <div class="KeyNodeDist__wrap flex-1 full-w d-flex ai-center">
      <div class="KeyNodeDist__trail flex-1 d-flex ai-center jc-between">
        <div v-for="n in data" :key="n.name" class="KeyNodeDist__node pointer" :class="{ 'is-active': curNode == n.code }"
          @click="chooseNode(n)">
          <div class="node-name d-flex ai-center">
            <div class="node-text f16 f500">{{ n.name }}</div>
            <el-tooltip popper-class="is-padding" effect="dark" placement="top" trigger="hover">
              <el-icon class="ml4" color="#BABABA">
                <InfoFilled />
              </el-icon>
              <template #content>
                <div class="f16">
                  <span class="f-l6">产业项目：</span>
                  <span class="f-white">指{{ n.steps?.industry.map(s => `”${s.stepName}“`).join('或') }}环节</span>
                </div>
                <div class="f16 mt8">
                  <span class="f-l6">其它项目：</span>
                  <span class="f-white">指{{ n.steps?.other.map(s => `”${s.stepName}“`).join('或') }}环节</span>
                </div>
              </template>
            </el-tooltip>
          </div>
          <div class="node-num flex-center">
            <el-icon :size="20">
              <CaretTop />
            </el-icon>
            <span class="ddin f18">{{ n.num }}</span>
            <span class="f16">个</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyNodeDist',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      curNode: '',
    }
  },
  created() {
    this.curNode = this.data[0].code
  },
  methods: {
    chooseNode(e) {
      this.curNode = e.code
      this.$emit('change-node', e)
    }
  }
};
</script>

<style lang="scss">
.KeyNodeDist {
  height: 331px;

  &__wrap {
    padding: 0 40px 0 20px;
  }

  &__trail {
    height: 6px;
    background: #DBE1E9;
    border-radius: 6px;
  }

  &__node {
    position: relative;
    padding: 0 3px;
    background: #fff;
    width: 14px;
    height: 14px;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #DBE1E9;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      border-radius: 100%;

    }

    &.is-active {
      &::before {
        background: #5F97BF;
      }

      &::after {
        border: 2px solid #DBE1E9;
      }

      .node-text {
        color: #5F97BF;
      }

      .node-num {
        background: #5F97BF;

        .el-icon {

          color: #5F97BF;
        }
      }
    }

    .node-name {
      position: absolute;
      top: -26px;
      left: 50%;
      transform: translateX(-30%);
      min-width: 50px;
    }

    .node-text {
      color: #B0BFC9;
    }

    .node-num {
      position: absolute;
      bottom: -34px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 8px;
      min-width: 44px;
      border-radius: 8px;
      background: #B0BFC9;
      color: #fff;

      .el-icon {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        color: #B0BFC9;
      }
    }
  }
}
</style>