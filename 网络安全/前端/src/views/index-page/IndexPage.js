const { ref, onMounted } = Vue

export default {
  setup() {
    // state
    const userList = ref([])
    // methods
    async function getUserList() {
      const res = await fetch('http://localhost:3000/users')
      userList.value = await res.json()
    }
    
    onMounted(async () => {
      // 补充这里，我想显示XSS攻击，遍历显示userList的username属性，可能是js脚本
      await getUserList()
      const parent = document.getElementById('id123')
      userList.value.forEach(({username}) => {
        const spanElement = document.createElement('span')
        spanElement.innerHTML = username
        parent.appendChild(spanElement)
      })
    })
    return {
      userList,
    }
  },
  template: `
    <div style="width: 100%;height: 800px;background-color: #73abfe;display: flex;flex-direction: column;">
      <span style="font-size: 20px;">首页</span>
       <div id="id123">
    </div>
    </div>
  `,
}
