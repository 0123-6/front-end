<template>
  <!--最外层-->
  <div
    class="flex justify-center bgc-main my-create-notebook id13e"
    style="min-width: var(--content-div-min-width);width: 100%;min-height: 100%;"
  >
    <message-dialog
      v-if="showDialog"
      @save="dialogOk"
      @cancel="dialogCancel"
    >
      <template slot="content">
        <div class="content-container" style="text-align: left;" v-html="dialogContent" />
      </template>
    </message-dialog>
    <!--内容-->
    <div
      v-loading="loading"
      class="flex flex-direction box-shadow-1 bgc-white margin-top-16 margin-bottom-16"
      style="width: 75.45%;min-width: var(--content-div-min-width);padding-left: 54px;padding-right: 16px;"
    >
      <!--新建notebook-->
      <div class="flex justify-between align-center margin-top-16 padding-bottom-16 border-bottom" style="width: 100%;">
        <div class="flex font-weight-500 font-size-16 color-title">
          新建Notebook
        </div>
        <!--        <div class="flex bgc-white justify-center align-center hand" @click="goBack"-->
        <!--             style="width: 54px;height: 24px;border: 1px solid rgba(197,201,207,1);margin-right: 20px;">-->
        <!--          <div style="margin-right: 8px;">-->
        <!--            <i class="el-icon-caret-left" style="width: 7px;height: 7px;color: #D8D8D8;"></i>-->
        <!--          </div>-->
        <!--          <div class="flex font-size-14 color-title">返回</div>-->
        <!--        </div>-->
        <el-button class="return-btn" icon="el-icon-caret-left" style="margin-right: 20px;" @click="goBack">返回</el-button>
      </div>
      <!--除新建notebook的其它部分-->
      <div v-if="!loading && defaultConfig!=null" class="flex flex-direction" style="width: 660px;">
        <!--名称-->
        <div class="flex align-center margin-top-24" style="width: 100%;">
          <div class="flex font-size-14 color-content padding-right-24">名称:</div>
          <el-input
            v-model="form.name"
            style="width: calc(100% - 66px);"
            placeholder="名称必须由小写字母数字字符或“-”组成，以字母字符开头，以字母数字字符结尾。"
            @change="changeName"
          />
        </div>
        <!--Docker镜像-->
        <div class="flex flex-direction margin-top-24">
          <title-style title="Docker镜像" />
          <el-checkbox v-model="form.customImageCheck" :disabled="!form.allowCustomImage" @change="changeServerType">自定义镜像</el-checkbox>
          <el-tabs
            v-model="form.serverType"
            type="border-card"
            stretch
            class="margin-top-16"
            @tab-click="changeServerType"
          >
            <el-tab-pane
              v-for="(item,index) in serverTypeList"
              :key="index"
              :name="item.value"
              style="min-width: 150px;"
              class="flex justify-center align-center"
            >
              <img v-if="index===0" slot="label" src="@/assets/images/notebook/jupyterlab.png" alt="图片加载失败">
              <img v-if="index===1" slot="label" src="@/assets/images/notebook/codeserver.png" alt="图片加载失败">
              <img v-if="index===2" slot="label" src="@/assets/images/notebook/rstudio.png" alt="图片加载失败">
            </el-tab-pane>
          </el-tabs>
          <div class="flex align-center">
            <div class="flex justify-end font-size-14 color-content padding-right-24" style="width: 140px;">镜像:</div>
            <el-select
              v-if="form.customImageCheck===false"
              v-model="form.image"
              style="width: calc(100% - 140px);max-width: 580px;"
              placeholder="请选择"
            >
              <template v-for="item in defaultConfig.image.options">
                <el-option
                  v-if="form.serverType === 'jupyter'"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </template>
              <template v-for="item in defaultConfig.imageGroupOne.options">
                <el-option
                  v-if="form.serverType === 'group-one'"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </template>
              <template v-for="item in defaultConfig.imageGroupTwo.options">
                <el-option
                  v-if="form.serverType === 'group-two'"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </template>
            </el-select>
            <el-input
              v-if="form.customImageCheck"
              v-model="form.image"
              style="width: calc(100% - 140px);max-width: 580px;"
              placeholder="请输入镜像名称"
            />
          </div>
          <div class="flex align-center margin-top-16">
            <div class="flex justify-end font-size-14 color-content padding-right-24" style="width: 140px;">镜像拉取策略:</div>
            <el-select
              v-model="form.imagePullPolicy"
              style="max-width: 580px;width: calc(100% - 140px);"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in imagePullPolicyList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </div>
        <!--CPU/RAM-->
        <div class="flex flex-direction margin-top-24" style="width: 100%;">
          <title-style title="CPU/RAM" />
          <!--上-->
          <div class="flex justify-between align-center" style="width: 100%;">
            <!--左-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                申请 CPU(核数):
              </div>
              <!--下-->
              <div class="flex margin-top-8">
                <el-input-number v-model="form.cpu" :min="0.1" :max="form.cpuLimit" :step="0.1" :controls="false" :precision="1"/>
