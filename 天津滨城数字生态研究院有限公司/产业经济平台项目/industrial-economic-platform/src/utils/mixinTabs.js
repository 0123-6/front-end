/* eslint-disable */

export default {
  created() {
    this.getTabs()
  },
  methods: {
    getTabs() {
      const testIndex = false
      this.iep_platform_ROUTERS_INFO.forEach((item) => {
        if (item.id === this.iep_platform_MENU_ID) {
          this.tabs.forEach((tab, index) => {
            this.tabs[index].isShow = (testIndex === false || testIndex === index) && item.children.findIndex((el) => el.menuName === tab.title) >= 0;
          });
        } else if (item.children?.length > 0) {
          item.children.forEach((innerItem) => {
            if (innerItem.id === this.iep_platform_MENU_ID) {
              this.tabs.forEach((tab, index) => {
                this.tabs[index].isShow = (testIndex === false || testIndex === index) && innerItem.children.findIndex((el) => el.menuName === tab.title) >= 0;
              });
            }
          });
        }
      });
    }
  }
};
