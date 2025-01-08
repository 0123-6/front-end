<template>
  <!--内容区-->
  <div class="flex flex-direction bgc-white box-shadow-1" style="width: 100%;">
    <!--新卷-->
    <div v-if="myForm.workspaceVolumeType==='new'" class="flex flex-direction" style="width: 100%;">
      <!--最上面-->
      <div class="flex justify-between align-center margin-top-8" style="width: 100%;height: 40px;">
        <!--左-->
        <div class="flex align-center margin-left-8">
          <div>
            New volume
          </div>
          <div class="margin-left-16">
            {{ myForm.newPvc.metadata.name }} {{ myForm.newPvc.spec.resources.requests.storage }}
          </div>
        </div>
        <!--右-->
        <div class="flex align-center margin-right-8">
          <div class="hand" @click="deleteWorkspaceVolume">
            <img src="@/assets/images/notebook/delete-bin-line-light.svg" alt="" width="20" height="20">
          </div>
          <div v-if="myForm.displayMore" class="flex margin-left-16">
            <i class="el-icon-arrow-up hand" @click="changeDisplayMore" />
          </div>
          <div v-if="!myForm.displayMore" class="flex margin-left-16">
            <i class="el-icon-arrow-down hand" @click="changeDisplayMore" />
          </div>
        </div>
      </div>
      <!--下面-->
      <div v-show="myForm.displayMore" class="flex flex-direction margin-top-8" style="width: 100%;max-width: 416px;">
        <el-form :model="myForm" label-width="100px" label-suffix=":">
          <el-form-item label="类型">
            <el-select v-model="myForm.leixing" placeholder="请选择活动区域" style="width: 100%;">
              <el-option label="Empty volume" value="Empty volume" />
              <el-option disabled label="Custom (Advanced)" value="Custom (Advanced)" />
            </el-select>
          </el-form-item>
          <!--type==Empty volume-->
          <el-form-item v-if="myForm.leixing==='Empty volume'" label="名称">
            <el-input v-model="myForm.newPvc.metadata.name" />
          </el-form-item>
          <el-form-item v-if="myForm.leixing==='Empty volume'" label="Gi 大小">
            <el-input v-model="myForm.newPvc.spec.resources.requests.storage" />
          </el-form-item>
          <div v-if="false && myForm.leixing==='Empty volume'" class="flex flex-direction margin-left-8">
            <div>
              存储类
            </div>
            <div class="flex align-center margin-top-8">
              <el-checkbox v-model="myForm.shiyongmorenlei">备选项</el-checkbox>
            </div>
          </div>
          <el-form-item v-if="false && myForm.leixing==='Empty volume'" label="类" class="margin-top-8">
            <el-select v-model="myForm.lei" :disabled="myForm.shiyongmorenlei" style="width: 100%;">
              <el-option v-for="(item,index) in ['123','456']" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <div v-if="myForm.leixing==='Empty volume'" class="flex flex-direction margin-left-8">
            <div>访问模式</div>
            <el-radio v-for="(item,index) in fangwenmoshiList" :key="index" v-model="myForm.newPvc.spec.accessModes[0]" class="margin-top-8" :label="item" />
          </div>
          <!--type==Custom (Advanced)-->
          <div v-if="myForm.leixing==='Custom (Advanced)'" class="flex flex-direction margin-left-8">
            <div>
              Check the K8s docs for the supported volumes and their specs
            </div>
            <div class="margin-top-8">
              <el-input
                v-model="myForm.text"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </div>
          </div>
          <!--路径-->
          <el-form-item label="装载路径" class="margin-top-8">
            <el-input v-model="myForm.mount" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--已有卷-->
    <div v-if="myForm.workspaceVolumeType==='had'" class="flex flex-direction" style="width: 100%;">
      <!--最上面-->
      <div class="flex justify-between align-center margin-top-8" style="width: 100%;height: 40px;">
        <!--左-->
        <div class="flex align-center margin-left-8">
          <div>
            已有卷
          </div>
          <div>
            {{ myForm.name }} {{ myForm.class }} {{ myForm.memory }}
          </div>
        </div>
        <!--右-->
        <div class="flex align-center margin-right-8">
          <div class="hand" @click="deleteWorkspaceVolume">
            <img src="@/assets/images/notebook/delete-bin-line-light.svg" alt="" width="20" height="20">
          </div>
          <div class="flex margin-left-16">
            <i v-show="myForm.displayMore" class="el-icon-arrow-up hand" @click="myForm.displayMore = false" />
            <i v-show="!myForm.displayMore" class="el-icon-arrow-down hand" @click="myForm.displayMore = true" />
          </div>
        </div>
      </div>
      <!--下面-->
      <div v-show="myForm.displayMore" class="flex flex-direction margin-top-8 margin-left-8" style="width: 100%;max-width: 416px;">
        <el-form :model="myForm" label-width="100px" label-suffix=":">
          <el-form-item label="类型">
            <el-select v-model="myForm.leixing" placeholder="请选择活动区域" style="width: 100%;">
              <el-option label="Kubernetes Volume" value="Kubernetes Volume" />
              <el-option label="Custom (Advanced)" value="Custom (Advanced)" />
            </el-select>
          </el-form-item>
          <!--type==Kubernetes Volume-->
          <div v-if="myForm.leixing==='Kubernetes Volume'" class="flex align-center">
            <el-checkbox v-model="myForm.zhidu">只读</el-checkbox>
          </div>
          <el-form-item v-if="myForm.leixing==='Kubernetes Volume'" label="名称">
            <el-input v-model="myForm.name" />
          </el-form-item>
          <!--type==Custom (Advanced)-->
          <div v-if="myForm.leixing==='Custom (Advanced)'" class="flex flex-direction">
            <div>
              Check the K8s docs for the supported volumes and their specs
            </div>
            <div>
              <el-input
                v-model="myForm.text"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </div>
          </div>
          <!--路径-->
          <el-form-item label="装载路径" class="margin-top-8">
            <el-input v-model="myForm.zhuangzailujing" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fangwenmoshiList: ['ReadWriteOnce', 'ReadOnlyMany', 'ReadWriteMany']
    };
  },
  computed: {
    myForm: {
      get() {
        return this.form;
      },
      set(newValue) {
        this.$emit('update:form', newValue);
      }
    }
  },
  methods: {
    deleteWorkspaceVolume() {
      this.$emit('delete');
    },
    changeDisplayMore() {
      this.myForm.displayMore = !this.myForm.displayMore;
    }
  }

};
</script>

<style lang="scss" scoped>
::v-deep{
  .el-form {
    label {
      font-weight: 400;
    }
  }
}
</style>
