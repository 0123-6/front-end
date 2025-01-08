import React, {useEffect, useState} from "react";
import {Input, message, Spin, Table, Tooltip} from "antd";
import { useHistory } from 'react-router-dom';
import {elementProcessingApplyRelease, getElementProcessingDetailById, saveProcessingFlow} from "../../../axios/xflow";
import NavigationComponent from "../../../components/NavigationComponent";
import PublishModal from "../components/PublishModal";
import TitleSvg from "./icon/TitleSvg.svg";
import StatusCard from "../../../components/StatusCard";
import ButtonFifth from "../../../components/ButtonFifth";
import TimeSvg from "../../data-resource/icon/TimeSvg";
import Title from "../../../components/Title";
import XflowSmall from "../../../components/xflow-small";
import TypeList from "../../../components/TypeList";
import DataType from "./components/DataType";
import {Viewer} from "@toast-ui/react-editor";
import ButtonSecond from "../../../components/ButtonSecond";
import ButtonMain from "../../../components/ButtonMain";
import EditTable from "../../../components/EditTable";
import {MarkdownEditor} from "../../../dag/components/MarkdownEditor";
import ElementProcessing from "../icon/ElementProcessing.svg";
import ElementProcessingActive from "../icon/ElementProcessingActive.svg";
import ProcessingFlow from "../icon/ProcessingFlow.svg";
import ProcessingFlowActive from "../icon/ProcessingFlowActive.svg";
import { dataTypeMap } from "../../../utils/static";

