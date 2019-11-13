import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Text,
} from '@tarojs/components'
import PropTypes from 'prop-types'
import { DICE_TYPE, COLOR_TYPE } from '../../constants.js'
import './index.scss'

class CheckItemList extends Component {
    onChecked(current, type) {
        const { onItemClick } = this.props
        onItemClick(current, type)
    }
    render() {
        const { list, listType, active } = this.props
        return (
            <View className='item-list'>
            {
                list.map((item) => {
                    const style = (listType === COLOR_TYPE ? {color: item} : {})
                    const isCheckClass = 'check ' + (item === active ? 'check-active' : '')
                    return (
                        <View
                            key={item}
                            className='item'
                            onClick={this.onChecked.bind(this, item, listType)}
                        >
                            <Text className='label' style={style}>
                                {type === DICE_TYPE ? `${item}个` : item}
                            </Text>
                            <Text className={isCheckClass}>✔</Text>
                        </View>
                    )
                })
            }
            </View>
        )
    }
}

CheckItemList.defaultProps = {
    list: [],
    onItemClick: () => {},
    listType: '',
    active: '',
}
CheckItemList.propTypes = {
    list: PropTypes.array,
    onItemClick: PropTypes.func,
    listType: PropTypes.string,
    active: PropTypes.any,
}
export default CheckItemList