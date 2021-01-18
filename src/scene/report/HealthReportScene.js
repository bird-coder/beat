import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import PermissionUtil from '../../utils/PermissionUtil';
import HttpUtil from '../../utils/HttpUtil';
import FileUtil from '../../utils/FileUtil';

import {Heading, Heading3, MyText, Paragraph} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import CommonAction from '../../module/CommonAction';
import TurnDetailCell from '../../module/TurnDetailCell';
import MyImage from '../../module/MyImage';

export default class HealthReportScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>健康数据</Heading>),
    });

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            actions: ['拍照', '从手机相册选择'],
            details: [
                {title: '体重', record: user.weight || '', unit: 'kg', icon: ImageResources.icon_weight},
                {title: '身高', record: user.height || '', unit: 'cm', icon: ImageResources.icon_height},
                {title: 'BMI值', record: user.bmi || '', unit: '', icon: ImageResources.icon_bmi},
                {title: '心率', record: user.heart_rate || '', unit: 'bpm', icon: ImageResources.icon_heart_rate},
            ],
            pics: [],
            total: 0,
        };
    }

    componentDidMount(): void {
        this.requestBodyPhoto();
        this.listener = DeviceEventEmitter.addListener('bodyUpdateCallback', this.handleBodyUpdate);
    }

    componentWillUnmount(): void {
        this.listener.remove();
    }

    handleBodyUpdate = (obj) => {
        let details = Object.assign([], this.state.details);
        details[obj.index].record = obj.record;
        this.setState({details});
    }

    requestBodyPhoto = () => {
        let that = this;
        HttpUtil.httpCache(api.getUserBodyPhoto, {}, -1, HttpUtil.BodyPhotoCacheKey).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({pics: json.data.list, total: parseInt(json.data.total)});
            } else {
                global.toastShow(json.message);
            }
        });
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
        FileUtil.getStat(imgs[0]).then((timestamp) => {
            if (timestamp) params['ctime'] = timestamp;
            HttpUtil.postFile(api.uploadBodyPhoto, params).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    HttpUtil.clearAllCache(HttpUtil.BodyPhotoCacheKey);
                    let pics = Object.assign([], that.state.pics);
                    pics.push(json.data.url);
                    that.state.total += imgs.length;
                    that.setState({pics: pics, total: that.state.total});
                } else {
                    global.toastShow(json.message);
                }
            });
        });
    }

    goToDetail = (index) => {
        this.props.navigation.navigate('BodyReport', {index: index});
    }

    checkPhoto = () => {
        this.props.navigation.navigate('BodyPhoto', {callback: this.handlePhoto});
    }

    handlePhoto = (photos, total) => {
        this.setState({pics: photos, total});
    }

    renderPicView = () => {
        let len = this.state.total;
        let picView = <TouchableOpacity activeOpacity={1} onPress={this.upload} style={styles.headerView}>
            <SpacingView height={43} />
            <Heading3 style={styles.headerText}><Icon name={'ion|camera'} size={20} color={color.primary} /> 添加剪影</Heading3>
            <SpacingView height={14} />
            <MyText style={commonStyle.info}>开始添加身体剪影吧，见证自己的变化</MyText>
        </TouchableOpacity>;
        if (len > 0) picView = <View style={[styles.headerView, commonStyle.bodyView]}>
            <SpacingView height={9} />
            <View style={commonStyle.rowView}>
                <Paragraph style={commonStyle.bold}>身材剪影(私密）</Paragraph>
                <MyText style={commonStyle.info}>记录身材变化的私密相册</MyText>
                <View style={commonStyle.fillView}/>
                <Icon name={'ion|camera'} size={18} color={color.text} onPress={this.upload} />
            </View>
            <SpacingView height={16} />
            <View style={styles.picView}>
                {this.state.pics.map((info, index) => {
                    if (index < 3) return (
                        <TouchableOpacity activeOpacity={1} style={styles.picItem} onPress={this.checkPhoto} key={index}>
                            <MyImage source={info+'_'} style={styles.pic}/>
                        </TouchableOpacity>
                    );
                    if (index == 3) return (
                        <TouchableOpacity activeOpacity={1} style={styles.picItem} onPress={this.checkPhoto} key={index}>
                            <MyImage source={info+'_'} style={styles.pic}/>
                            {len > 4 && <View style={styles.num}>
                                <MyText style={{color: color.white}}>全部剪影</MyText>
                                <MyText style={{color: color.white}}>+{len - 4}</MyText>
                            </View>}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>;
        return picView;
    }

    render() {
        return (
            <View>
                <SpacingView height={5} />
                {this.renderPicView()}
                <SpacingView height={5} />
                <View style={commonStyle.bodyView}>
                    {this.state.details.map((info, index) => {
                        let bool = true;
                        if (index == this.state.details.length - 1) bool = false;
                        return (
                            <TurnDetailCell title={info.title} subtitle={info.record ? info.record + info.unit : ''} iconPic={info.icon} onPress={this.goToDetail.bind(this, index)} border={bool} picStyle={styles.icon} style={styles.detail} textStyle={styles.record} />
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    headerView: {
        height: 150,
        backgroundColor: color.white,
        alignItems: 'center',
    },
    headerText: {
        color: color.primary,
    },
    detail: {
        paddingTop: 21,
        paddingBottom: 21,
        height: 66,
    },
    record: {
        fontSize: 16,
        lineHeight: 20,
        color: color.text,
        fontWeight: 'bold',
    },
    icon: {
        width: 24,
        height: 24,
        borderRadius: 0,
    },
    picView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 10,
    },
    picItem: {
        backgroundColor: color.paper,
        borderRadius: 5,
        marginRight: 5,
    },
    pic: {
        width: 85,
        height: 85,
        borderRadius: 5,
    },
    num: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: color.backdrop,
        top: 0,
        left: 0,
        borderRadius: 5,
    },
});
