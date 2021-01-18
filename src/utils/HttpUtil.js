import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

import StorageUtil from './StorageUtil';
import BaseUtil from './BaseUtil';

const header = {
    "Accept": "application/json",
    "Content-Type": "application/json",
};

const errResponse = {code: global.config.errno.net_err, message: '网络不可用'};

const handleUrl = (url, params) => {
    if (params && typeof (params) === 'object') {
        let paramsArray = [];
        Object.keys(params).forEach(key => paramsArray.push(key + '=' +encodeURIComponent(params[key])));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += '&' + paramsArray.join('&');
        }
    }
    return url;
};

const handleBody = (params) => {
    if (params && typeof params === 'object') {
        let formData = new FormData();
        Object.keys(params).forEach(key => formData.append(key, params[key]));
        return formData;
    }
    return null;
};

const handleFileBody = (params) => {
    if (params && typeof params === 'object') {
        let formData = new FormData();
        Object.keys(params).forEach(key => {
            if (typeof params[key] === 'array') {
                if (params[key].length > 0 && typeof params[key] === 'object') {
                    params[key].forEach(file => formData.append(key, file));
                } else {
                    formData.append(key, params[key]);
                }
            }
            else formData.append(key, params[key]);
        });
        return formData;
    }
    return null;
};

const cache_key = (url, params = {}) => {
    let arr = url.split('/');
    let key = arr[arr.length - 1];
    if (key != 'version_control' && key.indexOf('get') == -1) return null;
    let values = [];
    for (let i in params) {
        if (i != 'token') values.push(params[i]);
    }
    return key + '_' + values.join('_');
};

export default class HttpUtil {
    static HttpCacheKey = 'HttpCacheKey';
    static ReportCacheKey = 'ReportCacheKey';
    static BodyPhotoCacheKey = 'BodyPhotoCacheKey';
    static BodyCacheKey = 'BodyCacheKey';
    static PlanCacheKey = 'PlanCacheKey';

    static get = (url, params = {}) => {
        NetInfo.fetch().then((state: NetInfoState) => {
            if (!state.isInternetReachable) {
                return new Promise((resolve, reject) => {
                    resolve(errResponse);
                });
            }
        });
        if (!params.token) params.token = global.config.token;
        let controller = new window.AbortController();
        setTimeout(() => {
            controller.abort();
        }, 30000);
        return fetch(handleUrl(url, params), {
            method: 'GET',
            headers: header,
            signal: controller.signal,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('success-----------------', url, JSON.stringify(params), responseJson);
                return responseJson;
            }).catch((error) => {
                console.log('error---------------', url+'请求失败，参数：'+JSON.stringify(params), error);
                if (error.name === 'AbortError') {
                    console.log('error---------------', url+'请求超时');
                    if (global.isToast()) global.toastHide(() => {
                        global.toastShow('请求超时');
                    });
                    return;
                }
                if (global.isToast()) global.toastHide(() => {
                    global.toastShow('出错了。。。请稍后重试');
                });
            });
    };

