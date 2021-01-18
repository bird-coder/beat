import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/RNIMigration';
import {withNavigation} from 'react-navigation';

import color from '../common/color';

class BackBtn extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        style: PropTypes.object,
    }

    constructor(props) {
        super(props);

    }

    goBack = () => {
        if (this.props.onPress) this.props.onPress();
        else this.props.navigation.goBack();
    }

    render() {
        return (
            <Icon name={'simpleline|arrow-left'} size={16} style={[styles.back, this.props.style]} onPress={this.goBack} />
        );
    }
}

const styles = StyleSheet.create({
    back: {
        color: color.black,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 20,
        marginBottom: -13,
    },
});

export default withNavigation(BackBtn);
