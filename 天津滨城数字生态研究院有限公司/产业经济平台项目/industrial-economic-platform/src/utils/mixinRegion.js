/* eslint-disable */
import { analysisApis } from '@/api/structural-analysis';
import { centralCityCodes } from '@/utils/constant'
export default {
  data() {
    return {
      regionTree: []
    }
  },
  created() {
    // console.log('mixinRegion created')
    if (!this.ignoreRegionTree) {
      this.getRegionData()
    }
  },
  methods: {
    getRegionData() {
      const params = {
        menuId: this.iep_platform_MENU_ID
      };
      analysisApis
        .getRegionItems(params)
        .then(({ data }) => {
          data[0].children.forEach(n => {
            if (centralCityCodes.indexOf(n.regionCode) > -1) {
              n.children = [{
                ...JSON.parse(JSON.stringify(n)),
                regionLevel: 2
              }]
              n.children[0].children.forEach(c => {
                c.regionLevel = 3
              })
            }
          })
          this.regionTree = data;
          this.afterRegionLoad && this.afterRegionLoad(this.regionTree)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
