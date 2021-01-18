import React, {PureComponent} from 'react';
import {BackHandler, View, StatusBar, StyleSheet, Text, Image, TextInput, Alert, AppState, DeviceEventEmitter} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';
import Toast from 'react-native-root-toast';
import {RootSiblingParent} from 'react-native-root-siblings';
import {UnityModule} from '@asmadsen/react-native-unity-view';
import {AdManager} from 'react-native-admob-native-ads';

import extend from './common/extend';
import config from './common/config';
import api from './common/api';
import color from './common/color';
import commonStyle from './common/style';
import ImageResources from './common/image';
import Area from './common/storage/area.json';
import TabBarItem from './utils/TabBarItem';
import StorageUtil from './utils/StorageUtil';
import ScreenUtil from './utils/ScreenUtil';
import HttpUtil from './utils/HttpUtil';
import BLEUtil from './utils/BLEUtil';
import BaseUtil from './utils/BaseUtil';
import FileUtil from './utils/FileUtil';
import SoundUtil from './utils/SoundUtil';

import ToastModal from './module/ToastModal';
import {Heading} from './module/Text';
import HeaderBar from './module/HeaderBar';
import BackBtn from './module/BackBtn';
import BleDeviceNode from './module/sport/BleDeviceNode';
import BleBtnCell from './module/BleBtnCell';

import BranchScene from './BranchScene';
import GuideScene from './scene/GuideScene';
//auth
import LoginScene from './scene/auth/LoginScene';
import RegScene from './scene/auth/RegScene';
import PhoneScene from './scene/auth/PhoneScene';
import CodeScene from './scene/auth/CodeScene';
import ForgetScene from './scene/auth/ForgetScene';
import UpdatePassScene from './scene/auth/UpdatePassScene';
import SetPassScene from './scene/auth/SetPassScene';
import SetBasicScene from './scene/auth/SetBasicScene';
import SetSexScene from './scene/auth/SetSexScene';
import SetBirthScene from './scene/auth/SetBirthScene';
import SetHeightScene from './scene/auth/SetHeightScene';
import SetWeightScene from './scene/auth/SetWeightScene';
import SetBMIScene from './scene/auth/SetBMIScene';
import AgreementScene from './scene/auth/AgreementScene';
import PrivacyScene from './scene/auth/PrivacyScene';
//tab
import IndexScene from './scene/IndexScene';
import SportScene from './scene/SportScene';
import PlanScene from './scene/PlanScene';
import MineScene from './scene/MineScene';
import TestScene from './scene/TestScene';
import TestUnityScene from './scene/TestUnityScene';
//index
import TrendScene from './scene/index/TrendScene';
import CommentDetailScene from './scene/index/CommentDetailScene';
import TrendSubmitScene from './scene/index/TrendSubmitScene';
//common
import AlbumScene from './scene/index/AlbumScene';
import CameraScene from './scene/index/CameraScene';
import UserInfoScene from './scene/public/UserInfoScene';
import VipUserInfoScene from './scene/public/VipUserInfoScene';
//sport
import BleConnectScene from './scene/sport/BleConnectScene';
import SportModeScene from './scene/sport/SportModeScene';
import PanelScene from './scene/sport/PanelScene';
import Panel2Scene from './scene/sport/Panel2Scene';
import PanelRopeScene from './scene/sport/PanelRopeScene';
import GameScene from './scene/sport/GameScene';
//plan
import SetPlan1Scene from './scene/plan/SetPlan1Scene';
import SetPlan2Scene from './scene/plan/SetPlan2Scene';
import SetPlan3Scene from './scene/plan/SetPlan3Scene';
import SetPlan4Scene from './scene/plan/SetPlan4Scene';
import SetPlan5Scene from './scene/plan/SetPlan5Scene';
import SetPlan6Scene from './scene/plan/SetPlan6Scene';
import PlanDetailScene from './scene/plan/PlanDetailScene';
import PlanTemplateScene from './scene/plan/PlanTemplateScene';
//config
import ConfigScene from './scene/config/ConfigScene';
import AccountConfigScene from './scene/config/AccountConfigScene';
import AuthConfigScene from './scene/config/AuthConfigScene';
import NoticeConfigScene from './scene/config/NoticeConfigScene';
import PrivacyConfigScene from './scene/config/PrivacyConfigScene';
import CommonConfigScene from './scene/config/CommonConfigScene';
import FeedbackConfigScene from './scene/config/FeedbackConfigScene';
import AboutConfigScene from './scene/config/AboutConfigScene';
import CacheConfigScene from './scene/config/CacheConfigScene';
import ShieldConfigScene from './scene/config/ShieldConfigScene';
import CheckPhoneScene from './scene/config/CheckPhoneScene';
import ResetPhoneScene from './scene/config/ResetPhoneScene';
import ResetPassScene from './scene/config/ResetPassScene';
//mine
import MsgScene from './scene/mine/MsgScene';
import MsgDetailScene from './scene/mine/MsgDetailScene';
import ProfileScene from './scene/mine/ProfileScene';
import MyFollowScene from './scene/mine/MyFollowScene';
import MyTrendScene from './scene/mine/MyTrendScene';
import MyPlanScene from './scene/mine/MyPlanScene';
import MyCourseScene from './scene/mine/MyCourseScene';
import MyDeviceScene from './scene/mine/MyDeviceScene';
import DeviceInfoScene from './scene/mine/DeviceInfoScene';
import HelpCenterScene from './scene/mine/HelpCenterScene';
import HelpDetailScene from './scene/mine/HelpDetailScene';
import FeedbackScene from './scene/mine/FeedbackScene';
import SearchPageScene from './scene/mine/SearchPageScene';
//report
import SportReportScene from './scene/report/SportReportScene';
import HealthReportScene from './scene/report/HealthReportScene';
import SportWeekScene from './scene/report/SportWeekScene';
import BodyPhotoScene from './scene/report/BodyPhotoScene';
import BodyReportScene from './scene/report/BodyReportScene';

TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {defaultProps: false});
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});

setJSExceptionHandler((error, isFatal) => {
    if (error && error.message) {
        HttpUtil.post(api.feedback, {text: error.message, ver: global.deviceInfo.version});
    }
}, true);

const Tab = createBottomTabNavigator(
    {
        // index: {
        //     screen: IndexScene,
        //     navigationOptions: ({navigator}) => ({
        //         title: '首页',
        //         tabBarLabel: '首页',
        //         tabBarIcon: ({focused, tintColor}) => (
        //             <Image source={focused ? ImageResources.tab_index_on : ImageResources.tab_index} resizeMode={'stretch'} style={styles.icon} />
        //             // <Icon name={focused ? 'home' : 'home-outline'} size={26} style={{color: tintColor}} />
        //         ),
        //     }),
        // },
        // course: {
        //     screen: SportModeScene,
        //     navigationOptions: ({navigator}) => ({
        //         title: '教程',
        //         tabBarLabel: '教程',
        //         tabBarIcon: ({focused, tintColor}) => (
        //             <Image source={focused ? ImageResources.tab_course_on : ImageResources.tab_course} resizeMode={'stretch'} style={styles.icon} />
        //             // <Icon name={focused ? 'animation' : 'animation-outline'} size={26} style={{color: tintColor}} />
        //         ),
        //     }),
        // },
        plan: {
            screen: PlanScene,
            navigationOptions: ({navigator}) => ({
                title: '计划',
                tabBarLabel: '计划',
                tabBarIcon: ({focused, tintColor}) => (
                    <Image source={focused ? ImageResources.tab_plan_on : ImageResources.tab_plan} resizeMode={'stretch'} style={styles.icon} />
                    // <Icon name={focused ? 'calendar' : 'calendar-outline'} size={26} style={{color: tintColor}} />
                ),
            }),
        },
        mine: {
            screen: MineScene,
            navigationOptions: ({navigator}) => ({
                title: '我的',
                tabBarLabel: '我的',
                tabBarIcon: ({focused, tintColor}) => (
                    <Image source={focused ? ImageResources.tab_mine_on : ImageResources.tab_mine} resizeMode={'stretch'} style={styles.icon} />
                    // <Icon name={focused ? 'account' : 'account-outline'} size={26} style={{color: tintColor}} />
                ),
            }),
        },
        // test: {
        //     screen: TestScene,
        //     navigationOptions: ({navigator}) => ({
        //         title: '测试',
        //         tabBarLabel: '测试',
        //         tabBarIcon: ({focused, tintColor}) => (
        //             <Icon name={focused ? 'home' : 'home-outline'} size={26} style={{color: tintColor}} />
        //         ),
        //     }),
        // },
        // testUnity: {
        //     screen: TestUnityScene,
        //     navigationOptions: ({navigator}) => ({
        //         title: '测试',
        //         tabBarLabel: '测试',
        //         tabBarIcon: ({focused, tintColor}) => (
        //             <Icon name={focused ? 'home' : 'home-outline'} size={26} style={{color: tintColor}} />
        //         ),
        //     }),
        // },
    },
    {
        initialRouteName: 'plan',
        tabBarComponent: BottomTabBar,
        tabBarPosition: 'bottom',
        lazy: true,
        animationEnabled: false,
        swipeEnabled: false,
        tabBarOptions: {
            activeTintColor: color.primary,
            inactiveTintColor: color.gray,
            style: {backgroundColor: color.white, paddingTop: 5, width: ScreenUtil.screenW},
            labelStyle: {marginBottom: 5, fontSize: 10},
            labelPosition: 'horizontal',
            allowFontScaling: false,
        },
        showIcon: true,
    },
);

