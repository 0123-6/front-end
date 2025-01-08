import React, {useState} from "react";
import {Input, Switch} from "antd";
import {NsGraphStatusCommand, NsNodeCmd, XFlowNodeCommands} from "@antv/xflow";

export const TextPreprocessing = (_targetType, _targetData, _modelService, commandService) => () => {

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
        {/*是否自定义替换*/}
        <div className="w-full mt-4 flex items-center text-sm text-black-light">
          <span className="mr-3">{targetData.config[0].label}</span>
          <Switch checked={targetData.config[0].value}
                  onChange={(value,_e) => change(value,0)} />
        </div>
        {/*替换正则表达式*/}
        <div className="w-full mt-4 flex items-center text-sm text-black-light">
          {/*title*/}
          <span className="mr-3">{targetData.config[1].label}</span>
          {/*输入框*/}
          <Input className="flex-1"
                 autoComplete={"off"}
                 value={targetData.config[1].value}
                 onChange={e => change(e,1)}
                 size="middle"/>
        </div>
        {/*是否自定义匹配*/}
        <div className="w-full mt-4 flex items-center text-sm text-black-light">
          <span className="mr-3">{targetData.config[2].label}</span>
          <Switch checked={targetData.config[2].value}
                  onChange={(value,_e) => change(value,2)} />
        </div>
        {/*匹配正则表达式*/}
        <div className="w-full mt-4 flex items-center text-sm text-black-light">
          {/*title*/}
          <span className="mr-3">{targetData.config[3].label}</span>
          {/*输入框*/}
          <Input className="flex-1"
                 autoComplete={"off"}
                 value={targetData.config[3].value}
                 onChange={e => change(e,3)}
                 size="middle"/>
        </div>
      </div>
    </div>
  )
}
