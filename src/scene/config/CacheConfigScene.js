import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, MyText, Paragraph} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import SmallBtnCell from '../../module/SmallBtnCell';

export default class CacheConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title || '缓存管理'}</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            caches: [
                // {title: '图片缓存', size: '计算中...', cacheKey: null},
                {title: '网络缓存', size: '计算中...', cacheKey: HttpUtil.HttpCacheKey},
                {title: '运动数据', size: '计算中...', cacheKey: HttpUtil.ReportCacheKey},
                {title: '健康数据', size: '计算中...', cacheKey: HttpUtil.BodyCacheKey},
                {title: '身体剪影', size: '计算中...', cacheKey: HttpUtil.BodyPhotoCacheKey},
                {title: '计划数据', size: '计算中...', cacheKey: HttpUtil.PlanCacheKey},
            ],
        };
    }

    componentDidMount(): void {
        let that = this;
        let cacheList = this.state.caches;
        for (let i in cacheList) {
            if (cacheList[i].cacheKey) {
                HttpUtil.getAllCacheSize(cacheList[i].cacheKey).then((total) => {
                    let caches = Object.assign([], that.state.caches);
                    let size = total / 1024;
                    if (size >= 200) size = Math.round(size / 1024 * 10) / 10 + 'm';
                    else size = Math.round(size) + 'k';
                    caches[i].size = size;
                    that.setState({caches});
                });
            }
        }
    }

    clearCache = (index) => {
        let caches = Object.assign([], this.state.caches);
        if (!caches[index]) return;
        HttpUtil.clearAllCache(caches[index].cacheKey);
        caches[index].size = '0k';
        this.setState({caches});
    }

    renderCell = (info: Object, index: number, border = false) => {
        let style = null;
        if (border) style = {borderBottomWidth: ScreenUtil.onePixel, borderBottomColor: color.border};
        return (
            <View style={[styles.rowView, style]}>
                <View>
                    <Paragraph>{info.title}</Paragraph>
                    <SpacingView height={10} />
                    <MyText style={styles.text}>{info.size}</MyText>
                </View>
                <View style={commonStyle.fillView} />
                <SmallBtnCell value={'清理'} onPress={this.clearCache.bind(this, index)} isClean={true} />
            </View>
        );
    }

    render() {
        return (
            <>
                <SpacingView height={5} />
                <View style={styles.view}>
                    {this.state.caches.map((info, index) => {
                        let bool = index < this.state.caches.length - 1;
                        return this.renderCell(info, index, bool);
                    })}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    view: {
        backgroundColor: color.white,
        paddingLeft: 12,
        paddingRight: 12,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },
    text: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'bold',
    },
});
