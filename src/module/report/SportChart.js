import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import color from '../../common/color';
import commonStyle from '../../common/style';

import {MyText} from '../../module/Text';
import SpacingView from '../SpacingView';

class SportChart extends PureComponent {
    static defaultProps = {
        list: (new Array(12)).fill(0.5),
    }

    static propTypes = {
        list: PropTypes.arrayOf(PropTypes.number),
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    renderLine = (height, index) => {
        let style = {};
        if (height) style.height = height * 100 + '%';
        let text = null;
        if (index % 2 == 0) text = <MyText style={styles.text}>{index + 1}</MyText>;
        return (
            <View>
                <View style={styles.lineView}>
                    <LinearGradient colors={[color.gradient, color.primary]} start={{x:0, y:0}} end={{x:0, y:1}} style={[styles.linear, style]}/>
                </View>
                <SpacingView height={3} />
                {text}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.list.length > 0 && this.props.list.map((info, index) => (
                    this.renderLine(info, index)
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 90,
    },
    lineView: {
        width: 8,
        height: '100%',
        borderRadius: 4,
        backgroundColor: color.paper,
        justifyContent: 'flex-end',
        marginRight: 7,
    },
    linear: {
        height: 0,
        width: '100%',
        borderRadius: 4,
    },
    text: {
        fontSize: 9,
        lineHeight: 11,
    },
});

export default SportChart;
