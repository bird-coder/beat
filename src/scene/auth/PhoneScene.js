import React, {PureComponent} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import api from '../../common/api';
import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, MyText, Paragraph} from '../../module/Text';
import ScreenUtil from '../../utils/ScreenUtil';
import SpacingView from '../../module/SpacingView';
import InputFrame from '../../module/InputFrame';
import BtnCell from '../../module/BtnCell';

export default class PhoneScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            phone: null,
            disabled: true,
        };
    }

    goCode = () => {
        let that = this;
        HttpUtil.post(api.sendCode, {phone: this.state.phone}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.props.navigation.navigate('Code', {phone: that.state.phone, begin: true, loginType: 'thirdLogin'});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    _getData = (text, name) => {
        switch (name) {
            case 'phone':
                this.state.phone = text;
                this.setState({phone: text});
                if (text.length == global.config.phoneLen) {
                    this.setState({disabled: false});
                } else {
                    this.setState({disabled: true});
                }
                break;
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <ImageBackground style={styles.container} source={ImageResources.bg} resizeMode={'cover'}>
                    <SpacingView height={89} />
                    <Heading style={commonStyle.white}>绑定手机号</Heading>
                    <SpacingView height={12} />
                    <Paragraph style={commonStyle.white}>绑定手机号可提升账号安全性</Paragraph>
                    <SpacingView height={31} />
                    <InputFrame name={'phone'} placeholder={'请输入手机号码'} type={'number'} value={this.state.phone} maxLength={global.config.phoneLen} onValueChange={this._getData} textColor={color.border} style={commonStyle.authInput} />
                    <SpacingView height={57} />
                    <BtnCell value={'下一步'} onPress={this.goCode} disabled={this.state.disabled} />
                </ImageBackground>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        padding: 25,
    },
});
