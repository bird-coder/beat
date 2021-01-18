import CryptoUtil from './CryptoUtil';
import {round} from 'react-native-reanimated';

export default class BaseUtil {
    //时长转换
    static getTime = (time) => {
        if (time <= 0) return '0:00:00';
        let hour = parseInt(time / 3600);
        let minute = parseInt((time % 3600) / 60);
        if (minute < 10) minute = '0' + minute;
        let second = (time % 3600) % 60;
        if (second < 10) second = '0' + second;
        return hour + ':' + minute + ':' + second;
    };
    static getMTime = (time) => {
        if (time <= 0) return '00:00.00';
        let millisecond = ('00' + parseInt((time % 1000) / 10)).slice(-2);
        time = parseInt(time / 1000);
        let minute = parseInt((time % 3600) / 60);
        if (minute < 10) minute = '0' + minute;
        let second = (time % 3600) % 60;
        if (second < 10) second = '0' + second;
        return minute + ':' + second + '.' + millisecond;
    };
    //获取当前时间戳
    static getTimeStamp = () => {
        let timestamp = Date.parse(new Date());
        return timestamp / 1000;
    };
    //获取字符串字节长度
    static getStrBytes = (str) => {
        if (str == null || str === undefined) return 0;
        if (typeof str != 'string') {
            return 0;
        }
        let total = 0, charCode, i, len;
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;//字符代码在000000 – 00007F之间的，用一个字节编码
            } else if (charCode <= 0x07ff) {
                total += 2;//000080 – 0007FF之间的字符用两个字节
            } else if (charCode <= 0xffff) {
                total += 3;//000800 – 00D7FF 和 00E000 – 00FFFF之间的用三个字节，注: Unicode在范围 D800-DFFF 中不存在任何字符
            } else {
                total += 4;//010000 – 10FFFF之间的用4个字节
            }
        }
        return total;
    };
    //获取datepicker用当前日期
    static getPickerDate = () => {
        let date = new Date();
        return (date.getFullYear() - 20) + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    };
    //获取当前日期
    static getDate = () => {
        let date = new Date();
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    };
    //获取日期列表
    static getDays = (year, month, day = 0) => {
        let arr = [];
        let end = 30;
        switch (month) {
            case 1: end = 31; break;
            case 2: end = 28; break;
            case 3: end = 31; break;
            case 4: end = 30; break;
            case 5: end = 31; break;
            case 6: end = 30; break;
            case 7: end = 31; break;
            case 8: end = 31; break;
            case 9: end = 30; break;
            case 10: end = 31; break;
            case 11: end = 30; break;
            case 12: end = 31; break;
        }
        if (day > 0) end = day;
        if (year % 4 == 0 && month == 2) end = 29;
        for (let i = 1; i <= end; i++) {
            arr.push(i);
        }
        return arr;
    };
    //获取picker日期列表
    static getDatePickerList = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let start = 1970;
        let list = [];
        while (start < year) {
            let yearTmp = {};
            let arr = [];
            for (let i = 1; i <= 12; i++) {
                let tmp = {};
                tmp[i] = BaseUtil.getDays(start, i);
                arr.push(tmp);
            }
            yearTmp[start] = arr;
            list.push(yearTmp);
            start++;
        }
        let yearTmp = {};
        let arr = [];
        for (let j = 1; j < month; j++) {
            let tmp = {};
            tmp[j] = BaseUtil.getDays(year, j);
            arr.push(tmp);
        }
        let tmp = {};
        tmp[month] = BaseUtil.getDays(year, month, day);
        arr.push(tmp);
        yearTmp[year] = arr;
        list.push(yearTmp);
        return list;
    };
    //获取picker身高列表
    static getPickerHeight = () => {
        let start = 80, end = 250;
        let arr = [];
        while (start <= end) {
            arr.push(start);
            start++;
        }
        return arr;
    };
    //获取picker体重列表
    static getPickerWeight = () => {
        let start = 30, end = 150;
        let arr = [];
        while (start <= end) {
            arr.push(start);
            start++;
        }
        return arr;
    };
    //获取bmi范围
    static getBMIInfo = (bmi) => {
        if (parseInt(bmi) <= 0) return -1;
        if (bmi < 18.5) return 0;
        if (bmi >= 18.5 && bmi <= 24.9) return 1;
        if (bmi >= 25.0 && bmi <= 29.9) return 2;
        if (bmi >= 30.0 && bmi <= 34.9) return 3;
        if (bmi >= 35.0 && bmi <= 39.9) return 4;
        if (bmi >= 40.0) return 5;
    };
    //获取性别
    static getSex = (type = 0) => {
        return type == 0 ? '男' : '女';
    };
    //获取周一时间戳
    static getMonday = (datetime = null) => {
        let date = new Date();
        if (datetime) date = new Date(datetime);
        let day = date.getDay() || 7;
        date.setDate(date.getDate() + 1 - day);
        return date;
    };
    static isMonday = (monday) => {
        return (new Date(monday)).getDay() == 1;
    };
    //16位大小端转换
    static reverseByte16 = (value) => {
        return parseInt(('0000' + ((value << 8) | (value >> 8)).toString(16)).slice(-4), 16);
    };
    //32位大小端转换
    static reverseByte32 = (value) => {
        return (value & 0xff) << 24 | (value & 0xff00) << 8 | (value & 0xff0000) >> 8 | (value >> 24) & 0xff;
    };
    //64位大小端转换
    static reverseByte64 = (str) => {
        let leftStr = str.slice(0, -8);
        let rightStr = str.slice(-8);
        let low = BaseUtil.reverseByte32(parseInt(leftStr, 16)).toString(16);
        let high = BaseUtil.reverseByte32(parseInt(rightStr, 16)).toString(16);
        return high + low;
    };
    //大小端转换（字符串方法）
    static reverseByte = (str: string): string => {
        let keys = [];
        let length = str.length;
        for (let i = 0; i < length; i += 2) {
            keys.unshift(str.slice(i, i + 2));
        }
        return keys.join('');
    }
    //arraybuffer转16进制
    static ab2hex = (buffer: ArrayBuffer): string => {
        let hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2);
            }
        );
        return hexArr.join('');
    };
    //16进制转arraybuffer
    static hex2ab = (str: string): Array => {
        // let typedArray = new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (hex) {
        //     return parseInt(hex, 16);
        // }));
        // return typedArray.buffer;
        return str.match(/[\da-f]{2}/gi).map(function (hex) {
            return parseInt(hex, 16);
        });
    }
    //根据key值判断是否在数组中
    static keyInArray = (arr, key, val) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] == val) {
                return i;
            }
        }
        return -1;
    };
    //大数相乘计算
    static multiply = (num1: string, num2: string, radix = 16): string => {
        let len1 = num1.length, len2 = num2.length;
        let ans = [];
        for (let i = len1 - 1; i >= 0; i--) {
            for (let j = len2 - 1; j >= 0; j--) {
                let index1 = i + j, index2 = i + j + 1;
                let mul = parseInt(num1[i], radix) * parseInt(num2[j], radix) + (parseInt(ans[index2], radix) || 0);
                ans[index1] = (Math.floor(mul / radix) + (parseInt(ans[index1], radix) || 0)).toString(radix);
                ans[index2] = (mul % radix).toString(radix);
            }
        }
        let result = ans.join('').replace('/^0+/', '');
        return !result ? '0' : result;
    }

    static bigReduceOne = (num: string): string => {
        let len = num.length;
        let last = num[len - 1];
        if (last == '0') {
            let tmp = (parseInt(num[len - 2], 16) - 1).toString(16);
            return num.slice(0, -2) + tmp + 'f';
        } else {
            let tmp = (parseInt(last, 16) - 1).toString(16);
            return num.slice(0, -1) + tmp;
        }
    }

    static bigAddOne = (num: string): string => {
        let len = num.length;
        let last = num[len - 1];
        if (last == 'f') {
            let tmp = (parseInt(num[len - 2], 16) + 1).toString(16);
            return num.slice(0, -2) + tmp + '0';
        } else {
            let tmp = (parseInt(last, 16) + 1).toString(16);
            return num.slice(0, -1) + tmp;
        }
    }

    //公钥转化
    static transPublicKey = (bytes): string => {
        let data = BaseUtil.ab2hex(bytes);
        let code = data.slice(0, 2);
        if (parseInt(code, 16) != 0x01) return false;
        let key = data.slice(2);
        let arr = global.config.mem_scream_public.split(' ');
        let result = '';
        for (let i = 0; i < 16; i += 2) {
            let str = key.slice(i, i + 2);
            let j = i / 2;
            let block = (parseInt(str, 16) ^ parseInt(arr[j], 16)).toString(16);
            result += block;
        }
        return BaseUtil.reverseByte(result);
    }

    //生成随机私钥
    static createRandomPrivateKey = (): string => {
        let str = '0123456789ABCDEF';
        let key = '';
        for (let i = 0; i < 8; i++) {
            let index = Math.floor(Math.random() * 16);
            key += str[index];
        }
        // return key;
        return '12345678';
    }

    //生成随机数
    static createNonceStr = (): string => {
        let str = '0123456789ABCDEF';
        let key = '';
        for (let i = 0; i < 8; i++) {
            let index = Math.floor(Math.random() * 16);
            key += str[index];
        }
        return key;
    }

    //生成配对公钥
    static createPublicKey = (key: string): string => {
        return BaseUtil.reverseByte(BaseUtil.bigAddOne(BaseUtil.multiply(key, key)));
    }

    //计算aes加密key
    static getBleSK = (privateKey: string, publicKey: string): string => {
        return BaseUtil.reverseByte(BaseUtil.multiply(BaseUtil.multiply(privateKey, privateKey), BaseUtil.bigReduceOne(publicKey)));
    }

    //加密数据
    static encryptData = (data, sk) => {
        let key = BaseUtil.createNonceStr();
        let sessionKey = CryptoUtil.encrypt(key, sk);
        let message = (parseInt(data, 16) ^ parseInt(sessionKey, 16)).toString(16);
        return BaseUtil.hex2ab(key + message);
    }

    //解密数据
    static decryptData = (bytes, sk): string => {
        let data = BaseUtil.ab2hex(bytes);
        let str = data.slice(0, 8) + '000000000000000000000000';
        let message = data.slice(8);
        let sessionKey = CryptoUtil.encrypt(str, sk);
        console.log(str, sk, sessionKey, message);
        let arr1 = BaseUtil.hex2ab(sessionKey);
        let arr2 = BaseUtil.hex2ab(message);
        let arr = [];
        let index = 0;
        let len = arr1.length;
        while (index < len) {
            let code = ('00' + (arr1[index] ^ arr2[index]).toString(16)).slice(-2);
            arr.push(code);
            index++;
        }
        return arr.join('');
        // return (parseInt(sessionKey, 16) ^ parseInt(message, 16)).toString(16);
    }

    //筛选蓝牙设备
    static filterBleDevice = (res) => {
        let device = {id: res.id, rssi: res.rssi};
        let data = res.advertising;
        if (!res.name) return false;
        if (!data.manufacturerData) return false;
        if (data.localName != global.config.ble_name) return false;
        if (data.serviceUUIDs[0] != global.config.ble_uuid) return false;
        console.log(res);
        let deviceData = BaseUtil.ab2hex(data.manufacturerData.bytes);
        let obj = BaseUtil.checkBroadcastData(deviceData);
        if (!obj) return false;
        if (global.config.bleScan) {
            global.config.bleScan = false;
            return false;
        }
        device.data = obj;
        device.serviceUUIDs = data.serviceUUIDs;
        device.name = global.config.deviceList[obj.stype];
        return device;
    };

    //校验广播数据
    static checkBroadcastData = (data) => {
        let obj = {};
        if (global.platform.isAndroid) data = data.slice(42, 74);
        if (data.length != 32) return null;
        obj.factoryId = BaseUtil.reverseByte(data.slice(0, 4));
        obj.deviceId = BaseUtil.reverseByte(data.slice(4, 8));
        obj.deviceType = data.slice(8, 10);
        obj.stype = parseInt(obj.deviceType, 16);
        obj.dealerId = data.slice(10, 12);
        obj.address = BaseUtil.reverseByte(data.slice(12, 20)); //结果取低4字节
        obj.sign = BaseUtil.reverseByte(data.slice(24, 32));
        let sign1 = parseInt(obj.factoryId, 16) + parseInt(obj.deviceId, 16) + (parseInt(obj.deviceType, 16) * parseInt(obj.dealerId, 16)) + parseInt(obj.address, 16);
        if (sign1 != parseInt(obj.sign, 16)) return null;
        return obj;
    }

    //蓝牙设备配对
    static pairBleDevice = (bytes): string => {
        let publicKey = BaseUtil.transPublicKey(bytes);
        let privateKey = BaseUtil.createRandomPrivateKey();
        let pKey = BaseUtil.createPublicKey(privateKey);
        let sk = BaseUtil.getBleSK(privateKey, publicKey);
        global.config.ble_sk = sk;
        console.log(bytes, publicKey, privateKey, pKey, sk);
        return BaseUtil.hex2ab('02' + pKey);
    }

    //处理蓝牙信号强度
    static getBleSignal = (rssi) => {
        let min = -80;
        let max = -30;
        let num = 0;
        if (rssi <= min) num = 0;
        else if (rssi >= max) num = 4;
        else {
            num = Math.round((rssi - min) / (max - min) * 4);
        }
        return num;
    }

    //解析运动数据
    static parseSportData = (data) => {
        let obj = {};
        if (data.length != 32) return null;
        if (data.slice(0, 2) != '01') return null;
        obj.total = parseInt(BaseUtil.reverseByte(data.slice(2, 6)), 16);
        obj.frequency = parseInt(data.slice(6, 8), 16) / 4;
        obj.heartRate = ('000' + Math.round(parseInt(data.slice(8, 10), 16))).slice(-3);
        obj.weight = parseInt(data.slice(10, 14), 16);
        obj.bmi = parseInt(data.slice(14, 18), 16);
        obj.rate = ('000' + Math.round(parseInt(data.slice(18, 20), 16) / 4)).slice(-3);
        console.log(obj);
        return obj;
    }

}
