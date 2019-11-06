import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Text,
  Picker
} from '@tarojs/components'
import './index.scss'
import Dice from '../../components/dice/index'
export default class Index extends Component {
  constructor() {
    this.state = {
      count: 3,
      selectRange: [...'123456'].map(item => +item),
      dices: null,
      animationList: [],
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }
  shake() {
    const { count, animationList } = this.state
    // this.resetAnimation()
    const countList = [...Array(count)]
    const dices = countList.map(() => this.createRandomDiceText())
    this.setState(() => {
      return {
        dices,
        animationList: countList.map(() => this.createRandomAnimation()),
      }
    }, () => {
    this.setState({
      animationList: animationList.map(ani => ani ? ani.export() : null)
    })
    })
  }
  resetAnimation() {
    const { animationList } = this.state
    this.setState({
      animationList: animationList.map(ani => {
        console.log(ani)
        if(ani) {
          ani.left('100%').top('20%').step({duration: 0})
          return ani.export()
        }
        return null
      })
    })
  }
  createRandomAnimation() {
    const animate = Taro.createAnimation()
    animate.left('20%').top('50%').rotate(Math.random() * 540 - 360).step()
    return animate
    // this.setState({
    //     ani: animate
    // })
    // setTimeout(() => {
    //     this.setState({ani: animate.export()})
    // }, 50)
  }
  onPickerChange({detail: {value: checkedItemIndexInRange}}) {
    const { selectRange } = this.state
    this.setState({
      count: selectRange[checkedItemIndexInRange],
      dices: null
    })
  }
  createRandomDiceText() {
    return Math.round((Math.random() * 5)) + 1
  }
  render () {
    const { selectRange, count, dices, animationList } = this.state
    return (
      <View className='page' onClick={this.shake.bind(this)}>
        <Text>选择骰子数：</Text>
        <Picker mode='selector'
          range={selectRange}
          onChange={this.onPickerChange.bind(this)}>
          <View>{count}</View>
        </Picker>
        {dices && dices.map((item, index) => (
          <View className='dice-container' key={index} animation={animationList[index]}>
            <Dice text={item} />
          </View>
        ))}
      </View>
    )
  }
}
