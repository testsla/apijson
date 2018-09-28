
import {Service, Container} from "typedi";

@Service()
export class UserService{
    test(){
        console.log('test success')
    }
}