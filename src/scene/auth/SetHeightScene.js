import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import BaseUtil from '../../utils/BaseUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import PickerView from '../../module/PickerView';
import BackBtn from '../../module/BackBtn';
import HeaderBar from '../../module/HeaderBar';

export default class SetHeightScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        // headerTitle: () => {},
        // headerRight: () => (<MyText onPress={navigation.state.params.navigatePress} style={commonStyle.headerRight}>跳过</MyText>),
        headerShown: false,
    });

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            height: (user && user.height > 0) ? user.height : 0,
            disabled: (user && user.height > 0) ? false : true,
            showPicker: false,
        };
        this.options = {
            pickerTitleText: '请选择身高',
            pickerData: BaseUtil.getPickerHeight(),
            selectedValue: [170],
            onPickerConfirm: this.handlePickerConfirm,
            onPickerSelect: this.handlePickerSelect,
        }
    }

    // componentDidMount(): void {
    //     this.props.navigation.setParams({navigatePress: this.skip});
    // }

    skip = () => {
        this.props.navigation.replace('SetWeight', {});
    }

    goToNext = () => {
        let that = this;
        HttpUtil.post(api.profile, {height: this.state.height}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.user.height = that.state.height;
                that.props.navigation.navigate('SetWeight', {});
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    setHeight = () => {
        this.setState({showPicker: true});
    }

    hidePicker = () => {
        this.setState({showPicker: false});
    }

    handlePickerConfirm = (item: any[]) => {
        this.options.selectedValue = item;
        this.hidePicker();
        this.setState({height: item[0], disabled: false});
    }

    handlePickerSelect = (item: any[]) => {
        console.log(item);
    }

    render() {
        let height = <Heading>请选择您的身高</Heading>;
        if (this.state.height) height = <MyText style={commonStyle.authInfoText}>{this.state.height}cm</MyText>;
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
                <Heading>您的身高</Heading>
                <SpacingView height={24} />
                <TouchableOpacity activeOpacity={1} onPress={this.setHeight} style={commonStyle.authInfoView}>
                    {height}
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
