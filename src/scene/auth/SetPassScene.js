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
import {MyView} from '../../module/MyView';
import SpacingView from '../../module/SpacingView';
import InputFrame from '../../module/InputFrame';
import BtnCell from '../../module/BtnCell';

export default class SetPassScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        // headerLeft: () => {},
        // headerRight: () => (<MyText onPress={navigation.state.params.navigatePress} style={styles.headerRight}>跳过</MyText>),
        headerShown: false,
    })

    constructor(props) {
        super(props);

        let data = this.props.navigation.state.params.loginData;
        this.state = {
            loginData: {
                phone: data.phone,
                code: data.code,
                password: null,
                repasswd: null,
            },
        };
    }

    // componentDidMount(): void {
    //     this.props.navigation.setParams({navigatePress: this.skip});
    // }

    skip = () => {
        this.props.navigation.navigate('SetBasic', {});
    }

    _getLoginData = (text, name) => {
        switch (name) {
            case 'password': this.state.loginData.password = text; break;
            case 'repasswd': this.state.loginData.repasswd = text; break;
        }
    }

    setPass = () => {
        let that = this;
        let password = this.state.loginData.password;
        if (!password || password.length < 8 || password.length > 15) return global.toastShow('密码长度必须为8-15位！');
        if (!password.checkPassword()) return global.toastShow('密码必须包含字母，数字及特殊字符其中两种！');
        if (password != this.state.loginData.repasswd) return global.toastShow('两次输入的密码不一致！');
        HttpUtil.post(api.setPassword, this.state.loginData).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                // global.toastShow('修改成功！', function () {
                    that.props.navigation.replace('SetBasic', {});
                // });
            } else if (json && json.code == global.config.errno.code_timeout) {
                global.toastShow(json.message);
                that.props.navigation.goBack();
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <ImageBackground style={styles.container} source={ImageResources.bg} resizeMode={'cover'}>
                    <SpacingView height={89} />
                    <Heading style={commonStyle.white}>设置密码</Heading>
                    <SpacingView height={12} />
                    <Paragraph style={commonStyle.white}>密码必须包含字母，数字及特殊字符其中两种</Paragraph>
                    <SpacingView height={31} />
                    <InputFrame name={'password'} placeholder={'请输入密码'} type={'password'} onValueChange={this._getLoginData} textColor={color.border} style={commonStyle.authInput} />
                    <SpacingView height={30} />
                    <InputFrame name={'repasswd'} placeholder={'请重复密码'} type={'password'} onValueChange={this._getLoginData} textColor={color.border} style={commonStyle.authInput} />
                    <SpacingView height={57} />
                    <BtnCell value={'完成'} onPress={this.setPass} />
                </ImageBackground>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        padding: 30,
    },
    // headerRight: {
    //     fontSize: 16,
    //     paddingRight: 10,
    //     color: color.black,
    // },
});
