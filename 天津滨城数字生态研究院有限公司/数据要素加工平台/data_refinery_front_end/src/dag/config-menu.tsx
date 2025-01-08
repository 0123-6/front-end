import type { NsNodeCmd, NsEdgeCmd, IMenuOptions, NsGraph } from '@antv/xflow'
import type { NsRenameNodeCmd } from './cmd-extensions/cmd-rename-node-modal'
import {
    createCtxMenuConfig,
    MenuItemType,
    NsGraphCmd,
    NsGraphStatusCommand,
    XFlowGraphCommands
} from '@antv/xflow'
import { IconStore, XFlowNodeCommands, XFlowEdgeCommands } from '@antv/xflow'
import {DeleteOutlined, EditOutlined, StopOutlined, PlayCircleOutlined, FileTextOutlined} from '@ant-design/icons'
import { CustomCommands } from './cmd-extensions/constants'
import { MockApi } from './service'
import {queryComponentStatus, runComponent} from "../axios/xflow";
import { message } from 'antd';
import React from 'react'
import {adjustEdge} from "./form-controls/AutoRightPanel";

let sharedProps:IProps = {
    setShowRunSuccessModal: () => {},
    setShowRunErrorModal: () => {},
    changeRunSuccessModalData: () => {},
    changeRunErrorModalData: () => {},
}

/** menuitem 配置 */
export namespace NsMenuItemConfig {
    /** 注册菜单依赖的icon */
    IconStore.set('DeleteOutlined', DeleteOutlined)
    IconStore.set('EditOutlined', EditOutlined)
    IconStore.set('StopOutlined', StopOutlined)
    IconStore.set('PlayCircleOutlined', PlayCircleOutlined)
    IconStore.set('FileTextOutlined', FileTextOutlined)

    export const DELETE_EDGE: IMenuOptions = {
        id: XFlowEdgeCommands.DEL_EDGE.id,
        label: '删除边',
        iconName: 'DeleteOutlined',
        onClick: async ({ target, commandService }) => {
            commandService.executeCommand<NsEdgeCmd.DelEdge.IArgs>(XFlowEdgeCommands.DEL_EDGE.id, {
                edgeConfig: target.data as NsGraph.IEdgeConfig,
            })
        },
    }

    export const DELETE_NODE: IMenuOptions = {
        id: XFlowNodeCommands.DEL_NODE.id,
        label: '删除节点',
        iconName: 'DeleteOutlined',
        onClick: async ({ target, commandService }) => {
            commandService.executeCommand<NsNodeCmd.DelNode.IArgs>(XFlowNodeCommands.DEL_NODE.id, {
                nodeConfig: { id: target.data.id },
            })
        },
    }

    export const EMPTY_MENU: IMenuOptions = {
        id: 'EMPTY_MENU_ITEM',
        label: '暂无可用',
        isEnabled: false,
        iconName: 'DeleteOutlined',
    }

    export const RENAME_NODE: IMenuOptions = {
        id: CustomCommands.SHOW_RENAME_MODAL.id,
        label: '重命名',
        isVisible: true,
        iconName: 'EditOutlined',
        onClick: async ({ target, commandService }) => {
            const nodeConfig = target.data as NsGraph.INodeConfig
            commandService.executeCommand<NsRenameNodeCmd.IArgs>(CustomCommands.SHOW_RENAME_MODAL.id, {
                nodeConfig,
                updateNodeNameService: MockApi.renameNode,
            })
        },
    }

