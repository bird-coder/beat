import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';

import api from '../common/api';
import BaseUtil from './BaseUtil';

export default class FileUtil {
    static initDir = () => {
        let dir = RNFS.CachesDirectoryPath + '/user_image';
        RNFS.exists(dir).then((bool) => {
            if (!bool) {
                RNFS.mkdir(dir).then((res) => {
                    console.log('创建图片目录成功', res);
                }).catch((err) => {
                    console.log('创建图片目录成功', err);
                });
            }
        });
    }

    static saveRemotePhoto = (url) => {
        if (global.platform.isIOS) {
            CameraRoll.save(api.cdn + url).then((res) => {
                console.log('保存成功', res);
            }).catch((err) => {
                console.log('保存失败', err);
            });
        } else {
            let path = RNFS.CachesDirectoryPath + '/user_image';
            let file = 'image-' + url.split('/').join('-');
            let downloadPath = path + '/' + file;
            RNFS.exists(downloadPath).then((bool) => {
                if (bool) {
                    CameraRoll.save('file://' + downloadPath).then((res1) => {
                        console.log('保存成功', res1);
                    }).catch((err) => {
                        console.log('保存失败', err);
                    });
                } else {
                    let ret = RNFS.downloadFile({
                        fromUrl: api.cdn + url,
                        toFile: downloadPath,
                    });
                    ret.promise.then((res) => {
                        if (res && res.statusCode == 200) {
                            CameraRoll.save('file://' + downloadPath).then((res1) => {
                                console.log('保存成功', res1);
                            }).catch((err) => {
                                console.log('保存失败', err);
                            });
                        }
                    });
                }
            });
        }
    }

    static saveLocalPhoto = (path) => {
        CameraRoll.save(path, {type: 'photo'}).then((res) => {
            console.log('保存成功', res);
        }).catch((err) => {
            console.log('保存失败', err);
        });
    }

    static checkImageCache = (url) => {
        let path = RNFS.CachesDirectoryPath + '/user_image';
        let file = 'image-' + url.split('/').join('-');
        let downloadPath = path + '/' + file;
        return new Promise((resolve, reject) => {
            RNFS.exists(downloadPath).then((bool) => {
                if (bool) resolve('file://' + downloadPath);
                else {
                    resolve(false);
                }
            });
        });
    }

    static saveRemotePic = (url) => {
        let path = RNFS.CachesDirectoryPath + '/user_image';
        let file = 'image-' + url.split('/').join('-');
        let downloadPath = path + '/' + file;
        return new Promise((resolve, reject) => {
            RNFS.exists(downloadPath).then((bool) => {
                if (bool) resolve('file://' + downloadPath);
                else {
                    let timestamp = BaseUtil.getTimeStamp();
                    RNFS.exists(downloadPath + '.lock').then((bool2) => {
                        if (bool2) {
                            RNFS.readFile(downloadPath + '.lock').then((time) => {
                                if (timestamp - time < 300) {
                                    resolve(api.cdn + url);
                                } else {
                                    RNFS.writeFile(downloadPath + '.lock', timestamp).then(() => {
                                        let ret = RNFS.downloadFile({
                                            fromUrl: api.cdn + url,
                                            toFile: downloadPath,
                                        });
                                        ret.promise.then((res) => {
                                            if (res && res.statusCode == 200) {
                                                RNFS.unlink(downloadPath + '.lock').then(() => {
                                                    console.log('删除锁文件成功');
                                                }).catch((err) => {
                                                    console.log('删除锁文件失败', err);
                                                });
                                                resolve('file://' + downloadPath);
                                            } else {
                                                RNFS.unlink(downloadPath + '.lock').then(() => {
                                                    console.log('删除锁文件成功');
                                                }).catch((err) => {
                                                    console.log('删除锁文件失败', err);
                                                });
                                                resolve(api.cdn + url);
                                            }
                                        });
                                    }).catch((err) => {
                                        console.log('创建锁文件失败', err);
                                    });
                                }
                            });
                        } else {
                            RNFS.writeFile(downloadPath + '.lock', timestamp).then(() => {
                                let ret = RNFS.downloadFile({
                                    fromUrl: api.cdn + url,
                                    toFile: downloadPath,
                                });
                                ret.promise.then((res) => {
                                    if (res && res.statusCode == 200) {
                                        RNFS.unlink(downloadPath + '.lock').then(() => {
                                            console.log('删除锁文件成功');
                                        }).catch((err) => {
                                            console.log('删除锁文件失败', err);
                                        });
                                        resolve('file://' + downloadPath);
                                    } else {
                                        RNFS.unlink(downloadPath + '.lock').then(() => {
                                            console.log('删除锁文件成功');
                                        }).catch((err) => {
                                            console.log('删除锁文件失败', err);
                                        });
                                        resolve(api.cdn + url);
                                    }
                                });
                            }).catch((err) => {
                                console.log('创建锁文件失败', err);
                            });
                        }
                    });
                }
            });
        });
    }

    static getStat = (file) => {
        return RNFS.stat(file).then((res) => {
            if (res && res.ctime) return Date.parse(res.ctime.toLocaleString()) / 1000;
            else return null;
        });
    }

    static preloadImg = (photos) => {
        let arr = [];
        for (let i in photos) {
            arr.push({uri: api.cdn + photos[i]});
        }
        FastImage.preload(arr);
    }

    static clearCache = () => {
        let path = RNFS.CachesDirectoryPath + '/image_cache/v2.ols100.1';
        RNFS.exists(path).then((bool) => {
            if (bool) {
                RNFS.readDir(path).then((results) => {
                    console.log('GOT RESULT', results);
                    for (let i in results) {
                        let diff = BaseUtil.getTimeStamp() - Date.parse(results[i].mtime.toLocaleDateString()) / 1000;
                        let day = parseInt(diff / 86400);
                        if (day >= 5) {
                            RNFS.unlink(results[i].path).then(() => {
                                console.log('file deleted');
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
        ImageCropPicker.clean().then((res) => {
            console.log('清除相机缓存成功', res);
        }).catch((err) => {
            console.log('清除相机缓存失败', err);
        });
    }
}