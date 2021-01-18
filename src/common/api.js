'use strict';

// export const ROOTURL = 'http://192.168.1.5:8888/';
export const ROOTURL = 'https://ble.jltech.org.cn/';
// export const WEBURL = 'http://192.168.1.5:8900/';
export const WEBURL = 'http://www.jltech.org.cn/';
export const APIURL = ROOTURL + 'api/';
export const CDNSERVER = ROOTURL + 'client/';

export default {
    cdn: CDNSERVER,
    web: WEBURL,

    //auth
    auth: APIURL + 'auth',
    passLogin: APIURL + 'passLogin',
    fastLogin: APIURL + 'fastLogin',
    thirdAuth: APIURL + 'thirdAuth',
    thirdLogin: APIURL + 'thirdLogin',
    sendCode: APIURL + 'sendCode',
    setPassword: APIURL + 'setPassword',
    logout: APIURL + 'logout',
    VersionUrl: APIURL + 'version_control',
    feedback: APIURL + 'feedback',

    getQuestions: APIURL + 'getQuestions',
    getInitData: APIURL + 'getInitData',

    //user
    uploadAvatar: APIURL + 'uploadAvatar',
    profile: APIURL + 'profile',
    checkPhone: APIURL + 'checkPhone',
    updatePhone: APIURL + 'updatePhone',
    updatePass: APIURL + 'updatePass',
    bindThirdPlatform: APIURL + 'bindThirdPlatform',
    unbindThirdPlatform: APIURL + 'unbindThirdPlatform',

    //trend
    getTrends: APIURL + 'getTrends',
    getUserTrends: APIURL + 'getUserTrends',
    sendTrend: APIURL + 'sendTrend',
    deleteTrend: APIURL + 'deleteTrend',
    getTrendComments: APIURL + 'getTrendComments',
    getTrendThumbs: APIURL + 'getTrendThumbs',
    sendTrendComment: APIURL + 'sendTrendComment',
    sendTrendCommentReply: APIURL + 'sendTrendCommentReply',
    toggleThumbTrend: APIURL + 'toggleThumbTrend',
    toggleThumbTrendComment: APIURL + 'toggleThumbTrendComment',
    toggleThumbTrendCommentReply: APIURL + 'toggleThumbTrendCommentReply',
    reportTrend: APIURL + 'reportTrend',

    //user
    switchFollow: APIURL + 'switchFollow',
    getUserFollows: APIURL + 'getUserFollows',
    getUserFans: APIURL + 'getUserFans',
    getUserBodyPhoto: APIURL + 'getUserBodyPhoto',
    getUserBodyPhotoDetail: APIURL + 'getUserBodyPhotoDetail',
    uploadBodyPhoto: APIURL + 'uploadBodyPhoto',
    getUserBodyReport: APIURL + 'getUserBodyReport',
    addUserBodyRecord: APIURL + 'addUserBodyRecord',
    getUserInfo: APIURL + 'getUserInfo',
    switchShield: APIURL + 'switchShield',
    getUserShields: APIURL + 'getUserShields',

    //sport
    getSportTotal: APIURL + 'getSportTotal',
    getSportWeekly: APIURL + 'getSportWeekly',
    getHistoryList: APIURL + 'getHistoryList',
    checkBleDevice: APIURL + 'checkBleDevice',
    uploadUserSportsData: APIURL + 'uploadUserSportsData',

    //plan
    getMyPlan: APIURL + 'getMyPlan',
    getPlanList: APIURL + 'getPlanList',
    addPlan: APIURL + 'addPlan',
    startPlan: APIURL + 'startPlan',
    finishPlan: APIURL + 'finishPlan',
    getPlanDetails: APIURL + 'getPlanDetails',
    uploadPlanPhoto: APIURL + 'uploadPlanPhoto',
    getUserPlans: APIURL + 'getUserPlans',
};
