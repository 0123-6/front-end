export const projectStatusList = [
  { text: '正常推进', value: '1', type: 'success' },
  { text: '已延期', value: '2', type: 'danger' },
  // { text: '即将延期', value: '3', type: 'warning' },
  { text: '已终止', value: '4', type: 'info' },
]
export const projectStatusStyles = {
  '1': 'success',
  '2': 'warning',
  '3': 'danger',
  '4': 'info',
}

export const projectStatusTextToTypeMap = {
  '正常推进': 'success',
  '已延期': 'danger',
  // '即将延期': 'warning',
  '已终止': 'info',
}

export const stepStatusList = [
  { text: '已完成', value: '1', type: 'primary' },
  { text: '正常推进', value: '2', type: 'success' },
  { text: '未开始', value: '3', type: 'info' },
]

export const stageStyles = ['info', 'success', 'primary',]
export const stageColors = ['#8E9A9F', '#68CD44', '#02ADEC',]

export const nodeStatusList = [
  { text: '正常推进', value: '1', type: 'success' },
  { text: '已延期', value: '2', type: 'danger' },
  { text: '已暂停', value: '3', type: 'warning' },
  { text: '延期完成', value: '4', type: 'alert' },
  { text: '已完成', value: '5', type: 'primary' },
  { text: '未开始', value: '6', type: 'info' },
]

export const nodeStatusStyles = {
  '0': 'info',
  '1': 'success',
  '2': 'warning',
  '3': 'primary',
  '4': 'danger',
  '5': 'alert',
}

export const nodeStatusColors = {
  '0': '#b7c1c5',
  '1': '#68cd44',
  '2': '#fab752',
  '3': '#02adec',
  '4': '#e85050',
  '5': '#f28c53',
}

export function getNodeStatusOptions(status) {
  if (status == 3 || status == 5) return ''
  if (status == 0 || status == 2) return [{ itemCode: '1', itemName: '正常推进' }]
  if (status == 1 || status == 4) return [{ itemCode: '3', itemName: '已完成' }, { itemCode: '2', itemName: '暂停' }]
}

export const fileStatusList = [
  { text: '生效中', value: '1', type: 'primary' },
  { text: '待生效', value: '2', type: 'alert' },
  { text: '已失效', value: '3', type: 'info' },
]

export const projecCategoryList = [
  { text: '产业项目', value: '1' },
  { text: '市政项目', value: '2' },
  { text: '路桥项目', value: '3' },
  { text: '公共设施项目', value: '4' },
]

export const messageTypeList = [
  { text: '进度更新', value: '1' },
  { text: '转办提醒', value: '2' },
  { text: '项目终止提醒', value: '3' },
  { text: '项目延期提醒', value: '4' },
]

export const energyUseList = [
  { text: '2000 - 50000吨标准煤', value: '1' },
  { text: '> 50000吨标准煤', value: '2' },
  { text: '< 2000吨标准煤', value: '3' },
]

export const dayTypeList = [
  { text: '工作日', value: '1' },
  { text: '日历日', value: '2' },
]

export const landTypeList = [
  { text: '土地出让', value: '1' },
  { text: '土地转让', value: '2' },
  { text: '其他或不涉及', value: '3' },
]

export const fileExts = {
  'doc': 'word',
  'docx': 'word',
  'pdf': 'pdf',
  'xlsx': 'excel',
  'xls': 'excel',
  'xlsm': 'excel',
  'png': 'png',
  'jpg': 'jpg',
  'jpeg': 'jpg',
}
