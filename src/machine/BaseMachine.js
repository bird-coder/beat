class deviceData {
    id: string;
    rssi: string;
    serviceUUIDs: Array;
    name: string;
    data: Object;
}

class deviceInfo {
    factoryId: string;
    deviceId: string;
    deviceType: string;
    stype: number;
    dealerId: string;
    address: string;
    sign: string;
}

class SportData {
    total: number;
    frequency: number;
    heartRate: number;
    weight: number;
    bmi: number;
}

export default class BaseMachine {
    constructor() {

    }

    setDeviceInfo = (obj) => {
        // if (obj instanceof deviceData) {
            this.deviceInfo = obj;
            this.connect = true;
        // }
    }

    formatSportData = () => {
        if (this.recordType != 'speed') return;
    }

    getGameSpeed = () => {
        if (this.recordType != 'speed') return;
    }

}