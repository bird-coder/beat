import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, StatusBar, DeviceEventEmitter, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';
import BaseUtil from '../../utils/BaseUtil';

import {Heading, Heading3, MyText, Paragraph} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import HeaderBar from '../../module/HeaderBar';
import BackBtn from '../../module/BackBtn';
import WeekChart from '../../module/report/WeekChart';
import SwitchItemCell from '../../module/SwitchItemCell';
import ChartView from '../../module/report/ChartView';
import WeekChart2 from '../../module/report/WeekChart2';

export default class SportWeekScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            devices: [
                {id: 1, name: '单车', title: '本周运动时长(min)', title1: '本周里程(km)', color: color.device_blue, icon: ImageResources.device_bicycle, duration: 0, record: 0, crease: 0, unit: 'km'},
                {id: 2, name: '划船机', title: '本周运动时长(min)', title1: '本周里程(km)', color: color.device_green, icon: ImageResources.device_rowing, duration: 0, record: 0, crease: 0, unit: 'km'},
                {id: 3, name: '健腹机', title: '本周运动时长(min)', title1: '本周个数(个)', color: color.device_purple, icon: ImageResources.device_abdomen, duration: 0, record: 0, crease: 0, unit: '个'},
                {id: 4, name: '踏步机', title: '本周运动时长(min)', title1: '本周步数(步)', color: color.warning, icon: ImageResources.device_step, duration: 0, record: 0, crease: 0, unit: '步'},
                {id: 5, name: '电子秤', title: '', title1: '本周体重(kg)', color: color.device_yellow, icon: ImageResources.device_balance, duration: 0, record: 0, crease: 0, unit: 'kg'},
                {id: 6, name: '跳绳子', title: '本周运动时长(min)', title1: '本周圈数(圈)', color: color.device_cyan, icon: ImageResources.device_rope, duration: 0, record: 0, crease: 0, unit: '圈'},
                {id: 7, name: '呼啦圈', title: '本周运动时长(min)', title1: '本周圈数(圈)', color: color.device_orange, icon: ImageResources.device_hula, duration: 0, record: 0, crease: 0, unit: '圈'},
            ],
            list: ['动感单车', '划船机', '健腹机', '踏步机', null, '跳绳子', '呼啦圈'],
            charts: {
                'duration': {
                    1: {'data': [], 'domain': [], 'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日']},
                    2: {'data': [], 'domain': [], 'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日']},
                    3: {'data': [], 'domain': [], 'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日']},
                    4: {'data': [], 'domain': [], 'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日']},
                    6: {'data': [], 'domain': [], 'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日']},
                    7: {'data': [], 'domain': [], 'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日']},
                },
                'consume': {
                    'data': [],
                    'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    'domain': [],
                },
                'section': {
                    'data': [],
                    'categories': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    'sections': [0,4,8,12,16,20,24],
                    'domain': [],
                },
            },
            totals: {
                'duration': {'num': 0, 'old': 0, 'rate': '0.00'},
                'consume': {'num': 0, 'old': 0, 'rate': '0.00'},
                'times': {'num': 0, 'old': 0, 'rate': '0.00'},
            },
            days: '本周',
            history: {'list': [], 'total': 0},
            index: 0,
        };
        this.headerHeight = ScreenUtil.HEADER_HEIGHT;
        this.timer = null;
        this.header = React.createRef();
    }

    componentDidMount(): void {
        this.requestHistory();
        this.requestSportWeekly();
        this.listener = DeviceEventEmitter.addListener('checkWeekCallback', this.handleCheckWeek);
    }

    componentWillUnmount(): void {
        this.listener.remove();
    }

    requestHistory = () => {
        let that = this;
        let timestamp = BaseUtil.getTimeStamp();
        let datetime = BaseUtil.getMonday().toLocaleDateString();
        let timestamp2 = (Date.parse(new Date(datetime)) / 1000) + 86400 * 7;
        let diff = timestamp2 - timestamp;
        HttpUtil.httpCache(api.getHistoryList, {}, diff + 300, HttpUtil.ReportCacheKey).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({history: json.data});
            }
        });
    }

    requestSportWeekly = (monday = '') => {
        let that = this;
        global.toastLoading('周报生成中。。。');
        let response;
        let tMonday = BaseUtil.getMonday().format('yyyy-MM-dd');
        if (monday.length > 0) {
            if (!BaseUtil.isMonday(monday)) monday = BaseUtil.getMonday(monday).format('yyyy-MM-dd');
        }
        if (monday.length == 0 || monday === tMonday) response = HttpUtil.httpCache(api.getSportWeekly, {}, 3600);
        else response = HttpUtil.httpCache(api.getSportWeekly, {monday}, -1, HttpUtil.ReportCacheKey);
        response.then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                console.log(json.data.charts['consume']);
                let newDevices = Object.assign([], this.state.devices);
                let devices = json.data.devices;
                for (let i in newDevices) {
                    let device = devices[newDevices[i].id];
                    if (device) {
                        newDevices[i].duration = device.duration;
                        newDevices[i].record = device.record;
                        newDevices[i].crease = device.crease;
                    }
                }
                that.setState({
                    devices: newDevices,
                    totals: json.data.list,
                    charts: json.data.charts,
                    days: json.data.days,
                });
            } else {
                global.toastShow(json.message);
            }
        }).finally(() => {
            global.toastHide();
        });
    }

    handleCheckWeek = (monday) => {
        let that = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            that.requestSportWeekly(monday);
        }, 200);
    }

    handleScroll = (event) => {
        let obj = event.nativeEvent.contentOffset;
        let opacity = 0;
        if (obj) {
            if (obj.y <= 0) opacity = 0.2;
            else if (obj.y >= this.headerHeight) opacity = 1;
            else {
                opacity = 0.2 + Math.round(obj.y / this.headerHeight * 8) / 10;
            }
            if (obj.y > 3) {
                this.header.current.setNativeProps({
                    style: {backgroundColor: color.headerBar, opacity: opacity},
                });
            } else {
                this.header.current.setNativeProps({
                    style: {backgroundColor: 'transparent', opacity: 1},
                });
            }
        }
    }

    renderDataView = (info: Object, type) => {
        let style = {color: color.finish_dot};
        if (info.rate < 0) style = {color: color.warning};
        let rate = info.rate >= 0 ? '+' + info.rate : info.rate;
        let title = '运动时长(分钟)';
        if (type == 'consume') title = '消耗热量(千卡)';
        else if (type == 'times') title = '运动次数(次)';
        return (
            <View style={[commonStyle.rowView, styles.dataView]}>
                <View style={styles.leftView}>
                    <MyText style={commonStyle.info}>{title}</MyText>
                    <SpacingView height={4} />
                    <Heading style={commonStyle.bold}>{info.num || 0}</Heading>
                </View>
                <View style={styles.growView}>
                    <MyText style={style}>{rate}%</MyText>
                    <Image source={info.rate >= 0 ? ImageResources.icon_up : ImageResources.icon_down} resizeMode={'stretch'} style={styles.icon}/>
                </View>
                <View style={commonStyle.fillView}/>
                <View style={styles.rightView}>
                    <MyText style={commonStyle.info}>{title}</MyText>
                    <SpacingView height={4} />
                    <Heading style={commonStyle.bold}>{info.old || 0}</Heading>
                </View>
            </View>
        );
    }

    renderDevice = (info: Object) => {
        let titleStyle = {color: info.color};
        let borderStyle = {borderLeftColor: info.color};
        let growStyle = {color: color.finish_dot, marginLeft: 3};
        if (info.crease < 0) growStyle = {color: color.warning, marginLeft: 3};
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
                        <MyText style={styles.deviceInfo}>同比上周</MyText>
                        <SpacingView height={6} />
                        <View style={commonStyle.rowView}>
                            <Image source={info.crease >= 0 ? ImageResources.icon_up : ImageResources.icon_down} resizeMode={'stretch'} style={styles.icon}/>
                            <MyText style={growStyle}>{info.crease >= 0 ? '+' + info.crease : info.crease} {info.unit}</MyText>
                        </View>
                    </View>
                    {info.title.length == 0 && <View style={{flex: 2}}/>}
                </View>
            </View>
        );
    }

    switchDevice = (index) => {
        this.setState({index});
    }

    render() {
        let header = <HeaderBar ref={this.header} style={styles.headerBar}>
            <BackBtn style={styles.backBtn} />
            <View style={commonStyle.fillView}/>
            <Heading style={styles.headerTitle}>周报数据</Heading>
            <View style={commonStyle.fillView}/>
            <View style={{width: 46}}/>
        </HeaderBar>;
        return (
            <>
                {header}
                <ScrollView onScroll={this.handleScroll}>
                    <LinearGradient colors={[color.headerBar2, color.headerBar]} start={{x:0, y:0}} end={{x:0, y:1}} style={styles.headerView}>
                        <SpacingView height={this.headerHeight} />
                        <SpacingView height={10} />
                        {/*<WeekChart />*/}
                        <WeekChart2 sections={this.state.history['list']} total={this.state.history['total']} />
                        <View style={styles.arrowMark}/>
                    </LinearGradient>
                    <View style={commonStyle.bodyView}>
                        <SpacingView height={14} />
                        <MyText style={styles.title}>周数据对比</MyText>
                        <SpacingView height={10} />
                        <View style={commonStyle.rowView}>
                            <Paragraph style={styles.week}>{this.state.days}</Paragraph>
                            <View style={commonStyle.fillView}/>
                            <Paragraph style={[commonStyle.info, styles.rightView]}>上周数据</Paragraph>
                        </View>
                        <SpacingView height={4} />
                        {this.renderDataView(this.state.totals['duration'], 'duration')}
                        {this.renderDataView(this.state.totals['consume'], 'consume')}
                        {this.renderDataView(this.state.totals['times'], 'times')}
                        <SpacingView height={13} />
                    </View>
                    <SpacingView height={10} />
                    <ChartView showTab={true} tabIndex={this.state.index} switchTab={this.switchDevice} tabList={this.state.list} title={'运动时长'} chart={this.state.charts['duration'][this.state.index + 1]} />
                    <SpacingView height={10} />
                    <ChartView color={color.finish_dot} title={'热量消耗'} chart={this.state.charts['consume']} />
                    <SpacingView height={10} />
                    <ChartView type={'section'} title={'运动时段'} chart={this.state.charts['section']} />
                    <View style={styles.deviceView}>
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
    },
    backBtn: {
        color: color.white,
    },
    headerView: {
        width: ScreenUtil.screenW,
        minHeight: 222,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    arrowMark: {
        width: 0,
        height: 0,
        position: 'absolute',
        borderBottomWidth: 8,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color.white,
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold',
    },
    week: {
        width: 80,
        fontWeight: 'bold',
        marginLeft: 22,
    },
    dataView: {
        width: '100%',
        height: 60,
        borderRadius: 4,
        backgroundColor: color.primary_1,
        paddingLeft: 22,
        paddingTop: 11,
        paddingBottom: 8,
        marginBottom: 12,
    },
    growView: {
        alignItems: 'center',
        marginLeft: 10,
    },
    leftView: {
        width: 100,
    },
    rightView: {
        width: 115,
    },
    deviceView: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
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
    tabView: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between',
    },
    tabItem: {
        alignItems: 'center',
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
    icon: {
        width: 15,
        height: 18,
    },
});
