<template>
  <!--最外层-->
  <div class="question-tmpl tw-w-full tw-min-h-full tw-flex tw-flex-col tw-bg-[#F2F3F5] tw-pl-[24px] tw-pr-[24px]">
    <!--面包屑-->
    <bread-crumbs :list="breadCrumbsList" class="tw-mt-[12px]"/>
    <!--白色区域-->
    <div class="tw-mt-[6px] tw-pb-[23px] tw-mb-[23px] tw-bg-white tw-rounded tw-flex-1 tw-pl-[23px] tw-pr-[23px] tw-flex tw-flex-col">
      <span class="tw-mt-[16px] tw-font-medium tw-text-[#000000] tw-text-base tw-leading-[22px]">问题模版</span>
      <!--列表-->
      <div class="tw-mt-[29px] tw-pl-[22px] tw-pr-[22px] tw-grid tw-grid-cols-2 tw-gap-x-[25px] tw-gap-y-[24px]" v-loading="loading">
        <div v-for="(itemParent, indexParent) in list"
             :key="indexParent"
             class="tw-w-full tw-h-[371px] tw-pl-[1.67vw] tw-flex tw-flex-col tw-rounded-2xl"
             style="background: linear-gradient(171deg, rgba(162,182,255,0.07) 0%, rgba(255,255,255,0) 100%);box-shadow: 0px 2px 8px 0px #FFFFFF;">
          <!--第一行-->
          <div class="tw-mt-[17px] tw-pr-[16px] tw-flex tw-justify-between tw-items-center">
            <span class="tw-font-medium tw-text-base tw-text-[#262626]">{{itemParent?.template_desc}}</span>
            <el-tooltip popper-class="question-tmpl" content="新建" placement="top">
              <div style="width: 18px;height: 20px;"
                   class="tw-cursor-pointer tw-text-[#8C96A1] hover:tw-text-main"
                   @click="clickAdd(indexParent)">
                <add-svg/>
              </div>
            </el-tooltip>
          </div>
          <!--分割线-->
          <div class="tw-mt-[10px] tw-h-[1px] tw-bg-[#eceffa]"
               style="width: calc(100%);"/>
          <div class="tw-flex-shrink-0 tw-h-[6px]"/>
          <!--列表-->
          <div class="tw-flex-1 tw-overflow-x-hidden tw-overflow-y-auto tw-flex tw-flex-col"
               :ref="'list' + indexParent">
            <div class="tw-w-full tw-flex tw-flex-col tw-flex-shrink-0 tw-pr-[16px]"
                 style=""
                 v-for="(item, index) in itemParent?.list"
                 :key="index">
              <!--正常-->
              <div v-if="!(indexParent === editObject.indexParent && index === editObject.index)"
                   class="tw-flex-shrink-0 tw-h-[50px] tw-flex tw-justify-between tw-items-center">
                <!--左，文字-->
                <el-tooltip v-if="item?.question?.length > 13" popper-class="question-tmpl-text" :content="item?.question?.length > 13 ? item?.question : null" placement="top" :key="item?.question">
                  <span class="hpj-text-hidden tw-mr-[10px] tw-text-sm tw-text-[#1A262C]">{{item?.question}}</span>
                </el-tooltip>
                <span v-if="!(item?.question?.length > 13)" class="hpj-text-hidden tw-mr-[10px] tw-text-sm tw-text-[#1A262C]">{{item?.question}}</span>
                <!--右-->
                <div class="tw-flex-shrink-0 tw-flex tw-items-center">
                  <!--是否启用-->
                  <div class="tw-flex-shrink-0 tw-w-[110px] tw-flex tw-items-center">
                    <el-switch
                      v-model="item.status"
                      @change="clickSwitch(indexParent, index)"
                      active-color="#356DF6"
                      inactive-color="#e6e7ea">
                    </el-switch>
                    <span class="tw-ml-[5px] tw-text-[#646464] tw-text-[15px] tw-leading-[15px]">{{item.status === true ? '启用' : '禁用'}}</span>
                  </div>
                  <!--操作列-->
                  <div class="tw-flex-shrink-0 tw-flex tw-items-center">
                    <!--编辑按钮-->
                    <el-button type="text" size="mini" :disabled="item.status" @click="clickEdit(indexParent, index)">编辑</el-button>
                    <!--复制按钮-->
                    <el-button type="text" size="mini" @click="clickCopy(item.question)">复制</el-button>
                    <!--删除按钮-->
                    <el-button type="text" size="mini" :disabled="item.status" @click="clickDelete(indexParent, index)">删除</el-button>
                  </div>
                </div>
              </div>
              <!--编辑状态-->
              <div v-if="(indexParent === editObject.indexParent && index === editObject.index)"
                   class="tw-w-full tw-flex-shrink-0 tw-h-[50px] tw-mt-[8px] tw-mb-[8px] tw-bg-white tw-rounded tw-flex tw-items-center tw-z-20"
                   style="box-shadow: 0px 0px 5px 0px rgba(198,198,198,0.41);">
                <!--左侧蓝条-->
                <div class="tw-w-[7px] tw-h-full tw-bg-[#0147EB]"
                     style="box-shadow: 0px 0px 2px 0px rgba(198,198,198,0.5);border-radius: 4px 0px 0px 4px;"/>
                <!--输入框-->
                <input autocomplete="off"
                       autofocus
                       class="tw-ml-[8px] tw-flex-1"
                       style="font-size: 14px;line-height: 14px;height: 32px;border: 1px solid rgba(37,84,255,1);border-radius: 4px;color: #262626!important;"
                       @click="(e)=>e.stopPropagation()"
                       @keydown="historyEditOnKeyDown($event)"
                       ref="historyEditInputRef">
                <!--确定按钮-->
                <el-tooltip popper-class="question-tmpl" content="保存" placement="top">
                  <div class="tw-ml-[4px] tw-w-[28px] tw-h-[28px] tw-rounded tw-flex tw-justify-center tw-items-center tw-text-[#646464] hover:tw-bg-[#F7F7F7] hover:tw-text-main tw-cursor-pointer"
                       @click="historyEditOnOk($event)">
                    <img src="../icon/SuccessSvg.svg" alt="">
                  </div>
                </el-tooltip>
                <!--取消按钮-->
                <el-tooltip popper-class="question-tmpl" content="取消" placement="top">
                  <div class="tw-mr-[4px] tw-w-[28px] tw-h-[28px] tw-rounded tw-flex tw-justify-center tw-items-center tw-text-[#646464] hover:tw-bg-[#F7F7F7] hover:tw-text-main tw-cursor-pointer"
                       @click="historyEditOnCancel($event)">
                    <close-svg/>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="tw-flex-shrink-0 tw-h-[6px]"/>
        </div>
      </div>
    </div>
    <!--弹框-->
    <dialog-prompt v-if="showDeleteModal"
                   @on-ok="deleteModalOnOk"
                   @on-cancel="deleteModalOnCancel">
      <template slot="content">
        <span class="tw-mt-[44px] tw-text-base tw-text-[#262626] tw-flex tw-items-center">确定删除<span class="tw-max-w-[180px] tw-text-[#356DF6] tw-pl-[4px] tw-pr-[4px] hpj-text-hidden">{{list[deleteObject.indexParent].list[deleteObject.index].question}}</span>问题模板吗？</span>
      </template>
    </dialog-prompt>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import copy from 'copy-to-clipboard';
