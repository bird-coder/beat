import BaseMachine from './BaseMachine';
import ImageResources from '../common/image';

export default class Rope extends BaseMachine {
    constructor() {
        super();
        this.name = '跳绳子';
        this.ename = 'rope';
        this.stype = 6;
        this.recordType = 'count';
        this.maxFrequency = 140;
        this.devicePic = ImageResources.img_rope;
        this.keys = {frequency: '频率', total: '圈数'};
        this.unit = '圈';
        this.deviceInfo = {};
    }

    static getInstance = () => {
        if (!Rope.instance) {
            Rope.instance = new Rope();
        }
        return Rope.instance;
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
