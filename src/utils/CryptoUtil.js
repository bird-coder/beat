import CryptoJs from 'crypto-js';

export default class CryptoUtil {
    static encrypt = (message, key) => {
        let sendData = CryptoJs.enc.Hex.parse(message);
        key = CryptoJs.enc.Hex.parse(key);
        let encrypted = CryptoJs.AES.encrypt(sendData, key, {
            mode: CryptoJs.mode.ECB,
            padding: CryptoJs.pad.NoPadding,
        });
        return encrypted.ciphertext.toString();
    }

    static decrypt = (message, key) => {
        let recvData = CryptoJs.enc.Base64.stringify(CryptoJs.enc.Hex.parse(message));
        key = CryptoJs.enc.Hex.parse(key);
        let decrypted = CryptoJs.AES.decrypt(recvData, key, {
            mode: CryptoJs.mode.ECB,
            padding: CryptoJs.pad.NoPadding,
        });
        return decrypted.toString();
    }
}
