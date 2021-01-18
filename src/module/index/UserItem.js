import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import {withNavigation} from 'react-navigation';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/RNIMigration';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import AvatarCell from '../AvatarCell';
import {Heading3, MyText, Paragraph} from '../Text';
import SpacingView from '../SpacingView';
import ImageCheckView from '../ImageCheckView';
import FollowCell from '../FollowCell';
import CommonAction from '../CommonAction';

class UserItem extends PureComponent {
    static defaultProps = {
        showFollow: true,
        type: 'follow',
    }

    static propTypes = {
        data: PropTypes.object.isRequired,
        onPress: PropTypes.func.isRequired,
        showFollow: PropTypes.bool,
        type: PropTypes.oneOf(['delete', 'follow']),
        replyUser: PropTypes.func,
        thumbUser: PropTypes.func,
    }

    goToUserInfo = (vip) => {
        this.props.navigation.navigate('UserInfo', {uid: this.props.data.uid});
        // if (vip) this.props.navigation.navigate('VipUserInfo', {});
        // else this.props.navigation.navigate('UserInfo', {});
    }

    checkPhoto = (index) => {
        global.toastImage(<ImageCheckView photos={this.props.data.pics} index={index} />);
    }

    switchFollow = (checkState = 0) => {
        let data = this.props.data;
        if (checkState == 1 && !data.isFollow) return;
        let params = {};
        params.fuid = data.uid;
        if (data.isFollow) params.state = 0;
        else params.state = 1;
        HttpUtil.post(api.switchFollow, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                data.isFollow = !data.isFollow;
                DeviceEventEmitter.emit('switchFollowCallback', data.isFollow, data.uid);
            }
        });
    }

    toggleReply = () => {
        if (this.props.replyUser) this.props.replyUser();
        else {
            this.props.navigation.navigate('Trend', {detail: this.props.data, isScroll: true});
        }
    }

    toggleThumb = () => {
        if (this.props.thumbUser) this.props.thumbUser();
        else {
            let that = this;
            let data = this.props.data;
            let params = {tid: data.id};
            if (data.isThumb) params.state = 0;
            else params.state = 1;
            HttpUtil.post(api.toggleThumbTrend, params).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    data.isThumb = !data.isThumb;
                    DeviceEventEmitter.emit('toggleThumbCallback', data.isThumb, data.id);
                    HttpUtil.clearCache(api.getUserTrends);
                } else {
                    global.toastShow(json.message);
                }
            });
        }
    }

    checkTrend = () => {
        if (this.props.onPress) this.props.onPress();
        else {
            this.props.navigation.navigate('Trend', {detail: this.props.data});
        }
    }

    delTrend = () => {
        let that = this;
        let data = this.props.data;
        if (!data.id || data.uid != global.config.uid) return;
        HttpUtil.post(api.deleteTrend, {id: data.id}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                DeviceEventEmitter.emit('deleteTrendCallback', data.id);
                global.config.user.trends--;
                DeviceEventEmitter.emit('mineUpdateCallback');
                HttpUtil.clearCache(api.getUserTrends);
            } else {
                global.toastShow(json.message);
            }
        });
    }

    showAction = () => {
        let arr = null;
        switch (this.props.type) {
            case 'delete': arr = ['删除']; break;
            case 'follow': arr = ['取消关注', '举报', '屏蔽此人']; break;
        }
        global.toastActionSheet(<CommonAction list={arr} confirm={this._callbackAction} />);
    }

    _callbackAction = (index) => {
        if (index == 0) {
            let that = this;
            switch (this.props.type) {
                case 'delete':
                    that.delTrend();
                    break;
                case 'follow':
                    if (!this.props.data.isFollow) return global.toastShow('尚未关注');
                    global.toastAlert('确定不再关注此人？', '', '', '', (res) => {
                        if (res) that.switchFollow(1);
                    });
                    break;
            }
        } else if (this.props.type == 'follow') {
            switch (index) {
                case 1: this.showSubAction(); break;
                case 2: this.shieldUser(); break;
            }
        }
    }

    showSubAction = () => {
        let arr = global.config.reportTypes;
        global.toastActionSheet(<CommonAction list={arr} confirm={this._callbackSubAction} />);
    }

    _callbackSubAction = (index) => {
        if (!global.config.reportTypes[index]) return;
        let params = {
            tid: this.props.data.id,
            type: index,
        };
        HttpUtil.post(api.reportTrend, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.toastShow('举报成功');
            } else {
                global.toastShow(json.message);
            }
        });
    }

    shieldUser = () => {
        let data = this.props.data;
        global.toastAlert('操作确认', '您确定要屏蔽此人吗？屏蔽后将无法看到此人动态，要取消屏蔽，可在我的-通用设置-屏蔽列表中进行操作', '', '', (res) => {
            if (res) {
                HttpUtil.post(api.switchShield, {target: data.uid, state: 1}).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        global.toastShow('已屏蔽');
                        DeviceEventEmitter.emit('switchShieldCallback', data.uid);
                    } else {
                        global.toastShow(json.message);
                    }
                });
            }
        });
    }

    render() {
        let thumbStyle = null;
        if (this.props.data.isThumb) thumbStyle = {color: color.primary};
        let picItemStyle = styles.picItem;
        if (this.props.data.pics.length == 1) picItemStyle = styles.picItem2;
        return (
            <>
                <TouchableOpacity activeOpacity={1} onPress={this.checkTrend} style={styles.container}>
                    <View style={commonStyle.rowView}>
                        <AvatarCell style={styles.avatar} icon={this.props.data.avatar} onPress={this.goToUserInfo.bind(this, this.props.data.vip)} vip={this.props.data.vip} />
                        <View style={styles.headerItem}>
                            <Heading3 style={commonStyle.bold}>{this.props.data.username}</Heading3>
                            <MyText style={commonStyle.info}>{(this.props.data.ctime + '').toDateTime().format('yyyy/MM/dd HH:mm')}</MyText>
                        </View>
                        <View style={commonStyle.fillView} />
                        {this.props.data.uid != global.config.uid && this.props.showFollow && <FollowCell onPress={this.switchFollow} follow={this.props.data.isFollow} />}
                        {/*<FollowCell onPress={this.switchFollow} follow={this.props.data.isFollow} />*/}
                    </View>
                    <SpacingView height={8} />
                    <Paragraph style={styles.content} numberOfLines={3}>{this.props.data.content}</Paragraph>
                    <SpacingView height={8} />
                    <View style={styles.picView}>
                        {this.props.data.pics.length > 0 && this.props.data.pics.map((info, index) => {
                            if (index < 2) return (
                                <TouchableOpacity activeOpacity={1} style={picItemStyle} onPress={this.checkPhoto.bind(this, index)} key={index}>
                                    <FastImage source={{uri: api.cdn + info + '_'}} style={styles.pic} resizeMode={'cover'}/>
                                </TouchableOpacity>
                            );
                            if (index == 2) return (
                                <TouchableOpacity activeOpacity={1} style={styles.picItem} onPress={this.checkPhoto.bind(this, index)} key={index}>
                                    <FastImage source={{uri: api.cdn + info + '_'}} style={styles.pic} resizeMode={'cover'}/>
                                    {this.props.data.pics.length > 3 && <View style={styles.num}><MyText style={{color: color.white}}>+{this.props.data.pics.length - 3}</MyText></View>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
                <View style={[commonStyle.rowView, styles.optionView]}>
                    <TouchableOpacity activeOpacity={1} onPress={this.toggleThumb} style={[commonStyle.rowView, styles.iconView]}>
                        <Icon style={[styles.iconText, thumbStyle]} name={'fontawesome|thumbs-o-up'} size={18} />
                        <MyText style={[styles.iconText, thumbStyle]}> {this.props.data.thumb > 0 ? this.props.data.thumb : '赞'}</MyText>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={this.toggleReply} style={[commonStyle.rowView, styles.iconView]}>
                        <Icon style={styles.iconText} name={'ion|chatbox-ellipses-outline'} size={18} />
                        <MyText style={styles.iconText}> {this.props.data.comments > 0 ? this.props.data.comments : '评论'}</MyText>
                    </TouchableOpacity>
                    <View style={commonStyle.fillView}/>
                    <TouchableOpacity activeOpacity={1} onPress={this.showAction} style={styles.ellipsisBtn}>
                        <MIcon style={styles.ellipsis} name={'settings-helper'} size={24} />
                    </TouchableOpacity>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 15,
        // paddingBottom: 15,
        backgroundColor: color.white,
    },
    avatar: {

    },
    headerItem: {
        marginLeft: 12,
    },
    content: {

    },
    picView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 10,
    },
    picItem: {
        width: ScreenUtil.screenW / 3 - 12,
        height: 100,
        backgroundColor: color.paper,
        borderRadius: 5,
        marginRight: 4,
    },
    picItem2: {
        width: ScreenUtil.screenW / 2,
        height: 160,
        backgroundColor: color.paper,
        borderRadius: 5,
        marginRight: 4,
    },
    pic: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    num: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '30%',
        height: '30%',
        backgroundColor: color.toast,
        bottom: 0,
        right: 0,
        borderBottomRightRadius: 5,
    },
    optionView: {
        backgroundColor: color.white,
        paddingLeft: 12,
        height: 40,
    },
    iconView: {
        width: 75,
    },
    iconText: {
        color: color.gray,
        marginRight: 2,
    },
    ellipsis: {
        marginTop: -15,
        color: color.gray,
    },
    ellipsisBtn: {
        paddingRight: 12,
        paddingLeft: 20,
        paddingBottom: 15,
        paddingTop: 10,
    },
});

export default withNavigation(UserItem);