    export const RUN_NODE: IMenuOptions = {
        id: 'runNode',
        label: '运行',
        iconName: 'PlayCircleOutlined',
        onClick: async (args) => {
            console.log(args)
            const {commandService} = args
            let data = args.target.data
            console.log('data: ',data)
            await commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
              XFlowGraphCommands.SAVE_GRAPH_DATA.id, {
                  saveGraphDataService: async (_meta, graphData) => {
                      console.log('graphData: ', graphData)
                      for(let i=0;i<graphData.edges.length;i++) {
                          const edge = graphData.edges[i]
                          if (edge.target === data.id) {
                              const sourceId = edge.source
                              for(let j=0;j<graphData.nodes.length;j++) {
                                  if (graphData.nodes[j].id === sourceId) {
                                      // data.input = graphData.nodes[j].output_list[0]
                                      data.input_list = JSON.parse(JSON.stringify(graphData.nodes[j].output_list))
                                  }
                              }
                          }
                      }
                  }
              }
            )
            // return
            // 判断是否可以运行
            if(data?.config) {
                for(let i=0;i<data.config.length;i++) {
                    if (data.config[i].value === undefined
                      || data.config[i].value === null
                      || String(data.config[i].value) === ''
                      || ( (typeof data.config[i].value === 'object') && Object.entries(data.config[i].value).length === 0     )
                    ) {
                        message.warning('请先完善模型信息');
                        return
                    }
                }
            }
            data.is_single_debug = 1
            // 修改该节点信息为运行中
            commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
                nodeConfig:{
                    ...data,
                    status: NsGraphStatusCommand.StatusEnum.PROCESSING,
                }
            }).then(_res=>{
                commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(XFlowGraphCommands.SAVE_GRAPH_DATA.id,{
                    saveGraphDataService: async (_meta, graphData) => {
                        console.log('graphData: ', graphData)
                        const edgeList = graphData.edges
                        adjustEdge(edgeList,commandService,data)
                    }
                })
            })
            sessionStorage.setItem('running','ok')
            // commandService.executeCommand<NsGraphCmd.GraphMeta.IArgs>(XFlowGraphCommands.LOAD_META.id,{
            //
            // })
            // 修改该节点与该节点的前继节点的连线为高亮状态
            // commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
            //   XFlowGraphCommands.SAVE_GRAPH_DATA.id, {
            //       saveGraphDataService: async (_meta, graphData) => {
            //           console.log('graphData: ',graphData)
            //           const {edges} = graphData
            //           for(let i=0;i<edges.length;i++) {
            //               if(edges[i].target === data.id) {
            //                   // 高亮这条线
            //                   commandService.executeCommand(XFlowEdgeCommands.HIGHLIGHT_EDGE.id,{
            //                       edgeId:edges[i].id,
            //                       strokeColor:'blue'
            //                   })
            //               }
            //           }
            //       }
            //   },
            // )
            const pathname = window.location.pathname
            const experiment_id = Number(pathname.split('/')[pathname.split('/').length-1])
            runComponent({...data,experiment_id}).then(res => {
                console.log(res)
                const queryStatus = () => {
                    queryComponentStatus(res.data)
                      .then(res => {
                          console.log(res)
                          let data2 = res.data
                          let status = data2.pipeline_status
                          if(status === 'Running' || status === 'Pending') {
                              setTimeout(queryStatus,1000)
                          }
                          else if(status === 'Succeeded') {
                              sessionStorage.removeItem('running')
                              // 更新本节点
                              commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
                                  nodeConfig:{
                                      ...data,
                                      status: NsGraphStatusCommand.StatusEnum.SUCCESS,
                                      ...data2.nodes[data.id]['outputs']
                                  }
                              }).then(_res=>{
                                  commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(XFlowGraphCommands.SAVE_GRAPH_DATA.id,{
                                      saveGraphDataService: async (_meta, graphData) => {
                                          console.log('graphData: ', graphData)
                                          const edgeList = graphData.edges
                                          adjustEdge(edgeList,commandService,data)
                                      }
                                  })
                              })
                              // 更新后继节点
                              // const paramList = Object.keys(data2.nodes[data.id]['outputs'])
                              // let params = {}
                              // for(let i=0;i<paramList.length;i++) {
                              //     const oldParam = paramList[i]
                              //     const newParam = oldParam.replace('output','params')
                              //     params[newParam] = data2.nodes[data.id]['outputs'][oldParam]
                              // }
                              // commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
                              //   XFlowGraphCommands.SAVE_GRAPH_DATA.id, {
                              //       saveGraphDataService: async (_meta, graphData) => {
                              //           console.log('graphData: ',graphData)
                              //           const {nodes,edges} = graphData
                              //           for(let i=0;i<edges.length;i++) {
                              //               if(edges[i].source === data.id) {
                              //                   // 获取target节点原来的信息
                              //                   let nodeConfig2: NsGraph.INodeConfig = {
                              //                       id:"0",
                              //                   }
                              //                   for(let j=0;j<nodes.length;j++) {
                              //                       if(edges[i].target === nodes[j].id) {
                              //                           nodeConfig2 = nodes[j]
                              //                       }
                              //                   }
                              //                   // 更新后继节点
                              //                   commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
                              //                       nodeConfig: {
                              //                           ...nodeConfig2,
                              //                           ...params,
                              //                       }
                              //                   })
                              //               }
                              //           }
                              //       }
                              //   },
                              // )
                          }
                          else if(status === 'Failed' || status === 'Error') {
                              if(status === 'Error') {
                                  message.error('pipeline_status:error，请联系管理员')
                              }
                              sessionStorage.removeItem('running')
                              commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
                                  nodeConfig:{
                                      ...data,
                                      status: NsGraphStatusCommand.StatusEnum.ERROR,
                                  }
                              }).then(_res=>{
                                  commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(XFlowGraphCommands.SAVE_GRAPH_DATA.id,{
                                      saveGraphDataService: async (_meta, graphData) => {
                                          console.log('graphData: ', graphData)
                                          const edgeList = graphData.edges
                                          adjustEdge(edgeList,commandService,data)
                                      }
                                  })
                              })
                          }
                      })
                      .catch(err => {
                          console.error(err)
                      })
                }
                queryStatus()
            })
        }
    }

    // 查看结果
    export const View_Result: IMenuOptions = {
        id: 'viewResult',
        label: '查看结果',
        render: (args) => {
            const { setShowRunSuccessModal, setShowRunErrorModal, changeRunSuccessModalData, changeRunErrorModalData } = sharedProps
            console.log('args jjjj: ',args)
            // const children = args.children
            let node = args.target.data
            console.log('node: ',node)
            const status = node.status
            const clickShow = (_e) => {
                // e.preventDefault()
                // e.stopPropagation()
                // 如果是成功，展示成功弹框；如果失败，展示失败弹框
                if (status === NsGraphStatusCommand.StatusEnum.SUCCESS) {
                    changeRunSuccessModalData(node)
                    setShowRunSuccessModal(true)
                }
                else if (status === NsGraphStatusCommand.StatusEnum.ERROR) {
                    node.errorInfo = '发生错误了，前端静态'
                    changeRunErrorModalData(node)
                    setShowRunErrorModal(true)
                }
            }

            return (
              <div style={{height:'28px',paddingLeft:'6px'}}
                   className="w-full h-full flex items-center hover:cursor-pointer hover:text-black-dark hover:bg-white-bg"
                   onClick={clickShow}>
                  <div className='flex justify-center items-center'
                       style={{width:'24px',height:'24px'}}>
                      <FileTextOutlined style={{width:'13px',height:'13px'}}/>
                  </div>
                  <div className="pl-0.5 flex items-center">查看结果</div>
              </div>
            )
        },
    }

    export const SEPARATOR: IMenuOptions = {
        id: 'separator',
        type: MenuItemType.Separator,
    }
}

