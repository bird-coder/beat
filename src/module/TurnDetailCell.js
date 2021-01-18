import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../common/color';
import commonStyle from '../common/style';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText} from './Text';

class TurnDetailCell extends PureComponent {
    static defaultProps = {
        showDetail: true,
    }

    static propTypes = {
        title: PropTypes.string,
        subtitle: PropTypes.string,
        onPress: PropTypes.func,
        style: PropTypes.object,
        textStyle: PropTypes.object,
        border: PropTypes.bool,
        avatar: PropTypes.any,
        icon: PropTypes.string,
        iconPic: PropTypes.any,
        picStyle: PropTypes.object,
        isMark: PropTypes.bool,
        showDetail: PropTypes.bool,
    }

    render() {
        let img = this.props.avatar && <Image source={this.props.avatar} style={styles.avatar} resizeMode={'cover'} />;
        let icon = this.props.icon && <Icon name={this.props.icon} size={16} color={color.black} style={styles.icon} />;
        let iconPic = this.props.iconPic && <Image source={this.props.iconPic} style={[styles.iconPic, this.props.picStyle]} resizeMode={'stretch'} />;
        let text = null;
        if (this.props.subtitle) {
            let textStyle = null;
            if (this.props.isMark) textStyle = {color: color.primary};
            if (this.props.textStyle) textStyle = this.props.textStyle;
            text = <MyText style={[styles.subtitle, textStyle]}>{this.props.subtitle}</MyText>;
        }
        let style = {};
        if (this.props.style) style = this.props.style;
        if (this.props.border) style = [style, styles.border];
        let arrow = this.props.showDetail && <Icon name={'simpleline|arrow-right'} size={12} style={styles.arrow} />;
        return (
            <TouchableOpacity activeOpacity={0.8} style={[styles.container, style]} onPress={this.props.onPress}>
                {icon}
                {iconPic}
                <MyText style={styles.title} numberOfLines={1}>{this.props.title}</MyText>
                <View style={commonStyle.fillView} />
                {text}
                {img}
                {arrow}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingLeft: 13,
        // paddingRight: 13,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    border: {
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
    },
    title: {
        fontSize: 15,
    },
    subtitle: {
        fontSize: 15,
        color: color.info,
    },
    arrow: {
        marginLeft: 10,
        color: color.gray,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    icon: {
        marginRight: 8,
    },
    iconPic: {
        width: 38,
        height: 38,
        marginRight: 14,
    },
});

export default TurnDetailCell;
