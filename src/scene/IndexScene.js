import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image, FlatList, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import api from '../common/api';
import color from '../common/color';
import StorageUtil from '../utils/StorageUtil';
import ScreenUtil from '../utils/ScreenUtil';
import HttpUtil from '../utils/HttpUtil';
import BLEUtil from '../utils/BLEUtil';
import PermissionUtil from '../utils/PermissionUtil';
import LocationUtil from '../utils/LocationUtil';
import InitUtil from '../utils/InitUtil';

import SpacingView from '../module/SpacingView';
import SwitchTabCell from '../module/SwitchTabCell';
import {MyText} from '../module/Text';
import UserItem from '../module/index/UserItem';
import HeaderBar from '../module/HeaderBar';
import CommonAction from '../module/CommonAction';
import {NoDataView, NoMoreView} from '../module/NoDataView';

export default class IndexScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({

    });

    constructor(props) {
        super(props);

        this.state = {
            items: ['关注', '推荐'],
            index: 1,
            followTrends: [
                // {uid: 1, vip: 1, avatar: '', name: '小鸡鸡', follow: 100, content: '十三水', pics: ['', '', '', ''], thumb: 120, browse: 88, ctime: 0},
                // {uid: 2, vip: 0, avatar: '', name: '小鸡鸡', follow: 100, content: '十三水', pics: ['', '', ''], thumb: 120, browse: 88, ctime: 0},
            ],
            recommendTrends: [],
            refreshing: false,
            followMore: true,
            recommendMore: true,
            actions: ['拍照', '从手机相册选择'],
            firstLoad: true,
            followPage: 1,
            recommendPage: 1,
        };
    }

    componentDidMount() {
        let that = this;
        that.requestData(that.state.index);
        this.listener = DeviceEventEmitter.addListener('trendSubmitCallback', this.handleTrendSubmit);
        this.followListener = DeviceEventEmitter.addListener('switchFollowCallback', this.handleSwitchFollow);
        this.thumbListener = DeviceEventEmitter.addListener('toggleThumbCallback', this.handleToggleThumb);
        this.commentListener = DeviceEventEmitter.addListener('sendCommentCallback', this.handleSendComment);
        this.delTrendListener = DeviceEventEmitter.addListener('deleteTrendCallback', this.handleDeleteTrend);
        this.shieldListener = DeviceEventEmitter.addListener('switchShieldCallback', this.handleSwitchShield);
        InitUtil.init();
        global.showBleBtn();
        global.config.indexReady = true;
        if (global.checkBleState() == 'visible') BLEUtil.startBLEDevicesDiscovery();
        LocationUtil.getLocation();
    }

    componentWillUnmount(): void {
        this.listener.remove();
        this.followListener.remove();
        this.thumbListener.remove();
        this.commentListener.remove();
        this.delTrendListener.remove();
        this.shieldListener.remove();
    }

    handleTrendSubmit = () => {
        this.requestData(this.state.index);
        global.config.user.trends++;
        DeviceEventEmitter.emit('mineUpdateCallback');
    }

    handleSwitchFollow = (state, fuid) => {
        // console.log(state, fuid);
        let trends;
        if (this.state.index == 0) trends = Object.assign([], this.state.followTrends);
        else trends = Object.assign([], this.state.recommendTrends);
        for (let i in trends) {
            if (trends[i].uid == fuid) trends[i].isFollow = state;
        }
        if (this.state.index == 0) this.setState({followTrends: trends});
        else this.setState({recommendTrends: trends});
        if (state) global.config.user.follow++;
        else global.config.user.follow--;
        DeviceEventEmitter.emit('mineUpdateCallback');
        HttpUtil.clearCache(api.getUserFollows);
        HttpUtil.clearCache(api.getUserFans);
    }

    handleToggleThumb = (state, id) => {
        let trends;
        if (this.state.index == 0) trends = Object.assign([], this.state.followTrends);
        else trends = Object.assign([], this.state.recommendTrends);
        for (let i in trends) {
            if (trends[i].id == id) {
                trends[i].isThumb = state;
                if (state) trends[i].thumb++;
                else trends[i].thumb--;
            }
        }
        if (this.state.index == 0) this.setState({followTrends: trends});
        else this.setState({recommendTrends: trends});
    }

    handleSendComment = (comment, id) => {
        let trends;
        if (this.state.index == 0) trends = Object.assign([], this.state.followTrends);
        else trends = Object.assign([], this.state.recommendTrends);
        // for (let i in trends) {
        //     if (trends[i].id == id) {
        //         trends[i].comments++;
        //     }
        // }
        if (this.state.index == 0) this.setState({followTrends: trends});
        else this.setState({recommendTrends: trends});
    }

    handleDeleteTrend = (id) => {
        let trends;
        if (this.state.index == 0) trends = Object.assign([], this.state.followTrends);
        else trends = Object.assign([], this.state.recommendTrends);
        for (let i in trends) {
            if (trends[i].id == id) {
                trends.splice(i, 1);
            }
        }
        if (this.state.index == 0) this.setState({followTrends: trends});
        else this.setState({recommendTrends: trends});
    }

    handleSwitchShield = (target) => {
        let trends;
        let arr = [];
        if (this.state.index == 0) trends = this.state.followTrends;
        else trends = this.state.recommendTrends;
        for (let i in trends) {
            if (trends[i].uid != target) arr.push(trends[i]);
        }
        if (this.state.index == 0) this.setState({followTrends: arr});
        else this.setState({recommendTrends: arr});
    }

    switchTab = (index) => {
        if (this.state.firstLoad) this.requestData(index);
        this.setState({index: index, firstLoad: false});
    }

    requestData = (type = 0) => {
        let that = this;
        that.setState({refreshing: true});
        HttpUtil.post(api.getTrends, {type: type}).then((json) => {
            console.log('拉取用户动态接口' + JSON.stringify(json));
            if (!json) return;
            if (json && json.code == 0) {
                let bool = json.data.length >= global.config.pageSize;
                if (type == 0) that.setState({followTrends: json.data, followPage: 1, followMore: bool});
                else that.setState({recommendTrends: json.data, recommendPage: 1, recommendMore: bool});
            }
            that.setState({refreshing: false});
        });
    }

    loadMore = () => {
        let that = this;
        let type = this.state.index;
        let more = type == 1 ? this.state.recommendMore : this.state.followMore;
        if (!more) return;
        let page = type == 1 ? this.state.recommendPage : this.state.followPage;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            page++;
            HttpUtil.post(api.getTrends, {type, page}).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    let bool = json.data.length >= global.config.pageSize;
                    if (type == 0) {
                        let trends = that.state.followTrends.concat(json.data);
                        that.setState({followTrends: trends, followPage: page, followMore: bool});
                    } else {
                        let trends = that.state.recommendTrends.concat(json.data);
                        that.setState({recommendTrends: trends, recommendPage: page, recommendMore: bool});
                    }
                }
            });
        }, 200);
    }

    checkTrend = (index) => {
        let detail = this.state.index == 0 ? this.state.followTrends[index] : this.state.recommendTrends[index];
        this.props.navigation.navigate('Trend', {detail: detail});
    }

    publishTrend = () => {
        let that = this;
        StorageUtil.get('TrendImgTemp', (json) => {
            if (json) {
                let data = JSON.parse(json);
                if (data.imgs && data.imgs.length > 0) {
                    that.props.navigation.navigate('TrendSubmit', {imgs: data.imgs, content: data.content, type: 'img'});
                    return;
                }
            }
            global.toastActionSheet(<CommonAction confirm={that.goToPublish} list={that.state.actions} showCancel={false} />);
        });
    }

    publishTrendText = () => {
        let that = this;
        StorageUtil.get('TrendTextTemp', (json) => {
            let content = null;
            if (json && json.length > 0) content = json;
            that.props.navigation.navigate('TrendSubmit', {content: content, type: 'text'});
        });
    }

    goToPublish = (index) => {
        let that = this;
        if (index == 0) {
            PermissionUtil.requestPermission(['CAMERA']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Camera', {routeName: 'TrendSubmit'});
                }
            });
        } else {
            let response;
            if (global.platform.isIOS) response = PermissionUtil.requestPermission(['PHOTO_LIBRARY']);
            else response = PermissionUtil.requestPermission(['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']);
            response.then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Album', {maxFiles: global.config.maxPhotos, routeName: 'TrendSubmit'});
                }
            });
        }
    }

    renderCell = (info: Object) => {
        let type = 'follow';
        if (info.item.uid == global.config.uid) type = 'delete';
        return (
            <>
                <UserItem data={info.item} onPress={this.checkTrend.bind(this, info.index)} showFollow={this.state.index == 1} type={type} />
                <SpacingView height={5} />
            </>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.id + '';
    }

    renderHeader = () => {
        return <SpacingView height={5} />;
    }

    renderFooter = () => {
        let more = this.state.index == 1 ? this.state.recommendMore : this.state.followMore;
        return (
            <NoMoreView more={more} />
        );
    }

    renderEmpty = () => {
        return (
            <NoDataView/>
        );
    }

    render() {
        let trends = this.state.index == 0 ? this.state.followTrends : this.state.recommendTrends;
        return (
            <View style={styles.container}>
                <HeaderBar style={styles.headerBar}>
                    <SwitchTabCell index={this.state.index} onPress={this.switchTab} list={this.state.items} style={styles.switchHeader} />
                    <Icon style={styles.camera} name={'ion|camera-outline'} size={24} onPress={this.publishTrend} onLongPress={this.publishTrendText} />
                </HeaderBar>
                <FlatList
                    data={trends}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData.bind(this, this.state.index)}
                    refreshing={this.state.refreshing}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}

                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadMore}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    headerBar: {
        backgroundColor: color.white,
        justifyContent: 'center',
    },
    switchHeader: {
        borderBottomWidth: 0,
        width: '50%',
    },
    camera: {
        position: 'absolute',
        right: 15,
        bottom: 5,
    },
});
