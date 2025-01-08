<template>
  <div class="wrapper">
    <ai-header />
    <el-container>
      <el-aside width="250px" style="background: white;border-right: 1px solid #ebeaea">
        <div class="aside-title">模型API调用方法说明</div>
        <div ref="tab" class="tab">
          <el-menu
            class="el-menu-vertical-demo"
            :default-active="active"
            @open="handleOpen"
            @close="handleClose"
          >
            <div v-for="(item1, key1) of menuData">
              <el-submenu v-if="item1.children" :key="key1" :index="item1.index">
                <template
                  slot="title"
                  @click="switchTab(item1.index)"
                >
                  <div style="font-weight: 600">{{ item1.name }}</div>
                </template>
                <div v-for="(item2, key2) of item1.children">
                  <el-submenu v-if="item2.children" :key="key2" :index="item2.index">
                    <template slot="title" @click="switchTab(item2.index)">{{ item2.name }}</template>
                    <el-menu-item
                      v-for="(item3, key3) of item2.children"
                      :key="key3"
                      :index="item3.index"
                      @click="switchTab(item3.index)"
                    >{{ item3.name }}</el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :index="item2.index"
                    @click="switchTab(item2.index)"
                  >{{ item2.name }}</el-menu-item>
                </div>
              </el-submenu>
              <el-menu-item
                v-else
                :index="item1.index"
                style="font-weight: 600"
                @click="switchTab(item1.index)"
              >{{ item1.name }}</el-menu-item>
            </div>
          </el-menu>
        </div>
      </el-aside>
      <div ref="cont" class="content" style="height: 100%; overflow: scroll; padding: 16px 42px" @mousewheel="contentScroll">
        <div class="flex justify-end">
          <el-button class="return-btn" icon="el-icon-caret-left" style="margin-right: 20px;" @click="returnDetail">返回</el-button>
        </div>
        <div ref="cont_1" class="title1"><span>1</span>环境地址</div>
        <div class="addressInfo">
          <div>请求地址：<span style="color: #0164FF">http://gateway.model-hubs.com</span></div>
        </div>
        <div ref="cont_2" class="title1"><span>2</span>签名规范</div>
        <div ref="cont_2_1" class="title2">签名生成(当前可以写死signature=AppWeb00123)</div>
        <div ref="cont_2_1_1" class="title3"><span />获得baseString</div>
        <div class="content-wrapper">
          设请求URL中的查询参数为集合 M，将集合 M 内满足条件的参数按照参数名 ASCII 码从小到大排序(字典序)， 使用 URL 键值对的格式(即 key1=value1&key2=value2...,注意value需要URLEncoder)拼接成字符串，得到 baseString。
          <div style="border-left: 3px solid #0164FD;background: rgba(1,100,255,0.09);border-radius: 4px; margin-top: 8px">
            <div style="color: #0F6CFE; font-weight: 500; padding: 12px 24px"><i class="el-icon-edit" style="margin-right: 8px" />特别注意以下重要规则:</div>
            <div style="padding: 12px 46px;color: #646464;"> - 参数值为空的不参与签名; </div>
            <div style="padding: 12px 46px;color: #646464;"> - signature参数本身不参与签名;</div>
            <div style="padding: 12px 46px;color: #646464;"> - 参数名区分大小写。</div>
          </div>
        </div>
        <div ref="cont_2_1_2" class="title3"><span />获得accessKeySecret</div>
        <div class="content-wrapper">假设accessKeySecret为testAccessKeySecret</div>
        <div ref="cont_2_1_3" class="title3"><span />生成签名</div>
        <div class="content-wrapper">根据前两步得到的 baseString和 accessKeySecret，利用HMAC运算生成签名signature如下。 签名生成示例代码(java版)如下:</div>
        <codemirror
          ref="mycode"
          v-model="signature"
          :options="cmOptions"
          class="code content-wrapper"
        />
        <div ref="cont_2_1_4" class="title3"><span />请求地址示例</div>
        <div class="content-wrapper">环境地址/服务名/接口路径?signature=AppWeb00123</div>
        <div ref="cont_2_2" class="title2">token生成</div>
        <div ref="cont_2_2_1" class="title3"><span />使用方式</div>
        <div class="content-wrapper">通过请求用户登录接口获取token</div>
        <div ref="cont_2_2_2" class="title3"><span />接口说明</div>
        <el-table class="content-wrapper" border :data="interfaceTableData">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="content" label="内容" />
        </el-table>
        <div ref="cont_2_2_3" class="title3"><span />请求参数</div>
        <div class="content-wrapper">Query:</div>
        <el-table class="content-wrapper" border :data="queryTableData">
          <el-table-column prop="name" label="参数名称" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="isDeliver" label="是否必传" />
        </el-table>
        <div ref="cont_2_2_4" class="title3"><span />请求参数示例</div>
        <json-viewer
          class="content-wrapper"
          :value="queryDemo"
          :expand-depth="10"
          copyable
          boxed
        >
          <template v-slot:copy="{copied}">
            <span v-if="copied">复制成功</span>
            <span v-else>复制</span>
          </template>
        </json-viewer>
        <div ref="cont_2_2_5" class="title3"><span />返回结果</div>
        <json-viewer
          class="content-wrapper"
          :value="returnResult"
          :expand-depth="10"
          boxed
          copyable
        >
          <template v-slot:copy="{copied}">
            <span v-if="copied">复制成功</span>
            <span v-else>复制</span>
          </template>
        </json-viewer>
        <div ref="cont_3" class="title1"><span>3</span>推进接口调用设计</div>
        <div id="cont_3_1" ref="cont_3_1" class="title3"><span />接口功能介绍</div>
        <div style="padding: 12px 0;color: #646464; font-size: 14px"> - 功能介绍</div>
        <div ref="cont_3_2" class="title3"><span />接口说明</div>
        <el-table class="content-wrapper" border :data="interfaceTableData1">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="content" label="内容" />
        </el-table>
        <div ref="cont_3_3" class="title3"><span />请求参数</div>
        <div class="content-wrapper">Headers:</div>
        <el-table class="content-wrapper" border :data="queryTableData1">
          <el-table-column prop="name" label="参数名称" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="isDeliver" label="是否必传" />
        </el-table>
        <div class="content-wrapper">Query:</div>
        <div class="content-wrapper"> body中传入 json 格式</div>
        <div ref="cont_3_4" class="title3"><span />参数示例</div>
        <json-viewer
          class="content-wrapper"
          :value="queryDemo1"
          :expand-depth="10"
          boxed
          copyable
        >
          <template v-slot:copy="{copied}">
            <span v-if="copied">复制成功</span>
            <span v-else>复制</span>
          </template>
        </json-viewer>
        <div ref="cont_3_5" class="title3"><span />成功返回参数</div>
        <json-viewer
          class="content-wrapper"
          :value="returnResult1"
          :expand-depth="10"
          boxed
          copyable
        >
          <template v-slot:copy="{copied}">
            <span v-if="copied">复制成功</span>
            <span v-else>复制</span>
          </template>
        </json-viewer>
        <div ref="cont_3_6" class="title3"><span />错误code说明</div>
        <el-table class="content-wrapper" style="padding-bottom: 24px" border :data="codeDesc">
          <el-table-column prop="code" label="code" />
          <el-table-column prop="desc" label="desc" />
        </el-table>
        <!--备案-->
        <div class="flex justify-center align-center"
             style="width: 100%;height: 50px;min-height: 50px;">
          <record-com></record-com>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>

