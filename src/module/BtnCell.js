import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import color from '../common/color';
import commonStyle from '../common/style';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText} from './Text';

class BtnCell extends PureComponent {
    static defaultProps = {
        gradient: false,
    }

    static propTypes = {
        onPress: PropTypes.func,
        value: PropTypes.string.isRequired,
        style: ViewPropTypes.style,
        width: PropTypes.number,
        textStyle: PropTypes.object,
        disabled: PropTypes.bool,
        gradient: PropTypes.bool,
    }

    constructor(props) {
        super(props);
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
        if (this.props.width > 0 && this.props.width <= 1) style.width = ScreenUtil.screenW * this.props.width;
        if (this.props.disabled) style.opacity = 0.5;
        else style.opacity = 1;
        let content = <MyText style={[styles.content, this.props.textStyle]}>{this.props.value}</MyText>;
        if (this.props.gradient) content = <LinearGradient colors={[color.gradient, color.primary]} start={{x:0, y:0}} end={{x:1, y:0}}>
            <View style={styles.background}>
                <MyText style={[styles.content, this.props.textStyle]}>{this.props.value}</MyText>
            </View>
        </LinearGradient>;
        return (
            <TouchableOpacity disabled={this.props.disabled} style={[styles.container, this.props.style, style]} onPress={this.clickBtn} activeOpacity={1}>
                {content}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenUtil.screenW * 0.85,
        borderRadius: 4,
        backgroundColor: color.primary,
        height: 50,
    },
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenUtil.screenW * 0.85,
        borderRadius: 4,
        height: 50,
    },
    content: {
        fontSize: 18,
        // fontWeight: 'bold',
        color: color.white,
        lineHeight: 25,
    },
});

export default BtnCell;
