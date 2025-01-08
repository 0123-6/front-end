import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less'

import './style/ant-design/ant-form.css'
import './style/ant-design/ant-select.css'
import './style/ant-design/ant-input.css'
import './style/ant-design/ant-modal.css'
import './style/ant-design/ant-other.css'
import './style/ant-design/ant-pagination.css'
import './style/ant-design/ant-popover.css'
import './style/ant-design/ant-segmented.css'
import './style/ant-design/ant-table.css'
import './style/ant-design/ant-tooltip.css'
import './style/ant-design/ant-tree.css'
import './style/ant-design/ant-cascader.css'
import './style/ant-design/ant-menu.css'
import './style/ant-design/ant-picker.css'
import './style/ant-design/ant-switch.css'

import './style/prelight.css'
import './style/output.css';
import './style/notebook.css';
import './style/markdown.css';
import './style/image-cropper.css';
import './style/oam/jsoneditor-react.css'
import zhCN from 'antd/es/locale/zh_CN';
import '@toast-ui/editor/dist/toastui-editor.css';

import App from './App';
import {BrowserRouter} from "react-router-dom";
import { ConfigProvider } from 'antd';

const root = document.getElementById('root') as HTMLElement;

// <React.StrictMode>
ReactDOM.render(
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>,root
);
