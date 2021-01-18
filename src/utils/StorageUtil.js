/**
 * Created by yujiajie on 2019/1/22.
 */
import AsyncStorage from '@react-native-community/async-storage';

export default class StorageUtil {
    /**
     * 获取
     * @param key
     * @returns {Promise<T>|*|Promise.<TResult>}
     */
    static get(key, callback) {
        AsyncStorage.getItem(key, (error, object) => {
            if (!error && typeof callback === 'function') callback(JSON.parse(object));
        })
    }


    /**
     * 保存
     * @param key
     * @param value
     * @returns {*}
     */
    static set(key, value, callback) {
        return AsyncStorage.setItem(key, JSON.stringify(value), callback);
    }


    /**
     * 更新
     * @param key
     * @param value
     * @returns {Promise<T>|Promise.<TResult>}
     */
    static update(key, value) {
        StorageUtil.set(key, value);
    }


    /**
     * 删除
     * @param key
     * @returns {*}
     */
    static remove(key) {
        return AsyncStorage.removeItem(key);
    }

    /**
     * 多个key删除
     * @param keys
     * @returns {*}
     */
    static multiRemove(keys) {
        return AsyncStorage.multiRemove(keys);
    }

    /**
     * 清除所有Storage
     */
    static clear() {
        AsyncStorage.clear();
    }
}
