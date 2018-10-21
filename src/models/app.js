import { routerRedux } from 'dva/router'
import { parse } from 'qs'
/* 在webpack中配置文件别名直接引入 通常使用于工具函数*/
import config from 'config'
import { query, logout } from 'services/app'
import queryString from 'query-string'
import { message, Modal } from 'antd'

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

const { prefix, amount } = config
const Eos = require('eosjs')

// EOS 合约账号 用于对卖熊猫、香烛等等 进行签名
let eosCodeAccount = 'pandafuncode'

// pandafunhot1 用于收熊猫，香烛，茶，卷轴的购买收款
let eosHot1Account = 'pandafuncode'

//第二个热钱包 用来托管游历世界费用，其中购买铲子的手续费结束后由本账户发给pandafunhot1账户
let eosHot2Account = 'pandafunhot2'

const eosSystemAccount = { eosCodeAccount, eosHot1Account, eosHot2Account };


export default {
  namespace: 'app',
  state: {
    user: {},
    locationPathname: '',
    locationQuery: {},
    musicStatus: localStorage.getItem('musicStatus') == 'true' ? true : false,
    musicStatus_bg: localStorage.getItem('musicStatus') || false,
    canClickLogin: false,
    times: 0
  },
  subscriptions: {

    setupHistory({ dispatch, history }) {

        var tp = require('tp-eosjs');
        tp.getAppInfo().then();
            tp.getAppInfo().then(versionInfo => {
                if("android" == versionInfo.data.system){
                    if(versionInfo.data.version.replace('.','').replace('.','') < 50){
                        const modal = Modal.error({
                            content:  '请升级TokenPocket版本至0.5.0或更高版本',
                            className:  'reqErrMsg reqErrMsg_info' ,
                        });
                        setTimeout(() => modal.destroy(), 10000);
                        window.close();
                        return ;
                    }
                }else{
                    if(versionInfo.data.version.replace('.','').replace('.','') < 48){
                        const modal = Modal.error({
                            content:  '请升级TokenPocket版本至0.4.8或更高版本',
                            className:  'reqErrMsg reqErrMsg_info' ,
                        });
                        setTimeout(() => modal.destroy(), 10000);
                        window.close();
                        return ;
                    }
                }
            }).catch(error => {
               // alert("error")
                // alert(error)
            });

        let options = { initTimeout: 25000, linkTimeout: 35000 };

        ScatterJS.plugins( new ScatterEOS() );
        ScatterJS.scatter.connect("PandaFun").then(connected => {

        if (!connected) {
            // User does not have Scatter Desktop or Classic installed.
            const modal = Modal.error({
              content:  '请检查是否已安装Scatter桌面版本或Scatter浏览器插件',
              className:  'reqErrMsg reqErrMsg_info' ,
            });
            setTimeout(() => modal.destroy(), 4000);
            return false;
          }

          const scatter = ScatterJS.scatter;
        // It is good practice to take this off the window once you have
        // a reference to it.
        window.scatter = null;
          window.ScatterJS = null;

        // If you want to require a specific version of Scatter
        // scatter.requireVersion(4.0);


        if (true) {
          const chainId ='aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

            let protocols =  location.protocol;
            let protocol = "http";
            let port = 80;
            if('https:' === protocols){
                protocol = "https";
                port = 443;
            }
            const eosNetwork = {
            protocol: protocol,
            blockchain: 'eos',
            host: 'pandafun.io',//'127.0.0.1', // ( or null if endorsed chainId )
            port: port, // ( or n
              // ull if defaulting to 80 )
            chainId
          }
          //suggesct net work to user
          // scatter.suggestNetwork(eosNetwork).then(
          //   isAccept => {
          //     if (isAccept) {

            scatter.getIdentity({ accounts: [eosNetwork] }).then(
                  identity => {
                    //1. 用户授权完成后，获取用户的EOS帐号名字（12位长度），传给后台完成登录or注册操作操作
                    const account = identity.accounts.find(acc => acc.blockchain === 'eos');
                    //EOS参数，仅签名不广播交易
                    var eosOptions = {
                      broadcast: false,
                      //  chainId:"9b1897428e03c107aa16ec0d4a72f3594867d4bd3c9ca3363a1bb638a2e1f206"
                      chainId
                    }
                    //获取EOS instance
                    const eos = scatter.eos(eosNetwork, Eos, eosOptions, eosNetwork.protocol);

                    const requiredFields = {
                      accounts: [eosNetwork],
                    }
                    console.log(account)
                    if (account.name !== localStorage.getItem('accountName')) {
                      localStorage.setItem('accountName', account.name)
                      localStorage.removeItem('token')
                      localStorage.removeItem('playerId')
                    }

                    const pageScale = Math.floor(window.innerHeight / 768 * 10) / 10
                    dispatch({
                      type: 'updateState',
                      payload: {
                        eosIdentity: identity,
                        eosAccount: account,
                        scatter: scatter,
                        eos: eos,
                        Eos: Eos,
                        eosNetwork: eosNetwork,
                        eosOptions: eosOptions,
                        requiredFields: requiredFields,
                        amount,
                        pageScale: pageScale,
                        eosSystemAccount: eosSystemAccount,
                        chainId
                      },
                    })
                    if (window.location.href.split('/')[window.location.href.split('/').length - 1].search('login') < 0) {
                      dispatch({
                        type: 'getEOSBalance'
                      })
                    }

                  })
             // }
            //}
         // )
          //     .catch(error => {
          //     console.log(error);
          //     if(error.code == 423){
          //       const modal = Modal.error({
          //         content:  '请先解锁Scatter钱包',
          //         className:  'reqErrMsg reqErrMsg_info' ,
          //       });
          //       setTimeout(() => modal.destroy(), 4000);
          //     }else{
          //       const modal = Modal.error({
          //         content:  '未能正确获取Scatter授权账号信息，请检查Scatter是否已经解锁',
          //         className:  'reqErrMsg reqErrMsg_info' ,
          //       });
          //       setTimeout(() => modal.destroy(), 4000);
          //     }
          // })
        }

      })
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })

      })
    },
  },
  effects: {

  },
  reducers: {

  },
}
