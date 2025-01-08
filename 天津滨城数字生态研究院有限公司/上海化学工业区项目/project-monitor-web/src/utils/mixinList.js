export default {
  data() {
    return {
      autoGetData: true,
      // 列表相关
      // 搜索关键字
      keyword: '',
      // 当前页
      current: 1,
      // 每页显示条数
      size: 10,
      // 总条数
      totalNum: 0,
      list: [],
      loading: false,
      // 选中的单个数据
      singleSelection: null,
      // 选中的多个数据
      multipleSelection: [],
    };
  },
  // 之所以用mounted，是希望在父组件可能在created中执行某些操作
  mounted() {
    if (this.autoGetData)
      this.getData();
  },
  methods: {
    // 关键字搜索
    changeKeyword() {
      this.current = 1;
      this.getData();
    },
    // 每页显示条数改变
    changeSize(size) {
      // 初始化页码
      this.current = 1;
      this.size = size;
      this.getData();
    },
    // 当前页改变
    changeNum(num) {
      this.current = num;
      this.getData();
    },
    selectionChange(val) {
      console.log('val', val);
      this.multipleSelection = val;
    },
    cancelSelection() {
      this.$refs.table.clearSelection();
      this.multipleSelection = [];
    },
  },
}
