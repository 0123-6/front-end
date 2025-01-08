/* eslint-disable */
import { getIndustryCategoryList } from '@/api/policy';

export default {
  data() {
    return {
      industryTypeList: []
    }
  },
  created() {
    this.getIndustryCategoryList()
  },
  methods: {
    getIndustryCategoryList() {
      getIndustryCategoryList()
        .then(({ data }) => {
          this.industryTypeList = data.data.industry_category
          this.afterIndustryLoad && this.afterIndustryLoad()
        })
        .catch((err) => {
          console.log(err);
        });
    },
  }
};
