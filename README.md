Dirve
---------------------
Dirve 是基于 [fis3](http://fis.baidu.com/) 封装的解决方案。目前里面的一些特殊规则需要配合内部的前端服务器实现。

## 安装
使用 npm 全局安装 Dirve

    ```shell
    npm install -g dirve
    ```

## 业务开发
1. 如果之前有使用其他项目使用 `dirve` ,使用 `dirve server clean` 初始化调试目录

1. 在当前终端/命令行窗口，使用 `dirve release -wL` 构建项目并监听改变

1. **新开** 一个终端或命令行窗口，使用 `dirve server start` 启动项目服务器

1. 浏览项目效果 http://localhost:5000

## 命令本地开发
1. clone 本仓库到本地
1. 建个软链方便测试 (linux、mac 之类的，windows 暂时没顾得上。。。)

    ```shell
    cd /usr/local/bin
    ln -s <project>/bin/drive drive-dev
    ```

1. 找个符合规则的项目
1. 按照业务开发模式使用新的软链启动项目并进行命令开发
