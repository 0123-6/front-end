import React, {useEffect, useRef, useState} from 'react'
/** app 核心组件 */
import {XFlow, XFlowCanvas, KeyBindings, NsJsonSchemaForm, WorkspacePanel} from '@antv/xflow'
import type {IApplication, IAppLoad} from '@antv/xflow'
/** 交互组件 */

import {
  /** 触发Command的交互组件 */
    CanvasScaleToolbar,
  JsonSchemaForm,
  // @ts-ignore
  NodeCollapsePanel,
  CanvasContextMenu,
  /** Graph的扩展交互组件 */
    CanvasSnapline,
  CanvasNodePortTooltip,
  DagGraphExtension,
} from '@antv/xflow'

/** app 组件配置  */
/** 配置画布 */
import {useGraphHookConfig} from './config-graph'
/** 配置Command */
import {useCmdConfig, initGraphCmds} from './config-cmd'
/** 配置Model */
import {useModelServiceConfig} from './config-model-service'
/** 配置Menu */
import {useMenuConfig} from './config-menu'
/** 配置快捷键 */
import {useKeybindingConfig} from './config-keybinding'
/** 配置JsonConfigForm */
import {controlMapService, formValueUpdateService} from "./config-form";

import './index.less'
import '@antv/xflow/dist/index.css'
import '../style/xflow.css';
import {Panel} from "./form-controls/customComponent/Panel";
import {TopArea} from "./TopArea";
import LeftArea from "./left-area";
import {AutoRightPanel} from "./form-controls/AutoRightPanel";
import BottomArea from "./BottomArea";
import RunSuccessModal from "./components/RunSuccessModal";
import RunErrorModal from "./components/RunErrorModal";

export interface IProps {
  meta: { flowId: string, [key: string]: any }
}

// 组件定义,其中props = {
//   meta: { flowId: 'test-meta-flow-id' },
// }
export const Demo: React.FC<IProps> = props => {
  console.log('XFlow props: ', props)
  const {meta} = props
  let isTest = false
  if (location.href.indexOf('/experiment/drag/test') === -1) {
    meta.experimentInfo = {
      // @ts-ignore
      id: Number(props.match.params.id)
    }
  } else {
    isTest = true
    meta.experimentInfo = {
      // @ts-ignore
      id: Number(props.match.params.id),
      is_test: 1
    }
    const isOamPage = location.pathname.indexOf('oam') !== -1
    if(isOamPage) {
      document.title = 'OAM-DataRefinery';
    }
  }

  // 实验的id
  // @ts-ignore
  // const experimentId = props.location.state.id
  // 图表挂钩配置
  const graphHooksConfig = useGraphHookConfig(props)
  // 顶部导航栏配置
  // const toolbarConfig = useToolbarConfig()

  // state
  const [showRunSuccessModal, setShowRunSuccessModal] = useState(false)
  const [showRunErrorModal, setShowRunErrorModal] = useState(false)
  const runSuccessModalData = useRef(null)
  const runErrorModalData = useRef(null)
  // methods
  const changeRunSuccessModalData = (data) => {
    runSuccessModalData.current = data
  }
  const changeRunErrorModalData = (data) => {
    runErrorModalData.current = data
  }
  const runSuccessModalOnOk = () => {
    setShowRunSuccessModal(false)
  }
  const runSuccessModalOnCancel = () => {
    setShowRunSuccessModal(false)
  }
  const runErrorModalOnOk = () => {
    setShowRunErrorModal(false)
  }
  const runErrorModalOnCancel = () => {
    setShowRunErrorModal(false)
  }

  // 菜单栏配置
  const viewDataParams = {
    setShowRunSuccessModal,
    setShowRunErrorModal,
    changeRunSuccessModalData,
    changeRunErrorModalData,
  }
  const menuConfig = useMenuConfig(viewDataParams)
  // 命令配置
  const cmdConfig = useCmdConfig()
  // 数据模型配置
  const modelServiceConfig = useModelServiceConfig()
  // 键盘事件配置
  const keybindingConfig = useKeybindingConfig()

  const getCustomRenderComponent: NsJsonSchemaForm.ICustomRender = (targetType, targetData, modelService, commandService) => {
    if (targetType !== 'node') {
      return Panel(targetType, targetData, modelService);
    }
    return ()=>AutoRightPanel({targetType, targetData, modelService, commandService});
  }

  const cache = React.useMemo<{ app: IApplication } | null>(
    () => ({
      // @ts-ignore
      app: null,
    }),
    [],
  )
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('onLoad')
    }
  }, [])
  /**
   * @param app 当前XFlow工作空间
   * @param extensionRegistry 当前XFlow配置项
   */

  const onLoad: IAppLoad = async app => {
    // @ts-ignore
    cache.app = app
    await initGraphCmds(cache.app)
    sessionStorage.setItem('onLoad', 'true')
  }

  // @ts-ignore
  // @ts-ignore

  /** 父组件meta属性更新时,执行initGraphCmds */
  // React.useEffect(() => {
  //     // @ts-ignore
  //     if (cache.app) {
  //       initGraphCmds(cache.app)
  //     }
  //   }, // @ts-ignore
  //   [cache.app, meta])
  console.log('Demo组件重新执行了')

  // render
  return (
    <div className="w-screen h-screen"
         style={{minWidth: '1200px'}}>
      <XFlow
        className="dag-user-custom-clz"
        hookConfig={graphHooksConfig}
        modelServiceConfig={modelServiceConfig}
        commandConfig={cmdConfig}
        onLoad={onLoad}
        meta={meta}
      >
        <DagGraphExtension/>
        {/*左侧拖拽区域*/}
        <WorkspacePanel position={{width: isTest?379:284, top: 60, bottom: 0, left: 0}}>
          <LeftArea isTest={isTest}/>
        </WorkspacePanel>
        {/*顶部按钮区域*/}
        <WorkspacePanel position={{left: 0, right: 0, top: 0, height: 60}}>
          <TopArea isTest={isTest}/>
        </WorkspacePanel>
        <XFlowCanvas position={{top: 60, left: isTest?379:284, right: 281, bottom: 58}}>
          <CanvasScaleToolbar position={{top: isTest?379:284, right: 19}}/>
          <CanvasContextMenu config={menuConfig()}/>
          <CanvasSnapline color="#faad14"/>
          <CanvasNodePortTooltip/>
        </XFlowCanvas>
        {/*底部按钮区域*/}
        <WorkspacePanel position={{left: isTest?379:284, right: 281, bottom: 0, height: 58}}>
          <BottomArea isTest={isTest}/>
        </WorkspacePanel>
        <JsonSchemaForm
          controlMapService={controlMapService}
          formSchemaService={()=>null}
          formValueUpdateService={formValueUpdateService}
          getCustomRenderComponent={getCustomRenderComponent}
          position={{top: 60, bottom: 0, right: 0, width: 281}}
        />
        <KeyBindings config={keybindingConfig}/>
      </XFlow>
      <RunSuccessModal data={runSuccessModalData.current}
                       show={showRunSuccessModal}
                       onOk={runSuccessModalOnOk}
                       onCancel={runSuccessModalOnCancel}
      />
      <RunErrorModal data={runErrorModalData.current}
                     show={showRunErrorModal}
                     onOk={runErrorModalOnOk}
                     onCancel={runErrorModalOnCancel}
      />
    </div>
  )
}

export default Demo

Demo.defaultProps = {
  meta: {flowId: 'hpj-test-meta'},
}
