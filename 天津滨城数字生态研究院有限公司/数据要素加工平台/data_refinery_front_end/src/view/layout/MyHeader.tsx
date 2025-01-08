import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'
import logoPng from "../../icon/logo2.svg";
import DataResource from './icon/header/DataResource.svg'
import DataResourceLight from './icon/header/DataResourceLight.svg'
import Experiment from './icon/header/Experiment.svg'
import ExperimentLight from './icon/header/ExperimentLight.svg'
import ElementProcessing from './icon/header/ElementProcessing.svg'
import ElementProcessingLight from './icon/header/ElementProcessingLight.svg'
import DataElement from './icon/header/DataElement.svg'
import DataElementLight from './icon/header/DataElementLight.svg'
import ElementMarket from './icon/header/ElementMarket.svg'
import ElementMarketLight from './icon/header/ElementMarketLight.svg'
import ModelLibrary from './icon/header/ModelLibrary.svg'
import ModelLibraryLight from './icon/header/ModelLibraryLight.svg'
import MyModel from './icon/header/MyModel.svg'
import MyModelLight from './icon/header/MyModelLight.svg'
import UserComponent from "./UserComponent";

interface IProps {
  className?: string
}

const menuList = [
  {
    logo:DataResource,
    logoSelected:DataResourceLight,
    name:'数据资源',
    path:'/data-resource',
    textColor: 'text-status-error',
    bgColor: 'bg-status-error',
  },
  {
    logo:Experiment,
    logoSelected:ExperimentLight,
    name:'实验',
    path:'/experiment',
    textColor: 'text-green',
    bgColor: 'bg-green',
  },
  {
    logo:ElementProcessing,
    logoSelected:ElementProcessingLight,
    name:'要素加工',
    path:'/element-processing',
    textColor: 'text-main',
    bgColor: 'bg-main',
  },
  {
    logo:DataElement,
    logoSelected:DataElementLight,
    name:'数据要素',
    path:'/data-element',
    textColor: 'text-orange',
    bgColor: 'bg-orange',
  },
  {
    logo:ElementMarket,
    logoSelected:ElementMarketLight,
    name:'产品市场',
    path:'/element-market',
    textColor: 'text-purple',
    bgColor: 'bg-purple',
  },
  {
    logo:ModelLibrary,
    logoSelected:ModelLibraryLight,
    name:'模型库',
    path:'/model-library',
    textColor: 'text-blue',
    bgColor: 'bg-blue',
  },
  {
    logo:MyModel,
    logoSelected:MyModelLight,
    name:'我的模型',
    path:'/my-model',
    textColor: 'text-header',
    bgColor: 'bg-header',
  },
]

export default function MyHeader(props:IProps) {
  // state
  const {className=''} = props
  // 真正的index
  let [index,setIndex] = useState(-1)
  // 悬浮的index
  let [hoverIndex,setHoverIndex] = useState(-1)
  // 用户信息
  const history = useHistory()
  // mounted
  useEffect(()=>{
    const href = location.href
    let _index = -1;
    for(let i=0;i<menuList.length;i++) {
      if (href.indexOf(menuList[i].path)!==-1) {
        _index = i;
      }
    }
    if (_index !== index) {
      setIndex(_index)
    }
  })
  // methods
  const changeRouteAndIndex = (newIndex) => {
    setIndex(newIndex)
    if (newIndex === -1) {
      history.replace('/')
    } else {
      history.replace(menuList[newIndex].path)
    }
  }

  // render
  return (
    <div className={`w-full bg-white flex justify-between items-center shadow-my-header ${className}`}
         style={{height:'60px',minHeight:'60px'}}>
      {/*左*/}
      <div className={"h-full flex items-center"}>
        {/*左logo*/}
        <img src={logoPng} style={{marginLeft: '17px'}} width="150px" height="37px" alt=''
         className={"hover:cursor-pointer"} onClick={_e=>changeRouteAndIndex(-1)}/>
        {/*中*/}
        <div className="h-full flex" style={{marginLeft:'66px'}}>
          {
            menuList.map((item,_index) => {
              return (
                // 菜单每一项
                <div className={`h-full flex flex-col justify-end items-center
                       ${(_index === index || _index === hoverIndex) ? item.textColor :'text-black'} hover:cursor-pointer`}
                     style={{marginRight:'40px'}}
                     key={_index}
                     onClick={(_e)=>changeRouteAndIndex(_index)}
                     onMouseOver={()=>setHoverIndex(_index)}
                     onMouseOut={()=>setHoverIndex(-1)}>
                  {/*文字和logo*/}
                  <div className="text-sm flex items-center"
                       style={{lineHeight: '14px',paddingBottom:'21px'}}>
                    <img src={(_index === index || _index === hoverIndex)?item.logoSelected:item.logo} alt=""/>
                    <span className="ml-1">{item.name}</span>
                  </div>
                  {/*背景*/}
                  <div className={`w-full ${(_index === index || _index === hoverIndex) ? item.bgColor : 'bg-white'}`}
                       style={{height:'2px', borderRadius: '1px 1px 0px 0px'}}/>
                </div>
              )
            })
          }
        </div>
      </div>
      {/*右*/}
      <div className="mr-11 h-full flex">
        <UserComponent/>
      </div>
    </div>
  )
}
