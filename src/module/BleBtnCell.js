import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText} from '../module/Text';

class BleBtnCell extends PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(['disable', 'visible', 'found', 'searching', 'connected']),
        onPress: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let disabled = this.props.type == 'searching';
        let img = ImageResources.ble_disable;
        switch (this.props.type) {
            case 'disable': img = ImageResources.ble_disable; break;
            case 'visible': img = ImageResources.ble_visible; break;
            case 'searching': img = ImageResources.ble_search; break;
            case 'found': img = ImageResources.ble_found; break;
            case 'connected': img = ImageResources.ble_connect; break;
        }
        return (
            <TouchableOpacity disabled={disabled} activeOpacity={1} style={styles.container} onPress={this.props.onPress}>
                <Image source={img} resizeMode={'stretch'} style={styles.pic}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 70 + ScreenUtil.SAFE_BOTTOM_HEIGHT,
        right: 10,
        zIndex: 10,
        // backgroundColor: color.disabled,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pic: {
        width: 74,
        height: 74,
        borderRadius: 37,
    },
});

export default BleBtnCell;
