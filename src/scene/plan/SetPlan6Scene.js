import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, DeviceEventEmitter} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';

import {Heading2, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';

export default class SetPlan6Scene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => {},
        headerTitle: () => {},
    });

    constructor(props) {
        super(props);

        this.state = {
            plan: null,
        };
    }

    componentDidMount(): void {
        let params = this.props.navigation.state.params;
        if (!params.plan) return;
        this.setState({plan: params.plan});
    }

    goToDetail = () => {
        if (!this.state.plan) {
            global.toastShow('添加计划失败');
            return;
        }
        DeviceEventEmitter.emit('addPlanCallback');
        this.props.navigation.navigate('PlanDetail', {plan: this.state.plan, from: 'add'});
    }

    render() {
        return (
            <View style={commonStyle.setBody}>
                <SpacingView height={106} />
                <Image source={ImageResources.icon_zan} resizeMode={'stretch'} style={styles.icon}/>
                <SpacingView height={14} />
                <Heading2>恭喜您成功定制训练计划</Heading2>
                <SpacingView height={12} />
                <MyText style={commonStyle.info}>接下来，开始你的锻炼吧！</MyText>
                <SpacingView height={178} />
                <BtnCell value={'进入计划'} onPress={this.goToDetail} style={commonStyle.setBtn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    icon: {
        width: 100,
        height: 100,
    },
});
