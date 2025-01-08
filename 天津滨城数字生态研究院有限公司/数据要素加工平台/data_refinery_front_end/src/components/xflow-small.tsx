import {createGraphConfig, NsGraphStatusCommand, uuidv4, WorkspacePanel, XFlow, XFlowCanvas} from "@antv/xflow";
import {DND_RENDER_ID} from "../dag/constant";
import {AlgoNode} from "../dag/react-node/algo-node";
import React, {useEffect} from "react";
import NodeNumSvg from "../icon/experiment/NodeNumSvg";

export const ModelServieCard = (props) => {
  return (
    <div className={"w-full h-full rounded-xl bg-white flex justify-center items-center text-white-svg-experiment"}
         style={{border: '1px solid rgba(243,243,243,1)',color:(!props.new)?'rgb(206,220,222)':'#97A6A8'}}>
      <NodeNumSvg/>
      <div className={"ml-2 flex items-center text-main text-sm"}>{props.sum}</div>
    </div>
  )
}

interface IProps {
  content?: any
  type?: 'row' | 'column'
  new?: boolean
  canClick?: boolean
  onClick?: (any) => void
}

export default function XflowSmall(props:IProps) {
  let content = null
  const {canClick=false, onClick} = props
  if (props?.content) {
    for (let i = 0; i < props.content.nodes.length; i++) {
      props.content.nodes[i].ports = undefined
      props.content.nodes[i].width = 212
      props.content.nodes[i].status = NsGraphStatusCommand.StatusEnum.DEFAULT
    }
    for (let i=0;i<props.content.edges.length;i++) {
      props.content.edges[i].attrs = {
        line: {
          stroke: '#D9D9D9'
        }
      }
    }
    content = JSON.parse(JSON.stringify(props.content))
  }
  useEffect(() => {
    console.log('xflow-small, mount')
    return () => {
      console.log('xflow-small, unmount')
    }
  }, [])
  // @ts-ignore
  return (
    <div className={"w-full h-full xflow-small overflow-x-auto overflow-y-hidden"}>
      <div className={"w-full h-full"}
           style={{
             width: (props.type === 'row' && props?.content?.nodes?.length >= 4) ? `calc(100% + ${(props.content.nodes.length-3) * 220}px)` : '100%',
           }}>
        <XFlow
          onAppDestroy={_app => {
            console.log('onAppDestroy', _app)
            _app.graphProvider.getGraphInstance().then(graph => {
              graph.dispose()
            })
            // _app.commandService.g
          }
          }
          className={`${!props.new?'bg-xflow':'bg-xflow-a'}`}
          graphData={content}
          graphLayout={{
            layoutType: 'dagre',
            layoutOptions: {
              type: 'dagre',
              rankdir: props.type === 'row' ? 'LR' : 'TB',
              // align:'UL',
              // nodesep: 60,
              ranksep: props.type === 'row' ? 70 : 30,
            },
          }}
          onLoad={async _app => {
            const graph = await _app.getGraphInstance();
            // graph.zoom(-0.2);
            if (props.type !== 'row') {
              graph.transform.setMatrix({a:1,b:0,c:0,d:1,e:-31,f:10})
            }
            graph.disablePanning()
            graph.disableMouseWheel()
            graph.disableMultipleSelection()
            graph.freeze()
            graph.disableKeyboard()

            if(canClick) {
              graph.on('node:click', ({ node }) => {
                // 处理节点点击事件的逻辑
                console.log('Node clicked:', node);
                onClick(node.id)
              });
            } else {
              graph.disableSelection()
            }
          }}
        >
          <XFlowCanvas
            config={
              createGraphConfig(config => {
                /** 预设XFlow画布需要渲染的React节点/边 */
                config.setX6Config({
                  grid: false,
                  interacting: false,
                })
                config.setNodeRender(DND_RENDER_ID, AlgoNode)
                // graphId为随机数
                config.graphId = uuidv4()+new Date().toLocaleTimeString()
              })()
            }
          />
          <WorkspacePanel
            position={{top: !props.new?24:9, left: !props.new?24:14, width: 61, height: 23}}>
            <ModelServieCard sum={content?.nodes.length} new={props.new}/>
          </WorkspacePanel>
        </XFlow>
      </div>
    </div>
  )
}
