import React, {PureComponent} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText, Paragraph} from '../module/Text';
import SpacingView from './SpacingView';

class NoDataView extends PureComponent {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <View style={styles.noData}>
                <Image source={ImageResources.no_data} style={styles.noDataImg} resizeMode={'stretch'} />
                <Paragraph style={styles.noDataText}>暂无数据！</Paragraph>
            </View>
        );
    }
}

class NoDataView2 extends PureComponent {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <View style={styles.noData2}>
                <Image source={ImageResources.no_data} style={styles.noDataImg} resizeMode={'stretch'} />
                <Paragraph style={styles.noDataText}>暂无数据！</Paragraph>
            </View>
        );
    }
}

class NoMoreView extends PureComponent {
    static propTypes = {
        more: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <>
                {!this.props.more && <View style={styles.noMore}>
                    <View style={styles.line}/>
                    <MyText style={styles.noMoreText}>没有更多内容</MyText>
                    <View style={styles.line}/>
                </View>}
                <SpacingView height={ScreenUtil.isIphoneX() ? 34 : 0} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    noData: {
        alignItems: 'center',
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        paddingTop: ScreenUtil.screenH * 0.2,
    },
    noData2: {
        alignItems: 'center',
        width: ScreenUtil.screenW,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: color.white,
    },
    noDataImg: {
        width: 175,
        height: 140,
    },
    noDataText: {
        color: color.gray,
        marginTop: 12,
    },
    noMore: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    noMoreText: {
        color: color.gray,
        fontSize: 13,
        marginLeft: 9,
        marginRight: 9,
    },
    line: {
        height: ScreenUtil.onePixel,
        width: 45,
        backgroundColor: color.border,
    },
});

module.exports = {
    NoDataView,
    NoDataView2,
    NoMoreView,
};
