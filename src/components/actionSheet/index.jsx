import Taro, { Component } from '@tarojs/taro'
import {
  View,
} from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class ActionSheet extends Component {
    onClose() {
        const { onActionClose } = this.props
        onActionClose(false)
    }
    render() {
        const { active } = this.props
        const menuContentLayerClass = 'action-container ' +
            (active ? 'action-container-active': '')
        return (
            <View className={menuContentLayerClass}>
                <View
                    onClick={this.onClose.bind(this)}
                    className='check-container-layer'
                ></View>
                <View className='check-container'>
                    <View
                        className='close-check-container-btn'
                        onClick={this.onClose.bind(this)}
                    ></View>
                    {this.props.children}
                </View>
            </View>
        )
    }
}

ActionSheet.defaultProps = {
    active: false,
    onActionClose: () => {},
}
ActionSheet.propTypes = {
    active: PropTypes.bool,
    onActionClose: PropTypes.func,
}
export default ActionSheet