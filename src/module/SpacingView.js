import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

class SpacingView extends PureComponent {
    static propTypes = {
        height: PropTypes.number,
        color: PropTypes.string,
    };

    render() {
        let outStyle = {};
        if (this.props.height) outStyle.height = this.props.height;
        if (this.props.color) outStyle.backgroundColor = this.props.color;
        return (
            <View style={[styles.container, outStyle]} />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 14,
        backgroundColor: 'transparent',
    }
});

export default SpacingView;
