import {PERMISSIONS, check, request, checkNotifications, requestNotifications, checkMultiple, requestMultiple, RESULTS, openSettings} from 'react-native-permissions';

export default class PermissionUtil {
    static platformKey = global.platform.isIOS ? 'ios.permission.' : 'android.permission.';

    static requestPermission = (typeArr) => {
        let newTypes = [];
        typeArr.forEach(type => {newTypes.push(PermissionUtil.platformKey + type);});
        return new Promise((resolve, reject) => {
            PermissionUtil._checkMultiPermission(newTypes).then((results) => {
                let reqTypes = [];
                let success = [];
                newTypes.forEach(type => {
                    switch (results[type]) {
                        case 'blocked': break;
                        case 'denied': reqTypes.push(type); break;
                        case 'granted': success.push(type); break;
                        case 'unavailable': break;
                    }
                });
                if (success.length + reqTypes.length < newTypes.length) {
                    resolve(false);
                    return;
                }
                if (reqTypes.length > 0) {
                    PermissionUtil._requestMultiPermission(reqTypes).then((res) => {
                        if (res) resolve(true);
                        else resolve('disable');
                    });
                } else {
                    resolve(true);
                }
            });
        });
    }

    static requestNotice = (cb) => {
        checkNotifications().then(({status, settings}) => {
            console.log(settings);
            if (status == RESULTS.DENIED) {
                requestNotifications([]).then((res) => {
                    if (res.status == RESULTS.GRANTED) cb(true);
                    else cb(false);
                });
            }
            if (status == RESULTS.GRANTED) cb(true);
        });
    }

    static _requestOnePermission = (type) => {
        request(PermissionUtil.platformKey + type).then((result) => {
            if (result == RESULTS.GRANTED) return true;
            else return false;
        });
    }

    static _requestMultiPermission = (typeArr) => {
        return requestMultiple(typeArr).then((results) => {
            let fails = [];
            typeArr.forEach(type => {
                if (results[type] != RESULTS.GRANTED) {
                    fails.push(type);
                    if (results[type] == RESULTS.DENIED || results[type] == RESULTS.BLOCKED) {
                        return false;
                    }
                }
            });
            if (fails.length == 0) return true;
            return false;
        });
    }

    static _checkOnePermission = (type) => {
        return check(PermissionUtil.platformKey + type);
    }

    static _checkMultiPermission = (typeArr) => {
        return checkMultiple(typeArr);
    }

    static openSetting = () => {
        openSettings().catch(() => {
            console.warn('cannot open settings');
        });
    }
}
