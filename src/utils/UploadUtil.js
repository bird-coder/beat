/**
 * Created by yujiajie on 2019/1/25.
 */
import { Platform, NativeModules } from 'react-native';
import PermissionUtil from './PermissionUtil';
import ImagePicker from 'react-native-image-crop-picker';

/*
 * 选取图片
 * @param responseCall 拾取成功后的回调函数
 */
export function upload(responseCall, allowsEditing = true, quality = 0.3) {
    /*
     * 各种设置 比如标题 按钮文字 使用前后摄像头 是否裁剪 图片质量 是否关闭base64数据格式等
     */
    var options = {
        title: '选择照片', // specify null or empty string to remove the title
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照上传', // specify null or empty string to remove this button
        chooseFromLibraryButtonTitle: '从相册中选择', // specify null or empty string to remove this button
        // customButtons: {
        //   'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
        // },
        useFrontCamera: 'false', // 'front' or 'back'
        mediaType: 'photo', // 'photo' or 'video'
        compressImageMaxWidth: 1242, // photos only
        compressImageMaxHeight: 2208, // photos only
        aspectX: 1, // aspectX:aspectY, the cropping image's ratio of width to height
        aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
        // quality: 1, // photos only
        angle: 0, // photos only
        // allowsEditing: true, // Built in functionality to resize/reposition the image
        includeBase64: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
        storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
            skipBackup: true, // image will NOT be backed up to icloud
            path: 'images' // will save image at /Documents/images rather than the root
        }
    };
    options.cropping = allowsEditing;//是否裁剪
    options.compressImageQuality = quality;//图片质量
    if (global.platform.isAndroid) PermissionUtil.requestPermission(['CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']) //android需要获取权限
    ImagePicker.openCamera({
        // path: 'file:///storage/emulated/0/Pictures/images/image-6a5bf751-0702-47cc-b111-c82f3d308ef4.jpg',
        width: 300,
        height: 400,
        cropping: true,
        // multiple: true
    }).then(image => {
        console.log(image);
        let source;
        if (Platform.OS === 'android') {
            source = image.path;
        } else {
            source = image.path.replace('file://', '');
        }
        responseCall(source);
    });
}