import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import BaseUtil from '../../utils/BaseUtil';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import BackBtn from '../../module/BackBtn';
import HeaderBar from '../../module/HeaderBar';
import PickerView from '../../module/PickerView';
import HttpUtil from '../../utils/HttpUtil';
import api from '../../common/api';

export default class SetWeightScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        // headerTitle: () => {},
        // headerRight: () => (<MyText onPress={navigation.state.params.navigatePress} style={commonStyle.headerRight}>跳过</MyText>),
        headerShown: false,
    });

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            weight: (user && user.weight > 0) ? user.weight : 0,
            disabled: (user && user.weight > 0) ? false : true,
            showPicker: false,
        };
        this.options = {
            pickerTitleText: '请选择体重',
            pickerData: BaseUtil.getPickerWeight(),
            selectedValue: [60],
            onPickerConfirm: this.handlePickerConfirm,
            onPickerSelect: this.handlePickerSelect,
        }
    }

    // componentDidMount(): void {
    //     this.props.navigation.setParams({navigatePress: this.skip});
    // }

    skip = () => {
        this.props.navigation.replace('SetBMI', {});
    }

    goToNext = () => {
        let that = this;
        HttpUtil.post(api.profile, {weight: this.state.weight}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.user.weight = that.state.weight;
                that.props.navigation.navigate('SetBMI', {});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    setWeight = () => {
        this.setState({showPicker: true});
    }

    hidePicker = () => {
        this.setState({showPicker: false});
    }

    handlePickerConfirm = (item: any[]) => {
        this.options.selectedValue = item;
        this.hidePicker();
        this.setState({weight: item[0], disabled: false});
    }

    handlePickerSelect = (item: any[]) => {
        console.log(item);
    }

    render() {
        let weight = <Heading>请选择您的体重</Heading>;
        if (this.state.weight) weight = <MyText style={commonStyle.authInfoText}>{this.state.weight}kg</MyText>;
        return (
            <View style={commonStyle.setBody}>
                <HeaderBar>
                    <BackBtn />
                    <View style={commonStyle.fillView}/>
                    <MyText onPress={this.skip} style={commonStyle.headerRight}>跳过</MyText>
                </HeaderBar>
                <SpacingView height={35} />
                <Heading2>完善个人信息</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>填写真实信息有助于计划定制</MyText>
                <SpacingView height={89} />
                <Heading>您的体重</Heading>
                <SpacingView height={24} />
                <TouchableOpacity activeOpacity={1} onPress={this.setWeight} style={commonStyle.authInfoView}>
                    {weight}
                </TouchableOpacity>
                <SpacingView height={133} />
                <BtnCell value={'下一步'} onPress={this.goToNext} disabled={this.state.disabled} style={commonStyle.setBtn} />
                <PickerView isShow={this.state.showPicker} options={this.options} onHide={this.hidePicker} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
});
