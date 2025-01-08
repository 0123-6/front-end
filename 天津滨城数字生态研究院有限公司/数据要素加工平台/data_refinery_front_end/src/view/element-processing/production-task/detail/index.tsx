import React, {useEffect, useRef, useState} from "react";
import {get, post} from "../../../../axios";
import XflowSmall from "../../../../components/xflow-small";
import Title from "../../../../components/Title";
import NavigationComponent from "../../../../components/NavigationComponent";
import {Form, Input, message, Select, Spin, Table} from "antd";
import StatusShow from "../components/StatusShow";
// @ts-ignore
import FiledCard from "../../../../components/FiledCard";
import titleSvg from '../icon/title.svg'
import ButtonFifth from "../../../../components/ButtonFifth";

import DataType from "../../detail/components/DataType";
import modelSvg from '../icon/model.svg'
import img1 from '../icon/离线数据包.svg'
import StopModal from "../components/StopModal";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import {handleKeyDownDisabled} from "../../../../utils/util";
import {CloseCircleFilled} from "@ant-design/icons";
import {applicationFieldList} from "../../../data-element/common";
import SelectProcessingModal from "../create/components/SelectProcessingModal";
import SelectDataResourceModal from "../create/components/SelectDataResourceModal";
import RiskFactor from "../../../../components/RiskFactor";
import ElementProcessing from "../../icon/ElementProcessing.svg";
import ElementProcessingActive from "../../icon/ElementProcessingActive.svg";
import ProductionTask from '../../icon/ProductionTask.svg'
import ProductionTaskActive from '../../icon/ProductionTaskActive.svg'

