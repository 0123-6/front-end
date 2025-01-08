import {controlMapService} from './form-controls'
import {NsGraph, NsJsonSchemaForm, NsNodeCmd, XFlowNodeCommands} from '@antv/xflow'
import {set} from 'lodash'

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

/** 保存form的values */
export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService = async args => {
  console.log('update args: ',args)
  const { allFields, commandService, targetData } = args
  // await commandService.executeCommand<NsGraphCmd.GraphLoadData.IArgs>(XFlowGraphCommands.LOAD_DATA.id);
  const updateNode = (node: NsGraph.INodeConfig) => {
    return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
      XFlowNodeCommands.UPDATE_NODE.id,
      { nodeConfig: node },
    )
  }
  // console.log('formValueUpdateService  values:', values, args)
  const nodeConfig: NsGraph.INodeConfig = {
    ...targetData
  }
  allFields.forEach(val => {
    set(nodeConfig, val.name, val.value)
  })
  updateNode(nodeConfig)
}

export { controlMapService }
