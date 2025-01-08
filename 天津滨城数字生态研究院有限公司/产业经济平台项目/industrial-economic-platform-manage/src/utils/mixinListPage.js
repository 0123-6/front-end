export default {
  methods: {
    getRowIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  }
};
