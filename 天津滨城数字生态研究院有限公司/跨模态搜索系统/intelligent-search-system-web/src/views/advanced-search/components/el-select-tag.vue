<template>
  <el-select
    v-model="values"
    multiple
    style="width:100%"
    placeholder="请选择"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
let observer = null;
export default {
  name: 'el-select-tag',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  mounted() {
    const tagLIstDom = document.querySelector('.el-select__tags');
    const tagSpanDom = document.querySelector('.el-select__tags > span');
    const hideDom = document.createElement('span');
    hideDom.classList = ['count-node']; // 设置样式
    tagSpanDom.append(hideDom); // 插入到span中
    const config = { childList: true };

    // 当观察到突变时执行的回调函数
    const callback = function (mutationsList) {
      mutationsList.forEach((item, index) => {
        if (item.type === 'childList') {
          const tagList = item.target.childNodes;
          let tagWidth = 0; // 标签总宽度
          let tagNum = 0; // 标签多余个数
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < tagList.length; i++) {
            const e = tagList[i];
            if (tagWidth > tagLIstDom.offsetWidth) {
              e.style.display = 'none'; // 隐藏多余标签
            } else {
              e.style.display = 'inline-block'; // 显示标签
            }
            tagWidth += e.offsetWidth + 5;
            if (tagWidth > tagLIstDom.offsetWidth) {
              e.style.display = 'none'; // 隐藏多余标签
            } else {
              e.style.display = 'inline-block'; // 显示标签
            }
            if (e.style.display !== 'none') {
              // eslint-disable-next-line no-plusplus
              tagNum++;
              hideDom.style.display = 'none'; // 隐藏多余标签个数
            } else {
              hideDom.style.display = 'inline-block'; // 显示多余标签个数
              hideDom.innerHTML = `+${tagList.length - tagNum}`;// 显示多余标签个数
            }
          }
        }
      });
    };

    // 创建一个链接到回调函数的观察者实例
    observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    observer.observe(tagSpanDom, config);

    // 随后，您还可以停止观察
    // observer.disconnect();
  },
  methods: {
    handleChange() {
      this.$emit('change', this.value);
    }
  },
  computed: {
    values: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  // 销毁时
  beforeDestroy() {
    // 停止观察
    observer.disconnect();
  }
};
</script>
<style lang="scss" scoped>
>>> .count-node {
  position: absolute;
  right: 0;
  top: 2px;
  display: none;
  height: 24px;
  padding: 0 8px;
  line-height: 22px;
  margin-left: 6px;
  background-color: #f4f4f5;
  border: 1px solid #e9e9eb;
  border-radius: 4px;
  color: #909399;
  font-size: 12px;
  box-sizing: border-box;
}
</style>
