import { Controller, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Message } from "../entity/Message";

function getRandom(n: number) {
    return Math.floor(Math.random() * n)
}

@Controller()
export class UserController {

    @Get("/users")
    async getAll() {
        const user = new User();
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.age = Math.floor(Math.random() * 1000);
        debugger
        try {
            // await respoitory.save(user)
            let result = await user.save();
            let msg = new Message;
            msg.userId = result.id;
            msg.content = '史丹佛哈是东方红'.slice(getRandom(100), getRandom(100))
            await msg.save();
        } catch (error) {
            console.log(error)
        }
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