import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import api from '../common/api';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';

class AvatarCell extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func,
        icon: PropTypes.oneOfType([PropTypes.string]).isRequired,
        style: ViewPropTypes.style,
        vip: PropTypes.oneOf([0, 1]),
        big: PropTypes.bool,
    }

    render() {
        let file = api.cdn + this.props.icon;
        let avatar;
        if (typeof this.props.icon === 'string') {
            if (this.props.icon.indexOf('://') != -1) file = this.props.icon;
            avatar = this.props.icon.length > 0 ? {uri: file} : ImageResources.user;
        } else {
            avatar = ImageResources.user;
        }
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress} activeOpacity={0.8}>
                <FastImage source={avatar} resizeMode={'cover'} resizeMethod={'resize'} style={[styles.icon, this.props.style]} />
                {this.props.vip == 1 && <Image source={require('../img/vip.jpg')} resizeMode={'cover'} style={[styles.vip, this.props.big && styles.vip2]} />}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    icon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
    },
    vip: {
        width: 15,
        height: 15,
        position: 'absolute',
        right: 0,
        top: 30,
    },
    vip2: {
        width: 20,
        height: 20,
        right: 5,
        bottom: 5,
        top: null,
    },
});

export default AvatarCell;
