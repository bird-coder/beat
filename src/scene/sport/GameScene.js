import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, DeviceEventEmitter, InteractionManager} from 'react-native';
import UnityView, {UnityModule} from '@asmadsen/react-native-unity-view';
import RNIdleTimer from 'react-native-idle-timer';
import Orientation from 'react-native-orientation-locker';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import BLEUtil from '../../utils/BLEUtil';
import BaseUtil from '../../utils/BaseUtil';
import ScreenUtil from '../../utils/ScreenUtil';
import BackKeyManager from '../../utils/BackKeyUtil';
import SoundUtil from '../../utils/SoundUtil';

import MyImage from '../../module/MyImage';

export default class GameScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
        gestureEnabled: false,
    });

    constructor(props) {
        super(props);

        let obj = global.config.deviceObj;
        let params = props.navigation.state.params;
        let message = params.message || 'man:ship:5:test:sea:Alex:Bob:0:1:2:0';
        let deviceId = params.deviceId || null;
        let stype = obj.stype;
        let splash;
        if (global.config.splashList[stype]) splash = global.config.splashList[stype].pic;
        else {
            splash = obj.splash;
        }
        this.state = {
            deviceId: deviceId,
            message: message,
            isShow: global.platform.isIOS,
            splash: splash,
            showMask: true,
        };
        this.maskTimer = null;
    }

    UNSAFE_componentWillMount(): void {
        let that = this;
        let params = this.props.navigation.state.params;
        if (!params.deviceId || !params.message) return;
        this.timer = setTimeout(() => {
            RNIdleTimer.setIdleTimerDisabled(true);
        }, 5000);
        UnityModule.isReady().then((bool) => {
            if (bool) {
                UnityModule.postMessage('Globle', 'SetScreen', '0');
                Orientation.lockToLandscapeLeft();
                that.maskTimer = setTimeout(() => {
                    UnityModule.resume();
                    UnityModule.postMessage('Globle', 'StartGame', that.state.message);
                }, 2000);
            } else {
                if (global.platform.isAndroid) UnityModule.createUnity();
                Orientation.lockToLandscapeLeft();
            }
        });
    }

    componentDidMount() {
        BackKeyManager.setBackKeyDisabled(true);
        this.startNotify();
        let that = this;
        SoundUtil.random();
        this.listener = DeviceEventEmitter.addListener('bleDisconnectCallback', this.handleBleDisconnect);
        this.appStateListener = DeviceEventEmitter.addListener('appStateChange', this.handleAppState);
        if (global.platform.isAndroid) UnityModule.addMessageListener(this.onUnityMessage);
    }

    componentWillUnmount(): void {
        BackKeyManager.setBackKeyDisabled(false);
        SoundUtil.stop();
        this.stopNotify();
        global.uploadSportData();
        RNIdleTimer.setIdleTimerDisabled(false);
        this.listener.remove();
        this.appStateListener.remove();
        clearTimeout(this.timer);
        clearTimeout(this.maskTimer);
        if (global.platform.isAndroid) UnityModule.removeMessageListener(this.onUnityMessage);
    }

    exitUnity = () => {
        UnityModule.pause();
        UnityModule.postMessage('Globle', 'SetScreen', '0');
        Orientation.lockToPortrait();
        InteractionManager.runAfterInteractions(() => {
            this.setState({isShow: false});
            this.props.navigation.goBack();
        });
    }

    handleAppState = (state) => {
        if (state == 'active') {
            this.startNotify();
            setTimeout(() => {
                UnityModule.resume();
            }, 1000);
            SoundUtil.play();
        } else {
            this.stopNotify();
            UnityModule.pause();
            SoundUtil.pause();
        }
    }

    handleBleDisconnect = () => {
        global.toastShow('设备连接已断开');
        // UnityModule.pause();
        this.exitUnity();
    }

    startNotify = () => {
        BLEUtil.onBLECharacteristicValueChange(this.handleNotify);
        BLEUtil.startNotify(this.state.deviceId, global.config.ble_uuid, 'FD01');
    }

    stopNotify = () => {
        BLEUtil.stopNotify(this.state.deviceId, global.config.ble_uuid, 'FD01');
        BLEUtil.cancelBLECharacteristicValueChange();
    }

    handleNotify = (res) => {
        let that = this;
        if (this.state.deviceId != res.peripheral) return;
        let characteristic = res.characteristic;
        if (global.platform.isAndroid) characteristic = characteristic.slice(4, 8);
        if (characteristic.toUpperCase() == 'FD01') {
            let deviceObj = global.config.deviceObj;
            if (!deviceObj.connect) return;
            let str = BaseUtil.decryptData(res.value, global.config.ble_sk);
            console.log(str);
            let obj = BaseUtil.parseSportData(str);
            if (!obj) {
                UnityModule.postMessage('Globle', 'SetSpeed', '0:0:0:0:' + deviceObj.aiSpeed);
                return;
            }
            global.config.sport_data = obj;
            let speed = deviceObj.getGameSpeed(obj);
            console.log('set speed', speed);
            UnityModule.postMessage('Globle', 'SetSpeed', speed);
        }
    }

    resetBleData = () => {
        global.config.sport_start_time = BaseUtil.getTimeStamp();
        global.config.sport_data = {};
        let bytes = [0x02, 0x00];
        BLEUtil.writeBLEData(this.state.deviceId, global.config.ble_uuid, 'FD02', bytes);
    }

    onUnityMessage = (res) => {
        switch (res) {
            case 'open':
                UnityModule.postMessage('Globle', 'StartGame', this.state.message);
                break;
            case 'ready':
                SoundUtil.play();
                if (global.platform.isAndroid) this.setState({isShow: true});
                else this.setState({showMask: false});
                break;
            case 'start': this.resetBleData(); break;
            case 'exit': this.exitUnity(); break;
            case 'game over':
                SoundUtil.stop();
                this.stopNotify();
                global.uploadSportData();
                break;
            case 'reload':
                UnityModule.postMessage('Globle', 'StartGame', this.state.message);
                SoundUtil.play();
                this.startNotify();
                break;
        }
    }

    render() {
        let style = null;
        if (global.platform.isIOS) style = {zIndex: 10};
        return (
            <View style={styles.container}>
                {this.state.isShow && <UnityView
                    style={commonStyle.fillView}
                    onMessage={this.onUnityMessage}
                    onUnityMessage={this.onUnityMessage} />}
                {this.state.showMask && <MyImage source={this.state.splash} style={[styles.mask, style]}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    mask: {
        width: ScreenUtil.screenH,
        height: ScreenUtil.screenW,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: color.primary,
        zIndex: -1,
    },
});
