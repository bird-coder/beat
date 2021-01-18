import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import SplashScreen from 'react-native-splash-screen';
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast';
import {BaiduMapManager} from 'react-native-baidu-map';

import api from './common/api';
import color from './common/color';
import ImageResources from './common/image';
import ScreenUtil from './utils/ScreenUtil';
import StorageUtil from './utils/StorageUtil';
import HttpUtil from './utils/HttpUtil';

export default class BranchScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            isDone: false,
        };
    }

    auth = () => {
        let that = this;
        StorageUtil.get('hasEnter', (bool) => {
            if (!bool) {
                that.props.navigation.replace('Guide', {});
            } else {
                StorageUtil.get('token', (res) => {
                    if (!res) {
                        that.props.navigation.replace('Login', {});
                        return;
                    }
                    global.config.token = res;
                    HttpUtil.post(api.auth, {uniqueId: global.deviceInfo.uniqueId}).then((json) => {
                        if (!json) return;
                        if (json && json.code == 0) {
                            StorageUtil.set('token', json.data.token);
                            StorageUtil.set('userInfo', json.data.user);
                            global.config.token = json.data.token;
                            if (json.data.user) global.config.user = json.data.user;
                            if (json.data.user && json.data.user.uid) global.config.uid = json.data.user.uid;
                            that.props.navigation.replace('Tab', {});
                        } else {
                            global.toastShow(json.message);
                            StorageUtil.remove('token');
                            that.props.navigation.replace('Login', {});
                        }
                    });
                });
            }
        });
    }

    goCheckVersion () {
        let that = this;
        let response = HttpUtil.get(api.VersionUrl, {'bundleId': global.deviceInfo.bundleid, 'version': global.deviceInfo.version});
        response.then((json) => {
            console.log('数据更新接口' + JSON.stringify(json));
            if (!json) return;
            if (json && json.code == 0 && json.data.audit === 1) {
                that.auth();
            } else {
                that.auth();
            }
        });
    }

    goCodePush () {
        let that = this;
        CodePush.checkForUpdate().then((update) => {
            console.log('检查更新' + '______________' + update + JSON.stringify(update));
            if (update) {
                console.log('更新数据aaaaaaa');
                CodePush.sync(
                    {
                        installMode: CodePush.InstallMode.IMMEDIATE,
                        updateDialog: false,
                    },
                    this.codePushStatusDidChange.bind(this),
                    this.codePushDownloadDidProgress.bind(this),
                );
            } else {
                console.log('不更新aaaaaaaa');
                that.auth();
            }
        });
    }

    codePushStatusDidChange (syncStatus) {
        console.log('更新状态' + syncStatus + JSON.stringify(CodePush.SyncStatus));
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log('更新进行在' + CodePush.SyncStatus.CHECKING_FOR_UPDATE);
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                Toast.show('正在下载更新。。。', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                Toast.show('安装更新内容。。。', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                Toast.show('应用已更新到最新版本！', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
                this.setState({isDone: true});
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                Toast.show('更新内容已安装，重启生效', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
                this.setState({isDone: true});
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                Toast.show('未知错误！', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
                break;
        }
    }

    codePushDownloadDidProgress (progress) {
        let progressPercent = (progress.receivedBytes / progress.totalBytes * 100).toFixed(1) + '%';
        this.setState({progressPercent});
    }

    componentDidMount() {
        SplashScreen.hide();
        if (global.platform.isIOS) BaiduMapManager.initSDK(global.config.iosMapAK);
        CodePush.notifyAppReady();
        // this.goCheckVersion();
        this.checkNetState();
        // NetInfo.addEventListener(this._handleFirstConnectivityChange);
    }

    checkNetState = () => {
        let that = this;
        NetInfo.fetch().then((state: NetInfoState) => {
            that.goCheckVersion();
            if (!state.isInternetReachable) {
                StorageUtil.get('userInfo', (json) => {
                    if (json && json.uid) {
                        global.config.user = json;
                        global.config.uid = json.uid;
                    }
                });
                StorageUtil.get('hasEnter', (bool) => {
                    if (!bool) {
                        that.props.navigation.replace('Guide', {});
                    } else {
                        StorageUtil.get('token', (json) => {
                            if (json) {
                                that.props.navigation.replace('Tab', {});
                            } else {
                                that.props.navigation.replace('Login', {});
                            }
                        });
                    }
                });
            }
        });
    }

    _handleFirstConnectivityChange = (state: NetInfoState) => {
        if (state.isConnected) this.goCheckVersion();
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={ImageResources.screen} style={styles.backgroundImage} resizeMode={'cover'} />
                {this.state.progressPercent && <View style={styles.view}><Text style={styles.messages}>已下载{this.state.progressPercent}</Text></View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.white,
        flex: 1,
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: ScreenUtil.screenW,
    },
    view: {
        position: 'absolute',
        marginTop: ScreenUtil.screenH * 0.65,
        padding: 10,
        backgroundColor: color.text,
        borderRadius: 3,
    },
    messages: {
        color: color.white,
    }
})
