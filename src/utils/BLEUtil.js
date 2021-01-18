import {NativeModules, NativeEventEmitter} from 'react-native';
import BleManager from 'react-native-ble-manager';
import DeviceInfo from 'react-native-device-info';

import BaseUtil from './BaseUtil';
import PermissionUtil from './PermissionUtil';
import SettingUtil from './SettingUtil';
import StorageUtil from './StorageUtil';

const BleManagerModule = NativeModules.BleManager;
const BleManageEmitter = new NativeEventEmitter(BleManagerModule);

export default class BLEUtil {
    //打开蓝牙
    static openBLE = () => {
        if (global.platform.isAndroid) {
            //android需要获取权限
            PermissionUtil.requestPermission(['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    BleManager.start({showAlert: false}).then(() => {
                        BleManager.checkState();
                        console.log('ble init the module success');
                    }).catch((err) => {
                        console.log('ble init the module failed', err);
                    });
                } else if (!res) {
                    PermissionUtil.openSetting();
                }
            });
        } else {
            PermissionUtil.requestPermission(['BLUETOOTH_PERIPHERAL']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    BleManager.start({showAlert: false}).then(() => {
                        BleManager.checkState();
                        console.log('ble init the module success');
                    }).catch((err) => {
                        console.log('ble init the module failed', err);
                    });
                } else if (!res) {
                    PermissionUtil.openSetting();
                }
            });
        }
    };

    //监听蓝牙状态
    static onBLEStateChange = (cb) => {
        BleManageEmitter.addListener('BleManagerDidUpdateState', (res) => {
            console.log('BleManagerDidUpdateState:', res);
            if (typeof cb === 'function') cb(res);
        });
    };

    //取消监听蓝牙状态
    static cancelBLEStateChange = () => {
        BleManageEmitter.removeAllListeners('BleManagerDidUpdateState');
    }

    //搜索蓝牙设备
    static startBLEDevicesDiscovery = () => {
        if (!global.config.bleScan) global.config.bleScan = true;
        DeviceInfo.isLocationEnabled().then((bool) => {
            if (bool) {
                StorageUtil.get('useDeviceTip', (json) => {
                    if (json) {
                        setTimeout(() => {
                            global.changeBLEState('searching');
                            BleManager.scan([], 60, true).then(() => {
                                console.log('ble scan started');
                            }).catch((err) => {
                                console.log('ble scan start failed', err);
                            });
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            global.toastAlert('使用提示', '请轻触设备以开启蓝牙连接', '我知道了', null, (res) => {
                                if (res) {
                                    StorageUtil.set('useDeviceTip', 1);
                                    global.changeBLEState('searching');
                                    BleManager.scan([], 60, true).then(() => {
                                        console.log('ble scan started');
                                    }).catch((err) => {
                                        console.log('ble scan start failed', err);
                                    });
                                }
                            });
                        }, 2000);
                    }
                });
            } else {
                if (global.isToast()) {
                    global.toastHide(() => {
                        global.toastAlert('打开定位', '前往设置打开手机定位以使用蓝牙', '', '', (res) => {
                            if (res) {
                                SettingUtil.openLocationSetting();
                            }
                        });
                    });
                } else {
                    global.toastAlert('打开定位', '前往设置打开手机定位以使用蓝牙', '', '', (res) => {
                        if (res) {
                            SettingUtil.openLocationSetting();
                        }
                    });
                }
            }
        });
    };

    //停止搜索蓝牙设备
    static stopBLEDevicesDiscovery = () => {
        BleManager.stopScan().then(() => {
            console.log('ble scan stopped');
        }).catch((err) => {
            console.log('ble scan stop failed', err);
        });
    };

    //监听停止搜索蓝牙设备的事件
    static onStopBLEScan = (cb) => {
        BleManageEmitter.addListener('BleManagerStopScan', (res) => {
            console.log('ble scan is stopped', res);
            if (typeof cb === 'function') cb();
        });
    }

    //取消监听停止搜索蓝牙设备的事件
    static cancelStopBLEScan = () => {
        BleManageEmitter.removeAllListeners('BleManagerStopScan');
    }

    //监听寻找到新设备的事件
    static onBLEDeviceFound = (cb) => {
        BleManageEmitter.addListener('BleManagerDiscoverPeripheral', (res) => {
            let device = BaseUtil.filterBleDevice(res);
            if (!device) return;
            if (typeof cb === 'function') cb(device);
        });
    };

    //取消监听寻找到新设备的事件
    static cancelBLEDeviceFound = () => {
        BleManageEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    }

    //获取已连接的设备
    static getConnectedBLEDevice = (serviceUUIDs) => {
        return BleManager.getConnectedPeripherals(serviceUUIDs).then((res) => {
            console.log('ble connected peripherals: ', JSON.stringify(res));
            return res;
        });
    }

    //判断制定设备是否已连接
    static checkBLEDeviceConnect = (deviceId, serviceUUIDs) => {
        return BleManager.isPeripheralConnected(deviceId, serviceUUIDs).then((res) => {
            if (res) console.log("ble peripheral is connected!");
            else console.log("ble peripheral is not connected!");
            return res;
        });
    }

    //连接蓝牙设备
    static connectBLE = (deviceId) => {
        return BleManager.connect(deviceId).then(() => {
            console.log('ble connect ok');
            return true;
        }).catch((err) => {
            console.log('ble connect error', err);
        });
    };

    //断开蓝牙连接
    static disconnectBLE = (deviceId) => {
        return BleManager.disconnect(deviceId).then(() => {
            console.log('ble disconnect');
            return true;
        }).catch((err) => {
            console.log('ble disconnect error', err);
        });
    };

    //监听蓝牙设备连接事件
    static onBLEConnect = (cb) => {
        BleManageEmitter.addListener('BleManagerConnectPeripheral', (res) => {
            console.log('BleManagerConnectPeripheral', res);
            if (typeof cb === 'function') cb(res);
        });
    };

    //取消监听蓝牙设备连接事件
    static cancelBLEConnect = (cb) => {
        BleManageEmitter.removeAllListeners('BleManagerConnectPeripheral');
    }

    //监听蓝牙设备断开连接事件
    static onBLEDisconnect = (cb) => {
        BleManageEmitter.addListener('BleManagerDisconnectPeripheral', (res) => {
            console.log('BleManagerDisconnectPeripheral', res);
            if (typeof cb === 'function') cb(res);
        });
    };

    //取消监听蓝牙设备断开连接事件
    static cancelBLEDisconnect = () => {
        BleManageEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
    }

    //获取蓝牙设备服务
    static getBLEDeviceServices = (deviceId) => {
        return BleManager.retrieveServices(deviceId).then((services) => {
            console.log('ble services', services);
            return services;
        });
    };

    //打开通知
    static startNotify = (deviceId, serviceId, characteristic) => {
        return BleManager.startNotification(deviceId, serviceId, characteristic).then((res) => {
            console.log('ble Notification started', res);
            return res;
        }).catch((err) => {
            console.log('ble Notification error', err);
        });
    };

    //关闭通知
    static stopNotify = (deviceId, serviceId, characteristic) => {
        return BleManager.stopNotification(deviceId, serviceId, characteristic).then((res) => {
            console.log('ble stopNotification success!', res);
            return res;
        }).catch((err) => {
            console.log('ble stopNotification error', err);
        });
    };

    //监听特征值变化
    static onBLECharacteristicValueChange = (cb) => {
        BleManageEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (res) => {
            console.log('ble BluetoothUpdateValue', res);
            let service = res.service;
            if (global.platform.isAndroid) service = service.slice(4, 8);
            if (service != global.config.ble_uuid) return;
            if (typeof cb === 'function') cb(res);
        });
    };

    //取消监听特征值变化
    static cancelBLECharacteristicValueChange = () => {
        BleManageEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic');
    }

    //读蓝牙数据
    static readBLEData = (deviceId, serviceId, characteristic) => {
        BleManager.read(deviceId, serviceId, characteristic).then((res) => {
            console.log('ble read data success', res);
        }).catch((err) => {
            console.log('ble read data error', err);
        });
    }

    //写蓝牙数据
    static writeBLEData = (deviceId, serviceId, characteristic, bytes) => {
        return BleManager.writeWithoutResponse(deviceId, serviceId, characteristic, bytes).then(() => {
            console.log('ble write data success', bytes);
            return true;
        }).catch((err) => {
            console.log('ble write data error', err);
            return false;
        });
    }

    //取消所有监听事件
    static cancelAllBLEEvent = () => {
        BLEUtil.cancelBLEStateChange();
        BLEUtil.cancelBLEDeviceFound();
        BLEUtil.cancelStopBLEScan();
        BLEUtil.cancelBLECharacteristicValueChange();
    }
}
