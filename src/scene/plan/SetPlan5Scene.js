import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';

export default class SetPlan5Scene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>4/4</Heading>),
    });

    constructor(props) {
        super(props);

        let planInfo = global.config.planInfo;
        this.state = {
            index: planInfo.active || 1,
        };
    }

    checkState = (index) => {
        this.setState({index});
    }

    savePlan = () => {
        let that = this;
        global.config.planInfo.active = this.state.index;
        let params = Object.assign({}, global.config.planInfo);
        params.distribute = params.distribute.join(',');
        HttpUtil.post(api.addPlan, params).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                global.config.planInfo = {active: params.active};
                that.props.navigation.navigate('SetPlan6', {plan: json.data.plan});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    render() {
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={35} />
                <Heading2>计划启用</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>请选择是否自动启用计划</MyText>
                <SpacingView height={138} />
                <View style={commonStyle.rowView}>
                    <TouchableOpacity activeOpacity={1} onPress={this.checkState.bind(this, 0)} style={[styles.view, this.state.index == 0 && styles.checkView]}>
                        <MyText style={[styles.text, this.state.index == 0 && styles.checkText]}>暂不需要</MyText>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={this.checkState.bind(this, 1)} style={[styles.view, this.state.index == 1 && styles.checkView]}>
                        <MyText style={[styles.text, this.state.index == 1 && styles.checkText]}>自动启用</MyText>
                    </TouchableOpacity>
                </View>
                <SpacingView height={202} />
                <BtnCell value={'保存'} onPress={this.savePlan} style={commonStyle.setBtn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    view: {
        width: 130,
        height: 50,
        borderRadius: 4,
        backgroundColor: color.paper,
        padding: 13,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    checkView: {
        borderWidth: 1,
        borderColor: color.primary_5,
        backgroundColor: color.primary_1,
    },
    text: {
        fontSize: 17,
        lineHeight: 24,
    },
    checkText: {
        color: color.primary,
    },
});
