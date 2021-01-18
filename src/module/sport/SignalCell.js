import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../common/color';

import {MyText} from '../../module/Text';

class SignalCell extends PureComponent {
    static propTypes = {
        style: PropTypes.object,
        num: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let style = {};
        style.signal1 = {};
        style.signal2 = {height: '50%'};
        style.signal3 = {height: '75%'};
        style.signal4 = {height: '100%'};
        for (let i = 1; i <= this.props.num; i++) {
            style['signal' + i].backgroundColor = color.blue;
        }
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={[styles.signal, style.signal1]} />
                <View style={[styles.signal, style.signal2]} />
                <View style={[styles.signal, style.signal3]} />
                <View style={[styles.signal, style.signal4]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    signal: {
        width: '20%',
        height: '25%',
        backgroundColor: color.gray,
    },
});

export default SignalCell;
