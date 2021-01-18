import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';

export default class SetPlan1Scene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>1/4</Heading>),
    });

    constructor(props) {
        super(props);

        let planInfo = global.config.planInfo;
        let devices = [
            {id: 1, icon: ImageResources.icon_bike, name: '单车'},
            {id: 2, icon: ImageResources.icon_rowing, name: '划船机'},
            {id: 4, icon: ImageResources.icon_run, name: '踏步机'},
        ];
        let index = -1;
        for (let i in devices) {
            if (devices[i].id == planInfo.stype) index = i;
        }
        this.state = {
            devices: devices,
            index: index,
        };
    }

    checkDevice = (index) => {
        let device = this.state.devices[index];
        if (!device) return;
        this.setState({index});
    }

    goToNext = () => {
        if (this.state.index < 0) {
            global.toastShow('请选择训练项目');
            return;
        }
        global.config.planInfo.stype = this.state.devices[this.state.index].id;
        this.props.navigation.navigate('SetPlan2', {});
    }

    render() {
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={35} />
                <Heading2>选择您的训练项目</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>根据你的选择，匹配适合你的项目计划</MyText>
                <SpacingView height={51} />
                {this.state.devices.map((info, index) => (
                    <TouchableOpacity activeOpacity={1} onPress={this.checkDevice.bind(this, index)} style={[styles.view, this.state.index == index && styles.checkView]}>
                        <Image source={info.icon} resizeMode={'stretch'} style={styles.icon} />
                        <MyText style={[styles.text, this.state.index == index && styles.checkText]}>{info.name}</MyText>
                    </TouchableOpacity>
                ))}
                <SpacingView height={130} />
                <BtnCell value={'下一步'} onPress={this.goToNext} style={commonStyle.setBtn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    view: {
        width: 280,
        height: 50,
        borderRadius: 4,
        backgroundColor: color.paper,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    checkView: {
        borderWidth: 1,
        borderColor: color.primary_5,
        backgroundColor: color.primary_1,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    text: {
        fontSize: 17,
        lineHeight: 26,
    },
    checkText: {
        color: color.primary,
    },
});
