import "reflect-metadata"; // this shim is required
require('dotenv').config()
import { createConnection, getRepository } from "typeorm";
import { createKoaServer, useKoaServer } from "routing-controllers";
import { UserController } from "./controller/UserController";
import { ApiJsonController } from "./controller/apijson.controller";
import { useContainer as routingUseContainer } from "routing-controllers";
import { useContainer as ormUseContainer } from "typeorm";
import { Container } from "typedi";
import * as Koa from 'koa';
import * as koaViews from 'koa-views';
import * as path from 'path';

routingUseContainer(Container);
ormUseContainer(Container);

const koa = new Koa();
koa.use(koaViews(path.join(__dirname, 'views'), {
    options: {
        ext: 'ejs',
    },
    extension: 'ejs',
}))

// use koa app, registers all controller routes and returns you koa app instance
const app = useKoaServer(koa, {
    // controllers: [`${__dirname}/controllers/**/*{.js,.ts}`],
    controllers: [UserController, ApiJsonController] // we specify controllers we want to use
})
// creates koa app, registers all controller routes and returns you koa app instance
// const app = createKoaServer({
//     controllers: [UserController, ApiJsonController] // we specify controllers we want to use
// });
 
// run koa application on port 3000
// app.listen(3000);
const databaseInitializer = async () => createConnection().then(async connection => {
    console.log('连接成功')
}).catch(error => console.log(error));

const bootstrap = async () => {
    await databaseInitializer();
    app.listen(process.env.PORT, async () => {
        console.log(`服务运行${process.env.PORT}`)
    })
}
bootstrap();