import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../common/request';
import config from '../common/config';
import List from './list';

import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    Dimensions,
    TouchableHighlight,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

const width = Dimensions.get('window').width;
const cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
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
            <TouchableHighlight onPress={this.props.onSelect}>
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
}

class Recommend extends Component {
    //变量
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            carouselImage: [],
            isLoadingTail: false,
            isRefreshing: false
        };
    }

    //初始化加载
    componentDidMount() {
        this._fetchData(1);
        this._fetchCarouselImage();
    }

    //轮播图数据
    _fetchCarouselImage() {
        request.get('https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', {
            g_tk: 1928093487,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            format: 'json',
            ein: 200,
            categoryId: 10000000,
        }).then((responseJson) => {
            if (responseJson) {
                // console.log(responseJson);

                this.setState({
                    carouselImage: responseJson.data.slider
                })
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    //列表页数据
    _fetchData(page) {
        let that = this;
        if (page !== 0) {
            this.setState({
                isLoadingTail: true
            })
        } else {
            this.setState({
                isLoadingTail: false
            })
        }

        request.get(config.api.base + config.api.list, {
            g_tk: 1928093487,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            format: 'json',
            ein: page + '0',
            categoryId: 10000000
        }).then((responseJson) => {
            if (responseJson.data.list.length) {
                // console.log(responseJson);

                let items = cachedResults.items.slice();
                items = items.concat(responseJson.data.list);

                if (page !== 0) {
                    cachedResults.nextPage += 1;
                    cachedResults.items = items;
                    cachedResults.total = responseJson.data.sum;
                } else {
                    items = items.concat(items);
                }


                setTimeout(function () {
                    if (page !== 0) {
                        that.setState({
                            isLoadingTail: false,
                            dataSource: that.state.dataSource.cloneWithRows(responseJson.data.list)
                        })
                    } else {
                        that.setState({
                            isRefreshing: false,
                            dataSource: that.state.dataSource.cloneWithRows(responseJson.data.list)
                        })
                    }
                }, 20)
            }
        }).catch((error) => {
            if (page !== 0) {
                isLoadingTail: false
            } else {
                isRefreshing: false
            }
            this.setState({
                isLoadingTail: false
            })
            console.error(error);
        });
    }

    _hasMore() {
        return cachedResults.items.length !== this.state.total;
    }

    //上拉加载
    _fetchMoreData() {
        if (!this._hasMore() || this.state.isLoadingTail) {
            return
        }

        let page = cachedResults.nextPage;
        this._fetchData(page);
    }

    //上拉加载 - 没有更多了提示
    _renderFooter() {
        if (!this._hasMore() && this.state.total !== 0) {
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多了</Text>
                </View>
            );
        }

        if (!this.state.isLoadingTail) {
            return <View style={styles.loadingMore} />
        }

        return <ActivityIndicator style={styles.loadingMore} />
    }

    //下拉刷新
    _onRefresh() {
        if (!this._hasMore() || this.state.isRefreshing) {
            return
        }
        this._fetchData(1);
    }

    //ListView模板
    _renderRow(row) {
        return <Item
            key={row.dissid}
            onSelect={() => this._loadPage(row)}
            row={row} />
    }

    _loadPage(row) {
        this.props.navigator.push({
            name: 'list',
            component: List,
            params: {
                row: row
            }
        })
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
                    renderRow={this._renderRow.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    onEndReached={this._fetchMoreData.bind(this)}
                    onEndReachedThreshold={1}
                    renderFooter={this._renderFooter.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ffcd32"
                            title="拼命加载中..."
                            titleColor="#fff"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
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
    //loading
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
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

module.exports = Recommend;