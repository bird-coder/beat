import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import color from '../../common/color';
import StorageUtil from '../../utils/StorageUtil';
import HttpUtil from '../../utils/HttpUtil';

import {MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import TurnDetailCell from '../../module/TurnDetailCell';
import BtnCell from '../../module/BtnCell';
import api from '../../common/api';

export default class ConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({

    })

    constructor(props) {
        super(props);

        this.state = {
            configs: [
                {title: '帐号与安全', route: 'AccountConfig'},
                {title: '申请认证', route: 'AuthConfig'},
                {title: '新消息通知', route: 'NoticeConfig'},
                {title: '隐私', route: 'PrivacyConfig'},
                {title: '通用', route: 'CommonConfig'},
                {title: '帮助与反馈', route: 'FeedbackConfig'},
                {title: '关于', route: 'AboutConfig', subtitle: '版本 ' + global.deviceInfo.version},
            ],
        };
    }

    turnConfigDetail = (index) => {
        let config = this.state.configs[index];
        if (!config) return false;
        this.props.navigation.navigate(config.route, {title: config.title});
    }

    logout = () => {
        let that = this;
        global.toastAlert('退出登录', '您确定要退出登录吗？', '确定', '取消', (res) => {
            if (res) {
                HttpUtil.post(api.logout, {}).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        let phone = global.config.user.phone;
                        StorageUtil.remove('token');
                        global.config.token = null;
                        global.config.user = {};
                        global.config.uid = 0;
                        that.props.navigation.replace('Login', {phone: phone});
                    }
                });
            }
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.view}>
                    <TurnDetailCell onPress={this.turnConfigDetail.bind(this, 0)} title={this.state.configs[0].title} border={true} />
                    <TurnDetailCell onPress={this.turnConfigDetail.bind(this, 1)} title={this.state.configs[1].title} />
                </View>
                <SpacingView />
                <View style={styles.view}>
                    <TurnDetailCell onPress={this.turnConfigDetail.bind(this, 2)} title={this.state.configs[2].title} border={true} />
                    <TurnDetailCell onPress={this.turnConfigDetail.bind(this, 3)} title={this.state.configs[3].title} border={true} />
                    <TurnDetailCell onPress={this.turnConfigDetail.bind(this, 4)} title={this.state.configs[4].title} />
                </View>
                <SpacingView />
                <View style={styles.view}>
                    <TurnDetailCell onPress={this.turnConfigDetail.bind(this, 5)} title={this.state.configs[5].title} border={true} />
                    <TurnDetailCell onPress={this.turnConfigDetail.bind(this, 6)} title={this.state.configs[6].title} subtitle={this.state.configs[6].subtitle} />
                </View>
                <SpacingView />
                <BtnCell value={'退出登录'} onPress={this.logout} width={1} style={styles.logout} textStyle={styles.logoutText} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.paper,
    },
    view: {
        backgroundColor: color.white,
    },
    logout: {
        borderRadius: 0,
        backgroundColor: color.white,
    },
    logoutText: {
        color: color.black,
        fontWeight: 'normal',
    },
});