export default function ElementProcessingDetail(props) {

  // state
  const history = useHistory();
  // 模式，查看or 编辑
  const [mode,setMode] = useState('查看')
  // 是不是直接编辑
  const [isEdit,setIsEdit] = useState(false)

  const [data,setData] = useState(null)
  const [isLoading,setIsLoading] = useState(false)

  // mounted
  useEffect(()=>{
    getData().then(() => {
      if (props.location.params?.isEdit) {
        setIsEdit(true)
        setMode('编辑')
      } else {
        setMode('查看')
      }
    })
    return ()=>{
      setMode('查看')
    }
  },[])

  // methods
  // 获取数据
  const getData = async () => {
    const params = {
      id:Number(props.match.params.id)
    }
    setIsLoading(true)
    const {data} = await getElementProcessingDetailById(params)
    setData(data)
    setIsLoading(false)
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
  // view
  // 是否展示发布弹窗
  const [showPublishModal,setShowPublishModal] = useState(false)
  // 加工流程 or 节点参数
  const [switchName,setSwitchName] = useState('输入输出说明')
  const switchNameList = ['输入输出说明','节点参数']
  // 发布弹框
  const publishModalOnOk = () => {
    console.log('into publishmodal ok')
    const params = {
      ...data
    }
    console.log(params)
    elementProcessingApplyRelease(params).then(res => {
      console.log(res)
      message.success('发布加工流程成功')
      changeData(null)
    }).catch(err => {
      console.error(err);
    })
    setShowPublishModal(false)
  }
  const publishModalOnCancel = () => {
    console.log('into publishModalOnCancel cancel')
    setShowPublishModal(false)
  }
  // edit
  // state
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  // 可编辑表格数据
  const [editTableData,setEditTableData] = useState([])
  // 是否展示输入输出说明
  const [showInputOutputDescription,setShowInputOutputDescription] = useState(false)
  // @ts-ignore
  const [inputDescription,setInputDescription] = useState('')
  // @ts-ignore
  const [outputDescription,setOutputDescription] = useState('')
  // mounted
  useEffect(()=>{
    setEditTableData(data?.input?.table)
    if (mode === '查看') {
      destroyEditData()
    } else if(mode === '编辑') {
      initEditData()
    }
  },[mode])
  useEffect(()=>{
    if(mode === '编辑') {
      if(inputDescription && outputDescription && !showInputOutputDescription) {
        setShowInputOutputDescription(true)
      }
    }
  },[inputDescription,outputDescription])
  // 初始化编辑数据
  const initEditData = () => {
    setName(data?.name)
    setDescription(data?.description)
    setInputDescription(data?.input?.description)
    // setEditTableData(data?.input?.table)
    console.log('data?.input?.table: ',data?.input?.table)
    setOutputDescription(data?.output?.description)
  }
  // 销毁编辑数据
  const destroyEditData = () => {
    setName('')
    setDescription('')
    setInputDescription('')
    // setEditTableData([])
    setOutputDescription('')
    setShowInputOutputDescription(false)
  }
  const onOk = async () => {
    let params = {
      ...data,
      name: name,
      description: description,
      input: {
        ...data.input,
        description: inputDescription,
        table: editTableData,
      },
      output: {
        ...data.output,
        description: outputDescription,
      },
    }
    if (!params.name) {
      message.warn('请输入名称')
      return
    } else if (!params.description) {
      message.warn('请输入简介')
      return
    } else if (!params.input.description) {
      message.warn('请输入输入说明')
      return
    } else if (!params.output.data_type) {
      message.warn('请选择输出格式')
      return
    } else if (!params.output.description) {
      message.warn('请输入输出说明')
      return
    }
    await saveProcessingFlow(params)
    message.success('编辑加工流程成功')

    if (isEdit) {
      history.goBack()
    } else {
      changeData(params)
      changeMode('查看')
    }
  }
  const onCancel = () => {
    if (isEdit) {
      history.goBack()
    } else {
      changeMode('查看')
    }
  }
  return (
    // 最外层
    <div className="w-full bg flex flex-col items-center">
      <NavigationComponent data={[
        {label:'要素加工',router:'/element-processing',icon:ElementProcessing,iconActive:ElementProcessingActive},
        {label:'加工流程',router:'/element-processing',icon:ProcessingFlow,iconActive:ProcessingFlowActive},
        {label:mode,disabled:true},
      ]}/>
      {/*主体内容*/}
      <div className="flex flex-col bg-white pt-6 pl-8 pr-8 pb-32 mb-8 shadow-card rounded"
           style={{width: '960px'}}>
        <Spin spinning={isLoading} size="large" tip="加载中...">
          {
            mode==='查看' &&
            <div className={"w-full flex flex-col"}>
              {/*name*/}
              <div className={"flex justify-between items-center"}>
                {/*左*/}
                <div className={"flex items-center"}>
                  <img src={TitleSvg} alt=""/>
                  {/*加工流程名称*/}
                  <div className={"ml-1.5 text-lg text-black-dark font-medium leading-[18px]"}>
                    {data?.name}
                  </div>
                  <StatusCard height={'24px'} className={"ml-3"} status={data?.status}/>
                </div>
                {/*右*/}
                <div className={"flex items-center"}>
                  <ButtonFifth style={{width:'79px',height:'24px'}}
                               className={''}
                               disabled={(data?.status===100 || data?.status===200 )}
                               text={'申请发布'}
                               click={_e => setShowPublishModal(true)}/>
                  <ButtonFifth style={{width:'79px',height:'24px'}}
                               className={'ml-2'}
                               disabled={(data?.status===100 || data?.status===200 )}
                               text={'编辑'}
                               click={()=>changeMode('编辑')}/>
                </div>
              </div>
              {/*简介*/}
              <div className={"mt-3.5 w-full flex text-sm text-black"}
                   style={{lineHeight:'20px'}}>
                {data?.description}
              </div>
              {/*创建时间*/}
              <div className={"mt-2 w-full text-sm flex items-center text-black-light leading-[14px]"}>
                <span className={"flex items-center font-medium"}>创建时间：</span>
                <div className={"flex items-center"}
                     style={{}}><TimeSvg/></div>
                <span className={"ml-1 flex items-center font-medium"}>{data?.created_at}</span>
              </div>
            </div>
          }
          {
            mode==='编辑' &&
            <div className={"w-full flex flex-col"}>
              {/*第一行*/}
              <div className={"w-full flex justify-between items-center"}>
                {/*左*/}
                <div className={"flex items-center"}
                     style={{width:'500px',height:'40px'}}>
                  <Input style={{width:'100%',height:'100%'}}
                         autoComplete={"off"}
                         placeholder="请输入名称"
                         value={name}
                         onChange={e=>setName(e.target.value)}/>
                </div>
                {/*右*/}
                <div className={"flex items-center"}>
                  <ButtonSecond style={{width:'86px',height:'28px',lineHeight:'14px'}}
                                text={'取消'}
                                click={onCancel}/>
                  <ButtonMain className="ml-2"
                              style={{width:'86px',height:'28px',lineHeight:'14px'}}
                              text={'保存'}
                              click={onOk}/>
                </div>
              </div>
              {/*第二行*/}
              <div className={"mt-4 w-full"}>
                <Input.TextArea rows={4} maxLength={500} showCount placeholder="请输入简介"
                                value={description}
                                onChange={e=>setDescription(e.target.value)}/>
              </div>
              {/*创建时间*/}
              <div className={"w-full text-sm flex items-center text-black-light leading-[14px]"}>
                <span className={"flex items-center font-medium"}>创建时间：</span>
                <div className={"flex items-center"}
                     style={{}}><TimeSvg/></div>
                <span className={"ml-1 flex items-center font-medium"}>{data?.created_at}</span>
              </div>
            </div>
          }
          {/*流程图*/}
          <Title title='流程图' className={`${mode==='查看'?'mt-6':'mt-3'}`}/>
          <div className={"mt-2 w-full flex border border-white-border"} style={{height:'149px'}}>
            <XflowSmall content={data?.content} type='row' new/>
          </div>


          {
            mode==='查看' &&
            <div className={"mt-3 mb-4 w-full flex flex-col"}>
              {/*加工流程 or 节点参数*/}
              <TypeList list={switchNameList}
                        value={switchName}
                        change={(value) => setSwitchName(value+'')}/>
              {
                switchName === '输入输出说明' &&
                <div className={"w-full flex flex-col"}>
                  {/*输入信息*/}
                  <div className={"mt-4 w-full flex flex-col"}>
                    {/*title*/}
                    <Title title='输入信息'/>
                    {/*数据类型*/}
                    <div className={"mt-2.5 w-full text-sm text-black flex items-center leading-[14px]"}>
                      <span className={"flex items-center"}>数据类型：</span>
                      <DataType type={data?.input?.data_type}/>
                    </div>
                    {/*数据格式*/}
                    <div className={"mt-1.5 w-full text-sm text-black"}>
                      {data?.input?.data_format}
                    </div>
                    {/*表格的话展示表格*/}
                    {
                      (data?.input?.data_type==='表格' || dataTypeMap[data?.input?.data_type]==='表格') &&
                      <div className={"w-full flex flex-col"}>
                        <span className={"mt-2 flex items-center"}>字段类型：</span>
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
                               dataSource={data?.input?.table}
                               pagination={false}
                               className={"mt-2"}
                               size='small'/>
                      </div>
                    }
                    {/*输入数据说明*/}
                    {/*<div className={"mt-2 flex text-sm"}>输入数据说明：</div>*/}
                    {
                      data?.input?.description &&
                      <Viewer initialValue={data?.input?.description}/>
                    }

                  </div>
                  {/*输出信息*/}
                  <div className={"mt-6 w-full flex flex-col"}>
                    {/*title*/}
                    <Title title="输出信息"/>
                    {/*数据格式*/}
                    <div className={"mt-2.5 w-full text-sm text-black flex items-center leading-[14px]"}>
                      <span className={"flex items-center"}>数据类型：</span>
                      <DataType type={data?.output?.data_type}/>
                    </div>
                    {/*输出数据说明*/}
                    {/*<div className={"mt-2 flex text-sm"}>输出数据说明：</div>*/}
                    {
                      data?.output?.description &&
                      <Viewer initialValue={data?.output?.description}/>
                    }
                  </div>
                </div>
              }
              {
                switchName === '节点参数' &&
                <div className={"w-full flex flex-col"}>
                  {
                    data?.content?.nodes.map((item,index)=>{
                      return (
                        // 模型名称
                        <div className={`${index===0?'mt-4':'mt-8'} w-full flex flex-col`} key={index}>
                          {/*title*/}
                          <Title title={item.label}/>
                          {/*模型名称*/}
                          <div className={"mt-3 w-full flex items-center"}>
                            <div className={"flex items-center text-sm text-black leading-[14px]"}
                                 style={{width:'120px',minWidth:'120px'}}>
                              模型
                            </div>
                            <div className={"flex items-center text-sm leading-[14px] text-black hover:cursor-pointer hover:text-main"}>
                              {item.label}
                            </div>
                          </div>
                          {/*参数*/}
                          {
                            item.config.map((item2,index2)=>{
                              if(item2.label==='数据路径') {
                                return
                              }
                              // @ts-ignore
                              return (
                                // 参数
                                <div className={"w-full flex flex-col"} key={index2}>
                                  {/*遍历属性值*/}
                                  <div className={"mt-4 w-full flex"}>
                                    {/*属性名称*/}
                                    <div className={"h-full flex items-center text-sm text-black leading-[14px]"}
                                         style={{width:'120px',minWidth:'120px'}}>
                                      {
                                        item2.label.length > 6 &&
                                        <Tooltip title={item2.label} overlayClassName={'tooltip-element-processing'}>
                                          <span className={"flex items-center text-hidden"} style={{width:'90px'}}>{item2.label}</span>
                                        </Tooltip>
                                      }
                                      {
                                        !(item2.label.length > 6) &&
                                        <span className={"flex items-center text-hidden"} style={{width:'90px'}}>{item2.label}</span>
                                      }
                                    </div>
                                    {/*属性值*/}
                                    {
                                      item2.value instanceof Array &&
                                      <div className={"flex flex-wrap text-sm text-black"} style={{marginTop:'-8px'}}>
                                        {
                                          item2.value.map((item3,index3)=>{
                                            return (
                                              <div className={"flex items-center text-sm leading-[14px] text-main pl-3.5 pr-3.5 rounded mr-2 mt-2"}
                                                   style={{height:'23px',background:'rgba(85,174,184,0.12)'}}
                                                   key={index3}
                                              >
                                                {item3}
                                              </div>
                                            )
                                          })
                                        }
                                      </div>
                                    }
                                    {
                                      !(item2.value instanceof Array) &&
                                      <div className={"flex items-center leading-[14px]"}>{(item2?.value?.data_type+'')?(item2?.value?.data_type+''):(item2?.value+'')}</div>
                                    }
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      )
                    })
                  }
                </div>
              }
            </div>
          }
          {
            mode==='编辑' &&
            <div className={"w-full flex flex-col"}>
              {/*输入信息*/}
              <div style={{}} className="mt-6 w-full flex flex-col">
                {/*title*/}
                <Title title='输入信息'/>
                {/*数据类型*/}
                <div className={"mt-2 w-full text-sm text-black flex items-center leading-[14px]"}>
                  <span className={"flex items-center"}>数据类型：</span>
                  <DataType type={data?.input?.data_type}/>
                </div>

                {/*输入格式*/}
                <div className="mt-2 w-full flex items-center text-sm text-black">
                  {/*<span>输入格式：支持单个表格文件、文件地址、压缩包格式。表格格式为<span className="text-main">XLS、CSV</span>。</span>*/}
                  <span>输入格式：{data?.input?.data_format}</span>
                </div>
                {/*字段类型*/}
                {
                  (data?.input?.data_type==='表格' || dataTypeMap[data?.input?.data_type]==='表格') &&
                  <div className="mt-4 w-full flex flex-col">
                    <div className="text-sm text-black">字段类型：</div>
                    {/*可编辑表格*/}
                    <div className="mt-2 w-full">
                      <EditTable
                        data={data?.input?.table}
                        columns={[
                          {
                            title: '字段名称',
                            dataIndex: 'name',
                            width: '20%',
                          },
                          {
                            title: '字段类型',
                            dataIndex: 'type',
                            width: '20%',
                          },
                          {
                            title: '字段说明',
                            dataIndex: 'description',
                            width: '60%',
                            editable: true,
                          },
                        ]}
                        change={data=>setEditTableData(data)}/>
                    </div>
                  </div>
                }
                {/*输入说明*/}
                <div className="mt-4 w-full flex flex-col">
                  <div className="text-sm text-black">输入说明：</div>
                  <div className="mt-2 w-full">
                    {
                      showInputOutputDescription &&
                      <MarkdownEditor value={inputDescription}
                                      change={value=>setInputDescription(value)}/>
                    }
                  </div>
                </div>
              </div>
              {/*输出信息*/}
              <div style={{}} className="mt-6 w-full flex flex-col">
                {/*title*/}
                <Title title='输出信息'/>
                {/*数据类型*/}
                <div className={"mt-2 w-full text-sm text-black flex items-center leading-[14px]"}>
                  <span className={"flex items-center"}>数据类型：</span>
                  <DataType type={data?.output?.data_type}/>
                </div>
                {/*/!*输出格式*!/*/}
                {/*<div className="mt-2 w-full flex items-center text-sm text-black">*/}
                {/*	<div className={"w-full flex items-center"}>*/}
                {/*		<div className={"flex items-center"}>输出格式：</div>*/}
                {/*		<Select*/}
                {/*			value={outputDataType}*/}
                {/*			style={{ width: 120 }}*/}
                {/*			options={outputDataTypeList}*/}
                {/*			onChange={e=>setOutputDataType(e)}*/}
                {/*		/>*/}
                {/*	</div>*/}
                {/*</div>*/}
                {/*输出说明*/}
                <div className="mt-2 mb-6 w-full flex flex-col">
                  <div className="text-sm text-black">输出说明：</div>
                  <div className="mt-2 w-full">
                    {
                      showInputOutputDescription &&
                      <MarkdownEditor value={outputDescription}
                                      change={value=>setOutputDescription(value)}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </Spin>
      </div>
      {/*发布弹框*/}
      <PublishModal data={data}
                    show={showPublishModal}
                    onOk={publishModalOnOk}
                    onCancel={publishModalOnCancel}/>
    </div>
  )
}
