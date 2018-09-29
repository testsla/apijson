import { getConnectionManager, EntityManager, BaseEntity, Repository, getRepository, Entity } from 'typeorm'
import { Observable, of, from } from 'rxjs'
import { map } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { User } from '../entity/User';
const COLUMN = '@column'
const ORDER = '@order'
const RELATION = '@relation'

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
const GetRelation = (where: any, thisItem: any) => {
    if (!thisItem) {
        return
    }
    for (let prop in where) {
        if (prop.endsWith('@')) {
            if (where[prop].startsWith('/')) {
                let arr = where[prop].split('/').filter(item => item)
                if (arr && arr.length) {
                    let _id = Object.assign({}, thisItem);
                    for (let _prop of arr) {
                        if (_prop.endsWith('Id')) {
                            _prop = _prop.replace('Id', '')
                        }
                        _id = _id[_prop]
                    }
                    where[prop.replace('@', '')] = _id;
                }
            }
            Reflect.deleteProperty(where, prop)
        }
    }
}
const GetRelations = (where: { [key: string]: any }) => {
    let result = where[RELATION]
    if (result) {
        result = result.map(item => item.toLowerCase())
        Reflect.deleteProperty(where, RELATION)
        return result
    } else {
        return null
    }
}
/**
 * 
 * @param tableName 
 * @param page 
 * @param count 
 * @param where 
 * @param thisItem 该数据所在的json{}
 */
const GetTableData = async (tableName: string, page: number = 0, count: number = 1, where: any = {}, thisItem?: any) => {
    let repository: Repository<any>
    let result
    try {
        repository = getRepository(tableName)
        let select = GetColumn(where)
        let order = GetOrder(where)
        let relation = GetRelation(where, thisItem)
        let relations = GetRelations(where)
        let loadRelationIds = relations ? null : { disableMixedMap: false }
        // console.log(where)
        result = await repository.find({
            where: {
                ...where
            },
            take: page,
            skip: page * count,
            select,
            order,
            loadRelationIds,
            relations
        })
    } catch (error) {

    }
    return result;
}
const GetFirstData = async (tableName: string, where: any = {}, thisItem?: any) => {
    let repository: Repository<any>
    let result
    try {
        repository = getRepository(tableName)
        let select = GetColumn(where)
        let _relation = GetRelation(where, thisItem)
        let relations = GetRelations(where)
        let loadRelationIds = relations ? null : { disableMixedMap: false }
        result = await repository.findOne({
            where: {
                ...where
            },
            select,
            loadRelationIds,
            relations
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
                            _temp[tableName] = await GetTableData(_tableName, page, count, where[i], _temp)
                        } else {
                            _temp[tableName] = await GetFirstData(tableName, where[i], _temp)
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