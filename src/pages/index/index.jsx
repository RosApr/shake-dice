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
      diceW: 160,
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }
  componentDidMount() {
    const { windowWidth, windowHeight, pixelRatio } = Taro.getSystemInfoSync()
    const { diceW } = this.state
    this.setState({
      windowWidth,
      windowHeight,
      diceW: parseInt((2 / pixelRatio) * diceW),
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
    const randomEndPositionList = this.createRandomEndXY()
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
  createRandomEndXY() {
    const { diceW, windowWidth, windowHeight } = this.state
    const widthGrid = windowWidth / 3
    const heightGrid = windowHeight / 2
    const diceWidth = diceW
    return [...'012345'].map((val) => {
      const rX = parseInt(this.getRandomInRange((widthGrid - diceWidth/2) * .6, (widthGrid - diceWidth/2)))
      const rY = parseInt(this.getRandomInRange((heightGrid - diceWidth/2) * .6, (heightGrid - diceWidth/2)))
      if(val == 0) {
        return [rX, rY]
      } else if(val == 1) {
        return [rX + widthGrid * .8, rY]
      } else if(val == 2) {
        return [rX + widthGrid * 1.5, rY]
      } else if(val == 3) {
        return [rX, windowHeight - rY]
      } else if(val == 4) {
        return [rX + widthGrid  * .8, windowHeight - rY]
      } else if(val == 5) {
        return [rX + widthGrid * 1.5, windowHeight - rY]
      }
    })
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
            style={{width: , height: ,}}
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
