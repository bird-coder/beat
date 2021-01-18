import React, {PureComponent} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';
import {withNavigation} from 'react-navigation';

import api from '../common/api';
import color from '../common/color';
import ImageResources from '../common/image';
import commonStyle from '../common/style';
import ScreenUtil from '../utils/ScreenUtil';
import HttpUtil from '../utils/HttpUtil';
import StorageUtil from '../utils/StorageUtil';

import {Heading3, MyText} from '../module/Text';
import PicCell from './PicCell';
import LoginUtil from '../utils/LoginUtil';
import AppleAuthCell from './AppleAuthCell';

class ThirdLoginCell extends PureComponent {
    static propTypes = {
        agree: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    goUMAuth = (index) => {
        if (!this.props.agree) {
            global.toastShow('请先同意用户协议');
            return;
        }
        let that = this;
        LoginUtil.UMAuth(index).then((res) => {
            if (res) {
                global.config.thirdAuthInfo = res;
                global.config.thirdAuthInfo.platform = index;
                let params = {thirdId: res.openid};
                that.thirdAuth(index, params);
            }
        });
    }

    goAppleAuth = (appleId = false) => {
        if (!this.props.agree) {
            global.toastShow('请先同意用户协议');
            return;
        }
        if (appleId) {
            global.config.thirdAuthInfo = {platform: 2, appleId};
            this.thirdAuth(2, {thirdId: appleId});
        }
    }

    thirdAuth = (index, params) => {
        let that = this;
        if ([0,1,2].indexOf(index*1) == -1) return;
        if (!params || Object.values(params).length == 0) return;
        params.platform = index;
        params.uniqueId = global.deviceInfo.uniqueId;
        params.bundleId = global.deviceInfo.bundleid;
        params.version = global.deviceInfo.version;
        global.toastLoading();
        HttpUtil.post(api.thirdAuth, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.toastHide();
                global.config.thirdAuthInfo = {};
                StorageUtil.set('token', json.data.token);
                StorageUtil.set('userInfo', json.data.user);
                StorageUtil.set('hasAgree', 1);
                let loginType = '微信';
                switch (index) {
                    case 0: loginType = '微信'; break;
                    case 1: loginType = 'QQ'; break;
                    case 2: loginType = 'Apple'; break;
                }
                StorageUtil.set('loginType', loginType);
                global.config.token = json.data.token;
                if (json.data.user) global.config.user = json.data.user;
                if (json.data.user && json.data.user.uid) global.config.uid = json.data.user.uid;
                that.props.navigation.replace('Tab', {});
            } else if (json.code == global.config.errno.third_account_unbind) {
                global.toastHide();
                that.props.navigation.replace('Phone', {});
            } else {
                global.toastHide(() => {
                    global.toastShow(json.message);
                });
            }
        });
    }

    renderAppleBtn = () => {
        return (
            <AppleAuthCell onPress={this.goAppleAuth}>
                <Image source={ImageResources.icon_apple} resizeMode={'cover'} style={styles.icon} />
            </AppleAuthCell>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <PicCell icon={ImageResources.icon_wx} style={styles.icon} onPress={this.goUMAuth.bind(this, 0)} />
                <PicCell icon={ImageResources.icon_qq} style={styles.icon} onPress={this.goUMAuth.bind(this, 1)} />
                {global.platform.isIOS && this.renderAppleBtn()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginTop: 10,
        // marginBottom: 10,
    },
    icon: {
        width: 40,
        height: 40,
        margin: 24,
    },
});

export default withNavigation(ThirdLoginCell);
