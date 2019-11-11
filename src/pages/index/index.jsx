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
      startPositionList: [],
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
    const { count, } = this.state
    const countList = [...Array(count)]
    const dices = countList.map(() => this.createRandomDiceText())
    this.setState(() => {
      return {
        dices,
        startPositionList: this.createRandomStartAnimation(countList),
        animationList: this.createRandomEndAnimation(countList),
      }
    }, () => {
      this.setState(() => {
        const { animationList, } = this.state
        return {
          animationList: animationList.map(ani => {
            return ani ? ani.export() : null
          })
        } 
      })
      // this.setState(() => {
      //   console.log('start ani')
      //   return {
      //     animationList: animationList.map(ani => {
      //       console.log(ani)
      //       return ani ? ani.export() : null
      //     })
      //   }
      // }, () => {
      //   this.setState(() => {
      //     return {
      //       animationList: this.createRandomEndAnimation(countList),
      //     }
      //   }, () => {
      //     this.setState(() => {
      //       console.log('end ani')
      //       return {
      //         animationList: animationList.map(ani => {
      //           console.log(ani)
      //           return ani ? ani.export() : null
      //         })
      //       } 
      //     })
      //   })
      // })
    })
  }
  resetAnimation() {
    
  }
  createRandomEndAnimation(dices = []) {
    const endXYList = this.createRandomEndXY()
    let randomPositionFlag = 5
    return dices.map(() => {
      const randomI = Math.round(Math.random() * randomPositionFlag)
      randomPositionFlag -= 1
      const endP = endXYList.splice(randomI, 1)[0]
      const animate = Taro.createAnimation({
        timingFunction: 'ease'
      })
      animate
        .translate(endP[0], endP[1])
        .rotate(Math.random() * 540 - 360)
        .step({duration: 5000})
      return animate
    })
  }
  createRandomEndXY() {
    const { diceW, windowWidth, windowHeight } = this.state
    const widthGrid = windowWidth / 3
    const heightGrid = windowHeight / 2
    return [...'012345'].map((val) => {
      const rX = parseInt(this.getRandomInRange((widthGrid - diceW/2) * .6, (widthGrid - diceW/2)))
      const rY = parseInt(this.getRandomInRange((heightGrid - diceW/2) * .6, (heightGrid - diceW/2)))
      if(val == 0) {
        return [rX, rY]
      } else if(val == 1) {
        return [parseInt(rX + widthGrid * .8), rY]
      } else if(val == 2) {
        return [parseInt(rX + widthGrid * 1.5), rY]
      } else if(val == 3) {
        return [rX, windowHeight - rY]
      } else if(val == 4) {
        return [parseInt(rX + widthGrid  * .8), windowHeight - rY]
      } else if(val == 5) {
        return [parseInt(rX + widthGrid * 1.5), windowHeight - rY]
      }
    })
  }
  createRandomStartAnimation(dices = []) {
    const {
      windowWidth,
      windowHeight,
    } = this.state
    // const animate = Taro.createAnimation()
    // const randomStartX = parseInt(windowWidth + Math.random() * 10)
    // const randomStartY = parseInt((windowHeight / 2) + Math.random() * 10)
    // animate
    //   .translate(randomStartX, randomStartY)
    //   .step({duration: 0})
    // return [randomStartX, randomStartY]
    return dices.map(() => {
      const randomStartX = parseInt(windowWidth + Math.random() * 10)
      const randomStartY = parseInt((windowHeight / 2) + Math.random() * 10)
      return [randomStartX, randomStartY]
    })
  }
  onPickerChange({detail: {value: checkedItemIndexInRange}}) {
    const { selectRange } = this.state
    this.setState({
      count: selectRange[checkedItemIndexInRange],
      dices: null
    })
  }
  getRandomInRange(min, max) {
    return +((Math.random() * ((max-1) - (min+1))).toFixed(2)) + (min+1);
  }
  createRandomDiceText() {
    return Math.round((Math.random() * 5)) + 1
  }
  render () {
    const { selectRange, count, dices, animationList, startPositionList, diceW } = this.state
    return (
      <View className='page' onClick={this.shake.bind(this)}>
        <Text>选择骰子数：</Text>
        <Picker mode='selector'
          range={selectRange}
          value={count - 1}
          onChange={this.onPickerChange.bind(this)}>
          <View>{count}</View>
        </Picker>
        {dices && dices.map((item, index) => {
          const style = {
            width: `${diceW}px`,
            height: `${diceW}px`,
            ...(Array.isArray(startPositionList[index]) ? ({
              transform: `translate(${startPositionList[index][0]}px, ${startPositionList[index][1]}px)`,
            }) : {}),
          }
          return (<View
            style={style}
            className='dice-container'
            onTransitionEnd={this.test.bind(this)}
            key={index}
            animation={animationList[index]}
          >
            <Dice text={item} />
          </View>)
        })}
      </View>
    )
  }
}
