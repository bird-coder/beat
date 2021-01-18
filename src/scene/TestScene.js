import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';

import BLEUtil from '../utils/BLEUtil';

import {MyText} from '../module/Text';
import BtnCell from '../module/BtnCell';

export default class TestScene extends PureComponent {
    render() {
        return (
            <View>
                <MyText>测试</MyText>
                <BtnCell onPress={() => {BLEUtil.openBLE()}} value={'打开蓝牙'} />
                <BtnCell onPress={() => {BLEUtil.onBLEStateChange()}} value={'监听蓝牙状态'} />
                <BtnCell onPress={() => {BLEUtil.startBLEDevicesDiscovery()}} value={'搜索蓝牙设备'} />
                <BtnCell onPress={() => {BLEUtil.stopBLEDevicesDiscovery()}} value={'停止搜索蓝牙设备'} />
                <BtnCell onPress={() => {BLEUtil.onBLEDeviceFound()}} value={'监听寻找到新设备'} />
                <BtnCell onPress={() => {BLEUtil.connectBLE('B2E269B7-E6A3-6BFB-15FA-8E2826AE129A')}} value={'连接蓝牙'} />
                <BtnCell onPress={() => {BLEUtil.onBLEConnect()}} value={'监听蓝牙设备连接'} />
            </View>
        );
    }
}
