import React, {useEffect, useRef, useState} from "react";
import {Modal, Spin, Table} from "antd";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import { get } from "../../axios";
import ButtonMain from "../../components/ButtonMain";

export default function RunSuccessModal(props) {
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
  // state
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);
  // mounted
  useEffect(()=>{
    if (props.show) {
      getData()
    } else {
      setData(null)
    }
  },[props.show])
  // methods
  const getData = async () => {

    // 获取location.pathname的最后面的数字
    const pathname = window.location.pathname
    const experiment_id = Number(pathname.split('/')[pathname.split('/').length-1])

    const params = {
      experiment_id,
      node_id:props?.data?.id,
      comp_id:props?.data?.comp_id,
    }
    setLoading(true)
    const res = await get('/drapi/kfp/experiment/result/show',params)
    setData(res?.data)
    setLoading(false)
  }
  const clickDownload = () => {
    window.open(props.data.output_list[0][0].value)
  }
  // render
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
          {props?.data?.label}
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
             wrapClassName="experiment-xflow-result-success"
             footer={null}
             open={props.show}
             onOk={props.onOk}
             onCancel={props.onCancel}>
        <Spin spinning={loading} size="large" tip="加载中...">
          <div className="pt-4 pl-6 pr-6 w-full h-full overflow-auto flex flex-col">
            {/*title*/}
            <div className="w-full flex items-center pl-5 text-sm text-black"
                 style={{height:'47px',minHeight:'47px',background: 'rgba(74,168,178,0.05)',borderRadius:'4px 4px 0px 0px' }}>
              {
                (data?.data_type === 'csv' || data?.data_type === 'table') &&
                <div className="w-full h-full flex items-center">
                  <div className="flex items-center">
                    数据要素统计信息：字段:
                  </div>
                  <div className="flex items-center text-main">
                    {data?.header_list.length}
                  </div>
                  <div className="ml-4 flex items-center">
                    样本:
                  </div>
                  <div className="flex items-center text-main">
                    {data?.data.length}
                  </div>
                  <div className="ml-4 flex items-center">
                    大小:
                  </div>
                  <div className="flex items-center text-main">
                    5.00KB
                  </div>
                </div>
              }
              {
                data?.data_type === 'image' &&
                <div className="w-full h-full flex items-center">
                  <div className="flex items-center">数据要素统计信息：离线数据包(图片集压缩包/地址     样本:</div>
                  <div className="flex items-center text-main">20</div>
                  <div className="ml-4 flex items-center">大小:</div>
                  <div className="flex items-center text-main">5.00MB</div>
                  <div className="flex items-center">)</div>
                </div>
              }
              {
                data?.data_type === 'video' &&
                <div className="w-full h-full flex items-center">
                  <div className="flex items-center">数据要素统计信息：离线数据包(视频集压缩包/地址     样本:</div>
                  <div className="flex items-center text-main">20</div>
                  <div className="ml-4 flex items-center">大小:</div>
                  <div className="flex items-center text-main">5.00MB</div>
                  <div className="flex items-center">)</div>
                </div>
              }
              {
                data?.data_type === 'text' &&
                <div className="w-full h-full flex items-center">
                  <div className="flex items-center">数据要素统计信息：离线数据包(文件    大小:</div>
                  <div className="flex items-center text-main">5.00MB</div>
                  <div className="flex items-center">)</div>
                </div>
              }
            </div>
            <div className={"w-full flex items-center p-2 text-sm leading-[14px]"}>
              <span className={"flex items-center"}>模型运行结果：</span>
              <ButtonMain text={'下载'} click={clickDownload} style={{width:'90px',height:'24px'}} className={"ml-4"}/>
            </div>
            {/*内容*/}
            {
              <div className="mt-2 mb-6 w-full overflow-auto"
                   style={{height:'526px'}}>
                {
                  (data?.data_type === 'csv' || data?.data_type === 'table') &&
                  <Table style={{height:'472px'}}
                         // y: 430
                         scroll={{ x: 'max-content', }} // 设置自适应宽度
                         dataSource={data?.data.map(  (item,_index) => {
                           let params = {
                             key:_index,
                           }
                           data?.header_list.map((header,_index) => {
                             params[header+' '] = item[_index]
                           })
                           return params
                         })}
                         // width:160
                         columns={data?.header_list.map((item,_index) => ({title:item,dataIndex:item+' ',key:item,}))}
                         size="small"
                         pagination={false}/>
                }
                {
                  data?.data_type === 'image' &&
                  <div className="w-full grid grid-cols-4 gap-4">
                    {
                      data?.data.map((item,_index) => {
                        return (
                          <div className={'w-full h-full flex'} style={{height:'112px'}} key={_index}>
                            <img src={item} alt=""/>
                          </div>
                        )
                      })
                    }
                  </div>
                }
                {
                  data?.data_type === 'video' &&
                  <div className="w-full"
                       style={{height:'472px'}}>
                    <video autoPlay controls src={data?.data} style={{width:'100%',height:'100%'}}/>
                  </div>
                }
                {
                  data?.data_type === 'text' &&
                  <div className="w-full flex pt-3 pl-6 pr-6 text-sm text-black rounded"
                       style={{minHeight:'533px',border:'1px solid #ECEEF5',lineHeight:'36px'}}>
                    {data?.data}
                  </div>
                }
              </div>
            }
          </div>
        </Spin>
      </Modal>
    </Draggable>
  )
}
