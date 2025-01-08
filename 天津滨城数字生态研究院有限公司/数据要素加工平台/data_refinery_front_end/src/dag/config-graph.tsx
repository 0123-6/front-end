import type {IProps} from './index'
import {NsGraph, NsNodeCmd} from '@antv/xflow'
import {XFlowNodeCommands} from '@antv/xflow'
import {createHookConfig, DisposableCollection} from '@antv/xflow'
import {DND_RENDER_ID, GROUP_NODE_RENDER_ID} from './constant'
import {AlgoNode} from './react-node/algo-node'
import {GroupNode} from './react-node/group'
import type { Graph } from '@antv/x6'

// 配置画布,createHookConfig的文档是
/**
 * export declare const createHookConfig: <T extends unknown = any>(addOptions: (config: HookConfig, container: IValueProxy<T>) => void) => (value?: T) => XFlowHookConfig;
 *
 * addOptions是一个箭头函数(config,container),没有返回值
 * createHookConfig是一个箭头函数,该箭头函数的参数为一个箭头函数addOptions，返回值为1个箭头函数
 * const createHookConfig(addOptions) => (value) => XFlowHookConfig;
 */
export const useGraphHookConfig = createHookConfig<IProps>((config, proxy) => {
  // console.log('config: ',config)
  // console.log('proxy: ',proxy)
  // 获取 Props
  const props = proxy.getValue()
  console.log('get main props', props)
  config.setRegisterHook(hooks => {
    const disposableList = [
      // 注册增加 react Node Render
      hooks.reactNodeRender.registerHook({
        name: 'add react node',
        handler: async renderMap => {
          renderMap.set(DND_RENDER_ID, AlgoNode)
          // console.log('my add react node')
          renderMap.set(GROUP_NODE_RENDER_ID, GroupNode)
        },
      }),
      // 注册修改graphOptions配置的钩子
      hooks.graphOptions.registerHook({
        name: 'custom-x6-options',
        after: 'dag-extension-x6-options',
        handler: async options => {
          console.log('into options,options: ',options)
          options.grid = false
          options.keyboard = {
            enabled: true,
          }
          options.history = {
            enabled: true,
            ignoreAdd: false,
            ignoreRemove: false,
            ignoreChange: true,
          }
          const graphOptions: Graph.Options = {
            connecting: {
              // 是否触发交互事件
              validateMagnet(args) {
                return args.magnet.getAttribute('port-group') !== NsGraph.AnchorGroup.TOP
              },
              // 显示可用的链接桩
              validateConnection(args) {
                // console.log('into validateConnection,args: ',args)
                const { sourceView, targetView, sourceMagnet, targetMagnet } = args
                // 不允许连接到自己
                if (sourceView === targetView) {
                  return false
                }
                // 只能从上游节点的输出链接桩创建连接
                if ( sourceMagnet.getAttribute('port-group') === NsGraph.AnchorGroup.TOP) {
                  return false
                }
                // 没有起点的返回false
                if (!sourceMagnet) {
                  return false
                }
                if (!targetMagnet) {
                  return false
                }
                // 只能连接到下游节点的输入桩
                if (targetMagnet.getAttribute('port-group') !== NsGraph.AnchorGroup.TOP) {
                  return false
                }
                const node = targetView!.cell as any
                // 判断目标链接桩是否可连接
                const portId = targetMagnet.getAttribute('port')!
                const port = node.getPort(portId)
                console.log('port: ',port)
                return !(port && port.connected);
              },
            },
          }
          console.log(graphOptions)
          options.connecting = { ...options.connecting, ...graphOptions.connecting }
          options.connecting = {
            ...options.connecting,
            connector: 'rounded'
          }
        },
      }),
      // 注册增加 graph event
      hooks.x6Events.registerHook({
        name: 'add',
        handler: async events => {
          events.push({
            eventName: 'node:moved',
            callback: (e, cmds) => {
              const {node} = e
              cmds.executeCommand<NsNodeCmd.MoveNode.IArgs>(XFlowNodeCommands.MOVE_NODE.id, {
                id: node.id,
                position: node.getPosition(),
              })
            },
          } as NsGraph.IEvent<'node:moved'>)
        },
      }),
    ]
    const toDispose = new DisposableCollection()
    toDispose.pushAll(disposableList)
    return toDispose
  })
})
