import React, {PureComponent} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';
import StorageUtil from '../utils/StorageUtil';

import {MyText} from './Text';

class HeaderBar extends PureComponent {
    static propTypes = {
        style: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.view = React.createRef();
    }

    setNativeProps = (nativeProps) => {
        this.view.current.setNativeProps(nativeProps);
    }

    render() {
        return (
            <View ref={this.view} style={[styles.container, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ScreenUtil.STATUS_BAR_HEIGHT,
        height: ScreenUtil.HEADER_HEIGHT,
        width: ScreenUtil.screenW,
    },
});

export default HeaderBar;
