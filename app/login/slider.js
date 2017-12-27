import React, { Component } from 'react';
import Swiper from 'react-native-swiper';

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableHighlight
} from 'react-native';

const { width, height } = Dimensions.get('window');

class Slider extends Component {
    //初始变量
    constructor(props) {
        super(props);
    
        this.state = {
            loop: false,
            banners: [
                require('../images/s1.jpg'),
                require('../images/s2.jpg'),
                require('../images/s3.jpg'),
                require('../images/s4.jpeg'),
                require('../images/s5.1.jpg'),
            ]
        };
    }

    _enter() {
        this.props.enterSlider()
    }

    render() {
        return (
            <Swiper
                horizontal={true}
                loop={this.state.loop}
                paginationStyle={{ bottom: 10 }}
                showsButtons={false}
                style={styles.container}>
                <View style={styles.slide}>
                    <Image source={this.state.banners[0]} style={styles.image} />
                </View>
                <View style={styles.slide}>
                    <Image source={this.state.banners[1]} style={styles.image} />
                </View>
                <View style={styles.slide}>
                    <Image source={this.state.banners[2]} style={styles.image} />
                </View>
                <View style={styles.slide}>
                    <Image source={this.state.banners[3]} style={styles.image} />
                </View>
                <View style={styles.slide}>
                    <Image source={this.state.banners[4]} style={styles.image} />
                    <TouchableHighlight
                        onPress={this._enter.bind(this)}
                        underlayColor="rgba(255,255,255,0.1)"
                        style={styles.buttonBox}>
                        <Text style={styles.button}>立即体验</Text>
                    </TouchableHighlight>
                </View>
            </Swiper>
        )
    }
}

const styles = StyleSheet.create({
    container: {
    },
    slide: {
        flex: 1,
        width: width,
        height: height,
        position: 'relative'
    },
    image: {
        width: width,
        height: height,
        position: 'absolute',
        zIndex: 10
    },
    buttonBox: {
        width: 150,
        zIndex: 11,
        alignItems: 'center',
        position: 'absolute',
        left: (width / 2) - 75,
        bottom: 34
    },
    button: {
        width: 150,
        backgroundColor: '#1fd094',
        borderRadius: 5,
        textAlign: 'center',
        padding: 10,
        color: '#fff',
        fontSize: 20,
    }
});

module.exports = Slider;