import { codemirror } from 'vue-codemirror';
import 'codemirror/theme/liquibyte.css';// 导入选中的theme主题,与初始化theme配置一致
import 'codemirror/addon/hint/show-hint.css';// 导入自动提示核心样式

import 'codemirror/mode/sql/sql.js';// 导入使用的语言语法定义文件，初始化mode配置一致
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/hint/show-hint.js';// 导入自动提示核心文件
import 'codemirror/addon/hint/sql-hint.js';
import AiHeader from '@/layout/components/AiHeader';
import RecordCom from "@/components/RecordCom";
// 导入指定语言的提示文件

export default {
  name: 'Index',
  components: {
    AiHeader,
    JsonViewer: () => import('vue-json-viewer'),
    codemirror,
    RecordCom
  },
  data() {
    return {
      active: '1',
      defaultOpen: ['1', '2', '2.1', '2.2', '3'],
      menuData: [
        {
          level: 1,
          name: '环境地址',
          index: '1'
        },
        {
          level: 1,
          name: '签名规范',
          index: '2',
          children: [
            {
              level: 2,
              name: '签名生成',
              index: '2.1',
              children: [
                {
                  level: 3,
                  name: '获得baseString',
                  index: '2.1.1'
                },
                {
                  level: 3,
                  name: '获得accessKeySecret',
                  index: '2.1.2'
                },
                {
                  level: 3,
                  name: '生成签名',
                  index: '2.1.3'
                },
                {
                  level: 3,
                  name: '请求地址示例',
                  index: '2.1.4'
                }
              ]
            },
            {
              level: 2,
              name: 'token生成',
              index: '2.2',
              children: [
                {
                  level: 3,
                  name: '使用方式',
                  index: '2.2.1'
                },
                {
                  level: 3,
                  name: '接口说明',
                  index: '2.2.2'
                },
                {
                  level: 3,
                  name: '请求参数',
                  index: '2.2.3'
                },
                {
                  level: 3,
                  name: '请求参数示例',
                  index: '2.2.4'
                },
                {
                  level: 3,
                  name: '返回结果',
                  index: '2.2.5'
                }
              ]
            }
          ]
        },
        {
          level: 1,
          name: '推理结果调用设计',
          index: '3',
          children: [
            {
              level: 2,
              name: '接口功能介绍',
              index: '3.1'
            },
            {
              level: 2,
              name: '接口说明',
              index: '3.2'
            },
            {
              level: 2,
              name: '请求参数',
              index: '3.3'
            },
            {
              level: 2,
              name: '参数示例',
              index: '3.4'
            },
            {
              level: 2,
              name: '成功返回参数',
              index: '3.5'
            },
            {
              level: 2,
              name: '错误code说明',
              index: '3.6'
            }
          ]
        }
      ],
      cmOptions: {
        value: '', // 编辑器的起始值。可以是字符串，也可以是文档对象。
        mode: 'text/x-hive', // 第一个将模式名称映射到它们的构造函数，第二个将MIME类型映射到模式规范。
        theme: 'eclipse', // 编辑器样式的主题
        indentWithTabs: true, // 在缩进时，是否tabSize 应该用N个制表符替换前N *个空格。默认值为false。
        smartIndent: true, // 是否使用模式提供的上下文相关缩进（或者只是缩进与之前的行相同）。默认为true。
        lineNumbers: true, // 是否在编辑器左侧显示行号。
        matchBrackets: true, // 括号匹配
        autofocus: true, // 可用于使CodeMirror将焦点集中在初始化上
        extraKeys: { 'Ctrl-Space': 'autocomplete' }, // 按键配置
        hintOptions: {
          tables: {
            users: ['name', 'score', 'birthDate'],
            countries: ['name', 'population', 'size']
          }
        }
      },
      tabs: ['环境地址', '签名规范', 'tab3'],
      interfaceTableData: [
        {
          name: '请求方式',
          content: 'POST'
        },
        {
          name: '接口路径',
          content: 'user/login'
        }
      ],
      interfaceTableData1: [
        {
          name: '请求方式',
          content: 'POST'
        },
        {
          name: '接口路径',
          content: '/backend/remote/model/rational/模型版本/模型id'
        }
      ],
      queryTableData: [
        {
          name: 'userName',
          type: 'String',
          remark: '用户名',
          isDeliver: '是'
        },
        {
          name: 'password',
          type: 'String',
          remark: '密码',
          isDeliver: '是'
        }
      ],
      queryTableData1: [
        {
          name: 'Authorition',
          type: 'String',
          remark: '登录成功的token，格式:Authorition : tokenvalues',
          isDeliver: '是'
        }
      ],
      queryDemo: {
        username: 'admin',
        password: '******'
      },
      queryDemo1: {
        data: {
          instances: [
            { 'data': '/4Vu1GAUAI98VarnkYXCiiipMwooooAKKKKACiiigGR0hUgPIOoXigHOfrR5qwo8sp+VRk0P7Jv7PZkOfAVvj616IsA2k5705rXaM560FxV0cXon7Nvwk0C5GoeGfCUNuynIZa6qzthADaEYXAG32rQkuv7Lswp/iqvw0nnAdRxSauVy2J57hlEZkbiNdiewNS2yR2p+0SDg1BdwmW0356MKSCZ7tPs/PFbwiI/9k=', 'type': 'base64' },
            { 'data': '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHC0hEv734Xaix9wv/AMVXUsFJq7N2cNYzXcb7IkyCea7z4Jwy3Hxk8ItImMeIbT/0ctOb9mP9ou1TI+FOoA+yr/8AFV1vwK+AXx/s/i74ZudR+F+oKieILM5IX/nqv+1W2Ey+Sr3Kl8B//9k=', 'type': 'base64' },
            { 'data': '/9jnhy9glbXY7lHAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUVHKwCiiirAKKKKACkY4GaWjAPUUAN8z2pVYt2pcD0FGAOgpO4rIQsw5K01jnBp9JtHpSabQWGgnPLU4k9iPxpcD0owPSi1loGtxuW/vCj95TsD0FFJKQxv7ynDpzRRVK4H/9k=', 'type': 'base64' }
          ] }},
      returnResult: {
        code: '000000', // 成功统一code "desc": "success", //成功提示语 "data": {
        tokenName: 'Authorition', // token名称，用于请求需要用户登录接口header头的参数key
        tokenValue: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOjEsInJuU 3RyIjoibmxhYlE1ZTEyS3Q5SWdoNk9mZDgwdDJpTGI5VXEwQVMiLCJuYW1lIjoi6LaF57qn566h55CG5ZGYIiwi dXNlcklkIjoxfQ.wstS8QuQhwLlBINxed7HyitTsxnoSvHUHLwBgaXQUec', // token 值，写在需要登录接口的 header头的Authorition值
        sid: 'c4fb3e7b7ec84d1d8f6136149a78a979' // 接口全局唯一表示符
      },
      returnResult1: {
        code: '000000',
        msg: 'success',
        data: {}
      },
      codeDesc: [
        {
          code: '000000',
          desc: 'success'
        },
        {
          code: '200001',
          desc: '参数不合法'
        },
        {
          code: '200002',
          desc: '请求方法不支持'
        },
        {
          code: '999999',
          desc: '未知错误'
        }
      ],
      signature: 'public static String signature(String accessKeySecret, Map<String, String>\n' +
        'queryParam) throws Exception {\n' +
        'StandardCharsets.UTF_8.name());\n' +
        '   TreeMap<String, String> treeMap = new TreeMap<>(queryParam);\n' +
        '   treeMap.remove("signature");\n' +
        '   StringBuilder builder = new StringBuilder();\n' +
        'for (Map.Entry<String, String> entry : treeMap.entrySet()) {\n' +
        'String value = entry.getValue();\n' +
        'if (value != null && !value.isEmpty()) {\n' +
        ' String encode = URLEncoder.encode(value,\n' +
        '   builder.append(entry.getKey()).append("=").append(encode).append("&");\n' +
        ' }\n' +
        '}\n' +
        'if (builder.length() > 0) {\n' +
        '     builder.deleteCharAt(builder.length() - 1);\n' +
        '}\n' +
        ' String baseString = builder.toString();\n' +
        'System.out.println("baseString:" + baseString);\n' +
        '  Mac mac = Mac.getInstance("HmacSHA1");\n' +
        '  SecretKeySpec keySpec = new\n' +
        'SecretKeySpec(accessKeySecret.getBytes(StandardCharsets.UTF_8),\n' +
        'StandardCharsets.UTF_8.name());\n' +
        '  mac.init(keySpec);\n' +
        '  byte[] signBytes =\n' +
        'mac.doFinal(baseString.getBytes(StandardCharsets.UTF_8));\n' +
        '    return Base64.getEncoder().encodeToString(signBytes);\n' +
        '}',
      info: {},
      tabHeight: 0,
      cont_1: null,
      cont_2: null,
      cont_2_1: null,
      cont_2_1_1: null,
      cont_2_1_2: null,
      cont_2_1_3: null,
      cont_2_1_4: null,
      cont_2_2: null,
      cont_2_2_1: null,
      cont_2_2_3: null,
      cont_2_2_4: null,
      cont_2_2_5: null,
      cont_3: null,
      cont_3_1: null,
      cont_3_2: null,
      cont_3_3: null,
      cont_3_4: null,
      cont_3_5: null,
      cont_3_6: null
    };
  },
  mounted() {
    this.info = JSON.parse(sessionStorage.getItem('info'));
    this.cont_1 = this.$refs['cont_1'];
    this.cont_2 = this.$refs['cont_2'];
    this.cont_2_1 = this.$refs['cont_2_1'];
    this.cont_2_1_1 = this.$refs['cont_2_1_1'];
    this.cont_2_1_2 = this.$refs['cont_2_1_2'];
    this.cont_2_1_3 = this.$refs['cont_2_1_3'];
    this.cont_2_1_4 = this.$refs['cont_2_1_4'];
    this.cont_2_2 = this.$refs['cont_2_2'];
    this.cont_2_2_1 = this.$refs['cont_2_2_1'];
    this.cont_2_2_2 = this.$refs['cont_2_2_2'];
    this.cont_2_2_3 = this.$refs['cont_2_2_3'];
    this.cont_2_2_4 = this.$refs['cont_2_2_4'];
    this.cont_2_2_5 = this.$refs['cont_2_2_5'];
    this.cont_3 = this.$refs['cont_3'];
    this.cont_3_1 = this.$refs['cont_3_1'];
    this.cont_3_2 = this.$refs['cont_3_2'];
    this.cont_3_3 = this.$refs['cont_3_3'];
    this.cont_3_4 = this.$refs['cont_3_4'];
    this.cont_3_5 = this.$refs['cont_3_5'];
    this.cont_3_6 = this.$refs['cont_3_6'];

    this.tabHeight = this.$refs['tab'].offsetHeight;
    // setTimeout(() => {
    // }, 500);
    this.$refs['cont'].addEventListener('scroll', this.contentScroll, true);
  },
  methods: {
    returnDetail() {
      if (this.info.route === 'model-base') {
        this.$router.push('/model-base/detail/' + this.info.id);
      } else if (this.info.route === 'mine-model') {
        this.$router.push('model/mine-model/detail/' + this.info.id);
      } else if (this.info.route === 'user-model') {
        this.$router.push('model-base/user-model-detail/' + this.info.id);
      } else if (this.info.route === 'push-model') {
        this.$router.push('/model-manager/push/detail/' + this.info.id);
      }
    },
    handleOpen() {
      this.tabHeight = this.$refs['tab'].offsetHeight;
    },
    handleClose() {
      this.tabHeight = this.$refs['tab'].offsetHeight;
    },
    contentScroll() {
      // 倒排
      if (this.cont_3_6.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '3.6';
        return false;
      }
      if (this.cont_3_5.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '3.5';
        return false;
      }
      if (this.cont_3_4.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '3.4';
        return false;
      }
      if (this.cont_3_3.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '3.3';
        return false;
      }
      if (this.cont_3_2.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '3.2';
        return false;
      }
      if (this.cont_3_1.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '3.1';
        return false;
      }
      if (this.cont_3.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '3';
        return false;
      }
      if (this.cont_2_2_5.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.2.5';
        return false;
      }
      if (this.cont_2_2_4.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.2.4';
        return false;
      }
      if (this.cont_2_2_3.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.2.3';
        return false;
      }
      if (this.cont_2_2_2.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.2.2';
        return false;
      }
      if (this.cont_2_2_1.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.2.1';
        return false;
      }
      if (this.cont_2_2.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.2';
        return false;
      }
      if (this.cont_2_1_4.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.1.4';
        return false;
      }
      if (this.cont_2_1_3.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.1.3';
        return false;
      }
      if (this.cont_2_1_2.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.1.2';
        return false;
      }
      if (this.cont_2_1_1.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.1.1';
        return false;
      }
      if (this.cont_2_1.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2.1';
        return false;
      }
      if (this.cont_2.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '2';
        return false;
      }
      if (this.cont_1.getBoundingClientRect().top - 60 <= this.tabHeight) {
        this.active = '1';
        return false;
      }
    },
    switchTab(index) {
      let elementPosition = 0;
      const headerOffset = 120;
      switch (index) {
        case '1':
          elementPosition = this.cont_1.offsetTop;
          break;
        case '2':
          elementPosition = this.cont_2.offsetTop;
          break;
        case '2.1':
          elementPosition = this.cont_2_1.offsetTop;
          break;
        case '2.1.1':
          elementPosition = this.cont_2_1_1.offsetTop;
          break;
        case '2.1.2':
          elementPosition = this.cont_2_1_2.offsetTop;
          break;
        case '2.1.3':
          elementPosition = this.cont_2_1_3.offsetTop;
          break;
        case '2.1.4':
          elementPosition = this.cont_2_1_4.offsetTop;
          break;
        case '2.2':
          elementPosition = this.cont_2_2.offsetTop;
          break;
        case '2.2.1':
          elementPosition = this.cont_2_2_1.offsetTop;
          break;
        case '2.2.2':
          elementPosition = this.cont_2_2_2.offsetTop;
          break;
        case '2.2.3':
          elementPosition = this.cont_2_2_3.offsetTop;
          break;
        case '2.2.4':
          elementPosition = this.cont_2_2_4.offsetTop;
          break;
        case '2.2.5':
          elementPosition = this.cont_2_2_5.offsetTop;
          break;
        case '3':
          elementPosition = this.cont_3.offsetTop;
          break;
        case '3.1':
          elementPosition = this.cont_3_1.offsetTop;
          break;
        case '3.2':
          elementPosition = this.cont_3_2.offsetTop;
          break;
        case '3.3':
          elementPosition = this.cont_3_3.offsetTop;
          break;
        case '3.4':
          elementPosition = this.cont_3_4.offsetTop;
          break;
        case '3.5':
          elementPosition = this.cont_3_5.offsetTop;
          break;
        case '3.6':
          elementPosition = this.cont_3_6.offsetTop;
          break;
      }
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      this.$nextTick(() => {
        this.$refs.cont.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper{
  height: 100%;
  background: white;
  ::v-deep .el-container{
    height: calc(100% - 60px);
    .el-menu{
      border-right: 0;
    }
    .el-menu-item,
    .el-submenu__title{
      height: 40px;
      line-height: 40px;
      color: #262626;
    }
    .el-menu-item.is-active{
      color: #0164FF;
    }
    .aside-title{
      font-size: 18px;
      color: #262626;
      font-weight: 500;
    }
    .content{
      padding: 0 34px;
      .title1{
        display: flex;
        align-items: center;
        margin: 24px 0;
        font-size: 20px;
        color: #262626;
        font-weight: 500;
        >span{
          display: inline-block;
          background: rgba(1, 100, 255, 0.13);
          width: 24px;
          height: 24px;
          border-radius: 24px;
          margin-right: 10px;
          line-height: 24px;
          text-align: center;
          font-size: 14px;
          color: #262626;
        }
      }
      .title2{
        margin: 16px 0;
        font-size: 16px;
        color: #262626;
        font-weight: 500;
      }
      .title3{
        margin: 16px 0;
        font-size: 14px;
        color: #262626;
        font-weight: 500;
        >span{
          display: inline-block;
          background: #D8D8D8;
          width: 8px;
          height: 8px;
          border-radius: 8px;
          margin-right: 10px;
        }
      }
      .addressInfo{
        margin: 20px 0;
        padding: 12px;
        background: #F3F6F9;
        border-radius: 4px;
        >div{
          font-size: 14px;
          color: #646464;
          font-weight: 500;
        }
      }
      .content-wrapper{
        margin: 16px 0;
        font-size: 14px;
        color: #646464;
      }
    }
  }
}
</style>
