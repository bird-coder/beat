export default class FilterUtil {
    //格式化手机号
    static formatPhoneMask = (phone) => {
        let phoneMask = phone;
        if (phone) {
            phone = phone + '';
            phoneMask = phone.substr(0, 3) + '****' + phone.substr(7, 4);
        }
        return phoneMask;
    };

    //格式化身份证
    static formatCardNoMask = (cardno) => {
        let CardNoMask = cardno;
        if (cardno) {
            cardno = cardno + '';
            CardNoMask = cardno.substr(0, 3) + '********' + cardno.slice(-4);
        }
        return CardNoMask;
    };

    //格式化时间
    static formatTimeMask = (time) => {
        let timestamp = Date.parse(new Date()) / 1000;
        let timeDiff = parseInt(timestamp - time);
        let TimeMask = '';
        if (timeDiff < 3 * 60) {
            TimeMask = '刚刚';
        } else if (timeDiff < 3600) {
            TimeMask = Math.floor(timeDiff / 60) + '分钟前';
        } else if (time < 3 * 3600) {
            TimeMask = Math.floor(timeDiff/ 3600) + '小时前';
        } else if (timeDiff < 24 * 3600) {
            TimeMask = '1天内';
        } else if (timeDiff < 10*24*3600) {
            TimeMask = Math.floor(timeDiff / (24 * 3600)) + '天前';
        } else {
            let newDate = new Date();
            newDate.setTime(time * 1000);
            TimeMask = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
        }
        return TimeMask;
    };

    //格式化时长
    static formatTimeLongMask = (time) => {
        let hours = parseInt(time / 3600);
        let minutes = parseInt((time % 3600) / 60);
        let seconds = (time % 3600) % 60;
        seconds = seconds >= 10 ? '' + seconds : '0' + seconds;
        minutes = minutes >= 10 ? '' + minutes : '0' + minutes;
        let TimeLongMask = '';
        if (hours == 0) {
            TimeLongMask = minutes + ':' + seconds;
        } else if (hours > 0) {
            TimeLongMask = hours + ':' + TimeLongMask;
        }
        return TimeLongMask;
    };

    //处理error反馈json字串
    static formatErrMsg = (msg) => {
        msg = msg.replace("\"", "\/\"");
        return msg;
    }
}
