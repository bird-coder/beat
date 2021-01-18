import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';

import {Heading, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import TurnDetailCell from '../../module/TurnDetailCell';
import BtnCell from '../../module/BtnCell';
import BLEUtil from '../../utils/BLEUtil';

export default class DeviceInfoScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            infos: [
                {title: '设备类型', subtitle: '踏步机'},
                {title: '设备编号', subtitle: 'CSA2311411'},
                {title: '生产厂家', subtitle: '英尔健'},
            ],
            deviceId: null,
        };
    }

    componentDidMount(): void {
        let obj = global.config.deviceObj;
        if (!obj.connect) {
            global.toastShow('设备未连接');
            this.props.navigation.goBack();
            return;
        }
        let infos = [
            {title: '设备类型', subtitle: global.config.deviceList[obj.stype]},
            {title: '设备编号', subtitle: obj.deviceInfo.data.deviceId},
            {title: '生产厂家', subtitle: obj.deviceInfo.data.factoryId},
        ];
        this.setState({infos, deviceId: device.id});
    }

    disconnectDevice = () => {
        let that = this;
        BLEUtil.disconnectBLE(this.state.deviceId).then((res) => {
            if (res) {
                global.toastShow('设备连接已断开');
                that.props.navigation.goBack();
            }
        });
    }

    render() {
        return (
            <>
                <SpacingView height={5} />
                <View style={commonStyle.bodyView}>
                    {this.state.infos.length > 0 && this.state.infos.map((info, index) => {
                        let bool = index < this.state.infos.length - 1;
                        return (
                            <TurnDetailCell title={info.title} subtitle={info.subtitle} border={bool} showDetail={false} />
                        );
                    })}
                </View>
                <SpacingView height={18} />
                <BtnCell value={'断开连接'} style={commonStyle.rowBtn} textStyle={commonStyle.rowBtnText} onPress={this.disconnectDevice} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
});
