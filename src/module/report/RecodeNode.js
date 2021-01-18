import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading3, MyText, Paragraph} from '../../module/Text';
import SpacingView from '../SpacingView';
import InputFrame from '../InputFrame';

class RecodeNode extends PureComponent {
    static defaultProps = {
        okText: '确定',
        cancelText: '取消',
        val: '50',
    }

    static propTypes = {
        title: PropTypes.string,
        unit: PropTypes.string,
        okText: PropTypes.string,
        cancelText: PropTypes.string,
        onPress: PropTypes.func,
        val: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            val: props.val || '50',
        };
    }

    confirm = (bool) => {
        let that = this;
        global.toastHide().then(function () {
            if (that.props.onPress) {
                if (bool) that.props.onPress(that.state.val);
                else that.props.onPress(bool);
            }
        });
    }

    _getData = (text, name) => {
        if (name == 'record') this.setState({val: text});
    }

    render() {
        return (
            <>
                <View style={styles.alertContent}>
                    <MyText style={styles.alertTitle}>{this.props.title}</MyText>
                    <SpacingView height={45} />
                    <View style={styles.inputView}>
                        <InputFrame style={styles.input} textColor={color.text} name={'record'} type={'number'} maxLength={5} onValueChange={this._getData} placeholder={this.props.val} />
                        <Heading3>{this.props.unit}</Heading3>
                    </View>
                    <SpacingView height={50} />
                </View>
                <SpacingView height={12}/>
                <View style={commonStyle.rowView}>
                    {this.props.cancelText.length > 0 && <Paragraph style={[styles.btn, styles.cancelBtn]} onPress={this.confirm.bind(this, false)}>{this.props.cancelText}</Paragraph>}
                    <View style={styles.okView}><Paragraph style={[styles.btn, styles.okBtn]} onPress={this.confirm.bind(this, true)}>{this.props.okText}</Paragraph></View>
                </View>
                <SpacingView height={13}/>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    alertContent: {
        alignItems: 'center',
        padding: 32,
        borderBottomWidth: ScreenUtil.onePixel * 1,
        borderBottomColor: color.border,
    },
    alertTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold',
    },
    btn: {
        textAlign: 'center',
    },
    cancelBtn: {
        width: '50%',
        borderRightColor: color.border,
        borderRightWidth: ScreenUtil.onePixel * 2,
    },
    okBtn: {
        color: color.primary,
        fontWeight: 'bold',
    },
    okView: {
        flex: 1,
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    input: {
        width: 67,
        height: 30,
        borderWidth: 0,
        borderBottomWidth: 1,
        fontSize: 24,
        lineHeight: 28,
        padding: 0,
        textAlign: 'center',
        marginRight: 8,
    },
});

export default RecodeNode;
