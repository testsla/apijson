import { getConnectionManager, EntityManager, BaseEntity, Repository, getRepository, Entity } from 'typeorm'
import { Observable, of, from } from 'rxjs'
import { map } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { User } from '../entity/User';
const GetTableData = async (tableName: string, page: number = 0, count: number = 1, where: any = {}) => {
    let repository: Repository<any>
    let result
    try {
        repository = getRepository(tableName)
        result = await repository.find({
            where: {
                ...where
            },
            take: page,
            skip: page * count,
        })
    } catch (error) {

    }
    return result;
}
const GetFirstData = async (tableName: string, where: any = {}) => {
    let repository: Repository<any>
    let result
    try {
        repository = getRepository(tableName)
        result = await repository.findOne({
            where: {
                ...where
            }
        })
    } catch (error) {

    }
    return result;
}
const A = async (apijson: Object, isArray = false) => {
    let result = {}
    let page = 0, count = 1, query = 0, total = 0;
    for (let prop in apijson) {
        prop = prop.trim();
        let item = apijson[prop]
        let tables = [], where = []

        if (prop == '[]') {
            page = item.page ? item.page : page
            count = item.count ? item.count : count
            query = item.query ? item.query : query
            Reflect.deleteProperty(item, 'page')
            Reflect.deleteProperty(item, 'count')
            Reflect.deleteProperty(item, 'query')
            for (let _prop in item) {
                tables.push(_prop)
                where.push(item[_prop])
            }
            if (tables.length) {
                let tableName = tables[0]
                let temp = await GetTableData(tableName, page, count, where[0])
                temp = temp.map(item => ({
                    [tableName]: item
                }))
                for (let _temp of temp) {
                    for (let i = 1; i < tables.length; i++) {
                        let tableName: string = tables[i]
                        if (tableName.endsWith('[]')) {
                            tableName = tableName.split('[]')[0]
                            _temp[tableName] = await GetTableData(tableName, page, count, where[i])
                        } else {
                            _temp[tableName] = await GetFirstData(tableName, where[i])
                        }
                    }
                }
                result[prop] = temp
            }
        }

    }
    return result
}
export const ApiJson = async (APIJSON) => {
    // return await User.find({
    //     take: 5,
    //     skip: 1
    // })
    return await A(APIJSON)
}