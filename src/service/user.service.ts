
import {Service, Container} from "typedi";
import { getRandom } from "../util";
import { plainToClass } from "class-transformer";
import { User } from "../entity/User";

const MockJs = require('mockjs');

@Service()
export class UserService{
    test(){
        console.log('test success')
    }
    createUserJson(){
        let user;
        user.firstName = MockJs.Random.first();
        user.lastName = MockJs.Random.last();
        user.cName = MockJs.Random.cname() + MockJs.Random.cfirst();
        user.age = getRandom(60);
        user.sex = getRandom(100) > 50 ? 0 : 1;
        return user;
    }
    createUser(){
        return plainToClass(this.createUserJson(),User)
    }
}