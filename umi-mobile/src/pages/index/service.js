import { request } from '../../util/request';

export async function queryMoments() {
    return request('/api/getDynamic')
} 

export async function getAllMessages() {
    return request('/api/getAllMessages')
} 