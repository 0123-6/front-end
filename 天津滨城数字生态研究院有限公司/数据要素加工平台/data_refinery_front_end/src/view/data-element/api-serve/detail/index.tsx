import React, {useEffect, useState} from "react";
import XflowSmall from "../../../../components/xflow-small";
import { useHistory } from 'react-router-dom';
import Title from "../../../../components/Title";
import {message, Popover, Spin, Table, Tooltip} from "antd";
import NavigationComponent from "../../../../components/NavigationComponent";
import ButtonFifth from "../../../../components/ButtonFifth";
import RiskFactor from "../../../../components/RiskFactor";
import titleSvg from '../icon/title.svg'
import StatusCard2 from "../../../../components/StatusCard2";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arduinoLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import copy from 'copy-to-clipboard';
import noData from '../icon/noData.svg'
import DataElement from "../../icon/DataElement.svg";
import DataElementActive from "../../icon/DataElementActive.svg";
import ApiServe from "../../icon/ApiServe.svg";
import ApiServeActive from "../../icon/ApiServeActive.svg";
import {PopoverContent} from "../../common/PopoverContent";
import CopyComponent from "../../../../components/CopyComponent";
import {get, post} from "../../../../axios";
import DataElementApiServeDetailEdit from "./DataElementApiServeDetailEdit";
import DraggableModalPrompt from "../../../../components/draggable-modal/draggable-modal-prompt";

