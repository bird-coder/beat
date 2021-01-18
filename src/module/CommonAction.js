import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText} from '../module/Text';
import SpacingView from './SpacingView';

class CommonAction extends PureComponent {
    static defaultProps = {
        showCancel: true,
    }

    static propTypes = {
        confirm: PropTypes.func.isRequired,
        list: PropTypes.arrayOf(PropTypes.string).isRequired,
        showCancel: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    returnComment = (index) => {
        let that = this;
        global.toastHide(() => {
            if (that.props.confirm) that.props.confirm(index);
        });
    }

    cancelAction = () => {
        global.toastHide();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.actionsView}>
                {this.props.list.map((info, index) => (
                    <TouchableOpacity style={[styles.item, index > 0 ? styles.actionItem : {}]} activeOpacity={0.8} key={index} onPress={this.returnComment.bind(this, index)}>
                        <MyText style={styles.text}>{info}</MyText>
                    </TouchableOpacity>
                ))}
                </View>
                {this.props.showCancel && <>
                <SpacingView height={8} />
                <TouchableOpacity style={[styles.item, styles.cancelItem]} activeOpacity={0.8} onPress={this.cancelAction}>
                    <MyText style={styles.text}>取消</MyText>
                </TouchableOpacity>
                </>}
                {ScreenUtil.isIphoneX() && <SpacingView height={ScreenUtil.SAFE_BOTTOM_HEIGHT} color={color.white} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.paper,
    },
    actionsView: {
        backgroundColor: color.white,
        paddingLeft: 12,
        paddingRight: 12,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    actionItem: {
        borderTopColor: color.placeholder,
        borderTopWidth: ScreenUtil.onePixel * 1,
    },
    cancelItem: {
        backgroundColor: color.white,
    },
    text: {
        fontSize: 14,
    },
});

export default CommonAction;
