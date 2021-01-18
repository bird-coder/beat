import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {MyText, Heading2, Heading} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';
import api from '../../common/api';

export default class SetSexScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => {},
        headerRight: () => (<MyText onPress={navigation.state.params.navigatePress} style={commonStyle.headerRight}>跳过</MyText>),
    });

    constructor(props) {
        super(props);

        let user = global.config.user;
        this.state = {
            sex: (user && user.sex) || 0,
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({navigatePress: this.skip});
    }

    skip = () => {
        this.props.navigation.replace('SetBirth', {});
    }

    checkSex = (sex) => {
        if (this.state.sex != sex) this.setState({sex});
    }

    goToNext = () => {
        let that = this;
        if ([0,1].indexOf(this.state.sex) == -1) return global.toastShow('请选择性别');
        HttpUtil.post(api.profile, {sex: this.state.sex}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.user.sex = that.state.sex;
                that.props.navigation.navigate('SetBirth', {});
            } else {
                return global.toastShow(json.message);
            }
        });
        // this.props.navigation.navigate('SetBirth', {});
    }

    render() {
        let textStyle = {color: color.primary};
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={35} />
                <Heading2>完善个人信息</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>填写真实信息有助于计划定制</MyText>
                <SpacingView height={89} />
                <Heading>你的性别</Heading>
                <SpacingView height={10} />
                <View style={commonStyle.rowView}>
                    <TouchableOpacity activeOpacity={1} style={[commonStyle.rowView, styles.item, this.state.sex == 0 && styles.checkItem]} onPress={this.checkSex.bind(this, 0)}>
                        <Icon name={'ion|male'} size={18} color={this.state.sex == 0 ? color.primary : color.text} />
                        <Heading style={this.state.sex == 0 && textStyle}>男</Heading>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[commonStyle.rowView, styles.item, this.state.sex == 1 && styles.checkItem]} onPress={this.checkSex.bind(this, 1)}>
                        <Icon name={'ion|female'} size={18} color={this.state.sex == 1 ? color.primary : color.text} />
                        <Heading style={this.state.sex == 1 && textStyle}>女</Heading>
                    </TouchableOpacity>
                </View>
                <SpacingView height={123} />
                <BtnCell value={'下一步'} onPress={this.goToNext} style={commonStyle.setBtn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 130,
        height: 50,
        borderRadius: 4,
        backgroundColor: color.paper,
        padding: 13,
        margin: 10,
        justifyContent: 'center',
    },
    checkItem: {
        borderColor: color.primary_5,
        borderWidth: ScreenUtil.onePixel * 2,
        backgroundColor: color.primary_1,
        color: color.primary,
    },
});
