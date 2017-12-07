import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

class List extends Component {
    //初始变量
    constructor(props) {
        super(props);
        this.state = {
            row: this.props.route.params.row
        };
    }

    _backToList() {
        this.props.navigator.pop();
    }

    render() {
        let row = this.state.row;
        return (
            <View style={styles.container}>
                <Text onPress={this._backToList.bind(this)}>列表页面{row.dissid}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
});

module.exports = List;