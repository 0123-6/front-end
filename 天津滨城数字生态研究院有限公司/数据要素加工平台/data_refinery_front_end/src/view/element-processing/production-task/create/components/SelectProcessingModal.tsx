import React, {useEffect, useRef, useState} from "react";
import {message, Modal, Pagination, Table, Tooltip} from "antd";
import {getElementProcessingList} from "../../../../../axios/xflow";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import SearchBig from "../../../../../components/SearchBig";
import ButtonSecond from "../../../../../components/ButtonSecond";
import ButtonMain from "../../../../../components/ButtonMain";
import {ElementProcessingIOTypeListNotWithAll} from "../../../index";

interface IProps {
  showWhich?:number,//1:输入输出 2. 简介创建时间
  // 额外属性
  [key:string]:any,
}

export default function SelectProcessingModal(props:IProps) {
  // state
  const {showWhich=1} = props
  const keyword = useRef('')
  const pageSize = useRef(10);
  const pageSizeChange = useRef(false);
  const pageNum = useRef(1);
  const [pageSum, setPageSum] = useState(0);
  // 是否是首次加载
  const [first,setFirst] = useState(true)
  const [loading,setLoading] = useState(false);
  const [data, setData] = useState([]);
  // 筛选条件
  const filterInputTypeList = useRef([])
  const filterOutputTypeList = useRef([])
  // 表格列
  let columns = [];
  if(showWhich===1) {
    columns = [
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
        title: '输入格式',
        dataIndex: 'input_type',
        key: 'inputType',
        filters: ElementProcessingIOTypeListNotWithAll,
        width: 100,
      },
      {
        title: '输出格式',
        dataIndex: 'output_type',
        key: 'outputType',
        filters: ElementProcessingIOTypeListNotWithAll,
        width: 100,
      },
    ];
  } else if(showWhich===2) {
    columns = [
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
        title: '简介',
        dataIndex: 'description',
        key: 'description',
        width: 100,
        render: (_text, _record, _index) => (
          <Tooltip title={((_text) && (_text)?.length>6)?(_text):null} overlayClassName='my-model-table'>
            <span className={'w-full text-hidden'}>{(_text)?(_text):'—'}</span>
          </Tooltip>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        // sorter:true,
        width: 151,
        render: (_text, _record, _index) => (
          <div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
        ),
      },
    ];
  }

  const [selectItem,setSelectItem] = useState(null);
  // mounted
  // 初始化函数
  useEffect(() => {
    if(props.show) {
      keyword.current = ''
      search()
    }
  },[props.show]);
  // methods
  const search = async () => {
    const params = {
      page_num: pageNum.current,
      page_size: pageSize.current,
      // 状态 输入类型 输出类型
      // 状态为已通过
      status: 200,
      input_type: filterInputTypeList.current,
      output_type: filterOutputTypeList.current,
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
    setData(data.list.map(item => {
      return {
        ...item,
        key: item.id
      }
    }))
    setPageSum(data.total_num)
    setLoading(false)
    if (first) {
      setFirst(false)
    }
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
  // 表格相关
  const handleChange = (pagination, _filters, sorter) => {
    console.log('Various parameters', pagination, _filters, sorter);
    filterInputTypeList.current = _filters.inputType
    filterOutputTypeList.current = _filters.outputType
    search()
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectItem(selectedRows[0])
    },
  };
  // 点击确定按钮
  const onOk = () => {
    if (selectItem) {
      props.onOk({
        ...selectItem,
      })
      setSelectItem(null)
    } else {
      message.warn('请选择加工流程')
    }
  }
  const onCancel = () => {
    setSelectItem(null)
    props.onCancel()
  }

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
  // 跳转到详情页面
  const handleView = (index) => {
    window.open(location.origin+'/element-processing/detail/'+data[index].id)
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
                 选择加工流程
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
             maskStyle={{}}
             bodyStyle={{}}
             destroyOnClose
             wrapClassName="processing-create"
             footer={null}
             open={props.show}
             onOk={props.onOk}
             onCancel={onCancel}>
        {/*最外层*/}
        <div className={"w-full flex flex-col pl-6 pr-6"} style={{}}>
          {/*搜索*/}
          <div className={"mt-4 w-full"} style={{height:'40px'}}>
            {/*search框筛选*/}
            <SearchBig placeholder={`请输入加工流程名称`}
                       ml={false}
                       defaultValue={keyword.current}
                       change={e => keyword.current = e.target.value}
                       keyDown={e => keydown(e)}/>
          </div>
          {/*table*/}
          <div className={"w-full mt-4 overflow-auto"}>
            <Table
              style={{height:'422px'}}
              scroll={{ y: 380 }}
              size='small'
              loading={loading}
              dataSource={data}
              columns={columns}
              onChange={handleChange}
              pagination={false}
              rowSelection={{
                type: 'radio',
                ...rowSelection,
              }}
            />
          </div>
          {/*分页*/}
          {
            pageSum > 10 &&
            <div className="mt-4 pb-6 w-full flex justify-center">
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
            </div>
          }
          {/*按钮*/}
          <div className="mt-6 pb-6 w-full flex justify-center items-center">
            <ButtonSecond text={'取消'} click={onCancel} style={{width:'61px',height:'32px'}}/>
            <ButtonMain text={'确定'} className={"ml-4"} click={onOk} style={{width:'61px',height:'32px'}}/>
          </div>
        </div>
      </Modal>
    </Draggable>
  )
}
