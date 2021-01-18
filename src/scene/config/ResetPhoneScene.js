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

export default class ResetPhoneScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>绑定新手机号</Heading>),
    });

    constructor(props) {
        super(props);

        this.state = {
            phone: null,
            code: null,
        };
    }

    _getData = (text, name) => {
        switch (name) {
            case 'phone': this.setState({phone: text}); break;
            case 'code': this.setState({code: text}); break;
        }
    }

    updatePhone = () => {
        let that = this;
        let params = {phone: this.state.phone, code: this.state.code};
        if (!params.phone || !params.phone.isMobile()) return global.toastShow('手机号格式不正确！');
        if (!params.code || params.code.length != global.config.codeLen) return global.toastShow('验证码格式不正确！');
        HttpUtil.post(api.updatePhone, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.toastShow('更新手机号成功');
                that.props.navigation.pop(2);
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
                    <ProfileCell title={'新手机号'} name={'phone'} type={'number'} placeholder={'请输入新手机号'} value={this.state.phone} maxLength={global.config.phoneLen} border={true} onValueChange={this._getData} />
                    <ProfileCell title={'验证码'} name={'code'} type={'number'} placeholder={'请输入验证码'} value={this.state.code} maxLength={global.config.codeLen} phone={this.state.phone} onValueChange={this._getData} />
                </View>
                <SpacingView height={128} />
                <View style={styles.btnView}>
                    <BtnCell value={'提交'} width={0.9} onPress={this.updatePhone} />
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
