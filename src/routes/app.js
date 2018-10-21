import NProgress from 'nprogress';
import PropTypes from 'prop-types';
// import '../utils/rem'
import {connect} from 'dva';
import {Layout, Loader} from 'components';
import {Modal} from 'antd';
import {classnames, config} from 'utils';
import {Helmet} from 'react-helmet'; //页面共同header
import {withRouter} from 'dva/router';
import LoadingModal from '../components/LoadingModal';
import '../themes/index.less';
import './app.less'

const {prefix, openPages} = config;

const {styles} = Layout;
let lastHref;
const App = ({children, dispatch, app, loading, location}) => {
    let {pathname} = location;
    const {iconFontJS, iconFontCSS, logo} = config
    const {musicUrl, musicStatus, musicStatus_bg, eosBalance, times} = app;
    const href = window.location.href;
    if (lastHref !== href) {
        NProgress.start()
        if (!loading.global) {
            NProgress.done()
            lastHref = href
        }
    }

    if (openPages && openPages.includes(pathname)) {
        return (
            <div>
                <Loader fullScreen spinning={loading.effects['app/query']}/>
                {children}
            </div>
        )
    }

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

    let ml = 0
    if (window.innerWidth > 1280 && window.innerWidth < 1920) {
        ml = `${-(1920 - window.innerWidth) / 2}px`
    } else if (window.innerWidth <= 1280) {
        ml = `${-(1280 - window.innerWidth) / 2 + 40}px`
    }

    const htmlStyle = {width: '100%', height: '100%', marginBottom: 0};

    //--创建触摸监听，当浏览器打开页面时，触摸屏幕触发事件，进行音频播放
    document.addEventListener('touchstart', function () {
        function audioAutoPlay() {
            var audio = document.getElementById('audio');
            audio && audio.play();
            dispatch({
                type: 'app/updateState',
                payload: {
                    times: 1
                }
            })
        }

        if (!times) {
            audioAutoPlay();
        }
    });

    document.addEventListener('visibilitychange', function () {
        var audio = document.querySelector('audio');
        if (document.hidden) {
            audio.pause();
        } else {
            audio.play();
        }
    })

    const showHelpModal = () => {
        if (!document.getElementsByClassName("helpModal")[0]) {
            Modal.confirm({
                className: 'helpModal',
                content: <div className="helpContent">
                    <div className="title">------------------养成部分-----------------------</div>
                    <div>1. 观音庙：在此使用香烛有几率产出高级熊猫</div>
                    <div>2. 冥想峰：在此使用静心茶有几率更换熊猫技能</div>
                    <div>3. 武道场：在此使用功夫卷轴有几率提升技能等级</div>
                    <div className="title">------------------个人信息与交易--------------</div>
                    <div>4. 庄园：在此查看自己的所有熊猫及道具</div>
                    <div>5. 宠物市集：在此交易高级熊猫及购买普通熊猫</div>
                    <div className="title">-----------------玩家对战---------------------</div>
                    <div>6. 游历世界：玩家投入EOS后携带熊猫参与游戏，每盘游戏三名玩家，胜者获得游戏奖励</div>
                    <div>
                        注：无限loading可能由于您使用了EOS账号owner权限造成， 操作失败可能由于没有cpu造成。任何疑问，可以添加小助手微信(pandafunx)获得帮助。
                    </div>
                </div>
            })
        }
    }

    return (
        <div style={htmlStyle}>
            <Loader fullScreen spinning={loading.effects['app/query']}/>
            <div className={musicStatus ? 'music_btn music_btn_off' : 'music_btn'} onClick={() => togglePlayerStatus()}>
                <audio autoPlay id="audio" muted={musicStatus} loop src={musicUrl}></audio>
            </div>
            {eosBalance ? <div className="accountMoney" style={{marginLeft: ml}}>
                余额：{Number(String(eosBalance).substring(0, String(eosBalance).length - 3)).toFixed(4)} EOS</div> : null}
            <div className="help"><span onClick={() => showHelpModal()}>帮助</span></div>
            {/* <Modal></Modal> */}
            <Helmet>
                <title>PandaFun-第一款EOS区块链游戏</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="icon" href={logo} type="image/x-icon"/>
                {iconFontJS && <script src={iconFontJS}/>}
                {iconFontCSS && <link rel="stylesheet" href={iconFontCSS}/>}
            </Helmet>
            <div className={styles.container}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <LoadingModal visible={loading.global && !loading.effects.hasOwnProperty('game/wsOnmessage')}/>
            {/* {window.location.href.split('/')[window.location.href.split('/').length - 1] !== 'game' ? <LoadingModal visible={loading.global} /> : null} */}
        </div>
    )
}

App.PropTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object
}
export default withRouter(connect(({app, loading}) => ({app, loading}))(App))
