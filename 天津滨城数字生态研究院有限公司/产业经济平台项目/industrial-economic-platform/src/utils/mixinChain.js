/* eslint-disable */
import { comparisonApis } from '@/api/comprehensive-comparison';

export default {
  data() {
    return {
      chainList: []
    }
  },
  created() {
    this.getChainList()
  },
  methods: {
    getChainList() {
      comparisonApis
        .getChainList({
          menuId: this.iep_platform_MENU_ID,
          pageSize: 999,
          pageNum: 1
        })
        .then((result) => {
          this.chainList = result.data.list;
          this.afterChainListLoad && this.afterChainListLoad()
        })
        .catch(() => { });
    }
  }
};
