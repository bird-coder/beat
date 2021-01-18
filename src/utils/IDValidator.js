export default class IDValidator {
    /*省,直辖市代码表*/
    static provinceAndCitys = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

    /*每位加权因子*/
    static powers = ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"]

    /*第18位校检码*/
    static parityBit = ["1","0","X","9","8","7","6","5","4","3","2"]

    /*性别*/
    static genders = { male: "M", female: "F" }

    /*校验地址码*/
    static checkAddressCode = (addressCode) => {
        let check = /^[1-9]\d{5}$/.test(addressCode);
        if (!check) return false;
        if (IDValidator.provinceAndCitys[parseInt(addressCode.substring(0,2))]) {
            return true;
        } else {
            return false;
        }
    }

    /*校验日期码*/
    static checkBirthDayCode = (birDayCode) => {
        let check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
        if (!check) return false;
        let yyyy = parseInt(birDayCode.substring(0,4),10);
        let mm = parseInt(birDayCode.substring(4,6),10);
        let dd = parseInt(birDayCode.substring(6),10);
        let xdata = new Date(yyyy,mm-1,dd);
        if (xdata > new Date()) {
            return false; //生日不能大于当前日期
        } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
            return true;
        } else {
            return false;
        }
    }

    /*计算校检码*/
    static getParityBit = (idCardNo) => {
        let id17 = idCardNo.substring(0,17);
        /*加权*/
        let power = 0;
        for (let i=0; i<17; i++) {
            power += parseInt(id17.charAt(i),10) * parseInt(IDValidator.powers[i]);
        }
        /*取模*/
        let mod = power % 11;
        return IDValidator.parityBit[mod];
    }

    /*验证校检码*/
    static checkParityBit = (idCardNo) => {
        let parityBit = idCardNo.charAt(17).toUpperCase();
        if (IDValidator.getParityBit(idCardNo) == parityBit) {
            return true;
        } else {
            return false;
        }
    }

    /*校验15位或18位的身份证号码*/
    static checkIdCardNo = (idCardNo) => {
        //15位和18位身份证号码的基本校验
        let check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
        if (!check) return false;
        //判断长度为15位或18位
        if (idCardNo.length==15) {
            return IDValidator.check15IdCardNo(idCardNo);
        } else if (idCardNo.length==18) {
            return IDValidator.check18IdCardNo(idCardNo);
        } else {
            return false;
        }
    }

    //校验15位的身份证号码
    static check15IdCardNo = (idCardNo) => {
        //15位身份证号码的基本校验
        let check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
        if (!check) return false;
        //校验地址码
        let addressCode = idCardNo.substring(0,6);
        check = IDValidator.checkAddressCode(addressCode);
        if (!check) return false;
        let birDayCode = '19' + idCardNo.substring(6,12);
        //校验日期码
        check = IDValidator.checkBirthDayCode(birDayCode);
        if (!check) return false;
        //验证校检码
        return IDValidator.checkParityBit(idCardNo);
    }

    //校验18位的身份证号码
    static check18IdCardNo = (idCardNo) => {
        //18位身份证号码的基本格式校验
        let check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
        if (!check) return false;
        //校验地址码
        let addressCode = idCardNo.substring(0,6);
        check = IDValidator.checkAddressCode(addressCode);
        if (!check) return false;
        //校验日期码
        let birDayCode = idCardNo.substring(6,14);
        check = IDValidator.checkBirthDayCode(birDayCode);
        if (!check) return false;
        //验证校检码
        return IDValidator.checkParityBit(idCardNo);
    }

    static formateDateCN = (day) => {
        let yyyy = day.substring(0,4);
        let mm = day.substring(4,6);
        let dd = day.substring(6);
        return yyyy + '-' + mm + '-' + dd;
    }

    //获取信息
    static getIdCardInfo = (idCardNo) => {
        let idCardInfo = {
            gender: "",  //性别
            birthday: "", // 出生日期(yyyy-mm-dd)
            age: 0
        };
        if (idCardNo.length==15) {
            let aday = '19' + idCardNo.substring(6,12);
            idCardInfo.birthday = IDValidator.formateDateCN(aday);
            if (parseInt(idCardNo.charAt(14))%2==0) {
                idCardInfo.gender = IDValidator.genders.female;
            } else {
                idCardInfo.gender = IDValidator.genders.male;
            }
        } else if (idCardNo.length==18) {
            let aday = idCardNo.substring(6,14);
            idCardInfo.birthday = IDValidator.formateDateCN(aday);
            if (parseInt(idCardNo.charAt(16))%2==0) {
                idCardInfo.gender = IDValidator.genders.female;
            } else {
                idCardInfo.gender = IDValidator.genders.male;
            }
        }
        let d1 = new Date(idCardInfo.birthday.replace(/-/g, '/')).getFullYear();
        let d2 = new Date().getFullYear();
        idCardInfo.age = d2 - d1 + 1;
        return idCardInfo;
    }

    /*18位转15位*/
    static getId15 = (idCardNo) => {
        if (idCardNo.length==15) {
            return idCardNo;
        } else if (idCardNo.length==18) {
            return idCardNo.substring(0,6) + idCardNo.substring(8,17);
        } else {
            return null;
        }
    }

    /*15位转18位*/
    static getId18 = (idCardNo) => {
        if (idCardNo.length==15) {
            let id17 = idCardNo.substring(0,6) + '19' + idCardNo.substring(6);
            let parityBit = IDValidator.getParityBit(id17);
            return id17 + parityBit;
        } else if (idCardNo.length==18) {
            return idCardNo;
        } else {
            return null;
        }
    }

    static getAge = (cardno) => {
        if (cardno.length >= 14) {
            let d = cardno.substring(6, 6+8);
            d = d.substring(0,4) + '/' + d.substring(4,6) + '/' + d.substring(6);
            let now = new Date().format('yyyy');
            let dd = d.toDateTime().format('yyyy');
            return now - dd + 1;
        }
        return 0;
    }

    static getSex = (cardno) => {
        if (cardno.length == 18) {
            let d = cardno.substring(16, 17);
            if (d % 2 == 1) {
                return '1';
            } else {
                return '2';
            }
        }
        return '';
    }
}
