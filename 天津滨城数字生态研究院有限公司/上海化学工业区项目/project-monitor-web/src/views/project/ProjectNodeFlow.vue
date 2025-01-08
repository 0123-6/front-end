
<template>
  <EeFlowchart ref="EeFlowchart" class="is-dark" :class="{ 'show-status': showStatus, 'is-loading': loading }"
    :flowId="flowId" :text="flowText" :currentNode="currentNode" @ready="handleReady" />
</template>

<script>
import EeFlowchart from '@/components/EeFlowchart.vue'
import { nodeStatusStyles, getNodeStatusOptions } from '@/utils/constant.js'
import useDictStore from '@/store/modules/dict'
const actionTitles = {
  '编辑': 'edit',
  '知识库': 'policy',
  '调度转办': 'shift',
  '添加备注': 'remark',
}
export default {
  name: 'ProjectNodeFlow',
  components: {
    EeFlowchart
  },
  props: {
    flowId: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      loading: false,
      ...useDictStore().getDicts(['step_status']),
      currentNode: ''
    }
  },
  computed: {
    flowText() {
      const { nodeData = [], lineData = [] } = this.data
      if (nodeData.length === 0 || lineData.length === 0) return ''
      if (this.showStatus) {
        const currentNode = nodeData.find(n => n.status == 1 || n.status == 2 || n.status == 4)
        if (currentNode) {
          this.currentNode = currentNode.nodeId
        } else {
          this.currentNode = ''
        }
      }
      const text = `flowchart LR\n` +
        `开始:::endpoint\n` +
        `结束:::endpoint\n` +
        // `聚合:::collectpoint\n` +
        this.getNodeClassText(nodeData) +
        this.getNodeText(nodeData) +
        this.getBeginLineText(nodeData) +
        this.getLineText(lineData) +
        this.getEndLineText(nodeData)
      // console.log('ProjectNodeFlow\n', text)
      return text
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    handleReady(val) {
      this.$emit('ready', val)
      this.bindEvents()
    },
    bindEvents() {
      this.$el.querySelectorAll('.node-link').forEach(n => {
        n.onclick = this.handleClickLink
      })
      if (this.showStatus) {
        this.$el.querySelectorAll('.node-name').forEach(n => {
          n.onclick = this.handleClickName
        })
        this.$el.querySelectorAll('.node-dropdown__item').forEach(n => {
          n.onclick = this.handleChangeStatus
        })
      }
    },
    handleClickLink(e) {
      console.log('handleClickLink', e)
      const target = e.target.nodeName == 'I' ? e.target.parentElement : e.target
      const obj = this.data.nodeData.find(n => target.parentElement.getAttribute('data-id') == n.nodeId)
      if (target.className.indexOf('node-name') > -1) {
        this.$emit('detail', obj)
        return
      }
      this.$emit(actionTitles[target.getAttribute('title')], obj)
    },
    handleClickName(e) {
      console.log('handleClickName', e)
      const obj = this.data.nodeData.find(n => e.target.getAttribute('data-id') == n.nodeId)
      this.$emit('detail', obj)
    },
    handleChangeStatus(e) {
      this.$emit('change', {
        status: e.target.getAttribute('data-value'),
        id: e.target.getAttribute('data-id'),
      })
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 200)
    },
    getBeginLineText(data) {
      return data.filter(n => n.lastNodeId === '0').map(n => `开始("<div class="text-center">开始</div><div style="width:61px;"></div>") --> ${n.nodeId}\n`).join('')
    },
    getEndLineText(data) {
      const endPoints = data.filter(n => n.nextNodeId === '0' || n.nextNodeId.split(',').indexOf('0') > -1)
      // if (endPoints.length == 1)
      return endPoints.map(n => `${n.nodeId} --> 结束("<div class="text-center">结束</div><div style="width:61px;"></div>")\n`).join('')
      // return endPoints.map(n => `${n.nodeId} --- 聚合("<div style="width:1px;height:50px;"></div>")\n`).join('') + `聚合 --> 结束("<div class="text-center">结束</div><div style="width:61px;"></div>")`
    },
    getNodeClassText(data) {
      return this.showStatus ? data.map((n, i) => `${n.nodeId}:::node-status-${nodeStatusStyles[n.status]}`).join('\n') + '\n' : ''
    },
    getNodeText(data) {
      return data.map((n, i) => `${n.nodeId}("` +
        `<div class="node-head d-flex ai-center jc-between">` +
        `<div class="node-index">${Math.abs(n.nodeId)}</div>` +
        `${this.getNodeStatusText(n, i)}` +
        `</div>` +
        `<div class="node-name ell ${this.showStatus && !this.showEdit ? 'pointer' : ''}" title="${n.name}" data-id="${n.nodeId}" style="width:145px;">${n.name}</div>` +
        `${this.getButtonText(n)}` +
        `<div class="node-mask" style="display:none;height:0px;"></div>")`).join(' \n') + '\n'
    },
    getLineText(data) {
      return data.length > 0 ? data.map(n => `${n.begin} --> ${n.end}`).join('\n') + '\n' : ''
    },
    getNodeStatusText(obj, i) {
      if (!this.showStatus) return ''
      return `<div class="ee-tag ee-tag--dot is-${nodeStatusStyles[obj.status]} ${this.disabled ? 'is-disabled' : ''} ml12">` +
        `${this.getDictName(this.step_status, obj.status)}<i class="iconfont ifont-arrow-down"></i>` +
        this.getDropdownText(obj) +
        `</div>`
    },
    getButtonText(obj) {
      const policyStr = '<div class="node-link pointer" title="知识库"><i class="iconfont ifont-policy"></i></div>' +
        '<div class="split-line"></div>'
      if (this.showStatus && !this.showEdit)
        return `<div class="node-foot d-flex ai-center jc-around" data-id="${obj.nodeId}">` +
          (obj.associatedKnowledge ? policyStr : '') +
          '<div class="node-link node-link--shift pointer" title="调度转办"><i class="iconfont ifont-shift"></i></div>' +
          '<div class="split-line"></div>' +
          '<div class="node-link pointer" title="添加备注"><i class="iconfont ifont-edit-circle"></i></div>' +
          '</div><div style="width:145px;height:16px;"></div>'
      const showEdit = ['0', '1', '2', '4'].indexOf(obj.status) > -1 || !obj.status
      return `<div class="node-foot d-flex ai-center jc-around" data-id="${obj.nodeId}">` +
        (obj.associatedKnowledge ? policyStr : '') +
        `<div class="node-link pointer" title="编辑" ${!showEdit ? 'style="opacity:0.5;pointer-events:none;"' : ''}><i class="iconfont ifont-edit"></i></div>` +
        '</div><div style="width:145px;height:12px;"></div>'
    },
    getDropdownText(obj) {
      const { status } = obj
      if (this.disabled || status == 3 || status == 5) return ''
      let options = getNodeStatusOptions(status, this.step_status)
      return `<div class="node-dropdown" style="display:none;height:0px;">` +
        `<div class="node-dropdown__arrow"></div>` +
        `<div class="node-dropdown__inner">` +
        options.map(n => `<div class="node-dropdown__item text-center pointer" data-value="${n.itemCode}" data-id="${obj.nodeId}">${n.itemName}</div>`).join('') +
        `</div>` +
        `</div>`
    },
    reset() {
      this.$refs.EeFlowchart.reset()
    }
  }
}

</script>