import React from 'react';
import { Modal } from 'antd';
import loadingUrl from '../../public/images/common/loading.gif';
import styles from './index.less'
import PropTypes from 'prop-types'

const Loading = ({ visible }) => {
    return (
        <div>
            {visible ?
                <div className={styles.loadingModal}>
                    <div className={styles.loadingContent}>
                        <img src={loadingUrl} />
                    </div>
                </div>
            : null}
        </div>
    )
}
Loading.PropTypes = {
    visible: PropTypes.bool
}

export default Loading