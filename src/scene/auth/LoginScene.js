import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';
import StorageUtil from '../../utils/StorageUtil';

import {Heading, MyText, Paragraph} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import PicCell from '../../module/PicCell';
import InputFrame from '../../module/InputFrame';
import BtnCell from '../../module/BtnCell';
import ThirdLoginCell from '../../module/ThirdLoginCell';
import AgreeView from '../../module/auth/AgreeView';

export default class LoginScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        let disable = true;
        let phone = props.navigation.getParam('phone', null);
        if (phone && phone.length == 11) disable = false;
        let user = global.config.user;
        this.state = {
            type: 'phone',
            loginData: {
                phone: null,
                code: null,
                password: null,
            },
            phone: phone,
            isShow: false,
            disabled1: disable,
            disabled2: true,
            isAgree: (user && user.agree) || false,
            firstLoad: true,
        };
    }

    componentDidMount(): void {
        let that = this;
        StorageUtil.get('hasAgree', (json) => {
            if (json) that.setState({isAgree: json});
        });
    }

    goCode = () => {
        let that = this;
        HttpUtil.post(api.sendCode, {phone: this.state.phone}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.props.navigation.navigate('Code', {phone: that.state.phone, begin: true, loginType: 'fastLogin'});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    showPass = () => {
        this.setState({isShow: !this.state.isShow});
    }

    //忘记密码
    forgetPass = () => {
        this.props.navigation.navigate('Forget', {phone: this.state.loginData.phone});
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
                StorageUtil.set('hasAgree', 1);
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
                this.setState({phone: text});
                if (text.length == global.config.phoneLen) {
                    this.setState({disabled1: false});
                } else {
                    this.setState({disabled1: true});
                }
                break;
            case 'code':
                this.state.loginData.code = text;
                break;
            case 'password':
                this.state.loginData.password = text;
                break;
        }
        if (this.state.loginData.phone.length == 11 && this.state.loginData.password && this.state.loginData.password.length > 0) {
            this.setState({disabled2: false});
        } else {
            this.setState({disabled2: true});
        }
    }

    switchLoginType = (type) => {
        if (this.state.type != type) this.setState({type});
    }

    goToAgreement = () => {
        this.props.navigation.navigate('Agreement', {});
    }

    goToPrivacy = () => {
        this.props.navigation.navigate('Privacy', {});
    }

    toggleCheck = () => {
        this.setState({isAgree: !this.state.isAgree});
    }

    callback = (bool) => {
        this.setState({isAgree: bool, firstLoad: false});
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <ImageBackground style={styles.container} source={ImageResources.bg} resizeMode={'cover'}>
                    <SpacingView height={89} />
                    <View style={styles.headerView}>
                        <TouchableOpacity activeOpacity={1} style={styles.header} onPress={this.switchLoginType.bind(this, 'phone')}>
                            <Heading style={styles.title}>手机号登录/注册</Heading>
                            {this.state.type == 'phone' && <View style={styles.borderView}/>}
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={styles.header} onPress={this.switchLoginType.bind(this, 'pass')}>
                            <Heading style={styles.title}>密码登录</Heading>
                            {this.state.type == 'pass' && <View style={styles.borderView}/>}
                        </TouchableOpacity>
                        <View style={{flex:1}}/>
                    </View>
                    <SpacingView height={55} />
                    {this.state.type == 'phone' && <>
                        <InputFrame name={'phone'} placeholder={'请输入手机号码'} type={'number'} value={this.state.phone} maxLength={global.config.phoneLen} onValueChange={this._getLoginData} textColor={color.border} style={commonStyle.authInput} />
                        <SpacingView height={52} />
                        <BtnCell value={'获取验证码'} onPress={this.goCode} disabled={this.state.disabled1 || !this.state.isAgree} />
                    </>}
                    {this.state.type == 'pass' && <>
                        <InputFrame name={'phone'} placeholder={'请输入手机号码'} type={'number'} value={this.state.loginData.phone} maxLength={global.config.phoneLen} onValueChange={this._getLoginData} textColor={color.border} style={commonStyle.authInput} />
                        <SpacingView height={30} />
                        <View style={commonStyle.rowView}>
                            <InputFrame name={'password'} placeholder={'请输入密码'} type={this.state.isShow ? 'default' : 'password'} clear={false} onValueChange={this._getLoginData} textColor={color.border} style={commonStyle.authInput} />
                            <Icon name={this.state.isShow ? 'ion|ios-eye-outline' : 'ion|ios-eye-off-outline'} size={25} color={color.border} style={styles.passIcon} onPress={this.showPass} />
                        </View>
                        <SpacingView height={10} />
                        <View style={commonStyle.rowView}>
                            <View style={commonStyle.fillView}/>
                            <MyText style={styles.forget} onPress={this.forgetPass}>忘记密码</MyText>
                        </View>
                        <SpacingView height={28} />
                        <BtnCell value={'进入'+global.config.appName} onPress={this.goHome} disabled={this.state.disabled2 || !this.state.isAgree} />
                    </>}
                    <TouchableOpacity activeOpacity={1} style={[commonStyle.rowView, styles.agreeView]} onPress={this.toggleCheck}>
                        {!this.state.isAgree && <View style={styles.checkbox} />}
                        {this.state.isAgree && <Icon name={'ion|checkmark-circle'} color={color.white} size={16} />}
                        <MyText style={styles.agreement}>我已阅读并同意BeatX <MyText style={styles.a} onPress={this.goToAgreement}>用户协议</MyText> 和 <MyText style={styles.a} onPress={this.goToPrivacy}>隐私政策</MyText></MyText>
                    </TouchableOpacity>
                    {/*<SpacingView height={20} />*/}
                    {/*<BtnCell style={styles.switchBtn} textStyle={styles.switchBtnText} value={'密码登录'} onPress={this.goReg} />*/}
                    <View style={styles.bottomView}>
                        <Paragraph style={styles.other}>其他登录方式</Paragraph>
                        <ThirdLoginCell agree={this.state.isAgree} />
                    </View>
                    {!this.state.isAgree && this.state.firstLoad && <View style={styles.mask}>
                        <AgreeView callback={this.callback} />
                    </View>}
                </ImageBackground>
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
    headerView: {
        flexDirection: 'row',
    },
    header: {
        alignItems: 'center',
        marginLeft: 32,
    },
    title: {
        color: color.white,
    },
    borderView: {
        width: 15,
        height: 4,
        borderRadius: 2,
        backgroundColor: color.white,
        marginTop: 4,
    },
    // switchBtn: {
    //     backgroundColor: color.white,
    //     borderColor: color.border,
    //     borderWidth: ScreenUtil.onePixel * 2,
    // },
    // switchBtnText: {
    //     color: color.primary,
    // },
    passIcon: {
        position: 'absolute',
        right: 10,
    },
    forget: {
        color: color.border,
        marginRight: 37,
    },
    a: {
        color: color.primary,
        fontSize: 11,
    },
    bottomView: {
        position: 'absolute',
        top: '75%',
        alignItems: 'center',
    },
    other: {
        color: color.border,
    },
    agreeView: {
        padding: 10,
    },
    agreement: {
        fontSize: 11,
        color: color.border,
        marginLeft: 5,
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: color.white,
    },
    mask: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        position: 'absolute',
        zIndex: 3,
        left: 0,
        top: 0,
        backgroundColor: color.backdrop,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
