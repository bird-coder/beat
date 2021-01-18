import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';

import {MyText, Paragraph} from '../../module/Text';
import ScreenUtil from '../../utils/ScreenUtil';
import InputFrame from '../InputFrame';
import CodeCell from '../CodeCell';
import SmallBtnCell from '../SmallBtnCell';

class ProfileCell extends PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        placeholder: PropTypes.string,
        onValueChange: PropTypes.func,
        disabled: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        border: PropTypes.bool,
        phone: PropTypes.number,
        maxLength: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let style = {};
        if (this.props.style) style = this.props.style;
        if (this.props.border) style = [style, styles.border];
        let frame = null;
        if (this.props.name == 'code') {
            frame = <View style={styles.codeView}>
                <CodeCell style={styles.code} textStyle={styles.codeText} url={api.sendCode} phone={this.props.phone} />
            </View>;
        }
        return (
            <View style={[styles.container, style]}>
                <Paragraph>{this.props.title}</Paragraph>
                <View style={commonStyle.fillView}/>
                <View style={commonStyle.rowView}>
                    <InputFrame name={this.props.name} placeholder={this.props.placeholder}
                                type={this.props.type} onValueChange={this.props.onValueChange}
                                disabled={this.props.disabled} value={this.props.value}
                                style={styles.input} maxLength={this.props.maxLength} />
                    {frame}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingTop: 15,
        // paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    input: {
        width: ScreenUtil.screenW - 110,
        borderWidth: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
    },
    codeView: {
        width: 110,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        zIndex: 5,
    },
    code: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 110,
        height: 24,
        padding: 0,
        // paddingLeft: 10,
        // paddingRight: 10,
        borderRadius: 12,
        backgroundColor: color.primary,
    },
    codeText: {
        fontSize: 12,
        color: color.white,
    },
    border: {
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
    },
});

export default ProfileCell;
