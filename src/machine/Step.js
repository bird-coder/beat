import BaseMachine from './BaseMachine';
import ImageResources from '../common/image';

export default class Step extends BaseMachine {
    constructor() {
        super();
        this.name = '踏步机';
        this.ename = 'step';
        this.stype = 4;
        this.recordType = 'count';
        this.maxFrequency = 80;
        this.devicePic = ImageResources.img_step;
        this.splash = ImageResources.img_step;
        this.scenes = [
            {id: 1, name: '森林', scene: 'woods', pic: ImageResources.img_forest},
            {id: 2, name: '城市', scene: 'city', pic: ImageResources.img_city},
            {id: 3, name: '海边公路', scene: 'beachroad', pic: ImageResources.img_beachroad},
        ];
        this.sceneType = 'bike';
        this.hasScene = true;
        this.visualAngle = 1;
        this.keys = {frequency: '步频', total: '步数'};
        this.unit = '步';
        this.deviceInfo = {};
    }

    static getInstance = () => {
        if (!Step.instance) {
            Step.instance = new Step();
        }
        return Step.instance;
    }

    formatSportData = (obj) => {
        obj.consume = (Math.floor(obj.total * 0.02 * 10) / 10).toFixed(1);
        if (!obj.heartRate) {
            obj.heartRate = 'NA';
            // let min = 70, max = 140;
            // obj.heartRate = min;
            // if (obj.frequency > this.maxFrequency) obj.heartRate = max;
            // else {
            //     obj.heartRate = min + Math.round(obj.frequency / this.maxFrequency * 70);
            // }
        }
        return obj;
    }
}
