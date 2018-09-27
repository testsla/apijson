import { getConnectionManager, EntityManager, BaseEntity, Repository, getRepository, Entity } from 'typeorm'
import { Observable, of, from } from 'rxjs'
import { map } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { User } from '../entity/User';
const COLUMN = '@column'
const ORDER = '@order'

const GetColumn = (where: any) => {
    let result = where[COLUMN]
    if (result) {
        result = result.split(',')
        Reflect.deleteProperty(where, COLUMN)
        return result
    } else {
        return null
    }
}
const GetOrder = (where: any) => {
    let result = where[ORDER]
    if (result) {
        result = result.split(',')
        Reflect.deleteProperty(where, ORDER)
        let _result = {}
        for (let item of result) {
            if (item.endsWith('+')) {
                _result[item.replace('+', '')] = 'ASC'
            } else if (item.endsWith('-')) {
                _result[item.replace('-', '')] = 'DESC'
            } else {
                _result[item] = 'ASC'
            }
        }
        return _result
    } else {
        return null
    }

}
const GetTableData = async (tableName: string, page: number = 0, count: number = 1, where: any = {}) => {
    let repository: Repository<any>
    let result
    try {
        repository = getRepository(tableName)
        let select = GetColumn(where)
        let order = GetOrder(where)
        result = await repository.find({
            where: {
                ...where
            },
            take: page,
            skip: page * count,
            select,
            order,
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
        let select = GetColumn(where)
        result = await repository.findOne({
            where: {
                ...where
            },
            select
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
                temp = temp ? temp.map(item => ({
                    [tableName]: item
                })) : []
                for (let _temp of temp) {
                    for (let i = 1; i < tables.length; i++) {
                        let tableName: string = tables[i]
                        if (tableName.endsWith('[]')) {
                            const _tableName = tableName.split('[]')[0]
                            _temp[tableName] = await GetTableData(_tableName, page, count, where[i])
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
    return await A(APIJSON)
}