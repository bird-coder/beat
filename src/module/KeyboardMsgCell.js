import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {UnityModule} from '@asmadsen/react-native-unity-view';

import color from '../common/color';
import commonStyle from '../common/style';
import ScreenUtil from '../utils/ScreenUtil';

import InputFrame from './InputFrame';
import {Heading3, MyText} from './Text';

class KeyboardMsgCell extends PureComponent {
    static propTypes = {
        sendComment: PropTypes.func,
        isFocus: PropTypes.bool.isRequired,
        onBlur: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            msg: '',
            isFill: false,
            showMask: false,
            keyboardHeight: 0,
        };
    }

    componentDidMount(): void {
        if (global.platform.isIOS) {
            Keyboard.addListener('keyboardWillShow', this.handleKeyboardShow);
            Keyboard.addListener('keyboardWillHide', this.handleKeyboardHide);
        } else {
            UnityModule.isReady().then((bool) => {
                if (bool) {
                    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
                    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
                }
            });
        }
    }

    componentWillUnmount(): void {
        if (global.platform.isIOS) {
            Keyboard.removeListener('keyboardWillShow', this.handleKeyboardShow);
            Keyboard.removeListener('keyboardWillHide', this.handleKeyboardHide);
        } else {
            UnityModule.isReady().then((bool) => {
                if (bool) {
                    Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShow);
                    Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHide);
                }
            });
        }
    }

    handleKeyboardShow = (e) => {
        let keyboardHeight = e.endCoordinates.height - ScreenUtil.SAFE_BOTTOM_HEIGHT;
        if (global.platform.isAndroid) keyboardHeight += 25;
        this.setState({keyboardHeight: keyboardHeight});
    }

    handleKeyboardHide = () => {
        this.setState({keyboardHeight: 0});
    }

    _getCommentData = (text, name) => {
        switch (name) {
            case 'comment':
                this.state.msg = text;
                break;
        }
        if (this.state.msg.length > 0 && !this.state.isFill) this.setState({isFill: true});
        else if (this.state.msg == '' && this.state.isFill) this.setState({isFill: false});
    }

    _onFocus = () => {
        let that = this;
        setTimeout(function () {
            that.setState({showMask: true});
        }, 100);
    }

    _onBlur = () => {
        this.hideKeyboard();
    }

    hideKeyboard = () => {
        Keyboard.dismiss();
        if (this.state.showMask) this.setState({showMask: false});
        if (this.props.onBlur) this.props.onBlur();
    }

    sendMsg = () => {
        if (!this.state.isFill || this.state.msg == '') {
            global.toastShow('请输入评论内容');
            return;
        }
        console.log(this.state.msg);
        if (this.props.sendComment) {
            this.props.sendComment(this.state.msg).finally(() => {
                this.hideKeyboard();
                this.setState({msg: '', isFill: false});
            });
        }
    }

    render() {
        let style = {paddingBottom: this.state.keyboardHeight + ScreenUtil.SAFE_BOTTOM_HEIGHT + 5};
        return (
            <View style={styles.container}>
                {this.state.showMask && <TouchableOpacity activeOpacity={1} style={styles.mask} onPress={this.hideKeyboard} />}
                <View style={[styles.msgView, style]}>
                    <InputFrame name={'comment'} type={'textarea'} placeholder={'写下你的第一条评论吧'}
                                style={styles.textarea} onValueChange={this._getCommentData} maxLength={300}
                                value={this.state.msg} onFocus={this._onFocus} onBlur={this._onBlur} isFocus={this.props.isFocus} />
                    <Heading3 style={[commonStyle.primary, this.state.isFill ? {} : {opacity: 0.3}]} onPress={this.sendMsg}>发布</Heading3>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    msgView: {
        width: ScreenUtil.screenW,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.white,
        padding: 5,
        paddingBottom: ScreenUtil.SAFE_BOTTOM_HEIGHT + 5,
        borderTopWidth: ScreenUtil.onePixel,
        borderTopColor: color.border,
    },
    textarea: {
        backgroundColor: color.border,
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: global.platform.isIOS ? 10 : 0,
        paddingLeft: 20,
        paddingRight: 20,
        marginLeft: 10,
        marginRight: 15,
        width: ScreenUtil.screenW - 75,
        height: null,
    },
    mask: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        backgroundColor: color.backdrop,
    },
});

export default KeyboardMsgCell;
