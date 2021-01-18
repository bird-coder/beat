import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, ImageBackground, Image, TouchableOpacity, DeviceEventEmitter} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';
import PermissionUtil from '../../utils/PermissionUtil';

import {Heading, Heading2, Heading3, MyText, Paragraph} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import ProgressBar from '../../module/ProgressBar';
import {MyWeekCalendar, MyCalendar} from '../../module/MyCalendar';
import BackBtn from '../../module/BackBtn';
import SmallBtnCell from '../../module/SmallBtnCell';
import BtnCell from '../../module/BtnCell';
import PicCell from '../../module/PicCell';
import CommonAction from '../../module/CommonAction';

export default class PlanDetailScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => (<BackBtn onPress={navigation.state.params.navigateBack} />),
        headerTitle: () => {},
    });

    constructor(props) {
        super(props);

        let params = props.navigation.state.params;
        this.state = {
            actions: ['拍照', '从手机相册选择'],
            plan: (params && params.plan) || {id: 0, distribute: [], pic1: '', pic2: '', detail: ''},
            details: [],
            index: 0,
            type: 1,
        };
        this.plan_details = {
            1: ImageResources.plan_detail_bicycle,
            2: ImageResources.plan_detail_rowing,
            3: ImageResources.plan_detail_abdomen,
            4: ImageResources.plan_detail_step,
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({'navigateBack': this.goBack});
        if (this.state.plan.state >= 2) this.requestDetails();
        else this.formatDetails();
        this.props.navigation.addListener('willFocus', this.handleFocus);
    }

    goBack = () => {
        let params = this.props.navigation.state.params;
        if (params.from && params.from == 'add') this.props.navigation.navigate('Tab', {});
        else this.props.navigation.goBack();
    }

    handleFocus = () => {
        if (global.config.planInfo.active == 1) {
            global.config.planInfo = {};
            this.showPicTip();
        }
    }

    showPicTip = () => {
        global.toastAlert('上传身体剪影', '记录您当前的身材，方便与训练结束后形成对比，看到更直观的改变', '', '', (res) => {
            if (res) {

            }
        });
    }

    formatDetails = () => {
        let plan = this.state.plan;
        let days = 7;
        let details = [];
        let arr = plan.detail.split(';');
        let date = new Date();
        let index = 0;
        for (let i = 0; i < days; i++) {
            let w = date.getDay() || 7;
            let d = date.getDate();
            let dayStr = date.format('yyyy-MM-dd');
            let detail = {day: dayStr, w, d, plan: false};
            if (plan.distribute.indexOf(w+'') != -1) {
                let params = arr[index].split('-');
                if (params.length != 2) continue;
                detail.plan = true;
                detail.stype = params[0];
                detail.duration = params[1];
                detail.state = 0;
            }
            details.push(detail);
            date.setDate(date.getDate() + 1);
        }
        this.setState({details});
    }

    requestDetails = () => {
        let plan = this.state.plan;
        if (!plan.id) return;
        let type = 0;
        if (plan.state > 2) type = 1;
        let that = this;
        let response;
        if (type == 1) response = HttpUtil.httpCache(api.getPlanDetails, {id: plan.id, type}, -1, HttpUtil.PlanCacheKey);
        else response = HttpUtil.httpCache(api.getPlanDetails, {id: plan.id, type}, 3600);
        response.then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({details: json.data.details});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    checkDay = (index) => {
        this.setState({index});
    }

    editPlan = () => {
        let plan = this.state.plan;
        if (!plan || plan.state != 1) return;
        global.config.planInfo = {id: plan.id, stype: plan.stype, period: plan.period, distribute: plan.distribute, noticeTime: plan.noticeTime};
        this.props.navigation.navigate('SetPlan1', {});
    }

    startPlan = () => {
        let plan = this.state.plan;
        if (!plan.id) return;
        let that = this;
        HttpUtil.post(api.startPlan, {id: plan.id}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                DeviceEventEmitter.emit('addPlanCallback');
                that.setState({plan: json.data.plan});
                that.requestDetails();
                that.showPicTip();
            } else {
                global.toastShow(json.message);
            }
        });
    }

    finishPlan = () => {
        let plan = Object.assign({}, this.state.plan);
        if (!plan.id) return;
        let that = this;
        global.toastAlert('放弃计划', '放弃计划将会提前结束该计划，此过程不可取消，是否放弃？', '', '', (res) => {
            if (res) {
                HttpUtil.post(api.finishPlan, {id: plan.id}).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {
                        DeviceEventEmitter.emit('addPlanCallback');
                        plan.state = 3;
                        that.setState({plan});
                        that.requestDetails();
                    } else {
                        global.toastShow(json.message);
                    }
                });
            }
        });
    }

    renderHeader = () => {
        let plan = this.state.plan;
        return (
            <View style={commonStyle.bodyView}>
                <SpacingView height={14} />
                <View style={commonStyle.rowView}>
                    <Heading2>已生成您的<Heading2 style={styles.special}>专属</Heading2>计划</Heading2>
                    <View style={commonStyle.fillView}/>
                    <SmallBtnCell value={'重新定制'} isClean={true} onPress={this.editPlan} />
                </View>
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
            </View>
        );
    }

    renderHeader2 = () => {
        let plan = this.state.plan;
        let total = 7 * plan.period;
        let width = (plan.progress / total).toFixed(2);
        return (
            <>
                <SpacingView height={6} />
                <View style={commonStyle.bodyView}>
                    <SpacingView height={10} />
                    <View style={commonStyle.rowView}>
                        <Heading2>{plan.title}</Heading2>
                        <View style={commonStyle.fillView}/>
                        {plan.state == 2 && <SmallBtnCell value={'放弃计划'} isClean={true} onPress={this.finishPlan} />}
                    </View>
                    <SpacingView height={8} />
                    <MyText style={commonStyle.info}>已完成{plan.progress}/{total}天</MyText>
                    <SpacingView height={9} />
                    <ProgressBar width={width} />
                    <SpacingView height={20} />
                    <View style={commonStyle.borderLine}/>
                </View>
            </>
        );
    }

    renderDayPlan = () => {
        let detail = this.state.details[this.state.index];
        if (detail && detail.plan) {
            return (
                <View style={commonStyle.bodyView}>
                    <SpacingView height={13} />
                    <Paragraph style={commonStyle.bold}>{detail.d}日训练</Paragraph>
                    <SpacingView height={12} />
                    <ImageBackground source={this.plan_details[detail.stype]} resizeMode={'stretch'} style={styles.bg}>
                        <Heading3 style={[commonStyle.white, commonStyle.bold]}>{global.config.deviceList[detail.stype]}训练</Heading3>
                        <SpacingView height={10} />
                        <MyText style={commonStyle.white}>{detail.duration}分钟</MyText>
                    </ImageBackground>
                    <SpacingView height={27} />
                </View>
            );
        } else {
            return (
                <View style={[commonStyle.bodyView, styles.stopDay]}>
                    <Image source={ImageResources.icon_coffee} resizeMode={'stretch'} style={styles.icon} />
                    <SpacingView height={10} />
                    <Heading>休息日</Heading>
                </View>
            );
        }
    }

    upload = (type) => {
        this.setState({type});
        global.toastActionSheet(<CommonAction confirm={this.selectUpload} list={this.state.actions} showCancel={false} />);
    }

    selectUpload = (index) => {
        let that = this;
        if (index == 0) {
            PermissionUtil.requestPermission(['CAMERA']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Camera', {callback: that.uploadPhoto});
                }
            });
        } else {
            let response;
            if (global.platform.isIOS) response = PermissionUtil.requestPermission(['PHOTO_LIBRARY']);
            else response = PermissionUtil.requestPermission(['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']);
            response.then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Album', {maxFiles: 1, callback: that.uploadPhoto});
                }
            });
        }
    }

    uploadPhoto = (imgs) => {
        let that = this;
        if (imgs.length == 0) return;
        if ([1,2].indexOf(that.state.type) == -1) return;
        let params = {
            filedata: { uri: imgs[0], type: 'image/jpeg', name: 'image.jpg' },
            type: that.state.type,
            id: that.state.plan.id,
        };
        HttpUtil.postFile(api.uploadPlanPhoto, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                // HttpUtil.clearAllCache(HttpUtil.BodyPhotoCacheKey);
                let plan = Object.assign({}, that.state.plan);
                plan['pic' + that.state.type] = json.data.url;
                that.setState({plan});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    render() {
        let plan = this.state.plan;console.log(plan);
        let header = plan.state >= 2 ? this.renderHeader2() : this.renderHeader();
        let calendar = <MyWeekCalendar details={this.state.details} onPress={this.checkDay} />;
        if (plan.state > 2) calendar = <MyCalendar details={this.state.details} onPress={this.checkDay} />;
        return (
            <>
                <ScrollView>
                    {header}
                    <View style={styles.calendarView}>
                        <SpacingView height={10} />
                        {plan.state == 1 && <Paragraph style={styles.title}>计划预览</Paragraph>}
                        {calendar}
                        <SpacingView height={10} />
                    </View>
                    <SpacingView height={5} />
                    {this.renderDayPlan()}
                    <SpacingView height={5} />
                    <View style={styles.rowView}>
                        <Heading3>训练前</Heading3>
                        <Heading3>训练后</Heading3>
                    </View>
                    <View style={styles.picView}>
                        <View>
                            {plan.pic1.length > 0 && <PicCell icon={plan.pic1} style={styles.pic} resizeMode={'cover'} resizeMethod={'resize'} />}
                            {plan.pic1.length == 0 && <TouchableOpacity activeOpacity={1} onPress={this.upload.bind(this, 1)} style={styles.picItem}>
                                <MyText style={{fontSize: 30, color: color.info}}>+</MyText>
                            </TouchableOpacity>}
                            <View style={styles.picDrop}>
                                <Paragraph style={commonStyle.white}>训练前</Paragraph>
                            </View>
                        </View>
                        <View>
                            {plan.pic2.length > 0 && <PicCell icon={plan.pic2} style={styles.pic} resizeMode={'cover'} resizeMethod={'resize'} />}
                            {plan.pic2.length == 0 && <TouchableOpacity activeOpacity={1} onPress={this.upload.bind(this, 2)} style={styles.picItem}>
                                <MyText style={{fontSize: 30, color: color.info}}>+</MyText>
                            </TouchableOpacity>}
                            <View style={styles.picDrop}>
                                <Paragraph style={commonStyle.white}>训练后</Paragraph>
                            </View>
                        </View>
                    </View>
                    {plan.state == 1 && <SpacingView height={50} />}
                </ScrollView>
                {plan.state == 1 && <BtnCell value={'开启训练计划'} style={commonStyle.bottomRowBtn} width={1} onPress={this.startPlan} />}
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
    special: {
        color: color.primary,
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
    calendarView: {
        backgroundColor: color.white,
    },
    title: {
        fontWeight: 'bold',
        marginLeft: 12,
    },
    stopDay: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 162,
    },
    icon: {

    },
    bg: {
        height: 90,
        paddingTop: 21,
        paddingBottom: 21,
        paddingLeft: 37,
        paddingRight: 37,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: color.white,
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
        paddingTop: 10,
        paddingBottom: 10,
    },
    picView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: color.white,
        paddingTop: 20,
        paddingBottom: 20,
    },
    picItem: {
        width: 100,
        height: 120,
        backgroundColor: color.paper,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pic: {
        width: 100,
        height: 120,
    },
    picDrop: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: color.backdrop,
        width: 100,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
