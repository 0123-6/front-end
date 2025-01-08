import React, {useEffect, useRef, useState} from "react";
import {message, Pagination, Popover, Select, Spin} from "antd";
import NoSearchData from "../../icon/no-search-data.svg";
import MoreSvg from "../../icon/header/MoreSvg";
import NodeNumSvg from "../../icon/experiment/NodeNumSvg";
import TimeSvg from "../../icon/experiment/TimeSvg";
import {
  deleteElementProcessing,
  elementProcessingApplyRelease,
  getElementProcessingList,
} from "../../axios/xflow";
import DeleteModal from "./components/DeleteModal";
import { useHistory } from 'react-router-dom';
import PublishModal from "./components/PublishModal";
import SearchBig from "../../components/SearchBig";
import StatusCard from "../../components/StatusCard";
import TypeList from "../../components/TypeList";
import PictureInput from "../../icon/element-processing/PictureInput";
import TableInput from "../../icon/element-processing/TableInput";
import TextInput from "../../icon/element-processing/TextInput";
import VideoInput from "../../icon/element-processing/VideoInput";
import MusicInput from "../../icon/element-processing/MusicInput";
import TableOutput from "../../icon/element-processing/TableOutput";
import TextOutput from "../../icon/element-processing/TextOutput";
import PictureOutput from "../../icon/element-processing/PictureOutput";
import VideoOutput from "../../icon/element-processing/VideoOutput";
import MusicOutput from "../../icon/element-processing/MusicOutput";
import InnerMenuComponent from "../../components/InnerMenuComponent";

export const ElementProcessingIOTypeListNotWithAll = [
  {
    label: "文本",
    text: "文本",
    value: "text"
  },
  {
    label: "表格",
    text: "表格",
    value: "csv"
  },
  {
    label: "图片",
    text: "图片",
    value: "image"
  },
  {
    label: "视频",
    text: "视频",
    value: "video"
  },
  {
    label: "音频",
    text: "音频",
    value: "audio"
  },
]

export const ElementProcessingIOTypeList = [
  {
    label: '全部',
    text: '全部',
    value: '',
  },
  {
    label: "文本",
    text: "文本",
    value: "text"
  },
  {
    label: "表格",
    text: "表格",
    value: "csv"
  },
  {
    label: "图片",
    text: "图片",
    value: "image"
  },
  {
    label: "视频",
    text: "视频",
    value: "video"
  },
  {
    label: "音频",
    text: "音频",
    value: "audio"
  },
]

