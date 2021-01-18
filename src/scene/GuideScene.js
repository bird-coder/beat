import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';
import Swiper from 'react-native-swiper';

import color from '../common/color';
import commonStyle from '../common/style';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';
import StorageUtil from '../utils/StorageUtil';

import BtnCell from '../module/BtnCell';
import SpacingView from '../module/SpacingView';

let imageSize = Image.resolveAssetSource(ImageResources.guide1);
const ratio = imageSize.height / imageSize.width;

export default class GuideScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
    })

    constructor(props) {
        super(props);

        this.state = {
            isShow: true,
            ratio: null,
        };
    }

    componentDidMount() {
        StorageUtil.set('hasEnter', 1);
    }

    goIndex = () => {
        StorageUtil.get('token', (json) => {
            if (json) {
                this.props.navigation.replace('Tab', {});
            } else {
                this.props.navigation.replace('Login', {});
            }
        });
        // this.props.navigation.replace('Tab', {});
    }

    render() {
        return (
            <Swiper
                height={ScreenUtil.screenH}
                autoplay={false}
                showsPagination={this.state.isShow}
                loop={false}
                dotStyle={styles.dotStyle}
                activeDotStyle={styles.activeDotStyle}
            >
                <View style={styles.container}><Image source={ImageResources.guide1} style={styles.backgroundImage} resizeMode={'contain'} /></View>
                <View style={styles.container}><Image source={ImageResources.guide2} style={styles.backgroundImage} resizeMode={'contain'} /></View>
                <View style={styles.container}>
                    <Image source={ImageResources.guide3} style={styles.backgroundImage} resizeMode={'contain'} />
                    <View style={styles.btnView}>
                        <BtnCell value={'立即体验'} onPress={this.goIndex} style={styles.button} />
                    </View>
                </View>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    dotStyle: {
        width: 10,
        height: 10,
        backgroundColor: color.primary_3,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 40,
    },
    activeDotStyle: {
        width: 10,
        height: 10,
        backgroundColor: color.primary,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 40,
    },
    backgroundImage: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenW * ratio,
    },
    btnView: {
        width: '100%',
        position: 'absolute',
        bottom: '8%',
        alignItems: 'center',
    },
    button: {
        width: 166,
        borderRadius: 25,
    },
});
