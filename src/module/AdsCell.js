import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import NativeAdView, {
    CallToActionView,
    IconView,
    HeadlineView,
    TaglineView,
    AdvertiserView,
    AdBadge,
} from 'react-native-admob-native-ads';

import color from '../common/color';
import commonStyle from '../common/style';

import {MyText} from '../module/Text';
import SpacingView from './SpacingView';

class AdsCell extends PureComponent {
    static defaultProps = {
        adUnitID: 'ca-app-pub-3940256099942544/2934735716',
    }

    static propTypes = {
        adUnitID: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <View style={commonStyle.fillView}>
                <NativeAdView style={styles.adView} adUnitID={this.props.adUnitID}>
                    <View style={styles.subView}>
                        <AdBadge style={styles.badge} textStyle={styles.badgeText}/>
                        <View style={styles.outerView}>
                            <IconView style={styles.iconView}/>
                            <View style={styles.innerView}>
                                <HeadlineView style={styles.headline}/>
                                <TaglineView numberOfLines={1} style={styles.tagLine}/>
                                <AdvertiserView style={styles.advertiser}/>
                            </View>
                            <CallToActionView style={styles.actionView} textStyle={styles.actionText}/>
                        </View>
                    </View>
                </NativeAdView>
                <SpacingView height={12} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    adView: {
        width: '100%',
        alignSelf: 'center',
        height: 100,
        backgroundColor: color.white,
    },
    subView: {
        height: 100,
        width: '100%',
    },
    badge: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: color.green,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 12,
        color: color.green,
    },
    outerView: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    innerView: {
        width: '65%',
        maxWidth: '65%',
        paddingHorizontal: 6,
    },
    iconView: {
        width: 60,
        height: 60,
    },
    headline: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    tagLine: {
        fontSize: 11,
    },
    advertiser: {
        fontSize: 10,
        color: color.gray,
    },
    actionView: {
        height: 45,
        paddingHorizontal: 12,
        backgroundColor: color.purple,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 10,
    },
    actionText: {
        fontSize: 14,
        color: color.white,
    },
});

export default AdsCell;
