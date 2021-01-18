import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';

class InputFrame extends Component {
    static defaultProps = {
        clear: true,
    }

    static propTypes = {
        placeholder: PropTypes.string,
        textColor: PropTypes.string,
        value: PropTypes.any,
        type: PropTypes.string,
        maxLength: PropTypes.number,
        disabled: PropTypes.bool,
        clear: PropTypes.bool,
        style: PropTypes.object,
        onValueChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onSubmit: PropTypes.func,
        onKeyPress: PropTypes.func,
        name: PropTypes.string.isRequired,
        isFocus: PropTypes.bool,
    }

    constructor(props) {
        super(props);

        this.input = React.createRef();
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.props.isFocus != nextProps.isFocus && nextProps.isFocus) {
            this.toggleMsg();
        }
        return true;
    }

    toggleMsg = () => {
        this.input.current.focus();
    }

    _onChangeText = (text) => {
        if (this.props.onValueChange) this.props.onValueChange(text.trim(), this.props.name);
    }

    _onFocus = () => {
        if (this.props.onFocus) this.props.onFocus();
    }

    _onBlur = () => {
        if (this.props.onBlur) this.props.onBlur();
    }

    _onSubmit = () => {
        if (this.props.onSubmit) this.props.onSubmit();
    }

    render() {
        let textStyle = (this.props.type == 'textarea' && global.platform.isAndroid) && {textAlignVertical: 'top'}; //适配android
        return (
            <TextInput style={[styles.input, this.props.style, textStyle]}
                       autoCapitalize={'none'}
                       autoCorrect={false}
                       maxLength={this.props.maxLength || 20}
                       editable={!this.props.disabled}
                       secureTextEntry={this.props.type == 'password'}
                       placeholder={this.props.placeholder}
                       placeholderTextColor={this.props.textColor}
                       defaultValue={this.props.value}
                       keyboardType={this.props.type == 'number' ? 'numeric' : 'default'}
                       multiline={this.props.type == 'textarea'}
                       underlineColorAndroid={'transparent'}
                       clearButtonMode={this.props.clear ? 'while-editing' : 'never'}
                       onSubmitEditing={this._onSubmit}
                       onChangeText={this._onChangeText}
                       onFocus={this._onFocus}
                       onBlur={this._onBlur}
                       onKeyPress={this.props.onKeyPress} ref={this.input} />
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: ScreenUtil.screenW * 0.85,
        borderColor: color.border,
        borderWidth: ScreenUtil.onePixel * 2,
        borderRadius: 4,
        padding: 15,
        fontSize: 14,
        lineHeight: 20,
        backgroundColor: color.inputBg,
        height: 50,
    },
});

export default InputFrame;
