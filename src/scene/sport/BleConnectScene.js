import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import color from '../../common/color';
import ScreenUtil from '../../utils/ScreenUtil';
import BLEUtil from '../../utils/BLEUtil';

import {MyText} from '../../module/Text';
import BtnCell from '../../module/BtnCell';
import BleDeviceCell from '../../module/sport/BleDeviceCell';

export default class BleConnectScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({});

    constructor(props) {
        super(props);

        this.state = {
            devices: {},
            disabled: false,
        };
    }

    componentDidMount(): void {
        let that = this;
        BLEUtil.onBLEDeviceFound(this.getBleDevices);
        BLEUtil.onStopBLEScan(function () {
            that.setState({disabled: false});
        });
        this.scanBleDevice();
    }

    componentWillUnmount(): void {
        BLEUtil.cancelStopBLEScan();
        BLEUtil.cancelBLEDeviceFound();
    }

    getBleDevices = (device) => {
        if (!device) return;
        let devices = this.state.devices;
        if (!!devices[device.id]) return;
        devices[device.id] = device;
        this.setState({devices: this.state.devices});
    }

    scanBleDevice = () => {
        this.setState({disabled: true});
        BLEUtil.startBLEDevicesDiscovery();
    }

    connectBle = (index) => {
        let device = this.state.devices[index];
        if (!device) return;
        let deviceId = device.id;

    }

    render() {
        let devices = Object.values(this.state.devices);
        return (
            <View style={styles.container}>
                <ScrollView style={styles.deviceView}>
                    {devices.length > 0 && devices.map((info, index) => (
                        <BleDeviceCell device={info} key={index} onPress={this.connectBle.bind(this, index)} />
                    ))}
                </ScrollView>
                <View style={styles.bottomView}>
                    <BtnCell value={'重新搜索'} width={0.9} onPress={this.scanBleDevice} style={styles.searchBtn} disabled={this.state.disabled} />
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
    deviceView: {
        alignItems: 'center',
        padding: 15,
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        padding: 15,
        backgroundColor: color.white,
        alignItems: 'center',
    },
    searchBtn: {

    },
});
