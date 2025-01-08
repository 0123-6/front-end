import React, {useEffect, useRef, useState} from "react";
import {message, Pagination, Popover, Spin} from "antd";
import { useHistory } from 'react-router-dom';
import NoSearchData from "../../../icon/no-search-data.svg";
import MoreSvg from "../../../icon/header/MoreSvg";
import TimeSvg from "../../../icon/experiment/TimeSvg";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import SearchBig from "../../../components/SearchBig";
import TypeList from "../../../components/TypeList";
import StatusCard2 from "../../../components/StatusCard2";
import ButtonMain from "../../../components/ButtonMain";
import {del, get, post} from "../../../axios";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import InnerMenuComponent from "../../../components/InnerMenuComponent";

export default function ApiServe() {
  const history = useHistory();
  // state区域
  // const [modalCreate,setModalCreate] = useState(false)
  // type为全部，拖拽，编码
  const typeList = ['离线数据包', 'API服务']
  const typeRouteMap = {
    '离线数据包': '/data-element/offline-packet',
    'API服务': '/data-element/api-serve',
  }
  const type = useRef('API服务')
  const keyword = useRef('')

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
  // 编辑弹框
  const [modalEdit,setModalEdit] = useState(false)
  // 删除弹框
  const [modalDelete,setModalDelete] = useState(false)
  // 申请弹框
  const [applyModal,setApplyModal] = useState(false);
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
    let params = {
      page_num: pageNum.current,
      page_size: pageSize.current,
      filter_name: keyword.current,
    }
    setLoading(true)
    const {data} = await get('/drapi/apidr/drs', params)
    // 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
    if (data.total_num > 0 && data.list.length === 0 && pageNum.current > 1) {
      pageNum.current -= 1
      search()
      return
    }
    setData(data.list)
    setPageSum(data.total_num)
    if(first) {
      setFirst(false)
    }
    setLoading(false)
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
  const deleteModalOnOk = async () => {
    setModalDelete(false)
    await del('/drapi/apidr/drs/' + selectedItem.current.id, null)
    message.success('删除API服务成功')
    if (data.length === 1 && pageNum.current > 1) {
      pageNum.current -= 1
    }
    search()
  }
  const deleteModalOnCancel = () => {
    console.log('into deletemodal cancel')
    setModalDelete(false)
  }

  // 编辑弹框
  const editModalOnOk = (params) => {
    console.log('into editModalOnOk ok')
    console.log(params)
    // deleteElementProcessing(params).then(res => {
    //   console.log(res)
    //   message.success('删除加工流程成功')
    //   if (data.length === 1 && pageNum.current > 1) {
    //     pageNum.current -= 1
    //   }
    //   search()
    // }).catch(err => {
    //   console.log(err)
    // })
    setModalEdit(false)
  }
  const editModalOnCancel = () => {
    console.log('into editModalOnCancel cancel')
    setModalEdit(false)
  }
  // 申请弹框
  const applyModalOnOk = async () => {
    setApplyModal(false)
    setLoading(true)
    await post('/drapi/apidr/audit/' + selectedItem.current.id, null)
    setLoading(false)
    message.success('申请发布成功')
    search()
  }
  const applyModalOnCancel = () => {
    setApplyModal(false)
  }
  const goDetail = (index) => {
    history.push('/data-element/api-serve/detail/'+data[index].id);
  }
  // 跳转到创建页面
  const goCreatePage = () => {
    history.push({
      pathname: '/data-element/api-serve/create',
    })
  }
  const handleOpenChange = (newOpen: boolean) => {
    setShowMenu(newOpen);
  };
  // 点击三个点
  const clickShowMenu = (e,index) => {
    e.stopPropagation()
    e.preventDefault()
    selectedIndex.current = index
    selectedItem.current = data[index]
    setShowMenu(true)
  }
  const clickMenu = (item) => {
    setShowMenu(false)
    if (item === '编辑') {
      history.push({
        pathname: '/data-element/api-serve/detail/'+selectedItem.current.id,
        params: {
          isEdit: true,
        }
      })
    } else if (item === '删除') {
      setModalDelete(true)
    } else if (item === '申请发布') {
      setApplyModal(true)
    }
  }
  // template
  return (
    // 最外层
    <div className="w-full flex justify-center">
      {/*主体内容*/}
      <div className="flex flex-col w-[1036px] big:w-[1388px]">
        {/*title*/}
        <div className="mt-6 w-full flex justify-between items-center"
             style={{height:'40px'}}>
          {/*左*/}
          <div className="h-full flex items-center">
            {/*离线数据包，API服务*/}
            <TypeList list={typeList} value={type.current} change={changeSearchType}/>
            {/*search框筛选*/}
            <SearchBig placeholder='请输入API服务名称'
                       defaultValue={keyword.current}
                       change={e => keyword.current = e.target.value}
                       keyDown={e=>keydown(e)}/>
          </div>
          {/*右*/}
          <div className="h-full flex flex-col justify-end">
            <ButtonMain text={'创建'}
                        click={goCreatePage}
                        style={{width:'76px',height:'28px',}}
                        showShadow={true}/>
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
                          {/*右*/}
                          <div className={"flex items-center h-full"}>
                            {/*左*/}
                            <StatusCard2 status={_item.status_desc}/>
                            {/*右*/}
                            <Popover title={null}
                                     placement="bottomRight"
                                     overlayClassName={'experiment-popover'}
                                     trigger="click"
                                     open={_index===selectedIndex.current && showMenu}
                                     onOpenChange={handleOpenChange}
                                     content={<InnerMenuComponent list={(_item.status_desc==='待审核' || _item.status_desc==='已上线' || _item.status_desc==='部署中')?[{name:'编辑',disabled:true},{name:'申请发布',disabled:true},{name:'删除',disabled:true}]:[{name:'编辑'},{name:'申请发布'},{name:'删除'}]} onOk={clickMenu}/>}
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
      {/*各种弹DeleteModal框*/}
      {/*编辑弹框*/}
      <EditModal data={selectedItem.current}
                   show={modalEdit}
                   onCancel={editModalOnCancel}
                   onOk={editModalOnOk}/>
      {/*删除弹框*/}
      <DeleteModal data={selectedItem.current}
                   show={modalDelete}
                   onCancel={deleteModalOnCancel}
                   onOk={deleteModalOnOk}/>
      {/*申请弹框*/}
      <DraggableModalPrompt
        show={applyModal}
        onOk={applyModalOnOk}
        onCancel={applyModalOnCancel}>
        <span className="text-sm text-black">确定申请发布<span className="text-main pl-1 pr-1">{selectedItem.current?.name}</span>吗？</span>
      </DraggableModalPrompt>
    </div>
  )
}
