/* eslint-disable */
const contentClass = '.scroll-content'
const itemClass = '.scroll-anchor'
export default {
  mounted() {
    this.debounceScroll = this.$debounce(this.onScroll, 200)
    this.$el.querySelector(contentClass).addEventListener('scroll', this.debounceScroll)
  },
  beforeDestroy() {
    this.$el.querySelector(contentClass).removeEventListener('scroll', this.debounceScroll)
  },
  methods: {
    handleScroll(index) {
      const target = this.$el.querySelector(contentClass);
      const scrollItems = this.$el.querySelectorAll(itemClass);
      this.tabIndex = index.index.toString();
      if (scrollItems[index.index])
        target.scrollTo({
          top: scrollItems[index.index].offsetTop + (this.scrollOffset || 0),
          behavior: 'smooth'
        });
    },
    // 滚动条滚动
    onScroll(e) {
      const scrollItems = this.$el.querySelectorAll(itemClass);
      const target = this.$el.querySelector(contentClass);
      if (target.clientHeight + target.scrollTop >= target.scrollHeight) {
        this.tabIndex = (scrollItems.length - 1).toString()
      } else {
        for (let i = 0; i < scrollItems.length; i++) {
          // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
          const judge = (scrollItems[i].offsetTop + scrollItems[i].offsetHeight - 50 > target.scrollTop)
            && (scrollItems[i].offsetTop + 50 < target.scrollTop + target.clientHeight);
          if (judge) {
            this.tabIndex = i.toString();
            break;
          }
        }
      }
    }
  }
};
