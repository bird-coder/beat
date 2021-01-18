import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import commonStyle from '../common/style';
import ImageResources from '../common/image';

import {Heading3, MyText} from '../module/Text';
import ScreenUtil from '../utils/ScreenUtil';

class TurnCheckCell extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        onPress: PropTypes.func,
        style: PropTypes.object,
        border: PropTypes.bool,
        checked: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: props.checked || false,
        };
    }

    render() {
        let img = this.props.checked ? ImageResources.switch_on : ImageResources.switch_off;
        let style = {};
        if (this.props.style) style = this.props.style;
        if (this.props.border) style = [style, styles.border];
        return (
            <View style={[styles.container, style]}>
                <Heading3 numberOfLines={1}>{this.props.title}</Heading3>
                <View style={commonStyle.fillView} />
                <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
                    <Image source={img} resizeMode={'stretch'} style={styles.btn} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    border: {
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
    },
    btn: {
        width: 44,
        height: 22,
    },
});

export default TurnCheckCell;
