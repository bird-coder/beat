import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, FlatList, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';
import StorageUtil from '../../utils/StorageUtil';
import FileUtil from '../../utils/FileUtil';

import AvatarCell from '../../module/AvatarCell';
import {Heading3, MyText, Paragraph} from '../../module/Text';
import FollowCell from '../../module/FollowCell';
import SpacingView from '../../module/SpacingView';
import CommentItem from '../../module/index/CommentItem';
import KeyboardMsgCell from '../../module/KeyboardMsgCell';
import ImageCheckView from '../../module/ImageCheckView';
import {NoDataView, NoMoreView, NoDataView2} from '../../module/NoDataView';
import SwitchTabCell from '../../module/SwitchTabCell';
import CommonAction from '../../module/CommonAction';

export default class TrendScene extends PureComponent {
    static navigationOption = ({navigation: any}) => ({

    })

    constructor(props) {
        super(props);

        this.state = {
            actions: ['赞', '评论'],
            detail: {},
            comments: [],
            thumbs: [],
            tid: 0,
            refreshing: false,
            isFocus: false,
            index: -1,
            tabIndex: 1,
            firstLoad: true,
            commentPage: 1,
            thumbPage: 1,
            commentMore: false,
            thumbMore: false,
            ready: false,
        };
    }

    componentDidMount() {
        let that = this;
        let params = this.props.navigation.state.params;
        // console.log(params);
        this.state.tid = params.detail.id;
        let actions = ['赞  ' + params.detail.thumb, '评论  ' + params.detail.comments];
        this.setState({detail: params.detail, tid: params.detail.id, actions});
        this.requestData(this.state.tabIndex);
        this.thumbListener = DeviceEventEmitter.addListener('toggleThumbCommentCallback', this.handleToggleThumbComment);
        this.commentReplyListener = DeviceEventEmitter.addListener('sendCommentReplyCallback', this.handleSendCommentReply);
        FileUtil.preloadImg(params.detail.pics);
    }

    componentWillUnmount(): void {
        this.thumbListener.remove();
        this.commentReplyListener.remove();
    }

    handleToggleThumbComment = (state, id) => {
        let comments = Object.assign([], this.state.comments);
        for (let i in comments) {
            if (comments[i].id == id) {
                comments[i].isThumb = state;
                if (state) comments[i].thumb++;
                else comments[i].thumb--;
            }
        }
        this.setState({comments});
    }

    handleSendCommentReply = (reply, id) => {
        let comments = Object.assign([], this.state.comments);
        for (let i in comments) {
            if (comments[i].id == id) {
                comments[i].reply.unshift(reply);
                comments[i].comments++;
            }
        }
        this.setState({comments});
    }

