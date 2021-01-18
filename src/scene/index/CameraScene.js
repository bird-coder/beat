import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Animated, Easing} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import FileUtil from '../../utils/FileUtil';

import {MyText} from '../../module/Text';
import BtnCell from '../../module/BtnCell';

export default class CameraScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            camera: RNCamera.Constants.Type.back,
            focusArea: {x: 0.5, y: 0.5},
            position: {left: ScreenUtil.screenW / 2 - 36, top: ScreenUtil.screenH / 2 - 36},
            opacity: new Animated.Value(0.6),
            zoom: new Animated.Value(1.5),
            isShow: true,
            pause: false,
            img: null,
        };
        this.camera = React.createRef();
    }

    componentDidMount(): void {
        let that = this;
        setTimeout(() => {
            that.shineAnimate();
        }, 300);
    }

    shineAnimate = () => {
        let that = this;
        this.setState({isShow: true});
        let animate = Animated.sequence([
            Animated.timing(this.state.zoom, {
                toValue: 1,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.spring(this.state.opacity, {
                toValue: 0.3,
                friction: 1,
                tension: 50,
                useNativeDriver: true,
            }),
        ]);
        animate.start();
        setTimeout(() => {
            animate.stop();
            that.setState({opacity: new Animated.Value(0.6)});
            setTimeout(() => {
                that.setState({isShow: false});
            }, 200);
        }, 1500);
    }

    setFocusArea = ({x, y}) => {
        console.log(x, y);
        if (this.state.isShow || this.state.pause) return;
        let position = {left: x - 36, top: y - 36};
        let focusArea = {x: Math.round(x / ScreenUtil.screenW * 10) / 10, y: Math.round(y / ScreenUtil.screenH * 10) / 10};
        this.setState({position, focusArea});
        this.shineAnimate();
    }

    close = () => {
        this.props.navigation.goBack();
    }

    takePicture = () => {
        let that = this;
        if (this.camera) {
            let options = {width: 1280, quality: 0.5, base64: false};
            this.camera.current.takePictureAsync(options).then((res) => {
                console.log(res);
                that.setState({img: res.uri});
            });
        }
    }

    finish = () => {
        if (!this.state.img) return;
        FileUtil.saveLocalPhoto(this.state.img);
        let imgs = [this.state.img];
        let params = this.props.navigation.state.params;
        if (params.callback) {
            params.callback(imgs);
            this.props.navigation.goBack();
        } else if (params.routeName) {
            this.props.navigation.navigate(params.routeName, {imgs: imgs, type: 'img'});
        }
    }

    pause = () => {
        this.camera.current.pausePreview();
        this.setState({pause: true});
    }

    resume = () => {
        this.camera.current.resumePreview();
        this.setState({pause: false});
    }

    toggleCamera = () => {
        if (this.state.camera == RNCamera.Constants.Type.back) this.setState({camera: RNCamera.Constants.Type.front});
        else this.setState({camera: RNCamera.Constants.Type.back});
    }

    render() {
        let style = this.state.position;
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={this.camera}
                    style={commonStyle.fillView}
                    type={this.state.camera}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    captureAudio={false}
                    useNativeZoom={true}
                    zoom={0}
                    focusDepth={0.5}
                    autoFocus={RNCamera.Constants.AutoFocus.on}
                    autoFocusPointOfInterest={this.state.focusArea}
                    onTap={this.setFocusArea}
                    onPictureTaken={this.pause}
                    androidCameraPermissionOptions={{
                        title: '相机权限申请',
                        message: '打开相机权限来使用照相',
                        buttonPositive: '确定',
                        buttonNegative: '取消',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: '麦克风权限申请',
                        message: '打开麦克风权限来拍摄视频',
                        buttonPositive: '确定',
                        buttonNegative: '取消',
                    }}
                />
                {!this.state.pause && <View style={styles.bottomView}>
                    <TouchableOpacity activeOpacity={1} onPress={this.close} style={styles.closeBtn}>
                        <Icon name={'ion|chevron-down-circle'} color={color.white} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={this.takePicture} style={styles.takeBtn} />
                </View>}
                {!this.state.pause && <TouchableOpacity activeOpacity={1} onPress={this.toggleCamera} style={styles.cameraBtn}>
                    <Icon name={'ion|camera-reverse'} color={color.white} size={30} />
                </TouchableOpacity>}
                {this.state.pause && <View style={styles.bottomView}>
                    <View style={commonStyle.fillView}/>
                    <BtnCell value={'完成'} onPress={this.finish} style={styles.finishBtn} />
                </View>}
                {this.state.pause && <TouchableOpacity activeOpacity={1} onPress={this.resume} style={styles.resumeBtn}>
                    <Icon name={'ion|return-up-back'} color={color.text} size={16} />
                </TouchableOpacity>}
                {this.state.isShow && <Animated.View style={[styles.view, style, {opacity: this.state.opacity, transform: [{scale: this.state.zoom}]}]}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.black,
    },
    bottomView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        width: ScreenUtil.screenW,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: ScreenUtil.SAFE_BOTTOM_HEIGHT + 20,
    },
    takeBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: color.white,
        borderWidth: 10,
        borderColor: color.imgDrop,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        left: 80,
        bottom: ScreenUtil.SAFE_BOTTOM_HEIGHT + 35,
        padding: 10,
    },
    cameraBtn: {
        position: 'absolute',
        top: ScreenUtil.SAFE_BOTTOM_HEIGHT + 35,
        right: 20,
        padding: 10,
    },
    view: {
        position: 'absolute',
        width: 72,
        height: 72,
        borderWidth: 1,
        borderColor: color.wechat,
        top: ScreenUtil.screenH / 2 - 36,
        left: ScreenUtil.screenW / 2 - 36,
    },
    resumeBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: color.white,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: ScreenUtil.STATUS_BAR_HEIGHT + 15,
        left: 25,
    },
    finishBtn: {
        width: 75,
        height: 35,
        marginRight: 20,
    },
});
