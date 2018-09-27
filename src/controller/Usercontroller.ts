import { Controller, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Message } from "../entity/Message";
const MockJs = require('mockjs');
const story = require('./txt');

function getRandom(n: number) {
    return Math.floor(Math.random() * n)
}

@Controller()
export class UserController {

    @Get("/users")
    async getAll() {
        const user = new User();
        const msg = new Message();
        user.firstName = MockJs.Random.first();
        user.lastName = MockJs.Random.last();
        user.cName = MockJs.Random.cname() + MockJs.Random.cfirst();
        user.age = getRandom(60);
        user.sex = getRandom(100) > 50 ? 0 : 1;
        const _user = await user.save();
        msg.userId = _user.id;
        const start = getRandom(story.length - 200)
        msg.content = story.slice(start, start + 200);
        await msg.save()
        return "This action returns all users";
    }

    @Get("/users/:id")
    getOne(@Param("id") id: number) {
        return "This action returns user #" + id;
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

}