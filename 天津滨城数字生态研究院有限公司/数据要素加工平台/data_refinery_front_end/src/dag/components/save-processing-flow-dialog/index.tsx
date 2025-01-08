import 'brilliant-editor/dist/index.css';
import React, {useEffect, useRef, useState} from 'react';
import {MarkdownEditor} from "../MarkdownEditor";
import {Input, message, Modal} from "antd";
import XflowSmall from "../../../components/xflow-small";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import Title from "../../../components/Title";
import EditTable from "../../../components/EditTable";
import ButtonSecond from "../../../components/ButtonSecond";
import ButtonMain from "../../../components/ButtonMain";
import { dataTypeMap } from '../../../utils/static';

export default function SaveProcessingFlowDialog(props) {
  // draggable
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  // state
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  // 可编辑表格数据
  const [editTableData,setEditTableData] = useState([])

  const [inputDataType,setInputDataType] = useState('')

  const [inputDataFormat,setInputDataFormat] = useState('')
  const [inputDescription,setInputDescription] = useState('')

  const [outputDataType,setOutputDataType] = useState('')

  const [outputDescription,setOutputDescription] = useState('')
  // mounted
  useEffect(()=>{
    if (props.show) {
      console.log('打开弹框')
      console.log('props: ',props)
      setName(props.experimentInfo.name)
      setDescription(props.experimentInfo.description)
      // 设置输入格式
      setInputDataType(props.inputType)
      // 表格，文本，图片，音频，视频
      if (props.inputType === 'csv') {
        setInputDataFormat('支持单个表格文件、文件地址、压缩包格式。表格格式为XLS、CSV。')
        let t1 = props.graphInfo.nodes[0].output_list[0][2].value
        console.log('t1: ',t1)
        let t2 = []
        for (let i = 0; i < t1.length; i++) {
          t2.push({
            key: i,
            ...t1[i],
            description: '',
          })
        }
        console.log('t2: ',t2)
        setEditTableData(t2)
      } else if (props.inputType === 'text') {
        setInputDataFormat('支持单个文本文件、文件地址、文件压缩包格式。文本格式为：XLS、TXT、CSV、JSON。')
      } else if (props.inputType === 'image') {
        setInputDataFormat('支持单个图片、图片集地址、图片集压缩包。图片格式为JPEG、JPG、JPE、PNG、PBM、PGM。')
      } else if (props.inputType === 'audio') {
        setInputDataFormat('支持单个音频文件、音频集合。音频格式为WAV、MOV、FLAC、MP3、WMA')
      } else if (props.inputType === 'video') {
        setInputDataFormat('支持单个视频、视频流、目录集合、视频集压缩包。视频格式为MP4、AVI')
      }
      // 设置输出格式
      setOutputDataType(props.outputType)
    } else {
      console.log('关闭弹框')
    }
  },[props.show])
  const onOk = () => {
    const params = {
      name: name,
      description: description,
      input: {
        data_type: inputDataType,
        data_format: inputDataFormat,
        description: inputDescription,
        table: editTableData,
      },
      output: {
        data_type: outputDataType,
        data_format: '',
        description: outputDescription,
      },
      // @ts-ignore
      run_id: window.myInfo.run_id,
      content: props.graphInfo,
    }
    if(!params.name) {
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
    props.onOk(params)
  }
  const onCancel = () => {

    props.onCancel()
  }

  return (
    <Draggable>
      <Modal title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
            padding: '12px 24px',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          保存加工流程
        </div>
      }
             modalRender={(modal) => (
               <Draggable
                 disabled={disabled}
                 bounds={bounds}
                 onStart={(event, uiData) => onStart(event, uiData)}
               >
                 <div ref={draggleRef}>{modal}</div>
               </Draggable>
             )}
             centered
             destroyOnClose
             maskStyle={{}}
             bodyStyle={{}}
             wrapClassName="save-processing-flow-dialog"
             footer={null}
             open={props.show}
             onOk={props.onOk}
             onCancel={props.onCancel}>
        {/*最外层*/}
        <div className="w-full h-full flex flex-col">
          {/*上*/}
          <div className='w-full flex pl-6 pr-6 pt-6'
               style={{height:'calc(100% - 60px)'}}>
            {/*左*/}
            <div className='flex overflow-auto border border-white-divide'
                 style={{width:'261px',height:'627px'}}>
              <XflowSmall content={props?.graphInfo}/>
            </div>
            {/*右*/}
            <div className='ml-4 pr-4 flex-1 h-full overflow-auto'>
              <div className="w-full flex flex-col">
                {/*基本信息*/}
                <div className="w-full flex flex-col">
                  {/*title*/}
                  <Title title='基本信息'/>
                  {/*名称*/}
                  <div style={{height:'38px'}} className="mt-4 w-full flex items-center">
                    {/*文字*/}
                    <div className="text-sm text-black mr-2">名称</div>
                    {/*输入框*/}
                    <Input className="flex-1" placeholder="请输入名称"
                           value={name}
                           autoComplete={"off"}
                           onChange={e=>setName(e.target.value)}/>
                  </div>
                  {/*简介*/}
                  <div style={{height:'145px'}} className="mt-4 w-full flex">
                    {/*文字*/}
                    <div className="text-sm text-black">简介</div>
                    {/*输入框*/}
                    <Input.TextArea rows={4} maxLength={500} showCount className="ml-2 flex-1" placeholder="请输入简介"
                                    value={description}
                                    autoComplete={"off"}
                                    onChange={e=>setDescription(e.target.value)}/>
                  </div>
                </div>
                {/*输入信息*/}
                <div style={{}} className="mt-6 w-full flex flex-col">
                  {/*title*/}
                  <Title title='输入信息'/>
                  {/*数据类型*/}
                  <div className="mt-2 w-full flex items-center text-sm text-black">
                    <span className={"flex items-center"}>数据类型：{dataTypeMap[inputDataType]}</span>
                  </div>
                  {/*输入格式*/}
                  <div className="mt-2 w-full flex items-center text-sm text-black">
                    {/*<span>输入格式：支持单个表格文件、文件地址、压缩包格式。表格格式为<span className="text-main">XLS、CSV</span>。</span>*/}
                    <span className={"flex items-center"}>输入格式：{inputDataFormat}</span>
                  </div>
                  {/*字段类型*/}
                  {
                    (dataTypeMap[inputDataType] === '表格') &&
										<div className="mt-4 w-full flex flex-col">
											<div className="text-sm text-black">字段类型：</div>
                      {/*可编辑表格*/}
											<div className="mt-2 w-full">
                        <EditTable
                          data={editTableData}
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
                      <MarkdownEditor value={inputDescription}
                                      change={value=>setInputDescription(value)}/>
                    </div>
                  </div>
                </div>
                {/*输出信息*/}
                <div style={{}} className="mt-6 w-full flex flex-col">
                  {/*title*/}
                  <Title title='输出信息'/>
                  {/*输出格式*/}
                  <div className="mt-2 w-full flex items-center text-sm text-black">
                    <span className={"flex items-center"}>输出格式：{dataTypeMap[outputDataType]}</span>
                  </div>
                  {/*输出说明*/}
                  <div className="mt-4 mb-6 w-full flex flex-col">
                    <div className="text-sm text-black">输出说明：</div>
                    <div className="mt-2 w-full">
                      <MarkdownEditor value={outputDescription}
                                      change={value=>setOutputDescription(value)}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*下*/}
          <div className="w-full flex justify-center items-center"
               style={{height:'60px',boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.5)', borderRadius: '0px 0px 4px 4px',borderTop:'1px solid #ebebeb'}}>
            <ButtonSecond text={'取消'} click={onCancel} style={{width:'61px',height:'32px'}}/>
            <ButtonMain text={'确定'} className={"ml-4"} click={onOk} style={{width:'61px',height:'32px'}}/>
          </div>
        </div>
      </Modal>
    </Draggable>

  )
}
