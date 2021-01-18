import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Image, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import api from '../../common/api';
import color from '../../common/color';
import PermissionUtil from '../../utils/PermissionUtil';
import StorageUtil from '../../utils/StorageUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, MyText} from '../../module/Text';
import InputFrame from '../../module/InputFrame';
import ImageCheckCell from '../../module/index/ImageCheckCell';
import SpacingView from '../../module/SpacingView';
import ScreenUtil from '../../utils/ScreenUtil';
import CommonAction from '../../module/CommonAction';
import BtnCell from '../../module/BtnCell';

export default class FeedbackScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>反馈建议</Heading>),
        headerRight: () => <BtnCell disabled={navigation.state.params.disabled} value={'提交'} width={0.16} onPress={navigation.state.params.navigateSubmit} style={styles.submitBtn} />,
    });

    constructor(props) {
        super(props);

        this.state = {
            actions: ['拍照', '从手机相册选择'],
            imgs: [],
            content: null,
            maxPhotos: 3,
        };
    }

    componentDidMount(): void {
        this.props.navigation.addListener('willFocus', this.handleFocus);
        this.props.navigation.setParams({navigateSubmit: this.submit, disabled: true});
    }

    handleFocus = (payload) => {
        let params = this.props.navigation.state.params;
        if (params.imgs && params.imgs.length > 0) {
            let imgs = this.state.imgs.concat(params.imgs);
            this.setState({imgs});
            this.props.navigation.setParams({imgs: []});
        }
    }

    submit = () => {
        let that = this;
        let imgs = this.state.imgs;
        let params = {
            type: 1,
            text: this.state.content || '',
            ver: global.deviceInfo.version,
        };
        if (params.text.length == 0) return;
        for (let i in imgs) {
            params['files' + i] = { uri: imgs[i], type: 'image/jpeg', name: 'image' + i + '.jpg' };
        }
        global.toastLoading('处理中。。。');
        HttpUtil.postFile(api.feedback, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.props.navigation.setParams({imgs: [], disabled: true});
                global.toastHide(() => {
                    global.toastShow('已收到您的反馈，我们会尽快处理');
                    that.setState({content: null, imgs: []});
                });
            } else {
                global.toastHide(() => {
                    global.toastShow(json.message);
                });
            }
        });
    }

    addPhoto = () => {
        global.toastActionSheet(<CommonAction confirm={this.goToPublish} list={this.state.actions} />);
    }

    goToPublish = (index) => {
        let that = this;
        if (index == 0) {
            PermissionUtil.requestPermission(['CAMERA']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.push('Camera', {routeName: 'Feedback'});
                }
            });
        } else {
            let maxFiles = this.state.maxPhotos - this.state.imgs.length;
            let response;
            if (global.platform.isIOS) response = PermissionUtil.requestPermission(['PHOTO_LIBRARY']);
            else response = PermissionUtil.requestPermission(['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']);
            response.then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.push('Album', {maxFiles: maxFiles, routeName: 'Feedback'});
                }
            });
        }
    }

    checkPhoto = (index) => {
        global.toastImage(<ImageCheckCell photos={this.state.imgs} index={index} callback={this.flushPhoto} />);
    }

    flushPhoto = () => {
        this.forceUpdate();
    }

    _getFeedbackContent = (text, name) => {
        let disabled = true;
        switch (name) {
            case 'content': {
                this.state.content = text;
                if (text.length > 0) disabled = false;
                this.props.navigation.setParams({disabled});
                break;
            }
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <InputFrame name={'content'} type={'textarea'} placeholder={'请详细描述您的问题'}
                            onValueChange={this._getFeedbackContent} value={this.state.content} maxLength={300} style={styles.inputView}
                />
                <SpacingView height={25} />
                <View style={styles.listView}>
                    {this.state.imgs.length > 0 && this.state.imgs.map((info, index) => (
                        <TouchableOpacity activeOpacity={1} style={styles.picView} onPress={this.checkPhoto.bind(this, index)}>
                            <Image source={{uri: info}} style={styles.pic} resizeMode={'cover'} />
                        </TouchableOpacity>
                    ))}
                    {this.state.imgs.length < global.config.maxPhotos && <TouchableOpacity activeOpacity={1} style={[styles.picView, styles.picBtn]} onPress={this.addPhoto}>
                        <Icon name={'ion|add'} color={color.gray} size={60} />
                    </TouchableOpacity>}
                </View>
                <SpacingView height={60} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        padding: 30,
    },
    submitBtn: {
        height: 35,
        marginRight: 15,
    },
    inputView: {
        borderWidth: 0,
        fontSize: 18,
        paddingLeft: 0,
        paddingRight: 0,
        height: 150,
    },
    listView: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    picView: {
        width: ScreenUtil.screenW / 3 - 25,
        height: ScreenUtil.screenW / 3 - 25,
        marginRight: 5,
        marginBottom: 5,
    },
    pic: {
        width: '100%',
        height: '100%',
    },
    picBtn: {
        backgroundColor: color.border,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
    },
});
