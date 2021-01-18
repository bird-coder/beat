import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {withNavigation} from 'react-navigation';

import color from '../common/color';
import api from '../common/api';
import ImageResources from '../common/image';
import PermissionUtil from '../utils/PermissionUtil';
import HttpUtil from '../utils/HttpUtil';

import {MyText} from '../module/Text';
import AvatarCell from './AvatarCell';
import CommonAction from './CommonAction';

class UploadCell extends PureComponent {
    static propTypes = {
        avatar: PropTypes.any,
        style: PropTypes.object,
        callback: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            actions: ['拍照', '从手机相册选择'],
        };
    }

    upload = () => {
        global.toastActionSheet(<CommonAction confirm={this.selectUpload} list={this.state.actions} showCancel={false} />);
    }

    selectUpload = (index) => {
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
                if (that.props.callback) that.props.callback(json.data.url);
                // that.setState({avatar: json.data.url});
            }
        });
    }

    render() {
        return (
            <AvatarCell icon={this.props.avatar} onPress={this.upload} style={[styles.avatar, this.props.style]} />
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
});

export default withNavigation(UploadCell);
