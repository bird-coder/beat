import BaseMachine from './BaseMachine';
import ImageResources from '../common/image';

export default class Abdomen extends BaseMachine {
    constructor() {
        super();
        this.name = '健腹机';
        this.ename = 'abdomen';
        this.stype = 3;
        this.recordType = 'count';
        this.maxFrequency = 80;
        this.devicePic = ImageResources.img_abdomen;
        this.keys = {frequency: '频率', total: '次数'};
        this.unit = '次';
        this.deviceInfo = {};
    }

    static getInstance = () => {
        if (!Abdomen.instance) {
            Abdomen.instance = new Abdomen();
        }
        return Abdomen.instance;
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
