import React, {PureComponent} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText, Paragraph} from '../../module/Text';
import BackBtn from '../../module/BackBtn';
import HeaderBar from '../../module/HeaderBar';
import SpacingView from '../../module/SpacingView';
import InputFrame from '../../module/InputFrame';
import BtnCell from '../../module/BtnCell';
import CodeCell from '../../module/CodeCell';

export default class ForgetScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
    })

    constructor(props) {
        super(props);

        let phone = props.navigation.getParam('phone', null);
        this.state = {
            loginData: {
                phone: phone,
                code: null,
            },
            phone: phone,
            disabled: true,
        };
    }

    _getLoginData = (text, name) => {
        switch (name) {
            case 'phone':
                this.state.loginData.phone = text;
                this.setState({phone: text});
                break;
            case 'code':
                this.state.loginData.code = text;
                break;
        }
        if (this.state.loginData.phone.length == global.config.phoneLen && this.state.loginData.code.length == global.config.codeLen) {
            this.setState({disabled: false});
        } else {
            this.setState({disabled: true});
        }
    }

    goNext = () => {
        let that = this;
        if (!this.state.loginData.phone || !this.state.loginData.phone.isMobile()) return global.toastShow('手机号格式不正确！');
        if (!this.state.loginData.code || this.state.loginData.code.length != global.config.codeLen) return global.toastShow('请输入完整的验证码');
        HttpUtil.post(api.checkPhone, this.state.loginData).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.props.navigation.navigate('UpdatePass', {loginData: that.state.loginData});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <ImageBackground style={styles.container} source={ImageResources.bg} resizeMode={'cover'}>
                    <HeaderBar>
                        <BackBtn style={commonStyle.authBack} />
                    </HeaderBar>
                    <View style={styles.view}>
                        <SpacingView height={10} />
                        <Heading style={commonStyle.white}>手机号验证</Heading>
                        <SpacingView height={12} />
                        <Paragraph style={commonStyle.white}>需要先验证您的手机号</Paragraph>
                        <SpacingView height={30} />
                        <InputFrame name={'phone'} placeholder={'请输入手机号码'} type={'number'} value={this.state.phone} maxLength={global.config.phoneLen} onValueChange={this._getLoginData} textColor={color.border} style={commonStyle.authInput} />
                        <SpacingView height={30} />
                        <View style={commonStyle.rowView}>
                            <InputFrame name={'code'} placeholder={'请输入验证码'} type={'number'} clear={false} maxLength={global.config.codeLen} onValueChange={this._getLoginData} textColor={color.border} style={commonStyle.authInput} />
                            <CodeCell url={api.sendCode} phone={this.state.phone} style={styles.codeView} textStyle={commonStyle.white} />
                        </View>
                        <SpacingView height={52} />
                        <BtnCell value={'下一步'} onPress={this.goNext} disabled={this.state.disabled} />
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
        alignItems: 'center',
    },
    view: {
        flex: 1,
        padding: 25,
    },
    codeView: {
        position: 'absolute',
        right: 0,
    },
});
