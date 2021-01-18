import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import PermissionUtil from '../../utils/PermissionUtil';
import HttpUtil from '../../utils/HttpUtil';
import BaseUtil from '../../utils/BaseUtil';
import StorageUtil from '../../utils/StorageUtil';

import {MyText, Heading} from '../../module/Text';
import TurnDetailCell from '../../module/TurnDetailCell';
import SpacingView from '../../module/SpacingView';
import EditPage from '../../module/mine/EditPage';
import CommonAction from '../../module/CommonAction';

export default class ProfileScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>个人信息</Heading>,
    });

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            actions: ['拍照', '从相册选择'],
            genders: ['男', '女'],
            avatar: (user && user.avatar) || '',
            username: (user && user.username) || '',
            sex: (user && user.sex) || 0,
            change: false,
        };
    }

    componentWillUnmount(): void {
        if (this.state.change) StorageUtil.set('userInfo', global.config.user);
    }

    turnDetail = (index) => {
        switch (index) {
            case 0:
                global.toastActionSheet(<CommonAction confirm={this.uploadAvatar} list={this.state.actions} showCancel={false} />);
                break;
            case 1:
                global.toastPage(<EditPage type={'username'} title={'昵称'} onPress={this.editProfile} val={global.config.user.username} />);
                break;
            case 2:
                global.toastAlert('提示', '修改手机号请到我的-通用功能-账号安全', '', null);
                break;
            case 3:
                global.toastActionSheet(<CommonAction confirm={this.checkSex} list={this.state.genders} showCancel={false} />);
                break;
            case 4:
                break;
        }
    }

    checkSex = (index) => {
        if ([0,1].indexOf(index) == -1) return;
        this.editProfile('sex', index);
    }

    editProfile = (key, val) => {
        let that = this;
        let params = {};
        params[key] = val;
        HttpUtil.post(api.profile, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.user[key] = val;
                let obj = {change: true};
                obj[key] = val;
                this.setState(obj);
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    uploadAvatar = (index) => {
        let that = this;
        if (index == 0) {
            PermissionUtil.requestPermission(['CAMERA']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Camera', {callback: that.uploadPhoto});
                }
            });
        } else {
            let response;
            if (global.platform.isIOS) response = PermissionUtil.requestPermission(['PHOTO_LIBRARY']);
            else response = PermissionUtil.requestPermission(['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']);
            response.then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Album', {maxFiles: 1, callback: that.uploadPhoto});
                }
            });
        }
    }

    uploadPhoto = (imgs) => {
        let that = this;
        if (imgs.length == 0) return;
        let params = {
            filedata: { uri: imgs[0], type: 'image/jpeg', name: 'image.jpg' },
        };
        HttpUtil.postFile(api.uploadAvatar, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.user.avatar = json.data.url;
                that.setState({avatar: json.data.url})
            }
        });
    }

    render() {
        return (
            <>
                <View style={commonStyle.bodyView}>
                    <TurnDetailCell title={'头像'} avatar={this.state.avatar ? {uri: api.cdn + this.state.avatar} : ImageResources.user} border={true} onPress={this.turnDetail.bind(this, 0)} />
                    <TurnDetailCell title={'昵称'} subtitle={this.state.username} border={true} onPress={this.turnDetail.bind(this, 1)} />
                    <TurnDetailCell title={'手机号'} subtitle={global.config.user.phone} border={true} onPress={this.turnDetail.bind(this, 2)} />
                    <TurnDetailCell title={'性别'} subtitle={BaseUtil.getSex(this.state.sex)} border={true} onPress={this.turnDetail.bind(this, 3)} />
                    {/*<TurnDetailCell title={'我的二维码'} border={true} onPress={this.turnDetail.bind(this, 4)} />*/}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
