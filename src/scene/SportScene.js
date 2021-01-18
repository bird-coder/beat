import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground} from 'react-native';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';
import BLEUtil from '../utils/BLEUtil';

import {MyText, Paragraph} from '../module/Text';
import SwitchTabCell from '../module/SwitchTabCell';
import SpacingView from '../module/SpacingView';

export default class SportScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({

    })

    constructor(props) {
        super(props);

        this.state = {
            items: ['运动', '场景'],
            index: 0,
            scenes: [
                {type: '单车', scene: [
                    {id: 1, name: '山地'},
                    {id: 2, name: '海边'},
                ]},
                {type: '划船机', scene: [
                    {id: 3, name: '大河'},
                    {id: 4, name: '内海'},
                ]},
            ],
            sports: [
                {id: 1, name: '跑步机'},
                {id: 2, name: '单车'},
                {id: 3, name: '划船机'},
            ],
            refreshing: false,
        };
    }

    switchTab = (index) => {
        this.setState({index: index});
    }

    requestData = () => {
        let that = this;
        // that.setState({refreshing: true});
        // HttpUtil.post(api.getTrends, {}).then((json) => {
        //     console.log('拉取用户动态接口' + JSON.stringify(json));
        //     if (json.code == 0) {
        //
        //     }
        // });
    }

    selectSport = () => {
        let that = this;
        BLEUtil.getConnectedBLEDevice([global.config.ble_uuid]).then((res) => {
            if (res.length == 0) {
                console.log('ble has not connected peripherals');
                that.openBle();
            } else if (res[0] == global.config.ble_uuid) {
                console.log('ble has connected BEAT');
                // that.props.navigation.navigate('Game', {});
            }
        });
    }

    openBle = () => {
        let that = this;
        BLEUtil.onBLEStateChange(function (res) {
            if (res.state == 'on') {
                that.props.navigation.navigate('BleConnect', {});
            }
        });
        BLEUtil.openBLE();
    }

    renderSport = (info: Object) => {
        return (
            <View>
                <TouchableOpacity activeOpacity={0.8} style={styles.sportItem} onPress={this.selectSport}>
                    <ImageBackground source={require('../img/step.jpg')} style={styles.backImg} resizeMode={'cover'}>
                        <MyText style={styles.sportName}>{info.name}</MyText>
                    </ImageBackground>
                </TouchableOpacity>
                <SpacingView height={10} />
            </View>
        );
    }

    renderScene = (info: Object) => {
        return (
            <View>
                <MyText style={styles.title}>{info.type}</MyText>
                {info.scene.map((info1, index1) => (
                    <View>
                        <TouchableOpacity activeOpacity={0.8} style={styles.sportItem} onPress={this.selectSport}>
                            <ImageBackground source={require('../img/step.jpg')} style={styles.backImg} resizeMode={'cover'}>
                                <MyText style={styles.sportName}>{info1.name}</MyText>
                            </ImageBackground>
                        </TouchableOpacity>
                        <SpacingView height={10} />
                    </View>
                ))}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <SwitchTabCell index={this.state.index} onPress={this.switchTab} list={this.state.items} />
                <ScrollView style={styles.sportList}>
                    {this.state.index == 0 && this.state.sports.map((info, index) => (
                        this.renderSport(info)
                    ))}
                    {this.state.index == 1 && this.state.scenes.map((info, index) => (
                        this.renderScene(info)
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    sportList: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    sportItem: {
        backgroundColor: color.paper,
    },
    backImg: {
        width: '100%',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sportName: {
        fontSize: 24,
        color: color.white,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 40,
    },
});
