import { CONSTANT } from './const';
import { User } from '../entity/User';
import { async } from 'rxjs/internal/scheduler/async';
import { getRepository } from 'typeorm';
declare let format;
const design = `
    [] ($count:10, $page:1):UserInfoList {
        User() {
            id:Userid | Number,
            date | Moment('YYYY-MM-DD') | ASC(1),
            age | String | ASC(2), 
        }
        Moment[](useId@:/User/id) {
            msg,
            created | DESC
        }
    }
    User[](id:[12,15,32]):SuperUser {
        name
    }
    []:SuperUser {
        User {
            name,
            id { &:[12,15,32] }
        }
        Message ( userId@: /User/id) {
           
        }
    }
    User[](id:![110,330..990]):OtherUser{
        id { &:![110,330..990] },
        name,
        age,
    }
    User(name:/^J/):LikeUser{
        name:HaveJ,
        #或者 name:HaveJ { &: /^J/ } 
    }
    User(desc:"还是你",desc:~"keyword"):SpecialUser{
        desc { &:~keyword } | String,
        [Message],                        #重名并不属于数据库
        Message(userId@:/id):UserMessage {
                             #/id 中的/ 表示上一层中的id 
        }
    }
    User(id:1){
        #当info为json时候
        info:infoJson { address | String, position | String.Split(,) } | Json ,
        #最顶层
        Message[](userId@:LikeUser/id) {
        }
    }
`
const test_01 = {

    input: `
        User {
            id,
            name
        }
    `,
    tokens: [
        { type: CONSTANT.LETTER, value: "User" },
        { type: CONSTANT.SYMBOL_BRACES_FRONT, value: "{" },
        { type: CONSTANT.LETTER, value: "id" },
        { type: CONSTANT.SYMBOL_COMMA, value: "," },
        { type: CONSTANT.LETTER, value: "name" },
        { type: CONSTANT.SYMBOL_BRACES_REAR, value: "}" },
    ],
    ast: {
        type: CONSTANT.PROGRAM,
        body: [{
            type: CONSTANT.FIELD_ENITY,
            name: "User",
            [CONSTANT.SELECTIONS]: [{
                type: CONSTANT.FIELD_COLUMN,
                name: "id"
            }, {
                type: CONSTANT.FIELD_COLUMN,
                name: "name"
            }]
        }]
    },
    newAst: {
        type: CONSTANT.PROGRAM,
        body: [{
            type: CONSTANT.QUERY_DEFINITION,
            expression: {
                type: CONSTANT.FIELD,
                queryType: {
                    type: CONSTANT.FIELD_ENITY,
                    name: 'User'
                },
                [CONSTANT.SELECTIONS]: [{
                    type: CONSTANT.FIELD_COLUMN,
                    value: 'id'
                }, {
                    type: CONSTANT.FIELD_COLUMN,
                    value: 'name'
                }],
                arguments: []
            }
        }]
    },
    run: [
        {
            func: async () => await getRepository("User").findOne(),
            entity: "User",
            // alias: "User",
            columns: ["id", "name"],
            // filter: [
            //     {
            //         columns: "name",
            //         func: data => data.split('')
            //     }
            // ],
            // children: [{
            //     func: async () => await getRepository("User").findOne(),
            //     entity: "User",
            //     alias: "User",
            //     columns: ["id", "name"],
            //     filter: [
            //         {
            //             columns: "name",
            //             func: data => data.split('')
            //         }
            //     ],
            // }]
        }
    ],
    output: {
        User: {
            id: 1,
            name: "username",
            User: {
                id: 1,
                name: "username"
            }
        }
    }
}

export { test_01 }