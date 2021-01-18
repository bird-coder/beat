import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';

import {MyText} from '../Text';
import AvatarCell from '../AvatarCell';

class MsgItem extends PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
        onPress: PropTypes.func,
        navigation: PropTypes.instanceOf(navigator).isRequired,
    }

    constructor(props) {
        super(props);

    }

    goToUserInfo = (uid, vip) => {
        this.props.navigation.navigate('UserInfo', {uid});
        // if (vip) this.props.navigation.navigate('VipUserInfo', {});
        // else this.props.navigation.navigate('UserInfo', {});
    }

    goToMsgDetail = () => {
        this.props.navigation.navigate('MsgDetail', {});
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this.goToMsgDetail} style={styles.container}>
                <AvatarCell icon={this.props.data.avatar} onPress={this.goToUserInfo.bind(this, this.props.data.uid, this.props.data.vip)} vip={this.props.data.vip} />
                <View style={styles.contentView}>
                    <View style={styles.view}>
                        <MyText style={styles.username}>{this.props.data.username}</MyText>
                        <View style={commonStyle.fillView} />
                        <MyText style={styles.time}>{this.props.data.ctime && (this.props.data.ctime + '').toDateTime().format('yyyy-MM-dd HH:mm')}</MyText>
                    </View>
                    <MyText numberOfLines={1}>{this.props.data.content}</MyText>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.white,
        padding: 15,
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
    },
    contentView: {
        flex: 1,
        marginLeft: 15,
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    username: {
        fontSize: 16,
        color: color.black,
    },
    time: {
        fontSize: 12,
        color: color.gray,
    },
    content: {

    },
});

export default MsgItem;
