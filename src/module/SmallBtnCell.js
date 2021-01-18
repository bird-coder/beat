import React, {PureComponent} from 'react';
import {View, StyleSheet, ViewPropTypes, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText} from '../module/Text';

class SmallBtnCell extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func,
        value: PropTypes.string.isRequired,
        style: ViewPropTypes.style,
        textStyle: PropTypes.object,
        isClean: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {};
        this.isCall = false;
    }

    clickBtn = () => {
        let that = this;
        if (!this.isCall) {
            this.isCall = true;
            setTimeout(() => {
                that.isCall = false;
            }, 1000);
            if (this.props.onPress) this.props.onPress();
        }
    }

    render() {
        let style = {};
        let textStyle = null;
        if (this.props.disabled) style.opacity = 0.5;
        else style.opacity = 1;
        if (this.props.isClean) {
            style = [style, styles.cleanView];
            textStyle = styles.cleanText;
        }
        return (
            <TouchableOpacity disabled={this.props.disabled} style={[styles.container, style, this.props.style]} onPress={this.clickBtn} activeOpacity={1}>
                <MyText style={[styles.content, textStyle, this.props.textStyle]}>{this.props.value}</MyText>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 54,
        height: 24,
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 12,
        backgroundColor: color.primary,
    },
    content: {
        fontSize: 12,
        fontWeight: 'bold',
        color: color.white,
    },
    cleanView: {
        borderColor: color.primary,
        borderWidth: ScreenUtil.onePixel * 2,
        backgroundColor: 'transparent',
    },
    cleanText: {
        color: color.primary,
    },
});

export default SmallBtnCell;