import { del, get, post } from '@/utils/request';
import CloseSvg from '@/views/question/icon/CloseSvg';
import DialogPrompt from '@/components/DialogPrompt';
import AddSvg from '@/views/question/icon/AddSvg';
import BreadCrumbs from '@/components/BreadCrumbs';

export default {
  name: 'QuestionTmpl',
  components: {
    AddSvg,
    CloseSvg,
    DialogPrompt,
    BreadCrumbs,
  },
  data() {
    return {
      // 面包屑
      breadCrumbsList: [
        {
          name: '问答管理',
        },
        {
          name: '问题模版',
        },
      ],
      // 列表
      list: [],
      // 加载中
      loading: false,
      // 编辑相关的属性
      editObject: {
        indexParent: -1,
        index: -1,
      },
      // 删除相关
      showDeleteModal: false,
      deleteObject: {
        indexParent: -1,
        index: -1,
      },
    };
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  methods: {
    // 初始化函数
    init() {
      this.loading = false;
      this.showDeleteModal = false;
      this.editObject.indexParent = -1;
      this.editObject.index = -1;
      this.deleteObject.indexParent = -1;
      this.deleteObject.index = -1;
      // 将list初始化，清除掉手动添加的数据
      const newList = JSON.parse(JSON.stringify(this.list));
      for (let i = 0; i < newList.length; i += 1) {
        newList[i].list = newList[i].list.filter((item) => item.id !== null);
      }
      this.list = newList;
    },
    // 获取数据
    async getData() {
      this.init();
      this.loading = true;
      const { data } = await get('/oam/question/template');
      // data为数组，将每一项的list的status转为boolean，1为true，2为false
      for (let i = 0; i < data.length; i += 1) {
        for (let j = 0; j < data[i].list.length; j += 1) {
          data[i].list[j].status = data[i].list[j].status === 1;
        }
      }
      this.list = JSON.parse(JSON.stringify(data));
      this.loading = false;
    },
    // 点击编辑按钮
    async clickEdit(indexParent, index) {
      this.init();
      this.editObject.indexParent = indexParent;
      this.editObject.index = index;
      // 等待dom更新完成后，再聚焦
      this.$nextTick(() => {
        // 设置输入框的值
        this.$refs.historyEditInputRef[0].value = this.list[indexParent].list[index].question;
        this.$refs.historyEditInputRef[0].focus();
      });
    },
    // 点击复制按钮
    clickCopy(text) {
      copy(text);
      this.$message({
        message: '复制成功',
        type: 'success',
      });
    },
    // 点击删除按钮
    clickDelete(indexParent, index) {
      this.init();
      this.deleteObject.indexParent = indexParent;
      this.deleteObject.index = index;
      this.showDeleteModal = true;
    },
    // 历史记录编辑保存
    historyEditOnKeyDown(e) {
      if (e.keyCode === 13) {
        this.historyEditOnOk(e);
      }
    },
    async historyEditOnOk(e) {
      e.stopPropagation();
      e.preventDefault();
      // 问题不能为空
      if (!this.$refs.historyEditInputRef[0].value) {
        this.$message({
          message: '问题不能为空',
          type: 'warning',
        });
        return;
      }
      const params = {
        id: this.list[this.editObject.indexParent].list[this.editObject.index].id,
        type: this.list[this.editObject.indexParent].list[this.editObject.index].type,
        status: this.list[this.editObject.indexParent].list[this.editObject.index].status ? 1 : 2,
        question: this.$refs.historyEditInputRef[0].value,
      };
      const { data } = await post('/oam/question/template', params);
      this.list[this.editObject.indexParent].list[this.editObject.index] = {
        ...this.list[this.editObject.indexParent].list[this.editObject.index],
        id: data?.id,
        question: this.$refs.historyEditInputRef[0].value,
      };
      this.init();
    },
    historyEditOnCancel(e) {
      e.stopPropagation();
      e.preventDefault();
      this.init();
    },
    // 点击开关，切换状态
    clickSwitch(indexParent, index) {
      const params = {
        id: this.list[indexParent].list[index].id,
        type: this.list[indexParent].list[index].type,
        status: this.list[indexParent].list[index].status ? 1 : 2,
        question: this.list[indexParent].list[index].question,
      };
      post('/oam/question/template', params);
      this.init();
    },
    // 新建问题模板
    clickAdd(indexParent) {
      this.init();
      // 为list为indexParent的数组添加一项
      this.list[indexParent].list.push({
        id: null,
        type: this.list[indexParent].type,
        status: true,
        question: '',
      });
      this.editObject.indexParent = indexParent;
      this.editObject.index = this.list[indexParent].list.length - 1;
      // 等待dom更新完成后，再聚焦
      this.$nextTick(() => {
        // 设置输入框的值
        this.$refs.historyEditInputRef[0].value = '';
        this.$refs.historyEditInputRef[0].focus();
      });
    },
    // 确定删除
    async deleteModalOnOk() {
      const params = {
        question_template_id: this.list[this.deleteObject.indexParent].list[this.deleteObject.index].id,
      };
      await del(`/oam/question/template/${params.question_template_id}`);
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      // 删除成功后，重新获取数据
      this.getData();
    },
    // 取消删除
    deleteModalOnCancel() {
      this.init();
    },
  },
};
</script>

<style scoped lang="less">
.question-tmpl {
  box-sizing: border-box;
  line-height: 1;
  * {
    box-sizing: border-box;
  }
  input {
    outline: none;
  }
}
::v-deep {
  .question-tmpl {
  }
}
</style>

<style>
.question-tmpl.el-tooltip__popper.is-dark {
  background-color: rgba(43, 42, 42, 0.7);
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  border-radius: 8px;
}
.question-tmpl.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #6a6969;
}
.question-tmpl.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: #6a6969;
}
.question-tmpl-text.el-tooltip__popper.is-dark {
  background-color: rgba(43, 42, 42, 0.7);
  padding: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 25px;
  border-radius: 8px;
}
.question-tmpl-text.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #6a6969;
}
.question-tmpl-text.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: #6a6969;
}
</style>
