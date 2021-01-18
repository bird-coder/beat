import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';
import StorageUtil from '../../utils/StorageUtil';

import {MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import PicCell from '../../module/PicCell';
import InputFrame from '../../module/InputFrame';
import CodeCell from '../../module/CodeCell';
import BtnCell from '../../module/BtnCell';
import ThirdLoginCell from '../../module/ThirdLoginCell';

export default class RegScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            loginData: {
                phone: this.props.navigation.getParam('phone', null),
                password: null,
            },
            disabled: true,
        };
    }

    backToLogin = () => {
        this.props.navigation.goBack();
    }

    showPass = () => {
        this.setState({isShow: !this.state.isShow});
    }

    //忘记密码
    forgetPass = () => {
        this.props.navigaiton.navigate('Forget', {phone: this.state.loginData.phone});
    }

    goHome = () => {
        let that = this;
        if (!this.state.loginData.phone || !this.state.loginData.phone.isMobile()) return global.toastShow('手机号格式不正确！');
        if (!this.state.loginData.password || this.state.loginData.password.length < 8 || this.state.loginData.password.length > 15) return global.toastShow('密码长度必须为8-15位！');
        if (!this.state.loginData.password.checkPassword()) return global.toastShow('密码必须包含字母，数字及特殊字符其中两种！');
        this.state.loginData.uniqueId = global.deviceInfo.uniqueId;
        HttpUtil.post(api.passLogin, this.state.loginData).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.toastShow('登录成功！');
                StorageUtil.set('token', json.data.token);
                StorageUtil.set('userInfo', json.data.user);
                global.config.token = json.data.token;
                if (json.data.user) global.config.user = json.data.user;
                if (json.data.user && json.data.user.uid) global.config.uid = json.data.user.uid;
                that.props.navigation.replace('Tab', {});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    _getLoginData = (text, name) => {
        switch (name) {
            case 'phone':
                this.state.loginData.phone = text;
                break;
            case 'password':
                this.state.loginData.password = text;
                break;
        }
        if (this.state.loginData.phone.length == 11 && this.state.loginData.password.length > 0) {
            this.setState({disabled: false});
        } else {
            this.setState({disabled: true});
        }
    }

    goToAgreement = () => {
        this.props.navigation.navigate('Agreement', {});
    }

    goToPrivacy = () => {
        this.props.navigation.navigate('Privacy', {});
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <View style={styles.container}>
                    <SpacingView height={80} />
                    <PicCell icon={ImageResources.logo} style={styles.image} />
                    <SpacingView height={60} />
                    <InputFrame name={'phone'} placeholder={'请输入手机号码'} type={'number'} value={this.state.loginData.phone} maxLength={global.config.phoneLen} onValueChange={this._getLoginData} />
                    <SpacingView height={20} />
                    <View style={styles.passContainer}>
                        <InputFrame name={'password'} placeholder={'请输入密码'} type={this.state.isShow ? 'default' : 'password'} clear={false} onValueChange={this._getLoginData} />
                        <Icon name={this.state.isShow ? 'ios-eye' : 'ios-eye-off'} size={25} style={styles.passIcon} onPress={this.showPass} />
                    </View>
                    <SpacingView height={40} />
                    <BtnCell value={'登录'} onPress={this.goHome} disabled={this.state.disabled} />
                    <SpacingView height={20} />
                    <BtnCell style={styles.switchBtn} textStyle={styles.switchBtnText} value={'短信验证码登录'} onPress={this.backToLogin} />
                    <SpacingView height={10} />
                    <View style={styles.forgetView}>
                        <MyText style={styles.a} onPress={this.forgetPass}>忘记密码</MyText>
                    </View>
                    <View style={styles.bottomView}>
                        <MyText>其他登录方式</MyText>
                        <ThirdLoginCell />
                        <MyText>登录即表明同意 <MyText style={styles.a} onPress={this.goToAgreement}>用户协议</MyText> 和 <MyText style={styles.a} onPress={this.goToPrivacy}>隐私政策</MyText></MyText>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        alignItems: 'center',
    },
    image: {
        width: ScreenUtil.screenW * 0.3,
    },
    switchBtn: {
        backgroundColor: color.white,
        borderColor: color.border,
        borderWidth: ScreenUtil.onePixel * 2,
    },
    switchBtnText: {
        color: color.primary,
    },
    passContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passIcon: {
        position: 'absolute',
        right: 10,
    },
    forgetView: {
        width: '100%',
        alignItems: 'flex-end',
        paddingRight: 35,
    },
    a: {
        color: color.darkblue,
    },
    bottomView: {
        position: 'absolute',
        top: '75%',
        alignItems: 'center',
    },
    agreement: {
        position: 'absolute',
        top: global.platform.isIOS ? ScreenUtil.screenH - 50 : ScreenUtil.screenH - 70, //适配android
        fontSize: 12,
    },
    agree: {
        color: color.black,
        fontWeight: '500',
    },
});
