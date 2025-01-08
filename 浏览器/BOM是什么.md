# BOM是什么

BOM（Browser Object Model）是前端开发中用于描述浏览器环境的对象模型。它包含了浏览器提供的一组对象和接口，用于操作和与浏览器环境交互。与DOM（Document Object Model）专注于操作网页的文档结构不同，BOM则提供了与整个浏览器相关的功能。

### BOM的主要部分
BOM主要包括以下几个核心对象和功能：

- **window对象**：代表整个浏览器窗口，是BOM的顶级对象。许多BOM功能都可以通过`window`访问。
  - **属性**：如`innerWidth`和`innerHeight`代表窗口的宽度和高度。
  - **方法**：如`alert()`、`confirm()`、`setTimeout()`等。
  - **子对象**：许多BOM组件，如`document`、`navigator`、`location`、`history`、`screen`等，都是`window`的子对象。

- **navigator对象**：提供有关浏览器信息的接口，如浏览器名称、版本、操作系统、语言、是否支持cookies等。
  - **常见属性**：`navigator.userAgent`、`navigator.language`、`navigator.platform`等。

- **location对象**：用于获取和操作浏览器的URL。可以用于重定向、获取查询参数等。
  - **常见属性**：`location.href`（当前URL）、`location.hostname`、`location.pathname`、`location.search`等。
  - **常见方法**：`location.assign()`、`location.reload()`、`location.replace()`等。

- **history对象**：用于操作浏览器的历史记录，如前进、后退、跳转等。
  - **常见方法**：`history.back()`、`history.forward()`、`history.go(n)`等。

- **screen对象**：提供屏幕相关信息，如分辨率、颜色深度等。
  - **常见属性**：`screen.width`、`screen.height`、`screen.colorDepth`等。

### BOM的作用
BOM提供了操作浏览器环境的能力，使得前端开发人员可以：

- 控制浏览器窗口，如调整大小、打开新窗口、关闭窗口等。
- 获取浏览器和用户环境的信息，如操作系统、浏览器类型、语言等。
- 操作浏览器的URL和历史记录，实现页面跳转、刷新、前进和后退等。
- 与用户交互，如弹出对话框（`alert`、`confirm`、`prompt`）等。

### BOM和DOM的区别
- **DOM**：专注于操作HTML文档的结构，涉及节点、元素、属性、文本等。
- **BOM**：专注于与浏览器相关的操作，涉及窗口、历史记录、导航、屏幕等。

BOM和DOM共同组成了前端开发的核心环境。DOM主要用于操作网页内容，而BOM用于与浏览器环境交互。了解BOM的功能可以帮助前端开发人员创建更丰富和交互式的网页应用。