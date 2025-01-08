import React, {useEffect, useRef} from "react";
import MyHeader from "./MyHeader";
import {Redirect, Route, Switch} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import Experiment from "../experiment";
import ElementProcessing from "../element-processing";
import ElementMarket from "../element-market";
import ModelLibrary from "../model-library";
import ElementProcessingDetail from "../element-processing/detail";
import ProductionTask from "../element-processing/production-task";
import ProductionTaskCreate from "../element-processing/production-task/create/production-task-create";
import ProductionTaskDetail from "../element-processing/production-task/detail";
import OfflinePacket from "../data-element/offline-packet";
import ApiServe from "../data-element/api-serve";
import ShouYeIndex from "../shouye";
import OfflinePacketDetail from "../data-element/offline-packet/detail";
import ApiServeDetail from "../data-element/api-serve/detail";
import Notebook from "../experiment/notebook";
import DataResourceDetail from "../data-resource/detail";
import DataResource from "../data-resource";
import RecordArea from "./RecordArea";
import UserCenter from "../user-center";
import MyModel from "../my-model";
import MyModelCreate from "../my-model/create";
import MyModelDetail from "../my-model/detail";
import ApiServeCreate from "../data-element/api-serve/create";
import ModelLibraryDetail from "../model-library/ModelLibraryDetail";
import DataResourceMyData from "../data-resource/my-data";
import DataResourceMyDataCreate from "../data-resource/my-data/create";
import DataResourceMyDataDetail from "../data-resource/my-data/detail";

export default function () {
  // state
  console.log(location.href)
  const history = useHistory();
  const layoutRef = useRef(null);
  // @ts-ignore
  if (!localStorage.getItem('token')) {
    history.replace('/login')
  }
  let minWidth = '1195px'
  let headerClassName = 'sticky top-0 z-30'
  if (location.href.indexOf('/experiment/code/') !== -1) {
    minWidth = '1360px'
    headerClassName = ''
  }
  useEffect(() => {
    if(document.title !== 'DataRefinery') {
      document.title = 'DataRefinery';
    }
  }, []);
  useEffect(() => {
    layoutRef.current.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div id='layoutRef' ref={layoutRef} className="w-screen h-screen bg-white overflow-auto overflow-y-scroll">
      <div className="w-full min-h-full flex flex-col"
           style={{minWidth:minWidth}}>
        {/*头部区域*/}
        <MyHeader className={`${headerClassName}`}/>
        {/*内容区域*/}
        <div className="w-full flex-1 flex">
          <Switch>
            {/*数据资源我的数据页面创建数据*/}
            <Route path="/data-resource/my-data/create" component={DataResourceMyDataCreate}/>
            {/*数据资源我的数据页面数据详情页面*/}
            <Route path="/data-resource/my-data/detail/:id" component={DataResourceMyDataDetail}/>
            {/*数据资源我的数据页面*/}
            <Route path="/data-resource/my-data" component={DataResourceMyData}/>
            {/**/}
            {/*数据资源详情页面*/}
            <Route path="/data-resource/detail" component={DataResourceDetail}/>
            {/*数据资源*/}
            <Route path="/data-resource" component={DataResource}/>
            {/*实验编码式环境*/}
            <Route path="/experiment/code/:id" component={Notebook}/>
            {/*实验*/}
            <Route path="/experiment" component={Experiment}/>
            {/*要素加工生产任务创建页面*/}
            <Route path={"/element-processing/production-task/create"} component={ProductionTaskCreate}/>
            {/*要素加工生产任务详情页面*/}
            <Route path={"/element-processing/production-task/detail/:id"} component={ProductionTaskDetail}/>
            {/*要素加工生产任务编辑页面*/}
            <Route path={"/element-processing/production-task/edit/:id"} component={ProductionTaskCreate}/>
            {/*要素加工生产任务*/}
            <Route path={"/element-processing/production-task"} component={ProductionTask}/>
            {/*要素加工详情页面*/}
            <Route path="/element-processing/detail/:id" component={ElementProcessingDetail}/>
            {/*要素加工*/}
            <Route path="/element-processing" component={ElementProcessing}/>
            {/*数据要素离线数据包查看页面*/}
            <Route path="/data-element/offline-packet/detail/:id" component={OfflinePacketDetail}/>
            {/*数据要素离线数据包*/}
            <Route path="/data-element/offline-packet" component={OfflinePacket}/>
            {/*数据要素API服务查看页面*/}
            <Route path={"/data-element/api-serve/detail/:id"} component={ApiServeDetail}/>
            {/*数据要素API服务创建页面*/}
            <Route path={"/data-element/api-serve/create"} component={ApiServeCreate}/>
            {/*数据要素API服务*/}
            <Route path="/data-element/api-serve" component={ApiServe}/>
            {/*data-element*/}
            <Redirect path="/data-element" to="/data-element/offline-packet"/>
            {/*数据市场*/}
            <Route path="/element-market" component={ElementMarket}/>
            {/*模型库详情页面*/}
            <Route path="/model-library/detail/:id" component={ModelLibraryDetail}/>
            {/*模型库*/}
            <Route path="/model-library" component={ModelLibrary}/>
            {/*我的模型创建页面*/}
            <Route path="/my-model/create" component={MyModelCreate}/>
            {/*我的模型详情页面*/}
            <Route path="/my-model/detail/:id" component={MyModelDetail}/>
            {/*我的模型*/}
            <Route path="/my-model" component={MyModel}/>
            {/*个人中心页面*/}
            <Route path="/user-center" component={UserCenter}/>
            {/*首页*/}
            <Route path="/" component={ShouYeIndex}/>
          </Switch>
        </div>
        {/*底部备案区域*/}
        <div className="w-full flex justify-center items-center"
             style={{height:'50px',minHeight:'50px',background:'#F2F2F2'}}>
          <RecordArea/>
        </div>
      </div>
    </div>
  )
}
