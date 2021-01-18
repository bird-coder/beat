import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../common/color';
import api from '../common/api';
import commonStyle from '../common/style';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';
import HttpUtil from '../utils/HttpUtil';
import InitUtil from '../utils/InitUtil';
import BLEUtil from '../utils/BLEUtil';
import LocationUtil from '../utils/LocationUtil';

import {Heading, Heading2, Heading3, MyText} from '../module/Text';
import SpacingView from '../module/SpacingView';
import {NoMoreView, NoDataView} from '../module/NoDataView';
import HeaderBar from '../module/HeaderBar';
import BtnCell from '../module/BtnCell';
import SmallBtnCell from '../module/SmallBtnCell';

export default class PlanScene extends PureComponent {
    static navigationOptions = ({navigation: any}) => ({

    })

    constructor(props) {
        super(props);

        this.state = {
            plans: [
                // {id: 1, bg: '', title: '个性增肌计划', period: 12, distribute: [1,2,3,4], duration: '30', info: '1000人参与训练'},
                // {id: 2, bg: '', title: '告别肚腩计划', period: 4, distribute: [1,2,3,4], duration: '30', info: '1000人参与训练'},
                // {id: 3, bg: '', title: '腹肌撕裂计划', period: 4, distribute: [1,2,3,4], duration: '30', info: '1000人参与训练'},
            ],
            my_plan: null,
            refreshing: false,
        };
        this.plan_bgs = {
            1: ImageResources.plan_bg_bicycle,
            2: ImageResources.plan_bg_rowing,
            3: ImageResources.plan_bg_abdomen,
            4: ImageResources.plan_bg_step,
        };
    }

    componentDidMount(): void {
        this.listener = DeviceEventEmitter.addListener('addPlanCallback', this.requestMyPlan);
        this.requestData();
        InitUtil.init();
        global.showBleBtn();
        global.config.indexReady = true;
        if (global.checkBleState() == 'visible') BLEUtil.startBLEDevicesDiscovery();
        LocationUtil.getLocation();
    }

    componentWillUnmount(): void {
        this.listener.remove();
    }

    requestMyPlan = () => {
        let that = this;
        HttpUtil.post(api.getMyPlan).then((json) => {
            if (json.code == 0) {
                that.setState({my_plan: json.data.list});
            }
        });
    }

    requestData = () => {
        let that = this;
        this.requestMyPlan();
        HttpUtil.httpCache(api.getPlanList, {}, -1).then((json) => {
            if (json.code == 0) {
                that.setState({plans: json.data.plans});
            }
        });
    }

    selectPlan = () => {
        if (!this.state.my_plan) return;
        this.props.navigation.navigate('PlanDetail', {plan: this.state.my_plan});
    }

    seePlan = (index) => {
        let plan = this.state.plans[index];
        if (!plan) return;
        this.props.navigation.navigate('PlanTemplate', {plan});
    }

    addPlan = () => {
        this.props.navigation.navigate('SetPlan1', {});
    }

    renderCell = (info: Object, index) => {
        let plan_bg = this.plan_bgs[info.stype];
        if (!plan_bg) plan_bg = this.plan_bgs[1];
        return (
            <View>
                <TouchableOpacity activeOpacity={0.8} style={styles.planItem} onPress={this.seePlan.bind(this, index)}>
                    <ImageBackground source={info.bg && info.bg.length > 0 ? {uri: api.cdn + info.bg} : plan_bg} style={styles.backImg} resizeMode={'cover'}>
                        <MyText style={styles.planName}>{info.title}</MyText>
                        <SpacingView height={6} />
                        <View style={commonStyle.rowView}>
                            <MyText style={styles.content}>{info.period}周，每周{info.distribute.length}天，每天{info.duration}分钟</MyText>
                        </View>
                        <SpacingView height={43} />
                        <MyText style={styles.content}>{info.info}</MyText>
                    </ImageBackground>
                </TouchableOpacity>
                <SpacingView height={10} />
            </View>
        );
    }

    renderHeader = () => {
        return (
            <>
                <SpacingView height={10} />
                <ImageBackground source={ImageResources.plan_header} resizeMode={'stretch'} style={styles.headerBg}>
                    <SpacingView height={23} />
                    <Heading>定制您的计划</Heading>
                    <SpacingView height={4} />
                    <MyText style={styles.headerInfo}>量身定制，高效达成运动目标</MyText>
                    <SpacingView height={16} />
                    <BtnCell value={'添加计划'} onPress={this.addPlan} style={styles.btnView} textStyle={styles.btnText} />
                </ImageBackground>
            </>
        );
    }

