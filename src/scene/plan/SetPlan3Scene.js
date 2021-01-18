import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';

export default class SetPlan3Scene extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>3/4</Heading>),
    });

    constructor(props) {
        super(props);

        let planInfo = global.config.planInfo;
        let days = [
            {title: '一', checked: false},
            {title: '二', checked: false},
            {title: '三', checked: false},
            {title: '四', checked: false},
            {title: '五', checked: false},
            {title: '六', checked: false},
            {title: '日', checked: false},
        ];
        if (planInfo.distribute && planInfo.distribute.length > 0) {
            for (let i in days) {
                if (planInfo.distribute.indexOf((i*1+1)+'') != -1) days[i].checked = true;
            }
        }
        this.state = {
            days: days,
        };
    }

    checkDay = (index) => {
        let day = this.state.days[index];
        if (!day) return;
        day.checked = !day.checked;
        this.setState({days: this.state.days});
    }

    goToNext = () => {
        let days = this.state.days;
        let distribute = [];
        for (let i in days) {
            if (days[i].checked) distribute.push(i*1+1);
        }
        if (distribute.length == 0) {
            global.toastShow('请选择训练日');
            return;
        }
        global.config.planInfo.distribute = distribute;
        this.props.navigation.navigate('SetPlan5', {});
    }

    render() {
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={35} />
                <Heading2>选择训练日</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>根据你的选择，匹配适合你的项目计划</MyText>
                <SpacingView height={36} />
                <View style={styles.rowView}>
                {this.state.days.map((info, index) => (
                    <TouchableOpacity activeOpacity={1} onPress={this.checkDay.bind(this, index)} style={[styles.view, info.checked && styles.checkView]}>
                        <MyText style={[styles.text, info.checked && styles.checkText]}>{info.title}</MyText>
                    </TouchableOpacity>
                ))}
                </View>
                <SpacingView height={209} />
                <BtnCell value={'下一步'} onPress={this.goToNext} style={commonStyle.setBtn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    rowView: {
        width: ScreenUtil.screenW,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingLeft: ScreenUtil.screenW / 2 - 160,
        // paddingRight: 20,
    },
    view: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: color.paper,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
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
