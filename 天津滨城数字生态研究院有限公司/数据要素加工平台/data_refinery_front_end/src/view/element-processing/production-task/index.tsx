import React, {useEffect, useRef, useState} from "react";
import {message, Pagination, Table, Tooltip} from "antd";
import { useHistory } from 'react-router-dom';
import BatchRunModal from "./components/BatchRunModal";
import BatchStopModal from "./components/BatchStopModal";
import BatchDeleteModal from "./components/BatchDeleteModal";
import DeleteModal from "./components/DeleteModal";
import {del, get, post} from "../../../axios";
import RunSvg from "../../../icon/table/RunSvg";
import StopSvg from "../../../icon/table/StopSvg";
import ViewSvg from "../../../icon/table/ViewSvg";
import EditSvg from "../../../icon/table/EditSvg";
import DeleteSvg from "../../../icon/table/DeleteSvg";
import ButtonThird from "../../../components/ButtonThird";
import SearchBig from "../../../components/SearchBig";
import TypeList from "../../../components/TypeList";
import StatusShow from "./components/StatusShow";
import modelSvg from './icon/model.svg'

export default function ProductionTask() {
  // state
  const history = useHistory();
  const typeList = ['加工流程', '生产任务']
  const typeRouteMap = {
    '加工流程': '/element-processing',
    '生产任务': '/element-processing/production-task',
  }
  const type = useRef('生产任务')
  const keyword = useRef('')
  // 状态筛选
  // const statusList = [
  //   {
  //     label:'未运行',
  //     value:'未运行',
  //   },
  //   {
  //     label:'已停止',
  //     value:'已停止',
  //   },
  //   {
  //     label:'运行中',
  //     value:'运行中',
  //   },
  //   {
  //     label:'运行成功',
  //     value:'运行成功',
  //   },
  //   {
  //     label:'运行失败',
  //     value:'运行失败',
  //   },
  // ]
  // @ts-ignore
  const statusList = [
    {
      name: '运行中',
      value:'Pending',
    },
    {
      name: '运行失败',
      value:'Failed',
    },
    {
      name: '运行成功',
      value:'Succeeded',
    },
    {
      name: '运行失败',
      value:'Omitted',
    },
    {
      name: '运行中',
      value:'Running',
    },
    {
      name: '已停止',
      value:'Stop',
    },
    {
      name: '未运行',
      value:'',
    },
  ]

  const filterStatusList = useRef([])
  // 升降序
  // 升序
  const orderByAsc = useRef('')
  // 降序
  const orderByDesc = useRef('')
  const pageSize = useRef(10);
  const pageSizeChange = useRef(false);
  const pageNum = useRef(1);
  const [pageSum, setPageSum] = useState(0);
  // 是否是首次加载
  const first = useRef(true)
  const [loading,setLoading] = useState(false);
  const [data, setData] = useState([]);
  // 轮询
  const timer = useRef(null)
  // 弹框
  const [batchRunModal,setBatchRunModal] = useState(false)
  const [batchStopModal,setBatchStopModal] = useState(false)
  const [batchDeleteModal,setBatchDeleteModal] = useState(false);
  const [deleteModal,setDeleteModal] = useState(false);
  // mounted
  // 初始化函数
  useEffect(() => {
    timer.current = setInterval(()=>{
      search()
    },5000)
    search()
    return () => {
      clearInterval(timer.current)
    }
  }, []);
  // methods
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
  const search = async () => {
    console.log('into search method')
    let params = {
      page_num: pageNum.current,
      page_size: pageSize.current,
      filter_name: keyword.current,
      status: filterStatusList.current,
      order_by_desc: orderByDesc.current,
      order_by_asc: orderByAsc.current,
    }
    if (first.current) {
      setLoading(true)
    }
    const {data} = await get('/drapi/kfp/pipeline/task/list/v2', params)
    for (let i = 0; i < data.list.length; i++) {
      data.list[i] = {
        ...data.list[i],
        key: data.list[i].id,
      }
    }
    // 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
    if (data.total_num > 0 && data.list.length === 0 && pageNum.current > 1) {
      pageNum.current -= 1
      search()
      return
    }
    setData(data.list)
    setPageSum(data.total_num)
    setLoading(false)
    first.current = false
    // 如果结果没有运行中的，则删除计时器
    if (data.list.every(item => item.status_desc !== '运行中')) {
      clearTimeout(timer.current)
    }
  }
  // 跳转到创建页面
  const goCreatePage = () => {
    history.push({
      pathname: '/element-processing/production-task/create',
    })
  }
  // 批量运行弹框
  const batchRunModalOnOk = () => {
    console.log('into batchRunModalOnOk ok')
    // const params = {
    //   ...selectedItem.current
    // }
    // console.log(params)
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
    setBatchRunModal(false)
  }
  const batchRunModalOnCancel = () => {
    console.log('into batchRunModalOnOk cancel')
    setBatchRunModal(false)
  }

  // 批量停止弹框
  const batchStopModalOnOk = () => {
    console.log('into batchStopModalOnOk ok')
    // const params = {
    //   ...selectedItem.current
    // }
    // console.log(params)
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
    setBatchStopModal(false)
  }
  const batchStopModalOnCancel = () => {
    console.log('into batchStopModalOnCancel cancel')
    setBatchStopModal(false)
  }

  // 批量删除弹框
  const batchDeleteModalOnOk = () => {
    console.log('into batchDeleteModalOnOk ok')
    // const params = {
    //   ...selectedItem.current
    // }
    // console.log(params)
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
    setBatchDeleteModal(false)
  }
  const batchDeleteModalOnCancel = () => {
    console.log('into batchDeleteModalOnCancel cancel')
    setBatchDeleteModal(false)
  }
  const goDataElementOfflinePacketDetail = (_index) => {
    console.log(data[_index].dr_id)
    if (data[_index].dr_id) {
      window.open('/data-element/offline-packet/detail/' + data[_index].dr_id)
    }
  }
  // 分页相关
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
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 40,
      render: (_text, _record, _index) => (
        <div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 251,
      render: (_text, _record, _index) => (
        <Tooltip title={((_text) && (_text)?.length>16)?(_text):null} overlayClassName='my-model-table'>
          <div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
               onClick={() => handleView(_index)}>{_text}</div>
        </Tooltip>
      ),
    },
    {
      title: '加工节点数',
      dataIndex: 'node_num',
      key: 'node_num',
      sorter:true,
      width: 101,
    },
    {
      title: '开始时间',
      dataIndex: 'started_at',
      key: 'started_at',
      sorter:true,
      width: 151,
      render: (_text, _record, _index) => (
        <div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
      ),
    },
    {
      title: '结束时间',
      dataIndex: 'finished_at',
      key: 'finished_at',
      sorter:true,
      width: 151,
      render: (_text, _record, _index) => (
        <div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
      ),
    },
    {
      title: '运行时间',
      dataIndex: 'run_time',
      key: 'run_time',
      sorter:true,
      width: 87,
      render: (_text, _record, _index) => (
        <span>{_text?_text:'-'}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status_desc',
      key: 'status_desc',
      width: 101,
      filters: [
        { text: '未运行', value: '未运行' },
        { text: '已停止', value: '已停止' },
        { text: '运行中', value: '运行中' },
        { text: '运行失败', value: '运行失败' },
        { text: '运行成功', value: '运行成功' },
      ],
      render: (_text, _record, _index) => (
        <StatusShow status={_text}/>
      ),
    },
    {
      title: '要素名称',
      dataIndex: 'dr_name',
      key: 'dr_name',
      width: 236,
      render: (_text, _record, _index) => (
        <div className={`w-full flex items-center
         ${_record.status_desc==='运行成功'?'hover:cursor-pointer hover:text-main':''}`}
              onClick={() => goDataElementOfflinePacketDetail(_index)}>
          <div className={"mr-1 flex"}
                style={{width:'23px',height:'23px'}}>
            {_record.status_desc==='运行成功' && <img src={modelSvg} alt="" style={{width:'100%',height:'100%'}}/>}
          </div>
          <Tooltip title={((_text) && (_text)?.length>16)?(_text):null} overlayClassName='my-model-table'>
            <span className={"w-[193px] flex items-center text-hidden"}>{_text}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 166,
      render: (_text, _record, index) => (
        <span className={"w-full inline-flex items-center text-table-icon"}>
          <Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-blue`} onClick={() => handleView(index)}><ViewSvg /></span>
          </Tooltip>
          <Tooltip title="编辑" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc!=='运行中'&&_record.status_desc!=='运行成功')?'hover:cursor-pointer hover:text-green':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc!=='运行中'&&_record.status_desc!=='运行成功')?() => handleEdit(index):null}><EditSvg /></span>
          </Tooltip>
          <Tooltip title="运行" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc!=='运行中'&&_record.status_desc!=='运行成功')?'hover:cursor-pointer hover:text-main':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc!=='运行中'&&_record.status_desc!=='运行成功')?() => handleRun(index):null}><RunSvg /></span>
          </Tooltip>
          <Tooltip title="停止" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='运行中')?'hover:cursor-pointer hover:text-orange':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='运行中')?() => handleStop(index):null}><StopSvg /></span>
          </Tooltip>
          <Tooltip title="删除" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc!=='运行中'&&_record.status_desc!=='运行成功')?'hover:cursor-pointer hover:text-red':'text-table-icon-disable hover:cursor-not-allowed'}`}
                  onClick={(_record.status_desc!=='运行中'&&_record.status_desc!=='运行成功')?() => handleDelete(index):null}><DeleteSvg /></span>
          </Tooltip>
        </span>
      ),
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    filterStatusList.current = filters.status_desc
    orderByAsc.current = null
    orderByDesc.current = null
    if (sorter && sorter.order) {
      if (sorter.order === 'ascend') {
        orderByAsc.current = sorter.columnKey
      } else if (sorter.order === 'descend') {
        orderByDesc.current = sorter.columnKey
      }
    }
    search()
  };

  const handleRun = (index) => {
    setSelectItem(data[index])
    const params = {
      id: data[index].id,
      pipeline_task_id:data[index].id
    }
    post('/drapi/kfp/pipeline/task/run/v2',params).then(res => {
      console.log(res)
      message.success('运行成功')
      timer.current = setInterval(()=>{
        search()
      },5000)
      search()
    })
  }

  const handleStop = (index) => {
    setSelectItem(data[index])
    const params = {
      id: data[index].id,
      pipeline_task_id:data[index].id
    }
    post('/drapi/kfp/pipeline/task/stop',params).then(res => {
      console.log(res)
      message.success('停止运行成功')
      timer.current = setInterval(()=>{
        search()
      },5000)
      search()
    })
  }

  const handleDelete = (index) => {
    console.log(`Delete record at index ${index}`);
    setSelectItem(data[index])
    setDeleteModal(true)
  };

  const deleteModalOnOk = () => {
    const params = {
      ...selectedItem
    }
    del('/drapi/kfp/pipeline/task/delete',params).then(res => {
      console.log(res)
      message.success('删除生产任务成功')
      if (data.length === 1 && pageNum.current > 1) {
        pageNum.current -= 1
      }
      timer.current = setInterval(()=>{
        search()
      },5000)
      search()
    }).catch(err => {
      console.log(err)
    })
    setDeleteModal(false)
  }
  const deleteModalOnCancel = () => {
    console.log('into deleteModalOnCancel')
    setDeleteModal(false);
  }

  const handleView = (index) => {
    console.log(`View record at index ${index}`);
    setSelectItem(data[index])
    history.push({
      pathname: '/element-processing/production-task/detail/'+data[index].id,
    })
  };

  const handleEdit = (index) => {
    console.log(`Edit record at index ${index}`);
    setSelectItem(data[index])
    history.push({
      pathname: '/element-processing/production-task/edit/'+data[index].id,
    })
  };

  // 多选选择的项
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    let newSelectedRows = []
    newSelectedRowKeys.forEach(
      (item)=>{
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === item) {
            newSelectedRows.push(data[i])
          }
        }
      }
    )
    setSelectedRows(newSelectedRows)
    setSelectedRowKeys(newSelectedRowKeys);
  };
  // 多选选择的项
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows,setSelectedRows] = useState<any[]>([]);
  // 单选选择的项
  const [selectedItem,setSelectItem] = useState(null);
  const rowSelection = {
    selectedRowKeys:selectedRowKeys,
    onChange: onSelectChange,
  };

  // @ts-ignore
  return (
    // 最外层
    <div className="w-full flex justify-center">
      {/*主体内容*/}
      <div className="w-[1036px] big:w-[1388px] flex flex-col">
        {/*title*/}
        <div className="mt-6 w-full flex justify-between items-center"
             style={{height:'40px'}}>
          {/*左*/}
          <div className={"h-full flex items-center"}>
            {/*加工流程，生产任务*/}
            <TypeList list={typeList} value={type.current} change={changeSearchType}/>
            {/*search框筛选*/}
            <SearchBig placeholder='请输入生产任务名称'
                       defaultValue={keyword.current}
                       change={e => keyword.current = e.target.value}
                       keyDown={e=>keydown(e)}/>
          </div>
          {/*右*/}
          <div className={"h-full flex items-end"}>
            <button className="flex justify-center items-center rounded-lg bg-main text-sm text-white hover:bg-main-hover active:bg-main-focus hover:cursor-pointer"
                 style={{width:'76px',height:'28px', boxShadow: '0px 2px 4px 0px rgba(31,199,179,0.2)',lineHeight:'14px',}}
                 onClick={goCreatePage}>
              创建
            </button>
            <ButtonThird className={"ml-3"} style={{width:'88px',height:'28px'}}
                         disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.status_desc!=='运行中' && _item.status_desc!=='运行成功'))}
                         text={'批量运行'} click={_e=>setBatchRunModal(true)}/>
            <ButtonThird className={"ml-3"} style={{width:'88px',height:'28px'}}
                         disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.status_desc==='运行中'))}
                         text='批量停止' click={_e=>setBatchStopModal(true)} />
            <ButtonThird className={"ml-3"} style={{width:'88px',height:'28px'}}
                         disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.status_desc!=='运行中' && _item.status_desc!=='运行成功'))}
                         text='批量删除'  click={_e=>setBatchDeleteModal(true)}/>
          </div>
        </div>
        {/*table*/}
        <div className={"w-full mt-4"}>
          <Table
            size='small'
            rowSelection={rowSelection}
            loading={loading}
            dataSource={data}
            // @ts-ignore
            columns={columns}
            onChange={handleChange}
            pagination={false}
            scroll={{ x: 'max-content' }} // 设置自适应宽度
          />
        </div>
        {/*分页*/}
        <div className="mt-6 pb-6 w-full flex justify-center">
          {
            pageSum > 10 &&
						<Pagination showSizeChanger
												showQuickJumper
												showTitle={false}
												showTotal={total => `共${total}条`}
												onShowSizeChange={onShowSizeChange}
												onChange={value => changePageNum(value)}
												defaultPageSize={pageSize.current}
												defaultCurrent={1}
												pageSizeOptions={[10,20,30,40]}
												current={pageNum.current}
												total={pageSum} />
          }
        </div>
      </div>
      {/*批量运行弹框*/}
      <BatchRunModal data={null}
                   show={batchRunModal}
                   onCancel={batchRunModalOnCancel}
                   onOk={batchRunModalOnOk}/>
      {/*批量停止弹框*/}
      <BatchStopModal data={null}
                     show={batchStopModal}
                     onCancel={batchStopModalOnCancel}
                     onOk={batchStopModalOnOk}/>
      {/*批量删除弹框*/}
      <BatchDeleteModal data={null}
                     show={batchDeleteModal}
                     onCancel={batchDeleteModalOnCancel}
                     onOk={batchDeleteModalOnOk}/>
      {/*单个删除弹框*/}
      <DeleteModal data={selectedItem}
                   show={deleteModal}
                   onCancel={deleteModalOnCancel}
                   onOk={deleteModalOnOk}/>
    </div>
  )
}