    static post = (url, params = {}) => {
        NetInfo.fetch().then((state: NetInfoState) => {
            if (!state.isInternetReachable) {
                return new Promise((resolve, reject) => {
                    resolve(errResponse);
                });
            }
        });
        if (!params.token) params.token = global.config.token;
        let controller = new window.AbortController();
        setTimeout(() => {
            controller.abort();
        }, 30000);
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data', //适配android
            },
            body: handleBody(params),
            signal: controller.signal,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('success-----------------', url, JSON.stringify(params), responseJson);
                return responseJson;
            }).catch((error) => {
                console.log('error---------------', url+'请求失败，参数：'+JSON.stringify(params), error);
                if (error.name === 'AbortError') {
                    console.log('error---------------', url+'请求超时');
                    if (global.isToast()) global.toastHide(() => {
                        global.toastShow('请求超时');
                    });
                    return;
                }
                if (global.isToast()) global.toastHide(() => {
                    global.toastShow('出错了。。。请稍后重试');
                });
            });
    };

    static postJson = (url, params = {}) => {
        NetInfo.fetch().then((state: NetInfoState) => {
            if (!state.isInternetReachable) {
                return new Promise((resolve, reject) => {
                    resolve(errResponse);
                });
            }
        });
        if (!params.token) params.token = global.config.token;
        let controller = new window.AbortController();
        setTimeout(() => {
            controller.abort();
        }, 30000);
        return fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(params),
            signal: controller.signal,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('success-----------------', url, JSON.stringify(params), responseJson);
                return responseJson;
            }).catch((error) => {
                console.log('error---------------', url+'请求失败，参数：'+JSON.stringify(params), error);
                if (error.name === 'AbortError') {
                    console.log('error---------------', url+'请求超时');
                    if (global.isToast()) global.toastHide(() => {
                        global.toastShow('请求超时');
                    });
                    return;
                }
                if (global.isToast()) global.toastHide(() => {
                    global.toastShow('出错了。。。请稍后重试');
                });
            });
    };

    static postFile = (url, params = {}) => {
        NetInfo.fetch().then((state: NetInfoState) => {
            if (!state.isInternetReachable) {
                return new Promise((resolve, reject) => {
                    resolve(errResponse);
                });
            }
        });
        if (!params.token) params.token = global.config.token;
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: handleFileBody(params),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('success-----------------', url, JSON.stringify(params), responseJson);
                return responseJson;
            }).catch((error) => {
                console.log('error---------------', url+'请求失败，参数：'+JSON.stringify(params), error);
                if (global.isToast()) global.toastHide(() => {
                    global.toastShow('出错了。。。请稍后重试');
                });
            });
    };

    //http请求缓存，expire为过期时间 -1为永不过期
    static httpCache = (url, params = {}, expire = 60, cacheKey = HttpUtil.HttpCacheKey) => {
        NetInfo.fetch().then((state: NetInfoState) => {
            if (!state.isInternetReachable) {
                return new Promise((resolve, reject) => {
                    resolve(errResponse);
                });
            }
        });
        let key = cache_key(url, params);
        if (!key) return null;
        HttpUtil.setHttpKeys(key, cacheKey);
        let timestamp = BaseUtil.getTimeStamp();
        return new Promise((resolve, reject) => {
            StorageUtil.get(key, (json) => {
                if (json && json.data && (json.expire > timestamp || json.expire == -1)) {
                    resolve(json.data);
                } else {
                    HttpUtil.post(url, params).then((res) => {
                        if (res && res.code == 0) {
                            if (expire >= 0) StorageUtil.set(key, {data: res, expire: timestamp + expire});
                            else StorageUtil.set(key, {data: res, expire: -1});
                        } else {
                            StorageUtil.set(key, {data: res, expire: timestamp + 5});
                        }
                        resolve(res);
                    });
                }
            });
        });
    }

    static clearCache = (url, params = {}) => {
        let key = cache_key(url, params);
        if (!key) return null;
        StorageUtil.remove(key);
    }

    static setHttpKeys = (key, cacheKey = HttpUtil.HttpCacheKey) => {
        StorageUtil.get(cacheKey, (json) => {
            let obj = {};
            if (json && Object.values(json).length > 0) {
                obj = json;
                if (!obj[key]) obj[key] = 1;
            } else {
                obj[key] = 1;
            }
            StorageUtil.set(cacheKey, obj);
        });
    }

    static clearAllCache = (cacheKey = HttpUtil.HttpCacheKey) => {
        StorageUtil.get(cacheKey, (json) => {
            if (json) {
                let keys = Object.keys(json);
                if (keys.length > 0) StorageUtil.multiRemove(keys);
            }
        });
    }

    static getAllCacheSize = (cacheKey = HttpUtil.HttpCacheKey) => {
        return new Promise((resolve, reject) => {
            let total = 0;
            StorageUtil.get(cacheKey, (json) => {
                if (json && Object.keys(json).length > 0) {
                    let arr = [];
                    for (let i in json) {
                        let promise = HttpUtil.getCacheSize(i);
                        arr.push(promise);
                    }
                    Promise.all(arr).then((values) => {
                        for (let j in values) {
                            total += values[j];
                        }
                        resolve(total);
                    });
                } else {
                    resolve(total);
                }
            });
        });
    }

    static getCacheSize = (key) => {
        return new Promise((resolve, reject) => {
            StorageUtil.get(key, (json) => {
                if (json && json.hasOwnProperty('data') && json.hasOwnProperty('expire')) {
                    let str = JSON.stringify(json);
                    let total = BaseUtil.getStrBytes(str);
                    resolve(total);
                } else {
                    resolve(0);
                }
            });
        });
    }
}
