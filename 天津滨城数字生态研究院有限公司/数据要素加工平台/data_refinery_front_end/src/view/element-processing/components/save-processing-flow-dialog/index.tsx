import 'brilliant-editor/dist/index.css';
import React, {useEffect, useRef, useState} from 'react';
import {Input, message, Modal, Select} from "antd";
import {MarkdownEditor} from "../../../../dag/components/MarkdownEditor";
import XflowSmall from "../../../../components/xflow-small";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import Title from "../../../../components/Title";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";

export default function SaveProcessingFlowDialog(props) {
  // state
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')

  const [inputDataType,setInputDataType] = useState('')
  const [inputDataFormat,setInputDataFormat] = useState('')
  const [inputDescription,setInputDescription] = useState('')

  const [outputDataType,setOutputDataType] = useState('')
  const outputDataTypeList = [
    {
      label: '表格',
      value: '表格',
    },
    {
      label: '文本',
      value: '文本',
    },
    {
      label: '图像',
      value: '图像',
    },
    {
      label: '音频',
      value: '音频',
    },
    {
      label: '视频',
      value: '视频',
    },
    {
      label: '向量',
      value: '向量',
    },
  ]
  const [outputDescription,setOutputDescription] = useState('')
  // mounted
  useEffect(()=>{
    if (props.show) {
      console.log('打开弹框')
      setName(props.data.name)
      setDescription(props.data.description)
      // 表格，文本，图像，音频，视频
      setInputDataType(props.data.input.data_type)
      if (props.data.input.data_type === '表格' || props.data.input.data_type === 'CSV') {
        setInputDataFormat('支持单个表格文件、文件地址、压缩包格式。表格格式为XLS、CSV。')
      } else if (props.data.input.data_type === '文本') {
        setInputDataFormat('支持单个文本文件、文件地址、文件压缩包格式。文本格式为：XLS、TXT、CSV、JSON。')
      } else if (props.data.input.data_type === '图像') {
        setInputDataFormat('支持单个图片、图片集地址、图片集压缩包。图像格式为JPEG、JPG、JPE、PNG、PBM、PGM。')
      } else if (props.data.input.data_type === '音频') {
        setInputDataFormat('支持单个音频文件、音频集合。音频格式为WAV、MOV、FLAC、MP3、WMA')
      } else if (props.data.input.data_type === '视频') {
        setInputDataFormat('支持单个视频、视频流、目录集合、视频集压缩包。视频格式为MP4、AVI')
      }
      setInputDescription(props.data.input.description)
      setOutputDataType(props.data.output.data_type)
      setOutputDescription(props.data.output.description)
    } else {
      console.log('关闭弹框')
    }
  },[props.show])
  useEffect(()=>{
    console.log('重新渲染')
  })
  // methods
  const onOk = () => {
    const params = {
      ...props.data,
      name: name,
      description: description,
      input: {
        data_type: inputDataType,
        data_format: inputDataFormat,
        description: inputDescription,
      },
      output: {
        data_type: outputDataType,
        data_format: '',
        description: outputDescription,
      },
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

  // const changeDescription = (e) => {
  //   console.log('into changeDescription,e: ',e)
  //   description.current = e.target.value
  // }

  // const dataSource1 = [
  //   {
  //     key: '1',
  //     name: '企业ID',
  //     type: '整型',
  //     description: '',
  //   },
  //   {
  //     key: '2',
  //     name: '注册资金',
  //     type: '浮点型',
  //     description: '',
  //   },
  //   {
  //     key: '3',
  //     name: '员工数量',
  //     type: '整型',
  //     description: '',
  //   },
  //   {
  //     key: '4',
  //     name: '资产总额',
  //     type: '浮点型',
  //     description: '',
  //   },
  //   {
  //     key: '5',
  //     name: '负债总额',
  //     type: '浮点型',
  //     description: '',
  //   },
  //   {
  //     key: '6',
  //     name: '营业总收入',
  //     type: '浮点型',
  //     description: '',
  //   },
  //   {
  //     key: '7',
  //     name: '利润总额',
  //     type: '浮点型',
  //     description: '',
  //   }
  // ];

  // const columns1 = [
  //   {
  //     title: '字段名称',
  //     dataIndex: 'name',
  //     key: 'name',
  //   },
  //   {
  //     title: '字段类型',
  //     dataIndex: 'type',
  //     key: 'type',
  //   },
  //   {
  //     title: '字段说明',
  //     dataIndex: 'description',
  //     key: 'description',
  //   },
  // ];

  // 可编辑单元格
  // const EditableContext = React.createContext<FormInstance<any> | null>(null);
  // interface Item {
  //   key: string;
  //   name: string;
  //   age: string;
  //   address: string;
  // }
  //
  // interface EditableRowProps {
  //   index: number;
  // }
  // const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  //   const [form] = Form.useForm();
  //   return (
  //     <Form form={form} component={false}>
  //       <EditableContext.Provider value={form}>
  //         <tr {...props} />
  //       </EditableContext.Provider>
  //     </Form>
  //   );
  // };
  // interface EditableCellProps {
  //   title: React.ReactNode;
  //   editable: boolean;
  //   children: React.ReactNode;
  //   dataIndex: keyof Item;
  //   record: Item;
  //   handleSave: (record: Item) => void;
  // }

  // const EditableCell: React.FC<EditableCellProps> = ({
  //                                                      title,
  //                                                      editable,
  //                                                      children,
  //                                                      dataIndex,
  //                                                      record,
  //                                                      handleSave,
  //                                                      ...restProps
  //                                                    }) => {
  //   const [editing, setEditing] = useState(false);
  //   const inputRef = useRef<InputRef>(null);
  //   const form = useContext(EditableContext)!;
  //
  //   useEffect(() => {
  //     if (editing) {
  //       inputRef.current!.focus();
  //     }
  //   }, [editing]);
  //
  //   const toggleEdit = () => {
  //     setEditing(!editing);
  //     form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  //   };
  //
  //   const save = async () => {
  //     try {
  //       const values = await form.validateFields();
  //
  //       toggleEdit();
  //       handleSave({ ...record, ...values });
  //     } catch (errInfo) {
  //       console.log('Save failed:', errInfo);
  //     }
  //   };
  //
  //   let childNode = children;
  //
  //   if (editable) {
  //     childNode = editing ? (
  //       <Form.Item
  //         style={{ margin: 0 }}
  //         name={dataIndex}
  //         rules={[
  //           {
  //             required: true,
  //             message: `${title} is required.`,
  //           },
  //         ]}
  //       >
  //         <Input ref={inputRef} onPressEnter={save} onBlur={save} />
  //       </Form.Item>
  //     ) : (
  //       <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
  //         {children}
  //       </div>
  //     );
  //   }
  //
  //   return <td {...restProps}>{childNode}</td>;
  // };

  // type EditableTableProps = Parameters<typeof Table>[0];

  // interface DataType {
  //   key: React.Key;
  //   name: string;
  // }

  // type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

  // const [dataSource, setDataSource] = useState<DataType[]>([
  //   {
  //     key: '0',
  //     name: '0',
  //   },
  //   {
  //     key: '1',
  //     name: 'Ed',
  //   },
  // ]);

  // const [count, setCount] = useState(2);

  // const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
  //   {
  //     title: 'name',
  //     dataIndex: 'name',
  //     editable: true,
  //   },
  //   {
  //     title: 'type',
  //     dataIndex: 'type',
  //     editable: true,
  //   },
  //   {
  //     title: 'description',
  //     dataIndex: 'description',
  //     editable: true,
  //   },
  // ];
  // const handleAdd = () => {
  //   const newData: DataType = {
  //     key: count,
  //     name: `Edward King ${count}`,
  //   };
  //   setDataSource([...dataSource, newData]);
  //   setCount(count + 1);
  // };

  // const handleSave = (row: DataType) => {
  //   const newData = [...dataSource];
  //   const index = newData.findIndex(item => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //   });
  //   setDataSource(newData);
  // };

  // const components = {
  //   body: {
  //     row: EditableRow,
  //     cell: EditableCell,
  //   },
  // };

  // const columns = defaultColumns.map(col => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record: DataType) => ({
  //       record,
  //       editable: col.editable,
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       width:'33%',
  //       handleSave,
  //     }),
  //   };
  // });
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
                 编辑加工流程
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
              <XflowSmall content={props?.data?.content}/>
            </div>
            {/*右*/}
            <div className='my-right ml-4 pr-4 flex-1 h-full overflow-auto'>
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
                           autoComplete={"off"}
                           value={name}
                           onChange={e=>setName(e.target.value)}/>
                  </div>
                  {/*简介*/}
                  <div style={{height:'145px'}} className="mt-4 w-full flex">
                    {/*文字*/}
                    <div className="text-sm text-black mr-2">简介</div>
                    {/*输入框*/}
                    <Input.TextArea rows={4} maxLength={500} showCount className="flex-1" placeholder="请输入简介"
                                    value={description}
                                    onChange={e=>setDescription(e.target.value)}/>
                  </div>
                </div>
                {/*输入信息*/}
                <div style={{}} className="mt-6 w-full flex flex-col">
                  {/*title*/}
                  <Title title='输入信息'/>
                  {/*数据类型*/}
                  <div className="mt-2 w-full flex items-center text-sm text-black">
                    <div className={"flex items-center"}>
                      数据类型：{inputDataType}
                    </div>
                  </div>
                  {/*输入格式*/}
                  <div className="mt-2 w-full flex items-center text-sm text-black">
                    {/*<span>输入格式：支持单个表格文件、文件地址、压缩包格式。表格格式为<span className="text-main">XLS、CSV</span>。</span>*/}
                    <span>输入格式：{inputDataFormat}</span>
                  </div>
                  {/*字段类型*/}
                  {
                    inputDataType === '表格' && false &&
										<div className="mt-4 w-full flex flex-col">
											<div className="text-sm text-black">字段类型：</div>
                      {/*可编辑表格*/}
											<div className="mt-2 w-full">
                        {/*<Table components={components} rowClassName={() => 'editable-row'} dataSource={dataSource1} columns={columns as ColumnTypes} size="small" bordered pagination={false}/>*/}
                        {/*<Table*/}
                        {/*	bordered*/}
                        {/*	dataSource={dataSource}*/}
                        {/*	columns={columns as ColumnTypes}*/}
                        {/*/>*/}
											</div>
										</div>
                  }
                  {/*输入说明*/}
                  <div className="mt-4 w-full flex flex-col">
                    <div className="text-sm text-black">输入说明：</div>
                    <div className="mt-2 w-full">
                      <MarkdownEditor value={inputDescription} change={value=>setInputDescription(value)}/>
                    </div>
                  </div>
                </div>
                {/*输出信息*/}
                <div style={{}} className="mt-6 w-full flex flex-col">
                  {/*title*/}
                  <Title title='输出信息'/>
                  {/*输出格式*/}
                  <div className="mt-2 w-full flex items-center text-sm text-black">
                    <div className={"w-full flex items-center"}>
                      <div className={"flex items-center"}>输出格式：</div>
                      <Select
                        value={outputDataType}
                        style={{ width: 120 }}
                        options={outputDataTypeList}
                        onChange={e=>setOutputDataType(e)}
                      />
                    </div>
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
