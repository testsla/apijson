import { Controller, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Message } from "../entity/Message";
import { UserService } from "../service/user.service";
import { getRandom } from "../util";
const MockJs = require('mockjs');
const story = require('./txt');


@Controller()
export class UserController {
    constructor(
        private userSrv: UserService
    ) { }

    @Get("/users")
    async getAll() {
        // init
        const user = new User();
        const msg = this.userSrv.createMsg();
        user.firstName = MockJs.Random.first();
        user.lastName = MockJs.Random.last();
        user.cName = MockJs.Random.cname() + MockJs.Random.cfirst();
        user.age = getRandom(60);
        user.sex = getRandom(100) > 50 ? 0 : 1
        // save
        await msg.save();
        let _msg = this.userSrv.createMsg()
        await _msg.save()
        user.message = [msg, _msg]
        await user.save()
        return "Success";
    }

    @Get("/users/:id")
    async getOne(@Param("id") id: number) {
        return await User.find({ relations: ["message"], where: { id: id } });
    }

    @Post("/users")
    post(@Body() user: any) {
        return "Saving user...";
    }

    @Put("/users/:id")
    put(@Param("id") id: number, @Body() user: any) {
        return "Updating a user...";
    }

    @Delete("/users/:id")
    remove(@Param("id") id: number) {
        return "Removing user...";
    }
    @Get('/test/:id')
    async test(@Param('id') id) {
        return await User.find({
            where: { id: id },
            loadRelationIds: true,
            relations:['message']
        })
    }

}