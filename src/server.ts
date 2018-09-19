import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";

import "reflect-metadata"; // this shim is required
import { createKoaServer } from "routing-controllers";
import { UserController } from "./controller/UserController";
import { ApiJsonController } from "./controller/apijson.controller";

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
    app.listen(3001, async () => {
        console.log('服务运行3001')
    })
}
bootstrap();