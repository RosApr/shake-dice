import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  render () {
    return (
      <View>
        <View class="first-dice dice">
          <View class="pip"></View>
        </View>
        <View class="second-dice dice">
          <View class="pip"></View>
          <View class="pip"></View>
        </View>
        <View class="third-dice dice">
          <View class="pip"></View>
          <View class="pip"></View>
          <View class="pip"></View>
        </View>
        <View class="fourth-dice dice">
          <View class="column">
            <View class="pip"></View>
            <View class="pip"></View>
          </View>
          <View class="column">
            <View class="pip"></View>
            <View class="pip"></View>
          </View>
        </View>
        <View class="fifth-dice dice">
          <View class="column">
            <View class="pip"></View>
            <View class="pip"></View>
          </View>
          <View class="column">
            <View class="pip"></View>
          </View>
          <View class="column">
            <View class="pip"></View>
            <View class="pip"></View>
          </View>
        </View>
        <View class="sixth-dice dice">
          <View class="column">
            <View class="pip"></View>
            <View class="pip"></View>
            <View class="pip"></View>
          </View>
          <View class="column">
            <View class="pip"></View>
            <View class="pip"></View>
            <View class="pip"></View>
          </View>
        </View>
      </View>
    )
  }
}