const Navigator = createStackNavigator(
    {
        Tab: {
            screen: Tab,
            navigationOptions: ({navigation}) => ({
                headerTintColor: color.black,
                headerStyle: {
                    backgroundColor: color.white,
                    elevation: 0,
                },
                headerLeft: () => {return undefined;},
                // header: () => <HeaderBar />,
                headerShown: false,
            }),
        },
        Branch: {screen: BranchScene},
        Guide: {screen: GuideScene},
        //auth
        Login: {screen: LoginScene},
        Reg: {screen: RegScene},
        Phone: {screen: PhoneScene},
        Code: {screen: CodeScene},
        Forget: {screen: ForgetScene},
        UpdatePass: {screen: UpdatePassScene},
        SetPass: {screen: SetPassScene},
        SetBasic: {screen: SetBasicScene},
        SetSex: {screen: SetSexScene},
        SetBirth: {screen: SetBirthScene},
        SetHeight: {screen: SetHeightScene},
        SetWeight: {screen: SetWeightScene},
        SetBMI: {screen: SetBMIScene},
        Agreement: {screen: AgreementScene},
        Privacy: {screen: PrivacyScene},
        //index
        Trend: {screen: TrendScene, navigationOptions: {headerTitle: () => <Heading>动态详情</Heading>}},
        CommentDetail: {screen: CommentDetailScene, navigationOptions: {headerTitle: () => {}}},
        TrendSubmit: {screen: TrendSubmitScene, navigationOptions: {headerTitle: () => {}}},
        //common
        Album: {screen: AlbumScene, navigationOptions: {headerTitle: () => {}}},
        Camera: {screen: CameraScene, navigationOptions: {headerTitle: () => {}}},
        UserInfo: {screen: UserInfoScene, navigationOptions: {headerTitle: () => {}}},
        VipUserInfo: {screen: VipUserInfoScene, navigationOptions: {headerTitle: () => {}}},
        //sport
        BleConnect: {screen: BleConnectScene, navigationOptions: {headerTitle: () => {}}},
        SportMode: {screen: SportModeScene, navigationOptions: {}},
        Panel: {screen: PanelScene, navigationOptions: {}},
        Panel2: {screen: Panel2Scene, navigationOptions: {}},
        PanelRope: {screen: PanelRopeScene, navigationOptions: {}},
        Game: {screen: GameScene, navigationOptions: {headerTitle: () => {}}},
        //plan
        SetPlan1: {screen: SetPlan1Scene, navigationOptions: {}},
        SetPlan2: {screen: SetPlan2Scene, navigationOptions: {}},
        SetPlan3: {screen: SetPlan3Scene, navigationOptions: {}},
        SetPlan4: {screen: SetPlan4Scene, navigationOptions: {}},
        SetPlan5: {screen: SetPlan5Scene, navigationOptions: {}},
        SetPlan6: {screen: SetPlan6Scene, navigationOptions: {}},
        PlanDetail: {screen: PlanDetailScene, navigationOptions: {}},
        PlanTemplate: {screen: PlanTemplateScene, navigationOptions: {}},
        //config
        Config: {screen: ConfigScene, navigationOptions: {headerTitle: () => <Heading>设置</Heading>}},
        AccountConfig: {screen: AccountConfigScene, navigationOptions: {}},
        AuthConfig: {screen: AuthConfigScene, navigationOptions: {}},
        NoticeConfig: {screen: NoticeConfigScene, navigationOptions: {}},
        PrivacyConfig: {screen: PrivacyConfigScene, navigationOptions: {}},
        CommonConfig: {screen: CommonConfigScene, navigationOptions: {}},
        FeedbackConfig: {screen: FeedbackConfigScene, navigationOptions: {}},
        AboutConfig: {screen: AboutConfigScene, navigationOptions: {}},
        CacheConfig: {screen: CacheConfigScene, navigationOptions: {}},
        ShieldConfig: {screen: ShieldConfigScene, navigationOptions: {}},
        CheckPhone: {screen: CheckPhoneScene, navigationOptions: {}},
        ResetPhone: {screen: ResetPhoneScene, navigationOptions: {}},
        ResetPass: {screen: ResetPassScene, navigationOptions: {}},
        //mine
        Msg: {screen: MsgScene, navigationOptions: {}},
        MsgDetail: {screen: MsgDetailScene, navigationOptions: {}},
        Profile: {screen: ProfileScene, navigationOptions: {}},
        MyFollow: {screen: MyFollowScene, navigationOptions: {}},
        MyTrend: {screen: MyTrendScene, navigationOptions: {}},
        MyPlan: {screen: MyPlanScene, navigationOptions: {}},
        MyCourse: {screen: MyCourseScene, navigationOptions: {}},
        MyDevice: {screen: MyDeviceScene, navigationOptions: {}},
        DeviceInfo: {screen: DeviceInfoScene, navigationOptions: {}},
        HelpCenter: {screen: HelpCenterScene, navigationOptions: {}},
        HelpDetail: {screen: HelpDetailScene, navigationOptions: {}},
        Feedback: {screen: FeedbackScene, navigationOptions: {}},
        SearchPage: {screen: SearchPageScene, navigationOptions: {}},
        //report
        SportReport: {screen: SportReportScene, navigationOptions: {}},
        HealthReport: {screen: HealthReportScene, navigationOptions: {}},
        SportWeek: {screen: SportWeekScene, navigationOptions: {}},
        BodyPhoto: {screen: BodyPhotoScene, navigationOptions: {}},
        BodyReport: {screen: BodyReportScene, navigationOptions: {}},
    },
    {
        initialRouteName: 'Branch',
        headerMode: 'float',
        defaultNavigationOptions: ({navigation}) => ({
            headerBackTitle: null,
            headerTintColor: color.black,
            headerLeft: () => <BackBtn onPress={() => navigation.goBack()} />,
            headerTitleAllowFontScaling: false,
            headerStyle: {borderBottomColor: color.paper, elevation: 0, backgroundColor: color.white},
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            // ...TransitionPresets.SlideFromRightIOS,
        }),
    },
);