<!--                <el-input v-model="form.cpu" @change="changeCpu"/>-->
              </div>
            </div>
            <!--右-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                申请内存(Gi):
              </div>
              <!--下-->
              <div class="flex margin-top-8">
                <el-input-number v-model="form.memory" :min="0.1" :max="form.memoryLimit" :step="0.1" :controls="false" :precision="1"/>
<!--                <el-input v-model="form.memory" @change="changeMemory"/>-->
              </div>
            </div>
          </div>
          <!--下-->
          <div class="flex justify-between align-center margin-top-8" style="width: 100%;">
            <!--左-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                CPU限制(核数):
              </div>
              <!--下-->
              <div class="flex margin-top-8">
                <el-input-number v-model="form.cpuLimit" :min="form.cpu" :max="Number(defaultConfig.cpu.max)" :step="0.1" :precision="1" :controls="false"/>
<!--                <el-input v-model="form.cpuLimit" @change="changeCpuLimit"/>-->
              </div>
            </div>
            <!--右-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                内存限制(Gi):
              </div>
              <!--下-->
              <div class="flex margin-top-8">
                <el-input-number v-model="form.memoryLimit" :min="form.memory" :max="Number(defaultConfig.memory.max)" :step="0.1" :precision="1" :controls="false"/>
<!--                <el-input v-model="form.memoryLimit" @change="changeMemoryLimit"/>-->
              </div>
            </div>
          </div>
        </div>
        <!--GPUs-->
        <div class="flex flex-direction margin-top-24" style="width: 100%;">
          <title-style title="GPUs" />
          <div class="flex justify-between align-center" style="width: 100%;">
            <!--左-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                GPU(卡数):
              </div>
              <!--下-->
              <div class="flex margin-top-8">
                <el-select v-model="form.gpus.num" style="width: 100%;" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in gpuNumList"
                    :key="index"
                    style="width: 100%;"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
            </div>
            <!--右-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                GPU(品牌):
              </div>
              <!--下-->
              <div class="flex margin-top-8">
                <el-select v-model="form.gpus.vendor" :disabled="true || form.gpus.num=='0'" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in gpuVendorList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <!--工作空间存储卷-->
        <div class="flex flex-direction margin-top-24" style="width: 100%;">
          <title-style title="工作空间存储卷" />
          <div class="flex">
            <div class="flex font-size-14 color-content">
              存储卷将挂在您的主目录:
            </div>
          </div>
          <!--内容区-->
          <create-volume
            v-if="haveWorkspace"
            class="margin-top-8"
            :form.sync="form.workspace"
            @delete="deleteWorkspaceVolume"
          />
          <!--按钮区-->
          <div class="flex justify-between align-center margin-top-8" style="width: 100%;height: 40px;">
            <!--左-->
            <div style="width: 48%;height: 100%;">
              <el-button
                :disabled="haveWorkspace"
                class="operation-primary-button"
                style="width: 100%;height:100%;"
                @click="addWorkspaceVolumeNew"
              >添加
              </el-button>
            </div>
            <!--右-->
            <div style="width: 48%;height: 100%;">
              <el-button
                :disabled="haveWorkspace || true"
                class="operation-primary-button"
                style="width: 100%;height: 100%;"
                @click="addWorkspaceVolumeHad"
              >附加已有卷
              </el-button>
            </div>
          </div>
        </div>
        <!--数据存储卷-->
        <div class="flex flex-direction margin-top-24" style="width: 100%;">
          <title-style title="数据存储卷" />
          <div class="flex">
            <div class="flex font-size-14 color-content">
              附加卷将被挂在您的Notebook:
            </div>
          </div>
          <!--内容区-->
          <create-volume
            v-for="(item,index) in form.datavols"
            :key="index"
            :form.sync="item"
            @delete="deleteDataVolume(index)"
          />
          <!--按钮区-->
          <div class="flex justify-between align-center margin-top-8" style="width: 100%;height: 40px;">
            <!--左-->
            <div style="width: 48%;height: 100%;">
              <el-button
                :disabled="true"
                class="operation-primary-button"
                style="width: 100%;height:100%;"
                @click="addDataVolumeNew"
              >添加
              </el-button>
            </div>
            <!--右-->
            <div style="width: 48%;height: 100%;">
              <el-button
                :disabled="true"
                class="operation-primary-button"
                style="width: 100%;height: 100%;"
                @click="addDataVolumeHad"
              >附加已有卷
              </el-button>
            </div>
          </div>
        </div>
        <!--配置-->
        <div v-if="false" class="flex flex-direction margin-top-24" style="width: 100%;">
          <title-style title="配置" />
          <el-select v-model="form.configurations">
            <el-option
              v-for="(item,index) in defaultConfig.configurations.value"
              :key="index"
              :value="item"
              :label="item"
            />
          </el-select>
        </div>
        <!--关联配置-->
        <div v-if="false" class="flex flex-direction margin-top-24" style="width: 100%;">
          <title-style title="关联配置" />
          <!--上-->
          <div class="flex justify-between align-center" style="width: 100%;">
            <!--左-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                Aifinity config:
              </div>
              <!--下-->
              <div class="flex margin-top-8" style="width: 100%;">
                <el-select v-model="form.affinityConfig" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in defaultConfig.affinityConfig.options"
                    :key="index"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </div>
            </div>
            <!--右-->
            <div class="flex flex-direction" style="width: 48%;">
              <!--上-->
              <div class="font-size-14 color-content">
                Tolerations Group:
              </div>
              <!--下-->
              <div class="flex margin-top-8" style="width: 100%;">
                <el-select v-model="form.tolerationGroup" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in defaultConfig.tolerationGroup.options"
                    :key="index"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <!--其他设置-->
        <div class="flex flex-direction margin-top-24">
          <title-style title="其他设置" />
          <div class="flex align-center margin-top-8">
            <div class="flex justify-center align-center">
              <el-switch
                v-model="form.shm"
                style="display: block"
                active-color="#0164FF"
                inactive-color="#646464"
              />
            </div>
            <div class="flex margin-left-8 color-content font-size-14">
              <div v-show="form.shm">启用共享内存</div>
              <div v-show="!form.shm">不启用共享内存</div>
            </div>
          </div>
        </div>
        <!--底部按钮区-->
        <div class="flex align-center margin-top-24 margin-bottom-16">
          <el-button style="border-radius: 4px;" @click="cancel">取消</el-button>
          <el-button type="primary" style="border-radius: 4px;" @click="ok">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleStyle from '@/components/TitleStyle';
