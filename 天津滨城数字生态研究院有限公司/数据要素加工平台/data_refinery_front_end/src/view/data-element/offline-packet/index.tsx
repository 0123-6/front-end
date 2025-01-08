import React, {useEffect, useRef, useState} from "react";
import {message, Pagination, Table, Tooltip} from "antd";
import { useHistory } from 'react-router-dom';
import DeleteModal from "./components/DeleteModal";
import ApplyReleaseModal from "./components/ApplyReleaseModal";
import EditModal from "./components/EditModal";
import ViewSvg from "../../../icon/table/ViewSvg";
import EditSvg from "../../../icon/table/EditSvg";
import DeleteSvg from "../../../icon/table/DeleteSvg";
import PublishSvg from "../../../icon/table/PublishSvg";
import SearchBig from "../../../components/SearchBig";
import TypeList from "../../../components/TypeList";
import {del, get, post} from "../../../axios";
import StatusShow from "./components/StatusShow";

export default function OfflinePacket() {
  // state
  const history = useHistory();
  const typeList = ['离线数据包', 'API服务']
  const typeRouteMap = {
    '离线数据包': '/data-element/offline-packet',
    'API服务': '/data-element/api-serve',
  }
  const type = useRef('离线数据包')
  const keyword = useRef('')
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
  const [first,setFirst] = useState(true)
  const [loading,setLoading] = useState(false);
  const [data, setData] = useState([]);
  // 弹框
  const [deleteModal,setDeleteModal] = useState(false);
  const [applyReleaseModal,setApplyReleaseModal] = useState(false);
  const [editModal,setEditModal] = useState(false);
  // mounted
  // 初始化函数
  useEffect(() => {
    search()
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
    setLoading(true)
    const {data} = await get('/drapi/kfp/datarefineries', params)
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
  // chatgpt代码
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 44,
      render: (_text, _record, index) => (pageNum.current-1)*pageSize.current + index + 1
    },
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
      title: '应用领域',
      dataIndex: 'application_field',
      key: 'application_field',
      width: 86,
      render: (_text, _record, _index) => (
        <Tooltip title={_text.join('，')} overlayClassName='my-model-table'>
          <div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}>{_text.join('，')}</div>
        </Tooltip>
      ),
    },
    {
      title: '生产任务名称',
      dataIndex: 'pipeline_task_name',
      key: 'pipeline_task_name',
      width: 251,
      render: (_text, _record, _index) => (
        <Tooltip title={((_text) && (_text)?.length>16)?(_text):null} overlayClassName='my-model-table'>
          <div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
               onClick={() => goPipelineTaskName(_index)}>{_text}</div>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status_desc',
      key: 'status_desc',
      width: 101,
      filters: [
        { text: '未申请', value: '未申请' },
        { text: '待审核', value: '待审核' },
        { text: '已上线', value: '已上线' },
        { text: '已驳回', value: '已驳回' },
        { text: '已下线', value: '已下线' },
      ],
      render: (_text, _record, _index) => (
        <StatusShow status={_text}/>
      ),
    },
    {
      title: '生成时间',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter:true,
      width: 151,
      render: (_text, _record, _index) => (
        <div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 136,
      render: (_text, _record, index) => (
        <span className={"inline-flex items-center text-table-icon"}>
          <Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-blue`}
                  onClick={() => handleView(index)}><ViewSvg /></span>
          </Tooltip>
          <Tooltip title="编辑" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc!=='待审核'&&_record.status_desc!=='已上线')?'hover:cursor-pointer hover:text-green':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc!=='待审核'&&_record.status_desc!=='已上线')?() => handleEdit(index):null}><EditSvg /></span>
          </Tooltip>
          <Tooltip title="申请发布" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc!=='待审核'&&_record.status_desc!=='已上线')?'hover:cursor-pointer hover:text-main':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc!=='待审核'&&_record.status_desc!=='已上线')?() => handleApplyRelease(index):null}><PublishSvg /></span>
          </Tooltip>
          <Tooltip title="删除" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc!=='待审核'&&_record.status_desc!=='已上线')?'hover:cursor-pointer hover:text-red':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc!=='待审核'&&_record.status_desc!=='已上线')?() => handleDelete(index):null}><DeleteSvg /></span>
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

  const goPipelineTaskName = (index) => {
    window.open(location.origin+'/element-processing/production-task/detail/'+data[index].pipeline_task_id)
    // history.push({
    //   pathname: ,
    // })
  }

  const handleView = (index) => {
    console.log(`View record at index ${index}`);
    setSelectItem(data[index])
    history.push('/data-element/offline-packet/detail/'+data[index].id);
  };

  const handleEdit = (index) => {
    console.log(`Edit record at index ${index}`);
    setSelectItem(data[index])
    setEditModal(true)
  };

  const handleDelete = (index) => {
    console.log(`Delete record at index ${index}`);
    setSelectItem(data[index])
    setDeleteModal(true)
  };

  const handleApplyRelease = (index) => {
    console.log(`handleApplyRelease record at index ${index}`);
    setSelectItem(data[index])
    setApplyReleaseModal(true)
  };

  const [selectedItem,setSelectItem] = useState(null);
  const deleteModalOnOk = () => {
    console.log('into deleteModalOnOk')
    del('/drapi/kfp/datarefineries/'+selectedItem.id,null).then(res => {
      console.log('res: ',res)
      message.success('删除成功')
      search()
    })
    setDeleteModal(false)
  }
  const deleteModalOnCancel = () => {
    console.log('into deleteModalOnCancel')
    setDeleteModal(false);
  }

  // 申请发布弹框
  const applyReleaseModalOnOk = () => {
    console.log('into applyReleaseModalOnOk')
    post('/drapi/kfp/datarefineries/applyaudit/'+selectedItem.id,null).then(res => {
      console.log('res: ',res)
      message.success('申请发布成功')
      search()
    })
    setApplyReleaseModal(false)
  }
  const applyReleaseModalOnCancel = () => {
    console.log('into applyReleaseModalOnCancel')
    setApplyReleaseModal(false);
  }

  // 编辑弹框
  const editModalOnOk = (params) => {
    console.log('into editModalOnOk,params: ',params)
    post('/drapi/kfp/datarefineries',{
      ...params,
      id: selectedItem.id,
    }).then(res => {
      console.log('res ',res)
      message.success('修改成功')
      search()
    })
    setEditModal(false)
  }
  const editModalOnCancel = () => {
    console.log('into editModalOnCancel')
    setEditModal(false);
  }

  return (
    // 最外层
    <div className="w-full flex justify-center">
      {/*主体内容*/}
      <div className="flex flex-col w-[1036px] big:w-[1388px]">
        {/*title*/}
        <div className="mt-6 w-full flex justify-between items-center"
             style={{height:'40px'}}>
          {/*左*/}
          <div className={"h-full flex items-center"}>
            {/*离线数据包，API服务*/}
            <TypeList list={typeList} value={type.current} change={changeSearchType}/>
            {/*search框筛选*/}
            <SearchBig placeholder='请输入离线数据包名称'
                       defaultValue={keyword.current}
                       change={e => keyword.current = e.target.value}
                       keyDown={e=>keydown(e)}/>
          </div>
          {/*右*/}
          <div className={"h-full flex items-end"}>
          </div>
        </div>
        {/*table*/}
        <div className={"w-full mt-4"}>
          <Table
            size='small'
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
      {/*单个删除弹框*/}
      <DeleteModal data={selectedItem}
                   show={deleteModal}
                   onCancel={deleteModalOnCancel}
                   onOk={deleteModalOnOk}/>
      <ApplyReleaseModal data={selectedItem}
                   show={applyReleaseModal}
                   onCancel={applyReleaseModalOnCancel}
                   onOk={applyReleaseModalOnOk}/>
      <EditModal data={selectedItem}
                 show={editModal}
                 onCancel={editModalOnCancel}
                 onOk={editModalOnOk}/>

    </div>
  )
}
