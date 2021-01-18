import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';

import {MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import FollowCell from '../../module/FollowCell';
import AvatarCell from '../../module/AvatarCell';
import SwitchTabCell from '../../module/SwitchTabCell';
import UserItem from '../../module/index/UserItem';
import HeaderBar from '../../module/HeaderBar';
import BackBtn from '../../module/BackBtn';
import {NoDataView, NoMoreView} from '../../module/NoDataView';

export default class VipUserInfoScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({
        headerShown: false,
    })

    constructor(props) {
        super(props);

        this.state = {
            more: true,
            items: ['主页', '动态', '视频', '相册', '记录'],
            index: 0,
            trends: [
                {uid: 1, vip: 1, avatar: '', name: '小鸡鸡', follow: 100, content: '十三水', pics: ['', '', '', ''], thumb: 120, browse: 88, ctime: 0},
                {uid: 2, vip: 0, avatar: '', name: '小鸡鸡', follow: 100, content: '十三水', pics: ['', '', ''], thumb: 120, browse: 88, ctime: 0},
            ],
            vip: 1,
        };
    }

    switchTab = (index) => {
        this.setState({index: index});
    }

    loadData = () => {

    }

    checkTrend = (index) => {
        this.props.navigation.navigate('Trend', {});
    }

    renderCell = (info: Object) => {
        return (
            <View>
                <UserItem data={info.item} onPress={this.checkTrend.bind(this, info.index)} showFollow={false} />
                <SpacingView height={10} />
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
        return (
            <View>
                <View style={styles.bgView}>
                    <Image source={ImageResources.step} style={styles.bgImg} resizeMode={'cover'} />
                    <View style={styles.profileView}>
                        <HeaderBar>
                            <BackBtn style={styles.back} />
                        </HeaderBar>
                        {/*<SpacingView height={30} />*/}
                        <View style={styles.headerView}>
                            <AvatarCell style={styles.avatar} icon={null} vip={this.state.vip} big={true} />
                            <View style={commonStyle.fillView}></View>
                            <FollowCell follow={false} />
                        </View>
                        <SpacingView height={10} />
                        <MyText style={styles.name}>天火</MyText>
                        <SpacingView height={15} />
                        <MyText style={styles.content}>哈哈哈</MyText>
                        <SpacingView height={10} />
                        <MyText style={styles.content}><MyText style={styles.content}>男</MyText> | <MyText style={styles.content}>上海，浦东</MyText></MyText>
                        <SpacingView height={30} />
                        <View style={styles.tabView}>
                            <View style={styles.tabItem}>
                                <MyText>0</MyText>
                                <MyText>关注</MyText>
                            </View>
                            <View style={styles.tabItem}>
                                <MyText>0</MyText>
                                <MyText>粉丝</MyText>
                            </View>
                            <View style={styles.tabItem}>
                                <MyText>0</MyText>
                                <MyText>获赞</MyText>
                            </View>
                        </View>
                    </View>
                </View>
                <SwitchTabCell index={this.state.index} onPress={this.switchTab} list={this.state.items} />
                {this.state.index == 0 && <View style={styles.total}>
                    <MyText style={styles.totalText}>全部动态（90）</MyText>
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
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}

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
    bgView: {
        backgroundColor: color.white,
        minHeight: ScreenUtil.screenH * 0.52,
    },
    bgImg: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH * 0.42,
    },
    back: {
        color: color.white,
        marginLeft: -15,
    },
    profileView: {
        width: ScreenUtil.screenW,
        height: '100%',
        backgroundColor: color.backdrop,
        padding: 15,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: ScreenUtil.screenW * 0.25,
        height: ScreenUtil.screenW * 0.25,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.white,
    },
    content: {
        fontSize: 13,
        color: color.paper,
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
