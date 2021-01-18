import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';

import {Heading, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import TurnDetailCell from '../../module/TurnDetailCell';

export default class MyDeviceScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            devices: [
                {id: 1, title: '单车', subtitle: '未连接', isConnect: false, pic: ImageResources.device_bicycle},
                {id: 2, title: '划船机', subtitle: '未连接', isConnect: false, pic: ImageResources.device_rowing},
                {id: 3, title: '健腹机', subtitle: '未连接', isConnect: false, pic: ImageResources.device_abdomen},
                {id: 4, title: '踏步机', subtitle: '未连接', isConnect: false, pic: ImageResources.device_step},
                {id: 5, title: '电子秤', subtitle: '未连接', isConnect: false, pic: ImageResources.device_balance},
                {id: 6, title: '跳绳子', subtitle: '未连接', isConnect: false, pic: ImageResources.device_rope},
                {id: 7, title: '呼啦圈', subtitle: '未连接', isConnect: false, pic: ImageResources.device_hula},
            ],
        };
    }

    componentDidMount(): void {
        let obj = global.config.deviceObj;
        if (!obj.connect) return;
        let devices = Object.assign([], this.state.devices);
        for (let i in devices) {
            if (devices[i].id == obj.stype) {
                devices[i].subtitle = '已连接';
                devices[i].isConnect = true;
            }
        }
        this.setState({devices});
    }

    goToDetail = (index) => {
        let device = this.state.devices[index];
        if (!device) return;
        if (device.isConnect) this.props.navigation.navigate('DeviceInfo', {title: device.title});
    }

    render() {
        return (
            <>
                <SpacingView height={5} />
                <View style={commonStyle.bodyView}>
                    {this.state.devices.length > 0 && this.state.devices.map((info, index) => {
                        let bool = index < this.state.devices.length - 1;
                        return (
                            <TurnDetailCell title={info.title} subtitle={info.subtitle} iconPic={info.pic} border={bool} isMark={info.isConnect} onPress={this.goToDetail.bind(this, index)} />
                        );
                    })}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
});
