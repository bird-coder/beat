import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, requireNativeComponent} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';

import {MyText} from '../module/Text';

let NativeAppleView;

class AppleAuthCell extends PureComponent {
    static defaultProps = {
        checked: false,
    }

    static propTypes = {
        onPress: PropTypes.func.isRequired,
        checked: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    appleAuth = (info) => {
        if (info.nativeEvent.success) {
            console.log('apple登录', info.nativeEvent.success);
            if (this.props.onPress) this.props.onPress(info.nativeEvent.success);
        } else if (info.nativeEvent.error) {
            global.toastShow(info.nativeEvent.error);
        }
    }

    uncheck = () => {
        if (this.props.onPress) this.props.onPress(false);
    }

    render() {
        return (
            <>
                {!this.props.checked && <NativeAppleView onClick={this.appleAuth}>
                    {this.props.children}
                </NativeAppleView>}
                {this.props.checked && <TouchableOpacity activeOpaicty={1} onPress={this.uncheck}>
                    {this.props.children}
                </TouchableOpacity>}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});

NativeAppleView = requireNativeComponent('SignWithApple', AppleAuthCell);

export default AppleAuthCell;
