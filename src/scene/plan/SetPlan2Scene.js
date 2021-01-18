import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import PickerView from '../../module/PickerView';
import BaseUtil from '../../utils/BaseUtil';

export default class SetPlan2Scene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>2/4</Heading>),
    });

    constructor(props) {
        super(props);

        let planInfo = global.config.planInfo;
        this.state = {
            period: planInfo.period || 2,
            showPicker: false,
        };
        this.options = {
            pickerTitleText: '请选择训练周期',
            pickerData: [2,3,4,5,6,7,8,9,10,11,12],
            selectedValue: [planInfo.period || 2],
            onPickerConfirm: this.handlePickerConfirm,
            onPickerSelect: this.handlePickerSelect,
        };
    }

    goToNext = () => {
        if (!this.state.period) {
            global.toastShow('请选择训练周期');
            return;
        }
        global.config.planInfo.period = this.state.period;
        this.props.navigation.navigate('SetPlan3', {});
    }

    setPeriod = () => {
        this.setState({showPicker: true});
    }

    hidePicker = () => {
        this.setState({showPicker: false});
    }

    handlePickerConfirm = (item: any[]) => {
        this.options.selectedValue = item;
        this.hidePicker();
        this.setState({period: item[0]});
    }

    handlePickerSelect = (item: any[]) => {
        console.log(item);
    }

    render() {
        let period = <Heading>请选择训练周期</Heading>;
        if (this.state.period) period = <MyText style={commonStyle.authInfoText}>{this.state.period}周</MyText>;
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={35} />
                <Heading2>选择训练周期</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>根据你的选择，匹配适合你的项目计划</MyText>
                <SpacingView height={134} />
                <TouchableOpacity activeOpacity={1} onPress={this.setPeriod} style={commonStyle.authInfoView}>
                    {period}
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
});
