import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, Linking} from 'react-native';
import CodePush from 'react-native-code-push';
import Toast from 'react-native-root-toast';

import color from '../../common/color';
import api from '../../common/api';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {MyText, Heading} from '../../module/Text';
import PicCell from '../../module/PicCell';
import TurnDetailCell from '../../module/TurnDetailCell';
import SpacingView from '../../module/SpacingView';

export default class AboutConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title || '关于我们'}</Heading>,
    })

    constructor(props) {
        super(props);

        this.state = {
            isDone: false,
        };
        this.toast = null;
    }

    turnDetail = (index) => {
        switch (index) {
            case 0: this.goToAppStore(); break;
            case 1: this.showCustomService(); break;
            case 2: this.showComplain(); break;
            case 3: this.goCheckVersion(); break;
        }
    }

    goToAppStore = () => {
        Linking.openURL('itms-apps://itunes.apple.com/cn/app/id1532379799?mt=8');
    }

    showComplain = () => {
        global.toastNode(<View><MyText>客服热线：18758292040</MyText></View>);
    }

    showCustomService = () => {
        global.toastNode(<View><MyText>举报电话：18758292040</MyText></View>);
    }

    goCheckVersion = () => {
        this.toast = Toast.show('正在检查更新。。。', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
        let response = HttpUtil.get(api.VersionUrl, {'bundleId': global.deviceInfo.bundleid, 'version': global.deviceInfo.version});
        response.then((json) => {
            console.log('数据更新接口' + JSON.stringify(json));
            if (!json) return;
            if (json && json.code == 0 && json.data.audit === 1) {
                this.goCodePush();
            } else {
                Toast.hide(this.toast);
                Toast.show('当前已是最新版本', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
            }
        });
    }

    goCodePush () {
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
                Toast.hide(this.toast);
                Toast.show('当前已是最新版本', {duration: Toast.durations.LONG, position: Toast.positions.CENTER});
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

    render() {
        return (
            <View style={styles.container}>
                <PicCell icon={ImageResources.logo} style={styles.image} />
                <SpacingView height={8} />
                <MyText style={styles.title}>{global.config.appName}</MyText>
                <SpacingView height={2} />
                <MyText style={styles.subtitle}>Version {global.deviceInfo.version}</MyText>
                <SpacingView height={30} />
                <View style={styles.configView}>
                    <View style={styles.fillView} />
                    {global.platform.isIOS && <TurnDetailCell title={'去评分'} onPress={this.turnDetail.bind(this, 0)} border={true} />}
                    {/*<TurnDetailCell title={'客服'} onPress={this.turnDetail.bind(this, 1)} border={true} />*/}
                    {/*<TurnDetailCell title={'投诉'} onPress={this.turnDetail.bind(this, 2)} border={true} />*/}
                    {/*<TurnDetailCell title={'版本更新'} onPress={this.turnDetail.bind(this, 3)} border={true} />*/}
                </View>
                <View style={styles.bottomView}>
                    <MyText style={styles.content}>健蓝公司 版权所有</MyText>
                    <SpacingView height={5} />
                    <MyText style={styles.content}>Copyright © 2019-2020 jltech. All Rights Reserved.️</MyText>
                </View>
                {this.state.progressPercent && <View style={styles.view}><Text style={styles.messages}>已下载{this.state.progressPercent}</Text></View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: color.white,
    },
    image: {
        width: 90,
        height: 90,
        marginTop: 29,
    },
    title: {
        fontSize: 20,
        lineHeight: 21,
        fontWeight: 'bold',
        color: color.text,
    },
    subtitle: {
        color: color.info,
        fontSize: 15,
        lineHeight: 16,
    },
    fillView: {
        width: '100%',
        backgroundColor: color.border,
        height: ScreenUtil.onePixel,
    },
    configView: {
        width: ScreenUtil.screenW,
        paddingLeft: 12,
        paddingRight: 12,
    },
    bottomView: {
        position: 'absolute',
        top: '90%',
        alignItems: 'center',
    },
    content: {
        color: color.info,
        fontSize: 12,
        lineHeight: 16,
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
    },
});
