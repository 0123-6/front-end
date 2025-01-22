# Node是什么

Node.js是一个开源的，跨平台的，用于服务器端和网络应用的JavaScript运行环境。基于Google V8引擎。

`process` 是 Node.js 中的一个全局对象，代表当前 Node.js 进程。它提供了与当前进程相关的信息和控制功能。通过 `process` 对象，可以访问诸如环境变量、命令行参数、标准输入输出流等进程相关的信息。

一些常用的 `process` 属性和方法包括：

- `process.env`: 返回一个对象，包含了当前 shell 环境下的所有环境变量。
- `process.argv`: 返回一个数组，包含了命令行参数。数组的第一个元素是 Node.js 的执行路径，第二个元素是 JavaScript 文件的路径，后续元素是命令行参数。
- `process.cwd()`: 返回当前工作目录的路径。
- `process.exit([code])`: 终止当前进程，并返回指定的退出码。
- `process.on(event, listener)`: 监听指定事件的发生，可以通过这个方法来注册对进程事件的处理函数。

这些只是 `process` 对象提供的一部分功能，它还提供了许多其他有用的属性和方法，可以根据具体需求进行查阅和使用。

## 如何查看node版本

```cmd
node -v
node --version
```

## 如何升级Node版本

从官网下载安装包，现在最新稳定版为**v22.12.0**

# NPM

## npm是什么

NPM(Node Package Manager)是Node.js的包管理器，用于Node.js包的安装，分享，分发，版本管理和依赖控制。它是一个命令行下的软件，用于安装和管理Node.js包。



NPM和Node.js的关系非常紧密。当安装Node.js时，NPM会被一同安装。通过NPM，开发者可以安装别人编写的代码包。

在项目中，package.json文件是一个重要的元素，它记录了项目的各种信息，包括项目的名称，版本，描述，作者等信息，以及项目的依赖包，NPM会根据package.json文件来安装依赖，也可以通过NPM来更新或删除依赖。

## NPM命令

NPM（Node Package Manager）是Node.js的包管理器，它提供了许多命令来帮助开发者管理项目的依赖包。以下是一些常见的NPM命令：

### 查看版本

```cmd
npm -v
```

### 更新npm或其它包

现在最新版本为**10.8.3**

```cmd
npm install npm@latest -g
npm install -g <package-name>@latest

npm update
```

`npm update` 命令的作用是更新项目中的 npm 包。它会检查项目中的 `package.json` 文件中列出的所有依赖项，并尝试将它们更新到符合指定版本范围的最新版本。更新过程中，npm 会考虑每个依赖项的版本约束，以确保不破坏现有的依赖关系。

具体来说，`npm update` 命令会执行以下操作：

1. 检查每个依赖项的当前版本和最新版本。
2. 对于每个依赖项，如果有新版本可用且符合指定的版本范围，它会将依赖项更新到最新版本。
3. 更新 `package.json` 文件中的依赖版本。
4. 生成 `package-lock.json`（如果存在）以反映更新后的依赖项。

需要注意的是，`npm update` 命令只会更新符合指定版本范围的包。如果你希望将所有依赖项更新到最新版本，可以使用 `npm update` 命令的 `--latest` 标志，如下所示：

```bash
npm update --latest
npm update -g
npm -g update --latest
```

这将忽略 `package.json` 中指定的版本范围，直接将所有依赖项更新到最新版本。

### npm init

执行npm init命令会创建一个新的package.json文件。package.json是一个标准的文件，用于描述你的应用或者模块的信息，包括项目的名称、版本、描述、作者、许可证等信息，以及项目的依赖包等。  npm init命令会引导你创建一个package.json文件，包括名称、版本、描述等信息的输入，并最终生成一个package.json文件。如果你在命令后添加-y或--yes，如npm init -y，则会跳过提问环节，直接生成一个新的package.json文件。  生成package.json文件的原因是，它是Node.js项目的核心文件，用于管理项目的元数据和依赖。通过package.json，其他开发者可以了解到你的项目的基本信息，同时，当其他开发者克隆你的项目时，他们可以通过运行npm install命令，根据package.json文件中的信息，自动安装所有的依赖包。  package.json文件的规范是由NPM定义的，你可以在NPM的官方网站上找到相关的文档和规范：https://docs.npmjs.com/cli/v7/configuring-npm/package-json

### npm install

安装package.json文件中定义的所有依赖包

### npm install \<package\>

安装指定的包，并将其添加到package.json文件的依赖中

npm @后的内容为对应的版本，默认为latest，即最新稳定版



### npm install \<package\> --save-dev

安装指定的包，并将其添加到package.json文件的开发依赖中

### npm install \<package\> --save

和不加--save等效 

### npm uninstall

卸载

### npm create

npm create命令是一个快捷方式，用于运行一个名为create-\<something\>的包。这是一种快速创建新项目的方法，这些项目的模板由社区提供并维护。

例如，运行npm create react-app my-app,npm会自动运行create-react-app包，创建一个名为my-app的应用。

