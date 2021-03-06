import Taro, { Component } from '@tarojs/taro'
import {
    View,
} from '@tarojs/components'
import './index.scss'
import PropTypes from 'prop-types'

class Dice extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    static options = {
        addGlobalClass: true,
    }
    createRandomDice() {
        const { text } = this.props
        if(text === 1){
          return (
            <View class="first-dice-comp dice-comp">
              <View class="pip-comp"></View>
            </View>
          )
        } else if(text === 2){
          return (
            <View class="second-dice-comp dice-comp">
              <View class="pip-comp"></View>
              <View class="pip-comp"></View>
            </View>
          )
        } else if(text === 3){
          return (
            <View class="third-dice-comp dice-comp">
              <View class="pip-comp"></View>
              <View class="pip-comp"></View>
              <View class="pip-comp"></View>
            </View>
          )
        } else if(text === 4){
          return (
            <View class="fourth-dice-comp dice-comp">
              <View class="column-comp">
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
              </View>
              <View class="column-comp">
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
              </View>
            </View>
          )
        } else if(text === 5){
          return (
            <View class="fifth-dice-comp dice-comp">
              <View class="column-comp">
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
              </View>
              <View class="column-comp">
                <View class="pip-comp"></View>
              </View>
              <View class="column-comp">
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
              </View>
            </View>
          )
        } else if(text === 6){
          return (
            <View class="sixth-dice-comp dice-comp">
              <View class="column-comp">
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
              </View>
              <View class="column-comp">
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
                <View class="pip-comp"></View>
              </View>
            </View>
          )
        }
    }
    render() {
        return (
            <View
              className='dice-container-comp'
            >
              {this.createRandomDice()}
            </View>
        )
    }
}
Dice.defaultProps = {
    text: 1,
}
Dice.propTypes = {
    text: PropTypes.number,
}
export default Dice