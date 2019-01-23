import { type } from "os";

const test = `
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
    User(id:[12,15,32]):SuperUser {
        name
    }
    User(id:![110,330..990]):OtherUser{
        name,
        age,
    }
    User(name:/^J/):LikeUser{
        name:HaveJ
    }
    User(desc:"还是你",~desc:"keyword"):User{
        desc { contain:"keyword" } | String,

    }
`
const test_01 = {

    input: `
        User {
            id,
            name
        }
    `,
    output:[
        { type:"name" , value:"User" },
        { type:"braces" , value:"{" },
        { type:"name" , value:"id" },
        { type:"comma" , value:"," },
        { type:"name" , value:"name" },
        { type:"braces" , value:"}" },
    ]
}

export { test_01 }