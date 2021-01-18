import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';

import {Paragraph} from '../module/Text';
import SpacingView from './SpacingView';

class SwitchTabCell extends PureComponent {
    static propTypes = {
        index: PropTypes.number.isRequired,
        onPress: PropTypes.func.isRequired,
        list: PropTypes.arrayOf(PropTypes.string).isRequired,
        style: PropTypes.object,
        color: PropTypes.string,
    }

    render() {
        let textStyle = styles.selectText;
        let borderStyle = {};
        if (this.props.color) {
            textStyle = [styles.selectText, {color: this.props.color}];
            borderStyle = {backgroundColor: this.props.color};
        }
        return (
            <View style={[styles.container, this.props.style]}>
                {this.props.list.map((info, index) => (
                    <TouchableOpacity activeOpacity={1} style={styles.view} key={index} onPress={() => this.props.onPress(index)}>
                        <View style={styles.item}>
                            <Paragraph style={[styles.text, this.props.index == index && textStyle]}>{info}</Paragraph>
                            <SpacingView height={5} />
                            {this.props.index == index && <View style={[styles.borderView, borderStyle]}/>}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        paddingTop: 15,
        paddingBottom: 0,
        width: '100%',
        borderBottomColor: color.paper,
        borderBottomWidth: ScreenUtil.onePixel,
    },
    view: {
        flex: 1,
        alignItems: 'center',
    },
    item: {
        alignItems: 'center',
    },
    text: {
        fontSize: 15,
        color: color.gray,
    },
    selectText: {
        color: color.primary,
        fontWeight: 'bold',
    },
    borderView: {
        height: 4,
        width: 50,
        backgroundColor: color.primary,
        borderRadius: 2,
    },
});

export default SwitchTabCell;
