import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import pic1 from './icon/pic1.jpg';
import pic2 from './icon/pic2.jpg';
import pic3 from './icon/pic3.jpg';
import pic4 from './icon/pic4.jpg';
import pic5 from './icon/pic5.jpg';
import pic6 from './icon/pic6.jpg';
import pic7 from './icon/pic7.jpg';
import pic8 from './icon/pic8.jpg';
import {get} from "../../axios";
import TypeList from "../../components/TypeList";
import SearchBig from "../../components/SearchBig";
import {Pagination, Popover, Select, Spin} from "antd";
import NoSearchData from "../../icon/no-search-data.svg";
import {PopoverContent} from "../data-element/common/PopoverContent";
import TimeSvg from "../../icon/experiment/TimeSvg";
import StatusComponent from "./components/StatusComponent";
import {ModelTypeComponent} from "../my-model/detail/MyModelDetailDetail";

export default function ModelLibrary() {
  // state
  const history = useHistory();
  // 搜索条件
  // type为全部，已授权，我的,未授权,已过期
  const statusList = ['全部', '已授权', '我的']
  const statusMap = {
    '全部': 'all',
    '已授权': 'auth',
    '我的': 'my',
  }
  const status = useRef('全部')

  const keyword = useRef('')
  const pageSize = useRef(16);
  const pageSizeChange = useRef(false);
  const pageNum = useRef(1);
  const [first, setFirst] = useState(true)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  // @ts-ignore
  const falseData = [
    {
      id: 1,
      cover: pic1,
      name: '共享单车-物体检测',
      status_desc: '已授权',
      abstract: '共享单车-物体检测-pytorch',
      user: {
        nickname: '官方模型',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/wOsyhmcXjW.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述共享单车描述',
    },
    {
      id: 2,
      cover: pic2,
      name: '路面积水分割',
      status_desc: '我的',
      abstract: '通过图像分割识别路面积水。',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description: '通过图像分割识别路面积水。',
    },
    {
      id: 3,
      cover: pic3,
      name: '渣土车苫盖识别',
      status_desc: '未授权',
      abstract: '该渣土车苫盖与否检测识别系统采用yolov5算法构建的端到端的检测分类，其应用场景为城市管理；通过算法提取出图片中渣土车的特征',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'该渣土车苫盖与否检测识别系统采用yolov5算法构建的端到端的检测分类，其应用场景为城市管理；通过算法提取出图片中渣土车的特征'
    },
    {
      id: 4,
      cover: pic4,
      name: '车辆识别模型',
      status_desc: '已过期',
      abstract: '企业发展力指数为通过企业景气调查中中企业家对企业经营状况好坏的判断，综合反应经营运行状况和预期走向的指阿斯顿发送到发标。',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'企业发展力指数为通过企业景气调查中中企业家对企业经营状况好坏的判断，综合反应经营运行状况和预期走向的指阿斯顿发送到发标。'
    },
    {
      id: 5,
      cover: pic5,
      name: '电动车检测微调',
      status_desc: '已授权',
      abstract: '该模型用于城市管理场景下的电动车检测。',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'该模型用于城市管理场景下的电动车检测。'
    },
    {
      id: 6,
      cover: pic6,
      name: '危化品车识别',
      status_desc: '已授权',
      abstract: '识别运行在城市道路上的危化品车。',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'识别运行在城市道路上的危化品车。'
    },
    {
      id: 7,
      cover: pic7,
      name: '企业与奖励实体抽取-文本实体抽取',
      status_desc: '已授权',
      abstract: '地方政府为鼓励企业创新进取，出台各种有利企业发展的鼓励政策，政策文件中包含企业描述与奖励措施。本系统可以自动从文件中抽取相应的企业',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'地方政府为鼓励企业创新进取，出台各种有利企业发展的鼓励政策，政策文件中包含企业描述与奖励措施。本系统可以自动从文件中抽取相应的企业'
    },
    {
      id: 8,
      cover: pic8,
      name: '电梯电瓶车识别',
      status_desc: '已授权',
      abstract: '电梯场景的电瓶车识别，可区分电瓶车和自行车。',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'电梯场景的电瓶车识别，可区分电瓶车和自行车。'
    },
    {
      id: 9,
      cover: pic1,
      name: '共享单车-物体检测',
      status_desc: '已授权',
      abstract: '共享单车-物体检测-pytorch',
      user: {
        nickname: '官方模型',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/wOsyhmcXjW.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description:'共享单车-物体检测-pytorch'
    },
    {
      id: 10,
      cover: pic2,
      name: '路面积水分割',
      status_desc: '我的',
      abstract: '通过图像分割识别路面积水。',
      user: {
        nickname: '天津研究院',
        avatar: 'http://minio.model-hubs.cn/web-static/avatar/202306/sn8M0ziRbr.png',
        role_name: '模型提供者',
        description: '模型提供者',
      },
      description: '通过图像分割识别路面积水。',
    },
  ]
  // 全部数量
  const [pageSum, setPageSum] = useState(0);
  const [modelTypeList,setModelTypeList] = useState([])
  // 类型
  const filterType = useRef('all');
  // mounted
  // 初始化函数
  useEffect(() => {
    getModelTypeList()
  }, []);
  useEffect(() => {
    if (modelTypeList.length > 0) {
      search()
    }
  }, [modelTypeList]);
  // methods
  const getModelTypeList = async () => {
    const {data} = await get('/drapi/comp/model/types')
    let list = [
      {
        key: 'all',
        text: '全部',
        label: '全部',
        value: 'all',
      }
    ]
    for(let i=0;i<data.model_types.length;i++){
      list.push({
        key: data.model_types[i].id,
        text: data.model_types[i].name,
        label: data.model_types[i].name,
        value: data.model_types[i].id,
      })
    }
    setModelTypeList(list)
  }
  const search = async () => {
    let params = {
      page_num: pageNum.current,
      page_size: pageSize.current,
      filter_name: keyword.current,
      tab_filter: statusMap[status.current],
      model_type_id: filterType.current!=='all' ? [filterType.current] : null,
    }
    setLoading(true)
    const {data} = await get('/drapi/comp/comps', params)
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

    // setTimeout(() => {
    //   let allDataNum = 0
    //   let _data = []
    //   for (let i = 0; i < falseData.length; i++) {
    //     const newItem = {
    //       ...falseData[i],
    //       type: modelTypeList[(i+1)%modelTypeList.length].value,
    //       type_desc: modelTypeList[(i+1)%modelTypeList.length].text,
    //       cover: falseData[i].cover,
    //       version: modelVersionList[(i+1)%modelVersionList.length].value,
    //       created_at: '2023-03-01 20:30:31',
    //       update_at: '2023-03-01 20:30:31',
    //       description:'# 一、模型任务：\n' +
    //         '图像分类，根据各自在图像信息中所反映的不同特征，把不同类别的目标区分开来的图像处理方法。它利用计算机对图像进行定量分析，把图像或图像中的每个像元或区域划归为若干个类别中的某一种，以代替人的视觉判读。\n' +
    //         '![](http://minio.model-hubs.cn/web-static/avatar/202306/SFEyqQmWIr.png)\n' +
    //         '# 二、模型场景：\n' +
    //         '道路积雪识别有助于大雪天气的道路路面实时预警，提醒城市环卫及时打扫，有助于城市智能化管理。\n' +
    //         '![](http://minio.model-hubs.cn/web-static/avatar/202306/LYi3juTVPx.png)\n' +
    //         '# 三、模型描述：\n' +
    //         '深度残差网络（ResNet）由微软研究院的何恺明、张祥雨、任少卿、孙剑提出。研究动机是为了解决深度网络的退化问题，不同于过去的网络是通过学习去拟合一个分布，ResNet通过学习去拟合相对于上一层输出的残差。实验表明，ResNet能够通过增加深度来提升性能，而且易于优化，参数量更少，在许多常用数据集上有非常优秀的表现。ResNet 在2015 年的ILSVRC（ImageNet Large Scale Visual Recognition Challenge）中取得了冠军。\n' +
    //         '# 四、训练数据：\n' +
    //         '训练数据7000张路面有雪无雪图片\n' +
    //         '\n' +
    //         '| 标签 | 编码 |\n' +
    //         '| --- | --- |\n' +
    //         '| 有雪 | 0 |\n' +
    //         '| 没雪 | 1 |\n' +
    //         '# 五、训练流程\n' +
    //         '深度残差网络（ResNet）由微软研究院的何恺明、张祥雨、任少卿、孙剑提出。研究动机是为了解决深度网络的退化问题，不同于过去的网络是通过学习去拟合一个分布，ResNet通过学习去拟合相对于上一层输出的残差。实验表明，ResNet能够通过增加深度来提升性能，而且易于优化，参数量更少，在许多常用数据集上有非常优秀的表现。ResNet 在2015 年的ILSVRC（ImageNet Large Scale Visual Recognition Challenge）中取得了冠军。',
    //     }
    //     if(filterType.current!=='all' && filterType.current !== newItem.type){
    //       continue
    //     }
    //     if(status.current!=='全部' && status.current !== newItem.status_desc){
    //       continue
    //     }
    //     if(keyword.current && newItem.name.indexOf(keyword.current) === -1){
    //       continue
    //     }
    //     allDataNum++
    //     _data.push(newItem)
    //   }
    //   // 截取出当前页的数据
    //   const start = (pageNum.current - 1) * pageSize.current
    //   const end = start + pageSize.current
    //   _data = _data.slice(start, end)
    //   setData(_data)
    //   setPageSum(allDataNum)
    //   setLoading(false)
    //   if (first) {
    //     setFirst(false)
    //   }
    // }, 200)
  }
  const onShowSizeChange = (_current, newPageSize) => {
    console.log('into onShowSizeChange: _current: ', _current, ' ,newPageSize: ', newPageSize)
    console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
    pageNum.current = 1
    pageSize.current = newPageSize
    pageSizeChange.current = true
    console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
  };
  const keydown = (e) => {
    if (e.keyCode === 13) {
      changeKeyword()
    }
  }
  const changeSearchType = (value) => {
    status.current = value + ''
    pageNum.current = 1
    search()
  }
  const changeKeyword = () => {
    pageNum.current = 1
    search()
  }
  const changePageNum = (value) => {
    console.log('into changePageNum,嘿嘿嘿,传入的value为：', value)
    console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
    if (pageSizeChange.current === true) {
      pageSizeChange.current = false
    } else {
      pageNum.current = value
    }
    console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
    search()
  }
  const goDetail = (_index) => {
    history.push({
      pathname: '/model-library/detail/'+data[_index].id,
      // params: {
      //   data: data[_index]
      // },
    });
  }
  // 筛选条件变化时
  const changeFilterType = (value) => {
    filterType.current = value
    pageNum.current = 1
    search()
  }
  // render
  return (
    // 最外层
    <div className="w-full flex justify-center">
      {/*主体内容*/}
      <div className="flex flex-col w-[1036px] big:w-[1388px]">
        {/*title*/}
        <div className="mt-6 w-full flex justify-between items-center"
             style={{height: '40px'}}>
          {/*左*/}
          <div className="h-full flex items-center experiment">
            {/*全部，拖拽编码筛选，*/}
            <TypeList list={statusList} value={status.current} change={changeSearchType}/>
            {/*search框筛选*/}
            <SearchBig placeholder={`请输入模型名称`}
                       ml={false}
                       style={{width:'284px',height:'36px',marginLeft:'69px'}}
                       defaultValue={keyword.current}
                       change={e => keyword.current = e.target.value}
                       keyDown={e => keydown(e)}/>
            {/*输入类型*/}
            {
              modelTypeList.length > 0 &&
              <div className={"flex items-center"}
                   style={{marginLeft:'82px'}}>
                <div className={"flex items-center text-xs text-black"}>类型</div>
                <div className={"ml-2 flex items-center"}>
                  <Select
                    value={filterType.current}
                    style={{ width: 162 }}
                    onChange={changeFilterType}
                    options={modelTypeList}
                  />
                </div>
              </div>
            }
          </div>
        </div>
        {/*中间内容*/}
        {/*中间内容*/}
        <div className="mt-4 w-full">
          {/*暂无数据*/}
          {
            first &&
            <Spin spinning={loading} size="large" tip="加载中...">
              <div className="w-full"
                   style={{height: '436px'}}>
              </div>
            </Spin>
          }
          {
            pageSum === 0 && !first &&
            <Spin spinning={loading} size="large" tip="加载中...">
              <div className="w-full flex flex-col justify-center items-center"
                   style={{height: '436px'}}>
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
                  data.map((_item, _index) => {
                    return (
                      <div
                        className="w-full bg-white shadow-card flex flex-col hover:shadow-card-hover hover:cursor-pointer group rounded-xl"
                        style={{height: '377px'}}
                        key={_index} onClick={_e => goDetail(_index)}>
                        {/*上部区域*/}
                        <div className={"w-full flex overflow-hidden relative"}
                             style={{height: '187px', borderRadius: '12px 12px 0 0'}}>
                          {/*图片本身*/}
                          <img src={_item.cover} alt=""
                               style={{width: '100%', height: '100%', borderRadius: '12px 12px 0 0'}}/>
                        </div>
                        {/*内容*/}
                        <div className={"w-full pt-[19px] pl-5 pr-4 flex flex-col"}>
                          {/*title*/}
                          <div className="w-full flex justify-between items-center">
                            {/*左*/}
                            <span className="flex font-medium text-black-dark text-base text-hidden"
                                  style={{width: '270px'}}>{_item.name}</span>
                          </div>
                          {/*标签*/}
                          <div className={"mt-3 w-full flex items-center"}
                               style={{height: '22px'}}>
                            {/*左*/}
                            <StatusComponent status_desc={_item?.is_mine ? '我的' : _item?.auth_status_desc}/>
                            {/*右*/}
                            {
                              _item?.type !== 1 &&
                              <ModelTypeComponent status_desc={_item.model_type_desc} className={"ml-2"}/>
                            }
                          </div>
                          {/*文字*/}
                          <div className="mt-2.5 w-full text-sm text-black text-hidden-2"
                               style={{lineHeight: '24px', height: '48px', minHeight: '48px'}}>
                            {_item.abstract}
                          </div>
                          {/*分割线*/}
                          {/*<div style={{*/}
                          {/*  height: '1px',*/}
                          {/*  background: '#f8f8f8',*/}
                          {/*  marginTop: '14px',*/}
                          {/*  width: 'calc(100% + 16px)'*/}
                          {/*}}/>*/}
                          {/*底部*/}
                          <div className="mt-[24px] w-full flex justify-between items-center">
                            {/*头像和名字*/}
                            <Popover title={null}
                                     placement="leftTop"
                                     overlayClassName={'person-popover-2'}
                                     trigger="hover"
                                     open={false}
                                     content={PopoverContent({user:_item?.user})}
                            >
                              <div className={"flex items-center"}>
                                {/*头像*/}
                                <div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
                                     style={{width: '24px',minWidth:'24px',height: '24px',minHeight:'24px'}}>
                                  <img className="" src={(_item?.user?.avatar)?(_item?.user?.avatar):null} alt="" width="24px"/>
                                </div>
                                <span className={"ml-2 flex items-center text-sm max-w-[90px] leading-[14px]"}>{_item?.user?.nickname}</span>
                              </div>
                            </Popover>
                            {/*时间*/}
                            <div className="flex items-center">
                              <span className="flex items-center text-white-svg-experiment"><TimeSvg/></span>
                              <span className="ml-1 text-xs text-black"
                                    style={{lineHeight: '14px'}}>{_item.created_at}</span>
                            </div>
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
                        pageSizeOptions={[8, 12, 16, 20]}
                        current={pageNum.current}
                        total={pageSum}/>
          }
        </div>
      </div>
    </div>
  )
}
