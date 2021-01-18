import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';
import StorageUtil from '../../utils/StorageUtil';

import {Heading2, MyText} from '../../module/Text';
import AvatarCell from '../../module/AvatarCell';
import InputFrame from '../../module/InputFrame';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import UploadCell from '../../module/UploadCell';

export default class SetBasicScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => {},
        headerTitle: () => {},
        headerRight: () => (<MyText onPress={navigation.state.params.navigatePress} style={commonStyle.headerRight}>跳过</MyText>),
    })

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            avatar: (user && user.avatar) || null,
            username: (user && user.username) || null,
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({navigatePress: this.skip});
    }

    skip = () => {
        this.props.navigation.replace('SetSex', {});
    }

    _getUsername = (text, name) => {
        switch (name) {
            case 'username': this.state.username = text; break;
        }
    }

    setAvatar = (avatar) => {
        this.setState({avatar});
    }

    setBasic = () => {
        let that = this;
        if (!this.state.avatar) return global.toastShow('请上传头像');
        if (!this.state.username || this.state.username.length == 0) return global.toastShow('请填写昵称');
        HttpUtil.post(api.profile, {username: this.state.username}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.user.username = that.state.username;
                that.props.navigation.navigate('SetSex', {});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    // setUserInfo = () => {
    //     global.config.userBasic = {};
    //     if (this.state.avatar) global.config.userBasic.avatar = this.state.avatar;
    //     if (this.state.username) global.config.userBasic.avatar = this.state.username;
    // }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <View style={commonStyle.setBody}>
                    <SpacingView height={35} />
                    <Heading2>完善个人信息</Heading2>
                    <SpacingView height={12} />
                    <MyText style={commonStyle.info}>填写真实信息有助于计划定制</MyText>
                    <SpacingView height={47} />
                    <UploadCell avatar={this.state.avatar} callback={this.setAvatar} />
                    <SpacingView height={56} />
                    <InputFrame style={[styles.input, commonStyle.authInfoView]} name={'username'} type={'text'} placeholder={'请输入昵称'} value={this.state.username} onValueChange={this._getUsername} textColor={color.text} />
                    <SpacingView height={88} />
                    <BtnCell value={'下一步'} onPress={this.setBasic} style={commonStyle.setBtn} />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    input: {
        borderWidth: 0,
        borderRadius: 0,
        padding: 0,
        fontSize: 18,
        lineHeight: 25,
        height: 45,
        textAlign: 'center',
    },
});