    switchFollow = (checkState = 0) => {
        let that = this;
        let detail = Object.assign({}, this.state.detail);
        if (checkState == 1 && !detail.isFollow) return;
        let params = {};
        params.fuid = detail.uid;
        if (detail.isFollow) params.state = 0;
        else params.state = 1;
        HttpUtil.post(api.switchFollow, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                detail.isFollow = !detail.isFollow;
                DeviceEventEmitter.emit('switchFollowCallback', detail.isFollow, detail.uid);
                that.setState({detail});
            }
        });
    }

    switchTab = (tabIndex) => {
        if (this.state.firstLoad) this.requestData(tabIndex);
        this.setState({tabIndex, firstLoad: false});
    }

    requestData = (type = 1) => {
        let that = this;
        that.setState({refreshing: true});
        if (type == 1) {
            HttpUtil.post(api.getTrendComments, {tid: this.state.tid}).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    let bool = json.data.length >= global.config.pageSize;
                    that.setState({comments: json.data, commentPage: 1, commentMore: bool, ready: true});
                } else if (json.code == global.config.errno.invalid_trend) {

                }
                that.setState({refreshing: false});
            });
        } else {
            HttpUtil.post(api.getTrendThumbs, {tid: this.state.tid}).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    let bool = json.data.length >= global.config.pageSize;
                    that.setState({thumbs: json.data, thumbPage: 1, thumbMore: bool});
                }
                that.setState({refreshing: false});
            });
        }
    }

    loadMore = () => {
        let that = this;
        let type = this.state.tabIndex;
        let more = type == 1 ? this.state.commentMore : this.state.thumbMore;
        if (!more) {
            global.toastShow('没有更多了');
            return;
        }
        let page = type == 1 ? this.state.commentPage : this.state.thumbPage;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            global.toastLoading();
            page++;
            if (type == 1) {
                HttpUtil.post(api.getTrendComments, {tid: that.state.tid, page}).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        let bool = json.data.length >= global.config.pageSize;
                        let comments = that.state.comments.concat(json.data);
                        that.setState({comments, commentPage: page, commentMore: bool});
                    }
                }).finally(() => {
                    global.toastHide();
                });
            } else {
                HttpUtil.post(api.getTrendThumbs, {tid: that.state.tid, page}).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        let bool = json.data.length >= global.config.pageSize;
                        let thumbs = that.state.thumbs.concat(json.data);
                        that.setState({thumbs, thumbPage: page, thumbMore: bool});
                    }
                }).finally(() => {
                    global.toastHide();
                });
            }
        }, 200);
    }

    toggleMsg = (index) => {
        this.setState({isFocus: true, index: index});
    }

    onBlur = () => {
        this.setState({isFocus: false, index: -1});
    }

    goToUserInfo = (vip) => {
        this.props.navigation.navigate('UserInfo', {uid: this.state.detail.uid});
        // if (vip) this.props.navigation.navigate('VipUserInfo', {});
        // else this.props.navigation.navigate('UserInfo', {});
    }

    renderCell = (info: Object) => {
        return (
            <CommentItem data={info.item} type={'reply'} replyUser={this.toggleMsg.bind(this, info.index)} vip={info.item.vip} />
        );
    }

    renderThumbCell = (info: Object) => {
        return (
            <View style={commonStyle.bodyView}>
                <TouchableOpacity activeOpacity={1} style={[commonStyle.rowView, styles.userView]} onPress={this.goToUserInfo.bind(this, info.item.vip)}>
                    <AvatarCell style={styles.avatar} icon={info.item.avatar} vip={info.item.vip} />
                    <View style={styles.headerItem}>
                        <Heading3 style={commonStyle.bold}>{info.item.username}</Heading3>
                        <MyText style={commonStyle.info}>{info.item.intro}</MyText>
                    </View>
                    <View style={commonStyle.fillView} />
                    <Image source={ImageResources.icon_zan} resizeMode={'stretch'} style={styles.icon}/>
                    <Paragraph style={commonStyle.info}>赞</Paragraph>
                </TouchableOpacity>
            </View>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.id + '';
    }

    checkPhoto = (index) => {
        global.toastImage(<ImageCheckView photos={this.state.detail.pics} index={index} />);
    }

    delTrend = () => {
        let that = this;
        let detail = this.state.detail;
        if (!detail.id || detail.uid != global.config.uid) return;
        HttpUtil.post(api.deleteTrend, {id: detail.id}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.toastShow('删除成功');
                DeviceEventEmitter.emit('deleteTrendCallback', detail.id);
                global.config.user.trends--;
                DeviceEventEmitter.emit('mineUpdateCallback');
                HttpUtil.clearCache(api.getUserTrends);
                that.props.navigation.goBack();
            } else {
                global.toastShow(json.message);
            }
        });
    }

    showAction = () => {
        let arr;
        let bool = this.state.detail.uid == global.config.uid;
        if (bool) arr = ['删除'];
        else arr = ['取消关注', '举报'];
        global.toastActionSheet(<CommonAction list={arr} confirm={this._callbackAction} />);
    }

    _callbackAction = (index) => {
        let bool = this.state.detail.uid == global.config.uid;
        if (index == 0) {
            let that = this;
            if (bool) {
                that.delTrend();
            } else {
                if (!this.state.detail.isFollow) return global.toastShow('尚未关注');
                global.toastAlert('确定不再关注此人？', '', '', '', (res) => {
                    if (res) that.switchFollow(1);
                });
            }
        } else if (!bool) {
            this.showSubAction();
        }
    }

    showSubAction = () => {
        let arr = global.config.reportTypes;
        global.toastActionSheet(<CommonAction list={arr} confirm={this._callbackSubAction} />);
    }

    _callbackSubAction = (index) => {
        if (!global.config.reportTypes[index]) return;
        let params = {
            tid: this.state.detail.id,
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

    renderHeader = () => {
        let picItemStyle = styles.picItem;
        if (this.state.detail.pics && this.state.detail.pics.length == 1) picItemStyle = styles.picItem2;
        return (
            <View>
                <View style={styles.trendView}>
                    <View style={commonStyle.rowView}>
                        <AvatarCell icon={this.state.detail.avatar} onPress={this.goToUserInfo.bind(this, this.state.detail.vip)} vip={this.state.detail.vip} />
                        <Heading3 style={styles.name}>{this.state.detail.username}</Heading3>
                        <View style={commonStyle.fillView} />
                        {this.state.detail.uid != global.config.uid && <FollowCell onPress={this.switchFollow} follow={this.state.detail.isFollow} />}
                        {/*<FollowCell onPress={this.switchFollow} follow={this.state.detail.isFollow} />*/}
                    </View>
                    <SpacingView height={10} />
                    <Paragraph>{this.state.detail.content}</Paragraph>
                    <SpacingView height={5} />
                    <View style={styles.picView}>
                        {this.state.detail.pics && this.state.detail.pics.map((info, index) => (
                            <TouchableOpacity activeOpacity={1} style={picItemStyle} onPress={this.checkPhoto.bind(this, index)}>
                                <FastImage source={{uri: api.cdn + info + '_'}} style={styles.pic} resizeMode={'cover'} priority={'high'} key={index}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={[commonStyle.rowView, styles.optionView]}>
                    <MyText>{this.state.detail.ctime && (this.state.detail.ctime + '').toDateTime().format('yyyy-MM-dd HH:mm')}</MyText>
                    <View style={commonStyle.fillView} />
                    <TouchableOpacity activeOpacity={1} style={styles.ellipsisBtn} onPress={this.showAction}>
                        <MIcon style={styles.ellipsis} name={'settings-helper'} size={24} />
                    </TouchableOpacity>
                </View>
                <SpacingView height={10} />
                <View style={[commonStyle.rowView, styles.commentView]}>
                    <SwitchTabCell style={styles.thumbHeaderView} index={this.state.tabIndex} onPress={this.switchTab} list={this.state.actions} />
                    <View style={commonStyle.fillView} />
                </View>
            </View>
        );
    }

    renderFooter = () => {
        let info = this.state.commentMore ? '查看更多评论' : '没有更多了';
        return (
            <>
                {this.state.ready && <TouchableOpacity activeOpacity={1} style={styles.more} onPress={this.loadMore}>
                    <SpacingView height={10} />
                    <Heading3>{info}</Heading3>
                    <SpacingView height={10} />
                </TouchableOpacity>}
                <SpacingView height={40} />
                <SpacingView height={ScreenUtil.isIphoneX() ? 34 : 0} />
            </>
        );
    }

    renderEmpty = () => {
        return (
            <NoDataView2/>
        );
    }

    sendComment = (msg) => {
        let that = this;
        if (this.state.index >= 0){
            let comment = this.state.comments[this.state.index];
            return HttpUtil.post(api.sendTrendCommentReply, {
                tid: this.state.tid,
                tcid: comment.id,
                content: msg,
                target: comment.uid,
            }).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    comment.reply.unshift(json.data);
                    comment.comments++;
                    that.setState({comments: that.state.comments});
                } else {
                    global.toastShow(json.message);
                }
            });
        } else {
            return HttpUtil.post(api.sendTrendComment, {
                tid: this.state.tid,
                content: msg,
            }).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    that.state.comments.unshift(json.data);
                    that.state.detail.comments++;
                    let actions = ['赞  '+that.state.detail.thumb, '评论  '+that.state.detail.comments];
                    that.setState({comments: that.state.comments, detail: that.state.detail, actions});
                    DeviceEventEmitter.emit('sendCommentCallback', json.data, that.state.tid);
                    HttpUtil.clearCache(api.getUserTrends);
                } else {
                    global.toastShow(json.message);
                }
            });
        }
    }

    render() {
        let list = this.state.tabIndex == 1 ? this.state.comments : this.state.thumbs;
        return (
            <>
                <FlatList
                    data={list}
                    renderItem={this.state.tabIndex == 1 ? this.renderCell : this.renderThumbCell}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.state.tabIndex == 1 && this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}
                    extraData={this.state}
                />
                <KeyboardMsgCell isFocus={this.state.isFocus} onBlur={this.onBlur} sendComment={this.sendComment} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.paper,
    },
    trendView: {
        padding: 15,
        paddingBottom: 10,
        backgroundColor: color.white,
    },
    name: {
        fontWeight: 'bold',
        marginLeft: 12,
    },
    picView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        minHeight: 10,
    },
    picItem: {
        width: ScreenUtil.screenW / 3 - 14,
        height: 100,
        backgroundColor: color.paper,
        borderRadius: 5,
        marginRight: 4,
        marginBottom: 4,
    },
    picItem2: {
        width: ScreenUtil.screenW / 2,
        height: 160,
        backgroundColor: color.paper,
        borderRadius: 5,
        marginRight: 4,
        marginBottom: 4,
    },
    pic: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    optionView: {
        backgroundColor: color.white,
        paddingLeft: 15,
        height: 35,
    },
    ellipsis: {
        marginTop: -20,
    },
    ellipsisBtn: {
        paddingRight: 15,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    commentView: {
        backgroundColor: color.white,
        borderBottomWidth: ScreenUtil.onePixel,
        borderBottomColor: color.border,
    },
    thumbHeaderView: {
        width: ScreenUtil.screenW * 0.5,
        borderBottomWidth: 0,
    },
    userView: {
        paddingTop: 12,
        paddingBottom: 15,
        paddingRight: 4,
        borderBottomWidth: ScreenUtil.onePixel,
        borderBottomColor: color.border,
    },
    avatar: {

    },
    headerItem: {
        marginLeft: 6,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    more: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
    },
});
