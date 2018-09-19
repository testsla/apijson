import { getConnectionManager, EntityManager, BaseEntity, Repository, getRepository, Entity } from 'typeorm'
import { Observable, of, from} from 'rxjs'
import { map } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
export const ApiJson = async (APIJSON) => {
    let RESULT = APIJSON
    const A = async (apijson: Object, isArray = false) => {
        // let struct = {}
        for (let prop in apijson) {
            if (prop.trim().toLocaleLowerCase().endsWith('[]')) {
                let struct = Object.assign({}, apijson[prop])
                let result = []
                for (let prop in struct) {
                    let repository: Repository<any>;
                    try {
                        repository = getRepository(prop)
                       
                        if (result.length) {
                            from(result).pipe(
                                map(async x => {
                                    x[prop] = await repository.findOne({
                                        ...struct[prop]
                                    })
                                    console.log(result)
                                    return x
                                })
                            ).subscribe()
                        } else {
                            let _result = await repository.find({
                                ...struct[prop]
                            })
                            from(_result).pipe(
                                map(x => {
                                    result.push({
                                        [prop]: x
                                    })
                                    return x
                                })
                            ).subscribe()
                        }
                    } catch (error) {

                    }
                }
                console.log(result)
                apijson[prop] = result
            } else {
                // struct[prop] = apijson[prop]
            }
        }
        // if (isArray) {
        //     apijson = new Array()
        // }
        // for (let prop in struct) {
        //     let repository: Repository<any>;
        //     try {
        //         repository = getRepository(prop)
        //         if (isArray) {
        //             let result = await repository.find({
        //                 ...apijson[prop]
        //             })
        //             apijson[prop]
        //         }
        //     } catch (error) {

        //     }
        // }

        return RESULT
    }
    return await A(APIJSON)
}