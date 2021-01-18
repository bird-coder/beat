import {Linking, NativeModules} from 'react-native';

const SettingManager = global.platform.isAndroid ? NativeModules.SettingManager : null;

export default class SettingUtil {
    static openLocationSetting = () => {
        if (global.platform.isIOS) {
            Linking.openSettings();
        } else {
            SettingManager.openSettings();
        }
    }
}