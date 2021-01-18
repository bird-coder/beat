import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, ImageBackground, TouchableOpacity, DeviceEventEmitter, NativeModules} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RNIdleTimer from 'react-native-idle-timer';
import {PanGestureHandler} from 'react-native-gesture-handler';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import StorageUtil from '../../utils/StorageUtil';
import BLEUtil from '../../utils/BLEUtil';
import BaseUtil from '../../utils/BaseUtil';
import BackKeyManager from '../../utils/BackKeyUtil';

import {Heading, MyText} from '../../module/Text';
import BackBtn from '../../module/BackBtn';
import SpacingView from '../../module/SpacingView';
import RecodeNode from '../../module/report/RecodeNode';

export default class PanelRopeScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <BackBtn style={commonStyle.white} onPress={navigation.state.params.navigationBack} />,
        headerTitle: () => (<Heading style={commonStyle.white}>{navigation.state.params.title || '计时模式'}</Heading>),
        headerStyle: {backgroundColor: color.panelBg},
        gestureEnabled: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            running: false,
            stop: true,
            deviceId: null,
            stype: 6,
            obj: {},
            second: 0,
            upload: false,
            keys: {frequency: '踏频', total: '圈数'},
            unit: '圈',
            total: 100,
            isInit: false,
            count: 3,
            showMask: false,
            countType: 1,
            pointTime: 0,
            nowTime: 0,
        };
        this.timer = null;
        this.timer2 = null;
        this.timer3 = null;
    }

    componentDidMount(): void {
        let that = this;
        BackKeyManager.setBackKeyDisabled(true);
        let params = this.props.navigation.state.params;
        this.props.navigation.setParams({navigationBack: this.goBack});
        if (!params.deviceId) return;
        let obj = global.config.deviceObj;
        if (!obj.connect) return;
        this.setState({deviceId: params.deviceId, countType: params.countType, stype: obj.stype, keys: obj.keys, unit: obj.unit});
        this.listener = DeviceEventEmitter.addListener('bleDisconnectCallback', this.handleBleDisconnect);
        RNIdleTimer.setIdleTimerDisabled(true);
        setTimeout(function () {
            that.showInit();
        }, 200);
    }

    componentWillUnmount(): void {
        BackKeyManager.setBackKeyDisabled(false);
        this.listener.remove();
        this.stop();
        RNIdleTimer.setIdleTimerDisabled(false);
    }

    handleBleDisconnect = () => {
        global.toastShow('设备连接已断开');
        this.props.navigation.goBack();
    }

    goBack = () => {
        let that = this;
        global.toastAlert('结束训练', '退出页面将会结束训练，是否退出？', '', '', (res) => {
            if (res) that.props.navigation.goBack();
        });
    }

    showInit = () => {
        let unit, title, val;
        if (this.state.countType == 1) {
            unit = '圈';
            title = '请输入圈数';
            val = '100';
        } else {
            unit = '分钟';
            title = '请输入分钟数';
            val = '1';
        }
        global.toastNode(<RecodeNode title={title} unit={unit} val={val} onPress={this.initData} />, false);
    }

    initData = (val) => {
        if (val) {
            this.setState({total: val, isInit: true});
        }
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
            let obj = BaseUtil.parseSportData(str);
            if (!obj) return;
            global.config.sport_data = obj;
            obj = deviceObj.formatSportData(obj);
            if (that.state.countType == 1 && obj.total >= that.state.total) that.stop();
            that.setState({obj});
        }
    }

    resetBleData = () => {
        global.config.sport_start_time = BaseUtil.getTimeStamp();
        global.config.sport_data = {};
        let bytes = [0x02, 0x00];
        BLEUtil.writeBLEData(this.state.deviceId, global.config.ble_uuid, 'FD02', bytes);
    }

    stopTimer = () => {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    startTimer = () => {
        let that = this;
        this.timer = setTimeout(function () {
            that.setState({second: that.state.second+1});
            that.startTimer();
        }, 1000);
    }

    stopTimer2 = () => {
        if (this.timer3) {
            clearInterval(this.timer3);
            this.timer3 = null;
        }
    }

    startTimer2 = () => {
        let that = this;
        this.timer3 = setInterval(function () {
            let nowTime = new Date().getTime();
            that.setState({nowTime});
            if (that.state.countType == 2 && nowTime >= that.state.pointTime) {
                clearInterval(that.timer3);
                that.stop();
            }
        }, 20);
    }

    countDown = () => {
        let that = this;
        this.setState({count: 3, showMask: true});
        return new Promise(((resolve, reject) => {
            that.timer2 = setInterval(function () {
                let count = that.state.count - 1;
                that.setState({count: count});
                if (count < 0) {
                    clearInterval(that.timer2);
                    that.setState({showMask: false});
                    resolve(true);
                }
            }, 1000);
        }));
    }

    start = () => {
        let that = this;
        if (!that.state.isInit) {
            this.showInit();
            return;
        }
        this.countDown().then((res) => {
            if (res) {
                that.resetBleData();
                setTimeout(() => {
                    that.startNotify();
                }, 200);
                let nowTime = new Date().getTime();
                let pointTime = nowTime;
                if (that.state.countType == 2) pointTime = pointTime + that.state.total * 60000;
                that.setState({running: true, stop: false, obj: {}, second: 0, pointTime, nowTime});
                that.startTimer2();
            }
        });
    }

    resume = () => {
        this.startNotify();
        this.setState({running: true});
        this.startTimer();
    }

    pause = () => {
        this.stopNotify();
        this.setState({running: false});
        this.stopTimer();
    }

    stop = () => {
        if (this.state.upload) return;
        this.setState({upload: true});
        this.stopNotify();
        this.stopTimer2();
        let that = this;
        global.uploadSportData().then((res) => {
            if (res) {
                that.setState({running: false, stop: true, upload: false});
            }
        });
    }

    renderItem = (val, key, unit = '') => {
        let defaultValue = 0;
        if (key === '心率') defaultValue = 'NA';
        return (
            <View style={styles.dataView}>
                <MyText style={styles.data}>{val || defaultValue}{unit}</MyText>
                <LinearGradient colors={[color.border_0, color.shadow, color.border_0]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.linear}/>
                <MyText style={styles.item}>{key}</MyText>
            </View>
        );
    }

    render() {
        let obj = this.state.obj;
        // let btn = <TouchableOpacity activeOpacity={0.8} style={styles.btnView} onPress={this.pause}>
        //     <Image source={ImageResources.pause} resizeMode={'stretch'} style={styles.btnImg} />
        //     <SpacingView height={6} />
        //     <Heading>暂停</Heading>
        // </TouchableOpacity>;
        // if (!this.state.running) {
        //     btn = <TouchableOpacity activeOpacity={0.8} style={styles.btnView} onPress={this.state.stop ? this.start : this.resume}>
        //         <Image source={ImageResources.start} resizeMode={'stretch'} style={styles.btnImg} />
        //         <SpacingView height={6} />
        //         <Heading>{this.state.stop ? '开始' : '继续'}</Heading>
        //     </TouchableOpacity>;
        // }
        let btn = <TouchableOpacity activeOpacity={0.8} style={styles.btnView} onPress={this.start}>
            <Image source={ImageResources.start} resizeMode={'stretch'} style={styles.btnImg} />
            <SpacingView height={6} />
            <Heading>{'开始'}</Heading>
        </TouchableOpacity>;
        let diff = this.state.nowTime - this.state.pointTime;
        if (this.state.countType == 2) diff = this.state.pointTime - this.state.nowTime;
        let time = BaseUtil.getMTime(diff);
        return (
            <View style={styles.container}>
                <SpacingView height={50} />
                <View style={styles.panel}>
                    <MyText style={styles.data}>{time}</MyText>
                    <SpacingView height={62} />
                    <MyText style={styles.speed}>{obj.total || 0}</MyText>
                    <MyText style={styles.unit}>{this.state.unit}</MyText>
                </View>
                <SpacingView height={47} />
                <View style={commonStyle.rowView}>
                    {this.renderItem(obj.heartRate, '心率', 'bpm')}
                    {this.renderItem(obj.rate, this.state.keys.frequency)}
                    {this.renderItem(obj.consume, '卡路里', 'kcal')}
                </View>
                {/*<SpacingView height={35} />*/}
                {/*<View style={commonStyle.rowView}>*/}
                {/*    {this.renderItem(obj.heartRate, '心率', 'bpm')}*/}
                {/*    {this.renderItem(obj.rate, this.state.keys.frequency)}*/}
                {/*</View>*/}
                <SpacingView height={60} />
                <View style={commonStyle.rowView}>
                    {this.state.stop && btn}
                    {!this.state.stop && <TouchableOpacity activeOpacity={0.8} style={[styles.btnView, styles.btnStopView]} disabled={this.state.upload} onPress={this.stop}>
                        <Image source={ImageResources.stop} resizeMode={'stretch'} style={styles.btnImg} />
                        <SpacingView height={6} />
                        <Heading style={commonStyle.white}>结束</Heading>
                    </TouchableOpacity>}
                </View>
                {this.state.showMask && <View style={styles.mask}>
                    <MyText style={styles.countText}>{this.state.count || '开始'}</MyText>
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        alignItems: 'center',
        backgroundColor: color.panelBg,
    },
    panel: {
        width: ScreenUtil.screenW,
        height: 180,
        alignItems: 'center',
    },
    speed: {
        fontSize: 44,
        lineHeight: 50,
        color: color.white,
    },
    unit: {
        fontSize: 19,
        lineHeight: 20,
        color: color.white,
    },
    dataView: {
        minWidth: 80,
        alignItems: 'center',
        marginLeft: ScreenUtil.screenW / 6 - 40,
        marginRight: ScreenUtil.screenW / 6 - 40,
    },
    data: {
        fontSize: 24,
        lineHeight: 28,
        color: color.paper,
    },
    item: {
        lineHeight: 17,
        color: color.item,
    },
    linear: {
        width: '100%',
        height: 1,
        marginTop: 4,
        marginBottom: 4,
    },
    btnView: {
        marginLeft: 26,
        marginRight: 26,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: color.imgDrop,
    },
    btnStopView: {
        backgroundColor: color.warningDrop,
    },
    btnImg: {
        width: 22,
        height: 22,
    },
    mask: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        backgroundColor: color.toast,
        position: 'absolute',
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countText: {
        fontSize: 50,
        color: color.white,
        fontWeight: 'bold',
    },
});
