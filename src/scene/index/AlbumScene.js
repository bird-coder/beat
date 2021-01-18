import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNHeicConverter from 'react-native-heic-converter';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import BtnCell from '../../module/BtnCell';
import SpacingView from '../../module/SpacingView';
import DropDownCell from '../../module/index/DropDownCell';
import ImageViewerCell from '../../module/ImageViewerCell';

const itemHeight = ScreenUtil.screenW / 4 - 1;

export default class AlbumScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            albums: [],
            photos: [],
            refreshing: false,
            total: 0,
            selects: {},
            maxFiles: 9,
            len: 0,
            routeName: null,
            firstLoad: true,
            cover: null,
            has_next_page: true,
            groupName: null,
            after: null,
        };
        this.isCrop = false;
    }

    componentDidMount(): void {
        let that = this;
        let params = this.props.navigation.state.params;
        let obj = {};
        if (params.maxFiles && params.maxFiles > 0) {
            obj.maxFiles = params.maxFiles;
        }
        if (params.routeName) obj.routeName = params.routeName;
        if (Object.values(obj).length > 0) this.setState(obj);
        CameraRoll.getAlbums({assetType: 'Photos'}).then((res) => {
            let total = 0;
            let arr = [];
            let groupType = global.platform.isIOS ? 'Album' : 'All';
            for (let i in res) {
                let promise = CameraRoll.getPhotos({
                    first: 1,
                    groupTypes: groupType,
                    assetType: 'Photos',
                    groupName: res[i].title,
                    mimeTypes: ['image/jpeg','image/jpg','image/png','image/heic','image/heif'],
                });
                arr.push(promise);
                total += res[i].count;
            }
            Promise.all(arr).then((list) => {
                for (let j in list) {
                    res[j].pic = list[j].edges[0].node.image.uri;
                }
                that.setState({albums: res, total});
            });
        });
        this.getPhotos(null);
    }

    getPhotos = (groupName) => {
        let that = this;
        let groupType = global.platform.isIOS && groupName ? 'Album' : 'All';
        CameraRoll.getPhotos({
            first: 40,
            groupTypes: groupType,
            assetType: 'Photos',
            groupName: groupName || null,
            mimeTypes: ['image/jpeg','image/jpg','image/png','image/heic','image/heif'],
        }).then((res) => {
            // console.log(res.page_info);
            let photos = [];
            let selects = that.state.selects;
            for (let i in res.edges) {
                let photo = {img: res.edges[i].node.image.uri, checked: false, index: i*1};
                if (selects[photo.img]) photo.checked = true;
                photos.push(photo);
            }
            // console.log(photos);
            let obj = {photos, groupName, after: res.page_info.end_cursor, has_next_page: res.page_info.has_next_page};
            if (global.platform.isIOS && this.state.firstLoad) {
                obj.firstLoad = false;
                if (photos.length > 0) obj.cover = photos[0].img;
            }
            that.setState(obj);
        });
    }

    loadMore = () => {
        if (!this.state.has_next_page) return;
        let that = this;
        let groupName = this.state.groupName;
        let groupType = global.platform.isIOS && groupName ? 'Album' : 'All';
        CameraRoll.getPhotos({
            first: 40,
            after: that.state.after,
            groupTypes: groupType,
            assetType: 'Photos',
            groupName: groupName,
            mimeTypes: ['image/jpeg','image/jpg','image/png','image/heic','image/heif'],
        }).then((res) => {
            // console.log(res.page_info);
            let photos = Object.assign([], that.state.photos);
            let selects = that.state.selects;
            for (let i in res.edges) {
                let photo = {img: res.edges[i].node.image.uri, checked: false, index: i*1};
                if (selects[photo.img]) photo.checked = true;
                photos.push(photo);
            }
            that.setState({photos, after: res.page_info.end_cursor, has_next_page: res.page_info.has_next_page});
        });
    }

    toggleCheck = (index) => {
        let photos = Object.assign([], this.state.photos);
        let photo = photos[index];
        if (!photo.img) return;
        if (this.state.len >= this.state.maxFiles && !photo.checked) return;
        let selects = this.state.selects;
        if (photo.checked) {
            let idx = selects[photo.img].idx;
            delete selects[photo.img];
            for (let i in selects) {
                if (selects[i].idx > idx) selects[i].idx--;
            }
            this.state.len--;
        } else {
            let newPhoto = {img: photo.img, idx: Object.values(selects).length + 1, index: photo.index};
            this.state.selects[photo.img] = newPhoto;
            this.state.len++;
        }
        photo.checked = !photo.checked;
        this.setState({photos: photos, selects: this.state.selects, len: this.state.len});
    }

    toggleCheck2 = (index) => {
        console.log('toggle', index);
        let photos = Object.assign([], this.state.photos);
        let photo = photos[index];
        if (!photo.img) return;
        let selects = this.state.selects;
        if (photo.checked) {
            let idx = selects[photo.img].idx;
            for (let i in selects) {
                if (selects[i].idx > idx) selects[i].idx--;
            }
            selects[photo.img].idx = null;
            this.state.len--;
        } else {
            let num = 0;
            for (let i in selects) {
                if (i == photo.img) break;
                if (selects[i].idx > 0) num++;
            }
            let arr = Object.values(selects);
            let max = arr.length;
            for (let i in arr) {
                let img = arr[i].img;
                if (img == photo.img) {
                    max = i;
                    selects[img].idx = num + 1;
                }
                if (i > max && selects[img].idx > 0) {
                    selects[img].idx++;
                }
            }
            this.state.len++;
        }
        photo.checked = !photo.checked;
        this.setState({photos: photos, selects: selects, len: this.state.len});
    }

    checkPhoto = (index) => {
        global.toastImage(<ImageViewerCell photos={this.state.photos} selects={this.state.selects} index={index} onToggle={this.toggleCheck} onFinish={this.selectPhotos} type={'all'} />);
    }

    checkSelectPhoto = () => {
        let photos = {}, selects = this.state.selects;
        if (Object.values(selects).length == 0) return;
        for (let i in this.state.photos) {
            let img = this.state.photos[i].img;
            if (selects[img] && selects[img].img) {
                photos[selects[img].idx] = this.state.photos[i];
            }
        }
        global.toastImage(<ImageViewerCell photos={Object.values(photos)} selects={this.state.selects} index={0} onToggle={this.toggleCheck2} onFinish={this.selectPhotos} type={'select'} />);
    }

    selectPhotos = (index = -1) => {
        let that = this;
        let selects = this.state.selects;
        let photos = this.state.photos;
        let len = Object.values(selects).length;
        let imgs = [];
        if (len == 0) {
            if (index < 0) return;
            let photo = photos[index];
            if (!photo || !photo.img) return;
            imgs.push(photo.img);
        } else {
            imgs = Object.keys(selects);
        }
        if (global.platform.isIOS) {
            let arr = [];
            for (let i in imgs) {
                arr.push(RNHeicConverter.convert({path: imgs[i], quality: 0.5}));
            }
            let imgArr = [];
            Promise.all(arr).then((res) => {
                for (let j in res) {
                    if (res[j].success) {
                        imgArr.push(res[j].path);
                    }
                }
                global.toastHide().then(() => {
                    if (that.props.navigation.state.params.callback) {
                        that.props.navigation.state.params.callback(imgArr);
                        that.props.navigation.goBack();
                    } else if (that.state.routeName) {
                        that.props.navigation.navigate(that.state.routeName, {imgs: imgArr, type: 'img'});
                    }
                });
            });
        } else {
            global.toastHide().then(() => {
                if (that.props.navigation.state.params.callback) {
                    that.props.navigation.state.params.callback(imgs);
                    that.props.navigation.goBack();
                } else if (that.state.routeName) {
                    that.props.navigation.navigate(that.state.routeName, {imgs: imgs, type: 'img'});
                }
            });
        }
    }

    checkCurrentPhoto = (index) => {
        if (this.isCrop) {
            global.toastShow('处理中，请稍后');
            return;
        }
        let that = this;
        let photo = this.state.photos[index];
        if (!photo) return;
        this.isCrop = true;
        ImageCropPicker.openCropper({
            path: photo.img,
            width: 1280,
            height: 960,
            cropping: true,
            mediaType: 'photo',
            cropperToolbarTitle: '编辑',
            hideBottomControls: true,
            compressImageQuality: 0.5,
            enableRotationGesture: true,
            forceJpg: true,
        }).then((image) => {
            console.log(image);
            this.isCrop = false;
            let imgs = [image.path];
            if (that.props.navigation.state.params.callback) {
                that.props.navigation.state.params.callback(imgs);
                that.props.navigation.goBack();
            }
        }).catch((err) => {
            console.log(err);
            this.isCrop = false;
        });
    }

    renderCell = (info: Object) => {
        if (this.state.maxFiles > 1) {
            let backdrop = null;
            if (info.item.checked) backdrop = <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={this.checkPhoto.bind(this, info.index)} />;
            let disabled = this.state.len >= this.state.maxFiles && !info.item.checked;
            if (disabled) backdrop = <View style={[styles.backdrop, styles.imgDrop]} />;
            let idx = this.state.selects[info.item.img] ? this.state.selects[info.item.img].idx : '';
            let view = <View style={[styles.checkBox, info.item.checked ? styles.checked : styles.unchecked]}><MyText style={styles.title}>{idx}</MyText></View>;
            return (
                <TouchableOpacity activeOpacity={1} style={styles.picItem} onPress={this.checkPhoto.bind(this, info.index)} disabled={disabled}>
                    <Image source={{uri: info.item.img}} style={styles.pic} resizeMode={'cover'} />
                    <TouchableOpacity activeOpacity={1} onPress={this.toggleCheck.bind(this, info.index)} style={styles.check} >
                        {view}
                    </TouchableOpacity>
                    {backdrop}
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity activeOpacity={1} style={styles.picItem} onPress={this.checkCurrentPhoto.bind(this, info.index)}>
                    <Image source={{uri: info.item.img}} style={styles.pic} resizeMode={'cover'} />
                </TouchableOpacity>
            );
        }
    }

    keyExtractor = (item: Object, index: number) => {
        return index + '';
    }

    getItemLayout = (data, index) => {
        return {length: itemHeight, offset: itemHeight * index, index};
    }

    render() {
        let len = this.state.len;
        let titleStyle = len > 0 ? styles.title : {color: color.gray};
        let btnStyle = len > 0 ? {backgroundColor: color.primary, height: 40} : styles.btn;
        return (
            <View style={styles.container}>
                <DropDownCell data={this.state.albums} cover={this.state.cover} total={this.state.total} onPress={this.getPhotos} />
                <FlatList
                    data={this.state.photos}
                    renderItem={this.renderCell}
                    getItemLayout={this.getItemLayout}

                    keyExtractor={this.keyExtractor}

                    columnWrapperStyle={styles.picRow}
                    numColumns={4}
                    extraData={this.state}

                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadMore}
                />
                {this.state.maxFiles > 1 && <>
                    <SpacingView height={70} />
                    <View style={styles.bottomView}>
                        <Heading style={titleStyle} onPress={this.checkSelectPhoto}>预览</Heading>
                        <View style={commonStyle.fillView} />
                        <BtnCell value={'完成' + (len > 0 ? ' ('+len+')' : '')} width={0.25} style={btnStyle} onPress={this.selectPhotos} disabled={len == 0} />
                    </View>
                </>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.text,
    },
    headerBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: color.white,
    },
    picRow: {
        alignItems: 'center',
        paddingTop: 4,
    },
    picItem: {
        marginLeft: 4,
    },
    pic: {
        width: ScreenUtil.screenW / 4 - 5,
        height: ScreenUtil.screenW / 4 - 5,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: color.backdrop,
        zIndex: 2,
    },
    imgDrop:{
        backgroundColor: color.imgDrop,
        zIndex: 4,
    },
    check: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        zIndex: 3,
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: color.primary,
    },
    unchecked: {
        borderWidth: ScreenUtil.onePixel * 4,
        borderColor: color.white,
    },
    bottomView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.albumBg,
        position: 'absolute',
        bottom: 0,
        paddingTop: 12,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: ScreenUtil.getIphoneXBottom(12),
    },
    btn: {
        backgroundColor: color.inputBg,
        height: 40,
    },
});
