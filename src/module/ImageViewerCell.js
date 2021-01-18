import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../common/color';
import commonStyle from '../common/style';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';

import {Heading, MyText} from '../module/Text';
import HeaderBar from './HeaderBar';
import BtnCell from './BtnCell';

class ImageViewerCell extends PureComponent {
    static propTypes = {
        photos: PropTypes.arrayOf(PropTypes.object).isRequired,
        selects: PropTypes.arrayOf(PropTypes.object).isRequired,
        index: PropTypes.number.isRequired,
        onToggle: PropTypes.func,
        onFinish: PropTypes.func,
        type: PropTypes.oneOf(['all', 'select']),
    };

    constructor(props) {
        super(props);

        let imgs = [];
        for (let i in props.photos) {
            if (props.photos[i] && props.photos[i].img) imgs.push({url: props.photos[i].img});
        }
        this.state = {
            imgs: imgs,
            index: props.index || 0,
        };
    }

    closeViewer = () => {
        if (this.props.type == 'select') {
            let selects = this.props.selects;
            for (let i in selects) {
                if (!selects[i].idx) delete selects[i];
            }
        }
        global.toastHide();
    }

    onChange = (index) => {
        this.setState({index});
    }

    toggleCheck = (index) => {
        let photo = this.props.photos[index];
        if (!photo || !photo.hasOwnProperty('index')) return;
        if (this.props.onToggle) {
            this.props.onToggle(photo.index);
        }
        this.forceUpdate();
    }

    changeImg = (index) => {
        this.setState({index});
    }

    finishCheck = () => {
        this.closeViewer();
        if (this.props.onFinish) {
            let index = -1;
            if (this.props.type == 'all') index = this.state.index;
            this.props.onFinish(index);
        }
    }

    renderHeader = () => {
        let photo = this.props.photos[this.state.index];
        let checked = photo.checked;
        console.log(this.state.index, checked);
        let icon = <Icon name={'ion|checkmark-circle-outline'} size={34} color={color.white} />;
        let idx = this.props.selects[photo.img] ? this.props.selects[photo.img].idx : '';
        if (checked) icon = <View style={styles.checkBox}><MyText style={styles.title}>{idx}</MyText></View>;
        return (
            <HeaderBar style={[styles.headerBar, global.platform.isAndroid && commonStyle.androidHeaderBar]}>
                <Icon name={'simpleline|arrow-left'} size={18} color={color.white} style={styles.backBtn} onPress={this.closeViewer} />
                <View style={commonStyle.fillView} />
                <TouchableOpacity activeOpacity={1} onPress={this.toggleCheck.bind(this, this.state.index)}>
                    {icon}
                </TouchableOpacity>
            </HeaderBar>
        )
    }

    renderAllScroll = () => {
        let selects = Object.values(this.props.selects);
        let len = selects.length;
        let photo = this.props.photos[this.state.index];
        let scrollView = len > 0 && <ScrollView style={styles.bottomImgView}
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                pagingEnabled={false}>
            {selects.map((info, index) => (
                <TouchableOpacity activeOpacity={1} onPress={this.changeImg.bind(this, info.index)}>
                    <Image source={{uri: info.img}} resizeMode={'cover'} style={[styles.img, photo.img == info.img && styles.checkedImg]} />
                </TouchableOpacity>
            ))}
        </ScrollView>;
        return scrollView;
    }

    renderSelectScroll = () => {
        let photos = this.props.photos;
        let scrollView = photos.length > 0 && <ScrollView style={styles.bottomImgView}
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                pagingEnabled={false}>
            {photos.map((info, index) => (
                <TouchableOpacity activeOpacity={1} onPress={this.changeImg.bind(this, index)} style={styles.imgView}>
                    <Image source={{uri: info.img}} resizeMode={'cover'} style={[styles.img, this.state.index == index && styles.checkedImg]} />
                    {!info.checked && <TouchableOpacity activeOpacity={1} style={styles.imgDrop} onPress={this.changeImg.bind(this, index)} />}
                </TouchableOpacity>
            ))}
        </ScrollView>;
        return scrollView;
    }

    checkSelectLength = () => {
        let selects = this.props.selects;
        let len = 0;
        for (let i in selects) {
            if (selects[i].idx > 0) len++;
        }
        return len;
    }

    renderFooter = () => {
        let len = this.checkSelectLength();
        let disabled = this.props.type == 'select' && len == 0;
        let btnStyle = disabled ? {height: 40} : styles.btn;
        return (
            <View style={styles.bottomView}>
                {this.props.type == 'all' ? this.renderAllScroll() : this.renderSelectScroll()}
                <View style={styles.footerView}>
                    {/*<Heading style={styles.title}>编辑</Heading>*/}
                    <View style={commonStyle.fillView} />
                    <BtnCell value={'完成' + (len > 0 ? ' ('+len+')' : '')} width={0.25} style={btnStyle} onPress={this.finishCheck} disabled={disabled} />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <ImageViewer
                    style={styles.view}
                    imageUrls={this.state.imgs}
                    enableImageZoom={true}
                    index={this.state.index}
                    failImageSource={ImageResources.no_pic}
                    enableSwipeDown={true}
                    onCancel={this.closeViewer}
                    enablePreload={true}
                    useNativeDriver={true}
                    flipThreshold={ScreenUtil.screenW / 2}
                    saveToLocalByLongPress={false}
                    renderIndicator={() => null}
                    onChange={this.onChange}
                    doubleClickInterval={500}
                    // renderHeader={this.renderHeader}
                    // renderFooter={this.renderFooter}
                />
                {this.renderFooter()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenUtil.screenW,
        height: ScreenUtil.screenH,
        backgroundColor: color.black,
    },
    view: {
        marginTop: -150,
        zIndex: -1,
    },
    headerBar: {
        backgroundColor: color.reviewBg,
        paddingRight: 10,
        height: ScreenUtil.HEADER_BAR_HEIGHT,
    },
    backBtn: {
        paddingLeft: 15,
        paddingRight: 20,
    },
    checkBox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.primary,
    },
    bottomView: {
        backgroundColor: color.reviewBg,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: ScreenUtil.screenW,
        paddingBottom: global.platform.isAndroid ? ScreenUtil.ANDROID_BOTTOM_HEIGHT : ScreenUtil.SAFE_BOTTOM_HEIGHT,
    },
    bottomImgView: {
        width: ScreenUtil.screenW,
        paddingTop: 15,
        paddingBottom: 15,
    },
    imgView: {
        marginLeft: 7,
        marginRight: 7,
    },
    img: {
        width: ScreenUtil.screenW / 5 - 13,
        height: ScreenUtil.screenW / 5 - 13,
    },
    checkedImg: {
        borderWidth: ScreenUtil.onePixel * 10,
        borderColor: color.wechat,
    },
    imgDrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: color.imgDrop,
    },
    footerView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        color: color.white,
    },
    btn: {
        height: 40,
    },
});

export default ImageViewerCell;
