import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground} from 'react-native';

import color from '../../common/color';
import ImageResources from '../../common/image';
import StorageUtil from '../../utils/StorageUtil';
import BLEUtil from '../../utils/BLEUtil';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText, Heading3} from '../../module/Text';
import BtnCell from '../../module/BtnCell';
import SpacingView from '../../module/SpacingView';

export default class SportModeScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>模式选择</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            sport: {id: 1, name: '单车', pic: ImageResources.img_bicycle},
            scene: [
                {id: 1, name: '森林', pic: ImageResources.img_forest},
            ],
            recordType: 'speed',
            hasScene: false,
            stype: 1,
            deviceId: null,
        };
    }

    componentDidMount(): void {
        let that = this;
        let obj = global.config.deviceObj;
        if (!obj.connect) {
            global.toastShow('设备未连接');
            that.props.navigation.goBack();
            return;
        }
        let sport = {name: obj.name, pic: obj.devicePic};
        let scene = obj.scenes;
        that.setState({deviceId: obj.deviceInfo.id, recordType: obj.recordType, hasScene: obj.hasScene, stype: obj.stype, sport, scene});
    }

    selectSportRope = (index) => {
        if (global.checkBleState() != 'connected') {
            global.toastShow('请先连接设备');
            return;
        }
        if (this.state.stype != 6) return;
        let title = '计时模式';
        if (index == 2) title = '限时模式';
        this.props.navigation.navigate('PanelRope', {deviceId: this.state.deviceId, countType: index, title});
    }

    selectSport = () => {
        if (global.checkBleState() != 'connected') {
            global.toastShow('请先连接设备');
            return;
        }
        let routeName = 'Panel';
        if (this.state.recordType == 'count') routeName = 'Panel2';
        this.props.navigation.navigate(routeName, {deviceId: this.state.deviceId});
    }

    selectScene = (index) => {
        if (global.checkBleState() != 'connected') {
            global.toastShow('请先连接设备');
            return;
        }
        let obj = global.config.deviceObj;
        let sex = global.config.user.sex == 0 ? 'man' : 'female';
        let name = global.config.user.username;
        let device = obj.sceneType, scene = obj.scenes[index].scene;
        let message = sex + ':' + device + ':' + '5:' + name + ':' + scene + ':Alex:Bob:0:1:2' + ':' + obj.visualAngle;
        this.props.navigation.navigate('Game', {deviceId: this.state.deviceId, message: message});
    }

    disconnectBle = () => {
        let that = this;
        BLEUtil.disconnectBLE(this.state.deviceId).then((res) => {
            if (res) {
                global.toastShow('设备连接已断开');
                that.props.navigation.goBack();
            }
        });
    }

    renderSportRope = (info: Object, index: number) => {
        return (
            <View>
                <TouchableOpacity activeOpacity={0.8} style={styles.sportItem} onPress={this.selectSportRope.bind(this, index)}>
                    <ImageBackground source={info.pic} style={styles.backImg} resizeMode={'cover'}>
                        <View style={styles.sportRow}><MyText style={styles.sportName}>{info.name}</MyText></View>
                    </ImageBackground>
                </TouchableOpacity>
                <SpacingView height={10} />
            </View>
        );
    }

    renderSport = (info: Object) => {
        return (
            <View>
                <TouchableOpacity activeOpacity={0.8} style={styles.sportItem} onPress={this.selectSport}>
                    <ImageBackground source={info.pic} style={styles.backImg} resizeMode={'cover'}>
                        <View style={styles.sportRow}><MyText style={styles.sportName}>{info.name}</MyText></View>
                    </ImageBackground>
                </TouchableOpacity>
                <SpacingView height={10} />
            </View>
        );
    }

    renderScene = (info: Object, index: number) => {
        return (
            <View>
                <TouchableOpacity activeOpacity={0.8} style={styles.sportItem} onPress={this.selectScene.bind(this, index)}>
                    <ImageBackground source={info.pic} style={styles.backImg} resizeMode={'cover'}>
                        <View style={styles.sportRow}><MyText style={styles.sportName}>{info.name}</MyText></View>
                    </ImageBackground>
                </TouchableOpacity>
                <SpacingView height={10} />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.sportList}>
                    <SpacingView height={14} />
                    <Heading3 style={styles.title}>经典模式</Heading3>
                    <SpacingView height={12} />
                    {this.renderSport(this.state.sport)}
                    {this.state.hasScene && <>
                        <SpacingView height={24}/>
                        <Heading3 style={styles.title}>场景模式</Heading3>
                        <SpacingView height={12} />
                        {this.state.scene && this.state.scene.map((info, index) => (
                            this.renderScene(info, index)
                        ))}
                    </>}
                    {this.state.stype == 6 && <>
                        <SpacingView height={24}/>
                        <Heading3 style={styles.title}>计时模式</Heading3>
                        <SpacingView height={12} />
                        {this.renderSportRope(this.state.sport, 1)}
                        <SpacingView height={24}/>
                        <Heading3 style={styles.title}>限时模式</Heading3>
                        <SpacingView height={12} />
                        {this.renderSportRope(this.state.sport, 2)}
                    </>}
                </ScrollView>
                <View style={styles.bottomView}>
                    <BtnCell value={'断开连接'} width={0.9} onPress={this.disconnectBle} style={styles.disconnectBtn} disabled={this.state.disabled} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    sportList: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 80,
    },
    sportItem: {
        backgroundColor: color.paper,
    },
    backImg: {
        width: '100%',
        height: 120,
        justifyContent: 'flex-end',
        borderRadius: 4,
    },
    sportRow: {
        paddingLeft: 21,
        paddingTop: 9,
        paddingBottom: 9,
        backgroundColor: color.backdrop,
    },
    sportName: {
        fontSize: 13,
        lineHeight: 18,
        color: color.white,
        fontWeight: 'bold',
    },
    title: {
        fontWeight: 'bold',
    },
    bottomView: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        padding: 15,
        paddingBottom: ScreenUtil.getIphoneXBottom(15),
        backgroundColor: color.white,
        alignItems: 'center',
    },
    disconnectBtn: {

    },
});
