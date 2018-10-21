import { routerRedux } from 'dva/router';
import { login,querGetValidCode } from 'services/login';
import qs from 'querystring'
import { parse } from 'qs'
import { message, Modal } from 'antd'
export default {
    namespace:'login',
    state: {
        codeImg :"http://39.105.91.238/api/web/getValidCode",
        invitedCode:''
    },
    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(({ pathname,search }) => {
                if(search ){
                    var qsStr =qs.parse(search.split('?')[1])
                    console.log(window.location.href)
                }
              if (pathname === '/login') {
                dispatch({ type: 'updateState' ,payload:{invitedCode:qsStr?qsStr.invCode:''}})
              }
            })
          },
      },
    effects: {


        *login ({payload},{put,call,select}){
            const { locationQuery,eosIdentity,eosAccount,canClickLogin } = yield select(_ => _.app);
            const {invitedCode } = yield select(_ => _.login)
            if(!localStorage.getItem('accountName') ){
                const modal = Modal.error({
                    content:  '请刷新页面，进行授权',
                    className:  'reqErrMsg reqErrMsg_info',
                  });
                  setTimeout(() => modal.destroy(), 2000);
                return
            }

            // if(!canClickLogin){
            //     const modal = Modal.error({
            //         content:  '请稍后重新点击',
            //         className:  'reqErrMsg reqErrMsg_info',
            //       });
            //       setTimeout(() => modal.destroy(), 2000);
            //     return
            // }

            if(!eosAccount){
                const modal = Modal.error({
                    content:  '操作失败，请刷新页面重试',
                    className:  'reqErrMsg reqErrMsg_info',
                  });
                  setTimeout(() => modal.destroy(), 2000);
                return
            }

            const data =yield call(login, {identityVO:eosIdentity,eosAccountName:eosAccount.name,invitedCode:invitedCode});
            localStorage.removeItem('token')
            localStorage.removeItem('playerId')

            if(data.data.isGotGifts){
                Modal.info({
                    okText: '确定',
                    className: 'commonAlert',
                    content: '手机版震撼上线，登录礼包已领取，您可以在庄园查看详情。'
                })
            }



            if(data && data.code == 1){
                const { from } = locationQuery;
                yield put({type:'app/updateState',payload:{token:data.data.token,playerId:data.data.playerId}});
                localStorage.setItem('token',data.data.token);
                localStorage.setItem('playerId',data.data.playerId);
                if(from && from !== 'login' && from.split('?').length == 1){
                    yield put(routerRedux.push(from))
                }else{
                    // if (window.location.href.split('from')[1] && window.location.href.split('from')[1] !== 'login') {
                    //     yield put(routerRedux.push(`/${window.location.href.split('from')[1]}`));
                    // } else {
                        yield put(routerRedux.push('/mainscene'));
                    // }
                };
                yield put({
                    type: 'app/getEOSBalance',
                })
            }
        },
        * linkToHome({ payload }, { put }) {
            yield put(routerRedux.push('/mainscene'));
            yield put({
                type: 'app/getEOSBalance',
            })
        }
    },
    reducers: {
        updateState (state, { payload }) {
          return {
            ...state,
            ...payload,
          }
        },
    }
}
