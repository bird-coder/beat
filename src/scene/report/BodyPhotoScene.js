import React, {PureComponent} from 'react';
import {View, StyleSheet, SectionList, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import PermissionUtil from '../../utils/PermissionUtil';
import HttpUtil from '../../utils/HttpUtil';
import FileUtil from '../../utils/FileUtil';

import {Heading, Heading3, MyText, Paragraph} from '../../module/Text';
import CommonAction from '../../module/CommonAction';
import SpacingView from '../../module/SpacingView';
import {NoDataView, NoMoreView} from '../../module/NoDataView';
import ImageCheckView from '../../module/ImageCheckView';
import BackBtn from '../../module/BackBtn';
import MyImage from '../../module/MyImage';

export default class BodyPhotoScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => (<BackBtn onPress={navigation.state.params.navigateBack} />),
        headerTitle: () => (<Heading>身材剪影</Heading>),
        headerRight: () => (<Icon name={'ion|camera'} size={20} color={color.text} style={styles.rightBtn} onPress={navigation.state.params.navigatePress} />),
    });

    constructor(props) {
        super(props);

        this.state = {
            actions: ['拍照', '从手机相册选择'],
            sections: [
                // {data: [{day: '27', pics: ['', '', '', ''], record: '45kg'}, {day: '26', pics: ['', ''], record: null}], title: '9月 2020', month: '202009'},
                // {data: [{day: '27', pics: ['', ''], record: '45kg'}, {day: '26', pics: ['', ''], record: null}], title: '8月 2020', month: '202008'},
            ],
            total: 0,
            refreshing: false,
            more: true,
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({navigatePress: this.upload, navigateBack: this.goBack});
        this.requestData();
    }

    goBack = () => {
        let params = this.props.navigation.state.params;
        if (params.callback) {
            let sections = this.state.sections;
            let photos = [];
            outer:
            for (let i in sections) {
                inter:
                for (let j in sections[i].data) {
                    photos = photos.concat(sections[i].data[j].pics);
                    if (photos.length >= 4) break outer;
                }
            }
            params.callback(photos, this.state.total);
        }
        this.props.navigation.goBack();
    }

    requestData = () => {
        let that = this;
        that.setState({refreshing: true});
        HttpUtil.httpCache(api.getUserBodyPhotoDetail, {}, -1, HttpUtil.BodyPhotoCacheKey).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({sections: json.data.sections, total: json.data.total, refreshing: false});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    upload = () => {
        global.toastActionSheet(<CommonAction confirm={this.selectUpload} list={this.state.actions} showCancel={false} />);
    }

    selectUpload = (index) => {
        let that = this;
        if (index == 0) {
            PermissionUtil.requestPermission(['CAMERA']).then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Camera', {callback: that.uploadPhoto});
                }
            });
        } else {
            let response;
            if (global.platform.isIOS) response = PermissionUtil.requestPermission(['PHOTO_LIBRARY']);
            else response = PermissionUtil.requestPermission(['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']);
            response.then((res) => {
                if (typeof res === 'boolean' && res) {
                    that.props.navigation.navigate('Album', {maxFiles: 1, callback: that.uploadPhoto});
                }
            });
        }
    }

    uploadPhoto = (imgs) => {
        let that = this;
        if (imgs.length == 0) return;
        let params = {
            filedata: { uri: imgs[0], type: 'image/jpeg', name: 'image.jpg' },
        };
        FileUtil.getStat(imgs[0]).then((timestamp) => {
            if (timestamp) params['ctime'] = timestamp;
            HttpUtil.postFile(api.uploadBodyPhoto, params).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    HttpUtil.clearAllCache(HttpUtil.BodyPhotoCacheKey);
                    let sections = Object.assign([], that.state.sections);
                    let month = json.data.day.slice(0, 6);
                    let day = json.data.day.slice(-2);
                    let bool = true;
                    for (let i in sections) {
                        if (sections[i].month == month) {
                            for (let j in sections[i].data) {
                                if (sections[i].data[j].day == day) {
                                    sections[i].data[j].pics.push(json.data.url);
                                    break;
                                }
                                if (day > sections[i].data[j].day) {
                                    sections[i].data.splice(j, 0, {day: day, pics: [json.data.url]});
                                    break;
                                }
                            }
                            break;
                        }
                        if (month > sections[i].month) {
                            if (bool) {
                                let title = month.slice(-2) + '月 ' + month.slice(0,4);
                                sections.splice(i, 0, {data: [{day: day, pics: [json.data.url]}], month: month, title: title, total: 1, index: i});
                                bool = false;
                            } else {
                                sections[i].index++;
                            }
                        }
                    }
                    that.setState({sections, total: that.state.total+1});
                } else {
                    global.toastShow(json.message);
                }
            });
        });
    }

    getPhotoIndex = (picIndex, itemIndex, sectionIndex) => {
        let sections = this.state.sections;
        let index = 0;
        let photos = [];
        for (let i in sections) {
            for (let j in sections[i].data) {
                if (i < sectionIndex || (i == sectionIndex && j < itemIndex)) {
                    index += sections[i].data[j].pics.length;
                }
                photos = photos.concat(sections[i].data[j].pics);
            }
        }
        index += picIndex;
        return {photos, index};
    }

    checkPhoto = (picIndex, itemIndex, sectionIndex) => {
        console.log(picIndex, itemIndex, sectionIndex);
        let obj = this.getPhotoIndex(picIndex, itemIndex, sectionIndex);
        global.toastImage(<ImageCheckView photos={obj.photos} index={obj.index} type={'mine'} />);
    }

    renderCell = (info: Object) => {
        return (
            <View style={[commonStyle.bodyView, styles.view]}>
                <MyText>{info.item.day}/</MyText>
                <View style={styles.rightView}>
                    {info.item.record && <MyText>当天体重 <Paragraph style={commonStyle.bold}>{info.item.record}</Paragraph></MyText>}
                    <View style={styles.picView}>
                        {info.item.pics.length > 0 && info.item.pics.map((pic, index) => (
                            <TouchableOpacity activeOpacity={0.8} onPress={this.checkPhoto.bind(this, index, info.index, info.section.index)} style={styles.picItem}>
                                <MyImage source={pic+'_'} style={styles.pic}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <SpacingView height={8} />
                </View>
            </View>
        );
    }

    renderSectionHeader = (info: Object) => {
        return (
            <View style={commonStyle.bodyView}>
                <SpacingView height={12} />
                <Heading>{info.section.title}</Heading>
                <SpacingView height={12} />
            </View>
        );
    }

    renderSectionSeparator = () => {
        return (
            <View style={styles.fillView} />
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return index + '';
    }

    renderHeader = () => {
        return (
            <SpacingView height={5} />
        );
    }

    renderFooter = () => {
        return (
            <>
                <NoMoreView more={this.state.more} />
            </>
        );
    }

    renderEmpty = () => {
        return (
            <NoDataView/>
        );
    }

    render() {
        return (
            <>
                <SectionList
                    sections={this.state.sections}
                    renderItem={this.renderCell}
                    renderSectionHeader={this.renderSectionHeader}
                    // SectionSeparatorComponent={this.renderSectionSeparator}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}

                    stickySectionHeadersEnabled={true}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    rightBtn: {
        paddingRight: 10,
        paddingLeft: 10,
    },
    view: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    rightView: {
        marginLeft: 12,
    },
    picView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    picItem: {
        borderRadius: 1,
        backgroundColor: color.paper,
        marginRight: 8,
        marginTop: 8,
    },
    pic: {
        width: 100,
        height: 100,
        borderRadius: 1,
    },
    fillView: {
        height: 6,
        backgroundColor: color.white,
    },
});
