const { ref } = Vue
const { useRouter } = VueRouter
import {state} from '../../util/state.js'

export default {
  setup() {
    // 注意，无需解构
    const router = useRouter()
    // state
    const username = ref('')
    const password = ref('')
    // methods
    function login() {
      if (username.value && password.value === 'password') {
        const user = {
          username: username.value,
          password: password.value,
        }
        localStorage.setItem('user', JSON.stringify(user))
        state.user = user
        // 跳转到首页
        router.push('/index')
      } else {
        console.log('账户或密码错误')
      }
    }
    async function register() {
      if (username.value && password.value) {
        const user = {
          username: username.value,
          password: password.value,
        }
        const res = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            // 'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
        const resData = await res.json()
        console.log('resData: ', resData);
      } else {
        console.log('账户或密码不完整')
      }
    }
    // 返回
    return {
      username,
      password,
      login,
      register,
    }
  },
  template: `
    <div style="width: 100vw;height: 100vh;background-color: #4fc08d;display: flex;justify-content: center;align-items: center;">
      <!--登录框-->
      <div style="width: 400px;height: 400px;display: flex;flex-direction: column;justify-content: center;align-items: center;box-shadow: 0 0 2px 2px red;">
        <span style="font-size: 18px;">登录</span>
        <!--用户名-->
        <div style="margin-top: 20px;width: 300px;display: flex;align-items: center;">
          <span>用户名:</span>
          <input type="text" style="margin-left: 16px;height: 20px;" v-model="username">
        </div>
        <!--密码-->
        <div style="margin-top: 20px;width: 300px;display: flex;align-items: center;">
          <span>密码:</span>
          <input type="password" style="margin-left: 16px;height: 20px;" v-model="password">
        </div>
        <!--按钮-->
        <div style="margin-top: 20px;width: 300px;display: flex;align-items: center;">
          <button style="width: 64px;height: 32px;display: flex;justify-content: center;align-items: center;cursor: pointer;"
                  @click="login"><span>登录</span></button>
        </div>
      </div>
      <!--注册框-->
      <div style="width: 400px;height: 400px;display: flex;flex-direction: column;justify-content: center;align-items: center;box-shadow: 0 0 2px 2px red;">
        <span style="font-size: 18px;">注册</span>
        <!--用户名-->
        <div style="margin-top: 20px;width: 300px;display: flex;align-items: center;">
          <span>用户名:</span>
          <input type="text" style="margin-left: 16px;height: 20px;" v-model="username">
        </div>
        <!--密码-->
        <div style="margin-top: 20px;width: 300px;display: flex;align-items: center;">
          <span>密码:</span>
          <input type="password" style="margin-left: 16px;height: 20px;" v-model="password">
        </div>
        <!--按钮-->
        <div style="margin-top: 20px;width: 300px;display: flex;align-items: center;">
          <button style="width: 64px;height: 32px;display: flex;justify-content: center;align-items: center;cursor: pointer;"
                  @click="register"><span>注册</span></button>
        </div>
      </div>
    </div>
  `,
}
