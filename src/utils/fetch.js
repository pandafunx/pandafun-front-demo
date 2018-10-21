import request from './request';
const APIV1 = '/api'
const APIV2 = '/api/v2'

module.exports =  async function fetch(url, type, data) {
    return request({
        url: APIV1 + url,
        method: type,
        data
    })
}
