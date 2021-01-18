import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {withNavigation} from 'react-navigation';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import HeaderBar from '../HeaderBar';

class DropDownCell extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        total: PropTypes.number.isRequired,
        cover: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
        };
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    checkPhotoItem = (title) => {
        if (this.props.onPress) this.props.onPress(title);
        this.toggleDrop();
    }

    toggleDrop = () => {
        this.setState({isShow: !this.state.isShow});
    }

    hideDrop = () => {
        this.toggleDrop();
    }

    render() {
        let cover = null;
        if (this.props.cover) cover = {uri: this.props.cover};
        else if (this.props.data.length > 0) cover = {uri: this.props.data[0].pic};
        return (
            <>
                <HeaderBar style={styles.header}>
                    <Heading style={styles.backBtn} onPress={this.goBack}>取消</Heading>
                    <View style={commonStyle.fillView}/>
                    <TouchableOpacity activeOpacity={1} style={commonStyle.rowView} onPress={this.toggleDrop}>
                        <Heading style={commonStyle.white}>最近项目</Heading>
                        <Icon color={color.white} name={this.state.isShow ? 'material|keyboard-arrow-up' : 'material|keyboard-arrow-down'} size={24} />
                    </TouchableOpacity>
                    <View style={commonStyle.fillView}/>
                    <View style={{width: 46}}/>
                </HeaderBar>
                {this.state.isShow && <View style={styles.dropView}>
                    <View style={styles.dropContainer}>
                        <TouchableOpacity activeOpacity={0.5} style={styles.photoItem} onPress={this.checkPhotoItem.bind(this, null)}>
                            <Image source={cover} resizeMode={'cover'} style={styles.pic}  />
                            <Heading style={commonStyle.white}>最近项目</Heading>
                            {global.platform.isAndroid && <Heading style={styles.num}>({this.props.total})</Heading>}
                            <View style={commonStyle.fillView} />
                            <Icon name={'material|check'} size={20} color={color.wechat} style={styles.check} />
                        </TouchableOpacity>
                        {this.props.data.length > 0 && this.props.data.map((info, index) => (
                            <TouchableOpacity activeOpacity={0.5} style={styles.photoItem} onPress={this.checkPhotoItem.bind(this, info.title)}>
                                <Image source={{uri: info.pic}} resizeMode={'cover'} style={styles.pic}  />
                                <Heading style={commonStyle.white}>{info.title}</Heading>
                                <Heading style={styles.num}>({info.count})</Heading>
                                <View style={commonStyle.fillView} />
                                <Icon name={'material|check'} size={20} color={color.wechat} style={styles.check} />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.background} activeOpacity={1} onPress={this.hideDrop} />
                </View>}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // width: ScreenUtil.screenW,
        // height: ScreenUtil.screenH,
    },
    header: {
        // height: ScreenUtil.HEADER_BAR_HEIGHT,
    },
    backBtn: {
        color: color.white,
        paddingLeft: 12,
    },
    dropView: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        backgroundColor: color.backdrop,
        position: 'absolute',
        top: ScreenUtil.HEADER_HEIGHT,
        zIndex: 8,
    },
    dropContainer: {
        backgroundColor: color.albumBg,
        minHeight: ScreenUtil.screenH * 0.1,
    },
    background: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: -1,
        backgroundColor: 'transparent',
    },
    photoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: ScreenUtil.onePixel,
        borderBottomColor: color.gray,
    },
    pic: {
        width: 60,
        height: 60,
        marginRight: 20,
    },
    num: {
        color: color.gray,
        marginLeft: 15,
    },
    check: {
        marginRight: 20,
    },
});

export default withNavigation(DropDownCell);