export default function ApiServeDetail(props) {
  // state
  const history = useHistory();
  // 模式，查看or 编辑
  const [mode,setMode] = useState('')
  // 是不是直接编辑
  const [isEdit,setIsEdit] = useState(false)

  const [data,setData] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const [applyReleaseModal,setApplyReleaseModal] = useState(false);
  // const pipelineStatusMap = {
  //   Pending:'运行中',
  //   Failed:'运行失败',
  //   Succeeded:'运行成功',
  //   Running:'运行中',
  //   Stop:'运行停止',
  //   Deleted:'运行删除',
  //   Omitted:'运行忽略'
  // }
  // mounted
  useEffect(()=>{
    console.log('props',props)
    if (props.location.params?.isEdit) {
      setIsEdit(true)
      setMode('编辑')
    } else {
      setMode('查看')
    }
    getData()
    return ()=>{
      setMode('查看')
    }
  },[])
  // method
  const getData = async () => {
    const params = {
      id: Number(props.match.params.id),
    }
    setIsLoading(true)
    const res = await get('/drapi/apidr/drs/' + params.id)
    setData(res.data)
    setIsLoading(false)

    // setTimeout(()=>{
    //   // 定义一个随机数，范围是0到statusList.length-1
    //   const i = Math.floor(Math.random() * statusList.length)
    //   const resultData = {
    //     riskFactor: Math.floor(Math.random()*9)+1,
    //     pipeline: {
    //       id: 1,
    //       name: '流程-企业发展力指数计算',
    //       content:JSON.parse(JSON.stringify(content))
    //     },
    //     // 请求示例
    //     request_example: 'const search = () => {\n' +
    //       '    console.log(\'into search method\')\n' +
    //       '    let params = {\n' +
    //       '      page_num:pageNum.current,\n' +
    //       '      page_size:pageSize.current,\n' +
    //       '      type:type.current===\'全部\'?null:type.current===\'拖拽式\'?1:2,\n' +
    //       '      filter_name:keyword.current,\n' +
    //       '    }\n' +
    //       '    setLoading(true)\n' +
    //       '    getExperimentList(params).then(res => {\n' +
    //       '      const data = res.data\n' +
    //       '      setData(data.list)\n' +
    //       '      setPageSum(data.total_num)\n' +
    //       '      setLoading(false)\n' +
    //       '      if(first) {\n' +
    //       '        setFirst(false)\n' +
    //       '      }\n' +
    //       '    }).catch(err => {\n' +
    //       '      console.log(err)\n' +
    //       '      setLoading(false)\n' +
    //       '      if(first) {\n' +
    //       '        setFirst(false)\n' +
    //       '      }\n' +
    //       '    })\n' +
    //       '  }',
    //     // 返回示例
    //     response_example: '{\n' +
    //       '  "id": 17,\n' +
    //       '  "user_id": 1,\n' +
    //       '  "name": "作图",\n' +
    //       '  "description": "作图\\n",\n' +
    //       '  "status": 1,\n' +
    //       '  "type": 1,\n' +
    //       '  "node_num": 2,\n' +
    //       '  "created_at": "2023-04-07 17:06:19",\n' +
    //       '  "updated_at": "2023-04-14 17:23:34"\n' +
    //       '}',
    //   }
    // },200)

  }
  // 改变模式
  const changeMode = (_mode) => {
    setMode(_mode)
  }
  // 改变数据
  const changeData = (_data) => {
    if (_data){
      setData(_data)
    }else{
      getData()
    }
  }
  // @ts-ignore
  const goBack = () => {
    history.goBack()
  }
  // 跳转到生产任务详情
  // @ts-ignore
  const goProductionTaskDetail = () => {
    window.open(location.origin+'/element-processing/production-task/detail/'+data.pipeline_task_id
    )
  }
  // 申请发布弹框
  const applyReleaseModalOnOk = async () => {
    setApplyReleaseModal(false)
    setIsLoading(true)
    await post('/drapi/apidr/audit/' + data.id, null)
    setIsLoading(false)
    message.success('申请发布成功')
    getData()
  }
  const applyReleaseModalOnCancel = () => {
    console.log('into applyReleaseModalOnCancel')
    setApplyReleaseModal(false);
  }
  const goElementProcessingDetail = () => {
    window.open(location.origin+`/element-processing/detail/${data?.pipeline?.id}`)
  }
  // 点击复制按钮
  const clickCopy = (_message) => {
    copy(_message)
    message.success('复制成功')
  }
  // 查看页面
  // 编辑页面
  const DataElementApiServeDetailEditOnOk:(_data:object)=>void = (_data) => {
    if (isEdit) {
      history.goBack()
    } else {
      changeData(_data)
      changeMode('查看')
    }
  }
  const DataElementApiServeDetailEditOnCancel = () => {
    if (isEdit) {
      history.goBack()
    } else {
      changeMode('查看')
    }
  }
  // render
  return (
    // 最外层
    <div className="w-full flex flex-col items-center bg">
      <NavigationComponent data={[
        {label:'数据要素',router:'/data-element/offline-packet',icon:DataElement,iconActive:DataElementActive},
        {label:'API服务',router:'/data-element/api-serve',icon:ApiServe,iconActive:ApiServeActive},
        {label:'查看',disabled:true},
      ]}/>
      {/*主体内容*/}
      <div className="mb-6 flex flex-col bg-white  shadow-card rounded"
           style={{width: '960px'}}>
        <Spin spinning={isLoading} size="large" tip="加载中...">
          {
            <div className={`w-full pl-8 pr-8 pb-32 pt-6  flex flex-col ${mode === '查看'?'':'hidden'}`}>
              <div className={"w-full flex justify-between items-center"}>
                {/*左*/}
                <div className={"flex items-center"}>
                  <img src={titleSvg} alt=""/>
                  <div className={"ml-1.5 text-lg text-black-dark font-medium"}>
                    {data?.name}
                  </div>
                  <div className={"ml-3 flex items-center"}>
                    {
                      data?.status_desc==='已驳回' &&
                      <Tooltip title={'静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容'}
                               overlayClassName={'tooltip-yi-bo-hui'}>
                        <div className={"flex items-center"}>
                          <StatusCard2 status={data?.status_desc} style={{height:'24px',border:'unset'}}/>
                        </div>
                      </Tooltip>
                    }
                    {
                      data?.status_desc!=='已驳回' &&
                      <StatusCard2 status={data?.status_desc} style={{height:'24px',border:'unset'}}/>
                    }
                  </div>
                </div>
                {/*右*/}
                <div className={"flex items-center"}>
                  <ButtonFifth style={{width:'79px',height:'24px'}}
                               className={''}
                               disabled={data?.status_desc==='待审核' || data?.status_desc==='已上线' || data?.status_desc==='部署中'}
                               text={'申请发布'}
                               click={()=>setApplyReleaseModal(true)}/>
                  <ButtonFifth style={{width:'79px',height:'24px'}}
                               className={'ml-2'}
                               disabled={data?.status_desc==='待审核' || data?.status_desc==='已上线' || data?.status_desc==='部署中'}
                               text={'编辑'}
                               click={()=>setMode('编辑')}/>
                </div>
              </div>
              {/*基本信息*/}
              <div className={"mt-3 w-full flex items-center"}>
                {/*用户信息*/}
                <div className={"flex"} style={{width:'128px',}}>
                  <Popover title={null}
                           placement="leftTop"
                           overlayClassName={'person-popover-2'}
                           trigger="hover"
                           content={PopoverContent({user:data?.user})}
                  >
                    <div className={"flex"}
                         style={{height:'28px'}}>
                      {/*头像*/}
                      <div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
                           style={{width:'28px',minWidth:'28px',height:'28px'}}>
                        <img className="" src={(data?.user?.avatar)?(data?.user?.avatar):null} alt="" style={{width:'100%',height:'100%'}}/>
                      </div>
                      {/*姓名*/}
                      <div className={"ml-2 h-full flex items-center"}>
                        <span className={"flex items-center text-hidden"}><span>{(data?.user?.nickname)?(data?.user?.nickname):'静态内容'}</span></span>
                      </div>
                    </div>
                  </Popover>
                </div>
                <div className={"ml-2 flex"} style={{width:'250px'}}>申请时间： <span>-</span></div>
                <div className={"flex"} style={{width:'250px'}}>生成时间： <span>{data?.created_at}</span></div>
                <div className={"flex"} style={{width:'250px'}}>反馈时间： <span>-</span></div>
              </div>
              <div className={"mt-2 w-full flex leading-[25px]"}>
                {data?.description}
              </div>
              {/*资源配置*/}
              <div className={"mt-4 w-full flex flex-col"}>
                {/*title*/}
                <Title title='资源配置'/>
                <div className={"mt-2.5 flex items-center text-sm"}>
                  {data?.config?.cpu}核(vCPU)  {data?.config?.gpu}GiB
                </div>
              </div>
              {/*加工流程*/}
              <div className={"mt-7 w-full flex flex-col"}>
                {/*title*/}
                <Title title='加工流程'/>
                <div className={"flex items-center pt-2"}>
                  <span className={"flex items-center hover:text-main cursor-pointer"}
                        onClick={goElementProcessingDetail}>{data?.pipeline?.name}</span>
                </div>
                {/*xflow*/}
                <div className={"mt-2 w-full flex border border-white-divide"}
                     style={{height:'149px',minHeight:'149px'}}>
                  <XflowSmall content={data?.pipeline?.content} type='row'/>
                </div>
              </div>
              {/*风险系数*/}
              <RiskFactor className={'mt-6'} num={data?.riskFactor}/>
              {/*API接口*/}
              {
                data?.status_desc==='已上线' &&
                <div className={"mt-6 w-full flex flex-col text-sm"}>
                  {/*title*/}
                  <Title title='API接口'/>
                  <div className={"mt-3 w-full flex items-center"}>接口地址：{data?.api_info?.url}</div>
                  <div className={"mt-3 w-full flex items-center"}>请求格式：{data?.api_info?.content_type}</div>
                  <div className={"mt-3 w-full flex items-center"}>请求方式：{data?.api_info?.method}</div>
                  <div className={"mt-3 w-full flex items-center"}>接口备注：{data?.api_info?.remark ? data?.api_info?.remark : '—'}</div>
                  {/*请求参数说明*/}
                  <div className={"text-black-dark leading-[14px] font-medium"}
                       style={{marginTop:'22px'}}>
                    请求参数说明
                  </div>
                  <Table
                    columns={[
                      {
                        title: '名称',
                        dataIndex: 'name',
                        key: 'name',
                        width: '15%',
                      },
                      {
                        title: '类型',
                        dataIndex: 'type',
                        key: 'type',
                        width: '15%',
                      },
                      {
                        title: '必填',
                        dataIndex: 'is_required',
                        key: 'is_required',
                        width: '10%',
                      },
                      {
                        title: '说明',
                        dataIndex: 'remark',
                        key: 'remark',
                        width: '60%',
                      },
                    ]}
                    dataSource={data?.api_info?.queries ? data?.api_info?.queries.map(item=>({...item,is_required:item.is_required+''})) : []}
                    pagination={false}
                    className={"mt-2"}
                    size='small'/>
                  {/*请求示例*/}
                  <div className={"text-black-dark leading-[14px] font-medium"}
                       style={{marginTop:'22px'}}>
                    请求示例
                  </div>
                  <div className={"mt-2.5 w-full flex flex-col rounded pt-1 pb-2 pl-5 pr-5 relative group/one"}
                       style={{background: 'rgba(148,198,203,0.04)',}}>
                    <SyntaxHighlighter language="javascript" style={{
                      ...arduinoLight,
                      hljs:{
                        ...arduinoLight.hljs,
                        background: 'unset',
                      }
                    }}>
                      {data?.api_info?.query_example}
                    </SyntaxHighlighter>
                    {/*复制按钮*/}
                    <div className={"hidden group-hover/one:flex absolute top-3 right-11"}>
                      <CopyComponent click={()=>clickCopy(data?.api_info?.query_example)}/>
                    </div>
                  </div>
                  {/*返回示例*/}
                  <div className={"text-black-dark leading-[14px] font-medium"}
                       style={{marginTop:'22px'}}>
                    返回示例
                  </div>
                  <div className={"mt-2.5 w-full flex flex-col rounded pt-1 pb-2 pl-5 pr-5 relative group/one"}
                       style={{background: 'rgba(148,198,203,0.04)',}}>
                    <SyntaxHighlighter language="javascript" style={{
                      ...arduinoLight,
                      hljs:{
                        ...arduinoLight.hljs,
                        background: 'unset',
                      }
                    }} showLineNumbers>
                      {data?.api_info?.response_example}
                    </SyntaxHighlighter>
                    {/*复制按钮*/}
                    <div className={"hidden group-hover/one:flex absolute top-3 right-11"}>
                      <CopyComponent click={()=>clickCopy(data?.api_info?.response_example)}/>
                    </div>
                  </div>
                </div>
              }
              {
                data?.status_desc!=='已上线' &&
                <div className={"mt-6 w-full flex flex-col text-sm"}>
                  {/*title*/}
                  <Title title='API接口'/>
                  <div className="w-full flex flex-col justify-center items-center"
                       style={{height:'260px'}}>
                    <img src={noData} alt=""/>
                    <div className="mt-3 flex text-xs text-black-light">暂无API接口信息</div>
                  </div>
                </div>
              }
            </div>
          }
          {
            mode === '编辑' && <DataElementApiServeDetailEdit data={data}
                                                              onOk={DataElementApiServeDetailEditOnOk}
                                                              onCancel={DataElementApiServeDetailEditOnCancel}/>
          }
        </Spin>
      </div>
      {/*申请弹框*/}
      <DraggableModalPrompt
        show={applyReleaseModal}
        onOk={applyReleaseModalOnOk}
        onCancel={applyReleaseModalOnCancel}>
        <span className="text-sm text-black">确定申请发布<span className="text-main pl-1 pr-1">{data?.name}</span>吗？</span>
      </DraggableModalPrompt>
    </div>
  )
}
