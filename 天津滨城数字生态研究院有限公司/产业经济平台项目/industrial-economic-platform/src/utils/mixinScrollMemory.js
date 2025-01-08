/* eslint-disable */
export default {
  created() {
    this.scrollSelector = '.app-main'
    this.scrollMemoryKey = `scrollMemory-${this.$route.name}`
    this.clearScrollMemory()
  },
  activated() {
    this.$nextTick(() => {
      const top = sessionStorage.getItem(this.scrollMemoryKey);
      if (top) {
        this.returnScrollMemory(Number(top));
      }
    });
  },
  methods: {
    returnScrollMemory(top) {
      document.querySelector(this.scrollSelector).scrollTo({ top, behavior: 'smooth' });
      this.clearScrollMemory()
    },
    storeScrollMemory() {
      sessionStorage.setItem(this.scrollMemoryKey, document.querySelector(this.scrollSelector).scrollTop);
    },
    clearScrollMemory() {
      sessionStorage.removeItem(this.scrollMemoryKey);
    }
  }
};
