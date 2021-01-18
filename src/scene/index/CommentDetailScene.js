import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, FlatList, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../common/color';
import api from '../../common/api';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import SpacingView from '../../module/SpacingView';
import {Heading3, MyText} from '../../module/Text';
import CommentItem from '../../module/index/CommentItem';
import KeyboardMsgCell from '../../module/KeyboardMsgCell';
import {NoMoreView, NoDataView} from '../../module/NoDataView';

export default class CommentDetailScene extends Component {
    static navigationOptions = ({navigation: any}) => ({

    })

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            reply: [],
            comment: {},
            more: true,
            isFocus: false,
            target: 0,
            default_target: 0,
        };
    }

    componentDidMount() {
        let params = this.props.navigation.state.params;
        // console.log(params);
        this.state.reply = params.reply;
        this.state.comment = params.comment;
        this.setState({reply: params.reply, comment: params.comment, default_target: params.comment.uid});
        this.thumbListener = DeviceEventEmitter.addListener('toggleThumbCommentCallback', this.handleToggleThumbComment);
        this.thumbReplyListener = DeviceEventEmitter.addListener('toggleThumbCommentReplyCallback', this.handleToggleThumbCommentReply);
    }

    componentWillUnmount(): void {
        this.thumbListener.remove();
        this.thumbReplyListener.remove();
    }

    handleToggleThumbComment = (state, id) => {
        let comment = Object.assign({}, this.state.comment);
        comment.isThumb = state;
        if (state) comment.thumb++;
        else comment.thumb--;
        this.setState({comment});
    }

    handleToggleThumbCommentReply = (state, id) => {
        let reply = Object.assign([], this.state.reply);
        for (let i in reply) {
            if (reply[i].id == id) {
                reply[i].isThumb = state;
                if (state) reply[i].thumb++;
                else reply[i].thumb--;
            }
        }
        this.setState({reply});
    }

    requestData = () => {

    }

    toggleMsg = (target) => {
        this.setState({isFocus: true, target: target});
    }

    onBlur = () => {
        this.setState({isFocus: false, target: 0});
    }

    renderCell = (info: Object) => {
        return (
            <CommentItem data={info.item} isReply={info.item.target != this.state.comment.uid}
                         replyUser={this.toggleMsg.bind(this, info.item.uid)} vip={info.item.vip} />
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.id + '';
    }

    renderHeader = () => {
        return (
            <CommentItem data={this.state.comment} type={'origin'}
                         replyUser={this.toggleMsg.bind(this, this.state.comment.uid)} vip={this.state.comment.vip} />
        );
    }

    renderFooter = () => {
        return (
            <>
                <SpacingView height={40} />
                <SpacingView height={ScreenUtil.isIphoneX() ? 34 : 0} />
            </>
        );
    }

    renderEmpty = () => {
        return (
            <NoDataView/>
        );
    }

    sendComment = (msg) => {
        let that = this;
        let target = this.state.target || this.state.default_target;
        console.log(target, msg);
        return HttpUtil.post(api.sendTrendCommentReply, {
            tid: this.state.comment.tid,
            tcid: this.state.comment.id,
            content: msg,
            target: target,
        }).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                // that.state.reply.unshift(json.data);
                // let comment = that.state.comment;
                // comment.comments++;
                // that.setState({reply: that.state.reply, comment});
                DeviceEventEmitter.emit('sendCommentReplyCallback', json.data, that.state.comment.id);
            } else {
                global.toastShow(json.message);
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.reply}
                    extraData={this.state}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}
                />
                <KeyboardMsgCell isFocus={this.state.isFocus} onBlur={this.onBlur} sendComment={this.sendComment} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.paper,
    },
});
