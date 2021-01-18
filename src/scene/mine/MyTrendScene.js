import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, FlatList, DeviceEventEmitter} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import UserItem from '../../module/index/UserItem';
import SpacingView from '../../module/SpacingView';
import {NoMoreView, NoDataView} from '../../module/NoDataView';

export default class MyTrendScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>我的动态</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            trends: [],
            refreshing: false,
            more: true,
            page: 1,
        };
    }
    componentDidMount(): void {
        this.requestData();
        this.thumbListener = DeviceEventEmitter.addListener('toggleThumbCallback', this.handleToggleThumb);
        this.delTrendListener = DeviceEventEmitter.addListener('deleteTrendCallback', this.handleDeleteTrend);
        this.commentListener = DeviceEventEmitter.addListener('sendCommentCallback', this.handleSendComment);
    }

    componentWillUnmount(): void {
        this.thumbListener.remove();
        this.delTrendListener.remove();
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

    handleDeleteTrend = (id) => {
        let trends = Object.assign([], this.state.trends);
        for (let i in trends) {
            if (trends[i].id == id) {
                trends.splice(i, 1);
            }
        }
        this.setState({trends});
    }

    handleSendComment = () => {
        let trends = Object.assign([], this.state.trends);
        this.setState({trends});
    }

    requestData = () => {
        let that = this;
        that.setState({refreshing: true});
        HttpUtil.httpCache(api.getUserTrends, {}, 3600).then((json) => {
            console.log('拉取用户动态接口' + JSON.stringify(json));
            if (!json) return;
            if (json && json.code == 0) {
                let bool = json.data.list.length >= global.config.pageSize;
                that.setState({trends: json.data.list, page: 1, more: bool});
            }
            that.setState({refreshing: false});
        });
    }

    loadMore = () => {
        let that = this;
        if (!this.state.more) return;
        let page = this.state.page;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            page++;
            HttpUtil.httpCache(api.getUserTrends, {page}).then((json) => {
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

    renderCell = (info: Object) => {
        return (
            <>
                <UserItem data={info.item} onPress={this.checkTrend.bind(this, info.index)} showFollow={true} type={'delete'} />
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
            <>
                <FlatList
                    data={this.state.trends}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}

                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadMore}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
});
