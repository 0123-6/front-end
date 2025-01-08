<template>
  <el-drawer class="NodeHandleDetail" v-model="visible" size="900px" :close-on-click-modal="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex ai-center jc-between flex-1">
        <div class="f500">环节详情</div>
      </div>
    </template>
    <div class="flex-y-center full-h">
      <div class="pdl24 pdr24 flex-1 y-auto full-w">
        <div class="mt20 ee-card over-h">
          <div class="status-row d-flex ai-center" :class="'status-row--' + form.statusCode">
            <ee-tag class="is-dark" :type="nodeStatusStyles[form.statusCode]" shape="round-rect">
              {{ getDictName(step_status, form.statusCode) }}
            </ee-tag>
            <div class="flex-1 ml16 f14">【{{ form.periodName }}】{{ form.stepName }}</div>
            <div v-if="form.delayDays > 0" class="f-danger ml12">
              延期<span class="ddin-n f16">{{ form.delayDays
              }}</span>天
            </div>
          </div>
          <el-descriptions :column="2">
            <el-descriptions-item label="发起部门：" label-class-name="w110" align="left">
              {{ form.startDeptName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item width="220px" label="预计开始时间：" align="left">
              <span v-if="form.estStartTime" class="ddin-n f16">{{ form.estStartTime || '-' }}</span>
              <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item label="受理/经办部门：" label-class-name="w110" align="left">
              {{ form.acceptDeptName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="实际开始时间：" align="left">
              <span v-if="form.startTime" class="ddin-n f16">{{ form.startTime || '-' }}</span>
              <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item label="协调部门：" label-class-name="w110" align="left">
              {{ form.coordinateDeptName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="预计结束时间：" align="left">
              <span v-if="form.estEndTime" class="ddin-n f16">{{ form.estEndTime || '-' }}</span>
              <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item label="联系人：" label-class-name="w110" align="left">
              <el-avatar v-if="form.stepContactName" class="mr4" :src="form.url" size="small">
                <el-icon>
                  <UserFilled />
                </el-icon>
              </el-avatar>
              <span>{{ form.stepContactName || '-' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="实际结束时间：" align="left">
              <span v-if="form.endTime" class="ddin-n f16">{{ form.endTime || '-' }}</span>
              <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item label="法定时限：" label-class-name="w110" align="left">
              <span class="ddin-n f16">{{ form.stepDurationFd || '-' }}</span>
              <span>（{{ getDictName(duration_type, form.durationTypeCode) }}）</span>
            </el-descriptions-item>
            <el-descriptions-item />
            <el-descriptions-item label="承诺时限：" label-class-name="w110" align="left">
              <span class="ddin-n f16">{{ form.stepDuration }}</span>
              <span>（{{ getDictName(duration_type, form.durationTypeCode) }}）</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="d-flex ai-center mt24">
          <span class="f-l3 f14">关联附件：</span>
          <el-upload v-model:file-list="fileList" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :http-request="httpRequest" :auto-upload="false" multiple :limit="10" :on-change="handleFileChange"
            :before-upload="beforeUpload" :on-progress="onProgress"
            accept="application/msword,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
            :show-file-list="false">
            <el-button :disabled="fileList.length == 10">
              <el-icon class="el-icon--left">
                <Plus />
              </el-icon>添加附件
            </el-button>
          </el-upload>
          <span class="f-l3 ml8 f14">支持 pdf、word、excel、jpg、png 格式；大小在5M以内；最多可上传10个附件</span>
        </div>
        <el-row v-if="fileList.length > 0" class="ee-file" :gutter="12">
          <el-col v-for="n in fileList" :key="n.name" :span="8" class="mt12">
            <div class="ee-file-item d-flex ai-center radius8">
              <svg-icon :icon="getFileIcon(n.name)" width="32px" height="32px" />
              <div class="ml8 flex-1" style="width: 0;">
                <div class="d-flex ai-center">
                  <div class="flex-1 mr8 f14 ell" :class="{ 'pointer': validImage(n.name) }" :title="n.name"
                    @click="onPreview(n.name, n.url)">{{ n.name }}</div>
                  <el-button type="info" link @click="handleRemove(n)">
                    <el-icon size="18px">
                      <Close />
                    </el-icon>
                  </el-button>
                </div>
                <div v-if="n.status == 'fail'" class="d-flex ai-center mt4">
                  <span class="f12 f-danger">上传失败</span>
                  <el-button class="ml20 f12" type="primary" link @click="handleReupload(n)">重新上传</el-button>
                </div>
                <el-progress v-else-if="!n.percentage || n.percentage < 100" class="mt8" :percentage="n.percentage || 0"
                  :stroke-width="4" :show-text="false" />
                <div v-else class="f-l4 f12"><span class="ddin-n">{{ getFileSize(n.size) }}</span></div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-empty v-else class="ee-empty-data is-md" description="暂无附件">
          <template #image>
            <svg-icon icon-class="empty-data" />
          </template>
        </el-empty>
        <div class="d-flex ai-center mt24">
          <span class="f-l3 f14">相关备注：</span>
          <el-button @click="handleRemark">
            <el-icon class="el-icon--left">
              <Plus />
            </el-icon>添加备注
          </el-button>
        </div>
        <NodeTimeline class="mt20" :params="remarkParams" :ellipse="false" size="md" />
      </div>
    </div>
    <el-image-viewer v-if="showViewer" :initial-index="curImg" :url-list="imgs" @close="showViewer = false" />
  </el-drawer>
</template>

<script>
import { fileExts, nodeStatusStyles } from '@/utils/constant.js'
import { getFileSize } from '@/utils'
import { validImage } from '@/utils/validate'
import NodeTimeline from './NodeTimeline';
import { ruStepAct_getStepDetail } from '@/api/pm/ruStepAct.js'
import { ruStepAttachment_add, ruStepAttachment_delete } from '@/api/pm/ruStepAttachment.js'
import { knowledgeBase_uploadFile } from '@/api/repository/knowledgeBase.js'
import { mapState } from 'pinia'
import useProjectStore from '@/store/modules/project'
import useDictStore from '@/store/modules/dict'

export default {
  name: 'NodeHandleDetail',
  components: {
    NodeTimeline,
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      nodeStatusStyles,
      ...useDictStore().getDicts(['step_status', 'duration_type']),
      visible: false,
      form: {},
      fileList: [],
      showViewer: false,
      curImg: '',
      remarkParams: {}
    }
  },
  watch: {
    show() {
      this.visible = true
      this.getDetail()
    },
    form(val) {
      const { projectId, stepId } = val
      this.remarkParams = {
        projectId,
        stepId,
      }
    },
    refreshRemark() {
      this.remarkParams = {
        ...this.remarkParams,
        refresh: !this.remarkParams.refresh
      }
    }
  },
  computed: {
    ...mapState(useProjectStore, ['refreshRemark']),
    handleParams() {
      const { projectId, stepId } = this.form
      return {
        projectIds: projectId,
        stepId
      }
    },
    imgs() {
      return this.fileList.filter(n => validImage(n.name)).map(n => n.url)
    }
  },
  methods: {
    getFileSize,
    validImage,
    getDetail() {
      const { projectId, periodId, stepId } = this.params
      ruStepAct_getStepDetail({
        projectId, periodId, stepId
      }).then(({ result }) => {
        this.form = result
        this.form.periodName = this.params.periodName
        this.fileList = result.stepAttachments.map(n => ({
          name: n.attachmentName,
          url: n.attachmentUrl,
          uid: n.id,
          id: n.id,
          percentage: 100
        }))
      })
    },
    onPreview(name, url) {
      if (!validImage(name)) return
      this.curImg = this.imgs.findIndex(n => n === url)
      this.showViewer = true
    },
    beforeUpload(file) {
      const isLt5M = file.size <= 5 * 1024 * 1024;
      if (!isLt5M) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 5MB!'
        });
      }
      return isLt5M;
    },
    httpRequest(file) {
      const formData = new FormData();
      formData.append('file', file.raw);
      formData.bucketName = 'cip-pm'
      knowledgeBase_uploadFile(formData).then(({ result, code }) => {
        if (code === '00000') {
          const { fileUrl } = result
          this.fileList.find(n => n.uid == file.uid).percentage = 100
          this.fileList.forEach(n => {
            if (n.uid === file.uid) {
              n.url = fileUrl
              this.saveFile(n)
            }
          })
        } else {
          this.fileList.find(n => n.uid == file.uid).status = 'fail'
        }
      });
    },
    saveFile(file) {
      const { projectId, periodId, stepId } = this.params
      ruStepAttachment_add({
        "attachmentName": file.name,
        "attachmentUrl": file.url,
        projectId, periodId, stepId
      }).then(({ success, result }) => {
        if (success) {
          file.id = result
        }
      })
    },
    onProgress(e, file, files) {
      console.log('onProgress', e, file, files)
      this.fileList = files
    },
    handleFileChange(file, files) {
      this.fileList = files
      // console.log('handleFileChange', file, files)
      if (this.beforeUpload(file)) {
        this.httpRequest(file)
      }
    },
    getFileIcon(name) {
      return 'ext-' + fileExts[name.split('.')[name.split('.').length - 1].toLowerCase()]
    },
    handleRemove(obj) {
      if (!obj.id) {
        this.fileList = this.fileList.filter(n => n.uid != obj.uid)
        return
      }
      this.$confirm(
        '确认删除该附件吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          ruStepAttachment_delete({ id: obj.id }).then(({ success }) => {
            if (success) {
              this.$message({
                type: 'success',
                message: '删除附件成功',
              })
              this.fileList = this.fileList.filter(n => n.uid != obj.uid)
            }
          })
        })
        .catch(() => {

        })
    },
    handleRemark() {
      this.$emit('remark', JSON.parse(JSON.stringify(this.form)))
    },
  }
};
</script>

<style lang="scss">
.NodeHandleDetail {
  .ee-card {
    border: 1px solid #E2E2E2;
  }

  .status-row {
    padding: 8px 20px;

    &--0 {
      background: rgba(183, 193, 197, 0.1);
    }

    &--1 {
      background: rgba(104, 205, 68, 0.1);
    }

    &--2 {
      background: rgba(250, 183, 82, 0.1);
    }

    &--3 {
      background: rgba(2, 173, 236, 0.1);
    }

    &--4 {
      background: rgba(232, 80, 80, 0.1);
    }

    &--5 {
      background: rgba(242, 140, 83, 0.1);
    }
  }

  .el-descriptions {
    padding: 12px 20px;

    &__body {
      background: none;
    }

    .w75,
    .w110 {
      display: inline-block;
      text-align: right;
    }

    .w75 {
      width: 75px;
    }

    .w110 {
      width: 110px;
    }
  }

  .ee-file {
    &-item {
      padding: 0 14px;
      height: 60px;
      background: #FDFDFE;
      border: 1px solid #F3F7FB;
    }
  }
}
</style>

