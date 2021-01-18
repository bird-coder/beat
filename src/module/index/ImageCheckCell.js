import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import BackBtn from '../BackBtn';
import HeaderBar from '../HeaderBar';

class ImageCheckCell extends PureComponent {
    static propTypes = {
        photos: PropTypes.arrayOf(PropTypes.string).isRequired,
        index: PropTypes.number.isRequired,
        callback: PropTypes.func,
    };

    constructor(props) {
        super(props);

        let imgs = [];
        for (let i in props.photos) {
            if (props.photos[i] && props.photos[i].length > 0) imgs.push({url: props.photos[i]});
        }
        this.state = {
            imgs: imgs,
            index: props.index || 0,
            title: '',
            isShow: false,
        };
    }

    closeViewer = () => {
        let that = this;
        global.toastHide().then(() => {
            if (that.props.callback) that.props.callback();
        });
    }

    onChange = (index) => {
        this.setState({index});
    }

    removeImg = () => {
        this.props.photos.splice(this.state.index, 1);
        let imgs = this.state.imgs;
        let index = this.state.index;
        if (imgs.length <= 1) this.closeViewer();
        else {
            imgs.splice(index, 1);
            if (index > 0) index--;
            this.setState({imgs, index, isShow: false});
        }
    }

    toggleHeader = () => {
        this.setState({isShow: !this.state.isShow});
    }

    renderIndicator = (currentIndex, allSize) => {
        this.setState({title: currentIndex + '/' + allSize});
        return null;
    }

    renderHeader = () => {
        return (
            <HeaderBar style={[styles.headerBar, global.platform.isAndroid && commonStyle.androidHeaderBar]}>
                <Icon name={'simpleline|arrow-left'} size={16} style={styles.backBtn} onPress={this.closeViewer} />
                <View style={commonStyle.fillView} />
                <Heading>{this.state.title}</Heading>
                <View style={commonStyle.fillView} />
                <Icon name={'ion|trash-outline'} size={26} color={color.black} style={styles.trash} onPress={this.removeImg} />
            </HeaderBar>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isShow && this.renderHeader()}
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
                    renderIndicator={this.renderIndicator}
                    onChange={this.onChange}
                    doubleClickInterval={200}
                    onClick={this.toggleHeader}
                    // renderHeader={this.renderHeader}
                />
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
        // marginTop: -150,
        zIndex: -1,
    },
    headerBar: {
        backgroundColor: color.white,
        position: 'absolute',
        top: 0,
        left: 0,
        height: ScreenUtil.HEADER_BAR_HEIGHT,
    },
    trash: {
        paddingRight: 10,
        paddingLeft: 10,
    },
    title: {
        color: color.white,
    },
    backBtn: {
        color: color.black,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 20,
        marginBottom: -13,
    },
});

export default ImageCheckCell;
