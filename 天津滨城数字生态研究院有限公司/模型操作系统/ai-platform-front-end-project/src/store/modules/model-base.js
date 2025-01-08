/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-05 22:28:20
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 09:41:27
 * @FilePath: \ai-platform-front-end-project\src\store\modules\model-base.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const model = {
  state: {
    preview: {
      id: '', // 修改模型时用，表示我的模型的id(与模型文件id不一样，为2个不同的属性)
      modelFileId: '', // 模型文件id
      modelFileName: '', // 模型文件名称
      modelFileType: '', // 模型文件格式
      modelNameCh: '', // 模型中文名称
      modelNameEn: '', // 模型英文名称
      coverUrl: '', // 模型封面url
      cover: '', // 模型封面id
      modelScenesId: '', // 模型场景id
      scenesName: '', // 场景名称
      modelTypeId: '', // 模型类型id
      modelTypeName: '', // 类型名称
      modelVersionId: '', // 模型版本id
      versionName: '', // 模型版本
      modelShortDescribe: '', // 模型简介
      modelDescribe: '', // 模型描述
      createTime: '',
      labelMapping: []// 标签映射
    },
    modelExperienceIndex: 0,
    namespace: ''
  },

  mutations: {
    setNamespace(state, value) {
      state.namespace = value;
    },
    setModelExperienceIndex(state, value) {
      state.modelExperienceIndex = value;
    },
    SET_PREVIEW_INFO: (state, modelInfo) => {
      state.preview = JSON.parse(JSON.stringify(modelInfo));
    },
    SET_PREVIRE_CLEAR: (state) => {
      state.preview.id = '';
      state.preview.modelFileId = '';
      state.preview.modelFileName = '';
      state.preview.modelFileType = '';
      state.preview.modelNameCh = '';
      state.preview.modelNameEn = '';
      state.preview.coverUrl = '';
      state.preview.cover = '';
      state.preview.modelScenesId = '';
      state.preview.scenesName = '';
      state.preview.modelTypeId = '';
      state.preview.modelTypeName = '';
      state.preview.modelVersionId = '';
      state.preview.versionName = '';
      state.preview.modelShortDescribe = '';
      state.preview.modelDescribe = '';
      state.preview.createTime = '';
      state.preview.labelMapping = [];
    }
  }
};

export default model;
