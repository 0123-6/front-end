import {DND_RENDER_ID, NODE_HEIGHT, NODE_WIDTH} from './constant'
import type {NsEdgeCmd, NsGraphCmd, NsNodeCmd} from '@antv/xflow'
import {NsGraph, NsGraphStatusCommand} from '@antv/xflow'
import type {NsRenameNodeCmd} from './cmd-extensions/cmd-rename-node-modal'
import type {NsDeployDagCmd} from './cmd-extensions/cmd-deploy'
import {getExperimentById} from "../axios/xflow";

/** mock 后端接口调用 */
export namespace MockApi {
    export const NODE_COMMON_PROPS = {
        renderKey: DND_RENDER_ID,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
    } as const

    /** 查图的meta元信息 */
    export const queryGraphMeta: NsGraphCmd.GraphMeta.IArgs['graphMetaService'] = async args => {
        console.log('查图的meta元信息,args: ',args)
        if (args.meta.experimentInfo?.id) {
            getExperimentById(args.meta.experimentInfo).then(res => {
                console.log('ssssssss')
                console.log('查图的meta元信息: ',res)
                args.meta.experimentInfo = res.data
            })
        }
        return {...args,flowId: args.meta.flowId}
    }
    /** 加载图数据的api */
    export const loadGraphData = async (args) => {
        // 获取XFlow全局meta信息中的id
        console.log('into 期望的')
        console.log('meta: ',args.meta)
        let nodes = []
        let edges = []
        await getExperimentById(args.meta.experimentInfo).then(res => {
            console.log(res)
            const {data} = res
            if (data.content) {
                if(data.content?.nodes) {
                    nodes = data.content.nodes
                }
                if(data.content?.edges) {
                    edges = data.content.edges
                }
            }
        })
        // let nodes: NsGraph.INodeConfig[] = [
        //     {
        //         ...NODE_COMMON_PROPS,
        //         id: 'node1',
        //         label: '算法节点-1',
        //         ports: [
        //             {
        //                 id: 'node1-input-1',
        //                 type: NsGraph.AnchorType.INPUT,
        //                 group: NsGraph.AnchorGroup.TOP,
        //                 tooltip: '输入桩',
        //             },
        //             {
        //                 id: 'node1-output-1',
        //                 type: NsGraph.AnchorType.OUTPUT,
        //                 group: NsGraph.AnchorGroup.BOTTOM,
        //                 tooltip: '输出桩',
        //             },
        //         ] as NsGraph.INodeAnchor[],
        //     },
        //     {
        //         ...NODE_COMMON_PROPS,
        //         id: 'node2',
        //         label: '算法节点-2',
        //         ports: [
        //             {
        //                 id: 'node2-input-1',
        //                 type: NsGraph.AnchorType.INPUT,
        //                 group: NsGraph.AnchorGroup.TOP,
        //                 tooltip: '输入桩',
        //                 connected: true,
        //             },
        //             {
        //                 id: 'node2-output-1',
        //                 type: NsGraph.AnchorType.OUTPUT,
        //                 group: NsGraph.AnchorGroup.BOTTOM,
        //                 tooltip: '输出桩',
        //             },
        //         ] as NsGraph.INodeAnchor[],
        //     },
        //     {
        //         ...NODE_COMMON_PROPS,
        //         id: 'node3',
        //         label: '算法节点-3',
        //         ports: [
        //             {
        //                 id: 'node3-input-1',
        //                 type: NsGraph.AnchorType.INPUT,
        //                 group: NsGraph.AnchorGroup.TOP,
        //                 tooltip: '输入桩',
        //                 connected: true,
        //             },
        //             {
        //                 id: 'node3-output-1',
        //                 type: NsGraph.AnchorType.OUTPUT,
        //                 group: NsGraph.AnchorGroup.BOTTOM,
        //                 tooltip: '输出桩',
        //             },
        //         ] as NsGraph.INodeAnchor[],
        //     },
        //     {
        //         ...NODE_COMMON_PROPS,
        //         id: 'node4',
        //         label: '算法节点-4',
        //         ports: [
        //             {
        //                 id: 'node4-input-1',
        //                 type: NsGraph.AnchorType.INPUT,
        //                 group: NsGraph.AnchorGroup.TOP,
        //                 tooltip: '输入桩',
        //                 connected: true,
        //             },
        //             {
        //                 id: 'node4-output-1',
        //                 type: NsGraph.AnchorType.OUTPUT,
        //                 group: NsGraph.AnchorGroup.BOTTOM,
        //                 tooltip: '输出桩',
        //             },
        //         ] as NsGraph.INodeAnchor[],
        //     },
        // ]
        // let edges: NsGraph.IEdgeConfig[] = [
        //     {
        //         id: uuidv4(),
        //         source: 'node1',
        //         target: 'node2',
        //         sourcePortId: 'node1-output-1',
        //         targetPortId: 'node2-input-1',
        //     },
        //     {
        //         id: uuidv4(),
        //         source: 'node1',
        //         target: 'node3',
        //         sourcePortId: 'node1-output-1',
        //         targetPortId: 'node3-input-1',
        //     },
        //     {
        //         id: uuidv4(),
        //         source: 'node1',
        //         target: 'node4',
        //         sourcePortId: 'node1-output-1',
        //         targetPortId: 'node4-input-1',
        //     },
        // ]
        // nodes = []
        // edges = []
        console.log('nodes: ',nodes)
        console.log('edges: ',edges)
        return { nodes, edges }
    }
    /** 保存图数据的api */
    export const saveGraphData: NsGraphCmd.SaveGraphData.IArgs['saveGraphDataService'] = async (
        meta: NsGraph.IGraphMeta,
        graphData: NsGraph.IGraphData,
    ) => {
        console.log('saveGraphData api', meta, graphData)
        return {
            success: true,
            data: graphData,
        }
    }
    /** 部署图数据的api */
    export const deployDagService: NsDeployDagCmd.IDeployDagService = async (
        meta: NsGraph.IGraphMeta,
        graphData: NsGraph.IGraphData,
    ) => {
        console.log('deployService api', meta, graphData)
        return {
            success: true,
            data: graphData,
        }
    }

