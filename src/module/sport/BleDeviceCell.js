import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../common/color';
import commonStyle from '../../common/style';
import BaseUtil from '../../utils/BaseUtil';

import {MyText} from '../../module/Text';
import SignalCell from './SignalCell';

class BleDeviceCell extends PureComponent {
    static propTypes = {
        device: PropTypes.object.isRequired,
        onPress: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let num = BaseUtil.getBleSignal(this.props.device.rssi);
        return (
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <MyText style={styles.title}>{this.props.device.name}</MyText>
                </View>
                <View style={commonStyle.fillView} />
                <SignalCell num={num} style={styles.signalItem} />
                <TouchableOpacity activeOpacity={1} onPress={this.props.onPress} style={styles.btn}>
                    <MyText style={styles.btnText}>连接</MyText>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: color.disabled,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    titleView: {
        backgroundColor: color.textBackdrop,
        padding: 5,
    },
    title: {
        fontSize: 20,
        color: color.white,
        fontWeight: 'bold',
    },
    signalItem: {
        width: 25,
        height: 20,
    },
    btn: {
        alignItems: 'center',
        backgroundColor: color.primary,
        borderRadius: 5,
        padding: 5,
        width: 100,
        marginLeft: 10,
    },
    btnText: {
        color: color.white,
    },
});

export default BleDeviceCell;
