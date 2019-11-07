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
      style: {},
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }
  shake() {
    const { count, animationList } = this.state
    const countList = [...Array(count)]
    const dices = countList.map(() => this.createRandomDiceText())
    this.setState(() => {
      return {
        dices,
        animationList: countList.map(() => this.createRandomAnimation()),
      }
    }, () => {
      this.setState({
        animationList: animationList.map(ani => {
          console.log(ani)
          return ani ? ani.export() : null
        })
      })
    })
  }
  resetAnimation() {
    
  }
  createRandomAnimation() {
    const animate = Taro.createAnimation({
      timingFunction: 'ease-in'
    })
    // animate
    //   .translate(-10, -10)
    //   .rotate(1)
    //   .step({duration: 3000})
    //   .translate(Math.random() * 500 - 200, Math.random() * 500 - 200)
    //   .rotate(Math.random() * 540 - 360)
    //   .step({duration: 5000})
    animate
      .translate(Math.random() * 500 - 200, Math.random() * 500 - 200)
      .rotate(Math.random() * 540 - 360)
      .step({duration: 5000})
      .translate(-10, -10)
      .rotate(0)
      .step({duration: 3000})
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
  test() {
    console.log('end')
  }
  render () {
    const { selectRange, count, dices, animationList, style } = this.state
    return (
      <View className='page' onClick={this.shake.bind(this)}>
        <Text>选择骰子数：</Text>
        <Picker mode='selector'
          range={selectRange}
          onChange={this.onPickerChange.bind(this)}>
          <View>{count}</View>
        </Picker>
        {dices && dices.map((item, index) => (
          <View
            className='dice-container'
            onTransitionEnd={this.test.bind(this)}
            key={index}
            animation={animationList[index]}
            style={style}
          >
            <Dice text={item} />
          </View>
        ))}
        {/* <Dice text={1} />
        <Dice text={2} />
        <Dice text={3} />
        <Dice text={4} />
        <Dice text={5} />
        <Dice text={6} /> */}
      </View>
    )
  }
}
