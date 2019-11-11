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
      windowWidth: null,
      windowHeight: null,
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }
  componentDidMount() {
    const { windowWidth, windowHeight } = Taro.getSystemInfoSync()
    this.setState({
      windowWidth,
      windowHeight,
    })
  }
  shake() {
    const { count, animationList } = this.state
    const countList = [...Array(count)]
    const dices = countList.map(() => this.createRandomDiceText())
    this.setState(() => {
      return {
        dices,
        animationList: countList.map(() => this.createRandomStartAnimation()),
      }
    }, () => {
      this.setState(() => {
        return {
          animationList: animationList.map(ani => {
            return !ani && ani.export()
          })
        }
      }, () => {
        this.setState({
          animationList: countList.map(() => this.createRandomEndAnimation()),
        })
      })
    })
  }
  resetAnimation() {
    
  }
  createRandomEndAnimation() {
    const animate = Taro.createAnimation({
      timingFunction: 'ease'
    })
    const randomEndX = Math.random() * 500 - 200
    const randomEndY = Math.random() * 500 - 200
    animate
      .translate(randomEndX, randomEndY)
      .rotate(Math.random() * 540 - 360)
      .step({duration: 5000})
    return animate
  }
  createRandomStartAnimation() {
    const {
      windowWidth,
      windowHeight,
    } = this.state
    const animate = Taro.createAnimation()
    const randomStartX = (windowWidth + Math.random() * 10)
    const randomStartY = ((windowHeight / 2) + Math.random() * 10)
    animate
      .translate(randomStartX, randomStartY)
      .step({duration: 0})
    return animate
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
          value={count - 1}
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
