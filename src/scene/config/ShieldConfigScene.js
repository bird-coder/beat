import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';

import api from '../../common/api';
import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, Heading3, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import {NoDataView, NoMoreView} from '../../module/NoDataView';
import AvatarCell from '../../module/AvatarCell';

export default class ShieldConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title || '屏蔽列表'}</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            users: [''],
            refreshing: false,
            more: true,
            page: 1,
        };
    }

    componentDidMount(): void {
        this.requestData();
    }

    requestData = () => {
        let that = this;
        HttpUtil.post(api.getUserShields).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                let bool = json.data.length >= global.config.pageSize;
                that.setState({users: json.data, page: 1, more: bool});
            }
        });
    }

    loadMore = () => {
        let that = this;
        if (!this.state.more) return;
        let page = this.state.page;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            page++;
            HttpUtil.post(api.getUserShields, {page}).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    let bool = json.data.length >= global.config.pageSize;
                    let users = that.state.users.concat(json.data);
                    that.setState({users, page: page, more: bool});
                }
            });
        }, 200);
    }

    switchShield = (index) => {
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
        let text = state == 1 ? '您确定要将此人加入屏蔽列表吗？' : '您确定要将此人从屏蔽列表移除吗？';
        global.toastAlert('操作确认', text, '', '', (res) => {
            if (res) {
                HttpUtil.post(api.switchShield, {target: user.uid, state: state}).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        that.setState({users});
                    } else {
                        global.toastShow(json.message);
                    }
                });
            }
        });
    }

    goToUserInfo = (uid) => {
        this.props.navigation.navigate('UserInfo', {uid});
        // if (this.props.vip) this.props.navigation.navigate('VipUserInfo', {});
        // else this.props.navigation.navigate('UserInfo', {});
    }

    renderCell = (info: Object) => {
        let shield = !info.item.del;
        let img = shield ? ImageResources.switch_on : ImageResources.switch_off;
        return (
            <View style={[styles.itemView, styles.border]}>
                <AvatarCell icon={info.item.avatar} style={styles.avatar} onPress={this.goToUserInfo.bind(this, info.item.uid)} />
                <Heading3 numberOfLines={1} style={styles.title}>{info.item.username}</Heading3>
                <View style={commonStyle.fillView} />
                <TouchableOpacity activeOpacity={1} onPress={this.switchShield.bind(this, info.index)}>
                    <Image source={img} resizeMode={'stretch'} style={styles.btn} />
                </TouchableOpacity>
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
    itemView: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: color.white,
    },
    border: {
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
    },
    btn: {
        width: 44,
        height: 22,
    },
    title: {
        marginLeft: 6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});
