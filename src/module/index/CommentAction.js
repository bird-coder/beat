import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../common/color';
import ScreenUtil from '../../utils/ScreenUtil';

import {MyText} from '../Text';
import SpacingView from '../SpacingView';

class CommentAction extends PureComponent {
    static propTypes = {
        confirm: PropTypes.func.isRequired,
        list: PropTypes.arrayOf(PropTypes.string).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    returnComment = (index) => {
        let that = this;
        global.toastHide().then((res) => {
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
                <SpacingView height={10} />
                <TouchableOpacity style={[styles.item, styles.cancelItem]} activeOpacity={0.8} onPress={this.cancelAction}>
                    <MyText style={[styles.text, styles.cancel]}>取消</MyText>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    actionsView: {
        borderRadius: 10,
        backgroundColor: color.paper,
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
        borderRadius: 10,
    },
    text: {
        fontSize: 18,
        color: color.darkblue,
    },
    cancel: {
        fontWeight: 'bold',
    },
});

export default CommentAction;
