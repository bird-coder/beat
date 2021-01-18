import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import PickerView from '../../module/PickerView';

export default class SetPlan4Scene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>4/5</Heading>),
    });

    constructor(props) {
        super(props);

        let planInfo = global.config.planInfo;
        this.state = {
            noticeTime: planInfo.noticeTime || '17:00',
            showPicker: false,
        };
        this.options = {
            pickerTitleText: '请选择提醒时间',
            pickerData: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                '20:00', '20:30', '21:00'],
            selectedValue: [planInfo.noticeTime || '17:00'],
            onPickerConfirm: this.handlePickerConfirm,
            onPickerSelect: this.handlePickerSelect,
        };
    }

    goToNext = () => {
        if (!this.state.noticeTime) {
            global.toastShow('请选择提醒时间');
            return;
        }
        global.config.planInfo.noticeTime = this.state.noticeTime;
        this.props.navigation.navigate('SetPlan5', {});
    }

    setNotice = () => {
        this.setState({showPicker: true});
    }

    hidePicker = () => {
        this.setState({showPicker: false});
    }

    handlePickerConfirm = (item: any[]) => {
        this.options.selectedValue = item;
        this.hidePicker();
        this.setState({noticeTime: item[0]});
    }

    handlePickerSelect = (item: any[]) => {
        console.log(item);
    }

    render() {
        let noticeTime = <Heading>请选择提醒时间</Heading>;
        if (this.state.noticeTime) noticeTime = <MyText style={commonStyle.authInfoText}>{this.state.noticeTime}</MyText>;
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={35} />
                <Heading2>训练日提醒</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>有效的提醒能使训练效果大幅度提升哦</MyText>
                <SpacingView height={134} />
                <TouchableOpacity activeOpacity={1} onPress={this.setNotice} style={commonStyle.authInfoView}>
                    {noticeTime}
                </TouchableOpacity>
                <SpacingView height={208} />
                <BtnCell value={'下一步'} onPress={this.goToNext} style={commonStyle.setBtn} />
                <PickerView isShow={this.state.showPicker} options={this.options} onHide={this.hidePicker} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 30,
        lineHeight: 35,
    },
});
