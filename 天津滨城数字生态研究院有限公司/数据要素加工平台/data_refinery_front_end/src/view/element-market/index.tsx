import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';

import SearchBig from "../../components/SearchBig";
import {Pagination, Spin} from "antd";
import NoSearchData from "../../icon/no-search-data.svg";
import TimeSvg from "../../icon/experiment/TimeSvg";
import {ModelTypeComponent} from "../my-model/detail/MyModelDetailDetail";
import {applicationFieldListWithAll, modelVersionList} from "../../utils/static";
import ApiInterfaceSvg from "./icon/ApiInterfaceSvg";
import OfflinePacketSvg from "./icon/OfflinePacketSvg";



// 要素类型列表
const featureTypeList = [
  '全部',
  'API接口',
  '离线数据包',
]

export default function ElementMarket() {
  // state
  const history = useHistory();
  // 搜索条件
  // 应用领域
  const [applicationField, setApplicationField] = useState('全部')
  // 要素类型
  const [featureType, setFeatureType] = useState('全部')

  const keyword = useRef('')
  const pageSize = useRef(16);
  const pageSizeChange = useRef(false);
  const pageNum = useRef(1);
  const [first, setFirst] = useState(true)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const falseData = [
    {
      id: 1,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/6Hcjnmed3S.png',
      name: '犯罪视频行为分类识别',
      abstract: '随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频，随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频',
      description: '随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频，随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频',
      application_field: '智慧交通',
      feature_type: 'API接口',
    },
    {
      id: 2,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/ia4pwd1HjB.png',
      name: '企业经营指数',
      abstract: '企业发展力指数为通过企业景气调查中中企业家对企业经营状况好坏的判断，综合反应经营运行状况和预期走向的指阿斯顿发送到发标。',
      description: '企业发展力指数为通过企业景气调查中中企业家对企业经营状况好坏的判断，综合反应经营运行状况和预期走向的指阿斯顿发送到发标。',
      application_field: '智慧政务',
      feature_type: 'API接口',
    },
    {
      id: 3,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/fuGIk4g96U.png',
      name: '图像特征512维表示',
      abstract: '该要素为图片或文本的512维特征向量，首先基于图像标签集合，构造text prompt并将其通过clip的向量,该要素为图片或文本的512维特征向量，首先基于图像标签集合，构造text prompt并将其通过clip的向量',
      description: '该要素为图片或文本的512维特征向量，首先基于图像标签集合，构造text prompt并将其通过clip的向量,该要素为图片或文本的512维特征向量，首先基于图像标签集合，构造text prompt并将其通过clip的向量',
      application_field: '跨模态搜索',
      feature_type: '离线数据包',
    },
    {
      id: 4,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/LGjI8erEvh.png',
      name: '车流量数据及其车型、颜色、朝向信息车流量数据',
      abstract: '该要素可输出道路断面流量数据及其车辆相关信息。车流量统计可以帮助管理者从宏观上了解路上车辆的基本信息，制定更加符合实际的红绿灯策略。',
      description: '该要素可输出道路断面流量数据及其车辆相关信息。车流量统计可以帮助管理者从宏观上了解路上车辆的基本信息，制定更加符合实际的红绿灯策略。',
      application_field: '智慧城市',
      feature_type: '离线数据包',
    },
    {
      id: 5,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/Y3eNQK1ycO.png',
      name: '音频的分类信息',
      abstract: '该要素可输出音频的分类信息，包括音频的分类标签、分类得分、分类置信度。',
      description: '该要素可输出音频的分类信息，包括音频的分类标签、分类得分、分类置信度。',
      application_field: '民生服务',
      feature_type: 'API接口',
    },
    {
      id: 6,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/GDjbgYqptl.png',
      name: '市民热线文本特征',
      abstract: '首先对一段时域音频做快 速傅 里叶变化得到频谱图，再利用卷积网络对频谱图进行特征提取以及分类。',
      description: '首先对一段时域音频做快 速傅 里叶变化得到频谱图，再利用卷积网络对频谱图进行特征提取以及分类。',
      application_field: '智慧城市',
      feature_type: '离线数据包',
    },
    {
      id: 7,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/CdtucePH8s.png',
      name: '经营异常企业识别清单',
      abstract: '通过企业的经营与知识产权数据，用决策树方法来判断企业是否为经营异常企业。识别经营异常企业是否为异常企业。',
      description: '通过企业的经营与知识产权数据，用决策树方法来判断企业是否为经营异常企业。识别经营异常企业是否为异常企业。',
      application_field: '数字政务',
      feature_type: '离线数据包',
    },
    {
      id: 8,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/13GWKXqHzO.png',
      name: '产业经济',
      abstract: '通过企业的用电负荷时间与数量数据，计算企业某月的电力负荷月增长率。企业电力负荷月增长率是企业用电负荷月增长率的平均值。',
      description: '通过企业的用电负荷时间与数量数据，计算企业某月的电力负荷月增长率。企业电力负荷月增长率是企业用电负荷月增长率的平均值。',
      application_field: '智慧城市',
      feature_type: '离线数据包',
    },
    {
      id: 9,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/6Hcjnmed3S.png',
      name: '犯罪视频行为分类识别',
      abstract: '随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频，随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频',
      description: '随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频，随着平安城市项目的不断推进，我国大部分城市已经实现监控全覆盖，并且每天产生海量的监控视频',
      application_field: '智慧交通',
      feature_type: 'API接口',
    },
    {
      id: 10,
      pic: 'http://minio.model-hubs.cn/web-static/model-cover/202306/ia4pwd1HjB.png',
      name: '企业经营指数',
      abstract: '企业发展力指数为通过企业景气调查中中企业家对企业经营状况好坏的判断，综合反应经营运行状况和预期走向的指阿斯顿发送到发标。',
      description: '企业发展力指数为通过企业景气调查中中企业家对企业经营状况好坏的判断，综合反应经营运行状况和预期走向的指阿斯顿发送到发标。',
      application_field: '智慧政务',
      feature_type: 'API接口',
    },
  ]
  // 全部数量
  const [pageSum, setPageSum] = useState(0);
  // mounted
  // 初始化函数
  useEffect(() => {
    search()
  }, []);
  useEffect(() => {
    pageNum.current = 1
    search()
  }, [applicationField,featureType]);
  // methods
  const search = () => {
    setLoading(true)
    setTimeout(() => {
      let allDataNum = 0
      let _data = []
      for (let i = 0; i < falseData.length; i++) {
        const newItem = {
          ...falseData[i],
          cover: falseData[i].pic,
          version: modelVersionList[(i+1)%modelVersionList.length].value,
          created_at: '2023-03-01 20:30:31',
          update_at: '2023-03-01 20:30:31',
          description:'# 一、模型任务：\n' +
            '图像分类，根据各自在图像信息中所反映的不同特征，把不同类别的目标区分开来的图像处理方法。它利用计算机对图像进行定量分析，把图像或图像中的每个像元或区域划归为若干个类别中的某一种，以代替人的视觉判读。\n' +
            '![](http://minio.model-hubs.cn/web-static/avatar/202306/SFEyqQmWIr.png)\n' +
            '# 二、模型场景：\n' +
            '道路积雪识别有助于大雪天气的道路路面实时预警，提醒城市环卫及时打扫，有助于城市智能化管理。\n' +
            '![](http://minio.model-hubs.cn/web-static/avatar/202306/LYi3juTVPx.png)\n' +
            '# 三、模型描述：\n' +
            '深度残差网络（ResNet）由微软研究院的何恺明、张祥雨、任少卿、孙剑提出。研究动机是为了解决深度网络的退化问题，不同于过去的网络是通过学习去拟合一个分布，ResNet通过学习去拟合相对于上一层输出的残差。实验表明，ResNet能够通过增加深度来提升性能，而且易于优化，参数量更少，在许多常用数据集上有非常优秀的表现。ResNet 在2015 年的ILSVRC（ImageNet Large Scale Visual Recognition Challenge）中取得了冠军。\n' +
            '# 四、训练数据：\n' +
            '训练数据7000张路面有雪无雪图片\n' +
            '\n' +
            '| 标签 | 编码 |\n' +
            '| --- | --- |\n' +
            '| 有雪 | 0 |\n' +
            '| 没雪 | 1 |\n' +
            '# 五、训练流程\n' +
            '深度残差网络（ResNet）由微软研究院的何恺明、张祥雨、任少卿、孙剑提出。研究动机是为了解决深度网络的退化问题，不同于过去的网络是通过学习去拟合一个分布，ResNet通过学习去拟合相对于上一层输出的残差。实验表明，ResNet能够通过增加深度来提升性能，而且易于优化，参数量更少，在许多常用数据集上有非常优秀的表现。ResNet 在2015 年的ILSVRC（ImageNet Large Scale Visual Recognition Challenge）中取得了冠军。',
        }
        // 应用领域筛选
        if(applicationField !== '全部' && applicationField !== newItem.application_field){
          continue
        }
        // 要素类型筛选
        if(featureType !== '全部' && featureType !== newItem.feature_type){
          continue
        }
        if(keyword.current && newItem.name.indexOf(keyword.current) === -1){
          continue
        }
        allDataNum++
        _data.push(newItem)
      }
      // 截取出当前页的数据
      const start = (pageNum.current - 1) * pageSize.current
      const end = start + pageSize.current
      _data = _data.slice(start, end)
      setData(_data)
      setPageSum(allDataNum)
      setLoading(false)
      if (first) {
        setFirst(false)
      }
    }, 200)
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
  // 改变应用领域
  const changeApplicationField = (value) => {
    if(applicationField !== value+'') {
      setApplicationField(value+'')
    }
  }
  const changeFeatureType = (value) => {
    if(featureType !== value+'') {
      setFeatureType(value+'')
    }
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
      pathname: '/element-market/detail/'+data[_index].id,
      params: {
        data: data[_index]
      },
    });
  }
  // render
  return (
    // 最外层
    <div className="w-full flex justify-center">
      {/*主体内容*/}
      <div className="flex flex-col w-[1036px] big:w-[1388px]">
        {/*上*/}
        <div className="mt-6 w-full flex flex-col text-sm leading-[14px]">
          {/*应用领域*/}
          <div className={"w-full flex"}>
            <div className={"h-[32px] flex items-center flex-shrink-0"}>
              <span className={"flex items-center"}>应用领域</span>
            </div>
            <div className={"flex-grow flex flex-wrap"}>
              {
                applicationFieldListWithAll.map((item, index) => (
                  <div key={index}
                       className={`w-[100px] h-[32px] ml-4 mb-4 flex justify-center items-center rounded cursor-pointer
                    ${applicationField!==item?'bg-white hover:text-main':'bg-main text-white font-medium'}
                  `}
                       style={{
                         boxShadow: '0px 1px 4px 0px rgba(235,235,235,0.56)',
                       }}
                       onClick={() => changeApplicationField(item)}
                  >{item}</div>
                ))
              }
            </div>
          </div>
          {/*要素类型*/}
          <div className={"w-full flex"}>
            <div className={"h-[32px] flex items-center flex-shrink-0"}>
              <span className={"flex items-center"}>要素类型</span>
            </div>
            <div className={"flex-grow flex flex-wrap"}>
              {
                featureTypeList.map((item, index) => (
                  <div key={index}
                       className={`w-[100px] h-[32px] ml-4 mb-4 flex justify-center items-center rounded cursor-pointer
                    ${featureType!==item?'bg-white hover:text-main':'bg-main text-white font-medium'}
                  `}
                       style={{
                         boxShadow: '0px 1px 4px 0px rgba(235,235,235,0.56)',
                       }}
                       onClick={() => changeFeatureType(item)}
                  >{item}</div>
                ))
              }
            </div>
          </div>
          {/*search框筛选*/}
          <SearchBig placeholder={`请输入产品名称`}
                     ml={false}
                     style={{width:'284px',height:'36px',marginTop:'8px'}}
                     defaultValue={keyword.current}
                     change={e => keyword.current = e.target.value}
                     keyDown={e => keydown(e)}/>
        </div>
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
                        style={{height: '353px'}}
                        key={_index} onClick={_e => goDetail(_index)}>
                        {/*上部区域*/}
                        <div className={"w-full flex overflow-hidden relative"}
                             style={{height: '187px', borderRadius: '12px 12px 0 0'}}>
                          {/*图片本身*/}
                          <img src={_item.pic} alt=""
                               style={{width: '100%', height: '100%', borderRadius: '12px 12px 0 0'}}/>
                          {/*title*/}
                          <div className="w-full h-[46px] flex items-center absolute bottom-0"
                               style={{background: 'rgba(37,37,37,0.78)'}}>
                            {/*左*/}
                            <span className="w-full pl-5 flex items-center font-medium text-white text-base leading-4 text-hidden">{_item.name}</span>
                          </div>
                        </div>
                        {/*内容*/}
                        <div className={"w-full pt-[20px] pl-5 pr-4 flex flex-col"}>
                          {/*文字*/}
                          <div className="w-full text-sm text-black text-hidden-2"
                               style={{lineHeight: '25px', height: '50px', minHeight: '50px'}}>
                            {_item.abstract}
                          </div>
                          {/*标签*/}
                          <div className={"mt-3 w-full flex items-center"}
                               style={{height: '22px'}}>
                            {/*右*/}
                            <ModelTypeComponent status_desc={_item.application_field} color={'main'}/>
                          </div>
                          {/*底部*/}
                          <div className="mt-[26px] w-full flex justify-between items-center">
                            <div className={"flex items-center"}>
                              {_item.feature_type==='API接口' && <ApiInterfaceSvg/>}
                              {_item.feature_type==='离线数据包' && <OfflinePacketSvg/>}
                              <span className={"ml-1 flex items-center"}>{_item.feature_type}</span>
                            </div>
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
