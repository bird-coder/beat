import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground, DeviceEventEmitter} from 'react-native';

import api from '../../common/api';
import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';
import BaseUtil from '../../utils/BaseUtil';

import {MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import FollowCell from '../../module/FollowCell';
import AvatarCell from '../../module/AvatarCell';
import SwitchTabCell from '../../module/SwitchTabCell';
import UserItem from '../../module/index/UserItem';
import HeaderBar from '../../module/HeaderBar';
import BackBtn from '../../module/BackBtn';
import {NoDataView, NoMoreView} from '../../module/NoDataView';

export default class UserInfoScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
    })

    constructor(props) {
        super(props);

        let uid = 0;
        let params = props.navigation.state.params;
        if (params.uid) uid = params.uid;
        this.state = {
            more: true,
            items: ['动态', '相册', '记录'],
            index: 0,
            trends: [
                // {uid: 1, vip: 1, avatar: '', name: '小鸡鸡', follow: 100, content: '十三水', pics: ['', '', '', ''], thumb: 120, browse: 88, ctime: 0},
                // {uid: 2, vip: 0, avatar: '', name: '小鸡鸡', follow: 100, content: '十三水', pics: ['', '', ''], thumb: 120, browse: 88, ctime: 0},
            ],
            user: {},
            uid: uid,
            refreshing: false,
            page: 1,
            total: 0,
        };
    }

    componentDidMount(): void {
        this.getUserInfo();
        this.requestData();
        this.thumbListener = DeviceEventEmitter.addListener('toggleThumbCallback', this.handleToggleThumb);
        this.commentListener = DeviceEventEmitter.addListener('sendCommentCallback', this.handleSendComment);
    }

    componentWillUnmount(): void {
        this.thumbListener.remove();
        this.commentListener.remove();
    }

    handleToggleThumb = (state, id) => {
        let trends = Object.assign([], this.state.trends);
        for (let i in trends) {
            if (trends[i].id == id) {
                trends[i].isThumb = state;
                if (state) trends[i].thumb++;
                else trends[i].thumb--;
            }
        }
        this.setState({trends});
    }

    handleSendComment = () => {
        let trends = Object.assign([], this.state.trends);
        this.setState({trends});
    }

    getUserInfo = () => {
        let that = this;
        HttpUtil.post(api.getUserInfo, {uid: this.state.uid}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({user: json.data});
            }
        });
    }

    switchTab = (index) => {
        this.setState({index: index});
    }

    requestData = () => {
        let that = this;
        that.setState({refreshing: true});
        HttpUtil.httpCache(api.getUserTrends, {uid: this.state.uid}).then((json) => {
            console.log('拉取用户动态接口' + JSON.stringify(json));
            if (!json) return;
            if (json && json.code == 0) {
                let bool = json.data.list.length >= global.config.pageSize;
                that.setState({trends: json.data.list, page: 1, more: bool, total: json.data.total});
            }
            that.setState({refreshing: false});
        });
    }

    loadData = () => {
        let that = this;
        if (!this.state.more) return;
        let page = this.state.page;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            page++;
            HttpUtil.httpCache(api.getUserTrends, {uid: this.state.uid, page}).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    let bool = json.data.list.length >= global.config.pageSize;
                    let trends = that.state.trends.concat(json.data.list);
                    that.setState({trends, page: page, more: bool});
                }
            });
        }, 200);
    }

    checkTrend = (index) => {
        let detail = this.state.trends[index];
        this.props.navigation.navigate('Trend', {detail: detail});
    }

    goToFollow = (type) => {
        let owner = '他的';
        if (this.state.uid == global.config.uid) owner = '我的';
        let title = '关注';
        if (type == 2) title = '粉丝';
        title = owner + title;
        this.props.navigation.navigate('MyFollow', {title: title, type: type});
    }

    renderCell = (info: Object) => {
        let type = 'follow';
        if (info.item.uid == global.config.uid) type = 'delete';
        return (
            <View>
                <UserItem data={info.item} onPress={this.checkTrend.bind(this, info.index)} showFollow={true} type={type} />
                <SpacingView height={5} />
            </View>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.id + '';
    }

    _renderLog = () => {
        return (
            <View style={styles.logView}>
                <MyText>运动数据</MyText>
            </View>
        );
    }

    renderHeader = () => {
        let user = this.state.user;
        return (
            <View>
                <ImageBackground source={ImageResources.img_bicycle} style={styles.bgImg} resizeMode={'cover'}>
                    <HeaderBar>
                        <BackBtn style={commonStyle.white} />
                    </HeaderBar>
                </ImageBackground>
                <View style={styles.profileView}>
                    <View style={styles.headerView}>
                        <AvatarCell style={styles.avatar} icon={user.avatar} />
                        <View style={commonStyle.fillView}></View>
                        <View>
                            <SpacingView height={40} />
                            {this.state.uid != global.config.uid && <FollowCell follow={user.isFollow} />}
                        </View>
                    </View>
                    <SpacingView height={55} />
                    <MyText style={styles.name}>{user.username}</MyText>
                    <SpacingView height={15} />
                    <MyText style={styles.content}>{user.intro || '暂无个人介绍'}</MyText>
                    <SpacingView height={10} />
                    <MyText style={styles.content}><MyText style={styles.content}>{BaseUtil.getSex(user.sex)}</MyText> | <MyText style={styles.content}>{user.city || '中国'}</MyText></MyText>
                    <SpacingView height={30} />
                    <View style={styles.tabView}>
                        <TouchableOpacity activeOpacity={1} onPress={this.goToFollow.bind(this, 1)} style={styles.tabItem}>
                            <MyText>{user.follow || 0}</MyText>
                            <MyText>关注</MyText>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={this.goToFollow.bind(this, 2)} style={styles.tabItem}>
                            <MyText>{user.fans || 0}</MyText>
                            <MyText>粉丝</MyText>
                        </TouchableOpacity>
                        <View style={styles.tabItem}>
                            <MyText>{user.sport_days || 0}</MyText>
                            <MyText>运动天数</MyText>
                        </View>
                    </View>
                </View>
                <SpacingView height={10} />
                {/*<SwitchTabCell index={this.state.index} onPress={this.switchTab} list={this.state.items} />*/}
                {this.state.index == 0 && <View style={styles.total}>
                    <MyText style={styles.totalText}>全部动态（{this.state.total}）</MyText>
                </View>}
                {this.state.index == 2 && this._renderLog()}
            </View>
        );
    }

    renderFooter = () => {
        return (
            <NoMoreView more={this.state.more} />
        );
    }

    renderEmpty = () => {
        return (
            <NoDataView/>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.trends}
                    extraData={this.state}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}

                    onEndReached={this.loadData}
                    onEndReachedThreshold={0.1}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.paper,
    },
    bgImg: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH * 0.2,
    },
    profileView: {
        backgroundColor: color.white,
        padding: 15,
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 15,
        top: -40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.black,
    },
    content: {
        fontSize: 13,
        color: color.gray,
    },
    tabView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tabItem: {
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    total: {
        backgroundColor: color.white,
        padding: 15,
    },
    totalText: {
        fontSize: 12,
        color: color.black,
    },
    logView: {
        backgroundColor: color.white,
        padding: 15,
    },
});
