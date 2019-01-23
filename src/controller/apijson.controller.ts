import {Controller, Param, Body, Get, Post, Put, Delete, Render} from "routing-controllers";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { ApiJson } from "../apijson/apijson";
import { async } from "rxjs/internal/scheduler/async";

@Controller()
export class ApiJsonController {
    @Post('/apijson')
    async apijson(@Body() body){
        return await ApiJson(body);
    }
    @Get('/apijson')
    @Render('index.html')
    async apijsonHtml(){
        return {}
    }
}