export default function ProductionTaskDetail(props) {
  // state
  // const pipelineStatusMap = {
  //   Pending:'运行中',
  //   Failed:'运行失败',
  //   Succeeded:'运行成功',
  //   Running:'运行中',
  //   Stop:'运行停止',
  //   Deleted:'运行删除',
  //   Omitted:'运行忽略'
  // }
  console.log('into ProductionTaskDetail,props: ',props)
  // const history = useHistory();
  const [form] = Form.useForm();
  const [data,setData] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  // 模式，查看or 编辑
  // @ts-ignore
  const [mode,setMode] = useState('查看')
  console.log(data)
  // 轮询
  const timer = useRef(null)
  // 弹框
  const [stopModal,setStopModal] = useState(false);
  // 编辑页面
  // 加工流程
  const [selectProcessing,setSelectProcessing] = useState(null)
  const [selectProcessingModal,setSelectProcessingModal] = useState(false);
  // 数据资源
  const [selectDataResource, setSelectDataResource] = useState(null)
  const [selectDataResourceModal, setSelectDataResourceModal] = useState(false);

  // 数据要素类型
  // @ts-ignore
  const [dr_type,setDr_type] = useState('offline_data_packet')
  // mounted
  useEffect(()=>{
    getDetail()
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  },[])
  useEffect(()=>{
    if(mode==='编辑'){
      form.setFieldsValue(data)
      setSelectProcessing({
        name:data.pipeline_name,
        id:data.pipeline_id
      })
      setSelectDataResource({
        id: data?.dataset?.id,
        title: data?.dataset?.title,
        address: data?.dataset?.address,
      })
      setDr_type(data.dr_type)
    }
  },[mode])
  // methods
  const getDetail = () => {
    const params = {
      id: Number(props.match.params.id),
    }
    setIsLoading(true)
    get('/drapi/kfp/pipeline/task/detail',params).then(res => {
      console.log(res)
      for(let i=0;i<res.data.content.nodes.length;i++) {
        res.data.content.nodes[i].ports = undefined
      }
      setData(res.data)
      setIsLoading(false)
      // 如果结果没有运行中的，则删除计时器
      if (res.data.status_desc!=='运行中') {
        clearTimeout(timer.current)
      }
    })
  }
  const goElementProcessingDetail = () => {
    window.open(location.origin+`/element-processing/detail/${data?.pipeline_id}`)
  }
  const goDataElement = () => {
    if (data?.dr_id) {
      window.open(location.origin+`/data-element/offline-packet/detail/${data?.dr_id}`)
    }
  }
  // 弹框方法
  const stopModalOnOk = () => {
    const params = {
      id: data.id,
      pipeline_task_id:data.id,
    }
    post('/drapi/kfp/pipeline/task/stop',params).then(res => {
      console.log(res)
      message.success('停止成功')
      getDetail()
      setStopModal(false)
      if (timer.current) {
        clearTimeout(timer.current)
      }
    })
  }
  const stopModalOnCancel = () => {
    setStopModal(false)
  }
  // const goBack = () => {
  //   if (history.length > 1) {
  //     history.goBack()
  //   } else {
  //     history.push('/element-processing/production-task')
  //   }
  // }
  // 点击运行
  const clickRun = () => {
    const params = {
      id: data.id,
      pipeline_task_id:data.id
    }
    post('/drapi/kfp/pipeline/task/run/v2',params).then(res => {
      console.log(res)
      message.success('运行成功')
      timer.current = setInterval(()=>{
        getDetail()
      },5000)
      getDetail()
    })
  }
  // 编辑页面
  const clickEditOk = async () => {
    if (!selectProcessing) {
      message.warn("请先选择加工流程")
      return
    }
    if (!selectDataResource) {
      message.warn("请先选择数据资源")
      return
    }
    const nowValue = form.getFieldsValue(true)
    const params = {
      ...nowValue,
      "pipeline_id": selectProcessing?.id,
      dataset_id: selectDataResource?.id,
      dataset_url: selectDataResource?.address,
      "dr_type": 'offline_data_packet',
    }
    await post('/drapi/kfp/pipeline/task/save', params)
    message.success(`编辑生产任务成功`)
    setData(params)
    setMode('查看')
  }
  // 选择加工流程
  // 点击选择加工流程按钮
  const clickSelectProcessing = (e) => {
    e.preventDefault()
    setSelectProcessingModal(true)
  }
  const selectProcessingModalOnOk = (data) => {
    console.log('into selectProcessingModalOnOk,data=',data)
    setSelectProcessing(data)
    setSelectProcessingModal(false)
    form.setFieldValue('name',data.name)
    form.setFieldValue('description',data.description)
    form.validateFields(['name','description'])
  }
  const selectProcessingModalOnCancel = () => {
    console.log('into selectProcessingModalOnCancel')
    setSelectProcessingModal(false)
  }
  // 删除选择的加工流程
  const delelteSelectProcessing = () => {
    setSelectProcessing(null)
  }
  const clickEditCancel = (e) => {
    e.preventDefault()
    setMode('查看')
  }

  // 选择数据源
  const clickSelectDataResourceModal = (e) => {
    e.preventDefault()
    setSelectDataResourceModal(true)
  }
  const selectDataResourceModalOnOk = (data) => {
    console.log('into selectDataResourceModalOnOk: ',data)
    setSelectDataResource(data)
    setSelectDataResourceModal(false)
  }
  const selectDataResourceModalOnCancel = () => {
    console.log('into selectDataResourceModalOnCancel')
    setSelectDataResourceModal(false)
  }
  const delelteSelectDataResource = () => {
    setSelectDataResource(null)
  }

  return (
    // 最外层
    <div className="w-full flex flex-col items-center bg">
      <NavigationComponent data={[
        {label:'要素加工',router:'/element-processing',icon:ElementProcessing,iconActive:ElementProcessingActive},
        {label:'生产任务',router:'/element-processing/production-task',icon:ProductionTask,iconActive:ProductionTaskActive},
        {label:mode,disabled:true},
      ]}/>
      {/*主体内容*/}
      <div className="pb-6 flex flex-col bg-white pt-6 pl-8 pr-8 pb-32 mb-16 shadow-card rounded"
           style={{width: '960px'}}>
        <Spin spinning={isLoading} size="large" tip="加载中...">
          {/*查看*/}
          {
            <div className={"w-full flex flex-col"}
                 style={{display:mode === '查看'?'flex':'none'}}>
              <div className={"flex justify-between items-center"}>
                {/*name*/}
                <div className={"flex items-center"}>
                  <img src={titleSvg} alt=""/>
                  <div className={"ml-2 text-lg text-black-dark font-medium"}>
                    {data?.name}
                  </div>
                  <div className={"ml-4 flex items-center"}>
                    <StatusShow status={data?.status_desc}/>
                  </div>
                </div>
                {/*右*/}
                <div className={"flex items-center"}>
                  {
                    data?.status_desc !== '运行中' &&
                    <ButtonFifth style={{width:'79px',height:'24px'}}
                                 className={''}
                                 disabled={!(data?.status_desc!=='运行中' && data?.status_desc!=='运行成功')}
                                 text={'运行'}
                                 click={clickRun}/>
                  }
                  {
                    data?.status_desc === '运行中' &&
                    <ButtonFifth style={{width:'79px',height:'24px'}}
                                 className={''}
                                 disabled={false}
                                 text={'停止'}
                                 click={()=>setStopModal(true)}/>
                  }
                  <ButtonFifth style={{width:'79px',height:'24px'}}
                               className={'ml-2'}
                               disabled={data?.status_desc==='运行中'||data?.status_desc==='运行成功'}
                               text={'编辑'}
                               click={()=>setMode('编辑')}/>
                </div>
              </div>
              {/*基本信息*/}
              <div className={"mt-3 w-full flex flex-col"}>
                {/*状态*/}
                <div className={"w-full flex items-center text-sm text-black"}
                     style={{lineHeight:'14px'}}>
                  {/*开始时间*/}
                  <div className={"w-1/3 flex items-center"}>开始时间：{data && data.started_at ? data.started_at : '-'}</div>
                  {/*结束时间*/}
                  <div className={"w-1/3 flex items-center"}>结束时间: {data && data.finished_at ? data.finished_at : '-'} </div>
                  {/*运行时间*/}
                  <div className={"w-1/3 flex items-center"}>运行时间: {data && data.run_time ? data.run_time : '-'} </div>
                </div>
                {/*内容*/}
                <div className={"mt-2 w-full flex text-sm text-black"}
                     style={{lineHeight:'25px'}}>{data?.description}</div>
              </div>
              {/*加工流程*/}
              <div className={"mt-5 w-full flex flex-col"}>
                {/*title*/}
                <Title title='加工流程'/>
                <div className={"flex items-center pt-2 pb-2"}>
                  <span className={"flex items-center hover:text-main cursor-pointer"}
                        onClick={goElementProcessingDetail}>{data?.pipeline_name}</span>
                </div>
                {/*内容*/}
                <div className={"mt-1.5 w-full flex"}
                     style={{height:'149px',border:'1px solid #f5f6f7'}}>
                  <XflowSmall content={data?.content} type='row'/>
                </div>
              </div>
              {/*风险系数*/}
              <RiskFactor className={'mt-6'}/>
              {/*输入信息*/}
              <div className={"mt-6 w-full flex flex-col"}>
                {/*title*/}
                <Title title='输入信息'/>
                {/*内容*/}
                <div className={"mt-2.5 w-full flex flex-col"} style={{lineHeight:'14px'}}>
                  <span className={"flex items-center"}>静态内容-企业经营信息</span>
                  {
                    true &&
                    <div className={"mt-2.5 w-full flex items-center"}>
                      <DataType type={'表格'} style={{height:'26px',borderRadius:'16px'}}/>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        22.15MB
                      </div>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        字段:10
                      </div>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        样本:100000
                      </div>
                    </div>
                  }
                  {
                    false &&
                    <div className={"mt-2.5 w-full flex items-center"}>
                      <DataType type={'图片'} style={{height:'26px',borderRadius:'16px'}}/>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        样本:20
                      </div>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        5.00MB
                      </div>
                    </div>
                  }
                  {
                    false &&
                    <div className={"mt-2.5 w-full flex items-center"}>
                      <DataType type={'音频'} style={{height:'26px',borderRadius:'16px'}}/>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        样本:20
                      </div>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        5.00MB
                      </div>
                    </div>
                  }
                  {
                    false &&
                    <div className={"mt-2.5 w-full flex items-center"}>
                      <DataType type={'文本'} style={{height:'26px',borderRadius:'16px'}}/>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        样本:20
                      </div>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        5.00MB
                      </div>
                    </div>
                  }
                  {
                    false &&
                    <div className={"mt-2.5 w-full flex items-center"}>
                      <DataType type={'视频'} style={{height:'26px',borderRadius:'16px'}}/>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        样本:20
                      </div>
                      <div className={"ml-2 rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                           style={{width:'90px',height:'26px',background: 'rgba(206,220,222,0.24)'}}>
                        5.00MB
                      </div>
                    </div>
                  }

                  <Table columns={[
                    {
                      title: '字段名称',
                      dataIndex: 'name',
                      key: 'name',
                      width: '20%',
                    },
                    {
                      title: '字段类型',
                      dataIndex: 'type',
                      key: 'type',
                      width: '20%',
                    },
                    {
                      title: '字段说明',
                      dataIndex: 'description',
                      key: 'description',
                      width: '60%',
                    },
                  ]}
                         dataSource={[
                           {
                             key: '0',
                             name: '企业ID',
                             type: '整型',
                             description: '',
                           },
                           {
                             key: '1',
                             name: '注册资金',
                             type: '浮点型',
                             description: '',
                           },
                           {
                             key: '2',
                             name: '员工数量',
                             type: '整型',
                             description: '',
                           },
                           {
                             key: '3',
                             name: '资产总额',
                             type: '浮点型',
                             description: '',
                           },
                           {
                             key: '4',
                             name: '负债总额',
                             type: '浮点型',
                             description: '',
                           },
                           {
                             key: '5',
                             name: '营业总收入',
                             type: '浮点型',
                             description: '',
                           }
                         ]}
                         pagination={false}
                         className={"mt-2"}
                         size='small'/>
                  {/*简介*/}
                  <div className={"mt-1 text-sm leading-[25px]"}>
                    静态内容-不能出现缺失值的列：企业ID、注册资金、资产总额、负债总额、 营业总收入、利润总额。
                  </div>
                </div>
              </div>
              {/*输出信息*/}
              <div className={"mt-6 w-full flex flex-col"}>
                {/*title*/}
                <Title title='输出信息'/>
                <div className={`mt-2.5 flex items-center ${data?.dr_id?'cursor-pointer hover:text-main':''}`}
                     onClick={goDataElement}>
                  {
                    data?.dr_id &&
                    <img src={modelSvg} alt="" style={{width:'23px',height:'23px'}}/>
                  }
                  <span className={"flex items-center text-sm leading-[14px]"}>{data?.dr_name}</span>
                </div>
                {/*内容*/}
                <div className={"w-full flex flex-col"}>
                  <div className={"mt-2 w-full flex items-center"}  style={{lineHeight:'14px'}}>
                    <div className={"rounded-2xl text-xs leading-[12px] flex justify-center items-center"}
                         style={{width:'120px',height:'22px',background: 'rgba(206,220,222,0.24)'}}>
                      <img src={img1} alt="" style={{width:'14px',height:'14px'}}/>
                      <span className={"ml-1 flex items-center"}>{data?.dr_type==='offline_data_packet'?'离线数据包':'' }</span>
                    </div>
                    <DataType type={'表格'} style={{height:'22px',borderRadius:'16px',background: 'rgba(206,220,222,0.36)',marginLeft:'8px'}}/>
                  </div>
                  {/*<div className={"mt-2 w-full flex items-center"}>*/}
                  {/*  <span className={"flex items-center"}>应用领域： </span>*/}
                  {/*  {*/}
                  {/*    Array.isArray(data?.dr_application_field) &&*/}
                  {/*    <div className={"flex items-center"}>*/}
                  {/*      {*/}
                  {/*        data?.dr_application_field.map((_item,_index) => {*/}
                  {/*          return (*/}
                  {/*            <FiledCard data={_item}/>*/}
                  {/*          )*/}
                  {/*        })*/}
                  {/*      }*/}
                  {/*    </div>*/}
                  {/*  }*/}
                  {/*  {*/}
                  {/*    !Array.isArray(data?.dr_application_field) &&*/}
                  {/*    <span className={"flex items-center"}>{data?.dr_application_field}</span>*/}
                  {/*  }*/}
                  {/*</div>*/}
                  <div className={"mt-2.5 w-full flex flex-col"} style={{lineHeight:'25px'}}>
                    {data?.dr_description}
                  </div>
                </div>
              </div>
            </div>
          }
          {/*编辑*/}
          {
            mode==='编辑' &&
            <div className={"w-full flex flex-col label-width-136"}>
              <Form form={form}
                    onFinish={clickEditOk}
                    onKeyDown={handleKeyDownDisabled}>
                <div className={"flex flex-col"}
                     style={{width:'866px'}}>
                  {/*操作按钮*/}
                  <div className={"w-full flex justify-end items-center"}>
                    <ButtonSecond style={{width:'86px',height:'28px',lineHeight:'14px'}}
                                  text={'取消'}
                                  click={(e)=>clickEditCancel(e)}/>
                    <ButtonMain className="ml-2"
                                style={{width:'86px',height:'28px',lineHeight:'14px'}}
                                text={'保存'}
                                click={null}/>
                  </div>
                  {/*基本信息*/}
                  <div className={"w-full flex flex-col"}>
                    {/*名称*/}
                    <Form.Item
                      style={{marginTop:'8px'}}
                      className={'label-height-38'}
                      label="名称"
                      name="name"
                      rules={[{ required: true, message: '请输入名称' }]}
                    >
                      <Input style={{height:'38px'}} placeholder={"请输入名称"} autoComplete={"off"}/>
                    </Form.Item>
                    {/*简介*/}
                    <Form.Item
                      label="简介"
                      name="description"
                      className={'label-height-38'}
                      rules={[{ required: true, message: '请输入简介' }]}
                    >
                      <Input.TextArea style={{height:'90px'}} showCount maxLength={500}
                                      autoComplete={"off"}
                                      onKeyDown={e => e.stopPropagation()}
                                      placeholder={'请输入简介'}/>
                    </Form.Item>
                  </div>
                  {/*选择加工流程*/}
                  <div className={"w-full flex flex-col"}>
                    {/*加工流程*/}
                    <div className={"w-full flex items-center"}
                         style={{height:'38px'}}>
                      {/*左*/}
                      <div className={"flex justify-end items-center text-sm text-black"}
                           style={{width:'120px'}}>
                        <span className={"text-red"}>*</span>加工流程
                      </div>
                      {/*右*/}
                      <div className={"ml-4 h-full flex items-center"}
                           style={{}}>
                        {
                          !selectProcessing &&
                          <ButtonSecond style={{width:'187px',height:'38px',lineHeight:'14px'}}
                                        text={'+选择加工流程'}
                                        click={_e=>clickSelectProcessing(_e)}/>
                        }
                        {
                          selectProcessing &&
                          <div className={"h-full flex items-center pl-4 pr-4"}
                               style={{borderRadius:'2px',background:'#F0F2F5'}}>
                            <span className={"flex items-center text-sm"} style={{color:'#919399'}}>{selectProcessing.name}</span>
                            <CloseCircleFilled style={{color: '#C0C4CC',width:'10px',height:'10px'}} className={"ml-2 flex items-center"} onClick={delelteSelectProcessing}/>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  {/*数据资源*/}
                  <div className={"mt-4 w-full flex items-center"}
                       style={{height: '38px'}}>
                    {/*左*/}
                    <div className={"flex justify-end items-center text-sm text-black"}
                         style={{width: '120px'}}>
                      <span className={"text-red"}>*</span>数据资源
                    </div>
                    {/*右*/}
                    <div className={"ml-4 h-full flex items-center"}
                         style={{}}>
                      {
                        !selectDataResource &&
                        <ButtonSecond style={{width: '187px', height: '38px', lineHeight: '14px'}}
                                      text={'+选择数据资源'}
                                      click={_e => clickSelectDataResourceModal(_e)}/>
                      }
                      {
                        selectDataResource &&
                        <div className={"h-full flex items-center pl-4 pr-4"}
                             style={{borderRadius: '2px', background: '#F0F2F5'}}>
												<span className={"flex items-center text-sm"}
                              style={{color: '#919399'}}>{selectDataResource.title}</span>
                          <CloseCircleFilled style={{color: '#C0C4CC',width:'10px',height:'10px'}} className={"ml-2 flex items-center"}
                                             onClick={delelteSelectDataResource}/>
                        </div>
                      }
                    </div>
                  </div>
                  {/*设置输出参数*/}
                  <div className={"mt-4 w-full flex flex-col"}>
                    {/*数据要素类型*/}
                    <div style={{lineHeight:'14px'}}
                         className={"w-full flex items-center"}>
                      {/*左*/}
                      <div className={"flex justify-end items-center text-sm text-black"}
                           style={{width:'120px'}}>
                        <span className={"text-red"}/>数据要素类型
                      </div>
                      {/*右*/}
                      <div className={"ml-4 h-full flex items-center"}
                           style={{width:'730px'}}>
                        离线数据包
                      </div>
                    </div>
                    {/*数据要素名称*/}
                    <Form.Item
                      style={{marginTop:'16px'}}
                      label="数据要素名称"
                      name="dr_name"
                      className={'label-height-38'}
                      rules={[{ required: true, message: '请输入数据要素名称'}]}
                    >
                      <Input style={{height:'38px'}} placeholder={'请输入数据要素名称'} autoComplete={"off"}/>
                    </Form.Item>
                    {/*应用领域*/}
                    <Form.Item
                      label="应用领域"
                      name="dr_application_field"
                      className={'label-height-38'}
                      rules={[{ required: true, message: '请选择应用领域'}]}
                    >
                      <Select
                        size={'large'}
                        style={{ width: 730}}
                        options={applicationFieldList}
                        placeholder={'请选择应用领域'}
                        mode="multiple" maxTagCount="responsive"
                      />
                    </Form.Item>
                    {/*数据要素简介*/}
                    <Form.Item
                      label="数据要素简介"
                      name="dr_description"
                      className={'label-height-38'}
                      rules={[{ required: true, message: '请输入数据要素简介'}]}
                    >
                      <Input.TextArea style={{height:'90px'}} showCount maxLength={500}
                                      onKeyDown={e => e.stopPropagation()}
                                      placeholder={"请输入数据要素简介"}/>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          }
        </Spin>
      </div>
      {/*停止弹框*/}
      <StopModal data={data}
                 show={stopModal}
                 onOk={stopModalOnOk}
                 onCancel={stopModalOnCancel}/>
      {/*弹框*/}
      {/*选择加工流程*/}
      <SelectProcessingModal data={null}
                             showWhich={1}
                             show={selectProcessingModal}
                             onCancel={selectProcessingModalOnCancel}
                             onOk={data=>selectProcessingModalOnOk(data)}/>
      {/*选择数据源*/}
      <SelectDataResourceModal data={null}
                               show={selectDataResourceModal}
                               onCancel={selectDataResourceModalOnCancel}
                               onOk={selectDataResourceModalOnOk}/>
    </div>
  )
}
