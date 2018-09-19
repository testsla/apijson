import {Controller, Param, Body, Get, Post, Put, Delete} from "routing-controllers";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { ApiJson } from "../apijson/apijson";

@Controller()
export class ApiJsonController {
    @Post('/apijson')
    async apijson(@Body() body){
        return await ApiJson(body);
    }
}