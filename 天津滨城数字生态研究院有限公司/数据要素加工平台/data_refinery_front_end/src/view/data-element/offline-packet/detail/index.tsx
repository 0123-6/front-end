import React, {useEffect, useState} from "react";
import XflowSmall from "../../../../components/xflow-small";
import { useHistory } from 'react-router-dom';
import Title from "../../../../components/Title";
import {get, post} from "../../../../axios";
import {message, Popover, Spin, Table, Tooltip} from "antd";
import NavigationComponent from "../../../../components/NavigationComponent";
import StatusShow from "../components/StatusShow";
import FiledCard from "../../../../components/FiledCard";
import titleSvg from './icon/title.svg'
import ButtonFifth from "../../../../components/ButtonFifth";
import ApplyReleaseModal from "../components/ApplyReleaseModal";
import EditModal from "../components/EditModal";
import DataType from "../../../element-processing/detail/components/DataType";
import RiskFactor from "../../../../components/RiskFactor";
import pic1 from "../../../data-resource/icon/pic11.png";

import DataElement from '../../icon/DataElement.svg'
import DataElementActive from '../../icon/DataElementActive.svg'
import OfflinePacket from '../../icon/OfflinePacket.svg'
import OfflinePacketActive from '../../icon/OfflinePacketActive.svg'
import { PopoverContent } from "../../common/PopoverContent";

