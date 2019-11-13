import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Text,
} from '@tarojs/components'
import './index.scss'
import Dice from '../../components/dice/index'
import CheckItemList from '../../components/checkItemList/index'
import audioSrc from '../../assets/dice.mp3'
import bg from '../../assets/bg.jpg'
import { DICE_TYPE, COLOR_TYPE } from '../../constants.js'
export default class Index extends Component {
  constructor() {
    this.state = {
      diceRange: [...'123456'].map(item => +item),
      dices: null,
      animationList: [],
      windowWidth: null,
      windowHeight: null,
      diceW: 160,
      isActive: false,
      audioInstance: null,
      isActiveShake: false,
      colorRange: ['grey', 'orange', 'red'],
      colorActive: 'grey',
      diceActive: 3,
      isShowMenuContent: false,
    }
  }
  config = {
    navigationBarTitleText: '嗨翻骰子'
  }
  componentDidMount() {
    const { windowWidth, windowHeight, pixelRatio, } = Taro.getSystemInfoSync()
    const { diceW, } = this.state
    this.setState({
      windowWidth,
      windowHeight,
      diceW: parseInt((2 / pixelRatio) * diceW),
    })
    this.initAudio(audioSrc, false)
    Taro.startAccelerometer()
    Taro.onAccelerometerChange((config) => {
      const { isActiveShake } = this.state
      const isShake = (config.x > 1)
        || (config.z > 1)
        || (config.y > 1)
      if(isShake && !isActiveShake) {
        this.setState({
          isActiveShake: true,
        })
        this.shake()
      }
    })
  }
  check(item, type) {
    const state = {
      [type === DICE_TYPE ? 'diceActive' : 'colorActive'] : item,
      dices: null
    }
    this.setState(state)
  }
  shake() {
    const { diceActive, audioInstance } = this.state
    const countList = [...Array(diceActive)]
    const dices = countList.map(() => this.createRandomDiceText())
    this.setState(() => {
      if(audioInstance) {
        audioInstance.seek(0)
      }
      return {
        dices,
        isActive: true,
        animationList: this.createRandomStartAnimation(countList)
      }
    }, () => {
      this.setState(() => {
        const { animationList, } = this.state
        return {
          animationList: animationList.map(ani => {
            return ani['export'] ? ani.export() : null
          })
        } 
      }, () => {
        this.setState({
          animationList: this.createRandomEndAnimation(countList),
        })
      })
    })
  }
  initAudio(src, startPlay = false) {
    const { audioInstance } = this.state
    if(audioInstance || !src) return
    const _audioInstance = Taro.createInnerAudioContext()
    this.setState(() => {
        return {
            audioInstance: _audioInstance
        }
    }, () => {
        _audioInstance.src = src
        _audioInstance.autoplay = false
        _audioInstance.loop = false
        _audioInstance.onSeeked(() => {
            _audioInstance.play()
        })
    })
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
        .step({duration: 1000})
      return animate
    })
  }
  createRandomEndXY() {
    const { diceW, windowWidth, windowHeight } = this.state
    const widthGrid = windowWidth / 3
    const heightGrid = windowHeight / 3
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
        return [rX, heightGrid + rY]
      } else if(val == 4) {
        return [parseInt(rX + widthGrid  * .8), heightGrid + rY]
      } else if(val == 5) {
        return [parseInt(rX + widthGrid * 1.5), heightGrid + rY]
      }
    })
  }
  createRandomStartAnimation(dices = []) {
    const {
      windowWidth,
      windowHeight,
    } = this.state
    return dices.map(() => {
      const animate = Taro.createAnimation()
      const randomStartX = parseInt(windowWidth + Math.random() * 10)
      const randomStartY = parseInt((windowHeight / 2) + Math.random() * 10)
      animate
        .translate(randomStartX, randomStartY)
        .step({duration: 0})
      return animate
    })
  }
  getRandomInRange(min, max) {
    return +((Math.random() * ((max-1) - (min+1))).toFixed(2)) + (min+1);
  }
  createRandomDiceText() {
    return Math.round((Math.random() * 5)) + 1
  }
  diceAnimationEnd() {
    this.setState({
      isActive: false,
      isActiveShake: false,
    })
  }
  showMenuContent(status = false) {
    this.setState({
      isShowMenuContent: status
    })
  }
  render () {
    const {
      diceRange,
      colorRange,
      diceActive,
      dices,
      colorActive,
      animationList,
      diceW,
      isActive,
      isShowMenuContent,
    } = this.state
    const diceTotal = dices ? dices.reduce((result, current) => {
      return result + current
    }, 0) : 0
    const showTotal = isActive ? {opacity: 0, visibility: "hidden"} : {}
    const menuContentClass = 'check-container ' + (isShowMenuContent ? 'check-container-active': '')
    const menuContentLayerClass = 'check-container-layer ' + (isShowMenuContent ? 'check-container-layer-show': '')
    return (
      <View className='page' style={{backgroundImage: `url(${bg})`}}>
        <View className='menu-btn' onClick={this.showMenuContent.bind(this)}></View>
        <View onClick={this.showMenuContent.bind(this, false)} className={menuContentLayerClass}></View>
        <View className={menuContentClass}>
          <View className='close-check-container-btn' onClick={this.showMenuContent.bind(this, false)}></View>
          <View className='check-container-title'>骰子数量：</View>
          <CheckItemList
            list={diceRange}
            listType={DICE_TYPE}
            active={diceActive}
            onItemClick={this.check.bind(this)}
          />
          <View className='check-container-title'>骰子颜色：</View>
          <CheckItemList
            list={colorRange}
            listType={COLOR_TYPE}
            active={colorActive}
            onItemClick={this.check.bind(this)}
          />
        </View>
        <View className='dice-page' onClick={this.shake.bind(this)}>
          <View className='dice-total' style={showTotal}>{diceTotal}</View>
          {dices && dices.map((item, index) => {
            const style = {
              width: `${diceW}px`,
              height: `${diceW}px`,
            }
            return (<View
              style={style}
              className='dice-container'
              onTransitionEnd={this.diceAnimationEnd.bind(this)}
              key={index}
              animation={animationList[index]}
            >
              <Dice text={item} bgColorClass={colorActive} />
            </View>)
          })}
        </View>
      </View>
    )
  }
}
