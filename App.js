/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';


import Slider from './app/login/slider';
//推荐
import Recommend from './app/recommend/recommend';
import List from './app/recommend/list';
import Edit from './app/edit/index';
import Account from './app/account/index';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

export default class ImoocApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'blueTab',
      entered: false
    };
  }

  //初始化加载
  componentDidMount() {
    // AsyncStorage.removeItem('entered')
    this._asyncAppStatus()
  }

  //是否是第一次，第一次出现轮播图，第二次进来就不会出现
  _asyncAppStatus() {
    var that = this
    AsyncStorage.multiGet(['entered'])
      .then((data) => {
        var entered = data[0][1]
        if (entered == 'yes') {
          this.setState({
            entered: true,
          })
        }
      })
  }

  _enterSlider() {
    this.setState({
      entered: true,
    }, () => {
      AsyncStorage.setItem('entered', 'yes')
    })
  }

  render() {
    if (!this.state.entered) {
      return <Slider
        enterSlider={this._enterSlider.bind(this)}
      />
    }

    return (
      <TabBarIOS
        tintColor="#ffcd32"
        barTintColor="#222"
      >
        <Icon.TabBarItem
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'blueTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'blueTab',
            });
          }}>
          <NavigatorIOS
            initialRoute={{
              title: '',
              component: Recommend
            }}
            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight
            }}
            renderScene={(route, navigator) => {
              let Component = route.component
              return <Component {...route.params} navigator={navigator} />
            }}
            style={{ flex: 1 }}
            navigationBarHidden={true}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab'
            });
          }}>
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab'
            });
          }}>
          <Account />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
});
