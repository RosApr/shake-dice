import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Text,
  Picker,
  Canvas,
} from '@tarojs/components'
import './index.scss'
import diceImage from '../../assets/dice.png'
export default class Index extends Component {
  constructor() {
    this.state = {
      count: 3,
      selectRange: [...'123456'].map(item => +item),
      canvas: null,
      diceImage: null,
      animation: null,
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }
  componentDidMount() {
    const dpr = wx.getSystemInfoSync().pixelRatio
    console.log(dpr)
    // 获取canvas实例
    Taro
      .createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        console.log(res)
        // 优化canvas画布像素
        const canvas = res[0].node
        const ctx = canvas.getContext("2d")
        const width = res[0].width
        const height = res[0].height
        canvas.width = dpr * width
        canvas.height = dpr * height
        ctx.scale(dpr, dpr)
        const img = canvas.createImage()
        img.src = diceImage
        this.setState({
          canvas: res[0],
          diceImage: img,
        })
      })
  }
  shake() {
    const { count } = this.state
    const countList = [...Array(count)]
    const dices = this.createRandomDiceParams(countList)
    this.setState(() => {
      return {
        dices,
      }
    }, () => {
      this.renDices()
    })
  }
  onPickerChange({detail: {value: checkedItemIndexInRange}}) {
    const { selectRange } = this.state
    this.setState({
      count: selectRange[checkedItemIndexInRange],
      dices: null
    })
  }
  renDices() {
    const { canvas, diceImage, animation } = this.state
    if(!canvas || !diceImage) return
    const ctx = canvas.node.getContext('2d')
    animation && canvas.node.cancelAnimationFrame(animation)
    const _render = () => {
      this.draw()
      return canvas.node.requestAnimationFrame(_render)
    }
    const animationId = _render()
    this.setState({
      animation: animationId
    })
  }
  draw() {
    const { canvas, diceImage, dices, animation } = this.state
    if(!canvas || !diceImage) return
    const ctx = canvas.node.getContext('2d')
    if(!animation) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dices && dices.map(params => {
      const _config = params.drawParams
      const lastXY = _config.splice(4, 2)
      let nextX = lastXY[0] + params.g
      let nextY = lastXY[1] + params.g
      _config.splice(4, 0, nextX, nextY)
      const end = [diceImage, ..._config]
      ctx.drawImage.apply(ctx, end)
      if(Math.abs(nextX - params.endXY[0]) <= 5) {
        canvas.node.cancelAnimationFrame(animation)
        this.setState({
          animation: null
        })
      }
    })
  }
  
  createRandomStartXY() {
    const { canvas } = this.state
    const screenWidth = canvas.width
    const screenHeight = canvas.width
    return [
      screenWidth + Math.random() * 20, // x
      screenHeight / 2 + Math.random() * 30,// y
    ]
  }
  createRandomEndXY(diceIndex) {
    const { canvas } = this.state
    const screenWidth = canvas.width
    const screenHeight = canvas.width
    const widthGrid = screenWidth / 3
    const heightGrid = screenHeight / 3
    if(diceIndex == 0) {
      return [
        80 + Math.random() * widthGrid, // x
        heightGrid - Math.random() * 80,// y
      ]
    } else if(diceIndex == 1) {
      return [
        widthGrid * 2 - Math.random() * 40, // x
        heightGrid - Math.random() * 80,// y
      ]
    } else if(diceIndex == 2) {
      return [
        widthGrid * 2 + Math.random() * 20, // x
        heightGrid - Math.random() * 80,// y
      ]
    } else if(diceIndex == 3) {
      return [
        80 + Math.random() * widthGrid, // x
        heightGrid + Math.random() * 80,// y
      ]
    } else if(diceIndex == 4) {
      return [
        widthGrid * 2 - Math.random() * 40, // x
        heightGrid + Math.random() * 80,// y
      ]
    } else if(diceIndex == 5) {
      return [
        widthGrid * 2 + Math.random() * 20, // x
        heightGrid + Math.random() * 80,// y
      ]
    }
    return [
      widthGrid - Math.random() * 20, // x
      heightGrid - Math.random() * 30,// y
    ]
  }
  createRandomDiceParams(dices = []) {
    const random = Math.round((Math.random() * 5))
    const xInImage = 0
    const yInImage = 140 * random
    const widthInImage = 130
    const heightInImage = 130
    const diceInCanvasWidth = 80
    const diceInCanvasHeight = 80

    return dices.map((dice, index) => {
      const startXY = this.createRandomStartXY()
      const drawParams = [
        xInImage,
        yInImage,
        widthInImage,
        heightInImage,
        ...startXY,
        diceInCanvasWidth,
        diceInCanvasHeight
      ]
      const endXY = this.createRandomEndXY(index)
      const g = -1.5
      return {
        drawParams,
        g,
        endXY,
      }
    })
    // ctx.drawImage(diceImage, 0, 140 * 0, 130, 130, 100 * 0, 90 * 0, 80, 80)
    // ctx.drawImage(diceImage, 0, 140 * 1, 130, 130, 100 * 0, 90 * 1, 80, 80)
    // ctx.drawImage(diceImage, 0, 140 * 2, 130, 130, 100 * 0, 90 * 2, 80, 80)
    // ctx.drawImage(diceImage, 0, 140 * 3, 130, 130, 100 * 0, 90 * 3, 80, 80)
    // ctx.drawImage(diceImage, 0, 140 * 4, 130, 130, 100 * 0, 90 * 4, 80, 80)
    // ctx.drawImage(diceImage, 0, 140 * 5, 130, 130, 100 * 0, 90 * 5, 80, 80)
  }
  render () {
    const { selectRange, count, } = this.state
    return (
      <View className='page' onClick={this.shake.bind(this)}>
        <Canvas type='2d' id='canvas' ref='canvas' className='canvas'></Canvas>
        <Text className='relative'>选择骰子数：</Text>
        <Picker className='relative' mode='selector'
          range={selectRange}
          value={count - 1}
          onChange={this.onPickerChange.bind(this)}>
          <View>{count}</View>
        </Picker>
      </View>
    )
  }
}