这个命令的工作方式是，它会查找名为**create-\<something\>**的包，然后运行它。这个包应该是全局安装的命令行应用，它会接收一些参数并创建新的项目。

这个命令的目的是为了简化新项目的创建过程，让开发者可以快速地开始编写代码，而不需要手动设置项目的基础结构。

下面是运行npm create vite@latest的过程

1. 当你运行npm create vite@latest命令时，NPM首先会查找名为create-vite@latest的包。如果你的系统中没有安装这个包，NPM会自动从NPM仓库中下载并安装它。npm install -g create-vite@latest
2. 安装完成后，NPM会运行create-vite包。这个包是一个命令行工具，它会引导你创建一个新的Vite项目。create-vite my-vite-project
3. 这个命令会创建一个新的目录，目录的名称就是你输入的项目名称。然后，它会在这个新目录中生成一个新的Vite项目

npm init vite@latest和npm create vite@latest这两个命令在功能上是相同的，都是用来创建一个使用最新版本的Vite的新项目。它们都会运行名为create-vite的包。  这两个命令的区别在于，npm init是NPM 5.2.0引入的npx的一部分，而npm create是NPM 6.1.0引入的。npm create是npm init的别名，它们都可以用来初始化新的项目。  总的来说，npm init vite@latest和npm create vite@latest在功能上没有区别，你可以根据自己的喜好选择使用哪一个。

### npm run \<script\>

运行package.json文件中定义的脚本

### npm test

运行package.json中定义的测试脚本

### npm publish

将你的包发布到NPM仓库

### npm uninstall -g package_name

删除指定全局包

### npm list

查看包的版本信息。

```cmd
npm list -g package_name
npm list -g create-vite
# 查看全部全局包
npm list -g
```



## package.json的dependencies的^和~的区别

在 package.json 文件中，dependencies 对象列出了项目所需的npm包及其版本号。版本号前的 ^ 和 ~ 符号是用来指定可以接受的版本范围的。  
^（Caret）：如果版本号是 ^1.2.3，这意味着可以接受所有更新到主版本号1的版本，但不能更改主版本号。也就是说，可以接受任何1.x.x的版本，但不能是2.0.0。  
~（Tilde）：如果版本号是 ~1.2.3，这意味着可以接受所有1.2.x的版本，但不能更改次版本号。也就是说，可以接受1.2.1、1.2.4等，但不能是1.3.0。  
这两个符号允许开发者在不破坏项目的情况下接受某些更新（如bug修复和小功能改进）。

## package.json

### name

项目的名称

### private

`private` 属性是 `package.json` 中的一个特殊字段，用于指示该包是否为私有包。当 `private` 属性被设置为 `true` 时，npm 不会发布这个包到 npm 公共注册表。这是为了防止意外发布私有代码到公共的 npm 仓库中。

通常情况下，私有包是指那些不打算分享给其他人使用的包，而是仅仅在特定项目中使用的包。

下面是一个示例 `package.json` 文件，其中包含 `private` 属性的使用：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

在这个例子中，`private` 属性被设置为 `true`，因此 `my-project` 包不会被发布到 npm 公共仓库中。

### version

在 `package.json` 文件中，`version` 字段用于指定当前项目或包的版本号。版本号通常采用语义化版本（Semantic Versioning）规范，该规范包含三个数字（主版本号、次版本号、修订版本号），并且可以附加预发布版本号和构建号。

语义化版本号的格式通常为：`主版本号.次版本号.修订版本号`。例如：`1.2.3`

- 主版本号（Major Version）：当你做了不兼容的 API 修改时（一般是指向后不兼容的修改），你应该更新主版本号。
- 次版本号（Minor Version）：当你做了向后兼容的功能性新增（不影响现有功能），你应该更新次版本号。
- 修订版本号（Patch Version）：当你做了向后兼容的问题修正（修复了 bug），你应该更新修订版本号。

示例：
```json
{
  "name": "my-project",
  "version": "1.0.0"
}
```
这里的版本号是 `1.0.0`，表示主版本号为 1，次版本号为 0，修订版本号为 0。

### type

在 `package.json` 文件中，`type` 属性是一个可选字段，用于指定当前项目的模块类型。它通常用于指示项目的代码是采用哪种模块系统编写的，比如 CommonJS、ES Module 等。

这个字段在一些情况下可以用于告诉工具如何处理项目中的代码，尤其是在涉及到多种模块系统的情况下。例如，一些工具可能会根据 `type` 字段来选择是否启用 ES 模块的支持。

- `"commonjs"`：表示项目采用了 CommonJS 模块系统，这是 Node.js 默认的模块系统。
- `"module"`：表示项目采用了 ES Module（ECMAScript 模块）的模块系统，这是 JavaScript 的官方模块系统，通常用于浏览器端和一些现代的 Node.js 应用中。
- 自定义类型：除了常见的 `"commonjs"` 和 `"module"` 之外，开发者也可以定义自己的模块类型，例如一些工具或框架可能会定义自己的模块类型。

