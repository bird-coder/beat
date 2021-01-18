import {StyleSheet} from 'react-native';

import color from './color';
import ScreenUtil from '../utils/ScreenUtil';

const commonStyle = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bodyView: {
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: color.white,
    },
    setBody: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        alignItems: 'center',
        backgroundColor: color.white,
    },
    rowBtn: {
        borderRadius: 0,
        backgroundColor: color.white,
        height: 55,
        width: ScreenUtil.screenW,
    },
    rowBtnText: {
        color: color.warning,
        fontWeight: 'normal',
        fontSize: 15,
        lineHeight: 20,
    },
    headerRight: {
        fontSize: 16,
        paddingRight: 10,
        color: color.text,
    },
    authInput: {
        borderWidth: 0,
        color: color.white,
    },
    authBack: {
        color: color.white,
    },
    authInfoView: {
        paddingTop: 10,
        paddingBottom: 10,
        width: 183,
        alignItems: 'center',
        borderBottomWidth: ScreenUtil.onePixel,
        borderBottomColor: color.border,
    },
    authInfoText: {
        fontSize: 30,
        fontWeight: 'bold',
        lineHeight: 35,
    },
    bold: {
        fontWeight: 'bold',
    },
    info: {
        color: color.info,
    },
    white: {
        color: color.white,
    },
    primary: {
        color: color.primary,
    },
    setBtn: {
        width: 280,
    },
    borderLine: {
        width: '100%',
        height: ScreenUtil.onePixel,
        backgroundColor: color.border,
    },
    fillView: {
        flex: 1,
    },
    androidHeaderBar: {
        paddingTop: 0,
    },
    bottomRowBtn: {
        borderRadius: 0,
        position: 'absolute',
        bottom: 0,
        height: ScreenUtil.isIphoneX() ? 65 : 50,
        paddingBottom: ScreenUtil.isIphoneX() ? 15 : 0,
    },
});

export default commonStyle;
