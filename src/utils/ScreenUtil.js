/**
 * Created by yujiajie on 2019/1/23.
 */
import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';
import AndroidDimensions from 'react-native-extra-dimensions-android';

const screenW = Dimensions.get('window').width;
const screenH = global.platform.isIOS ? Dimensions.get('window').height : AndroidDimensions.get('REAL_WINDOW_HEIGHT');
const fontScale = PixelRatio.getFontScale();
const pixelRatio = PixelRatio.get();
//像素密度
const DEFAULT_DENSITY = 2;
//px转换成dp
//以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的750和1334为对应尺寸即可.
const w2 = 750 / DEFAULT_DENSITY;
//px转换成dp
const h2 = 1334 / DEFAULT_DENSITY;

// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
const isIphoneX = global.platform.isIOS &&
    ((screenH >= X_HEIGHT && screenW >= X_WIDTH) ||
        (screenH >= X_WIDTH && screenW >= X_HEIGHT));

//status bar height
const STATUS_BAR_HEIGHT = isIphoneX ? 44 : (global.platform.isIOS ? 20 : StatusBar.currentHeight);

const SAFE_BOTTOM_HEIGHT = isIphoneX ? 34 : 0;

export default class ScreenUtil {
    static screenW = screenW;
    static screenH = screenH;
    static pixelRatio = pixelRatio;
    static onePixel = 1 / pixelRatio;
    static DEFAULT_DENSITY = DEFAULT_DENSITY;
    static STATUS_BAR_HEIGHT = STATUS_BAR_HEIGHT;
    static HEADER_BAR_HEIGHT = global.platform.isIOS ? STATUS_BAR_HEIGHT + global.config.headerHeight : 56;
    static HEADER_HEIGHT = STATUS_BAR_HEIGHT + global.config.headerHeight;
    static SAFE_BOTTOM_HEIGHT = SAFE_BOTTOM_HEIGHT;
    static ANDROID_BOTTOM_HEIGHT = AndroidDimensions.getSoftMenuBarHeight();

    /**
     * 设置字体的size（单位px）
     * @param size 传入设计稿上的px
     * @returns {Number} 返回实际sp
     */
    static setSpText(size: Number) {
        let scaleWidth = screenW / w2;
        let scaleHeight = screenH / h2;
        let scale = Math.min(scaleWidth, scaleHeight);
        size = Math.round((size * scale + 0.5));
        return size / DEFAULT_DENSITY;
    }

    /**
     * 屏幕适配,缩放size
     * @param size
     * @returns {Number}
     */
    static scaleSize(size: Number) {
        let scaleWidth = screenW / w2;
        let scaleHeight = screenH / h2;
        let scale = Math.min(scaleWidth, scaleHeight);
        size = Math.round((size * scale + 0.5));
        return size / DEFAULT_DENSITY;
    }

    /**
     * 判断是否为iphoneX
     * @returns {boolean}
     */
    static isIphoneX() {
        return (
            Platform.OS === 'ios' &&
            ((screenH >= X_HEIGHT && screenW >= X_WIDTH) ||
            (screenH >= X_WIDTH && screenW >= X_HEIGHT))
        )
    }

    /**
     * 根据是否是iPhoneX返回不同的样式
     * @param iphoneXStyle
     * @param iosStyle
     * @param androidStyle
     * @returns {*}
     */
    static ifIphoneX(iphoneXStyle, iosStyle = {}, androidStyle) {
        if (ScreenUtil.isIphoneX()) {
            return iphoneXStyle;
        } else if (Platform.OS === 'ios') {
            return iosStyle
        } else {
            if (androidStyle) return androidStyle;
            return iosStyle
        }
    }

    static getIphoneXBottom(height = 0) {
        return ScreenUtil.isIphoneX() ? ScreenUtil.SAFE_BOTTOM_HEIGHT : height;
    }

}