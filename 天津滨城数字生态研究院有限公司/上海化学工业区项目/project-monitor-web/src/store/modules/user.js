import { getToken, setToken, removeToken } from '@/utils/auth'
import md5 from 'js-md5'
import { sysUser_login, sysUser_logout, sysUser_info } from '@/api/admin/sysUser.js'
import { ElMessage } from 'element-plus'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      info: {},
      permissions: [],
    }),
    actions: {
      // 登录
      async login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const { result, success, message } = await sysUser_login({
          username, password: md5(password)
        })
        if (success) {
          setToken(result.token)
          this.token = result.token
        } else {
          ElMessage({ message, type: 'error' })
        }
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          sysUser_info().then(({ result }) => {
            this.info = {
              ...result,
              menuList: undefined
            }
            this.permissions = result.menuList
            resolve()
          }).catch(() => {
            reject()
          })
        })
      },
      setPermissions(val) {
        this.permissions = val
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          sysUser_logout().then(() => {
            this.info =
              this.token = ''
            this.permissions = []
            removeToken()
            resolve()
          }).catch(() => {
            reject()
          })
        })
      }
    }
  })

export default useUserStore