### scripts

一些代码

### devDependencies

开发依赖

### description

描述信息

### module

type为module时的入口文件,优先级大于main

### main

入口文件

### author

作者

### license

协议

# import 语法的查找规则，import * as THREE from 'three'是如何运行的,加载的哪个文件

当你在JavaScript中使用**import**语句导入一个模块时，解释器会按照以下规则去寻找这个模块

1. 检查模块引用是否为相对或绝对路径：如果模块引用是一个相对路径(./moduleA)或绝对路径(/usr/local/moduleA)，解释器会直接引入这个路径指向的文件
2. 检查模块引用是否为内置模块：如果模块引用是Node.js的内置模块(如fs或path),解释器会直接导入这个内置模块
3. 在node_modules目录中查找：如果模块引用既不是路径，也不是内置模块，解释器会认为它是一个包名。具体来说，它会查找node_modules/three/package.json文件。解释器会在当前目录的node_modules目录中寻找这个包。如果在当前目录的node_modules目录下找不到，解释器会向上级目录查找，直到找到这个包或到达文件系统的根目录。
4. 查看包的package.json文件：在找到包后，解释器会查看这个包的package.json文件。package.json文件是一个包的元数据文件，它包含了这个包的各种信息。
   1. 如果有module字段，那么这个字段指定的文件将被加载
   2. 如何没有module字段，那么main字段指定的文件将被加载
   3. 如何两个字段都没有，那么默认加载index.js文件















# yarn

yarn是另一个npm包管理器。

```cmd
npm install -g corepack
corepack enable
```





# 常见问题

## node example会发生什么

运行 `node examples` 命令时，Node.js 将尝试执行名为 `examples` 的脚本文件。如果 `examples` 是一个目录，则 Node.js 将尝试查找该目录下的 `index.js` 或 `index.mjs` 文件，并执行其中的代码。

如果 `examples` 是一个文件，则 Node.js 将直接执行该文件中的代码。执行过程中，Node.js 会解析 JavaScript 代码并按照顺序执行其中的语句。

具体执行过程和发生的操作取决于 `examples` 脚本中的内容，它可能包含各种操作，例如定义变量、调用函数、加载模块、处理事件等等。

## 设置npm源

```cmd
# 查看当前源
npm config get registry
# 设置淘宝源
npm config set registry https://registry.npmmirror.com/

# 恢复默认
npm config set registry https://registry.npmjs.org/

# pnpm设置源
pnpm set registry https://registry.npmmirror.com

```



# 项目的package.json版本更新工具

npm-check-updates

```cmd
npm i -g npm-check-updates
# 设置安装依赖的链接
npm i -g xxx --registry=http://ipw.clic/artifactory/api/npm/public-npm-release-virtual/

# 用法
# 更新全局包
ncu -g

# 检查仅更新次要版本和补丁版本
ncu
ncu --target minor
# 更新
ncu -u
ncu --target-minor -u

```

# 常见的nodejs包管理工具

- **npm**: Node.js 官方默认包管理器，安装 Node.js 时会自动附带。
- yarn: Facebook 推出的包管理器，注重速度和稳定性。
- **pnpm(推荐)**: 
  - 高效的包管理器，使用符号链接节省磁盘空间。
  - 对 monorepo 项目（多包管理）支持友好。

总结：**对于大多数项目，npm 是默认且稳定的选择；对于追求性能和严格依赖管理的项目，可以试试 pnpm。**



**pnpm是推荐选择**.



使用项目指定的pnpm版本进行依赖安装 

corepack enable

执行这个命令,需要管理员权限.

| 操作         | npm                | pnpm            |
| ------------ | ------------------ | --------------- |
| 安装依赖     | npm install        | pnpm install    |
| 添加依赖     | npm install pkg    | pnpm add pkg    |
| 添加开发依赖 | npm install -D pkg | pnpm add -D pkg |
| 删除依赖     | npm uninstall pkg  | pnpm remove pkg |
| 运行脚本     | npm run script     | pnpm run script |
|              |                    |                 |



```bash
# pnpm设置源
pnpm set registry https://registry.npmmirror.com
```

# 可以在前端项目中使用nodejs库吗?

不可以,因为nodejs库运行在nodejs环境,而前端项目运行在浏览器环境,因此,nodejs库不可以在前端项目中直接使用.

# nodejs项目的标准配置文件

.npmrc是标准配置文件

```cmd
registry = http://ipw.clic/artifactory/api/npm/public-npm-release-virtual/
```

# npm和pnpm生命周期

```json
{
  "scripts": {
    "preinstall": "echo 'Before install...'",
    "postinstall": "echo 'After install...'"
  }
}
```

nodejs项目的钩子函数,包括**自己的项目**和**依赖项目**.

pnpm默认禁用生命周期钩子,为了安全.

# nodejs多版本管理工具

nvm

```cmd
# 安装新版本
nvm install <version>
nvm install 22.13.0

# 切换版本
nvm use <version>

# 列出可用版本
nvm list
```

