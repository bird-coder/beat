import BaseMachine from './BaseMachine';
import ImageResources from '../common/image';

export default class Bicycle extends BaseMachine {
    constructor() {
        super();
        this.name = '动感单车';
        this.ename = 'bike';
        this.stype = 1;
        this.recordType = 'speed';
        this.maxSpeed = 36;
        let speed1 = 14 + Math.floor(Math.random() * 3);
        let speed2 = 14 + Math.floor(Math.random() * 3);
        this.aiSpeed = speed1 + ':' + speed1 + ':' + speed2 + ':' + speed2;
        this.devicePic = ImageResources.img_bicycle;
        this.splash = ImageResources.img_bicycle;
        this.scenes = [
            {id: 1, name: '森林', scene: 'woods', pic: ImageResources.img_forest},
            {id: 2, name: '城市', scene: 'city', pic: ImageResources.img_city},
            {id: 3, name: '海边公路', scene: 'beachroad', pic: ImageResources.img_beachroad},
        ];
        this.sceneType = 'bike';
        this.hasScene = true;
        this.visualAngle = 0;
        this.keys = {frequency: '踏频', total: '圈数'};
        this.unit = 'km/h';
        this.deviceInfo = {};
    }

    static getInstance = () => {
        if (!Bicycle.instance) {
            Bicycle.instance = new Bicycle();
        }
        return Bicycle.instance;
    }

    formatSportData = (obj) => {
        obj.distance = (Math.floor(Math.PI * 0.4 * obj.total / 10) / 100).toFixed(2);
        obj.speed = Math.round(obj.frequency * 4.4);
        obj.consume = (Math.floor(obj.distance * 15 * 10) / 10).toFixed(1);
        if (!obj.heartRate) {
            obj.heartRate = 'NA';
            // let min = 70, max = 140;
            // obj.heartRate = min;
            // if (obj.speed > this.maxSpeed) obj.heartRate = max;
            // else {
            //     obj.heartRate = min + Math.round(obj.speed / this.maxSpeed * 70);
            // }
        }
        return obj;
    }

    getGameSpeed = (obj) => {
        let speed,distance,goSpeed,animateSpeed;
        speed = Math.round(Math.PI * 0.4 * obj.frequency * 3.6);
        distance = Math.round(Math.PI * 0.4 * obj.total / 100) / 10;
        goSpeed = Math.round(speed * 0.5);
        animateSpeed = goSpeed;
        return goSpeed + ':' + speed + ':' + animateSpeed + ':' + distance + ':' + this.aiSpeed;
    }
}
