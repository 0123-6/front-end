export const flowList = [
  { id: 0, name: '产业项目', children: ['项目准入', '土地储备', '土地供应', '前期审批', '项目建设', '绩效监管'].map((n, i) => ({ name: n, id: `0_${i}` })) },
  { id: 1, name: '其他项目', children: ['项目决策', '土地储备', '土地供应', '前期审批', '项目建设', '运行维护'].map((n, i) => ({ name: n, id: `1_${i}` })) },
]

// click 项目准入 href "javascript:mermaidCallback('项目准入');"
function createClickText(id, arr) {
  return arr.map((n, i) => `click ${n.name} href "javascript:mermaidflow_${id}(${i},'${n.name}');"`).join('\n')
}

function getEndPointText(str) {
  return `<div class="text-center">${str}</div><div style="width:61px;"></div>`
}

export const flow_0 = `
flowchart LR
开始:::endpoint
结束:::endpoint
供地方式:::judgement
开始("${getEndPointText('开始')}") --> 项目准入 --> 供地方式{供地方式} -- 土地转让 --> 土地供应 --> 前期审批 --> 项目建设 --> 绩效监管 --> 结束("${getEndPointText('结束')}")
供地方式 -- 土地出让 --> 土地储备 --> 土地供应
供地方式 -- 其他或不涉及 --> 前期审批
${createClickText(0, flowList[0].children)}
`
export const flow_1 = `
flowchart LR
开始:::endpoint
结束:::endpoint
收储:::judgement
开始("${getEndPointText('开始')}") --> 项目决策 --> 收储{收储} -- 是 --> 土地供应 --> 前期审批 --> 项目建设 --> 运行维护 --> 结束("${getEndPointText('结束')}")
收储 -- 否 --> 土地储备 --> 土地供应
${createClickText(1, flowList[1].children)}
`