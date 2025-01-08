const { ref } = Vue
const {useRouter} = VueRouter

export default {
  setup() {
    // state
    const router = useRouter()
    const user = ref(JSON.parse(localStorage.getItem('user')) || {})
    // mounted
    // methods
    function logout() {
      localStorage.setItem('user', '')
      router.replace('/login')
    }
    // return
    return {
      user,
      logout,
    }
  },
  template: `
    <div style="width: 100%;height: 800px;display: flex;flex-direction: column;">
      <!--用户名-->
      <div style="margin-top: 20px;width: 100%;display: flex;flex-direction: column;">
        <span style="">{{user?.username}}</span>
        <span style="margin-top: 20px;">{{user?.age}}</span>
        <button @click="logout">退出登录</button>
      </div>
    </div>
  `,
}
