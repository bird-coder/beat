import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, InteractionManager} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import color from '../common/color';
import commonStyle from '../common/style';
import ScreenUtil from '../utils/ScreenUtil';

import SpacingView from './SpacingView';
import {Paragraph, MyText} from './Text';

class ToastModal extends Component {
    static defaultProps = {
        showClose: true,
    }

    static propTypes = {
        visible: PropTypes.bool,
        msg: PropTypes.string,
        duration: PropTypes.number,
        type: PropTypes.string,
        callback: PropTypes.func,
        content: PropTypes.element,
        data: PropTypes.object,
        animationIn: PropTypes.string,
        animationOut: PropTypes.string,
        onHide: PropTypes.func,
        showClose: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    showToast = () => {
        let that = this;
        if (this.props.type == 'text') {
            setTimeout(function () {
                global.toastHide(() => {
                    if (that.props.callback) that.props.callback();
                });
            }, that.props.duration);
        }
    };

    closeToast = () => {
        global.toastHide();
    };

    hideToast = () => {
        if (['drawer', 'actionSheet'].indexOf(this.props.type) != -1) {
            global.toastHide();
        }
    };

    confirm = (bool) => {
        let that = this;
        global.toastHide().then((res) => {
            if (that.props.callback) that.props.callback(bool);
        });
    };

    onModalHide = () => {
        if (this.props.onHide) this.props.onHide();
    }

    render() {
        let content;
        switch (this.props.type) {
            case 'text':
                content = (
                    <View style={styles.content}>
                        <MyText style={styles.text}>{this.props.msg}</MyText>
                    </View>
                ); break;
            case 'loading':
                content = (
                    <View style={styles.content}>
                        <ActivityIndicator size="large" color={color.paper} />
                        <MyText style={styles.text}>{this.props.msg}</MyText>
                    </View>
                ); break;
            case 'content':
                content = (
                    <View style={styles.element}>
                        {this.props.showClose && <Icon name={'ios-close'} size={35} style={styles.close} onPress={this.closeToast} />}
                        {this.props.content}
                    </View>
                ); break;
            case 'action':
                content = (
                    <View style={styles.action}>
                        <Icon name={'ios-close'} size={35} style={styles.close} onPress={this.closeToast} />
                        {this.props.content}
                    </View>
                ); break;
            case 'actionSheet':
                content = (
                    <View style={styles.actionSheet}>
                        {this.props.content}
                    </View>
                ); break;
            case 'drawer':
                content = (
                    <View style={styles.drawer}>
                        {this.props.content}
                    </View>
                ); break;
            case 'alert':
                content = (
                    <View style={styles.alertView}>
                        <View style={styles.alertContent}>
                            <MyText style={styles.alertTitle}>{this.props.data.title}</MyText>
                            {this.props.data.content.length > 0 && <SpacingView height={22} />}
                            {this.props.data.content.length > 0 && <Paragraph>{this.props.data.content}</Paragraph>}
                        </View>
                        <SpacingView height={12}/>
                        <View style={commonStyle.rowView}>
                            {this.props.data.cancelText.length > 0 && <Paragraph style={[styles.btn, styles.cancelBtn]} onPress={this.confirm.bind(this, false)}>{this.props.data.cancelText}</Paragraph>}
                            <View style={styles.okView}><Paragraph style={[styles.btn, styles.okBtn]} onPress={this.confirm.bind(this, true)}>{this.props.data.okText}</Paragraph></View>
                        </View>
                        <SpacingView height={13}/>
                    </View>
                ); break;
            case 'image':
                content = (
                    <View style={commonStyle.fillView}>
                        {this.props.content}
                    </View>
                ); break;
            case 'page':
                content = (
                    <View style={commonStyle.fillView}>
                        {this.props.content}
                    </View>
                ); break;
        }

        return (
            <Modal animationIn={this.props.animationIn}
                   animationOut={this.props.animationOut}
                   isVisible={this.props.visible}
                   backdropColor={color.black}
                   backdropOpacity={0.3}
                   onBackdropPress={this.hideToast}
                   onModalShow={this.showToast}
                   onModalHide={this.onModalHide}
                   deviceWidth={ScreenUtil.screenW}
                   deviceHeight={ScreenUtil.screenH}
                   useNativeDriver={true}
                   hideModalContentWhileAnimating={true}
                   propagateSwipe={false}
                   supportedOrientations={['portrait', 'landscape']}
                   style={styles.modal}>
                {content}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 15,
        backgroundColor: color.toast,
        borderRadius: 5,
    },
    text: {
        color: color.paper,
    },
    element: {
        // padding: 25,
        backgroundColor: color.white,
        borderRadius: 4,
        width: ScreenUtil.screenW * 0.8,
        minHeight: 100,
    },
    action: {
        padding: 25,
        backgroundColor: color.white,
        borderRadius: 5,
        width: ScreenUtil.screenW,
        minHeight: ScreenUtil.screenH * 0.5,
        position: 'absolute',
        bottom: -5,
    },
    actionSheet: {
        position: 'absolute',
        width: ScreenUtil.screenW,
        // padding: 10,
        bottom: 0,
    },
    drawer: {
        backgroundColor: color.white,
        width: ScreenUtil.screenW * 0.8,
        height: ScreenUtil.screenH,
        position: 'absolute',
        left: 0,
    },
    close: {
        position: 'absolute',
        top: 0,
        right: 12,
        color: color.gray,
    },
    alertView: {
        backgroundColor: color.white,
        borderRadius: 4,
        width: ScreenUtil.screenW * 0.8,
    },
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
});

export default ToastModal;
