import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText} from './Text';
import SmallBtnCell from './SmallBtnCell';

class FollowCell extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        follow: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            follow: props.follow || false,
        };
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (nextProps.follow != this.props.follow) {
            this.setState({follow: nextProps.follow});
            return true;
        }
        if (nextState.follow != this.state.follow) {
            return true;
        }
        return false;
    }

    switchFollow = () => {
        let that = this;
        if (this.state.follow) {
            global.toastAlert('确定不再关注此人？', '', '', '', (res) => {
                if (res) {
                    if (that.props.onPress) that.props.onPress();
                    else that.setState({follow: !that.state.follow});
                }
            });
        } else {
            if (that.props.onPress) that.props.onPress();
            else that.setState({follow: !that.state.follow});
        }
    }

    render() {
        let text = this.state.follow ? '已关注' : '+关注';
        return (
            <SmallBtnCell value={text} isClean={this.state.follow} onPress={this.switchFollow} />
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
});

export default FollowCell;