    renderHeader2 = () => {
        let my_plan = this.state.my_plan;
        let total = 7 * my_plan.period;
        return (
            <>
                <SpacingView height={12} />
                <Heading3>我的训练计划</Heading3>
                <SpacingView height={12} />
                <ImageBackground source={ImageResources.plan_header2} resizeMode={'stretch'} style={styles.headerBg2}>
                    <TouchableOpacity activeOpacity={1} onPress={this.selectPlan}>
                        <View style={commonStyle.rowView}>
                            <Heading2 style={[styles.headerText, styles.headerTitle]}>{my_plan.title}</Heading2>
                            <View style={commonStyle.fillView}/>
                            <Icon name={'simpleline|arrow-right'} size={12} style={styles.arrow} />
                        </View>
                        <SpacingView height={6} />
                        <MyText style={styles.headerText}>已完成{my_plan.progress}/{total}天</MyText>
                    </TouchableOpacity>
                    {my_plan.next_detail && <>
                        <SpacingView height={18} />
                        <View style={styles.headerItem}>
                            <Heading3 style={styles.headerTitle}>{global.config.deviceList[my_plan.next_detail.stype]}训练</Heading3>
                            <SpacingView height={12} />
                            <MyText>{my_plan.next_detail.duration}分钟</MyText>
                            {my_plan.next_detail.state == 0 && <SmallBtnCell value={'开始训练'} onPress={this.selectPlan} isClean={true} style={styles.headerBtn} />}
                            {my_plan.next_detail.state == 1 && <SmallBtnCell value={'已完成'} onPress={this.selectPlan} style={styles.headerBtn} />}
                        </View>
                        <SpacingView height={12} />
                    </>}
                    {!my_plan.next_detail && <>
                        <SpacingView height={20} />
                        <SmallBtnCell value={'去开启'} onPress={this.selectPlan} style={styles.headerBtn2} />
                    </>}
                </ImageBackground>
            </>
        );
    }

    render() {
        let header = this.state.my_plan ? this.renderHeader2() : this.renderHeader();
        return (
            <View style={styles.container}>
                <HeaderBar style={styles.header}>
                    <Heading>计划</Heading>
                </HeaderBar>
                <ScrollView style={styles.planList}>
                    {header}
                    <SpacingView height={12} />
                    <Heading3>更多计划</Heading3>
                    <SpacingView height={12} />
                    {this.state.plans.length > 0 && this.state.plans.map((info, index) => (
                        this.renderCell(info, index)
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.white,
        flex: 1,
    },
    header: {
        justifyContent: 'center',
    },
    headerBg: {
        height: 140,
        paddingLeft: 25,
    },
    headerBg2: {
        // height: 215,
        paddingLeft: 13,
        paddingRight: 14,
        paddingTop: 22,
        paddingBottom: 22,
    },
    arrow: {
        color: color.white,
    },
    headerInfo: {
        color: color.info,
    },
    headerText: {
        color: color.white,
    },
    headerTitle: {
        fontWeight: 'bold',
    },
    headerItem: {
        backgroundColor: color.white,
        borderRadius: 4,
        width: '100%',
        height: 90,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 28,
    },
    headerBtn: {
        position: 'absolute',
        top: 31,
        right: 12,
    },
    headerBtn2: {
        position: 'absolute',
        width: 100,
        height: 30,
        borderRadius: 5,
        right: 12,
        bottom: 12,
    },
    btnView: {
        width: 114,
        height: 36,
        borderRadius: 18,
    },
    btnText: {
        fontSize: 13,
        lineHeight: 18,
    },
    planList: {
        paddingLeft: 12,
        paddingRight: 12,
    },
    planItem: {
        backgroundColor: color.paper,
        borderRadius: 4,
    },
    backImg: {
        height: 140,
        paddingLeft: 13,
        paddingTop: 19,
        paddingBottom: 18,
        borderRadius: 4,
    },
    planName: {
        fontSize: 16,
        lineHeight: 22,
        color: color.white,
        fontWeight: 'bold',
    },
    content: {
        color: color.paper,
    },
});
