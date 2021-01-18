import Bicycle from './Bicycle';
import Rowing from './Rowing';
import Rope from './Rope';
import Abdomen from './Abdomen';
import Step from './Step';
import Hula from './Hula';

export default class MachineFactory {
    static getDevice = (stype) => {
        let obj;
        switch (stype) {
            //单车
            case 1: obj = Bicycle.getInstance(); break;
            //划船机
            case 2: obj = Rowing.getInstance(); break;
            //健腹机
            case 3: obj = Abdomen.getInstance(); break;
            //踏步机
            case 4: obj = Step.getInstance(); break;
            //电子秤
            case 5: break;
            //跳绳子
            case 6: obj = Rope.getInstance(); break;
            //呼啦圈
            case 7: obj = Hula.getInstance(); break;
            default: obj = Bicycle.getInstance(); break;
        }
        return obj;
    }
}
