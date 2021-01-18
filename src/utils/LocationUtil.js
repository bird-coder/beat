import {Geolocation, GetDistance} from 'react-native-baidu-map';
import DeviceInfo from 'react-native-device-info';

export default class LocationUtil {
    //获取定位
    static getLocation = () => {
        DeviceInfo.isLocationEnabled().then((bool) => {
            if (bool) {
                Geolocation.getCurrentPosition().then((res) => {
                    console.log('定位成功', res);
                    if (res && res.hasOwnProperty('longitude') && res.hasOwnProperty('latitude')) {
                        if (res.longitude == 5e-324 && res.latitude == 5e-324) {
                            console.log('定位失败5e-324');
                        } else {
                            global.config.coordinate = {lng: res.longitude, lat: res.latitude};
                        }
                    }
                }).catch((err) => {
                    console.log('定位失败', err);
                });
            }
        });
    }

    //获取两个坐标点的距离
    static getDistance = (lng1, lat1, lng2, lat2) => {
        let coordinate1 = {latitude: lat1, longitude: lng1};
        let coordinate2 = {latitude: lat2, longitude: lng2};
        return new Promise((resolve, reject) => {
            GetDistance.getLocationDistance(coordinate1, coordinate2).then((res) => {
                if (res && res.hasOwnProperty('distance')) {
                    resolve(res.distance);
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }
}
