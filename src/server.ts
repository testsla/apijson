import "reflect-metadata"; // this shim is required
require('dotenv').config()
import { createConnection, getRepository } from "typeorm";
import { createKoaServer } from "routing-controllers";
import { UserController } from "./controller/UserController";
import { ApiJsonController } from "./controller/apijson.controller";
import {useContainer as routingUseContainer} from "routing-controllers";
import {useContainer as ormUseContainer} from "typeorm";
import {Container} from "typedi";

routingUseContainer(Container);
ormUseContainer(Container);

// creates express app, registers all controller routes and returns you express app instance
const app = createKoaServer({
    controllers: [UserController, ApiJsonController] // we specify controllers we want to use
});
 
// run express application on port 3000
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