const AppContainer = createAppContainer(Navigator);

export default class Route extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            msg: null,
            duration: null,
            type: null,
            callback: null,
            content: null,
            data: null,
            onHide: null,
            animationIn: 'slideInUp',
            animationOut: 'slideOutDown',
            bleState: 'disable',
            bleBtn: false,
            firstTime: 0, //记录点击Android物理返回按键时间
            prevNav: null, //记录navigation发生变化之前的页面路由状态
            nav: null, //记录navigation发生变化之后的页面路由状态
            action: null, //记录发生的操作
            routeName: null, //记录当前路由名
        };
        this.navigator = null;
    }

    componentDidMount() {
        let that = this;
        global.toastShow = (msg, cb = null, duration = 1000) => {
            that.setState({
                visible: true,
                msg: msg,
                duration: duration,
                type: 'text',
                callback: cb,
                animationIn: 'fadeIn',
                animationOut: 'fadeOut',
            })
        };
        global.toastLoading = (msg = '加载中。。。') => {
            that.setState({
                visible: true,
                msg: msg,
                type: 'loading',
                animationIn: 'fadeIn',
                animationOut: 'fadeOut',
            })
        };
        global.toastHide = (cb = null) => {
            return new Promise(function (resolve, reject) {
                that.setState({
                    visible: false,
                    // msg: null,
                    duration: null,
                    // type: null,
                    // content: null,
                    // data: null,
                    onHide: cb,
                });
                resolve('success');
            })
        };
        global.toastNode = (content, showClose) => {
            that.setState({
                visible: true,
                content: content,
                type: 'content',
                showClose: showClose,
                animationIn: 'fadeIn',
                animationOut: 'fadeOut',
            })
        };
        global.toastAction = (content) => {
            that.setState({
                visible: true,
                content: content,
                type: 'action',
                animationIn: 'slideInUp',
                animationOut: 'slideOutDown',
            })
        };
        global.toastActionSheet = (content) => {
            that.setState({
                visible: true,
                content: content,
                type: 'actionSheet',
                animationIn: 'slideInUp',
                animationOut: 'slideOutDown',
            })
        };
        global.toastDrawer = (content) => {
            that.setState({
                visible: true,
                content: content,
                type: 'drawer',
                animationIn: 'slideInLeft',
                animationOut: 'slideOutRight',
            })
        };
        global.toastAlert = (title, content, okText, cancelText, cb = null) => {
            cancelText = cancelText === null ? '' : '取消';
            that.setState({
                visible: true,
                data: {
                    title: title,
                    content: content,
                    cancelText: cancelText,
                    okText: okText || '确认',
                },
                type: 'alert',
                callback: cb,
                animationIn: 'fadeIn',
                animationOut: 'fadeOut',
            })
        };
        global.toastImage = (content) => {
            that.setState({
                visible: true,
                content: content,
                type: 'image',
                animationIn: 'slideInRight',
                animationOut: 'fadeOut',
            });
        };
        global.toastPage = (content) => {
            that.setState({
                visible: true,
                content: content,
                type: 'page',
                animationIn: 'fadeIn',
                animationOut: 'fadeOut',
            });
        };
        global.isToast = () => {
            return this.state.visible;
        };
        global.changeBLEState = (state) => {
            if (['disable', 'visible', 'found', 'searching', 'connected'].indexOf(state) == - 1) return;
            that.setState({
                bleState: state,
            });
        };
        global.showBleBtn = () => {
            if (!this.state.bleBtn) that.setState({bleBtn: true});
        };
        global.hideBleBtn = () => {
            if (this.state.bleBtn) that.setState({bleBtn: false});
        };
        global.checkBleState = () => {
            return this.state.bleState;
        };
        global.uploadSportData = () => {
            return new Promise((resolve, reject) => {
                let timestamp = BaseUtil.getTimeStamp();
                console.log('上传运动数据', global.config.sport_start_time, timestamp, global.config.sport_data, global.config.deviceObj.deviceInfo);
                if (global.config.sport_start_time > timestamp - 5) {
                    resolve(true);
                    return;
                }
                if (!global.config.sport_data.total || global.config.sport_start_time == 0) {
                    resolve(true);
                    return;
                }
                let obj = global.config.deviceObj;
                if (!obj.connect) {
                    resolve(true);
                    return;
                }
                let params = {};
                params.stype = obj.stype;
                params.total = global.config.sport_data.total;
                params.duration = timestamp - global.config.sport_start_time;
                params.end = 1;
                console.log('上传运动数据', params);
                HttpUtil.post(api.uploadUserSportsData, params).then((json) => {
                    if (!json) return;
                    if (json && json.code == 0) {

                    }
                }).finally(() => {
                    global.config.sport_data = {};
                    global.config.sport_start_time = 0;
                    resolve(true);
                });
            });
        };
        if (global.platform.isAndroid) {
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setBarStyle('dark-content');
            StatusBar.setTranslucent(true);
        }
        // this.initStorage();
        FileUtil.initDir();
        SoundUtil.init();
    }

    clickSportBtn = () => {
        switch (this.state.bleState) {
            case 'disable':
                BLEUtil.openBLE();
                break;
            case 'visible':
                BLEUtil.startBLEDevicesDiscovery();
                break;
            case 'searching':
                break;
            case 'found':
                BLEUtil.startBLEDevicesDiscovery();
                break;
            case 'connected':
                this.goToSportMode();
                break;
        }
    }

    goToSportMode = () => {
        let that = this;
        let obj = global.config.deviceObj;
        if (!obj.connect) {
            global.toastShow('设备未连接，请尝试重新连接');
            that.setState({bleState: 'visible'});
            return;
        }
        BLEUtil.checkBLEDeviceConnect(obj.deviceInfo.id, obj.deviceInfo.serviceUUIDs).then((res) => {
            if (res) {
                that.navigator && that.navigator.dispatch(NavigationActions.navigate({routeName: 'SportMode'}));
            } else {
                global.toastShow('设备未连接，请尝试重新连接');
                that.setState({bleState: 'visible'});
            }
        });
    }

    initStorage = () => {
        StorageUtil.get('area', (json) => {
            if (!json) {
                let data = this._createAreaData();
                if (data) StorageUtil.set('area', data);
            }
        })
    }

    _createAreaData = () => {
        let data = [];
        for (let i = 0; i < Area.length; i++) {
            let province = Area[i]['name'];
            let cityData = Area[i]['city'];
            let city = [];
            for (let j = 0; j < cityData.length; j++) {
                city.push({[cityData[j]['name']]: cityData[j]['area']});
            }
            data.push({[province]: city});
        }
        return data;
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        AppState.addEventListener('change', this._handleAppStateChange);
        NetInfo.configure({reachabilityUrl: 'http://www.baidu.com'});
        NetInfo.addEventListener(this._handleFirstConnectivityChange);
        AdManager.setRequestConfiguration({
            // testDeviceIds: [global.deviceInfo.uniqueId],
            maxAdContentRating: 'MA',
            tagForChildDirectedTreatment: AdManager.TAG_FOR_CHILD_DIRECTED_TREATMENT.FALSE,
            tagForUnderAgeConsent: AdManager.TAG_FOR_UNDER_AGE_CONSENT.FALSE,
        });
        BLEUtil.onBLEStateChange(this._handleBleStateChange);
        BLEUtil.onBLEDeviceFound(this._handleBleDeviceFound);
        BLEUtil.onStopBLEScan(this._handleBleStopScan);
        BLEUtil.onBLEDisconnect(this._handleBleDisconnect);
        BLEUtil.openBLE();
        HttpUtil.clearAllCache();
        FileUtil.clearCache();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        AppState.removeEventListener('change', this._handleAppStateChange);
        BLEUtil.cancelAllBLEEvent();
        BLEUtil.stopBLEDevicesDiscovery();
        SoundUtil.release();
    }

    _handleBleStateChange = (res) => {
        if (res.state == 'on') {
            this.setState({bleState: 'visible'});
            if (global.config.indexReady) BLEUtil.startBLEDevicesDiscovery();
        } else if (res.state == 'off') {
            this.setState({bleState: 'disable'});
            global.toastShow('手机蓝牙未打开');
        }
    }

    _handleBleDeviceFound = (device) => {
        if (this.state.bleState == 'found') return;
        if (!device || !device.data) return;
        this.setState({bleState: 'found'});
        BLEUtil.stopBLEDevicesDiscovery();
        global.toastActionSheet(<BleDeviceNode device={device} navigation={this.navigator} />);
    }

    _handleBleStopScan = () => {
        if (this.state.bleState == 'visible' || this.state.bleState == 'searching') {
            BLEUtil.startBLEDevicesDiscovery();
        }
    }

    _handleBleDisconnect = (res) => {
        if (this.state.bleState != 'connected') return;
        global.uploadSportData();
        global.config.deviceObj = {};
        DeviceEventEmitter.emit('bleDisconnectCallback');
        this.setState({bleState: 'visible'});
    }

    //处理网络状态
    _handleFirstConnectivityChange = (state: NetInfoState) => {
        if (!state.isConnected) {
            global.toastShow('网络不可用！请检查网络状态！');
        } else {

        }
    }

    //处理app前后台切换
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            let routeName = this.state.routeName;
            if (routeName && routeName != 'Game') {
                UnityModule.isReady().then((bool) => {
                    if (bool) {
                        UnityModule.postMessage('Globle', 'SetScreen', '1');
                    }
                });
            } else {
                UnityModule.isReady().then((bool) => {
                    if (bool) {
                        UnityModule.postMessage('Globle', 'SetScreen', '0');
                    }
                });
            }
            DeviceEventEmitter.emit('appStateChange', 'active');
        } else {
            DeviceEventEmitter.emit('appStateChange', 'inactive');
        }
    }

    onBackButtonPressAndroid = () => {
        //进入引导页 or 进入登陆页 or 进入Portal页 or 退回登陆页 or 退回Portal页
        if (this.state.routeName == 'Guide' || this.state.routeName == 'Tab' ||
            this.state.nav.index == 0) {
            if (this.state.firstTime + 2 * 1000 < Date.now()) {
                this.state.firstTime = Date.now();
                Toast.show('再按一次退出应用', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER,
                });
                return true;
            } else {
                BackHandler.exitApp();
            }
        }
        return false;
    }

    onNavigationStateChange = (prevNav, nav, action) => {
        console.log(action.routeName);
        let route = nav.routes[nav.index];
        let routeName = action.routeName;
        if (route && route.routeName) routeName = route.routeName;
        if (route.index == 1 || ['Login', 'Code', 'SetPass', 'Panel', 'Panel2', 'PanelRope', 'SportReport', 'SportWeek', 'Album', 'Camera', 'BodyReport'].indexOf(routeName) != -1) StatusBar.setBarStyle('light-content');
        else StatusBar.setBarStyle('dark-content');
        if (['SportMode'].indexOf(routeName) != -1 || (nav.index == 0 && nav.routes[0].routeName == 'Tab')) global.showBleBtn();
        else global.hideBleBtn();
        this.state.prevNav = prevNav;
        this.state.nav = nav;
        this.state.action = action;
        this.state.routeName = routeName;
    }

    render() {
        let bleBtn = this.state.bleBtn && <BleBtnCell onPress={this.clickSportBtn} type={this.state.bleState} />;
        return (
            <RootSiblingParent style={commonStyle.fillView}>
                <AppContainer onNavigationStateChange={this.onNavigationStateChange} ref={nav => {this.navigator = nav}} />
                {bleBtn}
                <ToastModal visible={this.state.visible} msg={this.state.msg} duration={this.state.duration} type={this.state.type} callback={this.state.callback} content={this.state.content} data={this.state.data} animationIn={this.state.animationIn} animationOut={this.state.animationOut} showClose={this.state.showClose} onHide={this.state.onHide} />
            </RootSiblingParent>
        )
    }
}

const styles = StyleSheet.create({
    avatar: {
        width: 30,
        height: 30,
        marginLeft: 15,
    },
    icon: {
        width: 20,
        height: 20,
    }
});
