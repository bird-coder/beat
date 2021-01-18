import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../common/color';
import commonStyle from '../common/style';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';
import StorageUtil from '../utils/StorageUtil';

import AvatarCell from '../module/AvatarCell';
import {Heading2, Heading3, MyText} from '../module/Text';
import SpacingView from '../module/SpacingView';
import HeaderBar from '../module/HeaderBar';
import TurnDetailCell from '../module/TurnDetailCell';
import AdsCell from '../module/AdsCell';

export default class MineScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({

    })

    constructor(props) {
        super(props);

        this.state = {
            options: [
                {title: '我的计划', icon: ImageResources.my_plan},
                // {title: '我的教程', icon: ImageResources.my_course},
                {title: '我的设备', icon: ImageResources.my_device},
                {title: '帮助中心', icon: ImageResources.help_center},
            ],
            configs: [
                {title: '通用功能', icon: 'simpleline|settings'},
                // {title: '推送通知', icon: 'simpleline|settings'},
            ],
        };
    }

    componentDidMount(): void {
        this.listener = DeviceEventEmitter.addListener('mineUpdateCallback', this.handleUpdate);
    }

    componentWillUnmount(): void {
        this.listener.remove();
    }

    handleUpdate = () => {
        console.log(global.config.user);
        StorageUtil.set('userInfo', global.config.user);
        this.forceUpdate();
    }

    goToUser = () => {
        this.props.navigation.navigate('Profile', {});
    }

    goToConfig = () => {
        this.props.navigation.navigate('Config', {});
    }

    goToMsg = () => {
        this.props.navigation.navigate('Msg', {});
    }

    goToOption = (index) => {
        switch (index) {
            case 0:
                this.props.navigation.navigate('MyPlan', {title: '我的计划'});
                break;
            // case 1:
            //     this.props.navigation.navigate('MyCourse', {title: '我的教程'});
            //     break;
            case 1:
                this.props.navigation.navigate('MyDevice', {title: '我的设备'});
                break;
            case 2:
                this.props.navigation.navigate('HelpCenter', {title: '帮助中心'});
                break;
        }
    }

    goToDetail = (index) => {
        switch (index) {
            case 0:
                this.props.navigation.navigate('CommonConfig', {});
                break;
            case 1:
                this.props.navigation.navigate('NoticeConfig', {});
                break;
        }
    }

    goToFollow = (type) => {
        let title = '我的关注';
        if (type == 2) title = '我的粉丝';
        this.props.navigation.navigate('MyFollow', {title: title, type: type});
    }

    goToTrend = () => {
        this.props.navigation.navigate('MyTrend', {});
    }

    goToReport = (index) => {
        if (index == 0) this.props.navigation.navigate('SportReport', {});
        else this.props.navigation.navigate('HealthReport', {});
    }

    render() {
        return (
            <ScrollView>
                <ImageBackground source={ImageResources.card} resizeMode={'stretch'} style={styles.card}>
                    <HeaderBar style={styles.headerBar}>
                        {/*<Icon style={styles.barBtn} name={'settings'} size={20} onPress={this.goToConfig} />*/}
                        <View style={commonStyle.fillView} />
                        {/*<Icon style={styles.barBtn} namFe={'ion|chatbox-ellipses-outline'} size={24} onPress={this.goToMsg} />*/}
                    </HeaderBar>
                    <TouchableOpacity activeOpacity={0.8} style={[commonStyle.rowView, styles.profileView]} onPress={this.goToUser}>
                        <AvatarCell style={styles.avatar} icon={global.config.user.avatar} onPress={this.goToUser} />
                        <View>
                            <MyText style={styles.name}>{global.config.user.username || '匿名'}</MyText>
                            <MyText style={styles.phone}>{global.config.user.phone}</MyText>
                        </View>
                        <View style={commonStyle.fillView} />
                        <MyText style={styles.icon}><Icon name={'simpleline|arrow-right'} size={12} color={color.white} /></MyText>
                    </TouchableOpacity>
                    <SpacingView height={18} />
                    {/*<View style={styles.tabView}>*/}
                    {/*    <TouchableOpacity activeOpacity={1} style={styles.tabItem} onPress={this.goToFollow.bind(this, 1)}>*/}
                    {/*        <MyText style={styles.number}>{global.config.user.follow || 0}</MyText>*/}
                    {/*        <MyText style={styles.category}>关注</MyText>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*    <TouchableOpacity activeOpacity={1} style={styles.tabItem} onPress={this.goToFollow.bind(this, 2)}>*/}
                    {/*        <MyText style={styles.number}>{global.config.user.fans || 0}</MyText>*/}
                    {/*        <MyText style={styles.category}>粉丝</MyText>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*    <TouchableOpacity activeOpacity={1} style={styles.tabItem} onPress={this.goToTrend}>*/}
                    {/*        <MyText style={styles.number}>{global.config.user.trends || 0}</MyText>*/}
                    {/*        <MyText style={styles.category}>动态</MyText>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                    <SpacingView height={19} />
                </ImageBackground>
                <View style={styles.container}>
                    <View style={[commonStyle.rowView, styles.dataList]}>
                        <TouchableOpacity activeOpacity={1} onPress={this.goToReport.bind(this, 0)} style={styles.dataView}>
                            <View style={commonStyle.rowView}>
                                <Heading3>运动数据</Heading3>
                                <View style={commonStyle.fillView} />
                                <MyText><Icon name={'simpleline|arrow-right'} size={12} color={color.gray} /></MyText>
                            </View>
                            <SpacingView height={15} />
                            <MyText style={styles.subtitle}>总运动</MyText>
                            <SpacingView height={6} />
                            <MyText><Heading2>{global.config.user.duration || 0}</Heading2> 分钟</MyText>
                            <SpacingView height={13} />
                            <MyText style={styles.info}>{global.config.user.last_sport_day ? '上次记录 ' + global.config.user.last_sport_day : '暂无记录'}</MyText>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={this.goToReport.bind(this, 1)} style={styles.dataView}>
                            <View style={commonStyle.rowView}>
                                <Heading3>健康数据</Heading3>
                                <View style={commonStyle.fillView} />
                                <MyText><Icon name={'simpleline|arrow-right'} size={12} color={color.gray} /></MyText>
                            </View>
                            <SpacingView height={15} />
                            <MyText style={styles.subtitle}>体重</MyText>
                            <SpacingView height={6} />
                            <MyText><Heading2>{global.config.user.weight || 0}</Heading2> kg</MyText>
                            <SpacingView height={13} />
                            <MyText style={styles.info}>{global.config.user.last_weight_day ? '上次记录 ' + global.config.user.last_weight_day : '暂无记录'}</MyText>
                        </TouchableOpacity>
                    </View>
                    <SpacingView height={12} />
                    <View style={[commonStyle.rowView, styles.items]}>
                        {this.state.options.map((info, index) => (
                            <TouchableOpacity activeOpacity={0.8} onPress={this.goToOption.bind(this, index)} style={styles.item}>
                                <Image source={info.icon} resizeMode={'stretch'} style={styles.img} />
                                <SpacingView height={10} />
                                <MyText>{info.title}</MyText>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <SpacingView height={12} />
                    <View style={styles.detailView}>
                        {this.state.configs.map((info, index) => (
                            <TurnDetailCell title={info.title} icon={info.icon} style={styles.detail} onPress={this.goToDetail.bind(this, index)} border={true} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.paper,
        padding: 12,
    },
    headerBar: {
        backgroundColor: 'transparent',
    },
    card: {
        width: ScreenUtil.screenW,
        minHeight: 222,
        backgroundColor: color.paper,
    },
    barBtn: {
        marginLeft: 15,
        marginRight: 15,
        // paddingTop: 15,
        color: color.white,
    },
    profileView: {
        padding: 12,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        marginRight: 10,
    },
    name: {
        color: color.white,
        fontSize: 16,
    },
    phone: {
        color: color.info,
        fontSize: 15,
        marginTop: 5,
    },
    icon: {
        marginRight: 10,
    },
    tabView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tabItem: {
        alignItems: 'center',
        paddingLeft: 27,
        paddingRight: 27,
    },
    number: {
        fontSize: 18,
        color: color.white,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 12,
        color: color.info,
    },
    dataList: {
        justifyContent: 'space-between',
    },
    dataView: {
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: color.white,
        width: ScreenUtil.screenW / 2 - 16.5,
        borderRadius: 4,
        shadowColor: color.black,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 6,
    },
    subtitle: {
        color: color.info,
        fontSize: 12,
    },
    info: {
        fontSize: 11,
    },
    items: {
        width: '100%',
        backgroundColor: color.white,
        borderRadius: 5,
        flexWrap: 'wrap',
    },
    item: {
        alignItems: 'center',
        // width: ScreenUtil.screenW / 4 - 6,
        paddingTop: 20,
        paddingBottom: 20,
        flex: 1,
    },
    img: {
        width: 22,
        height: 22,
        marginTop: 4,
    },
    detailView: {
        backgroundColor: color.white,
        borderRadius: 4,
        paddingLeft: 12,
        paddingRight: 12,
    },
    detail: {

    },
});
