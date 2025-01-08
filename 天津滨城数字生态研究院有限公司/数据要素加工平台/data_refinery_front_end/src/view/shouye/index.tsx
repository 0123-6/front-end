import React from "react";
import Banner from '../../icon/shouye/banner.jpg'
import img0 from './icon2/1.svg'
import img1 from './icon2/2.svg'
import img2 from './icon2/3.svg'
import img3 from './icon2/4.svg'
import img4 from './icon2/5.svg'
import img5 from './icon2/6.svg'
import bg from './icon/bg.png'


export default function ShouYeIndex() {
  return (
    // 最外层
    <div className="w-full flex flex-col items-center">
      {/*头部*/}
      <div className={"w-full flex justify-center bg-cover bg-center"}
           style={{height:'347px',backgroundImage:`url(${Banner})`}}>
        <div className={"flex flex-col text-white"} style={{width:'1027px'}}>
          <div className={"w-full flex justify-center font-medium"}
               style={{marginTop:'104px',fontSize:'32px'}}>
            DataRefinery 数据要素加工平台
          </div>
          <div className={"flex mt-6 text-base"} style={{lineHeight:'26px'}}>
            DataRefinery是一站式数据要素加工平台。基于业界领先的模型数据泄露风险评估引擎，提供拖拽式的超低门槛要素加工方式。支持表格、图像、文本、语音和视频等多种数据资源的加工。充分挖掘数据价值，实现“数据可用不可见”。数据要素加工全流程操作可审计、数据可追溯。
          </div>
        </div>
      </div>
      {/*主体内容*/}
      <div className="w-full flex flex-col">
        {/*0*/}
        <div className={"w-full flex justify-center"}
             style={{background:'#ffffff'}}>
          <div className={"w-[1110px] flex justify-center"}
               style={{marginTop:'85px'}}>
            <img src={img0}/>
          </div>
        </div>
        {/*1*/}
        <div className={"w-full flex justify-center"}
             style={{backgroundImage:`url(${bg})`}}>
          <div className={"w-[1110px] flex justify-between items-center"} style={{marginTop:'85px'}}>
            <div className={"flex flex-col"}
                 style={{width:'430px'}}>
              <div className={"text-black-dark font-semibold"} style={{fontSize:'24px'}}>超低门槛要素加工</div>
              <div className={"mt-4 text-base"} style={{lineHeight:'28px'}}>基于海量AI模型，通过拖拽和点选操作即可进行数据要素加工，大大降低了数据要素加工的门槛。</div>
            </div>
            <img src={img1} alt=""/>
          </div>
        </div>
        {/*2*/}
        <div className={"w-full flex justify-center"}>
          <div className={"w-[1110px] flex justify-between items-center"} style={{marginTop:'85px'}}>
            <img src={img2} alt=""/>
            <div className={"flex flex-col"}
                 style={{width:'430px'}}>
              <div className={"text-black-dark font-semibold"} style={{fontSize:'24px'}}>全类型数据支持</div>
              <div className={"mt-4 text-base"} style={{lineHeight:'28px'}}>支持表格、图像、文本、语音和视频等多种数据资源的加工。AI知识数据库管理统一管理非结构化数据要素。拓展了数据要素类型，最大限度挖掘数据价值。</div>
            </div>
          </div>
        </div>
        {/*3*/}
        <div className={"w-full flex justify-center"}
             style={{backgroundImage:`url(${bg})`}}>
          <div className={"w-[1110px] flex justify-between items-center"} style={{marginTop:'15px'}}>
            <div className={"flex flex-col"}
                 style={{width:'430px'}}>
              <div className={"text-black-dark font-semibold"} style={{fontSize:'24px'}}>“数据可用不可见”</div>
              <div className={"mt-4 text-base"} style={{lineHeight:'28px'}}>实现数据要素实验区和生产区相隔离。实验区基于样例数据资源调试生产流程，生产区使用生产流程和生产数据，进行数据要素生产。</div>
            </div>
            <img src={img3} alt=""/>
          </div>
        </div>
        {/*4*/}
        <div className={"w-full flex justify-center"}>
          <div className={"w-[1110px] flex justify-between items-center"} style={{marginTop:'80px'}}>
            <img src={img4} alt="" style={{position: 'relative',left: '-98px'}}/>
            <div className={"flex flex-col"}
                 style={{position: 'relative',left: '-140px'}}>
              <div className={"text-black-dark font-semibold"} style={{fontSize:'24px',width:'482px'}}>数据要素加工全流程操作可审计、数据可溯源</div>
              <div className={"mt-4 text-base"} style={{lineHeight:'28px',width:'430px'}}>对数据要素生成的操作流程、AI模型和生产任务实行全面监管。数据要素使用的数据资源、加工者、模型提供者和加工流程以及运行环境均进行完整追踪。</div>
            </div>
          </div>
        </div>
        {/*5*/}
        <div className={"w-full flex justify-center"}
             style={{backgroundImage:`url(${bg})`}}>
          <div className={"w-[1110px] flex justify-between items-center"}
               style={{marginTop:'15px',marginBottom:'65px'}}>
            <div className={"flex flex-col"}
                 style={{width:'430px'}}>
              <div className={"text-black-dark font-semibold"} style={{fontSize:'24px'}}>业界领先的模型风险评估引擎</div>
              <div className={"mt-4 text-base"} style={{lineHeight:'28px'}}>将AI模型作为数据要素加工的基本单元，提供模型上线审核、效果评估、模型监控、模型服务功能。基于业界领先的模型风险评估技术，有效识别数据重构风险，保障数据要素本质安全。</div>
            </div>
            <img src={img5} alt=""/>
          </div>
        </div>
      </div>
    </div>
  )
}
