const { ref } = Vue
const { useRouter } = VueRouter

export default {
  setup() {
  
  },
  template: `
    <div style="width: 100%;height: 800px;background-color: chocolate;display: flex;flex-direction: column;">
      <span style="font-size: 32px;">404,此页面不存在</span>
      <RouterLink to="/index">返回首页</RouterLink>
    </div>
  `,
}
