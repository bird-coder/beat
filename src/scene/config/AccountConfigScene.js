import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import ImageResources from '../../common/image';
import commonStyle from '../../common/style';
import HttpUtil from '../../utils/HttpUtil';
import StorageUtil from '../../utils/StorageUtil';
import LoginUtil from '../../utils/LoginUtil';
import BLEUtil from '../../utils/BLEUtil';

import {Heading, Heading3, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import SmallBtnCell from '../../module/SmallBtnCell';
import TurnCheckCell from '../../module/TurnCheckCell';
import AppleAuthCell from '../../module/AppleAuthCell';

export default class AccountConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    })

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            services: [
                {title: '微信', checked: (user && !!user.bind_wx) || false},
                {title: 'QQ', checked: (user && !!user.bind_qq) || false},
                {title: 'Apple ID', checked: (user && !!user.bind_apple) || false},
            ],
            type: '手机号',
        };
    }

    componentDidMount(): void {
        let that = this;
        StorageUtil.get('loginType', (json) => {
            if (json) that.setState({type: json});
        });
    }

    editPass = () => {
        this.props.navigation.navigate('ResetPass', {});
    }

    changePhone = () => {
        this.props.navigation.navigate('CheckPhone', {});
    }

    toggleCheck = (index) => {
        let that = this;
        let service = this.state.services[index];
        if (!service) return;
        if (!service.checked) {
            if (index != 2) {
                LoginUtil.UMAuth(index).then((res) => {
                    if (res) {
                        that.bindThird(index, res);
                    }
                });
            }
        } else {
            that.unbindThird(index);
        }
    }

    toggleAppleCheck = (appleId = false) => {
        console.log('apple账号绑定', appleId);
        if (appleId) {
            this.bindThird(2, {appleId});
        } else {
            this.unbindThird(2);
        }
    }

    bindThird = (index, params) => {
        let that = this;
        let services = Object.assign([], this.state.services);
        let service = services[index];
        if (!service) return;
        if (!params || Object.values(params).length == 0) return;
        params.platform = index;
        params.uniqueId = global.deviceInfo.uniqueId;
        global.toastLoading();
        HttpUtil.post(api.bindThirdPlatform, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                service.checked = true;
                that.setState({services});
                that.toggleBind(index, 1);
                global.toastHide();
            } else {
                global.toastHide(() => {
                    global.toastShow(json.message);
                });
            }
        });
    }

    unbindThird = (index) => {
        let that = this;
        let services = Object.assign([], this.state.services);
        let service = services[index];
        if (!service) return;
        let params = {platform: index, uniqueId: global.deviceInfo.uniqueId};
        global.toastLoading();
        HttpUtil.post(api.unbindThirdPlatform, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                service.checked = false;
                that.setState({services});
                that.toggleBind(index, 0);
                global.toastHide();
            } else {
                global.toastHide(() => {
                    global.toastShow(json.message);
                });
            }
        });
    }

    toggleBind = (index = 0, bind = 0) => {
        switch (index) {
            case 0: global.config.bind_wx = bind; break;
            case 1: global.config.bind_qq = bind; break;
            case 2: global.config.bind_apple = bind; break;
        }
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
                        BLEUtil.stopBLEDevicesDiscovery();
                        if (global.config.deviceObj.connect) {
                            BLEUtil.disconnectBLE(global.config.deviceObj.deviceInfo.id);
                        }
                        that.props.navigation.replace('Login', {phone: phone});
                    }
                });
            }
        });
    }

    renderAppleBtn = (info: Object) => {
        let img = info.checked ? ImageResources.switch_on : ImageResources.switch_off;
        return (
            <View style={styles.checkView}>
                <Heading3 numberOfLines={1}>{info.title}</Heading3>
                <View style={commonStyle.fillView} />
                <AppleAuthCell checked={info.checked} onPress={this.toggleAppleCheck}>
                    <Image source={img} resizeMode={'stretch'} style={styles.checkBtn} />
                </AppleAuthCell>
            </View>
        );
    }

    render() {
        return (
            <>
                <MyText style={styles.title}>您已使用{this.state.type}登录{global.config.appName}</MyText>
                <View style={styles.phoneView}>
                    <MyText style={styles.info}>手机号</MyText>
                    <MyText style={styles.info}>{global.config.user.phone}</MyText>
                    <View style={commonStyle.fillView} />
                    <SmallBtnCell value={'修改密码'} onPress={this.editPass} />
                </View>
                <MyText style={styles.title}>点击此处<MyText style={styles.phoneBtn} onPress={this.changePhone}>更换手机号</MyText></MyText>
                <SpacingView height={30} />
                <MyText style={styles.title}>第三方账号绑定</MyText>
                <View style={commonStyle.bodyView}>
                    {this.state.services.length > 0 && this.state.services.map((info, index) => {
                        let bool = index < this.state.services.length - 1;
                        if (index < 2) {
                            return (
                                <TurnCheckCell title={info.title} border={bool} checked={info.checked} onPress={this.toggleCheck.bind(this, index)} />
                            );
                        } else if (index == 2 && global.platform.isIOS) {
                            return this.renderAppleBtn(info);
                        }
                    })}
                </View>
                <SpacingView />
                <BtnCell value={'退出登录'} onPress={this.logout} width={1} style={commonStyle.rowBtn} textStyle={commonStyle.rowBtnText} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        color: color.info,
        paddingLeft: 11,
        paddingTop: 8,
        paddingBottom: 8,
    },
    phoneView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.white,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 15,
        paddingBottom: 15,
    },
    info: {
        fontSize: 14,
        lineHeight: 20,
        marginRight: 33,
    },
    edit: {
        paddingLeft: 7.5,
        paddingRight: 7.5,
    },
    phoneBtn: {
        color: color.primary,
    },
    checkView: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    checkBtn: {
        width: 44,
        height: 22,
    },
});