export default function ElementProcessing() {
  const history = useHistory();
  // state区域
  const userId = 1
  // const [modalCreate,setModalCreate] = useState(false)
  // type为全部，拖拽，编码
  const typeList = ['加工流程', '生产任务']
  const typeRouteMap = {
    '加工流程': '/element-processing',
    '生产任务': '/element-processing/production-task',
  }
  const type = useRef('加工流程')
  const keyword = useRef('')
  // 状态
  const status = useRef('全部')
  const statusList = [
    {
      label:'全部',
      value:null,
    },
    {
      label:'无效',
      value:0,
    },
    {
      label:'未提交',
      value:1,
    },
    {
      label:'待审核',
      value:100,
    },
    {
      label:'已上线',
      value:200,
    },
    {
      label:'已驳回',
      value:300,
    },
    {
      label:'已下线',
      value:400,
    },
  ]
  const IOTypeMap = {
    text: '文本',
    csv: '表格',
    image: '图片',
    video: '视频',
    audio: '音频',
  }
  // 输入类型
  const inputType = useRef('')

  // 输出类型
  const outputType = useRef('')
  const pageSize = useRef(16);
  const pageSizeChange = useRef(false);
  const pageNum = useRef(1);
  const [pageSum, setPageSum] = useState(0);
  // 是否是首次加载
  const [first,setFirst] = useState(true)
  const [loading,setLoading] = useState(false);
  const [data, setData] = useState([]);
  const selectedItem = useRef(null)
  const selectedIndex = useRef(null)
  // 删除弹框
  const [modalDelete,setModalDelete] = useState(false)
  // 申请发布弹框
  const [modalPublish,setModalPublish] = useState(false);
  // 是否展示菜单
  const [showMenu,setShowMenu] = useState(false)

  // created
  // mounted
  // 初始化函数
  useEffect(() => {
    search()
  }, []);
  // methods区域
  const search = async () => {
    console.log('into search method')
    let params = {
      user_id: userId,
      page_num: pageNum.current,
      page_size: pageSize.current,
      // 状态 输入类型 输出类型
      status: status.current === '全部' ? null : status.current,
      input_type: inputType.current === '' ? null : inputType.current,
      output_type: outputType.current === '' ? null : outputType.current,
      filter_name: keyword.current,
    }
    setLoading(true)
    const {data} = await getElementProcessingList(params)
    // 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
    if (data.total_num > 0 && data.list.length === 0 && pageNum.current > 1) {
      pageNum.current -= 1
      search()
      return
    }
    setData(data.list)
    setPageSum(data.total_num)
    setLoading(false)
    if (first) {
      setFirst(false)
    }
  }

  const changeSearchType = (value) => {
    type.current = value + ''
    history.push({
      pathname: typeRouteMap[type.current],
      state: {
      }
    });
  }
  const keydown = (e) => {
    if(e.keyCode === 13) {
      changeKeyword()
    }
  }
  const changeKeyword = () => {
    pageNum.current = 1
    search()
  }
  const changeStatus = (value) => {
    status.current = value
    pageNum.current = 1
    search()
  }
  const changeInputType = (value) => {
    inputType.current = value
    pageNum.current = 1
    search()
  }
  const changeOutputType = (value) => {
    outputType.current = value
    pageNum.current = 1
    search()
  }
  const onShowSizeChange = (_current, newPageSize) => {
    console.log('into onShowSizeChange: _current: ',_current,' ,newPageSize: ',newPageSize)
    console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
    pageNum.current = 1
    pageSize.current = newPageSize
    pageSizeChange.current = true
    console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
  };
  const changePageNum = (value) => {
    console.log('into changePageNum,嘿嘿嘿,传入的value为：',value)
    console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
    if (pageSizeChange.current === true) {
      pageSizeChange.current = false
    } else {
      pageNum.current = value
    }
    console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
    search()
  }
  // 删除弹框
  const deleteModalOnOk = () => {
    console.log('into deletemodal ok')
    const params = {
      ...selectedItem.current
    }
    console.log(params)
    deleteElementProcessing(params).then(res => {
      console.log(res)
      message.success('删除加工流程成功')
      if (data.length === 1 && pageNum.current > 1) {
        pageNum.current -= 1
      }
      search()
    }).catch(err => {
      console.log(err)
    })
    setModalDelete(false)
  }
  const deleteModalOnCancel = () => {
    console.log('into deletemodal cancel')
    setModalDelete(false)
  }
  const goDetail = (index) => {
    console.log('触发了卡片clck')
    history.push({
      pathname: '/element-processing/detail/'+data[index].id,
    });
  }
  // 发布弹框
  const publishModalOnOk = async () => {
    const params = {
      ...selectedItem.current
    }
    await elementProcessingApplyRelease(params)
    message.success('发布加工流程成功')
    search()
    setModalPublish(false)
  }
  const publishModalOnCancel = () => {
    console.log('into publishModalOnCancel cancel')
    setModalPublish(false)
  }
  const clickShowMenu = (e,index) => {
    e.stopPropagation()
    e.preventDefault()
    selectedIndex.current = index
    selectedItem.current = data[index]
    setShowMenu(true)
  }
  const handleOpenChange = (newOpen: boolean) => {
    setShowMenu(newOpen);
  };
  const clickMenu = (item) => {
    setShowMenu(false)
    if (item === '编辑') {
      history.push({
        pathname: '/element-processing/detail/'+selectedItem.current.id,
        params: {
          isEdit: true,
        }
      })
    } else if (item === '删除') {
      setModalDelete(true)
    } else if (item === '申请发布') {
      // 未提交
      if (selectedItem.current.status === 1) {
        setModalPublish(true)
      } else {
        message.warn('该加工流程已发布')
      }
    }
  }
  // template
  return (
    // 最外层
    <div className="w-full flex justify-center">
      {/*主体内容*/}
      <div className="w-[1036px] big:w-[1388px] flex flex-col">
        {/*title*/}
        <div className="mt-6 w-full flex justify-between items-center"
             style={{height:'40px'}}>
          {/*左*/}
          <div className="h-full flex items-center">
            {/*加工流程，生产任务*/}
            <TypeList list={typeList} value={type.current} change={changeSearchType}/>
            {/*search框筛选*/}
            <SearchBig placeholder='请输入加工流程名称'
                       defaultValue={keyword.current}
                       change={e => keyword.current = e.target.value}
                       keyDown={e=>keydown(e)}/>
            {/*状态*/}
            <div className={"flex items-center"}
                 style={{marginLeft:'57px'}}>
              <div className={"flex items-center text-xs text-black"}>状态</div>
              <div className={"ml-2 flex items-center"}>
                <Select
                  value={status.current}
                  style={{ width: 105 }}
                  onChange={changeStatus}
                  options={statusList}
                />
              </div>
            </div>
            {/*输入类型*/}
            <div className={"flex items-center"}
                 style={{marginLeft:'24px'}}>
              <div className={"flex items-center text-xs text-black"}>输入类型</div>
              <div className={"ml-2 flex items-center"}>
                <Select
                  value={inputType.current}
                  style={{ width: 105 }}
                  onChange={changeInputType}
                  options={ElementProcessingIOTypeList}
                />
              </div>
            </div>
            {/*输出类型*/}
            <div className={"flex items-center"}
                 style={{marginLeft:'24px'}}>
              <div className={"flex items-center text-xs text-black"}>输出类型</div>
              <div className={"ml-2 flex items-center"}>
                <Select
                  value={outputType.current}
                  style={{ width: 105 }}
                  onChange={changeOutputType}
                  options={ElementProcessingIOTypeList}
                />
              </div>
            </div>
          </div>
        </div>
        {/*中间内容*/}
        <div className="mt-4 w-full">
          {
            first &&
						<Spin spinning={loading} size="large" tip="加载中...">
							<div className="w-full"
									 style={{height:'436px'}}>
							</div>
						</Spin>
          }
          {
            pageSum===0 && !first &&
						<Spin spinning={loading} size="large" tip="加载中...">
							<div className="w-full flex flex-col justify-center items-center"
									 style={{height:'436px'}}>
								<img src={NoSearchData} alt=""/>
								<div className="mt-3 flex text-sm text-black-light">暂无数据</div>
							</div>
						</Spin>
          }
          {
            pageSum > 0 && !first &&
						<Spin spinning={loading} size="large" tip="加载中...">
							<div className="w-full grid grid-cols-3 big:grid-cols-4 gap-5">
                {
                  data.map((_item,_index) => {
                    return (
                      <div className="w-full rounded-xl bg-white shadow-card p-5 flex flex-col hover:shadow-card-hover hover:cursor-pointer"
                           style={{height:'208px'}}
                           key={_index} onClick={_e=>goDetail(_index)}>
                        {/*title*/}
                        <div className="w-full flex justify-between items-center" style={{marginTop:'-4px'}}>
                          {/*左*/}
                          <span className="flex font-semibold text-black-dark text-sm text-hidden"
                                style={{width:'150px'}}>{_item.name}</span>
                          <div className={"flex items-center h-full"}>
                            {/*左*/}
                            <StatusCard status={_item.status}/>
                            {/*右*/}
                            <Popover title={null}
                                     placement="bottomRight"
                                     overlayClassName={'experiment-popover'}
                                     trigger="click"
                                     open={_index===selectedIndex.current && showMenu}
                                     onOpenChange={handleOpenChange}
                                     content={<InnerMenuComponent list={(_item.status===100 || _item.status===200 )?[{name:'编辑',disabled:true},{name:'申请发布',disabled:true},{name:'删除',disabled:true}]:[{name:'编辑'},{name:'申请发布'},{name:'删除'}]} onOk={clickMenu}/>}
                            >
                              <div className="ml-3 h-full flex items-center text-white-svg hover:text-white-svg-hover hover:cursor-pointer"
                                   onClick={e=>clickShowMenu(e,_index)}>
                                <MoreSvg/>
                              </div>
                            </Popover>
                          </div>
                        </div>
                        {/*分割线*/}
                        <div style={{height: '1px', background: '#f8f8f8', marginTop: '14px',width:'calc(100% + 20px)'}}/>
                        {/*文字*/}
                        <div className="w-full text-xs text-black text-hidden-3"
                             style={{marginTop:'19px',lineHeight: '23px',height:'69px',minHeight:'69px'}}>
                          {_item.description}
                        </div>
                        {/*底部*/}
                        <div className="w-full flex justify-between items-center" style={{marginTop:'30px'}}>
                          {/*方式*/}
                          <div className="flex items-center">
                            <span className="flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover">
                              {(_item.input_type==='表格' || IOTypeMap[_item.input_type]==='表格') && <TableInput/>}
                              {(_item.input_type==='文本'||_item.input_type==='text') && <TextInput/>}
                              {(_item.input_type==='图片' || IOTypeMap[_item.input_type]==='图片') && <PictureInput/>}
                              {(_item.input_type==='视频' || IOTypeMap[_item.input_type]==='视频') && <VideoInput/>}
                              {(_item.input_type==='音频' || IOTypeMap[_item.input_type]==='音频') && <MusicInput/>}
                              {(_item.input_type==='向量' || IOTypeMap[_item.input_type]==='向量') && <TextInput/>}
                            </span>
                            <span className="text-xs text-black-light"
                                  style={{lineHeight: '14px'}}>{IOTypeMap[_item.input_type]?(IOTypeMap[_item.input_type]):(_item.input_type)}</span>
                            <span className="ml-1 flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover">
                              {(_item.output_type==='表格' || IOTypeMap[_item.output_type]==='表格') && <TableOutput/>}
                              {(_item.output_type==='文本'||_item.output_type==='text') && <TextOutput/>}
                              {(_item.output_type==='图片' || IOTypeMap[_item.output_type]==='图片') && <PictureOutput/>}
                              {(_item.output_type==='视频' || IOTypeMap[_item.output_type]==='视频') && <VideoOutput/>}
                              {(_item.output_type==='音频' || IOTypeMap[_item.output_type]==='音频') && <MusicOutput/>}
                              {(_item.output_type==='向量' || IOTypeMap[_item.output_type]==='向量') && <TextOutput/>}
                            </span>
                            <span className="text-xs text-black-light"
                                  style={{lineHeight: '14px'}}>{IOTypeMap[_item.output_type]?(IOTypeMap[_item.output_type]):(_item.output_type)}</span>
                            <span className="ml-1 flex items-center">
                              <span className="flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover"><NodeNumSvg/></span>
                              <span className="text-xs text-black-light" style={{lineHeight: '14px'}}>{_item.node_num}</span>
                            </span>
                          </div>
                          {/*时间*/}
                          <div className="flex items-center">
                            <span className="ml-1 flex items-center text-white-svg-experiment"><TimeSvg/></span>
                            <span className="text-xs text-black" style={{lineHeight: '14px'}}>{_item.created_at}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
							</div>
						</Spin>
          }
        </div>
        {/*分页*/}
        <div className="mt-6 pb-6 w-full flex justify-center">
          {
            pageSum > 8 &&
						<Pagination showSizeChanger
												showQuickJumper
												showTitle={false}
												showTotal={total => `共${total}条`}
												onShowSizeChange={onShowSizeChange}
												onChange={value => changePageNum(value)}
												defaultPageSize={pageSize.current}
												defaultCurrent={1}
												pageSizeOptions={[8,12,16,20]}
												current={pageNum.current}
												total={pageSum} />
          }
        </div>
      </div>
      {/*各种弹DeleteModal框*/}
      {/*删除弹框*/}
      <DeleteModal data={selectedItem.current}
                   show={modalDelete}
                   onCancel={deleteModalOnCancel}
                   onOk={deleteModalOnOk}/>
      {/*发布弹框*/}
      <PublishModal data={selectedItem.current}
                    show={modalPublish}
                    onCancel={publishModalOnCancel}
                    onOk={publishModalOnOk}/>
    </div>
  )
}
