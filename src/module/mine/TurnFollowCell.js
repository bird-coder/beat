import React, {PureComponent} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';
import {withNavigation} from 'react-navigation';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {MyText} from '../../module/Text';
import FollowCell from '../FollowCell';
import AvatarCell from '../AvatarCell';

class TurnFollowCell extends PureComponent {
    static defaultProps = {
        follow: false,
    }

    static propTypes = {
        uid: PropTypes.number,
        name: PropTypes.string,
        vip: PropTypes.bool,
        onPress: PropTypes.func,
        style: PropTypes.object,
        border: PropTypes.bool,
        avatar: PropTypes.any,
        follow: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    goToUserInfo = () => {
        this.props.navigation.navigate('UserInfo', {uid: this.props.uid});
        // if (this.props.vip) this.props.navigation.navigate('VipUserInfo', {});
        // else this.props.navigation.navigate('UserInfo', {});
    }

    render() {
        let img = <AvatarCell icon={this.props.avatar} style={styles.avatar} onPress={this.goToUserInfo} />;
        let style = {};
        if (this.props.style) style = this.props.style;
        if (this.props.border) style = [style, styles.border];
        return (
            <View style={[styles.container, style]}>
                {img}
                <MyText style={styles.title} numberOfLines={1}>{this.props.name}</MyText>
                <View style={commonStyle.fillView} />
                <FollowCell follow={this.props.follow} onPress={this.props.onPress} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    border: {
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
    },
    title: {
        fontSize: 15,
        color: color.text,
        marginLeft: 6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default withNavigation(TurnFollowCell);
