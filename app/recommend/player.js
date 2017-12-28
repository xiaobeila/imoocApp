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
    ScrollView,
    Animated,
    Easing,
    ActivityIndicator
} from 'react-native';

const { width, height } = Dimensions.get('window');
const lyrObj = []   // 存放歌词
var myAnimate;
class Player extends Component {
    //初始变量
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0)
        this.state = {
            songid: 0,
            data: [],
            videoPause: false,
            playButton: 'pause-circle',
            playModel: 1,  // 播放模式  1:列表循环    2:随机    3:单曲循环
            sliderValue: 0,
            current: '00:00',   //播放时间
            duration: 0.0,     //歌曲时间
            pause: false,       //歌曲播放/暂停
            sliderValue: 0,    //Slide的value
            currentTime: 0.0,   //当前时间
            sliderValue: 0,    //Slide的value
            file_duration: 0,    //歌曲长度
            pic_small: '',    //小图
            currentIndex: parseInt(this.props.route.params.index),    //当前第几首
            imgRotate: new Animated.Value(0),
            songs: this.props.route.params.songidAry,   //歌曲的ID组
            audioUrl: '',
            file_link: '',   //歌曲播放链接
        };
        this.isGoing = true; //为真旋转
        this.myAnimate = Animated.timing(this.state.imgRotate, {
            toValue: 1,
            duration: 6000,
            easing: Easing.inOut(Easing.linear),
        });
    }

    imgMoving = () => {
        if (this.isGoing) {
            this.state.imgRotate.setValue(0);
            this.myAnimate.start(() => {
                this.imgMoving()
            })
        }
    };

    stop = () => {
        this.isGoing = !this.isGoing;

        if (this.isGoing) {
            this.myAnimate.start(() => {
                this.myAnimate = Animated.timing(this.state.imgRotate, {
                    toValue: 1,
                    duration: 6000,
                    easing: Easing.inOut(Easing.linear),
                });
                this.imgMoving()
            })
        } else {
            this.state.imgRotate.stopAnimation((oneTimeRotate) => {
                //计算角度比例
                this.myAnimate = Animated.timing(this.state.imgRotate, {
                    toValue: 1,
                    duration: (1 - oneTimeRotate) * 6000,
                    easing: Easing.inOut(Easing.linear),
                });
            });
        }
    };

    //返回上一页
    _backToList() {
        this.props.navigator.pop();
    }

    //初始化加载
    componentDidMount() {
        this.loadSongInfo(this.state.currentIndex);
        this.imgMoving();
    }

    loadSongInfo = (index) => {
        //加载歌曲
        let that = this;
        let songid = this.state.songs[index]
        this.setState({
            songid: songid,
            file_link: `http://ws.stream.qqmusic.qq.com/${songid}.m4a?fromtag=46`
        })

        request.get(config.api.base + config.api.getSongList, {
            g_tk: 1928093487,
            disstid: this.props.route.params.disstid,
            type: 1
        }).then((responseJson) => {
            if (responseJson) {
                this.setState({
                    data: responseJson.cdlist[0].songlist[this.state.currentIndex]
                })
            }
        }).catch((error) => {
            console.error(error);
        });


        // 获取歌词
        lyrObj = [];
        const init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'referer': 'https://y.qq.com/',
            },
        };

        fetch(`https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?g_tk=753738303&nobase64=1&callback=jsonp1&musicid=${songid}`, init)
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

    _onProgress(data) {
        let sliderValue = parseInt(data.currentTime)
        this.setState({
            sliderValue: sliderValue,
            currentTime: data.currentTime
        })

        //如果当前歌曲播放完毕,需要开始下一首
        if (sliderValue == this.state.file_duration) {
            if (this.state.playModel == 1) {
                //列表 就播放下一首
                this.nextAction(this.state.currentIndex + 1)
            } else if (this.state.playModel == 2) {
                let last = this.state.songs.length //json 中共有几首歌
                let random = Math.floor(Math.random() * last)  //取 0~last之间的随机整数
                this.nextAction(random) //播放
            } else {
                //单曲 就再次播放当前这首歌曲
                this.refs.video.seek(0) //让video 重新播放
                _scrollView.scrollTo({ x: 0, y: 0, animated: false });
            }
        }
    }

    //下一曲
    nextAction = (index) => {
        this.recover()
        lyrObj = [];
        if (index == this.state.songs.length) {
            index = 0 //如果是最后一首就回到第一首
        }
        this.setState({
            currentIndex: index,  //更新数据
        })
        this.loadSongInfo(index)   //加载数据
    }

    //换歌时恢复进度条 和起始时间
    recover = () => {
        this.setState({
            sliderValue: 0,
            currentTime: 0.0
        })
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
                        <Text style={{ color: '#fff', textAlign: 'center' }}> {item} </Text>
                    </View>
                );
                _scrollView.scrollTo({ x: 0, y: (25 * i), animated: false });
            }
            else {
                //所有歌词
                itemAry.push(
                    <View key={i} style={styles.itemStyle}>
                        <Text style={{ color: 'hsla(0,0%,100%,.5)', textAlign: 'center' }}> {item} </Text>
                    </View>
                )
            }
        }
        return itemAry;
    }

    _playButton() {
        this.stop();
        this.setState({
            playButton: this.state.videoPause ? 'pause-circle' : 'play-circle',
            videoPause: !this.state.videoPause
        })
    }

    render() {
        let data = this.state.data;
        //如果未加载出来数据 就一直转菊花
        if (this.state.data.length <= 0) {
            return (
                <ActivityIndicator
                    animating={this.state.animating}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    size="large" />
            )
        } else {
            return (
                <View style={styles.container}>
                    <Video
                        source={{ uri: this.state.file_link }}   // Can be a URL or a local file.
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

                    <Image source={require('../images/film-reel.png')} style={{ width: 220, height: 220, alignSelf: 'center', marginTop: 50 }} />

                    {/*旋转小图*/}
                    <Animated.Image
                        ref='myAnimate'
                        style={{
                            width: 140, height: 140, marginTop: -180, alignSelf: 'center', borderRadius: 140 * 0.5, transform: [{
                                rotate: this.state.imgRotate.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg']
                                })
                            }]
                        }}
                        source={{ uri: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000` }}
                    />

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
                                onValueChange={(value) => {
                                    this.setState({
                                        currentTime: value
                                    })
                                }}
                                onSlidingComplete={(value) => {
                                    this.refs.video.seek(value)
                                }}
                            />
                        </View>
                    </View>
                </View>
            )
        }
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
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    filter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
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
        height: 30,
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
        width: '75%',
        color: '#fff'
    },
    textTime: {
        color: '#fff'
    },
    playButton: {
        backgroundColor: 'transparent'
    },
    playingLyricWrapper: {
        marginTop: 50,
        height: 140,
        alignItems: 'center',
    },
    itemStyle: {
        paddingTop: 20,
        height: 25,
        backgroundColor: 'transparent'
    }
});

module.exports = Player;