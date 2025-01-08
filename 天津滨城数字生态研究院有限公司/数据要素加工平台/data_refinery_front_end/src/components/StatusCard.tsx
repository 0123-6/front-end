import React from "react";

interface Iprops {
  className?: string,
  status: string,
  height?: string,
}

export default function StatusCard(props:Iprops) {
  let {className,status,height='20px'} = props
  status += ''
  const statusValueLabelMap = {
    '0': '无效',
    '1': '未提交',
    '100': '待审核',
    '200': '已上线',
    '300': '已驳回',
    '400': '已下线'
  }
  let _style = {
    color: '',
    background: '',
    border: '',
  }
  if(status === '1') {// 未提交
    _style = {
      color: '#8D95B2',
      background: 'rgba(141,149,178,0.21)',
      border: '0.8px solid rgba(141,149,178,0.3)',
    }
  } else if (status === '100') {// 待审核
    _style = {
      color: '#E57F3F',
      background: 'rgba(229,127,63,0.21)',
      border: '0.8px solid rgba(229,127,63,0.3)',
    }
  } else if (status === '200') {// 已上线
    _style = {
      color: '#4CAAB4',
      background: 'rgba(76,170,180,0.21)',
      border: '0.8px solid rgba(76,170,180,0.3)',
    }
  } else if (status === '300') {// 已驳回
    _style = {
      color: '#F06B7C',
      background: 'rgba(240,107,124,0.21)',
      border: '0.8px solid rgba(240,107,124,0.3)',
    }
  } else if (status === '400') {// 已下线
    _style = {
      color: '#8D95B2',
      background: 'rgba(141,149,178,0.21)',
      border: '0.8px solid rgba(141,149,178,0.3)',
    }
  }
  return (
    <div style={{width:'60px',height,borderRadius: '20px 18.75px 18.75px 0px',lineHeight:'14px',..._style}}
         className={`flex justify-center items-center text-xs ${className}`}>
      {statusValueLabelMap[status]}
    </div>
  )
}
