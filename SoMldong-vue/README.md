## 相关项目

- [后端工程](https://gitee.com/mldong/mldong)
- [演示地址](http://flow.mldong.com/)

## 文档

[文档地址](https://doc.mldong.com)

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/) - ui 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 安装使用
- yarn配置
```bash
# 全局安装yarn
npm install -g yarn
# 设置为淘宝源
yarn config set registry https://registry.npmmirror.com/
# 忽略引擎检测
yarn config set ignore-engines true

```

- 获取项目代码

```bash
git clone git@gitee.com:mldong/mldong-vue.git
```

- 安装依赖

```bash
cd mldong-vue

yarn install 
# 如果报gifsicle-5.3.0.tgz: Integrity check failed for "gifsicle"错，则执行
yarn install --update-checksums

```

- 运行

```bash
yarn dev:local
```

- 打包

```bash
yarn build
```
## 关于代码生成器

### 运行说明

#### 查看帮助

``` shell
node generate/main.cjs --help
```

```
选项：
      --version    显示版本号                                             [布尔]
  -t, --tableName  表名称                                        [字符串] [必需]
  -c, --cover      是否覆盖                                   [数字] [默认值: 0]
  -d, --data       是否仅生成元数据                           [数字] [默认值: 0]
  -h, --help       显示帮助信息                                           [布尔]
```
#### 代码生成配置文件
`config/default.json`

#### 指定某个元数据生成代码

``` shell
node generate/main.cjs -t biz_demo
```

#### 指定某个元数据生成代码－覆盖式

``` shell
node generate/main.cjs -t biz_demo -c 1
```
#### 指定某个元数据生成代码－仅覆盖元数据文件

``` shell
node generate/main.cjs -t biz_demo -d 1
```
### 相关视频
[AI神器！阿里通义灵码从零带你开发前端代码生成器](https://www.bilibili.com/cheese/play/ss10515)
### 模板语法

#### 输出

##### 标准语法

```
<{value}>
<{data.key}>
<{data['key']}>
<{a ? b : c}>
<{a || b}>
<{a + b}>
```

##### 原始语法

``` 
<%= value %>
<%= data.key %>
<%= data['key'] %>
<%= a ? b : c %>
<%= a || b %>
<%= a + b %>
```

#### 原文输出，不转义

##### 标准语法

``` 
<{@ value }>
```

##### 原始语法

``` 
<%- value %>
```

#### 条件

##### 标准语法

``` 
<{if value}> ... <{/if}>
<{if value}> ... <{else}> ... <{/if}>
<{if v1}> ... <{else if v2}> ... <{/if>}
<{if v1}> ... <{else if v2}> ... <{else}> ... <{/if}>
```

##### 原始语法

```
<% if (value) { %> ... <% } %>
<% if (value) { %> ... <% } else { %>... <% } %>
<% if (v1) { %> ... <% } else if (v2) { %> ... <% } %>
<% if (v1) { %> ... <% } else if (v2) { %> ... <% }  else { %>... <% } %>
```

#### 循环

##### 标准语法

```
隐式定义，默认$value/$index
<{each target}>
    <{$index}} <{$value>}>
<{/each}>
显示定义
<{each target val index}>
    <{index}> <{val>}>
<{/each}>
```

##### 原始语法

```
<% for(var i = 0; i < target.length; i++){ %>
    <%= i %> <%= target[i] %>
<% } %>
```

#### 变量

##### 标准语法

```
<{set temp = data.sub.content}>
```

##### 原始语法

``` 
<% var temp = data.sub.content; %>
```

## 更新日志

[CHANGELOG](./CHANGELOG.zh_CN.md)

## 项目地址

## 如何贡献

非常欢迎你的加入！[提一个 Issue](https://gitee.com/mldong/mldong-vue/issues) 或者提交一个 Pull Request。

**Pull Request:**

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

## 相关仓库

如果这些插件对你有帮助，可以给一个 star 支持下

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - 用于本地及开发环境数据 mock
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - 用于 html 模版转换及压缩
- [vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import) - 用于组件库样式按需引入
- [vite-plugin-theme](https://github.com/anncwb/vite-plugin-theme) - 用于在线切换主题色等颜色相关配置
- [vite-plugin-imagemin](https://github.com/anncwb/vite-plugin-imagemin) - 用于打包压缩图片资源
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - 用于打包输出.gz|.brotil 文件
- [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) - 用于快速生成 svg 雪碧图

## 环境变量配置
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略

温馨提醒

只有以 VITE_ 开头的变量会被嵌入到客户端侧的包中，你可以项目代码中这样访问它们：
console.log(import.meta.env.VITE_PROT);
以 VITE_GLOB_* 开头的的变量，在打包的时候，会被加入_app.config.js配置文件当中.

## 目录说明
```
├── build # 打包脚本相关
│   ├── config # 配置文件
│   ├── generate # 生成器
│   ├── script # 脚本
│   └── vite # vite配置
├── mock # mock文件夹
├── public # 公共静态资源目录
├── src # 主目录
│   ├── api # 接口文件
│   ├── assets # 资源文件
│   │   ├── icons # icon sprite 图标文件夹
│   │   ├── images # 项目存放图片的文件夹
│   │   └── svg # 项目存放svg图片的文件夹
│   ├── components # 公共组件
│   ├── design # 样式文件
│   ├── directives # 指令
│   ├── enums # 枚举/常量
│   ├── hooks # hook
│   │   ├── component # 组件相关hook
│   │   ├── core # 基础hook
│   │   ├── event # 事件相关hook
│   │   ├── setting # 配置相关hook
│   │   └── web # web相关hook
│   ├── layouts # 布局文件
│   │   ├── default # 默认布局
│   │   ├── iframe # iframe布局
│   │   └── page # 页面布局
│   ├── locales # 多语言
│   ├── logics # 逻辑
│   ├── main.ts # 主入口
│   ├── router # 路由配置
│   ├── settings # 项目配置
│   │   ├── componentSetting.ts # 组件配置
│   │   ├── designSetting.ts # 样式配置
│   │   ├── encryptionSetting.ts # 加密配置
│   │   ├── localeSetting.ts # 多语言配置
│   │   ├── projectSetting.ts # 项目配置
│   │   └── siteSetting.ts # 站点配置
│   ├── store # 数据仓库
│   ├── utils # 工具类
│   └── views # 页面
├── test # 测试
│   └── server # 测试用到的服务
│       ├── api # 测试服务器
│       ├── upload # 测试上传服务器
│       └── websocket # 测试ws服务器
├── types # 类型文件
├── vite.config.ts # vite配置文件
└── windi.config.ts # windcss配置文件
```