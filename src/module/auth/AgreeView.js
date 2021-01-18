import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/RNIMigration';
import PropTypes from 'prop-types';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText, Paragraph} from '../../module/Text';
import BtnCell from '../BtnCell';
import SpacingView from '../SpacingView';

class AgreeView extends PureComponent {
    static propTypes = {
        callback: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            agree: false,
        };
    }

    toggleCheck = () => {
        this.setState({agree: !this.state.agree});
    }

    goToAgreement = () => {
        this.props.navigation.navigate('Agreement', {});
    }

    goToPrivacy = () => {
        this.props.navigation.navigate('Privacy', {});
    }

    confirm = () => {
        if (this.props.callback) this.props.callback(this.state.agree);
    }

    render() {
        return (
            <View style={styles.container}>
                <Heading>用户使用条款</Heading>
                <SpacingView />
                <Paragraph>       为了保证您能正常使用BeatX服务，也为了创造更健康的网络环境，请您阅读并同意以下条款。</Paragraph>
                <SpacingView />
                <TouchableOpacity activeOpacity={1} style={commonStyle.rowView} onPress={this.toggleCheck}>
                    {!this.state.agree && <View style={styles.checkbox} />}
                    {this.state.agree && <Icon name={'ion|checkmark-circle'} color={color.primary} size={16} />}
                    <MyText style={styles.agreement}>我已阅读并同意BeatX <MyText style={styles.a} onPress={this.goToAgreement}>用户协议</MyText> 和 <MyText style={styles.a} onPress={this.goToPrivacy}>隐私政策</MyText></MyText>
                </TouchableOpacity>
                <SpacingView height={25} />
                <BtnCell value={'确定'} onPress={this.confirm} disabled={!this.state.agree} style={styles.btn} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW * 0.7,
        // height: ScreenUtil.screenH * 0.5,
        padding: 25,
        alignItems: 'center',
        backgroundColor: color.white,
        borderRadius: 5,
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: color.info,
    },
    agreement: {
        fontSize: 11,
        color: color.info,
        marginLeft: 5,
    },
    a: {
        color: color.primary,
        fontSize: 11,
    },
    btn: {
        width: ScreenUtil.screenW * 0.4,
        height: 40,
    },
});

export default withNavigation(AgreeView);
