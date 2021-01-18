import api from '../common/api';
import HttpUtil from './HttpUtil';
import FileUtil from './FileUtil';

export default class InitUtil {
    static init = () => {
        HttpUtil.httpCache(api.getInitData, {}, -1).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                InitUtil.initDevices(json.data.devices);
                InitUtil.initSplash(json.data.splashList);
            }
        });
    }

    static initDevices = (list) => {
        for (let i in list) {
            if (list[i].pic.length > 0) FileUtil.saveRemotePic(list[i].pic);
        }
        global.config.devicePics = list;
    }

    static initSplash = (list) => {
        for (let i in list) {
            if (list[i].pic.length > 0) FileUtil.saveRemotePic(list[i].pic);
        }
        global.config.splashList = list;
    }
}