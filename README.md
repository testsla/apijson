# APIJSON.NODE-TS
![](https://img.shields.io/badge/mysql-8.0.0-brightgreen.svg)
[![](https://img.shields.io/badge/rxjs-^2.14.1-brightgreen.svg)](https://rxjs-dev.firebaseapp.com/)
[![](https://img.shields.io/badge/typeorm-0.2.7-brightgreen.svg)](http://typeorm.io/#/)
[![](https://img.shields.io/badge/routing_controllers-^0.7.7-brightgreen.svg)](https://github.com/typestack/routing-controllers)


[通用文档](https://github.com/TommyLemon/APIJSON/blob/master/Document.md)  &nbsp; [在线工具](http://apijson.org)

![](https://raw.githubusercontent.com/TommyLemon/APIJSON/master/logo.png) 

APIJSON是一种为API而生的JSON网络传输协议。<br />
为 简单的增删改查、复杂的查询、简单的事务操作 提供了完全自动化的API。<br />
通过自动化API，前端可以定制任何数据、任何结构！<br />

<br />

![](https://raw.githubusercontent.com/TommyLemon/StaticResources/master/APIJSON_Auto_get.jpg)
<br />

### 快速上手

1. 运行 `yarn i` 和 `npm i -g ts-node`.
2. 设置数据库 `ormconfig.json`
3. 在vscode上 执行快捷键ctrl+shift+p 输入 Toggle Auto  Attach， 启用自动附加。然后在vscode 命令行中运行 `yarn nodemon`
4. 发送请求 GET /users 初始化数据
5. 测试 POST /apijson 
```json
    {
        "[]":{
            "User":{
                "id":1
            },
            "Message":{
                "id":1
            }
        }
    }
```


#### QQ技术交流群：607020115（群1） 739316921（群2）

如果有什么问题或建议可以[提ISSUE](https://github.com/TEsTsLA/apijson/issues)、加群或者[发我邮件](https://github.com/TEsTsLA)，交流技术，分享经验。<br >

### 其它项目
[APIJSON.JAVA](https://github.com/TommyLemon/APIJSON/) 🚀后端接口和文档自动化，前端(客户端) 定制返回JSON的数据和结构！ 

[APIJSONAuto](https://github.com/TommyLemon/APIJSONAuto) 自动化接口管理工具，自动生成文档与注释、自动生成代码、自动化回归测试、自动静态检查等

[APIJSON.NET](https://github.com/liaozb/APIJSON.NET) C# 版 APIJSON ，支持 MySQL, PostgreSQL, MS SQL Server, Oracle, SQLite

[APIJSON-Android-RxJava](https://github.com/TommyLemon/APIJSON-Android-RxJava) 仿微信朋友圈动态实战项目，ZBLibrary(UI) + APIJSON(HTTP) + RxJava(Data)


 
