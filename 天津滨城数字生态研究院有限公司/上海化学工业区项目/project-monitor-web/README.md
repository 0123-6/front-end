
# 建设项目全周期监测应用

## 技术栈

* [Vue3](https://v3.cn.vuejs.org)
* [Element Plus](https://element-plus.org/zh-CN)
* [Vite](https://cn.vitejs.dev) 

## js api文件一键生成

1. 在项目根目录下新建文件夹 .vscode/generate/${后端微服务名称}/api
2. 运行npm scripts，如：项目管理api，自动在上述目录下生成js api文件

```javascript
// swagger doc数据地址
let docUrl = 'http://124.71.139.106/pm/v2/api-docs'
// 后端微服务名称
let context = 'pm'
```

## 全局字典
```javascript
import useDictStore from '@/store/modules/dict'
// 单个
useDictStore().getDict('project_status')
// 多个
useDictStore().getDicts(['project_status','project_type'])
```