export default function OfflinePacketDetail(props) {
  // state
  const history = useHistory();
  const [data,setData] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const [applyReleaseModal,setApplyReleaseModal] = useState(false);
  const [editModal,setEditModal] = useState(false);
  // const pipelineStatusMap = {
  //   Pending:'运行中',
  //   Failed:'运行失败',
  //   Succeeded:'运行成功',
  //   Running:'运行中',
  //   Stop:'运行停止',
  //   Deleted:'运行删除',
  //   Omitted:'运行忽略'
  // }
  // mounted
  useEffect(()=>{
    getDetail()
  },[])
  // method
  const getDetail = () => {
    const params = {
      id: Number(props.match.params.id),
    }
    setIsLoading(true)
    get('/drapi/kfp/datarefineries/'+params.id).then(res => {
      console.log(res)
      setData(res.data)
      setIsLoading(false)
    }).catch(err => {
      console.log(err)
      setIsLoading(false)
    })
  }
  // @ts-ignore
  const goBack = () => {
    history.goBack()
  }
  // 跳转到生产任务详情
  const goProductionTaskDetail = () => {
    window.open(location.origin+'/element-processing/production-task/detail/'+data.pipeline_task_id
    )
  }
  // 申请发布弹框
  const applyReleaseModalOnOk = () => {
    console.log('into applyReleaseModalOnOk')
    post('/drapi/kfp/datarefineries/applyaudit/'+data.id,null).then(res => {
      console.log('res: ',res)
      message.success('申请发布成功')
      getDetail()
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
      id: data.id,
    }).then(res => {
      console.log('res ',res)
      message.success('修改成功')
      getDetail()
    })
    setEditModal(false)
  }
  const editModalOnCancel = () => {
    console.log('into editModalOnCancel')
    setEditModal(false);
  }
  const goElementProcessingDetail = () => {
    window.open(location.origin+`/element-processing/detail/${data?.pipeline?.id}`)
  }
  // render
  return (
    // 最外层
    <div className="w-full flex flex-col items-center bg" style={{minHeight:'900px'}}>
      <NavigationComponent data={[
        {label:'数据要素',router:'/data-element/offline-packet',icon:DataElement,iconActive:DataElementActive},
        {label:'离线数据包',router:'/data-element/offline-packet',icon:OfflinePacket,iconActive:OfflinePacketActive},
        {label:'查看',disabled:true},
      ]}/>
      {/*主体内容*/}
      <div className="mb-6 flex flex-col bg-white pt-6 pl-8 pr-8 pb-32 shadow-card rounded"
           style={{width: '960px'}}>
        <Spin spinning={isLoading} size="large" tip="加载中...">
          <div className={"w-full flex justify-between items-center"}>
            {/*左*/}
            <div className={"flex items-center"}>
              <img src={titleSvg} alt=""/>
              <div className={"ml-1.5 text-lg text-black-dark font-medium"}>
                {data?.name}
              </div>
              <div className={"ml-2 flex items-center"}>
                {
                  data?.status_desc==='已驳回' &&
                  <Tooltip title={'静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容静态内容'}
                           overlayClassName={'tooltip-yi-bo-hui'}>
                    <div className={"flex items-center"}>
                      <StatusShow status={data?.status_desc}/>
                    </div>
                  </Tooltip>
                }
                {
                  data?.status_desc!=='已驳回' &&
                  <StatusShow status={data?.status_desc}/>
                }
              </div>
            </div>
            {/*右*/}
            <div className={"flex items-center"}>
              <ButtonFifth style={{width:'79px',height:'24px'}}
                           className={''}
                           disabled={!(data?.status_desc!=='待审核' && data?.status_desc!=='已上线')}
                           text={'申请发布'}
                           click={()=>setApplyReleaseModal(true)}/>
              <ButtonFifth style={{width:'79px',height:'24px'}}
                           className={'ml-2'}
                           disabled={!(data?.status_desc!=='待审核' && data?.status_desc!=='已上线')}
                           text={'编辑'}
                           click={()=>setEditModal(true)}/>
            </div>
          </div>
          {/*基本信息*/}
          <div className={"mt-3 w-full flex items-center"}>
            {/*用户信息*/}
            <div className={"flex"} style={{width:'128px',}}>
              <Popover title={null}
                       placement="leftTop"
                       overlayClassName={'person-popover-2'}
                       trigger="hover"
                       content={PopoverContent({user:data?.user})}
              >
                <div className={"flex"}
                     style={{height:'28px'}}>
                  {/*头像*/}
                  <div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
                       style={{width:'28px',minWidth:'28px',height:'28px'}}>
                    <img className="" src={(data?.user?.avatar)?(data?.user?.avatar):null} alt="" style={{width:'100%',height:'100%'}}/>
                  </div>
                  {/*姓名*/}
                  <div className={"ml-2 h-full flex items-center"}>
                    <span className={"flex items-center text-hidden"}><span>{(data?.user?.nickname)?(data?.user?.nickname):'静态内容'}</span></span>
                  </div>
                </div>
              </Popover>
            </div>
            <div className={"ml-2 flex"} style={{width:'250px'}}>申请时间： <span>-</span></div>
            <div className={"flex"} style={{width:'250px'}}>生成时间： <span>{data?.created_at}</span></div>
            <div className={"flex"} style={{width:'250px'}}>反馈时间： <span>-</span></div>
          </div>
          <div className={"mt-2 w-full flex"} style={{lineHeight:'25px'}}>
            {data?.description}
          </div>
          <div className="mt-0.5 w-full flex flex-wrap items-center">
            {
              true &&
              <div className={"mt-2 mr-2 flex items-center"}>
                <DataType type={'表格'} style={{height:'26px',borderRadius:'16px',color:'#646464'}} fontSize={14}/>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  字段:10
                </div>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  样本:100
                </div>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  22.15MB
                </div>
              </div>
            }
            {
              false &&
              <div className={"mt-2 mr-2 flex items-center"}>
                <DataType type={'图片'} style={{height:'26px',borderRadius:'16px'}}/>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  样本:20
                </div>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  5.00MB
                </div>
              </div>
            }
            {
              false &&
              <div className={"mt-2 mr-2 flex items-center"}>
                <DataType type={'音频'} style={{height:'26px',borderRadius:'16px'}}/>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  样本:20
                </div>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  5.00MB
                </div>
              </div>
            }
            {
              false &&
              <div className={"mt-2 mr-2 flex items-center"}>
                <DataType type={'文本'} style={{height:'26px',borderRadius:'16px'}}/>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  样本:20
                </div>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  5.00MB
                </div>
              </div>
            }
            {
              false &&
              <div className={"mt-2 mr-2 flex items-center"}>
                <DataType type={'视频'} style={{height:'26px',borderRadius:'16px'}}/>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  样本:20
                </div>
                <div className={"ml-2 rounded-2xl text-sm leading-[12px] flex justify-center items-center"}
                     style={{width:'90px',height:'22px',background: 'rgba(206,220,222,0.36)'}}>
                  5.00MB
                </div>
              </div>
            }
            {
              Array.isArray(data?.application_field) &&
              <div className={"mt-2  flex items-center"}>
                {
                  data?.application_field.map((_item,_index) => (
                    <FiledCard data={_item} key={_index}/>
                  ))
                }
              </div>
            }
            {
              !Array.isArray(data?.application_field) &&
              <span className={"mt-2 flex items-center"}>{data?.application_field}</span>
            }
          </div>
          {/*数据要素预览*/}
          <div className={"mt-6 w-full flex flex-col"}>
            {/*title*/}
            <Title title='要素预览'/>
            {/*<div className={"mt-4 w-full p-4 flex"} style={{lineHeight:'24px',border:'1px solid #ECEEF5'}}>*/}
            {/*  属于规范化，通常用极差法规范化，注意一定要注意指标的属性，即正向指标还是负向指标。这步是错得最多的。②③、这步是对应的，一句话概括就是代入带权值的距离公式进行计算（熵权法就是求权重的而已）这一步求权重的方法有10来种，比如客观法熵权法，主观法AHP等等。距离公式有60来种，最常见的是欧式距离公式。因此这步的组合有600种情况。到正理想解的距离越远越差，是一个负向指标。 到负理想点的距离越小越差，是正向指标。④⑤、是贴近度的公式有多种定义。*/}
            {/*</div>*/}
            {/*<div className={"mt-4 w-full p-4 flex"} style={{lineHeight:'24px',border:'1px solid #ECEEF5'}}>*/}
            {/*  {data?.data_refinery_url}*/}
            {/*</div>*/}
            {
              true &&
              <Table columns={[
                {
                  title: '序号',
                  dataIndex: 'index',
                  key: 'index',
                  width: '20%',
                },
                {
                  title: '企业ID',
                  dataIndex: 'id',
                  key: 'id',
                  width: '30%',
                },
                {
                  title: '发展力指数',
                  dataIndex: 'description',
                  key: 'description',
                  width: '50%',
                },
              ]}
                     dataSource={[
                       {
                         key: '1',
                         index: 1,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '2',
                         index: 2,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '3',
                         index: 3,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '4',
                         index: 4,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '5',
                         index: 5,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '6',
                         index: 6,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '7',
                         index: 7,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '8',
                         index: 8,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '9',
                         index: 9,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                       {
                         key: '10',
                         index: 10,
                         id: '11727762',
                         description: '201.40240322733763',
                       },
                     ]}
                     pagination={false}
                     className={"mt-2"}
                     size='small'/>
            }
            {
              false &&
              <Table columns={[
                {
                  title: '图片',
                  dataIndex: 'picture',
                  key: 'picture',
                  width: '30%',
                },
                {
                  title: 'label',
                  dataIndex: 'label',
                  key: 'label',
                  width: '70%',
                },
              ]}
                     dataSource={[
                       {
                          key: '1',
                          picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
                          label: '0',
                       },
                       {
                         key: '2',
                         picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                       {
                         key: '3',
                         picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                       {
                         key: '4',
                         picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                       {
                         key: '5',
                         picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                     ]}
                     pagination={false}
                     className={"mt-2"}
                     size='small'/>
            }
            {
              false &&
              <Table columns={[
                {
                  title: '音频',
                  dataIndex: 'audio',
                  key: 'audio',
                  width: '50%',
                },
                {
                  title: '字符串',
                  dataIndex: 'my_string',
                  key: 'my_string',
                  width: '50%',
                },
              ]}
                     dataSource={[
                       {
                         key: '1',
                         audio: <audio src='/music1.mp3' controls/>,
                         my_string: '0',
                       },
                       {
                         key: '2',
                         audio: <audio src='/music1.mp3' controls/>,
                         my_string: '0',
                       },
                       {
                         key: '3',
                         audio: <audio src='/music1.mp3' controls/>,
                         my_string: '0',
                       },
                       {
                         key: '4',
                         audio: <audio src='/music1.mp3' controls/>,
                         my_string: '0',
                       },
                       {
                         key: '5',
                         audio: <audio src='/music1.mp3' controls/>,
                         my_string: '0',
                       },
                     ]}
                     pagination={false}
                     className={"mt-2"}
                     size='small'/>
            }
            {
              false &&
              <Table columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  key: 'id',
                  width: '20%',
                },
                {
                  title: '文本',
                  dataIndex: 'text',
                  key: 'text',
                  width: '80%',
                },
              ]}
                     dataSource={[
                       {
                         key: '1',
                         id: '1',
                         text: '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
                       },
                       {
                         key: '2',
                         id: '2',
                         text: '对开票销售收入首次达到1000万、2000万、5000万元以上的大数据智能硬件企业，分别给予20万、40万、60万元一次性奖励。',
                       },
                       {
                         key: '3',
                         id: '3',
                         text: '开展大规模、多层次职业技能培训，建设一批高技能人才培训基地。',
                       },
                       {
                         key: '4',
                         id: '4',
                         text: '对在新三板上市的企业，给予200万元一次性奖励。',
                       },
                       {
                         key: '5',
                         id: '5',
                         text: '对在主板、中小板、创业板上市的企业，分别给予600万、500万、400万元一次性奖励。',
                       },
                     ]}
                     pagination={false}
                     className={"mt-2"}
                     size='small'/>
            }
            {
              false &&
              <Table columns={[
                {
                  title: '视频',
                  dataIndex: 'video',
                  key: 'video',
                  width: '30%',
                },
                {
                  title: '占位',
                  dataIndex: 'label',
                  key: 'label',
                  width: '70%',
                },
              ]}
                     dataSource={[
                       {
                         key: '1',
                         video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                       {
                         key: '2',
                         video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                       {
                         key: '3',
                         video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                       {
                         key: '4',
                         video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                       {
                         key: '5',
                         video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
                         label: '0',
                       },
                     ]}
                     pagination={false}
                     className={"mt-2"}
                     size='small'/>
            }
          </div>
          {/*加工流程*/}
          <div className={"mt-6 w-full flex flex-col"}>
            {/*title*/}
            <Title title='加工流程'/>
            <div className={"flex items-center pt-2"}>
                  <span className={"flex items-center hover:text-main cursor-pointer"}
                        onClick={goElementProcessingDetail}>{data?.pipeline.name}</span>
            </div>
            {/*xflow*/}
            <div className={"mt-2 w-full flex border border-white-divide"}
                 style={{height:'188px',minHeight:'188px'}}>
              <XflowSmall content={data?.pipeline?.content} type='row'/>
            </div>
          </div>
          {/*风险系数*/}
          <RiskFactor className={'mt-6'} num={3}/>
          {/*生产任务*/}
          <div className={"mt-6 w-full flex flex-col"}>
            {/*title*/}
            <Title title='生产任务'/>
            <div className={"mt-4 w-full flex flex-col"}>
              <span className={"flex text-sm hover:cursor-pointer hover:text-main"}
                   onClick={goProductionTaskDetail}>{data?.pipeline_task_name}</span>
            </div>
            <div className={"mt-3 w-full flex"}>
              <span className={"flex items-center"}>创建时间: {data?.pipeline_task_created_at}</span>
            </div>
          </div>
        </Spin>
      </div>
      <ApplyReleaseModal data={data}
                         show={applyReleaseModal}
                         onOk={applyReleaseModalOnOk}
                         onCancel={applyReleaseModalOnCancel}/>
      <EditModal data={data}
                 show={editModal}
                 onOk={editModalOnOk}
                 onCancel={editModalOnCancel}/>
    </div>
  )
}
