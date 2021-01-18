import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Picker from 'react-native-picker';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText} from '../module/Text';

const pickerOptions = {
    pickerBg: [255,255,255,1],
    pickerToolBarBg: [255,255,255,1],
    pickerTitleText: '请选择',
    pickerTitleColor: [51,51,51,1],
    pickerCancelBtnColor: [102,102,102,1],
    pickerConfirmBtnColor: [255,128,0,1],
    pickerCancelBtnText: '取消',
    pickerConfirmBtnText: '确定',
    pickerFontColor: [51,51,51,1],
    pickerRowHeight: 29,
    pickerData: [
        [1,2,3,4],
    ],
    selectedValue: [1],
};

class PickerView extends Component {
    static propTypes = {
        isShow: PropTypes.bool,
        options: PropTypes.object,
        onHide: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillUnmount(): void {
        Picker.hide();
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        let that = this;
        if (nextProps.isShow) {
            Picker.init(Object.assign(pickerOptions, {
                onPickerConfirm: that.handlePicker,
                onPickerCancel: that.handlePicker,
            }, that.props.options));
            Picker.show();
        }
        return true;
    }

    handlePicker = (item: any[]) => {
        console.log('picker 事件', item);
        if (this.props.onHide) this.props.onHide();
    }

    hideComponent = () => {
        Picker.isPickerShow((state) => {
            if (state) Picker.hide();
        });
        if (this.props.onHide) this.props.onHide();
    }

    render() {
        return (
            <>
                {this.props.isShow && <TouchableOpacity activeOpacity={1} onPress={this.hideComponent} style={styles.container} />}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        position: 'absolute',
        left: 0,
        top: -ScreenUtil.HEADER_HEIGHT,
        backgroundColor: color.backdrop,
    },
});

export default PickerView;
