import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input,Icon,Checkbox,Col, Modal } from 'antd'
import { config, audioVolume } from 'utils'
import styles from './index.less'
import {  Link, routerRedux } from 'dva/router'
import erweima from '../../public/images/login/erweima.jpg'

const FormItem = Form.Item
const Login = ({
  loading,
  dispatch,
  login,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
  app
}) => {
  const { codeImg } = login;
  const { musicStatus_bg, musicStatus } = app;
  function handleOk () {
    // validateFieldsAndScroll((errors, values) => {
    //   if (errors) {
    //     return
    //   }

      dispatch({ type: 'login/login' })
    // })
  }

  let querGetValidCode = (e) => {
    var num=Math.ceil(Math.random()*10);//生成一个随机数（防止缓存）
    var  newCodeImg=codeImg+'?'+num;
    dispatch({type:"login/updateState",payload:{codeImg:newCodeImg}})
  }

  const scatterAuthorizeContent = (
    <div className={styles.content}>
      <Button className={styles.authorize}></Button>
      <Button className={styles.cancel}></Button>
    </div>
  )

  let togglePlayerStatus = () => {
    dispatch({
      type: 'app/updateState',
      payload: {
        musicStatus: !musicStatus
      }
    })
  }

  let togglePlayerStatus_bg = () => {
    dispatch({
      type: 'app/updateState',
      payload: {
        musicStatus_bg: !musicStatus_bg
      }
    })
  }
  let showErweima =() => {
    this.setState({

    })
  }

  return (
    <div className={styles.sceneMask}>
      <div className={styles.sceneBox}>

        <div className={styles.authorizeConfirm}>
          <div className={styles.detailDesc}>
           {/*<p> Scatter Desktop是一款支持EOS智能合约签名的桌面钱包， 可以访问Scatter的官方github进行下载并安装：*/}
            {/*<a href="https://github.com/GetScatter/ScatterDesktop/releases" target="_blank">*/}
                {/*点击这里*/}
              {/*</a>*/}
           {/*</p>*/}

            官方提示：<br />
            {/*<p>1、抵押适量的CPU(5EOS), RAM(0.4EOS)和NET(0.4EOS）以顺利进行游戏。</p>*/}
            <p>1、出于安全考虑,不要往游戏账户内充值大量的EOS。</p>
            <p className= {styles.te}>2、没有EOS账户的玩家可以添加微信号:<a>Pandafunx</a> 进行注册并获得相应游戏教程。
              <img className={styles.erweima} src={erweima} />
            </p>
            <span className={styles.englishDesc}>Good Luck & Have Fun</span>
          </div>
          <div className={styles.content}>
            <Button className={styles.authorize} onClick={handleOk} loading={loading.effects.login}></Button>
            <Button className={styles.cancel} onClick={() => dispatch({ type: 'login/linkToHome' })}></Button>
          </div>
        </div>
      </div>

    </div>
  )

}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  login: PropTypes.object,
}

export default connect(({login, loading, app }) => ({login,loading, app }))(Form.create()(Login))
