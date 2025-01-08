<!--
  * @Author: srcheng 17755456856@163.com
  * @Date: 2022-10-12 13:03:11
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-02 16:11:26
  * @FilePath: \ai-platform-front-end-project\src\views\develop\notebooks\WorkerFrame.vue
  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!--最外层-->
  <div class="flex flex-direction" style="width: 100%;height: 100%;">
    {{iframeUrl}}
    <iframe id="notebooksIframe" :src="iframeUrl" width="100%" height="100%" frameborder="0" allow="payment" />
  </div>
</template>

<script>
import {
  getAuthserviceSession,
  getOidcUrl
} from '@/api/notebook';
import { mapGetters } from 'vuex';
export default {
  name: 'WorkerFrame',
  data() {
    return {
      iframeUrl: ''
    };
  },
  computed: {
    ...mapGetters(['kubeflowUrl'])
  },
  mounted() {
    const details = sessionStorage.getItem('notebookDetails');
    this.$nextTick(() => {
      this.connect(JSON.parse(details));
    });
  },
  methods: {
    connect(item) {
    // 第一步，
      getAuthserviceSession().then(res => {
        // document.cookie = res.data + ';domain=8.219.125.128:30368';
        const dataList = res.data.split(';');
        const authservice_session = dataList.find(item => {
          return item.indexOf('authservice_session=') >= 0;
        });
        // 第2步，获取oidc
        getOidcUrl().then(res => {
          this.iframeUrl = res.data;
          // 不执行
          setTimeout(() => {
            this.iframeUrl = '';
            // 第3步 拼接jupyter访问地址
            if (item.serverType === 'jupyter') {
              this.iframeUrl = this.kubeflowUrl + '/notebook/' + item.namespace + '/' + item.name + '/lab' + `?${authservice_session.trim()}&domain=8.219.125.128:30368`;
            } else {
              this.iframeUrl = this.kubeflowUrl + '/notebook/' + item.namespace + '/' + item.name + `?${authservice_session.trim()}&domain=8.219.125.128:30368`;
            }
          }, 300);
        });
      });
    }
  }
};
</script>

<style scoped>

</style>
