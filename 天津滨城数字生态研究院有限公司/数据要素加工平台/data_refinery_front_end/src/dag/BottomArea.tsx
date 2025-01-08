import React, {useEffect, useRef, useState} from "react";
import {message} from "antd";
import {
  NsGraphCmd,
  NsGraphStatusCommand,
  NsNodeCmd,
  useXFlowApp,
  XFlowGraphCommands,
  XFlowNodeCommands
} from "@antv/xflow";
import {
  getExperimentById,
  queryComponentStatus,
  runExperiment,
  saveExperiment, saveProcessingFlow,
  stopRunExperiment
} from "../axios/xflow";
import useStateRef from "../utils/useStateRef";
import Pause from "../icon/pause";
import SaveProcessingFlowDialog from "./components/save-processing-flow-dialog";
import {getChildrenGraph, mySort} from "../utils/util";
import {SyncOutlined} from "@ant-design/icons";
import {adjustEdge} from "./form-controls/AutoRightPanel";

interface IProps {
  isTest?: boolean;
}

export default function BottomArea(props:IProps) {
  // @ts-ignore
  const {isTest=false} = props
  const app = useXFlowApp()
  const singleRun = useRef(false)
  const [isRunning,setIsRunning,isRunningRef] = useStateRef(false)
  const runId = useRef('')
  const [showSaveProcessingFlowDialog,setShowSaveProcessingFlowDialog] = useState(false);
  const graphInfo = useRef(null)
  let experimentInfo = useRef(null)

  useEffect(()=>{
    enableGraphEdit()
    const a = setInterval(()=>{
      console.log('into 定时任务')
      if(sessionStorage.getItem('running')==='ok') {
        singleRun.current = true
        setIsRunning(true)
      } else {
        if (singleRun.current) {
          singleRun.current = false
          setIsRunning(false)
        }
      }
    },500)
    return () => {
      clearInterval(a)
      enableGraphEdit()
    }
  },[])

  // 第一个模型的输入类型
  let inputType = useRef('')
  // 最后一个模型的输出类型
  let outputType = useRef('')

  const allNodeCanRun = (nodes:Array<any>) => {
    for (let i=0;i<nodes.length;i++) {
      const node = nodes[i]
      if (node?.config) {
        for(let j=0;j<node.config.length;j++) {
          if (node.config[j].value === undefined
              || node.config[j].value === null
              || String(node.config[j].value) === ''
              || ( (typeof node.config[j].value === 'object') && Object.entries(node.config[j].value).length === 0    )
          ) {
            console.log('节点'+node.id+'的'+node.config[j].label+'属性为空')
            return false
          }
        }
      }
    }
    return true
  }

  const clickRun = () => {
    clickSave(false)
    app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
      XFlowGraphCommands.SAVE_GRAPH_DATA.id,
      {
        saveGraphDataService: async (_meta, graphData) => {
          _meta = _meta.meta
          console.log('点击了全局运行实验，此时图的信息_meta：',_meta)
          console.log('点击了全局运行实验，此时图的信息graphData：',graphData)
          if (graphData.nodes.length === 0) {
            message.warn('请先创建实验')
            return
          }
          if(!allNodeCanRun(graphData.nodes)) {
            message.warn('请先完善模型信息')
            return
          }
          // 求解第一个模型的类型
          const childrenGraph2 = getChildrenGraph(graphData);
          console.log('共存在'+childrenGraph2.length+'个联通子图:',childrenGraph2)
          if (childrenGraph2.length > 1) {
            message.warn('这不是一个完整的实验流程')
            return
          }
          // 修改为非单步骤运行,状态为未运行
          for(let i=0;i<graphData.nodes.length;i++) {
            graphData.nodes[i].is_single_debug = 0
            graphData.nodes[i].status = NsGraphStatusCommand.StatusEnum.DEFAULT
            app.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
              nodeConfig:{
                ...graphData.nodes[i]
              }
            }).then(_res => {
              app.getAllEdges().then(edgeList => {
                adjustEdge(edgeList,app.commandService,graphData.nodes[i])
              })
            })
          }
          setIsRunning(true)
          // message.success('开始运行实验')
          // 将首节点设置为运行中状态
          // 求解第一个模型的类型
          const childrenGraph = getChildrenGraph(graphData);
          console.log('共存在'+childrenGraph.length+'个联通子图:',childrenGraph)
          for(let i=0;i<childrenGraph.length;i++) {
            const list = mySort(childrenGraph[i],i+1)
            const inputNodeId = list[0]
            app.getNodeById(inputNodeId).then(res => {
              console.log(res)
              app.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
                nodeConfig:{
                  ...res.data,
                  status: NsGraphStatusCommand.StatusEnum.PROCESSING,
                }
              }).then(_res => {
                app.getAllEdges().then(edgeList => {
                  adjustEdge(edgeList,app.commandService,res.data)
                })
              })
            })
          }
          let params = {
            "experiment_id": _meta.experimentInfo.id,
            "content": graphData
          }
          disableGraphEdit()
          // 执行运行命令
          runExperiment(params).then(res => {
            console.log(res)
            runId.current = res.data.run_id
            const getStatus = ()=>{
              if (!isRunningRef.current) {
                console.log('外部停止了全局运行')
                enableGraphEdit()
                return
              }
              // 查询状态
              queryComponentStatus(res.data)
                .then(res => {
                  console.log(res)
                  if (!isRunningRef.current) {
                    enableGraphEdit()
                    return
                  }
                  let data2 = res.data
                  let pipeline_status = data2.pipeline_status
                  let nodes = data2.nodes
                  // 根据全局状态执行不同流程
                  // 如果未运行，不执行任何操作
                  // 如果正在运行,根据nodes信息更新节点状态
                  // 如果运行成功,根据nodes信息更新节点状态，设置全局运行成功，终止轮询
                  // 如果运行失败，根据nodes信息更新节点状态，设置全局运行失败，终止轮询
                  for(let i=0;i<graphData.nodes.length;i++) {
                    const node = graphData.nodes[i]
                    if (nodes[node.id]) {
                      let node_status = ''
                      if (nodes[node.id].status === 'Running' || nodes[node.id].status === 'Pending') {
                        node_status = NsGraphStatusCommand.StatusEnum.PROCESSING
                      } else if (nodes[node.id].status === 'Omitted') {
                        node_status = NsGraphStatusCommand.StatusEnum.DEFAULT
                      } else if (nodes[node.id].status === 'Succeeded') {
                        node_status = NsGraphStatusCommand.StatusEnum.SUCCESS
                      } else if (nodes[node.id].status === 'Failed' || nodes[node.id].status === 'Error') {
                        node_status = NsGraphStatusCommand.StatusEnum.ERROR
                        if(nodes[node.id].status === 'Error') {
                          message.error('pipeline_status:error，请联系管理员')
                        }
                      }
                      if (!isRunningRef.current) {
                        enableGraphEdit()
                        return
                      }
                      app.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
                        nodeConfig:{
                          ...node,
                          status: node_status,
                          ...nodes[node.id]['outputs']
                        }
                      }).then(_res => {
                        app.getAllEdges().then(edgeList => {
                          adjustEdge(edgeList,app.commandService,node)
                        })
                      })
                    }
                  }
                  // if (pipeline_status === 'Running' || pipeline_status === 'Pending') {
                  // }
                  // else if (pipeline_status === 'Omitted') {
                  // }
                  // else if(pipeline_status === 'Succeeded') {
                  // }
                  // else if(pipeline_status === 'Failed') {
                  // }
                  if (pipeline_status === 'Succeeded' || pipeline_status === 'Failed' || pipeline_status === 'Error') {
                    setIsRunning(false)
                    clickSave(false)
                    enableGraphEdit()
                    if (pipeline_status === 'Succeeded') {
                      // @ts-ignore
                      window.myInfo = {
                        run_id : runId.current
                      }
                    } else if(pipeline_status === 'Error') {
                      message.error('pipeline_status:error，请联系管理员')
                    }
                  } else {
                    setTimeout(()=>{
                      getStatus()
                    },1000)
                  }
                })
                .catch(err => {
                  console.error(err)
                  setIsRunning(false)
                  clickSave(false)
                  enableGraphEdit()
                })
            }
            getStatus()
          })
        }
      },
    )
  }

  // 禁用掉图的编辑
  const disableGraphEdit = async () => {
    console.log('禁用图的编辑')
    const graph = await app.getGraphInstance();
    graph.disablePanning()
    graph.disableMouseWheel()
    graph.disableMultipleSelection()
    graph.freeze()
    graph.disableKeyboard()
    graph.disableSelection()
    // 将app的状态设置为运行中
    sessionStorage.setItem('allRunning','ok')
  }
  // 启用图的编辑
  const enableGraphEdit = async () => {
    console.log('启用图的编辑')
    const graph = await app.getGraphInstance();
    graph.enablePanning()
    graph.enableMouseWheel()
    graph.enableMultipleSelection()
    graph.unfreeze()
    graph.enableKeyboard()
    graph.enableSelection()
    // 将app的状态设置为不是运行
    sessionStorage.setItem('allRunning','false')
  }

  const clickStopRun = () => {
    if(singleRun.current) {
      message.warn('暂不支持停止单步运行')
      return
    }
    const params = {
      user_id: 1,
      run_id: runId.current,
    }
    setIsRunning(false)
    enableGraphEdit()
    stopRunExperiment(params).then(res => {
      console.log('into 停止运行实验',res)
      message.success('停止运行实验成功')
      app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
        XFlowGraphCommands.SAVE_GRAPH_DATA.id,
        {
          saveGraphDataService: async (_meta, graphData) => {
            _meta = _meta.meta
            console.log('点击了全局运行实验，此时图的信息_meta：', _meta)
            console.log('点击了全局运行实验，此时图的信息graphData：', graphData)
            for(let i=0;i<graphData.nodes.length;i++) {
              const node = graphData.nodes[i]
              if (node.status === NsGraphStatusCommand.StatusEnum.PROCESSING) {
                app.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
                  nodeConfig:{
                    ...node,
                    status: NsGraphStatusCommand.StatusEnum.DEFAULT,
                  }
                }).then(_res => {
                  app.getAllEdges().then(edgeList => {
                    adjustEdge(edgeList,app.commandService,node)
                  })
                })
              }
            }
          }
        })
    })
  }

  const clickSave = (show) => {
    app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
      XFlowGraphCommands.SAVE_GRAPH_DATA.id,
      {
        saveGraphDataService: async (_meta, graphData) => {

          getExperimentById({id:_meta.meta.experimentInfo.id}).then(res => {
            const experimentInfo = res.data
            let params = {
              ...experimentInfo,
              "content": graphData
            }
            saveExperiment(params).then(res => {
              console.log(res)
              if (show) {
                message.success('保存实验成功')
              }
            })
          })
        }
      },
    )
  }

  const clickSaveProcessingFlow = () => {
    console.log('into clickSaveProcessingFlow')
    console.log('app: ',app)
    console.log('app.getGraphData: ',)
    app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
      XFlowGraphCommands.SAVE_GRAPH_DATA.id,{
        saveGraphDataService: async (_meta,_graphData) => {
          const params = {
            id: _meta.meta.experimentInfo.id
          }
          getExperimentById(params).then(res => {
            console.log('res.data.content: ',res.data.content)
            console.log('_graphData: ',_graphData)
            console.log(res.data.content === _graphData)
            const oldContent = res.data.content
            const newContent = _graphData
            let nodeChange = false
            let edgeChange = false
            if(oldContent) {
              // 判断nodeChange
              if (oldContent.nodes.length !== newContent.nodes.length) {
                nodeChange = true
              }
              for (let i=0;i<oldContent.nodes.length;i++) {
                const item = oldContent.nodes[i]
                let have = false
                for(let j=0;j<newContent.nodes.length;j++) {
                  if(item.id === newContent.nodes[j].id) {
                    have = true
                  }
                }
                if(!have) {
                  nodeChange = true
                }
              }
              // 判断edgeChange
              if (oldContent.edges.length !== newContent.edges.length) {
                edgeChange = true
              }
              for (let i=0;i<oldContent.edges.length;i++) {
                const item = oldContent.edges[i]
                let have = false
                for(let j=0;j<newContent.edges.length;j++) {
                  if(item.id === newContent.edges[j].id) {
                    have = true
                  }
                }
                if(!have) {
                  edgeChange = true
                }
              }
            }
            if (!res.data.run_id || res.data.run_status!=='Succeeded' || nodeChange || edgeChange) {
              message.warn('此实验没有运行成功，不能保存为加工流程')
              return
            }
            // @ts-ignore
            window.myInfo = {
              run_id : res.data.run_id
            }
            experimentInfo.current = res.data
            app.getGraphData().then(res=>{
              console.log('res: ',res)
              graphInfo.current = res;
              // 求解第一个模型的类型和最后一个模型的类型
              const childrenGraph = getChildrenGraph(graphInfo.current);
              console.log('共存在'+childrenGraph.length+'个联通子图:',childrenGraph)
              for(let i=0;i<childrenGraph.length;i++) {
                const list = mySort(childrenGraph[i],i+1)
                // 第一个模型的类型
                const inputNodeId = list[0]
                for(let i=0;i<graphInfo.current.nodes.length;i++) {
                  if (inputNodeId === graphInfo.current.nodes[i].id) {
                    inputType.current = graphInfo.current.nodes[i].config[0].value.data_type
                  }
                }
                // 最后一个模型的类型
                const outputNodeId = list[list.length-1]
                for(let i=0;i<graphInfo.current.nodes.length;i++) {
                  if (outputNodeId === graphInfo.current.nodes[i].id) {
                    outputType.current = graphInfo.current.nodes[i].output_list[0][0].type
                  }
                }
              }
              clickSave(false)
              setShowSaveProcessingFlowDialog(true)
            })
          }).catch(err => {
            message.error('接口出错了')
            console.log(err)
          })
        }
      }
    )


  }

  const saveProcessingFlowDialogOnOk = (data) => {
    console.log('into saveProcessingFlowDialogOnOk: ',data)
    setShowSaveProcessingFlowDialog(false)
    let params = data
    saveProcessingFlow(params).then(res => {
      console.log(res)
      message.success('保存加工流程成功')
    })
  }

  const saveProcessingFlowDialogOnCancel = () => {
    setShowSaveProcessingFlowDialog(false)
  }

  return (
    <div className="w-full h-full flex justify-center items-center bg-white"
         style={{boxShadow: '0px 5px 18px 0px rgba(205,205,205,0.11)'}}>
      {/*内容*/}
      <div className={"h-full flex items-center"}>
        <div className={"flex items-center text-main mr-8"}
             style={{width:'80px'}}>
          {
            isRunning &&
            <div className={"flex items-center"}>
              <SyncOutlined spin />
              <div className={"flex items-center ml-2"}>运行中</div>
            </div>
          }
        </div>
        {/*运行试验*/}
        {
          !isRunning &&
          <button id='btn-run' className="border border-main bg-white rounded-lg flex justify-center items-center text-main text-sm
                      hover:cursor-pointer hover:border-main-hover hover:text-main-hover
                      active:border-main-focus active:text-main-focus"
                  style={{width:'104px',height:'32px'}}
                  onClick={clickRun}>
            {/*左，图标按钮*/}
            <div className="mr-2 flex items-center">
              <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg"
                   xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="按钮备份" transform="translate(-949.000000, -635.000000)">
                    <g id="play-normal" transform="translate(949.000000, 635.000000)">
                      <polygon id="路径" points="0 0 18 0 18 18 0 18"></polygon>
                      <path d="M12.2955,9 L7.5,5.80275 L7.5,12.19725 L12.2955,9 Z M14.532,9.312 L6.58275,14.6115 C6.46769046,14.6880666 6.31984251,14.6951393 6.19799958,14.6299055 C6.07615664,14.5646717 6,14.4377069 6,14.2995 L6,3.7005 C6,3.56229311 6.07615664,3.43532826 6.19799958,3.37009446 C6.31984251,3.30486066 6.46769046,3.31193335 6.58275,3.3885 L14.532,8.688 C14.6363082,8.75755244 14.6989591,8.8746296 14.6989591,9 C14.6989591,9.1253704 14.6363082,9.24244756 14.532,9.312 L14.532,9.312 Z" id="形状" fill="currentColor" fill-rule="nonzero"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            {/*右，文字*/}
            <span>运行实验</span>
          </button >
        }

        {/*停止运行*/}
        {
          isRunning &&
          <button className="border bg-white border-main rounded-lg flex justify-center items-center text-main text-sm
                      hover:cursor-pointer hover:border-main-hover hover:text-main-hover
                      active:border-main-focus active:text-main-focus"
                  style={{width:'104px',height:'32px'}}
                  onClick={clickStopRun}>
            {/*左，图标按钮*/}
            <div className="mr-2 flex items-center">
              <Pause/>
            </div>
            {/*右，文字*/}
            <span>停止运行</span>
          </button >
        }

        {/*保存实验*/}
        {
          !isTest &&
          <button id='btn-save' className="border border-main bg-white rounded-lg flex justify-center items-center text-main text-sm
                      hover:cursor-pointer hover:border-main-hover hover:text-main-hover
                      active:border-main-focus active:text-main-focus"
                  style={{width:'104px',height:'32px',marginLeft:'22px',}}
                  onClick={clickSave}>
            {/*左，图标按钮*/}
            <div className="mr-2 flex items-center">
              <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="按钮备份" transform="translate(-996.000000, -635.000000)">
                    <g id="save-normal" transform="translate(996.000000, 635.000000)">
                      <polygon id="路径" points="0 0 18 0 18 18 0 18"></polygon>
                      <path d="M13.5,14.25 L14.25,14.25 L14.25,5.121 L12.879,3.75 L12,3.75 L12,6.75 L5.25,6.75 L5.25,3.75 L3.75,3.75 L3.75,14.25 L4.5,14.25 L4.5,9 L13.5,9 L13.5,14.25 Z M3,2.25 L13.5,2.25 L15.53025,4.28025 C15.670912,4.42086955 15.75,4.61160389 15.75,4.8105 L15.75,15 C15.75,15.4142136 15.4142136,15.75 15,15.75 L3,15.75 C2.58578644,15.75 2.25,15.4142136 2.25,15 L2.25,3 C2.25,2.58578644 2.58578644,2.25 3,2.25 Z M6,10.5 L6,14.25 L12,14.25 L12,10.5 L6,10.5 Z" id="形状" fill="currentColor" fill-rule="nonzero"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            {/*右，文字*/}
            <span>保存实验</span>
          </button>
        }
        {/*保存加工流程*/}
        {
          !isTest &&
          <button id='btn-save-processing-flow' style={{marginLeft:'126px',width:'134px',height:'32px',lineHeight:'14px'}}
                  onClick={clickSaveProcessingFlow}
                  className="rounded-lg bg-main shadow-button text-sm text-white hover:cursor-pointer hover:bg-main-hover active:bg-main-focus flex justify-center items-center">
            <span>保存加工流程</span>
          </button>
        }

      </div>
      {/*保存加工流程弹框*/}
      <SaveProcessingFlowDialog show={showSaveProcessingFlowDialog}
                                inputType={inputType.current}
                                outputType={outputType.current}
                                graphInfo={graphInfo.current}
                                experimentInfo={experimentInfo.current}
                                onOk={data=>saveProcessingFlowDialogOnOk(data)}
                                onCancel={saveProcessingFlowDialogOnCancel}/>

    </div>
  )
}
