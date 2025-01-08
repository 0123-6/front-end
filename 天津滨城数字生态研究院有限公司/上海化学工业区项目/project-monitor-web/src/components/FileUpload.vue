<template>
  <div class="upload-file">
    <template v-if="!readonly">
      <el-upload
        multiple
        :before-upload="handleBeforeUpload"
        :action="uploadImgUrl"
        :headers="headers"
        :file-list="fileList"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :show-file-list="false"
        :auto-upload="true"
        class="upload-file-uploader"
        ref="fileUpload">
        <!-- 上传按钮 -->
        <el-button icon="Upload">上传附件</el-button>
      </el-upload>
      <!-- 上传提示 -->
      <div class="el-upload__tip" v-if="showTip">
        请上传
        <template v-if="fileSize">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </template>
        <template v-if="fileType && fileType.length > 0">
          格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
        </template>
        的文件
      </div>
    </template>
    <!-- 文件列表 -->
    <ul class="upload-file-list el-upload-list el-upload-list--text d-flex ai-center">
      <template v-for="(file, index) in fileList">
        <li v-if="file.type == 'image'" class="upload-file__img">
          <image-preview :key="'img' + file.uid" :src="`${file.url}`" :width="80" :height="80" :src-list="imageList" />
          <el-icon v-if="!readonly" :size="18" color="#F56C6C" @click="handleDelete(index)">
            <Delete />
          </el-icon>
        </li>
        <li v-else class="el-upload-list__item ele-upload-list__item-content">
          <el-link v-if="file.type == 'video'" class="flex-1 file-name" :underline="false" @click="handleVideo(file.url)">
            <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
          </el-link>
          <el-link v-else class="flex-1 file-name" :href="`${file.url}`" :underline="false" target="_blank">
            <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
          </el-link>
          <el-icon v-if="!readonly" class="ml10" :size="18" color="#F56C6C" @click="handleDelete(index)">
            <Delete />
          </el-icon>
        </li>
      </template>
    </ul>
    <el-dialog v-model="open" :title="videoTitle" width="1000px" append-to-body @closed="videoUrl = ''">
      <video width="960" height="540" controls style="background: #000">
        <source :src="videoUrl" type="video/mp4" />
        您的浏览器不支持Video标签。
      </video>
    </el-dialog>
  </div>
</template>

<script setup>
import ImagePreview from '@/components/ImagePreview';
import { isHttp } from '@/utils/validate';
import { getFileType } from '@/utils/index';
import { getToken } from '@/utils/auth';

const props = defineProps({
  modelValue: [String, Object, Array],
  // 数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 50
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ['png', 'jpg', 'jpeg', 'mp4', 'doc', 'docx']
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const { proxy } = getCurrentInstance();
const emit = defineEmits();
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + '/ops/fileManager/saveMinIOFile'); // 上传的图片服务器地址
const headers = ref({ Authorization: getToken() });
const number = ref(0);
const uploadList = ref([]);
const fileList = ref([]);
const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize));
const imageList = ref([]);
const open = ref(false);
const videoUrl = ref('');
const videoTitle = ref('');

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      let temp = 1;
      // 首先将值转为数组
      const list = Array.isArray(val) ? val : props.modelValue.split(',');
      // 然后将数组转为对象数组
      const flist = list.map((item) => {
        if (typeof item === 'string') {
          if (isHttp(item)) {
            item = { name: item, url: item, type: getFileType(item) };
          } else {
            item = { name: baseUrl + item, url: baseUrl + item, type: getFileType(item) };
          }
        }
        item.uid = item.uid || new Date().getTime() + temp++;
        return item;
      });
      imageList.value = flist
        .filter((n) => n.type == 'image')
        .map((n) => {
          return !isHttp(n.url) ? baseUrl + n.url : n.url;
        });
      fileList.value = flist.filter((n) => n.type == 'image').concat(flist.filter((n) => n.type != 'image'));
    } else {
      fileList.value = [];
      return [];
    }
  },
  { deep: true, immediate: true }
);

function handleVideo(url) {
  open.value = true;
  videoUrl.value = url;
  videoTitle.value = getFileName(url);
}

// 上传前校检格式和大小
function handleBeforeUpload(file) {
  // 校检文件类型
  if (props.fileType.length) {
    const fileName = file.name.split('.');
    const fileExt = fileName[fileName.length - 1].toLowerCase();
    const isTypeOk = props.fileType.indexOf(fileExt) >= 0;
    if (!isTypeOk) {
      proxy.$modal.msgError(`文件格式不正确, 请上传${props.fileType.join('/')}格式文件!`);
      return false;
    }
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading('正在上传文件，请稍候...');
  number.value++;
  return true;
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
}

// 上传失败
function handleUploadError(err) {
  proxy.$modal.msgError('上传文件失败');
  proxy.$modal.closeLoading();
  number.value--;
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  if (res.status === 200) {
    let url = res.data.fileUrl || location.origin + res.data;
    uploadList.value.push({ name: url, url });
    uploadedSuccessfully();
  } else {
    number.value--;
    proxy.$modal.closeLoading();
    proxy.$modal.msgError(res.info);
    proxy.$refs.fileUpload.handleRemove(file);
    uploadedSuccessfully();
  }
}

// 删除文件
function handleDelete(index) {
  fileList.value.splice(index, 1);
  emit('update:modelValue', listToString(fileList.value));
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter((f) => f.url !== undefined).concat(uploadList.value);
    uploadList.value = [];
    number.value = 0;
    emit('update:modelValue', listToString(fileList.value));
    proxy.$modal.closeLoading();
  }
}

// 获取文件名称
function getFileName(name) {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1);
  } else {
    return name;
  }
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = '';
  separator = separator || ',';
  for (let i in list) {
    if (list[i].url) {
      strs += list[i].url + separator;
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : '';
}
</script>

<style scoped lang="scss">
.upload-file {
  &__img {
    display: flex;
    margin: 0 10px 10px 0;
    position: relative;

    .el-icon {
      cursor: pointer;
    }
  }

  .upload-file-list {
    flex-wrap: wrap;
  }
}

.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  padding: 5px 10px;
  margin: 0 10px 10px 0;
  position: relative;
  border: 1px solid #e4e7ed;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
  line-height: 20px;
  width: auto;

  .el-link {
    justify-content: flex-start;
  }

  .el-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
}

.el-upload__tip {
  line-height: 20px;
}
</style>
