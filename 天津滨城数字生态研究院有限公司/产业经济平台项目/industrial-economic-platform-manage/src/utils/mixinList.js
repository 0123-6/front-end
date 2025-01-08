import { del, get, post } from '@/utils/request';

export default {
  data() {
    return {
      // 搜索关键词
      keyword: '',
      // 当前页
      page_num: 1,
      // 每页显示条数
      page_size: 10,
      order_by_asc: '',
      order_by_desc: '',
      // 筛选
      filters: null,
      // 总条数
      total_num: 0,
      // 列表数据
      list: [],
      // 加载在
      loading: false,
      // 选中的多个数据
      multipleSelection: [],
      // 选中的单个数据
      singleSelection: null,
      url: '',
      // id的key
      idKey: 'id',
      // 额外的可能的参数
      extraParams: {},
      // 弹框部分
      // 是否展示编辑弹框
      showEditDialog: false,
      // 是否展示删除弹框
      showDeleteDialog: false,
      // 上线弹框
      showOnlineDialog: false,
      // 下线弹框
      showOfflineDialog: false,
    };
  },
  // 之所以用mounted，是希望在父组件可能在created中执行某些操作
  mounted() {
    this.getData();
  },
  methods: {
    // 初始化，转态管理终极解决方案
    init() {
      this.keyword = '';
      this.page_num = 1;
      this.page_size = 10;
      this.order_by_asc = '';
      this.order_by_desc = '';
      this.filters = null;
      this.total_num = 0;
      this.list = [];
      this.loading = false;
      this.multipleSelection = [];
      this.singleSelection = null;
      this.extraParams = {};
      this.showEditDialog = false;
      this.showDeleteDialog = false;
      this.showOnlineDialog = false;
      this.showOfflineDialog = false;
    },
    // 搜索
    async getData() {
      // 参数
      // 如果存在extraParams，就把extraParams的值赋值给params
      const params = {
        keyword: this.keyword,
        page_num: this.page_num,
        page_size: this.page_size,
        order_by_asc: this.order_by_asc,
        order_by_desc: this.order_by_desc,
        ...this.filters,
        ...this.extraParams,
      };
      this.loading = true;
      const { data } = await get(this.url, params);
      this.list = data?.list;
      this.total_num = data?.total_num;
      this.loading = false;
    },
    // 每页显示条数改变
    changeSize(size) {
      // 初始化页码
      this.page_num = 1;
      this.page_size = size;
      this.getData();
    },
    // 当前页改变
    changeNum(num) {
      this.page_num = num;
      this.getData();
    },
    // 关键字搜索
    changeKeyword() {
      this.page_num = 1;
      this.getData();
    },
    // 排序搜索
    changeSort({ prop, order }) {
      if (order === 'ascending') {
        this.order_by_asc = prop;
        this.order_by_desc = '';
      } else if (order === 'descending') {
        this.order_by_asc = '';
        this.order_by_desc = prop;
      } else {
        this.order_by_asc = '';
        this.order_by_desc = '';
      }
      this.page_num = 1;
      this.getData();
    },
    // 筛选搜索
    changeFilter(filters) {
      this.filters = filters;
      this.page_num = 1;
      this.getData();
    },
    // 操作列部分
    handleView(item) {
      // 跳转到详情页，url为当前页的pathname+'/detail/'+item.id
      this.$router.push(`${this.$route.path}/detail/${item.id}`);
    },
    // 弹框部分
    // 点击了编辑按钮
    handleEdit(item) {
      this.singleSelection = item;
      this.showEditDialog = true;
    },
    // 编辑弹框点击了确定
    async editDialogOnOk(dialogParams) {
      const params = {
        [this.idKey]: this.singleSelection.id,
        ...dialogParams,
      };
      await post(this.url, params);
      this.$message({
        type: 'success',
        message: '编辑成功',
      });
      this.editDialogOnCancel();
      this.getData();
    },
    // 编辑弹框点击了取消
    editDialogOnCancel() {
      this.singleSelection = null;
      this.showEditDialog = false;
    },
    // 点击了删除按钮
    handleDelete(item) {
      this.singleSelection = item;
      this.showDeleteDialog = true;
    },
    // 删除弹框点击了确定
    async deleteDialogOnOk() {
      await del(`${this.url}/${this.singleSelection.id}`);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      // 判断是否是最后一页的最后一条数据
      if (this.list.length === 1 && this.page_num > 1) {
        this.page_num -= 1;
      }
      this.deleteDialogOnCancel();
      this.getData();
    },
    // 删除弹框点击了取消
    deleteDialogOnCancel() {
      this.singleSelection = null;
      this.showDeleteDialog = false;
    },
    // 点击了上线按钮
    handleOnline(item) {
      this.singleSelection = item;
      this.showOnlineDialog = true;
    },
    // 上线弹框点击确定
    async onlineDialogOnOk(dialogParams) {
      const params = {
        [this.idKey]: this.singleSelection.id,
        ...dialogParams,
      };
      await post(this.url, params);
      this.$message({
        type: 'success',
        message: '上线成功',
      });
      this.onlineDialogOnCancel();
      this.getData();
    },
    // 上线弹框点击了取消
    onlineDialogOnCancel() {
      this.singleSelection = null;
      this.showOnlineDialog = false;
    },
    // 点击了下线按钮
    handleOffline(item) {
      this.singleSelection = item;
      this.showOfflineDialog = true;
    },
    // 下线弹框点击确定
    async offlineDialogOnOk(dialogParams) {
      const params = {
        [this.idKey]: this.singleSelection.id,
        ...dialogParams,
      };
      await post(this.url, params);
      this.$message({
        type: 'success',
        message: '下线成功',
      });
      this.offlineDialogOnCancel();
      this.getData();
    },
    // 下线弹框点击了取消
    offlineDialogOnCancel() {
      this.singleSelection = null;
      this.showOfflineDialog = false;
    },
  },
};
