
import { Service, Container } from "typedi";
import { getRandom } from "../util";
const story = require('../controller/txt')
import { plainToClass } from "class-transformer";
import { User } from "../entity/User";
import { Message } from "../entity/Message";

const MockJs = require('mockjs');

@Service()
export class UserService {
    test() {
        console.log('test success')
    }
    createUserJson() {
        let user;
        user.firstName = MockJs.Random.first();
        user.lastName = MockJs.Random.last();
        user.cName = MockJs.Random.cname() + MockJs.Random.cfirst();
        user.age = getRandom(60);
        user.sex = getRandom(100) > 50 ? 0 : 1;
        return user;
    }
    createUser() {
        return plainToClass(this.createUserJson(), User)
    }
    createMsg() {
        let msg = new Message

        const start = getRandom(story.length - 200);
        msg.content = story.slice(start, start + 200);
        return msg
    }
}