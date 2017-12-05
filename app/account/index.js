import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

class Account extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>账号页面</Text>
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

module.exports = Account;