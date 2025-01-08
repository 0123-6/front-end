import React from "react";
// import NoData from "../../../icon/no-data.svg";

export const Panel = (_targetType, _targetData, _modelService) => () => {

  return (
    //最外层
    <div className="w-full h-full flex flex-col bg-white">
      {/*标题*/}
      <div className="pt-4 pb-2 w-full flex flex-col text-sm text-black">
        {/*模型名称*/}
        <div className="ml-4">节点参数</div>
        {/*模型名称2*/}
        {/*<div style={{marginLeft:'10px'}}>{targetData.label}</div>*/}
        {/*<div className="w-full flex flex-col justify-center items-center"*/}
        {/*     style={{height:'300px'}}>*/}
        {/*  <img src={NoData} alt="" style={{width:'100px',height:'100px'}}/>*/}
        {/*  <div className="mt-3 flex text-sm text-black-light">暂无内容</div>*/}
        {/*</div>*/}
      </div>
      {/*内容*/}
      <div className="w-full flex flex-col"
           style={{paddingLeft:'14px',paddingRight:'15px',}}>
      </div>
    </div>
  )
}
