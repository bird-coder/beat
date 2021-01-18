import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/RNIMigration';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import AvatarCell from '../AvatarCell';
import {Heading3, MyText, Paragraph} from '../Text';
import SpacingView from '../SpacingView';
import CommentAction from './CommentAction';

class CommentItem extends PureComponent {
    static defaultProps = {
        type: 'normal',
    }

    static propTypes = {
        type: PropTypes.oneOf(['origin', 'reply', 'normal']),
        replyUser: PropTypes.func,
        thumbUser: PropTypes.func,
        vip: PropTypes.oneOf([0, 1]),
        data: PropTypes.object,
        isReply: PropTypes.bool,
    }

    constructor(props) {
        super(props);

        this.state = {
            commentList: ['回复', '举报', '复制'],
            reportList: ['色情低俗', '不友善行为', '涉政敏感', '广告推销', '违法犯罪', '侵权盗用', '其他'],
        };
    }



    showAction = () => {
        // global.toastActionSheet(<CommentAction confirm={this._callbackComment} list={this.state.commentList} />);
    }

    showSubAction = () => {
        global.toastActionSheet(<CommentAction confirm={this._callbackReport} list={this.state.reportList} />);
    }

    _callbackComment = (index) => {
        console.log(index);
    }

    _callbackReport = (index) => {
        console.log(index);
    }

    goToUserInfo = (uid, vip) => {
        this.props.navigation.navigate('UserInfo', {uid});
        // if (vip) this.props.navigation.navigate('VipUserInfo', {});
        // else this.props.navigation.navigate('UserInfo', {});
    }

    goToCommentDetail = () => {
        let comment = {
            id: this.props.data.id,
            tid: this.props.data.tid,
            uid: this.props.data.uid,
            username: this.props.data.username,
            vip: this.props.data.vip,
            avatar: this.props.data.avatar,
            content: this.props.data.content,
            ctime: this.props.data.ctime,
            thumb: this.props.data.thumb,
            comments: this.props.data.comments,
            isThumb: this.props.data.isThumb,
        };
        this.props.navigation.navigate('CommentDetail', {reply: this.props.data.reply, comment: comment});
    }

    goToTrend = () => {
        this.props.navigation.goBack();
    }

    toggleReply = () => {
        if (this.props.replyUser) this.props.replyUser();
    }

    toggleThumb = () => {
        if (this.props.thumbUser) this.props.thumbUser();
        else {
            let that = this;
            let data = this.props.data;
            if (this.props.type == 'reply' || this.props.type == 'origin') {
                let params = {tid: data.tid, tcid: data.id};
                if (data.isThumb) params.state = 0;
                else params.state = 1;
                HttpUtil.post(api.toggleThumbTrendComment, params).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        data.isThumb = !data.isThumb;
                        DeviceEventEmitter.emit('toggleThumbCommentCallback', data.isThumb, data.id);
                    } else {
                        global.toastShow(json.message);
                    }
                });
            } else if (this.props.type == 'normal') {
                let params = {tid: data.tid, tcid: data.tcid, tcrid: data.id};
                if (data.isThumb) params.state = 0;
                else params.state = 1;
                HttpUtil.post(api.toggleThumbTrendCommentReply, params).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        data.isThumb = !data.isThumb;
                        DeviceEventEmitter.emit('toggleThumbCommentReplyCallback', data.isThumb, data.id);
                    } else {
                        global.toastShow(json.message);
                    }
                });
            }
        }
    }

    render() {
        let content = (
            <Paragraph>{this.props.data.content}</Paragraph>
        );
        if (this.props.isReply) content = (
            <Paragraph>回复 <Paragraph style={commonStyle.primary}>{this.props.data.target_user}</Paragraph> : {this.props.data.content}</Paragraph>
        );
        let thumbStyle = null;
        if (this.props.data.isThumb) thumbStyle = {color: color.primary};
        return (
            <TouchableOpacity activeOpacity={1} style={styles.commentView} onPress={this.showAction}>
                <AvatarCell icon={null} onPress={this.goToUserInfo.bind(this, this.props.data.uid, this.props.vip)} vip={this.props.vip} />
                <View style={styles.container}>
                    <View style={commonStyle.rowView}>
                        <View>
                            <Paragraph>{this.props.data.username}</Paragraph>
                            <MyText style={commonStyle.info}>{this.props.data.ctime && (this.props.data.ctime + '').toDateTime().format('yyyy-MM-dd HH:mm')}</MyText>
                        </View>
                        <View style={commonStyle.fillView} />
                        <TouchableOpacity activeOpacity={0.8} style={styles.iconBtn} onPress={this.toggleReply}>
                            <Icon style={commonStyle.info} name={'ion|chatbox-ellipses-outline'} size={18} />
                            {/*<MyText style={commonStyle.info}> {this.props.data.comments > 0 ? this.props.data.comments : ''}</MyText>*/}
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={styles.iconBtn} onPress={this.toggleThumb}>
                            <Icon style={[commonStyle.info, thumbStyle]} name={'fontawesome|thumbs-o-up'} size={18} />
                            <MyText style={[commonStyle.info, thumbStyle]}> {this.props.data.thumb > 0 ? this.props.data.thumb : ''}</MyText>
                        </TouchableOpacity>
                    </View>
                    <SpacingView height={5} />
                    {content}
                    {this.props.type == 'reply' && this.props.data.comments > 0 &&
                        <TouchableOpacity activeOpacity={1} style={styles.commentItem} onPress={this.goToCommentDetail}>
                            {this.props.data.reply.length > 0 && this.props.data.reply.map((info, index) => {
                                if (index < 2) {
                                    let content = (<Paragraph style={commonStyle.info}><Paragraph style={commonStyle.primary}>{info.username}</Paragraph>: {info.content}</Paragraph>);
                                    if (info.target != this.props.data.uid) content = (<Paragraph style={commonStyle.info}><Paragraph style={commonStyle.primary}>{info.username}</Paragraph> 回复 <Paragraph style={commonStyle.primary}>{info.target_user}</Paragraph>: {info.content}</Paragraph>);
                                    return content;
                                }
                            })}
                            {this.props.data.comments > 2 && <Paragraph style={[commonStyle.primary, commonStyle.bold]}>查看全部{this.props.data.comments}条回复</Paragraph>}
                        </TouchableOpacity>
                    }
                    {this.props.type == 'origin' && <Heading3 style={styles.origin} onPress={this.goToTrend}>查看原动态</Heading3>}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 12,
    },
    commentView: {
        borderBottomWidth: ScreenUtil.onePixel,
        borderBottomColor: color.border,
        padding: 15,
        flexDirection: 'row',
        backgroundColor: color.white,
    },
    commentItem: {
        backgroundColor: color.paper,
        borderRadius: 2,
        paddingLeft: 9,
        paddingRight: 9,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
    },
    iconBtn: {
        padding: 10,
        marginLeft: 15,
        paddingRight: 0,
        width: 45,
        flexDirection: 'row',
        alignItems: 'center',
    },
    origin: {
        color: color.primary,
        marginTop: 10,
    },
});

export default withNavigation(CommentItem);
