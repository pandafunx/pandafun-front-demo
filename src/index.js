import { message, Modal } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'
import 'eosjs';

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError(error) {
    //message.error(error)
    // Modal.info({
    //   okText: '确定',
    //   className: 'commonAlert commonFailModal',
    //   content: '操作失败，请重试',
    //   onOk: () => {
    //   }
    // })
    if(error.message.indexOf("Cannot read property 'data' ") > -1) return;
    const modal = Modal.error({
      content: error && error.msg ? error.msg : '',
      className: error && error.msg ? 'reqErrMsg reqErrMsg_info' : 'reqErrMsg',
    });
    setTimeout(() => modal.destroy(), 2000);
  },
})

// 2. Model
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')

export default app._store;