    /** 添加节点api */
    export const addNode: NsNodeCmd.AddNode.IArgs['createNodeService'] = async (
        args: NsNodeCmd.AddNode.IArgs,
    ) => {
        console.info('新建节点前置钩子', args)
        const { groupChildren } = args.nodeConfig
        /** 这里添加连线桩 */
        const node: NsNodeCmd.AddNode.IArgs['nodeConfig'] = {
            ...args.nodeConfig,
            ...NODE_COMMON_PROPS,
        }
        /** group没有链接桩 */
        if (groupChildren && groupChildren.length) {
            node.ports = []
        }
        return node
    }

    /** 更新节点 name，可能依赖接口判断是否重名，返回空字符串时，不更新 */
    export const renameNode: NsRenameNodeCmd.IUpdateNodeNameService = async (
        name,
        node,
        graphMeta,
    ) => {
        console.log('rename node', node, name, graphMeta)
        return { err: null, nodeName: name }
    }

    /** 删除节点的api */
    export const delNode: NsNodeCmd.DelNode.IArgs['deleteNodeService'] = async args => {
        console.info('delNode service running, del node:', args.nodeConfig.id)
        return true
    }

    /** 添加边的api */
    export const addEdge: NsEdgeCmd.AddEdge.IArgs['createEdgeService'] = async args => {
        console.log('my 添加边')
        console.info('addEdge service running, add edge:', args)
        const {edgeConfig} = args
        // console.log(edgeConfig)
        // // 添加边的时候，把源节点的指定字段赋值给目标节点的指定字段
        // const {commandService} = args
        //
        // const sourceId = args.edgeConfig.source
        // let sourceInfo = null
        // const targetId = args.edgeConfig.target
        // let targetInfo = null
        // commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
        //   XFlowGraphCommands.SAVE_GRAPH_DATA.id, {
        //       saveGraphDataService: async (_meta, _graphData) => {
        //           console.log('_graphData: ', _graphData)
        //           for (let i = 0; i < _graphData.nodes.length; i++) {
        //               const node = _graphData.nodes[i]
        //               // 1. 根据id获取源节点信息
        //               if (node.id === sourceId) {
        //                   sourceInfo = node
        //               }
        //               // 3. 根据id获取目标节点信息
        //               if (node.id === targetId) {
        //                   targetInfo = node
        //               }
        //           }
        //           console.log('sourceInfo', sourceInfo)
        //           console.log('targetInfo', targetInfo)
        //           const paramList = Object.keys(sourceInfo)
        //           let params = {}
        //           for (let i = 0; i < paramList.length; i++) {
        //               const oldParam = paramList[i]
        //               if (oldParam.indexOf('output_extra_') === -1 && oldParam.indexOf('output_') !== -1) {
        //                   const newParam = oldParam.replace('output', 'params')
        //                   params[newParam] = sourceInfo[oldParam]
        //               }
        //           }
        //           // 2. 获取源节点需要传递给后续节点的属性
        //           console.log(params)
        //           // 4. 用2得到的信息更新目标节点信息
        //           // 更新本节点
        //           console.log('targetInfo', targetInfo)
        //           await commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id, {
        //               nodeConfig: {
        //                   ...targetInfo,
        //                   ...params
        //               }
        //           })
        //           commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(
        //             XFlowGraphCommands.SAVE_GRAPH_DATA.id, {
        //                 saveGraphDataService: async (_meta, _graphData) => {
        //                     console.log('_graphData', _graphData)
        //                 }
        //             })
        //
        //       }
        //   })
        return {
            // attrs: {
            //     line: {
            //         sourceMarker: "circlePlus", // 实心箭头
            //         targetMarker: {
            //             name: "ellipse", // 椭圆
            //             rx: 10, // 椭圆箭头的 x 半径
            //             ry: 6, // 椭圆箭头的 y 半径
            //         },
            //     },
            // },
            edgeContentHeight: 10,
            edgeContentWidth: 10,
            label: "",
            renderKey: "",
            source: edgeConfig.source,
            sourcePortId: edgeConfig.sourcePortId,
            target: edgeConfig.target,
            targetPortId: edgeConfig.targetPortId,
            id: edgeConfig.edge.id
        }
    }

