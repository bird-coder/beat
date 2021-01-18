import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, Image, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import api from '../../common/api';
import ScreenUtil from '../../utils/ScreenUtil';
import StorageUtil from '../../utils/StorageUtil';
import PermissionUtil from '../../utils/PermissionUtil';
import HttpUtil from '../../utils/HttpUtil';

import {MyText, Heading} from '../../module/Text';
import BtnCell from '../../module/BtnCell';
import InputFrame from '../../module/InputFrame';
import SpacingView from '../../module/SpacingView';
import CommonAction from '../../module/CommonAction';
import TurnDetailCell from '../../module/TurnDetailCell';
import ImageCheckCell from '../../module/index/ImageCheckCell';

export default class TrendSubmitScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <Heading style={styles.backBtn} onPress={navigation.state.params.navigatePress}>取消</Heading>,
        headerRight: () => <BtnCell disabled={navigation.state.params.disabled} value={'发布'} width={0.16} onPress={navigation.state.params.navigateSubmit} style={styles.submitBtn} />
    });

    constructor(props) {
        super(props);

        this.state = {
            actions: ['拍照', '从手机相册选择'],
            privates: ['公开', '仅自己可见'],
            private: 0,
            imgs: [],
            content: null,
            type: 'img',
        };
    }

    componentDidMount(): void {
        let that = this;
        let params = this.props.navigation.state.params;
        this.props.navigation.addListener('willFocus', this.handleFocus);
        this.props.navigation.setParams({navigatePress: this.goBack, navigateSubmit: this.submit});
        if (params.type == 'text') {
            this.setState({type: params.type, content: params.content});
            this.toggleSubmit();
        }
    }

    handleFocus = (payload) => {
        let params = this.props.navigation.state.params;
        if (!params.type || params.type != 'img') return;
        if (params.imgs && params.imgs.length > 0) {
            let imgs = this.state.imgs.concat(params.imgs);
            let obj = {imgs: imgs};
            if (params.content && params.content.length > 0) {
                obj.content = params.content;
            }
            this.setState(obj);
            this.props.navigation.setParams({imgs: [], disabled: false});
        }
    }

    goBack = () => {
        let that = this;
        global.toastAlert('将此次编辑保留？', '', '保留', '不保留', function (res) {
            if (res) {
                if (that.state.type == 'img') StorageUtil.set('TrendImgTemp', JSON.stringify({imgs: that.state.imgs, content: that.state.content}));
                else StorageUtil.set('TrendTextTemp', that.state.content);
            } else {
                if (that.state.type == 'img') StorageUtil.remove('TrendImgTemp');
                else StorageUtil.remove('TrendTextTemp');
            }
            that.props.navigation.pop(2);
        });
    }

    submit = () => {
        let that = this;
        let imgs = this.state.imgs;
        let params = {
            type: this.state.type,
            content: this.state.content || '',
        };
        if (this.state.type == 'img') {
            if (imgs.length == 0) return;
            for (let i in imgs) {
                params['files' + i] = { uri: imgs[i], type: 'image/jpeg', name: 'image' + i + '.jpg' };
            }
        } else {
            if (params.content.length == 0) return;
        }
        global.toastLoading('发布中。。。');
        HttpUtil.postFile(api.sendTrend, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                StorageUtil.remove('TrendImgTemp');
                StorageUtil.remove('TrendTextTemp');
                DeviceEventEmitter.emit('trendSubmitCallback', 'success');
                that.props.navigation.pop(2);
                global.toastHide();
            } else {
                global.toastHide(() => {
                    global.toastShow(json.message);
                });
            }
        });
    }

    toggleSubmit = () => {
        let disabled = true;
        if (this.state.type == 'text') {
            if (this.state.content.length > 0) disabled = false;
        } else {
            if (this.state.imgs.length > 0) disabled = false;
        }
        this.props.navigation.setParams({disabled: disabled});
    }

    _getTrendContent = (text, name) => {
        switch (name) {
            case 'content': {
                this.state.content = text;
                this.toggleSubmit();
                break;
            }
        }
    }

    addPhoto = () => {
        global.toastActionSheet(<CommonAction confirm={this.goToPublish} list={this.state.actions} />);
    }

    goToPublish = (index) => {
        let that = this;
        if (index == 0) {
            PermissionUtil.requestPermission(['CAMERA']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.push('Camera', {routeName: 'TrendSubmit'});
                }
            });
        } else {
            let maxFiles = global.config.maxPhotos - this.state.imgs.length;
            let response;
            if (global.platform.isIOS) response = PermissionUtil.requestPermission(['PHOTO_LIBRARY']);
            else response = PermissionUtil.requestPermission(['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']);
            response.then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.push('Album', {maxFiles: maxFiles, routeName: 'TrendSubmit'});
                }
            });
        }
    }

    checkPhoto = (index) => {
        global.toastImage(<ImageCheckCell photos={this.state.imgs} index={index} callback={this.flushPhoto} />);
    }

    flushPhoto = () => {
        this.toggleSubmit();
        this.forceUpdate();
    }

    getLocation = () => {

    }

    checkPrivate = () => {
        global.toastActionSheet(<CommonAction confirm={this.changePrivate} list={this.state.privates} />);
    }

    changePrivate = (index) => {
        if ([0, 1].indexOf(index) == -1) return;
        this.setState({private: index});
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <InputFrame name={'content'} type={'textarea'} placeholder={'这一刻的想法...'}
                            onValueChange={this._getTrendContent} value={this.state.content} maxLength={300} style={styles.inputView}
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
                {/*<View style={styles.fillView} />*/}
                {/*<TurnDetailCell title={'所在位置'} icon={'ion|location-outline'} onPress={this.getLocation} border={true} />*/}
                {/*<TurnDetailCell title={'谁可以看'} icon={'ion|ios-person-outline'} subtitle={this.state.privates[this.state.private]} onPress={this.checkPrivate} border={true} />*/}
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
    backBtn: {
        paddingLeft: 15,
    },
    submitBtn: {
        height: 35,
        // backgroundColor: color.wechat,
        marginRight: 15,
    },
    inputView: {
        borderWidth: 0,
        fontSize: 18,
        paddingLeft: 0,
        paddingRight: 0,
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
    fillView: {
        width: '100%',
        backgroundColor: color.border,
        height: ScreenUtil.onePixel,
    },
});
