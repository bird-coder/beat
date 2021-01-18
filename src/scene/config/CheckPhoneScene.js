import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import ProfileCell from '../../module/mine/ProfileCell';
import BtnCell from '../../module/BtnCell';

export default class CheckPhoneScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>验证原手机号</Heading>),
    });

    constructor(props) {
        super(props);

        this.state = {
            code: null,
        };
    }

    _getCode = (text, name) => {
        switch (name) {
            case 'code': this.setState({code: text}); break;
        }
    }

    goToReset = () => {
        let that = this;
        let params = {phone: global.config.user.phone, code: this.state.code};
        if (!params.phone || !params.phone.isMobile()) return global.toastShow('手机号格式不正确！');
        if (!params.code || params.code.length != global.config.codeLen) return global.toastShow('验证码格式不正确！');
        HttpUtil.post(api.checkPhone, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.props.navigation.navigate('ResetPhone', {});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <SpacingView height={5} />
                <View style={commonStyle.bodyView}>
                    <ProfileCell title={'原手机号'} name={'phone'} type={'number'} value={global.config.user.phone} maxLength={global.config.phoneLen} disabled={true} border={true} />
                    <ProfileCell title={'验证码'} name={'code'} type={'number'} placeholder={'请输入验证码'} value={this.state.code} maxLength={global.config.codeLen} phone={global.config.user.phone} onValueChange={this._getCode} />
                </View>
                <SpacingView height={128} />
                <View style={styles.btnView}>
                    <BtnCell value={'提交'} width={0.9} onPress={this.goToReset} />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    btnView: {
        alignItems: 'center',
    },
});
