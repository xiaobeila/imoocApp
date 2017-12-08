import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import request from '../common/request';
import config from '../common/config';

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    ListView,
    TouchableHighlight
} from 'react-native';

const width = Dimensions.get('window').width;
const cachedResults = {
    dissName: '',
    defaultSource: 'http://bpic.588ku.com/element_origin_min_pic/01/47/03/35574339ab3c813.jpg',
    bgImage: '',
    items: []
}

//列表模板
class Item extends Component {
    //初始变量
    constructor(props) {
        super(props);
        this.state = {
            row: this.props.row
        };
    }

    render() {
        let row = this.state.row;
        return (
            <TouchableHighlight>
                <View style={styles.item}>
                    <View style={styles.textBox}>
                        <Text style={styles.name} ellipsizeMode='tail' numberOfLines={1}>{row.songname}</Text>
                        <Text style={styles.desc} ellipsizeMode='tail' numberOfLines={1}>{row.singer[0].name}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

class List extends Component {
    //初始变量
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            id: this.props.route.params.row.dissid,
            dataSource: ds.cloneWithRows([]),
        };
    }

    //返回上一页
    _backToList() {
        this.props.navigator.pop();
    }

    //初始化加载
    componentDidMount() {
        this._fetchData(1);
    }

    _fetchData(page) {
        let that = this;
        request.get(config.api.base + config.api.getSongList, {
            g_tk: 1928093487,
            disstid: this.state.id,
            type: 1
        }).then((responseJson) => {
            if (responseJson) {
                cachedResults.dissName = responseJson.cdlist[0].dissname;
                cachedResults.bgImage = responseJson.cdlist[0].logo;

                let items = cachedResults.items.slice();
                items = items.concat(responseJson.cdlist[0].songlist);

                cachedResults.items = items;

                setTimeout(function () {
                    that.setState({
                        dataSource: that.state.dataSource.cloneWithRows(responseJson.cdlist[0].songlist)
                    })
                }, 20)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    //ListView模板
    _renderRow(row) {
        return <Item
            row={row} />
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.iconBackToList}>
                        <Icon name="chevron-left" style={styles.chevronLeft} onPress={this._backToList.bind(this)} />
                    </View>
                    <Text style={styles.headerTitle} ellipsizeMode='tail'>{cachedResults.dissName}</Text>
                    <View style={styles.bgImage}>
                        <Image source={{ uri: cachedResults.bgImage ? cachedResults.bgImage : cachedResults.defaultSource }} style={styles.musicCover} />
                    </View>
                    <View style={styles.filter}></View>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        backgroundColor: '#222'
    },
    header: {
        height: 220,
        paddingTop: 5,
        backgroundColor: '#222',
        flexDirection: 'row',
        position: 'relative',
        backgroundColor: 'transparent',
        overflow: 'hidden'
    },
    headerTitle: {
        width: width,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        zIndex: 9,
    },
    //返回上一页
    iconBackToList: {
        position: 'absolute',
        left: 10,
        top: 8,
        width: 20,
        height: 20,
        zIndex: 11
    },
    chevronLeft: {
        fontSize: 22,
        color: '#ffcd32',
    },
    contentText: {
        color: '#fff',
        fontSize: 18
    },
    //背景图
    bgImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: '130%',
        backgroundColor: 'transparent',
    },
    musicCover: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '105%',
        backgroundColor: 'rgba(7, 17, 27, .4)'
    },
    //内容区域
    item: {
        width: width,
        flexDirection: 'row',
        padding: 20
    },
    textBox: {
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'arial',
        lineHeight: 20
    },
    desc: {
        marginTop: 4,
        color: 'hsla(0,0%,100%,.3)',
        lineHeight: 20
    }
});

module.exports = List;