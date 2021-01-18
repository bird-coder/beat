import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import api from '../common/api';
import HttpUtil from '../utils/HttpUtil';

import {MyText, Paragraph} from './Text';

class CodeCell extends Component {
    static propTypes = {
        phone: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        url: PropTypes.string.isRequired,
        begin: PropTypes.bool,
        style: PropTypes.object,
        textStyle: PropTypes.object,
        callback: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            begin: false,
            second: 60,
        };
        this.timer = null;
    }

    componentDidMount() {
        if (this.props.begin) {
            this.startTimer();
        }
    }

    stopTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.setState({begin: false, second: 60});
    }

    startTimer = () => {
        this.setState({begin: true});
        let that = this;
        clearInterval(this.timer);
        this.timer = setInterval(function () {
            that.setState({second: that.state.second - 1});
            if (that.state.second < 0) that.stopTimer();
        }, 1000);
        global.toastShow('验证码已发送', () => {
            if (that.props.callback) {
                setTimeout(() => {
                    that.props.callback();
                }, 100);
            }
        });
    }

    _sendCode = () => {
        let that = this;
        if (!this.props.phone || !this.props.phone.isMobile()) return global.toastShow('手机号格式不正确!');
        HttpUtil.post(this.props.url, {phone: this.props.phone}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.startTimer();
            } else {
                return global.toastShow(json.message);
            }
        });
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    render() {
        let title = this.state.begin ? '(' + this.state.second + 's)后重新发送' : '获取验证码';
        let disableStyle = this.state.begin ? {color: color.border} : {};
        return (
            <TouchableOpacity activeOpacity={0.8} style={[styles.container, this.props.style]} disabled={this.state.begin} onPress={this._sendCode}>
                <Paragraph style={[this.props.textStyle, disableStyle]}>{title}</Paragraph>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        padding: 10,
    },
});

export default CodeCell;
