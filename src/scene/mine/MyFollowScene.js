import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, Image, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import TurnFollowCell from '../../module/mine/TurnFollowCell';
import {NoMoreView, NoDataView} from '../../module/NoDataView';
import BackBtn from '../../module/BackBtn';

export default class MyFollowScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <BackBtn onPress={navigation.state.params.navigateBack} />,
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
        headerRight: () => <Icon name={'ion|search'} color={color.gray} size={20} style={styles.search} onPress={navigation.state.params.navigatePress} />,
    });

    constructor(props) {
        super(props);

        let params = props.navigation.state.params;
        this.state = {
            type: params.type || 1,
            users: [
                // {id: 1},
            ],
            refreshing: false,
            more: true,
            page: 1,
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({navigatePress: this.searchFollow, navigateBack: this.goBack});
        this.listener = DeviceEventEmitter.addListener('searchFollowCallback', this.handelSwitchFollow);
        this.requestData();
    }

    componentWillUnmount(): void {
        this.listener.remove();
    }

    goBack = () => {
        DeviceEventEmitter.emit('mineUpdateCallback');
        this.props.navigation.goBack();
    }

    requestData = () => {
        let that = this;
        let url = this.state.type == 1 ? api.getUserFollows : api.getUserFans;
        HttpUtil.httpCache(url).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                let bool = json.data.length >= global.config.pageSize;
                that.setState({users: json.data, page: 1, more: bool});
            }
        });
    }

    loadMore = () => {
        let that = this;
        let url = this.state.type == 1 ? api.getUserFollows : api.getUserFans;
        if (!this.state.more) return;
        let page = this.state.page;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            page++;
            HttpUtil.post(url, {page}).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    let bool = json.data.length >= global.config.pageSize;
                    let users = that.state.users.concat(json.data);
                    that.setState({users, page: page, more: bool});
                }
            });
        }, 200);
    }

    searchFollow = () => {
        this.props.navigation.navigate('SearchPage', {users: this.state.users});
    }

    handelSwitchFollow = (changes) => {
        // console.log(changes);
        let users = Object.assign([], this.state.users);
        let num = 0;
        for (let i in users) {
            let change = changes[users[i].uid];
            if (typeof change !== 'undefined') {
                if (change == 1) {
                    if (users[i].del) num++;
                    users[i].del = false;
                } else {
                    if (!users[i].del) num--;
                    users[i].del = true;
                }
            }
        }
        // global.config.user.follow += num;
        this.setState({users});
    }

    switchFollow = (index) => {
        let that = this;
        let users = Object.assign([], this.state.users);
        let user = users[index];
        if (!user) return;
        let state;
        if (user.del) {
            user.del = false;
            state = 1;
        } else {
            user.del = true;
            state = 0;
        }
        HttpUtil.post(api.switchFollow, {fuid: user.uid, state: state}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({users});
                DeviceEventEmitter.emit('switchFollowCallback', state, user.uid);
            } else {
                global.toastShow(json.message);
            }
        });
    }

    renderCell = (info: Object) => {
        let follow = !info.item.del;
        return (
            <View style={commonStyle.bodyView}>
                <TurnFollowCell avatar={info.item.avatar} name={info.item.username} uid={info.item.uid} border={true} follow={follow} onPress={this.switchFollow.bind(this, info.index)} />
            </View>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.uid + '';
    }

    getItemLayout = (data, index) => {
        return {length: 70, offset: 70 * index, index};
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
            <View style={commonStyle.fillView}>
                <FlatList
                    data={this.state.users}
                    extraData={this.state}
                    renderItem={this.renderCell}
                    getItemLayout={this.getItemLayout}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
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
    container: {},
    search: {
        paddingRight: 11,
        paddingLeft: 10,
    },
});
