import React, {useEffect, useRef, useState} from "react";
import MoreSvg from "../../icon/header/MoreSvg";
import {message, Pagination, Popover, Spin} from "antd";
import DragSvg from "../../icon/experiment/DragSvg";
import TimeSvg from "../../icon/experiment/TimeSvg";
import NoSearchData from '../../icon/no-search-data.svg'
import {deleteExperiment, getExperimentList, saveExperiment} from "../../axios/xflow";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import NodeNumSvg from "../../icon/experiment/NodeNumSvg";
import CodeSvg from "../../icon/experiment/CodeSvg";
import SearchBig from "../../components/SearchBig";
import TypeList from "../../components/TypeList";
import CreateModal from "./components/CreateModal";
import InnerMenuComponent from "../../components/InnerMenuComponent";

function Experiment() {
  // 搜索条件
  // type为全部，拖拽，编码
  const typeList = ['全部', '拖拽式', '编码式']
  const type = useRef('全部')
  const keyword = useRef('')

  const pageSize = useRef(16);
  const pageSizeChange = useRef(false);

  const pageNum = useRef(1);
  const [first,setFirst] = useState(true)
  const [loading,setLoading] = useState(false)
  const [data, setData] = useState([]);
  // 全部数量
  const [pageSum, setPageSum] = useState(0);
  // 创建弹框
  const [modalCreate,setModalCreate] = useState(false)
  // 编辑弹框
  const [modalEdit,setModalEdit] = useState(false)
  // 删除弹框
  const [modalDelete,setModalDelete] = useState(false)
  // 选择的item
  const selectedIndex = useRef(null)
  // 是否展示菜单
  const [showMenu,setShowMenu] = useState(false)
  const goXFlow = (info) => {
    // 拖拽式
    if(info.type === 1) {
      window.open(location.origin+'/experiment/drag/'+info.id)
    }
    else if (info.type === 2) {
      window.open(location.origin+'/experiment/code/'+info.id)
    }
  }
  const selectedItem = useRef(null)
  const clickMenu = (item) => {
    setShowMenu(false)
    if (item === '编辑') {
      setModalEdit(true)
    } else if (item === '删除') {
      setModalDelete(true)
    }
  }
  // 初始化函数
  useEffect(() => {
    search()
  }, []);
  const search = async () => {
    let params = {
      page_num: pageNum.current,
      page_size: pageSize.current,
      type: type.current === '全部' ? null : type.current === '拖拽式' ? 1 : 2,
      filter_name: keyword.current,
    }
    setLoading(true)
    const {data} = await getExperimentList(params)
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
  const onShowSizeChange = (_current, newPageSize) => {
    console.log('into onShowSizeChange: _current: ',_current,' ,newPageSize: ',newPageSize)
    console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
    pageNum.current = 1
    pageSize.current = newPageSize
    pageSizeChange.current = true
    console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
  };
  const keydown = (e) => {
    if(e.keyCode === 13) {
      changeKeyword()
    }
  }
  const createModalOnCancel = () => {
    console.log('into cancel')
    setModalCreate(false)
  }
  const createModalOnOk = async (params) => {
    const {data} = await saveExperiment(params)
    message.success('创建实验成功')
    setModalCreate(false)
    search()
    setTimeout(() => {
      goXFlow(data)
    }, 300)
  }
  const changeSearchType = (value) => {
    type.current = value + ''
    pageNum.current = 1
    search()
  }
  const changeKeyword = () => {
    pageNum.current = 1
    search()
  }
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

  // 编辑弹框
  const editModalOnOk = (data) => {
    console.log(data)
    const params = {
      ...selectedItem.current,
      ...data,
    }
    saveExperiment(params).then(res => {
      console.log(res)
      message.success('修改实验成功')
      search()
    }).catch(err => {
      console.log(err)
    })
    setModalEdit(false)
  }
  const editModalOnCancel = () => {
    console.log('into edit cancel')
    setModalEdit(false)
  }
  // 删除弹框
  const deleteModalOnOk = () => {
    console.log('into deletemodal ok')
    const params = {
      ...selectedItem.current
    }
    console.log(params)
    deleteExperiment(params).then(res => {
      console.log(res)
      message.success('删除实验成功')
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
  return (
    // 最外层
    <div className="w-full flex justify-center">
      {/*主体内容*/}
      <div className="flex flex-col w-[1036px] big:w-[1388px]">
        {/*title*/}
        <div className="mt-6 w-full flex justify-between items-center"
             style={{height:'40px'}}>
          {/*左*/}
          <div className="h-full flex items-center experiment">
            {/*全部，拖拽编码筛选，*/}
            <TypeList list={typeList} value={type.current} change={changeSearchType}/>
            {/*search框筛选*/}
            <SearchBig placeholder='请输入实验名称'
                       defaultValue={keyword.current}
                       change={e => keyword.current = e.target.value}
                       keyDown={e=>keydown(e)}/>
          </div>
          {/*右*/}
          <div className="h-full flex flex-col justify-end">
            <div className="flex justify-center items-center rounded-lg bg-main text-sm text-white hover:bg-main-hover active:bg-main-focus hover:cursor-pointer"
                 style={{width:'76px',height:'28px', boxShadow: '0px 2px 4px 0px rgba(31,199,179,0.2)',lineHeight:'14px',}}
                 onClick={()=>setModalCreate(true)}>
              创建
            </div>
          </div>
        </div>
        {/*中间内容*/}
        <div className="mt-4 w-full">
          {/*暂无数据*/}
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
          {/*加载完成 && 有数据 节点卡片*/}
          {
            pageSum > 0 && !first &&
            <Spin spinning={loading} size="large" tip="加载中...">
							<div className="w-full grid grid-cols-3 big:grid-cols-4 gap-5">
                {
                  data.map((_item,_index) => {
                    return (
                      <div className="w-full rounded-xl bg-white shadow-card p-5 flex flex-col hover:shadow-card-hover hover:cursor-pointer"
                           style={{height:'208px'}} key={_index}
                           onClick={_e => goXFlow(data[_index])}>
                        {/*title*/}
                        <div className="w-full flex justify-between items-center" style={{marginTop:'-4px'}}>
                          {/*左*/}
                          <span className="flex font-semibold text-black-dark text-sm text-hidden"
                                style={{width:'210px'}}>{_item.name}</span>
                          {/*右*/}
                          <Popover title={null}
                                   placement="bottomRight"
                                   overlayClassName={'experiment-popover'}
                                   trigger="click"
                                   open={_index===selectedIndex.current && showMenu}
                                   onOpenChange={handleOpenChange}
                                   content={<InnerMenuComponent list={[{name:'编辑'},{name:'删除'}]} onOk={clickMenu}/>}
                          >
                            <div className="h-full flex items-center text-white-svg hover:text-white-svg-hover"
                                 onClick={e=>clickShowMenu(e,_index)}>
                              <MoreSvg/>
                            </div>
                          </Popover>

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
                            <span className="ml-1 flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover">
                              {
                                _item.type===1?<DragSvg/>:<CodeSvg/>
                              }
                            </span>
                            <span className="ml-1 text-xs text-black-light" style={{lineHeight: '14px'}}>{_item.type===1?'拖拽式':'编码式'}</span>
                            {
                              _item.type===1 &&
                              <span className="flex items-center">
                                <span className="ml-4 flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover"><NodeNumSvg/></span>
                                <span className="ml-1 text-xs text-black-light" style={{lineHeight: '14px'}}>{_item.node_num}</span>
                              </span>
                            }

                          </div>
                          {/*时间*/}
                          <div className="flex items-center">
                            <span className="ml-1 flex items-center text-white-svg-experiment"><TimeSvg/></span>
                            <span className="ml-1 text-xs text-black" style={{lineHeight: '14px'}}>{_item.created_at}</span>
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
      <CreateModal title={'创建实验'}
                   show={modalCreate}
                   onOk={(data)=>createModalOnOk(data)}
                   onCancel={createModalOnCancel}/>
      {/* 编辑弹框 */}
      <EditModal data={selectedItem.current}
                 show={modalEdit}
                 onOk={(data)=>editModalOnOk(data)}
                 onCancel={editModalOnCancel}/>
      {/* 删除弹框 */}
      <DeleteModal data={selectedItem.current}
                   show={modalDelete}
                   onOk={deleteModalOnOk}
                   onCancel={deleteModalOnCancel}/>
    </div>
  )
}

export default Experiment
