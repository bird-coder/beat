import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';

import color from '../common/color';
import api from '../common/api';
import ImageResources from '../common/image';
import ScreenUtil from '../utils/ScreenUtil';
import FileUtil from '../utils/FileUtil';

import {MyText} from '../module/Text';
import SpacingView from './SpacingView';
import MyImage from './MyImage';

class ImageCheckView extends PureComponent {
    static defaultProps = {
        type: 'other',
    }

    static propTypes = {
        photos: PropTypes.arrayOf(PropTypes.string).isRequired,
        index: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['other', 'mine']),
    };

    constructor(props) {
        super(props);

        let imgs = [];
        for (let i in props.photos) {
            let img = props.photos[i];
            if (img && img.length > 0) {
                let arr = img.split('://');
                if (arr.length < 2) imgs.push({url: api.cdn + img});
                else imgs.push({url: img});
            }
        }
        this.state = {
            imgs: imgs,
            index: props.index || 0,
            actions: ['保存图片'],
            isShow: false,
        };
    }

    closeViewer = () => {
        if (this.state.isShow) this.hideAction();
        else global.toastHide();
    }

    onChange = (index) => {
        this.setState({index});
    }

    checkMenu = (index) => {
        if (index == 0) {
            FileUtil.saveRemotePhoto(this.props.photos[this.state.index]);
        }
        this.hideAction();
    }

    hideAction = () => {
        this.setState({isShow: false});
    }

    showAction = () => {
        this.setState({isShow: true});
    }

    renderMenu = () => {
        return (
            <View style={styles.bottomView}>
                <View style={styles.actionsView}>
                    {this.state.actions.map((info, index) => (
                        <TouchableOpacity style={[styles.item, index > 0 ? styles.actionItem : {}]} activeOpacity={0.8} key={index} onPress={this.checkMenu.bind(this, index)}>
                            <MyText style={styles.text}>{info}</MyText>
                        </TouchableOpacity>
                    ))}
                </View>
                <SpacingView height={10} />
                <TouchableOpacity style={[styles.item, styles.cancelItem]} activeOpacity={0.8} onPress={this.hideAction}>
                    <MyText style={[styles.text, styles.cancel]}>取消</MyText>
                </TouchableOpacity>
            </View>
        );
    }

    renderImage = (props) => {
        let image;
        switch (this.props.type) {
            case 'other':
                image = <FastImage source={props.source} style={props.style} resizeMode={'cover'} priority={'high'} />;
                break;
            case 'mine':
                let url = props.source.uri.replace(api.cdn, '');
                image = <MyImage source={url} style={props.style} />;
            default:
                image = <FastImage source={props.source} style={props.style} />;
        }
        return image;
    }

    render() {
        return (
            <View style={styles.container}>
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
                    onChange={this.onChange}
                    doubleClickInterval={200}
                    onClick={this.closeViewer}
                    onLongPress={this.showAction}
                    renderImage={this.renderImage}
                    renderHeader={this.renderHeader}
                    // menus={this.renderMenu}
                    // menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                />
                {this.state.isShow && this.renderMenu()}
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
        width: ScreenUtil.screenW,
    },
    bottomView: {
        position: 'absolute',
        width: ScreenUtil.screenW,
        padding: ScreenUtil.getIphoneXBottom(10),
        bottom: 0,
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
        borderTopWidth: ScreenUtil.onePixel,
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

export default ImageCheckView;
