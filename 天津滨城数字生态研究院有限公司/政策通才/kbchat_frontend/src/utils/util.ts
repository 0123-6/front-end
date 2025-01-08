class MyNode {
  id: any;
  beforeNodeList: Array<any>;
  afterNodeList: Array<any>;

  constructor(id) {
    this.id = id
    this.beforeNodeList = []
    this.afterNodeList = []
  }

  setBeforeNodeList(list) {
    this.beforeNodeList = list
  }

  addBeforeNodeList(nodeId) {
    this.beforeNodeList.push(nodeId);
  }

  decBeforeNodeList(nodeId) {
    let index = this.beforeNodeList.indexOf(nodeId);
    if (index !== -1) {
      this.beforeNodeList.splice(index, 1);
    }
  }

  setAfterNodeList(list) {
    this.afterNodeList = list
  }

  addAfterNodeList(nodeId) {
    this.afterNodeList.push(nodeId);
  }

  decAfterNodeList(nodeId) {
    let index = this.afterNodeList.indexOf(nodeId);
    if (index !== -1) {
      this.afterNodeList.splice(index, 1);
    }
  }
}

// 拓扑排序,输入为一张图的节点数组和边数组
export function mySort(data,iiii=1) {
  console.log('第'+iiii+'个联通子图: ',data);
  let nodeMap = new Map();
  let result = [];
  for (let i = 0; i < data.nodes.length; i++) {
    let node = data.nodes[i]
    let node2 = new MyNode(node.id);
    nodeMap.set(node2.id, node2)
  }
  for (let i = 0; i < data.edges.length; i++) {
    let edge = data.edges[i]
    nodeMap.get(edge.source).addAfterNodeList(edge.target);
    nodeMap.get(edge.target).addBeforeNodeList(edge.source);
  }
  while (nodeMap.size > 0) {
    let nodeId = -1
    nodeMap.forEach((node) => {
      if (nodeId === -1 && node.beforeNodeList.length === 0) {
        nodeId = node.id
      }
    })
    if (nodeId === -1) {
      console.error('第'+iiii+'个联通子图: '+'存在环，拓扑排序失败')
      break
    }
    let node = nodeMap.get(nodeId);
    nodeMap.delete(nodeId);
    result.push(node.id)
    nodeMap.forEach((node2) => {
      node2.decBeforeNodeList(nodeId)
    })
  }
  console.log('第'+iiii+'个联通子图: '+'拓扑排序结果: ',result)
  return result
}

// 将data中的节点和边分组，按照联通子图
export function getChildrenGraph(data) {
  // console.log(data)
  let result = []

  // 找出联通子图
  // 将为分类的节点数组
  let willClassifyNodeList = [...data.nodes]
  let willClassifyEdgeList = [...data.edges]
  // console.log(willClassifyNodeList)
  // console.log(willClassifyEdgeList)
  // 如果待分类的节点数组不为空
  while (willClassifyNodeList.length > 0) {
    // 创建一个新的联通子图
    let childGraph = {
      nodes: [],
      edges: [],
    }
    // 从待分类的节点数组中取一个，放入这个bfs数组中
    // bfsList中的节点，willClassifyNodeList已没有，但还没有放到childGraph中
    let bfsList = []
    let node = willClassifyNodeList[0]
    willClassifyNodeList.splice(0,1);
    bfsList.push(node)
    // bfs
    while (bfsList.length > 0) {
      let node2 = bfsList[0]
      bfsList.splice(0,1);

      // 把和node2有关系的边和顶点找到，边直接放到graph.edges中，顶点放到bfsList中
      // node2为source
      for(let i=0;i<willClassifyEdgeList.length;i++) {

        if(willClassifyEdgeList[i].source === node2.id) {
          // 有以该节点为source的边
          let targetNodeId = willClassifyEdgeList[i].target
          for(let j=0;j<willClassifyNodeList.length;j++) {
            if(willClassifyNodeList[j].id === targetNodeId) {
              bfsList.push(willClassifyNodeList[j])
              willClassifyNodeList.splice(j,1)
              break
            }
          }
          // 删除掉该边
          childGraph.edges.push(willClassifyEdgeList[i])
          willClassifyEdgeList.splice(i,1)
          i -= 1
        }
      }
      // ndoe2为target
      for(let i=0;i<willClassifyEdgeList.length;i++) {

        if(willClassifyEdgeList[i].target === node2.id) {
          // 有以该节点为source的边
          let targetNodeId = willClassifyEdgeList[i].source
          for(let j=0;j<willClassifyNodeList.length;j++) {
            if(willClassifyNodeList[j].id === targetNodeId) {
              bfsList.push(willClassifyNodeList[j])
              willClassifyNodeList.splice(j,1)
              break
            }
          }
          // 删除掉该边
          childGraph.edges.push(willClassifyEdgeList[i])
          willClassifyEdgeList.splice(i,1)
          i -= 1
        }
      }

      childGraph.nodes.push(node2)
    }
    // bfs结束，该联通子图的节点和边已经保存在childGraph中
    // 将创建的联通子图放入联通子图数组中
    result.push(childGraph);
  }

  return result
}

// 随机返回数组的n项，不改变原数组
export function getRandomNItems(arr, n) {
  // 复制原数组，避免改变原数组
  const newArr = arr.slice();

  // 打乱数组
  for (let i = newArr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  // 返回前n项
  return newArr.slice(0, n);
}

// 生成随机数组
export function createRandomArray() {
  const falseData = []
  for(let i=0;i<100;i++) {
    const params = {
      key:i,
      id:i,
      name:'名称'+i,
    }
    falseData.push(params)
  }
  return falseData

  // setTimeout(()=>{
  //   setData(getRandomNItems(falseData,pageSize.current))
  //   setPageSum(falseData.length)
  //   setLoading(false)
  //   if(first) {
  //     setFirst(false)
  //   }
  // },500)

}

// 禁用回车键
export const handleKeyDownDisabled = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault()
  }
}

// 输出为11位手机号，输入为前3位+'****'+后4位
export const formatPhone = (phone) => {
  if(phone.length === 11) {
    return phone.substring(0,3)+'****'+phone.substring(7,11)
  } else {
    return phone
  }
}

// 展示文件名称，输入为'/xx/xx/name'，输出为'name'
export const showLastName = (name) => {
  const nameList = name.split('/')
  return nameList[nameList.length-1]
}

//格式化数字
export function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 更新用户数据
export const updateUser = (userInfo) => {
  console.log('更新用户数据')
  const avatarList = document.getElementsByClassName('avatar')
  if (avatarList.length > 0) {
    for(let i = 0; i < avatarList.length; i++) {
      avatarList[i].setAttribute('src', userInfo.avatar)
    }
  }
  const nicknameList = document.getElementsByClassName('nickname')
  if (nicknameList.length > 0) {
    for(let i = 0; i < nicknameList.length; i++) {
      // @ts-ignore
      nicknameList[i].innerText = userInfo.nickname
    }
  }
  console.log('avatarList', avatarList)
  console.log('nicknameList', nicknameList)
}
