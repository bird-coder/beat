import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, ImageBackground, DeviceEventEmitter} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, Heading2, Heading3, MyText, Paragraph} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import PicCell from '../../module/PicCell';
import BtnCell from '../../module/BtnCell';

export default class PlanTemplateScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>计划详情</Heading>),
    });

    constructor(props) {
        super(props);

        this.state = {
            plan: {id: 0, distribute: [], pic1: '', pic2: '', detail: ''},
            details: [],
        };
    }

    componentDidMount(): void {
        let params = this.props.navigation.state.params;
        if (!params.plan) return;
        let len = params.plan.distribute.length;
        if (len == 0) return;
        let details = {};
        let arr = params.plan.detail.split(';');
        for (let i in arr) {
            let detail = arr[i].split('-');
            if (detail.length != 2) continue;
            let week = Math.floor(i / len);
            if (!details[week]) details[week] = [];
            let index = parseInt(i)+1;
            if (index < 10) index = '0' + index;
            details[week].push({index: index, stype: detail[0], duration: detail[1]});
        }
        this.setState({plan: params.plan, details: Object.values(details)});
    }

    startPlan = () => {
        let plan = this.state.plan;
        if (!plan.id) return;
        let that = this;
        HttpUtil.post(api.startPlan, {pid: plan.id}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                DeviceEventEmitter.emit('addPlanCallback');
                that.props.navigation.navigate('PlanDetail', {plan: json.data.plan});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    renderItem = (info: Object, index) => {
        return (
            <>
                <Heading>第 {index+1} 周</Heading>
                {info.map((info1, index1) => (
                    <View style={commonStyle.rowView}>
                        <View style={styles.leftView}>
                            <MyText style={commonStyle.info}>{info1.index}</MyText>
                            <SpacingView height={5} />
                            <MyText style={commonStyle.info}>训练日</MyText>
                        </View>
                        <View style={styles.rightView}>
                            <Heading3>{global.config.deviceList[info1.stype]}训练</Heading3>
                            <SpacingView height={5} />
                            <MyText style={commonStyle.info}>{info1.duration} 分钟</MyText>
                        </View>
                    </View>
                ))}
                <SpacingView height={14} />
            </>
        );
    }

    render() {
        let plan = this.state.plan;
        let fillHeight = ScreenUtil.isIphoneX() ? 65 : 50;
        return (
            <>
                <ScrollView>
                    <View style={commonStyle.bodyView}>
                        <SpacingView height={14} />
                        <Heading2>{plan.title}</Heading2>
                        <SpacingView height={15} />
                        <View style={styles.tabView}>
                            <View>
                                <MyText style={commonStyle.info}>计划时长</MyText>
                                <SpacingView height={5} />
                                <MyText><MyText style={styles.total}>{plan.period}</MyText> 周</MyText>
                            </View>
                            <View>
                                <MyText style={commonStyle.info}>每周训练</MyText>
                                <SpacingView height={5} />
                                <MyText><MyText style={styles.total}>{plan.distribute.length}</MyText> 天</MyText>
                            </View>
                            <View>
                                <MyText style={commonStyle.info}>每日训练</MyText>
                                <SpacingView height={5} />
                                <MyText><MyText style={styles.total}>{plan.duration}</MyText> 分钟</MyText>
                            </View>
                        </View>
                        <SpacingView height={18} />
                        <View style={commonStyle.borderLine}/>
                        <SpacingView height={14} />
                        <Paragraph style={commonStyle.bold}>训练效果</Paragraph>
                        <SpacingView height={18} />
                        <Paragraph>{plan.content}</Paragraph>
                        {<>
                            <SpacingView height={18}/>
                            <View style={commonStyle.rowView}>
                                <View>
                                    <PicCell icon={plan.pic1} style={styles.pic} resizeMode={'cover'} resizeMethod={'resize'} />
                                    <View style={styles.picDrop}>
                                        <Heading3 style={commonStyle.white}>训练前</Heading3>
                                    </View>
                                </View>
                                <View>
                                    <PicCell icon={plan.pic2} style={styles.pic} resizeMode={'cover'} resizeMethod={'resize'} />
                                    <View style={styles.picDrop}>
                                        <Heading3 style={commonStyle.white}>训练后</Heading3>
                                    </View>
                                </View>
                            </View>
                            <SpacingView height={12} />
                            <MyText style={commonStyle.info}>
                            * 上述效果为练完全部课程的期望训练效果，实际效果因人而异
                            </MyText>
                        </>}
                        <SpacingView height={14} />
                    </View>
                    <SpacingView height={6} />
                    <View style={commonStyle.bodyView}>
                        <SpacingView height={14} />
                        <Paragraph style={commonStyle.bold}>训练安排</Paragraph>
                        <SpacingView height={14} />
                        {this.state.details.map((info, index) => (
                            this.renderItem(info, index)
                        ))}
                    </View>
                    <SpacingView height={fillHeight} />
                </ScrollView>
                <BtnCell value={'开启训练计划'} style={commonStyle.bottomRowBtn} width={1} onPress={this.startPlan} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // width: ScreenUtil.screenW,
        // height: ScreenUtil.screenH,
        flex: 1,
    },
    tabView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 5,
    },
    total: {
        fontSize: 22,
        lineHeight: 26,
        fontWeight: 'bold',
    },
    pic: {
        height: 200,
        width: ScreenUtil.screenW / 2 - 20,
        marginRight: 8,
    },
    picDrop: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: color.backdrop,
        width: ScreenUtil.screenW / 2 - 20,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftView: {
        width: 70,
    },
    rightView: {
        paddingTop: 14,
        paddingBottom: 14,
        borderBottomWidth: ScreenUtil.onePixel,
        borderBottomColor: color.border,
        flex: 1,
    },
});
