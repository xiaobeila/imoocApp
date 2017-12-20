import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video'
import Lyric from 'lyric-parser'

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Slider,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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
            current: '00:00',
            pause:false,       //歌曲播放/暂停
            sliderValue: 0,    //Slide的value
            currentTime: 0.0,   //当前时间
        };
    }

    //返回上一页
    _backToList() {
        this.props.navigator.pop();
    }


    //初始化加载
    componentDidMount() {
    }

    _onProgress(data) {
        let val = parseInt(data.currentTime)
        this.setState({
            sliderValue: val,
            currentTime: data.currentTime
        })
    }


    // 获取歌词

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

                {/* <Image
                    style={styles.image}
                    source=
                    resizeMode='cover'
                /> */}
                <View style={styles.playingContent}>
                    <View style={styles.playingInfo}>
                        <Text style={styles.textName}>{data.songname} - {data.singer[0].name}</Text>
                        <Text style={styles.textTime}>00：00 - 03:33</Text>
                    </View>

                    <View style={styles.playingControl}>
                        <TouchableOpacity onPress={this._playButton.bind(this)}>
                            <Icon style={styles.playButton} name={this.state.playButton} size={40} color='#ffcd32' />
                        </TouchableOpacity>
                        <Slider
                            ref='slider'
                            style={{ flex: 1, marginLeft: 10, marginRight: 10 }}
                            value={20}
                            maximumValue={100}
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
    }
});

module.exports = Player;