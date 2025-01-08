import React, {useState} from "react";
import {Input, Select} from "antd";
import {NsGraphStatusCommand, NsNodeCmd, XFlowNodeCommands} from "@antv/xflow";

export const ReadData = (_targetType, _targetData, _modelService, commandService) => () => {
  const [targetData,setTargetData] = useState(_targetData)

  const changeLabel = (e,key) => {
    // 普通input框，取e.target.value,数字input框,取e
    const value = e.target ? e.target.value : e;
    setTargetData({
      ...targetData,
      [key]: value
    })
    // @ts-ignore
    let executeCommand = commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
      nodeConfig:{
        ...targetData,
        [key]: value,
        status: NsGraphStatusCommand.StatusEnum.DEFAULT
      }
    });
  }

  const change = (e,index) => {
    // 普通input框，取e.target.value,数字input框,取e
    const value = e.target ? e.target.value : e;
    let newConfig = JSON.parse(JSON.stringify(targetData.config))
    newConfig[index].value = value
    setTargetData({
      ...targetData,
      config: newConfig,
    })
    // @ts-ignore
    let executeCommand = commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
      nodeConfig:{
        ...targetData,
        config: newConfig,
        status: NsGraphStatusCommand.StatusEnum.DEFAULT
      }
    });
  }

  return (
    //最外层
    <div className="w-full h-full flex flex-col bg-white">
      {/*标题*/}
      <div className="pt-4 pb-2 w-full flex text-sm text-black">
        {/*模型名称*/}
        <div className="ml-4">模型名称</div>
        {/*模型名称2*/}
        <div style={{marginLeft:'10px'}}>{targetData.label}</div>
      </div>
      {/*内容*/}
      <div className="w-full flex flex-col"
           style={{paddingLeft:'14px',paddingRight:'15px',}}>
        {/*label*/}
        <div className="w-full mt-2 flex items-center">
          {/*title*/}
          <span className="flex text-sm text-black-light mr-3" style={{width:'56px'}}>节点名称</span>
          {/*输入框*/}
          <Input autoComplete={"off"} className="flex-1" value={targetData.label} onChange={e => changeLabel(e,'label')} size="middle"/>
        </div>
        {/*数据类型*/}
        <div className="w-full mt-5 flex items-center text-sm text-black-light">
          <span className="mr-3">{targetData.config[0].label}</span>
          <Select
            className="flex-1"
            value={targetData.config[0].value}
            onChange={e => change(e,0)}
            size="middle"
            options={targetData.config[0].source_data}/>
        </div>
        {/*数据路径*/}
        <div className="w-full mt-6 flex flex-col">
          {/*title*/}
          <span className="flex text-sm text-black-light">{targetData.config[1].label}</span>
          {/*输入框*/}
          <Input value={targetData.config[1].value}
                 autoComplete={"off"}
                 onChange={e => change(e,1)}
                 className="mt-2" size="middle"/>
        </div>
      </div>
    </div>
  )
}
