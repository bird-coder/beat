import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import color from '../common/color';

import {MyText} from '../module/Text';

class ProgressBar extends PureComponent {
    static propTypes = {
        width: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let style = {};
        if (this.props.width) style.width = this.props.width * 100 + '%';
        return (
            <View style={styles.container}>
                <LinearGradient colors={[color.primary, color.gradient]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.linear, style]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        backgroundColor: color.paper,
    },
    linear: {
        height: '100%',
        width: 0,
        borderRadius: 4,
        // borderTopLeftRadius: 4,
        // borderBottomLeftRadius: 4,
    },
});

export default ProgressBar;