import CreateVolume from '@/views/develop/notebooks/create/CreateVolume';
import MessageDialog from '@/views/data-manager/dataSet/components/MessageDialog';
import { createNotebook, getAllNoteBookNameList, getCreateNotebookConfig, getNamespaceList } from '@/api/notebook';

export default {
  name: 'Index',
  components: {
    TitleStyle,
    CreateVolume,
    MessageDialog,
  },
  data() {
    return {
      //弹框
      showDialog:false,
      dialogContent:'',

      loading: false, // 加载中
      // 创建默认配置
      defaultConfig: null,
      gpuVendorList: [
        {
          name: 'NVIDIA',
          value: 'nvidia.com/gpu'
        },
        {
          name: 'AMD',
          value: 'amd.com/gpu'
        }
      ],
      workspaceNewVolumeTypeList: ['Empty volume', 'Custom (Advanced)'],
      imagePullPolicyList: ['IfNotPresent', 'Never', 'Always'],
      serverTypeList: [
        {
          name: 'jupyterlab',
          img: '@/assets/images/notebook/jupyterlab.png',
          value: 'jupyter'
        },
        {
          name: 'Codeserver',
          img: '@/assets/images/notebook/codeserver.png',
          value: 'group-one'
        },
        {
          name: 'RStudio',
          img: '@/assets/images/notebook/rstudio.png',
          value: 'group-two'
        }
      ],
      gpuNumList: [],
      haveWorkspace: false,
      form: {
        name: '', // 名称
        namespace: '', // 待赋值

        allowCustomImage: true, // 对应 config 接⼝,待赋值
        customImageCheck: false, // 自定义镜像
        serverType: 'jupyter', // ⾃定义镜像
        image: '', // 镜像地址
        customImage: '', // 如果为⾃定义镜像 image 和customImage 保持⼀致，如果不勾选⾃定义镜像，默认为"" y

        imagePullPolicy: '', // 镜像拉取策略 默认值根据config接⼝imagePullPolicy.value字段 取值范围：IfNotPresent，Never，Always ||y
        // CPU/RAM

        cpu: 0,
        cpuLimit: 0, // 暂不清楚
        memory: 0,
        memoryLimit: 0, // 暂不清楚

        gpus: {
          num: 0,
          vendor: null
        },
        workspace: {
          mount: '',
          newPvc: {
            metadata: {
              name: ''
            },
            spec: {
              accessModes: [],
              resources: {
                requests: {
                  storage: ''
                }
              }
            }
          },

          // 自定义
          workspaceVolumeType: 'new',
          displayMore: false,
          leixing: 'Empty volume'
        },

        datavols: [], // 数据卷

        configurations: '', // 配置
        affinityConfig: '', // 关联配置左边
        tolerationGroup: '', // 关联配置右边

        shm: false // 共享内存
      },
      noteBookNameList: []
    };
  },
  computed: {
    // 命名空间，不知道干啥的
    namespace: {
      get() {
        return this.$store.state.modelBase.namespace;
      },
      set(value) {
        this.$store.commit('setNamespace', value);
      }
    }
  },
  created() {
    if (this.namespace === undefined || this.namespace == null) {
      this.$router.back();
    }
    this.form.namespace = this.namespace;
    this.getCreateNotebookConfig();
    // this.getNamespaceList();
  },
  methods: {
    // 监听name的变化
    changeName() {
      if (this.form.workspace) {
        this.form.workspace.newPvc.metadata.name = this.form.name + '-volume';
      }
    },
    // 获取namespace
    getNamespaceList() {
      getNamespaceList().then(res => {
        const namespaceList = res.data[0].namespace;
        getAllNoteBookNameList(namespaceList).then(res => {
          this.noteBookNameList = res.data.names;
        });
      });
    },
    getCreateNotebookConfig() {
      this.loading = true;
      getCreateNotebookConfig().then(res => {
        this.defaultConfig = res.data.config;

        this.form.allowCustomImage = this.defaultConfig.allowCustomImage;
        this.form.image = this.defaultConfig.image.options[0];

        // this.form.cpu = this.defaultConfig.cpu.value;
        this.form.cpu = 0.1;
        // this.form.cpuLimit = this.defaultConfig.cpu.limitFactor;
        this.form.cpuLimit = Number(this.defaultConfig.cpu.max);
        // this.form.memory = this.defaultConfig.memory.value.slice(0, this.defaultConfig.memory.value.length - 2);
        this.form.memory = 0.1;
        // this.form.memoryLimit = this.defaultConfig.memory.limitFactor;
        this.form.memoryLimit = Number(this.defaultConfig.memory.max);

        //gpu限制
        this.gpuNumList = [0]
        for(let i=1;i<=Number(this.defaultConfig.gpus.max);i++) {
          this.gpuNumList.push(i)
        }

        this.form.imagePullPolicy = this.defaultConfig.imagePullPolicy.value;

        this.form.workspace.mount = this.defaultConfig.workspaceVolume.value.mount;
        this.form.workspace.newPvc.metadata.name = this.defaultConfig.workspaceVolume.value.newPvc.metadata.name;
        this.form.workspace.newPvc.spec.accessModes[0] = this.defaultConfig.workspaceVolume.value.newPvc.spec.accessModes[0];
        this.form.workspace.newPvc.spec.resources.requests.storage = this.defaultConfig.workspaceVolume.value.newPvc.spec.resources.requests.storage;
        this.haveWorkspace = true;

        this.form.shm = this.defaultConfig.shm.value;

        this.loading = false;
      });
    },
    goBack() {
      this.$router.back();
    },
    cancel() {
      this.$router.back();
    },
    ok() {
      const params = JSON.parse(JSON.stringify(this.form));
      if (params.name === '') {
        this.$message({
          message: '请填写名称!',
          type: 'warning'
        });
        return;
      }
      if (this.noteBookNameList.find(item => item === params.name)) {
        this.$message({
          message: 'Notebook 名称重复!',
          type: 'warning'
        });
        return;
      }
      if (!(/^[a-z]{1}[a-z0-9-]*[a-z0-9]{1}$/.test(params.name))) {
        this.$message({
          message: '名称必须由小写字母数字字符或“-”组成，以字母字符开头，以字母数字字符结尾。',
          type: 'warning'
        });
        return;
      }
      if (params.image === '') {
        this.$message({
          message: '请填写镜像名称!',
          type: 'warning'
        });
        return;
      }
      let ok = this.changeCpu() && this.changeMemory() && this.changeCpuLimit() && this.changeMemoryLimit()
      if(!ok){
        return;
      }
      // const zhengfudianshu = /^\d+(\.\d+)?$/;
      //
      // if (!(zhengfudianshu.test(params.cpu))) {
      //   this.$message({
      //     message: 'CPU数量为正数',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // if (!(zhengfudianshu.test(params.cpuLimit))) {
      //   this.$message({
      //     message: 'CPU限制数量为正数',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // if (!(zhengfudianshu.test(params.memory))) {
      //   this.$message({
      //     message: '内存数量为正数',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // if (!(zhengfudianshu.test(params.memoryLimit))) {
      //   this.$message({
      //     message: '内存限制数量为正数',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // cpu: '',
      //   cpuLimit: '',//暂不清楚
      //   memory: '',
      //   memoryLimit: '',//暂不清楚
      // if (Number(params.cpu) > Number(params.cpuLimit)) {
      //   this.$message({
      //     message: 'CPU数量小于CPU限制数量',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // if (Number(params.memory) > Number(params.memoryLimit)) {
      //   this.$message({
      //     message: '内存数量小于内存限制数量',
      //     type: 'warning'
      //   });
      //   return;
      // }

      params.memory += 'Gi';
      params.memoryLimit += 'Gi';
      this.loading = true;
      if (params.configurations !== '') {
        params.configurations = [params.configurations];
      } else {
        params.configurations = [];
      }
      if (params.customImageCheck) {
        params.customImage = params.image;
      } else {
        params.customImage = '';
      }

      createNotebook(this.namespace, params).then(res => {
        if (res.code === '000000') {
          this.loading = false;

          this.$message({
            message: '创建成功!',
            type: 'success'
          });
          this.$router.back();
        } else {
          this.loading = false;
          //之前的失败逻辑
          // this.$message({
          //   message: '创建失败!',
          //   type: 'error'
          // });
          //新逻辑
          // let text = ''
          // if(!res.data.gpu.enought){
          //   text += 'GPU剩余'+res.data.gpu.number+'卡数，'
          // }
          // if(!res.data.cpu.enought){
          //   text += 'CPU剩余'+res.data.cpu.number+'核，'
          // }
          // if(!res.data.memory.enought){
          //   text += 'Memory剩余'+res.data.memory.number+'Gi，'
          // }
          // this.dialogContent = '<span>您的账户可用资源不足。 <span class="color-blue">' + text + ' </span>建议暂停部分Notebook服务以释放资源，或者联系管理员申请更多资源，联系方式13201010101。</span>'
          // this.showPauseDialog = true
          if(res.code==='400002' || res.code==='400003'){
            let text = '当前已有资源正在申请占用中，资源不足。建议暂停部分Notebook服务以释放资源，或者联系管理员申请更多资源。'
            this.dialogContent = '<span style="text-align: left;">' + text + '</span>'
            this.showDialog = true
          }
        }
      }).catch(() => {
        this.loading = false;
        this.$message({
          message: '创建失败!',
          type: 'error'
        });
      });
    },
    // 添加工作空间存储卷新卷
    addWorkspaceVolumeNew() {
      this.form.workspace = {};
      this.form.workspace.mount = this.defaultConfig.workspaceVolume.value.mount;
      this.form.workspace.newPvc.metadata.name = this.form.name === '' ? this.defaultConfig.workspaceVolume.value.newPvc.metadata.name : this.form.name + '-volume';
      this.form.workspace.newPvc.spec.accessModes[0] = this.defaultConfig.workspaceVolume.value.newPvc.spec.accessModes[0];
      this.form.workspace.newPvc.spec.resources.requests.storage = this.defaultConfig.workspaceVolume.value.newPvc.spec.resources.requests.storage;
      this.haveWorkspace = true;
      //       this.form.workspace = {
      //
      //         type:'',
      //
      //         shiyongmorenlei:false,
      //         lei:'',
      //         fangwenmoshi:'',
      //
      //         text:'',
      //
      //
      //       }
    },
    // 添加工作空间存储卷已有卷
    addWorkspaceVolumeHad() {
      // this.haveWorkspace = false
    },
    // 添加数据卷新卷
    addDataVolumeNew() {
      this.form.datavols.push({
        workspaceVolumeType: 'new',
        type: '',
        name: '',
        class: '',
        memory: '',
        displayMore: false,
        leixing: 'Empty volume', //
        shiyongmorenlei: false,
        lei: '',
        fangwenmoshi: '',
        zhuangzailujing: '',
        text: ''
      });
    },
    // 添加数据卷已有卷
    addDataVolumeHad() {
      this.form.datavols.push({
        workspaceVolumeType: 'had',
        type: '',
        name: '',
        class: '',
        memory: '',
        displayMore: false,
        leixing: 'Kubernetes Volume', //
        shiyongmorenlei: false,
        lei: '',
        fangwenmoshi: '',
        zhuangzailujing: '',
        text: '',
        zhidu: ''
      });
    },
    // 删除工作空间卷
    deleteWorkspaceVolume() {
      this.haveWorkspace = false;
      this.form.workspace = null;
    },
    // 删除数据卷
    deleteDataVolume(index) {
      this.form.datavols.splice(index, 1);
    },
    // 改变serverType
    changeServerType() {
      // 自定义镜像
      if (this.form.customImageCheck) {
        this.form.image = '';
      } else {
        if (this.form.serverType === 'jupyter') {
          this.form.image = this.defaultConfig.image.options[0];
        } else if (this.form.serverType === 'group-one') {
          this.form.image = this.defaultConfig.imageGroupOne.options[0];
        } else if (this.form.serverType === 'group-two') {
          this.form.image = this.defaultConfig.imageGroupTwo.options[0];
        }
      }
    },
    dialogOk(){
      this.dialogCancel()
    },
    dialogCancel(){
      this.showDialog = false
    },
    isNumber(value){
      return /^\d+(\.\d+)?$/.test(value);
    },
    changeCpu(){
      if(!this.isNumber(this.form.cpu)){
        this.$message({
          message: 'CPU数量为正数',
          type: 'warning'
        });
        return false;
      }
      this.form.cpu = Number(Number(this.form.cpu).toFixed(1))
      if(this.form.cpu<0.1){
        this.$message({
          type:'warning',
          message:'CPU数量大于等于0.1'
        })
        return false;
      }
      if(this.form.cpu > Number(this.form.cpuLimit)){
        this.$message({
          type:'warning',
          message:'CPU数量小于CPU限制数量',
        })
        return false;
      }
      return true;
    },
    changeMemory(){
      if(!this.isNumber(this.form.memory)){
        this.$message({
          message: 'Memory数量为正数',
          type: 'warning'
        });
        return false;
      }
      this.form.memory = Number(Number(this.form.memory).toFixed(1))
      if(this.form.memory<0.1){
        this.$message({
          type:'warning',
          message:'Memory数量大于等于0.1'
        })
        return false;
      }
      if(this.form.memory > Number(this.form.memoryLimit)){
        this.$message({
          type:'warning',
          message:'Memory数量小于Memory限制数量',
        })
        return false;
      }
      return true;
    },
    changeCpuLimit(){
      if(!this.isNumber(this.form.cpuLimit)){
        this.$message({
          message: 'CPU限制数量为正数',
          type: 'warning'
        });
        return false;
      }
      this.form.cpuLimit = Number(Number(this.form.cpuLimit).toFixed(1))
      if(this.form.cpuLimit<Number(this.form.cpu)){
        this.$message({
          type:'warning',
          message:'CPU限制数量大于等于CPU数量'
        })
        return false;
      }
      if(this.form.cpuLimit > Number(this.defaultConfig.cpu.max)){
        this.$message({
          type:'warning',
          message:'CPU限制数量小于最大可用CPU限制数量'+this.defaultConfig.cpu.max,
        })
        return false;
      }
      return true;
    },
    changeMemoryLimit(){
      if(!this.isNumber(this.form.memoryLimit)){
        this.$message({
          message: 'Memory限制数量为正数',
          type: 'warning'
        });
        return false;
      }
      this.form.memoryLimit = Number(Number(this.form.memoryLimit).toFixed(1))
      if(this.form.memoryLimit<Number(this.form.memory)){
        this.$message({
          type:'warning',
          message:'Memory限制数量大于等于Memory数量'
        })
        return false;
      }
      if(this.form.memoryLimit > Number(this.defaultConfig.memory.max)){
        this.$message({
          type:'warning',
          message:'Memory限制数量小于最大可用Memory限制数量'+this.defaultConfig.memory.max,
        })
        return false;
      }
      return true;
    },
  }
};
</script>

<style lang="scss" scoped>
.my-create-notebook {
  ::v-deep{
    .el-tabs__content {
      display: none;
    }

    .el-tabs__item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-input-number--medium {
      width: 100%;
    }
    .el-input-number--medium .el-input__inner{
      padding-left: 15px;
      padding-right: 15px;
      text-align: left;
    }
  }

}


</style>
