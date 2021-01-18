import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

import api from '../common/api';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';

class PicCell extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func,
        icon: PropTypes.any.isRequired,
        style: ViewPropTypes.style,
    }

    render() {
        let icon = this.props.icon;
        if (typeof icon == 'string') {
            if (icon.indexOf('://') == -1) {
                icon = icon.length > 0 ? {uri: api.cdn + icon} : ImageResources.no_pic;
            } else {
                icon = {uri: icon};
            }
        }
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress} activeOpacity={0.8}>
                <Image source={icon} resizeMode={'cover'} style={[styles.icon, this.props.style]} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: ScreenUtil.screenW / 6,
        height: ScreenUtil.screenH / 6,
    },
});

export default PicCell;
