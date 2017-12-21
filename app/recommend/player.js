import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video'

import request from '../common/request';
import config from '../common/config';

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Slider,
    ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');
const lyrObj = []   // 存放歌词

class Player extends Component {
    //初始变量
    constructor(props) {
        super(props);
        console.log(this.props.route.params.data);
        this.state = {
            id: this.props.route.params.data.songid,
            data: this.props.route.params.data,
            videoPause: false,
            playButton: 'pause-circle',
            sliderValue: 0,
            current: '00:00',   //播放时间
            duration: 0.0,     //歌曲时间
            pause: false,       //歌曲播放/暂停
            sliderValue: 0,    //Slide的value
            currentTime: 0.0,   //当前时间
            sliderValue: 0,    //Slide的value
            file_duration: 0,    //歌曲长度
        };
    }

    //返回上一页
    _backToList() {
        this.props.navigator.pop();
    }

    //初始化加载
    componentDidMount() {
        this.getLyric();
    }

    _onProgress(data) {
        let sliderValue = parseInt(data.currentTime)
        this.setState({
            sliderValue: sliderValue,
            currentTime: data.currentTime
        })
    }

    // 获取歌词
    getLyric = () => {
        let that = this;
        const init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'referer': 'https://y.qq.com/',
            },
        };

        fetch(`https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?g_tk=753738303&nobase64=1&callback=jsonp1&musicid=${this.state.id}`, init)
            .then((response) => response.text())
            .then((responseJson) => {
                var str = responseJson.substr(6);
                var json = eval("(" + str + ")");

                let lry = json.lyric
                let lryAry = lry.split('\n')   //按照换行符切数组
                lryAry.forEach(function (val, index) {
                    var obj = {}   //用于存放时间
                    val = val.replace(/(^\s*)|(\s*$)/g, '')    //正则,去除前后空格
                    let indeofLastTime = val.indexOf(']')  // ]的下标
                    let timeStr = val.substring(1, indeofLastTime) //把时间切出来 0:04.19
                    let minSec = ''
                    let timeMsIndex = timeStr.indexOf('.')  // .的下标
                    if (timeMsIndex !== -1) {
                        //存在毫秒 0:04.19
                        minSec = timeStr.substring(1, val.indexOf('.'))  // 0:04.
                        obj.ms = parseInt(timeStr.substring(timeMsIndex + 1, indeofLastTime))  //毫秒值 19
                    } else {
                        //不存在毫秒 0:04
                        minSec = timeStr
                        obj.ms = 0
                    }
                    let curTime = minSec.split(':')  // [0,04]
                    obj.min = parseInt(curTime[0])   //分钟 0
                    obj.sec = parseInt(curTime[1])   //秒钟 04
                    obj.txt = val.substring(indeofLastTime + 1, val.length) //歌词文本: 留下唇印的嘴
                    obj.txt = obj.txt.replace(/(^\s*)|(\s*$)/g, '')
                    obj.dis = false
                    obj.total = obj.min * 60 + obj.sec + obj.ms / 100   //总时间
                    if (obj.txt.length > 0) {
                        lyrObj.push(obj)
                    }
                })
            })
            .catch(e => { console.log(`error ${e}`) });
    }

    //把秒数转换为时间类型
    formatTime(time) {
        // 71s -> 01:11
        let min = Math.floor(time / 60)
        let second = time - min * 60
        min = min >= 10 ? min : '0' + min
        second = second >= 10 ? second : '0' + second
        return min + ':' + second
    }

    // 播放器加载好时调用,其中有一些信息带过来
    onLoad = (data) => {
        let file_duration = parseInt(data.duration)
        this.setState({ duration: data.duration, file_duration: file_duration });
    }

    // 歌词
    renderItem() {
        // 数组
        var itemAry = [];
        for (var i = 0; i < lyrObj.length; i++) {
            var item = lyrObj[i].txt
            if (this.state.currentTime.toFixed(2) > lyrObj[i].total) {
                //正在唱的歌词
                itemAry.push(
                    <View key={i} style={styles.itemStyle}>
                        <Text style={{ color: '#fff' }}> {item} </Text>
                    </View>
                );
                _scrollView.scrollTo({ x: 0, y: (25 * i), animated: false });
            }
            else {
                //所有歌词
                itemAry.push(
                    <View key={i} style={styles.itemStyle}>
                        <Text style={{ color: 'hsla(0,0%,100%,.5)' }}> {item} </Text>
                    </View>
                )
            }
        }
        return itemAry;
    }

    _playButton() {
        this.setState({
            playButton: this.state.videoPause ? 'pause-circle' : 'play-circle',
            videoPause: !this.state.videoPause
        })
    }

    render() {
        let data = this.state.data;
        return (
            <View style={styles.container}>
                <Video
                    source={{ uri: `http://ws.stream.qqmusic.qq.com/${this.state.id}.m4a?fromtag=46` }}   // Can be a URL or a local file.
                    ref='video'                    // Store reference
                    rate={1.0}                     // 0 is paused(停止), 1 is normal(正常).
                    volume={1.0}                   // 0 is muted(静音), 1 is normal.
                    muted={false}                  // Mutes the audio entirely(完全静音).
                    paused={this.state.videoPause} // Pauses playback entirely(暂停播放完全).
                    repeat={false}                 // Repeat forever(永远重复).
                    playInBackground={true}       // Audio continues to play when app entering background(当应用程序进入背景时音频继续播放。).
                    // playWhenInactive={false}       // [iOS] Video continues to play when control or notification center are shown.(视频播放)
                    // progressUpdateInterval={250.0} // [iOS] Interval to fire onProgress (default to ~250ms)(进度)
                    onProgress={this._onProgress.bind(this)}
                    onLoad={(e) => this.onLoad(e)}  //获取播放总时长
                />

                <View style={styles.bgImage}>
                    <Image source={{ uri: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000` }} style={styles.musicCover} />
                    <View style={styles.filter}></View>
                </View>
                <View style={styles.header}>
                    <View style={styles.iconBackToList}>
                        <Icon name="chevron-down" style={styles.chevronLeft} onPress={this._backToList.bind(this)} />
                    </View>
                    <Text style={styles.headerTitle} ellipsizeMode='tail'>{data.songname}</Text>
                    <Text style={styles.singer} ellipsizeMode='tail'>{data.singer[0].name}</Text>
                </View>
                <Image source={require('../images/film-reel.png')} style={{ width: 220, height: 220, alignSelf: 'center' }} />
                {/* <Image
                    style={styles.image}
                    source=
                    resizeMode='cover'
                /> */}
                {/*歌词*/}
                <View style={styles.playingLyricWrapper}>
                    <ScrollView style={{ position: 'relative' }} ref={(scrollView) => { _scrollView = scrollView }}>
                        {this.renderItem()}
                    </ScrollView>
                </View>

                <View style={styles.playingContent}>
                    <View style={styles.playingInfo}>
                        <Text style={styles.textName}>{data.songname} - {data.singer[0].name}</Text>
                        <Text style={styles.textTime}>{this.formatTime(Math.floor(this.state.currentTime))} - {this.formatTime(Math.floor(this.state.duration))}</Text>
                    </View>

                    <View style={styles.playingControl}>
                        <TouchableOpacity onPress={this._playButton.bind(this)}>
                            <Icon style={styles.playButton} name={this.state.playButton} size={40} color='#ffcd32' />
                        </TouchableOpacity>
                        <Slider
                            ref='slider'
                            style={{ flex: 1, marginLeft: 10, marginRight: 10 }}
                            value={this.state.sliderValue}
                            maximumValue={this.state.file_duration}
                            step={1}
                            minimumTrackTintColor='#ffcd32'
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        position: 'relative'
    },
    //背景图
    bgImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },
    musicCover: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover'
    },
    filter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '105%',
        backgroundColor: 'rgba(7, 17, 27, .4)'
    },
    header: {
        height: 60,
        backgroundColor: '#222',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        overflow: 'hidden'
    },
    headerTitle: {
        width: width,
        paddingTop: 5,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        zIndex: 10
    },
    singer: {
        position: 'absolute',
        left: 0,
        top: 30,
        width: width,
        paddingTop: 5,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        zIndex: 10
    },
    //返回上一页
    iconBackToList: {
        position: 'absolute',
        left: 10,
        top: 4,
        width: 20,
        height: 20,
        zIndex: 11
    },
    chevronLeft: {
        fontSize: 22,
        color: '#ffcd32'
    },
    contentText: {
        color: '#fff',
        fontSize: 18
    },
    //底部
    playingContent: {
        width: width,
        position: 'absolute',
        left: 0,
        bottom: 50,
        zIndex: 11
    },
    playingInfo: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'transparent'
    },
    playingControl: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
    },
    textName: {
        color: '#fff'
    },
    textTime: {
        color: '#fff'
    },
    playButton: {
        backgroundColor: 'transparent'
    },
    playingLyricWrapper: {
        height: 140,
        alignItems: 'center'
    },
    itemStyle: {
        paddingTop: 20,
        height: 25,
        backgroundColor: 'transparent'
    }
});

module.exports = Player;