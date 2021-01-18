import React, {PureComponent} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import StorageUtil from '../../utils/StorageUtil';
import BLEUtil from '../../utils/BLEUtil';
import BaseUtil from '../../utils/BaseUtil';
import HttpUtil from '../../utils/HttpUtil';
import LocationUtil from '../../utils/LocationUtil';

import {MyText, Heading, Paragraph} from '../../module/Text';
import BtnCell from '../BtnCell';
import SpacingView from '../SpacingView';
import MyImage from '../MyImage';

import MachineFactory from '../../machine/MachineFactory';

class BleDeviceNode extends PureComponent {
    static propTypes = {
        device: PropTypes.object.isRequired,
        navigation: PropTypes.instanceOf(navigator).isRequired,
    };

    constructor(props) {
        super(props);

        let deviceInfo;
        let deviceData = props.device.data;
        let key = deviceData.stype + '_' + deviceData.deviceId + '_' + deviceData.factoryId;
        global.config.deviceObj = MachineFactory.getDevice(deviceData.stype);
        if (global.config.devicePics[key]) deviceInfo = global.config.devicePics[key];
        else {
            deviceInfo = {
                pic: global.config.deviceObj.devicePic,
                stype: deviceData.stype,
                factory: deviceData.factoryId,
                model: deviceData.deviceId,
            };
        }
        this.state = {
            connecting: false,
            deviceInfo: deviceInfo,
        };
        this.timer = null;
    }

    componentDidMount(): void {
        if (global.config.coordinate.lat == 0 && global.config.coordinate.lng == 0) {
            LocationUtil.getLocation();
        }
    }

    stopTimer = () => {
        this.setState({connecting: false});
        clearTimeout(this.timer);
        this.timer = null;
    }

    addBLEDevice = (device) => {
        StorageUtil.get('BLEDevice', (json) => {
            let obj = {};
            if (json && Object.keys(json).length > 0) {
                obj = json;
            }
            if (obj[device.data.address]) return;
            device.data.uid = global.config.uid;
            obj[device.data.address] = device.data;
            StorageUtil.set('BLEDevice', obj);
        });
    }

    goConnect = () => {
        let that = this;
        let device = this.props.device;
        this.setState({connecting: true});
        this.timer = setTimeout(() => {
            if (that.state.connecting) that.setState({connecting: false});
        }, 5000);
        StorageUtil.get('BLEDevice', (obj) => {
            if (obj && obj[device.data.address] && obj[device.data.address].uid == global.config.uid) {
                that.connectBle(device.id);
            } else {
                let params = device.data;
                params.uniqueId = global.deviceInfo.uniqueId;
                params.lng = global.config.coordinate.lng;
                params.lat = global.config.coordinate.lat;
                HttpUtil.post(api.checkBleDevice, params).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        that.connectBle(device.id);
                    } else {
                        global.toastHide(() => {
                            global.toastShow(json.message);
                        });
                    }
                });
            }
        });
    }

    connectBle = (deviceId) => {
        let that = this;
        BLEUtil.connectBLE(deviceId).then((res) => {
            if (res) {
                global.changeBLEState('connected');
                BLEUtil.getBLEDeviceServices(deviceId).then((services) => {
                    BLEUtil.onBLECharacteristicValueChange(that.handleBlePair);
                    that.startNotify(services);
                });
            }
        });
    }

    startNotify = (services) => {
        let device = this.props.device;
        let items = Object.values(services.characteristics);
        for (let i in items) {
            let item = items[i];
            if (item.service != global.config.ble_uuid) continue;
            if (item.characteristic.toUpperCase() == 'FE01') {
                BLEUtil.startNotify(device.id, item.service, item.characteristic);
            }
        }
    }

    stopNotify = () => {
        BLEUtil.stopNotify(this.props.device.id, global.config.ble_uuid, 'FE01');
        BLEUtil.cancelBLECharacteristicValueChange();
    }

    handleBlePair = (res) => {
        let that = this;
        let device = this.props.device;
        if (device.id != res.peripheral) return;
        let characteristic = res.characteristic;
        if (global.platform.isAndroid) characteristic = characteristic.slice(4, 8);
        if (characteristic.toUpperCase() == 'FE01') {
            let bytes = BaseUtil.pairBleDevice(res.value);
            setTimeout(function () {
                BLEUtil.writeBLEData(res.peripheral, res.service, res.characteristic, bytes).then((bool) => {
                    if (bool) {
                        that.addBLEDevice(that.props.device);
                        if (typeof global.config.deviceObj.setDeviceInfo === 'function') global.config.deviceObj.setDeviceInfo(that.props.device);
                        that.stopTimer();
                        global.toastHide(() => {
                            that.props.navigation.dispatch(NavigationActions.navigate({routeName: 'SportMode'}));
                        });
                    }
                });
            }, 300);
        }
    }

    componentWillUnmount(): void {
        this.stopNotify();
        this.stopTimer();
    }

    render() {
        let str = this.state.connecting ? '连接中。。。' : '连接';
        let deviceInfo = this.state.deviceInfo;
        return (
            <View style={styles.container}>
                <Heading style={commonStyle.bold}>发现设备</Heading>
                <SpacingView height={15} />
                <MyImage source={deviceInfo.pic} style={styles.deviceImg} />
                <SpacingView height={15} />
                <View style={commonStyle.rowView}>
                    <Paragraph style={commonStyle.info}>生产厂家: {deviceInfo.factory}</Paragraph>
                    <View style={commonStyle.fillView}/>
                    <Paragraph style={commonStyle.info}>设备型号: {deviceInfo.model}</Paragraph>
                    <View style={commonStyle.fillView}/>
                </View>
                <SpacingView height={40} />
                <BtnCell value={str} onPress={this.goConnect} disabled={this.state.connecting} style={styles.btn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: color.white,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    deviceImg: {
        width: ScreenUtil.screenW - 48,
        height: 140,
    },
    btn: {
        width: '100%',
    },
});

export default BleDeviceNode;
