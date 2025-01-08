<template>
  <div :id="id" />
</template>

<script>
// deps for editor
// import 'codemirror/lib/codemirror.css' // codemirror
// import 'tui-editor/dist/tui-editor.css' // editor ui
// import 'tui-editor/dist/tui-editor-contents.css' // editor content
// import Editor from 'tui-editor'
// import defaultOptions from './default-options'
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
// import Editor, {toastui} from '@toast-ui/editor'
import defaultOptions from './default-options';
import { Editor } from '@toast-ui/editor';
import '@toast-ui/editor/dist/i18n/zh-cn.js';
import { uploadImage } from '@/api/model';
export default {
  name: 'MarkdownEditor',
  props: {
    isEdit: {
      type: Boolean,
      required: false,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default() {
        return 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
      }
    },
    options: {
      type: Object,
      default() {
        return defaultOptions;
      }
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      required: false,
      default: '500px'
    },
    language: {
      type: String,
      required: false,
      default: 'zh-CN' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    }
  },
  data() {
    return {
      editor: null
    };
  },
  computed: {
    editorOptions() {
      const _this = this;
      let options = {};
      if (this.isEdit) { // 编辑器
        options = Object.assign({}, this.options);
        options = {
          hooks: {
            addImageBlobHook(file, callback) {
              _this.fileUpload(file, callback);
            //   // _this.hidePopup();
            }

          }
        };

        options.initialEditType = this.mode;
        options.height = this.height;
        options.language = this.language;
        options.autofocus = false;
      } else { // 预览器
        options = {};
      }
      return options;
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.editor.getMarkdown()) {
        this.editor.setMarkdown(newValue);
      }
    },
    language() {
      this.destroyEditor();
      this.initEditor();
    },
    height(newValue) {
      this.editor.height(newValue);
    },
    mode(newValue) {
      this.editor.changeMode(newValue);
    }
  },
  mounted() {
    this.initEditor();
  },
  beforeDestroyed() {
    this.destroyEditor();
  },
  methods: {
    initEditor() {
      const obj = Object.assign({}, { el: document.getElementById(this.id) }, this.editorOptions);
      if (this.isEdit) { // 编辑器
        this.editor = new Editor(obj);
      }

      if (this.value) {
        this.editor.setMarkdown(this.value);
      }
      this.editor.on('change', () => {
        this.$emit('input', this.editor.getMarkdown());
      });
    },
    destroyEditor() {
      if (!this.editor) return;
      this.editor.off('change');
      this.editor.remove();
    },
    setMarkdown(value) {
      this.editor.setMarkdown(value);
    },
    getMarkdown() {
      return this.editor.getMarkdown();
    },
    setHtml(value) {
      this.editor.setHtml(value);
    },
    getHtml() {
      return this.editor.getHtml();
    },
    fileUpload(file, callback) {
      const form = new FormData();
      form.append('file', file);
      form.append('type', 1);
      uploadImage(form).then(res => {
        if (res.code === '000000') {
          const data = res.data[0];
          if (data) {
            callback(data.url);
          }
        } else {
          callback('');
        }
      });
    }
  }
};
</script>