interface IProps {
    setShowRunSuccessModal: (value: boolean) => void;
    setShowRunErrorModal: (value: boolean) => void;
    changeRunSuccessModalData: (value: any) => void;
    changeRunErrorModalData: (value: any) => void;
}

export const useMenuConfig = (props:IProps) => createCtxMenuConfig(config => {
    sharedProps = props
    config.setMenuModelService(async (target, model) => {
        const { type} = target
        console.log('sss',target)

        let status = null
        if (type === 'node') {
            // @ts-ignore
            status = target.data.node.data.status
        }
        let submenu = []
        if (status === NsGraphStatusCommand.StatusEnum.PROCESSING || status === NsGraphStatusCommand.StatusEnum.SUCCESS || status === NsGraphStatusCommand.StatusEnum.ERROR) {
            submenu = [NsMenuItemConfig.RUN_NODE,NsMenuItemConfig.View_Result,NsMenuItemConfig.DELETE_NODE]
        } else {
            submenu = [NsMenuItemConfig.RUN_NODE,NsMenuItemConfig.DELETE_NODE]
        }
        switch (type) {
            /** 节点菜单 */
            case 'node':
                model.setValue({
                    id: 'root',
                    type: MenuItemType.Root,
                    submenu: submenu,
                })
                break
            /** 边菜单 */
            case 'edge':
                model.setValue({
                    id: 'root',
                    type: MenuItemType.Root,
                    submenu: [NsMenuItemConfig.DELETE_EDGE],
                })
                break
            /** 画布菜单 */
            case 'blank':
                model.setValue({
                    id: 'root',
                    type: MenuItemType.Root,
                    submenu: [NsMenuItemConfig.EMPTY_MENU],
                })
                break
            /** 默认菜单 */
            default:
                model.setValue({
                    id: 'root',
                    type: MenuItemType.Root,
                    submenu: [NsMenuItemConfig.EMPTY_MENU],
                })
                break
        }
    })
})
