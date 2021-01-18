import BaseMachine from './BaseMachine';
import ImageResources from '../common/image';

export default class Rowing extends BaseMachine {
    constructor() {
        super();
        this.name = '划船机';
        this.ename = 'ship';
        this.stype = 2;
        this.recordType = 'speed';
        this.maxSpeed = 12;
        let speed1 = 10 + Math.floor(Math.random() * 2);
        let speed2 = 10 + Math.floor(Math.random() * 2);
        this.aiSpeed = speed1 + ':' + speed1 + ':' + speed2 + ':' + speed2;
        this.devicePic = ImageResources.img_rowing;
        this.splash = ImageResources.img_rowing;
        this.scenes = [
            {id: 1, name: '海岸', scene: 'sea', pic: ImageResources.img_ocean},
            {id: 2, name: '雨林', scene: 'river', pic: ImageResources.img_rainforest},
        ];
        this.sceneType = 'ship';
        this.hasScene = true;
        this.visualAngle = 0;
        this.keys = {frequency: '桨频', total: '桨数'};
        this.unit = 'km/h';
        this.deviceInfo = {};
    }

    static getInstance = () => {
        if (!Rowing.instance) {
            Rowing.instance = new Rowing();
        }
        return Rowing.instance;
    }

    formatSportData = (obj) => {
        obj.distance = (Math.floor(0.4 * obj.total / 10) / 100).toFixed(2);
        obj.speed = Math.round(0.4 * obj.frequency * 3.6);
        obj.consume = (Math.floor(obj.distance * 70 * 10) / 10).toFixed(1);
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
        speed = Math.round(0.4 * obj.frequency * 3.6);
        distance = Math.round(0.4 * obj.total / 100) / 10;
        goSpeed = Math.round(speed * 1);
        animateSpeed = goSpeed;
        return goSpeed + ':' + speed + ':' + animateSpeed + ':' + distance + ':' + this.aiSpeed;
    }
}
