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

export default class ResetPassScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>更改密码</Heading>),
    });

    constructor(props) {
        super(props);

        this.state = {
            password: null,
            newPass: null,
            rePass: null,
        };
    }

    _getData = (text, name) => {
        switch (name) {
            case 'password': this.setState({password: text}); break;
            case 'newPass': this.setState({newPass: text}); break;
            case 'rePass': this.setState({rePass: text}); break;
        }
    }

    updatePass = () => {
        let that = this;
        let params = {password: this.state.password, newPass: this.state.newPass, rePass: this.state.rePass};
        if (!params.password || params.password.length < 8 || params.password.length > 15) return global.toastShow('原密码错误');
        if (!params.password.checkPassword()) return global.toastShow('原密码错误');
        if (params.password == params.newPass) return global.toastShow('新密码与原密码相同');
        if (!params.newPass || params.newPass.length < 8 || params.newPass.length > 15) return global.toastShow('密码长度必须为8-15位！');
        if (!params.newPass.checkPassword()) return global.toastShow('密码必须包含字母，数字及特殊字符其中两种！');
        if (params.rePass != params.newPass) return global.toastShow('两次输入的密码不一致！');
        HttpUtil.post(api.updatePass, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.toastShow('更新密码成功');
                that.props.navigation.goBack();
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
                    <ProfileCell title={'原密码'} name={'password'} type={'password'} placeholder={'请输入原密码'} value={this.state.password} border={true} onValueChange={this._getData} />
                    <ProfileCell title={'新密码'} name={'newPass'} type={'password'} placeholder={'请输入新密码'} value={this.state.newPass} border={true} onValueChange={this._getData} />
                    <ProfileCell title={'确认密码'} name={'rePass'} type={'password'} placeholder={'请重复密码'} value={this.state.rePass} onValueChange={this._getData} />
                </View>
                <SpacingView height={79} />
                <View style={styles.btnView}>
                    <BtnCell value={'提交'} width={0.9} onPress={this.updatePass} />
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
