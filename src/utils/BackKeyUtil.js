import {NativeModules} from 'react-native';

class IosBackKey {
    static setBackKeyDisabled = (disabled: Boolean) => {
        return null;
    }
}
const BackKeyManager = global.platform.isAndroid ? NativeModules.BackKeyManager : IosBackKey;

export default BackKeyManager;