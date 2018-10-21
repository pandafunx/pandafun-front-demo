/* global window */
import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd'
import { YQL, CORS } from './config'
import { routerRedux } from 'dva/router';

import store from '../index'

const fetch = (options) => {
  let {
    method = 'get',
    data = {},
    fetchType,
    url,
    config={
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },},
  } = options
  const cloneData =Object.assign(data? lodash.cloneDeep(data):{},{token:localStorage.getItem('token')}) 
  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    //message.error(e.message)
    return Promise.reject(e)
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
    data = null
  }
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData,config)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

const errorModal = (error) => {
  const modal = Modal.error({
    content: error && error.msg ? error.msg : '',
    className: error && error.msg ? 'reqErrMsg reqErrMsg_info' : 'reqErrMsg',
  });
   setTimeout(() => modal.destroy(), 2000);
}

export default function request (options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }
  const { dispatch } = store;
  return fetch(options).then((response) => {
    const { data } = response
      if(data.code == 1){
        return Promise.resolve({
          success: true,
          message: data.msg,
          code:data.code,
          ...data
        })
      }else if(data.code == 305){
        if (window.location.href.split('?from=')[1]) {
          dispatch(routerRedux.push(`/login?from=${window.location.href.split('?from=')[1]}`))
        } else {
          dispatch(routerRedux.push(`/login?from=${window.location.href.split('/')[window.location.href.split('/').length -1]}`))
        }
      }else if(data.code == 500){
        if(data.error){
          switch (data.error.code) {
            case 3050003:
                errorModal({msg:'EOS交易金额错误，请稍后再试'})
              break;
            case 3080001:
                errorModal({msg:'EOS内存超限'})
              break;
            case 3080002:
                errorModal({msg:'EOS带宽资源不足'})
              break;
            case 3080004:
                errorModal({msg:'EOS CPU资源不足'})
              break;
          
            default:
                errorModal(data)
              break;
          }
        }else{
          errorModal(data)
        }
        
       // message.error(data.msg)
        
      }else{
        errorModal(data)
      }
      // return Promise.reject(data)
    }).catch((error) => {
      errorModal(error)
  })
}
