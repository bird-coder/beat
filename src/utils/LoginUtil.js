import UMShare from '../module/umeng/ShareModule';

export default class LoginUtil {
    static UMAuth = (index = 0) => {
        let type = 2;
        switch (index) {
            case 0:
                type = 2;
                break;
            case 1:
                type = 0;
                break;
        }
        return new Promise((resolve, reject) => {
            global.toastLoading();
            UMShare.auth(type, (code, result, message) => {
                console.log(code, result, message);
                if ((global.platform.isAndroid && code == 0) || (global.platform.isIOS && code == 200)) {
                    //授权成功
                    // let authInfo = {
                    //     accessToken: result.accessToken,
                    //     refreshToken: result.refreshToken || '',
                    //     expiration: Math.round(result.expiration / 1000) - 10,
                    //     openid: result.openid,
                    //     unionid: result.unionid,
                    // };
                    let gender = result.gender;
                    if (gender == '男') gender = 0;
                    else if (gender == '女') gender = 1;
                    gender = parseInt(gender);
                    let params = {
                        name: result.name,
                        city: result.province + '-' + result.city,
                        iconurl: result.iconurl,
                        gender: gender,
                        openid: result.openid,
                        unionid: result.unionid,
                    };
                    global.toastHide(() => {
                        resolve(params);
                    });
                } else {
                    global.toastHide(() => {
                        global.toastShow('授权失败');
                    });
                }
            });
        });
    }
}