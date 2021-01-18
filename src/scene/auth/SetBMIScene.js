import React, {PureComponent} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';
import BaseUtil from '../../utils/BaseUtil';
import StorageUtil from '../../utils/StorageUtil';

import {MyText, Paragraph} from '../../module/Text';
import BtnCell from '../../module/BtnCell';
import SpacingView from '../../module/SpacingView';

export default class SetBMIScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => {},
    });

    constructor(props) {
        super(props);

        let user = global.config.user;
        let bmi = '0.0';
        let index = 0;
        if (user && user.height > 0 && user.weight > 0) {
            let h = user.height / 100;
            bmi = Math.round(user.weight / (h * h) * 10) / 10;
            index = BaseUtil.getBMIInfo(bmi);
        }
        this.index = index;
        this.state = {
            bmi: bmi,
            items1: [
                {color: color.blue, key: '偏瘦'},
                {color: color.green, key: '正常'},
                {color: color.gradient, key: '偏胖'},
                {color: color.orange, key: '轻度肥胖'},
                {color: color.orange, key: '中度肥胖'},
                {color: color.orange, key: '重度肥胖'},
            ],
            // items2: [
            //     {color: color.orange, key: '轻度肥胖'},
            //     {color: color.orange, key: '中度肥胖'},
            //     {color: color.orange, key: '重度肥胖'},
            // ],
        };
    }

    goToNext = () => {
        StorageUtil.set('userInfo', global.config.user);
        this.props.navigation.replace('Tab', {});
    }

    renderItem = (color, key) => {
        let style = {backgroundColor: color};
        return (
            <View style={[commonStyle.rowView, styles.itemView]}>
                <View style={[styles.item, style]}/>
                <MyText>{key}</MyText>
            </View>
        );
    }

    render() {
        let textStyle = null;
        let key = '未知';
        let item = this.state.items1[this.index];
        if (item) {
            textStyle = {color: item.color};
            key = item.key;
        }
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={46} />
                <ImageBackground source={ImageResources.bmi} resizeMode={'stretch'} style={styles.pic}>
                    <SpacingView height={55} />
                    <MyText style={styles.subtitle}>BMI</MyText>
                    <SpacingView height={13} />
                    <MyText style={[styles.title, textStyle]}>{this.state.bmi}</MyText>
                    <SpacingView height={11} />
                    <MyText style={styles.subtitle}>{key}</MyText>
                    <Paragraph style={styles.min}>12</Paragraph>
                    <Paragraph style={styles.max}>42</Paragraph>
                </ImageBackground>
                <SpacingView height={28} />
                <View style={[commonStyle.rowView, styles.infoView]}>
                    {this.state.items1.map((info, index) => (
                        this.renderItem(info.color, info.key)
                    ))}
                </View>
                {/*<View style={commonStyle.rowView}>*/}
                {/*    {this.state.items2.map((info, index) => (*/}
                {/*        this.renderItem(info.color, info.key)*/}
                {/*    ))}*/}
                {/*</View>*/}
                <SpacingView height={42} />
                <BtnCell value={'进入'+global.config.appName} onPress={this.goToNext} disabled={this.state.disabled} style={commonStyle.setBtn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    pic: {
        width: 242,
        height: 234,
        alignItems: 'center',
    },
    infoView: {
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: 275,
    },
    itemView: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
    },
    item: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 2,
    },
    title: {
        fontSize: 40,
        lineHeight: 47,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
    },
    min: {
        position: 'absolute',
        bottom: -4,
        left: 87,
        color: color.blue,
    },
    max: {
        position: 'absolute',
        bottom: -4,
        right: 79,
        color: color.orange,
    },
});