    /** 删除边的api */
    export const delEdge: NsEdgeCmd.DelEdge.IArgs['deleteEdgeService'] = async args => {
        console.info('delEdge service running, del edge:', args)
        return true
    }

    let runningNodeId = 0
    const statusMap = {} as NsGraphStatusCommand.IStatusInfo['statusMap']
    let graphStatus: NsGraphStatusCommand.StatusEnum = NsGraphStatusCommand.StatusEnum.DEFAULT
    export const graphStatusService: NsGraphStatusCommand.IArgs['graphStatusService'] = async () => {
        if (runningNodeId < 4) {
            statusMap[`node${runningNodeId}`] = { status: NsGraphStatusCommand.StatusEnum.SUCCESS }
            statusMap[`node${runningNodeId + 1}`] = { status: NsGraphStatusCommand.StatusEnum.PROCESSING }
            runningNodeId += 1
            graphStatus = NsGraphStatusCommand.StatusEnum.PROCESSING
        } else {
            runningNodeId = 0
            statusMap.node4 = { status: NsGraphStatusCommand.StatusEnum.SUCCESS }
            graphStatus = NsGraphStatusCommand.StatusEnum.SUCCESS
        }
        return {
            graphStatus: graphStatus,
            statusMap: statusMap,
        }
    }
    export const stopGraphStatusService: NsGraphStatusCommand.IArgs['graphStatusService'] = async () => {
            Object.entries(statusMap).forEach(([, val]) => {
                const { status } = val as { status: NsGraphStatusCommand.StatusEnum }
                if (status === NsGraphStatusCommand.StatusEnum.PROCESSING) {
                    val.status = NsGraphStatusCommand.StatusEnum.ERROR
                }
            })
            return {
                graphStatus: NsGraphStatusCommand.StatusEnum.ERROR,
                statusMap: statusMap,
            }
        }
}
