import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request';
import config from '../common/config';

import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    Dimensions,
    TouchableHighlight
} from 'react-native';


const width = Dimensions.get('window').width;

class List extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
    }
    componentDidMount() {
        this._fetchData()
    }
    _fetchData() {
        request.get('http://www.missxiaolin.com/api/getDiscList', {
            g_tk: '1928093487',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            format: 'json',
            platform: 'yqq',
            hostUin: 0,
            sin: 0,
            ein: 29,
            sortId: 5,
            needNewCode: 0,
            categoryId: 10000000,
            rnd: 0.9471251144380579
        })
            .then((responseJson) => {
                if (responseJson) {
                    console.log(responseJson);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.data.list)
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    renderRow(row) {
        return (
            <TouchableHighlight>
                <View style={styles.item}>
                    <View style={styles.thumb}>
                        <Image source={{ uri: row.imgurl }} style={{ width: 60, height: 60 }} />
                    </View>
                    <View style={styles.text}>
                        <Text style={styles.name} ellipsizeMode='tail' numberOfLines={1}>{row.creator['name']}</Text>
                        <Text style={styles.desc} ellipsizeMode='tail' numberOfLines={1}>{row.dissname}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>爱过方知情深，醉过方知酒浓</Text>
                </View>
                <View style={styles.nav}>
                    <Text style={styles.navText}>推荐</Text>
                    <Text style={styles.navText}>歌手</Text>
                    <Text style={styles.navText}>排行</Text>
                    <Text style={styles.navText}>搜索</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        backgroundColor: '#222',
    },
    //头部
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#222'
    },
    headerTitle: {
        color: '#ffcd32',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Cochin'
    },
    //nav
    nav: {
        flexDirection: 'row',
    },
    navText: {
        color: '#ffcd32',
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
        lineHeight: 44,
        fontWeight: 'bold',
    },
    //内容区域
    item: {
        width: width,
        flexDirection: 'row',
        padding: 20
    },
    thumb: {
        width: 60,
        height: 60,
        marginRight: 20,
        // resizeMode: 'cover',
        // tintColor: 'red'
    },
    thumbImage: {
        width: 60,
        height: 60,
        backgroundColor: 'red',
    },
    text: {
        flex: 1,
    },
    name: {
        padding: 10,
        color: '#fff',
        fontSize: 14,
    },
    desc: {
        color: '#fff',
        // opacity: 0.7,
    }
});

module.exports = List;