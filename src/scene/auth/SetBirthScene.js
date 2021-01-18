import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Picker from 'react-native-picker';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';
import BaseUtil from '../../utils/BaseUtil';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import PickerView from '../../module/PickerView';
import HeaderBar from '../../module/HeaderBar';
import BackBtn from '../../module/BackBtn';

export default class SetBirthScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        // headerTitle: () => {},
        // headerRight: () => (<MyText onPress={navigation.state.params.navigatePress} style={commonStyle.headerRight}>跳过</MyText>),
        headerShown: false,
    });

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            birthday: (user && user.birthday) || 0,
            disabled: (user && user.birthday) ? false : true,
            showPicker: false,
        };
        this.options = {
            pickerTitleText: '请选择生日',
            pickerData: BaseUtil.getDatePickerList(),
            selectedValue: BaseUtil.getPickerDate().split('-'),
            onPickerConfirm: this.handlePickerConfirm,
            onPickerSelect: this.handlePickerSelect,
        }
    }

    // componentDidMount(): void {
    //     this.props.navigation.setParams({navigatePress: this.skip});
    // }

    skip = () => {
        this.props.navigation.replace('SetHeight', {});
    }

    goToNext = () => {
        let that = this;
        HttpUtil.post(api.profile, {birthday: this.state.birthday}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.user.birthday = that.state.birthday;
                that.props.navigation.navigate('SetHeight', {});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    setBirth = () => {
        this.setState({showPicker: true});
    }

    hidePicker = () => {
        this.setState({showPicker: false});
    }

    handlePickerConfirm = (item: any[]) => {
        this.options.selectedValue = item;
        this.hidePicker();
        this.setState({birthday: item.join('/'), disabled: false});
    }

    handlePickerSelect = (item: any[]) => {
        console.log(item);
    }

    render() {
        let birth = <Heading>请选择出生日期</Heading>;
        if (this.state.birthday) birth = <MyText style={commonStyle.authInfoText}>{this.state.birthday}</MyText>;
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
                <Heading>你的生日</Heading>
                <SpacingView height={24} />
                <TouchableOpacity activeOpacity={1} onPress={this.setBirth} style={commonStyle.authInfoView}>
                    {birth}
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
