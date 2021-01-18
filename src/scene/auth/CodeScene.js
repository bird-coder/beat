import React, {PureComponent} from 'react';
import {View, StyleSheet, ImageBackground, TouchableOpacity, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';
import StorageUtil from '../../utils/StorageUtil';

import CodeCell from '../../module/CodeCell';
import {MyText, Heading, Paragraph} from '../../module/Text';
import InputFrame from '../../module/InputFrame';
import BtnCell from '../../module/BtnCell';
import SpacingView from '../../module/SpacingView';
import HeaderBar from '../../module/HeaderBar';
import BackBtn from '../../module/BackBtn';

export default class CodeScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerTitle: () => {},
        headerShown: false,
    })

    constructor(props) {
        super(props);

        let code = {};
        for (let i = 0; i < global.config.codeLen; i++) {
            code['code' + i] = '';
        }
        this.state = {
            code: code,
            phone: this.props.navigation.getParam('phone', null),
            begin: this.props.navigation.getParam('begin', false),
            loginType: this.props.navigation.getParam('loginType', 'fastLogin'),
            disabled: true,
            // isFocus: false,
            index: -1,
            lastIndex: 0,
        };
    }

    componentDidMount() {
        if (this.state.begin) {
            this.setState({begin: false});
            this.props.navigation.setParams({'begin': false});
        }
        Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    }

    componentWillUnmount(): void {
        Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHide);
    }

    handleKeyboardHide = () => {
        let index = this.state.index;
        if (index < 0) index = 0;
        this.setState({index: -1, lastIndex: index});
    }

    focusCode = () => {
        console.log(this.state.index, this.state.lastIndex);
        let index = this.state.lastIndex;
        this.setState({index});
    }

    _getCode = (text, name) => {
        if (name.slice(0, 4) == 'code') {
            let codes = Object.assign({}, this.state.code);
            codes[name] = text;
            if (text.length >= 1) {
                if (this.state.index < global.config.codeLen - 1) {
                    this.state.index++;
                }
            }
            let disabled = false;
            for (let i in codes) {
                if (codes[i].length == 0) disabled = true;
            }
            this.setState({disabled, code: codes, index: this.state.index});
        }
    }

    _onKeyPress = (e) => {
        console.log(e.nativeEvent);
        if (e.nativeEvent.key == 'Backspace') {
            let index = this.state.index;
            if (index > 0) {
                let name = 'code' + index;
                let codes = Object.assign({}, this.state.code);
                if (index == global.config.codeLen - 1 && codes[name] && codes[name].length >= 1) {
                    codes[name] = '';
                } else {
                    index--;
                    for (let i = index; i < global.config.codeLen; i++) {
                        name = 'code' + i;
                        if (codes[name]) codes[name] = '';
                    }
                }
                this.setState({index, code: codes});
            }
        }
    }

    login = () => {
        let that = this;
        let loginData = {phone: this.state.phone, code: Object.values(this.state.code).join('')};
        if (!loginData.phone || !loginData.phone.isMobile()) return global.toastShow('手机号格式不正确！');
        if (!loginData.code || loginData.code.length != global.config.codeLen) return global.toastShow('验证码格式不正确！');
        loginData.uniqueId = global.deviceInfo.uniqueId;
        global.toastLoading('登录中。。。');
        let response;
        if (this.state.loginType == 'thirdLogin') {
            if (Object.values(global.config.thirdAuthInfo).length == 0) {
                global.toastHide(() => {
                    global.toastShow('登录失败，请重新登录');
                    that.props.navigation.replace('Login', {});
                });
                return;
            }
            loginData = Object.assign(loginData, global.config.thirdAuthInfo);
            response = HttpUtil.post(api.thirdLogin, loginData);
        } else {
            response = HttpUtil.post(api.fastLogin, loginData);
        }
        response.then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                StorageUtil.set('token', json.data.token);
                StorageUtil.set('userInfo', json.data.user);
                StorageUtil.set('hasAgree', 1);
                global.config.token = json.data.token;
                if (json.data.user) global.config.user = json.data.user;
                if (json.data.user && json.data.user.uid) global.config.uid = json.data.user.uid;
                global.toastHide();
                StorageUtil.get('skipPass', (bool) => {
                    if (!bool) {
                        StorageUtil.set('skipPass', 1);
                        if (json.data.user.hasPass) that.props.navigation.replace('Tab', {});
                        else that.props.navigation.replace('SetPass', {loginData: loginData});
                    } else {
                        that.props.navigation.replace('Tab', {});
                    }
                });
            } else if (json && json.code == global.config.errno.third_account_bind) {
                global.toastHide(() => {
                    global.toastShow(json.message);
                    global.config.thirdAuthInfo = {};
                    that.props.navigation.replace('Login', {});
                });
            } else if (json && json.code == global.config.errno.third_phone_bind) {
                global.toastHide(() => {
                    global.toastShow(json.message);
                    that.props.navigation.goBack();
                });
            } else {
                global.toastHide(() => {
                    global.toastShow(json.message);
                });
            }
        });
    }

    render() {
        let arr = (new Array(global.config.codeLen)).fill('');
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <ImageBackground style={styles.container} source={ImageResources.bg} resizeMode={'cover'}>
                    <HeaderBar>
                        <BackBtn style={commonStyle.authBack} />
                    </HeaderBar>
                    <View style={styles.view}>
                        <SpacingView height={10} />
                        <Heading style={styles.title}>请输入验证码</Heading>
                        <SpacingView height={12} />
                        <Paragraph style={styles.info}>验证码已通过短信发送至 +86 {this.state.phone}</Paragraph>
                        <SpacingView height={30} />
                        <View style={styles.contentView}>
                            <View style={commonStyle.rowView}>
                                {/*<InputFrame style={styles.input} name={'code'} placeholder={'请输入验证码'} type={'number'} maxLength={global.config.codeLen} onValueChange={this._getCode} isFocus={this.state.isFocus} />*/}
                                {/*<View style={styles.code}>*/}
                                {/*    <CodeCell url={api.sendCode} phone={this.state.phone} begin={this.state.begin} />*/}
                                {/*</View>*/}
                                {arr.map((info, index) => {
                                    let name = 'code' + index;
                                    let value = this.state.code[name] || '';
                                    return (
                                        <InputFrame style={[styles.input, commonStyle.authInput]} name={name} value={value} type={'number'} clear={false} maxLength={1} onValueChange={this._getCode} onKeyPress={this._onKeyPress} isFocus={this.state.index == index} />
                                    );
                                })}
                                <TouchableOpacity activeOpacity={1} onPress={this.focusCode} style={styles.inputView} />
                            </View>
                            <SpacingView height={52} />
                            <BtnCell width={0.87} value={'确定'} onPress={this.login} disabled={this.state.disabled} />
                            <SpacingView height={14} />
                            <CodeCell url={api.sendCode} phone={this.state.phone} begin={this.state.begin} textStyle={styles.code} callback={this.focusCode} />
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        // padding: 25,
    },
    view: {
        flex: 1,
        padding: 25,
    },
    title: {
        color: color.white,
    },
    info: {
        color: color.white,
    },
    inputView: {
        height: '100%',
        width: ScreenUtil.screenW,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        zIndex: 2,
    },
    input: {
        width: 40,
        marginLeft: 8,
        marginRight: 8,
        borderWidth: 0,
    },
    // codeContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // code: {
    //     position: 'absolute',
    //     right: 0,
    // },
    contentView: {
        alignItems: 'center',
    },
    code: {
        color: color.white,
    },
});
