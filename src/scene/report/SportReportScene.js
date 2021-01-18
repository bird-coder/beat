import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, ImageBackground, Image, TouchableOpacity, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, Heading3, MyHeading, MyText, Paragraph} from '../../module/Text';
import HeaderBar from '../../module/HeaderBar';
import BackBtn from '../../module/BackBtn';
import SpacingView from '../../module/SpacingView';
import AvatarCell from '../../module/AvatarCell';
import ProgressCircle from '../../module/ProgressCircle';
import SportChart from '../../module/report/SportChart';

export default class SportReportScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            devices: [
                {id: 1, name: '单车', title: '运动时长(min)', title1: '里程(km)', title2: '单日最高记录(km)', color: color.device_blue, icon: ImageResources.device_bicycle, duration: 0, record: 0, max_record: 0, min_record: 0},
                {id: 2, name: '划船机', title: '运动时长(min)', title1: '里程(km)', title2: '单日最高记录(km)', color: color.device_green, icon: ImageResources.device_rowing, duration: 0, record: 0, max_record: 0, min_record: 0},
                {id: 3, name: '健腹机', title: '运动时长(min)', title1: '个数(个)', title2: '单日最高记录(个)', color: color.device_purple, icon: ImageResources.device_abdomen, duration: 0, record: 0, max_record: 0, min_record: 0},
                {id: 4, name: '踏步机', title: '运动时长(min)', title1: '步数(步)', title2: '单日最高记录(步)', color: color.warning, icon: ImageResources.device_step, duration: 0, record: 0, max_record: 0, min_record: 0},
                {id: 5, name: '电子秤', title: '', title1: '最大体重(kg)', title2: '最小体重(kg)', color: color.device_yellow, icon: ImageResources.device_balance, duration: 0, record: 0, max_record: 0, min_record: 0},
                {id: 6, name: '跳绳子', title: '运动时长(min)', title1: '圈数(圈)', title2: '单日最高记录(圈)', color: color.device_cyan, icon: ImageResources.device_rope, duration: 0, record: 0, max_record: 0, min_record: 0},
                {id: 7, name: '呼啦圈', title: '运动时长(min)', title1: '圈数(圈)', title2: '单日最高记录(圈)', color: color.device_orange, icon: ImageResources.device_hula, duration: 0, record: 0, max_record: 0, min_record: 0},
            ],
            totalPercent: 0,
            monthPercents: (new Array(12)).fill(0),
        };
        this.headerHeight = ScreenUtil.HEADER_HEIGHT;
        this.header = React.createRef();
        this.headerTitle = React.createRef();
    }

    componentDidMount(): void {
        this.requestSportTotal();
    }

    requestSportTotal = () => {
        let that = this;
        HttpUtil.httpCache(api.getSportTotal, {}, 3600).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                let newDevices = Object.assign([], this.state.devices);
                let devices = json.data.devices;
                for (let i in newDevices) {
                    let device = devices[newDevices[i].id];
                    if (device) {
                        newDevices[i].duration = device.duration;
                        newDevices[i].record = device.record;
                        newDevices[i].max_record = device.max_record;
                        newDevices[i].min_record = device.min_record;
                    }
                }
                that.setState({
                    devices: newDevices,
                    totalPercent: json.data.totalPercent,
                    monthPercents: json.data.monthPercents,
                });
            } else {
                global.toastShow(json.message);
            }
        });
    }

    goToWeekReport = () => {
        this.props.navigation.navigate('SportWeek', {});
    }

    renderDevice = (info: Object) => {
        let titleStyle = {color: info.color};
        let borderStyle = {borderLeftColor: info.color};
        return (
            <View style={[styles.cardView, borderStyle]}>
                <View style={commonStyle.rowView}>
                    <Image source={info.icon} resizeMode={'stretch'} style={styles.deviceImg}/>
                    <Heading3 style={titleStyle}>{info.name}</Heading3>
                </View>
                <SpacingView height={10} />
                <View style={styles.tabView}>
                    {info.title.length > 0 && <View style={styles.tabItem}>
                        <MyText style={styles.deviceInfo}>{info.title}</MyText>
                        <SpacingView height={5} />
                        <Heading style={commonStyle.bold}>{info.duration}</Heading>
                    </View>}
                    <View style={styles.tabItem}>
                        <MyText style={styles.deviceInfo}>{info.title1}</MyText>
                        <SpacingView height={5} />
                        <Heading style={commonStyle.bold}>{info.record}</Heading>
                    </View>
                    {info.title.length == 0 && <View style={commonStyle.fillView}/>}
                    <View style={styles.tabItem}>
                        <MyText style={styles.deviceInfo}>{info.title2}</MyText>
                        <SpacingView height={5} />
                        <Heading style={commonStyle.bold}>{info.max_record}</Heading>
                    </View>
                    {info.title.length == 0 && <View style={{flex: 2}}/>}
                </View>
            </View>
        );
    }

    handelScroll = (event) => {
        let obj = event.nativeEvent.contentOffset;
        let opacity = 0;
        if (obj) {
            console.log(obj);
            if (obj.y <= 0) opacity = 0.2;
            else if (obj.y >= this.headerHeight) opacity = 1;
            else {
                opacity = 0.2 + Math.round(obj.y / this.headerHeight * 8) / 10;
            }
            if (obj.y > 3) {
                this.header.current.setNativeProps({
                    style: {backgroundColor: color.headerBar, opacity: opacity},
                });
                this.headerTitle.current.setNativeProps({
                    style: {opacity: opacity},
                });
            } else {
                this.header.current.setNativeProps({
                    style: {backgroundColor: 'transparent', opacity: 1},
                });
                this.headerTitle.current.setNativeProps({
                    style: {opacity: 0},
                });
            }
        }
    }

    render() {
        let header = <HeaderBar ref={this.header} style={styles.headerBar}>
            <BackBtn style={styles.backBtn} />
            <View style={commonStyle.fillView}/>
            <MyHeading ref={this.headerTitle} style={styles.headerTitle}>运动数据</MyHeading>
            <View style={commonStyle.fillView}/>
            <View style={{width: 46}}/>
        </HeaderBar>;
        return (
            <>
                {header}
                <ScrollView onScroll={this.handelScroll}>
                    <ImageBackground source={ImageResources.sport_bg} resizeMode={'stretch'} style={styles.backImg}>
                        <SpacingView height={this.headerHeight} />
                        <View style={styles.headerView}>
                            <View style={styles.titleView}>
                                <MyText style={styles.title}>运动数据</MyText>
                                <View style={commonStyle.fillView}/>
                                <AvatarCell icon={global.config.user.avatar} style={styles.avatar} />
                            </View>
                            <SpacingView height={18} />
                            <View style={commonStyle.rowView}>
                                <View>
                                    <Paragraph style={styles.text}>总运动</Paragraph>
                                    <SpacingView height={4} />
                                    <MyText style={commonStyle.info}><MyText style={[styles.text, styles.time]}>{global.config.user.duration || 0}</MyText> 分钟</MyText>
                                </View>
                                <View style={commonStyle.fillView}/>
                                <Paragraph style={styles.week} onPress={this.goToWeekReport}>查看周报</Paragraph>
                                <Icon name={'simpleline|arrow-right'} size={12} style={styles.arrow} />
                            </View>
                            <SpacingView height={27} />
                            <View style={styles.tabView}>
                                <View style={styles.tabItem}>
                                    <MyText style={commonStyle.info}>消耗(千卡)</MyText>
                                    <SpacingView height={4} />
                                    <MyText style={styles.number}>{global.config.user.consume || 0}</MyText>
                                </View>
                                <View style={styles.tabItem}>
                                    <MyText style={commonStyle.info}>累计(天)</MyText>
                                    <SpacingView height={4} />
                                    <MyText style={styles.number}>{global.config.user.sport_days || 0}</MyText>
                                </View>
                                <View style={styles.tabItem}>
                                    <MyText style={commonStyle.info}>累计(次)</MyText>
                                    <SpacingView height={4} />
                                    <MyText style={styles.number}>{global.config.user.sport_times || 0}</MyText>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={styles.bodyView}>
                        <View style={styles.chartView}>
                            <MyText style={styles.chartTitle}>运动统计</MyText>
                            <SpacingView height={12} />
                            <View style={styles.rowView}>
                                <View>
                                    <View style={commonStyle.rowView}>
                                        <View style={styles.mark}/>
                                        <MyText style={styles.label}>总运动(天)</MyText>
                                    </View>
                                    <SpacingView height={10} />
                                    <ProgressCircle percent={this.state.totalPercent}>
                                        <ImageBackground source={ImageResources.chart_bg} resizeMode={'stretch'} style={styles.chartPic}>
                                            <View style={styles.chartContent}>
                                                <View style={commonStyle.rowView}>
                                                    <MyText style={styles.chartDay}>{global.config.user.sport_days || 0}</MyText>
                                                    <MyText style={styles.chartText}>天</MyText>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </ProgressCircle>
                                </View>
                                <View style={commonStyle.fillView}/>
                                <View>
                                    <View style={commonStyle.rowView}>
                                        <View style={[styles.mark, styles.itemMark]}/>
                                        <MyText style={styles.label}>月份</MyText>
                                        <View style={styles.mark}/>
                                        <MyText style={styles.label}>运动(天)</MyText>
                                    </View>
                                    <SpacingView height={25} />
                                    <SportChart list={this.state.monthPercents} />
                                </View>
                            </View>
                        </View>
                        <SpacingView height={14} />
                        {this.state.devices.map((info, index) => (
                            this.renderDevice(info)
                        ))}
                    </View>
                </ScrollView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    headerBar: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        zIndex: 3,
    },
    headerTitle: {
        color: color.white,
        opacity: 0,
    },
    backImg: {
        width: ScreenUtil.screenW,
        minHeight: 287,
    },
    backBtn: {
        color: color.white,
    },
    headerView: {
        paddingLeft: 25,
        paddingRight: 18,
        paddingTop: 8,
        paddingBottom: 27,
    },
    titleView: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        lineHeight: 33,
        fontWeight: 'bold',
        color: color.white,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        color: color.white,
    },
    time: {
        fontSize: 30,
        lineHeight: 35,
        fontWeight: 'bold',
    },
    week: {
        color: color.primary,
    },
    arrow: {
        marginLeft: 4,
        color: color.gray,
    },
    tabView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tabItem: {
        alignItems: 'center',
    },
    number: {
        fontSize: 18,
        color: color.white,
        fontWeight: 'bold',
    },
    bodyView: {
        padding: 12,
    },
    chartView: {
        height: 200,
        borderRadius: 4,
        backgroundColor: color.white,
        paddingTop: 13,
        paddingLeft: 13,
        paddingRight: 13,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    chartPic: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContent: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: color.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartDay: {
        fontSize: 23,
        lineHeight: 27,
        fontWeight: 'bold',
        color: color.text,
    },
    chartText: {
        fontSize: 11,
        lineHeight: 14,
        color: color.info,
    },
    rowView: {
        flexDirection: 'row',
    },
    mark: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: color.primary,
        marginRight: 3,
    },
    itemMark: {
        backgroundColor: color.border,
    },
    label: {
        fontSize: 10,
        lineHeight: 14,
        color: color.info,
        marginRight: 18,
    },
    cardView: {
        height: 120,
        borderRadius: 4,
        backgroundColor: color.white,
        borderLeftWidth: 6,
        borderLeftColor: color.warning,
        paddingTop: 13,
        paddingLeft: 15,
        paddingRight: 13,
        marginBottom: 12,
    },
    deviceImg: {
        width: 38,
        height: 38,
        marginRight: 8,
    },
    deviceInfo: {
        fontSize: 11,
        lineHeight: 14,
        color: color.info,
    },
});
