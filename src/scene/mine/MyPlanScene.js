import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, Heading3, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import SwitchTabCell from '../../module/SwitchTabCell';
import {NoDataView, NoMoreView} from '../../module/NoDataView';

export default class MyPlanScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            items: ['未完成', '已完成'],
            index: 0,
            plans1: [],
            plans2: [],
            firstLoad: true,
            refreshing: false,
            more1: true,
            more2: true,
            page1: 1,
            page2: 1,
        };
    }

    componentDidMount(): void {
        this.requestData();
    }

    switchTab = (index) => {
        if (this.state.firstLoad) this.requestData(index);
        this.setState({index: index, firstLoad: false});
    }

    requestData = (type = 0) => {
        let that = this;
        if ([1,2].indexOf(type) == -1) type = this.state.index;
        that.setState({refreshing: true});
        HttpUtil.post(api.getUserPlans, {type: type}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                let bool = json.data.length >= global.config.pageSize;
                if (type == 0) that.setState({plans1: json.data, page1: 1, more1: bool});
                else that.setState({plans2: json.data, page2: 1, more2: bool});
            }
            that.setState({refreshing: false});
        });
    }

    loadMore = () => {
        let that = this;
        let type = this.state.index;
        let more = type == 1 ? this.state.more2 : this.state.more1;
        if (!more) return;
        let page = type == 1 ? this.state.page2 : this.state.page1;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            page++;
            HttpUtil.post(api.getUserPlans, {type, page}).then((json) => {
                if (!json) return;
                if (json && json.code == 0) {
                    let bool = json.data.length >= global.config.pageSize;
                    if (type == 0) {
                        let plans = that.state.plans1.concat(json.data);
                        that.setState({plans1: plans, page1: page, more1: bool});
                    } else {
                        let plans = that.state.plans2.concat(json.data);
                        that.setState({plans1: plans, page2: page, more2: bool});
                    }
                }
            });
        }, 200);
    }

    checkPlan = (index) => {
        let plans = this.state.type == 1 ? this.state.plans2 : this.state.plans1;
        let plan = plans[index];
        if (!plan) return;
        this.props.navigation.navigate('PlanDetail', {plan});
    }

    renderCell = (info: Object) => {
        let len = 0;
        if (info.item.distribute) len = info.item.distribute.length;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this.checkPlan.bind(this, info.index)} style={[commonStyle.rowView, styles.planItem]}>
                <Image source={ImageResources.plan_pic} resizeMode={'stretch'} style={styles.planImg} />
                <View>
                    <Heading3 style={commonStyle.bold}>{info.item.title}</Heading3>
                    <SpacingView height={4} />
                    <MyText style={commonStyle.info}>{info.item.period}周，每周{len}天，每天{info.item.duration}分钟</MyText>
                    <SpacingView height={19} />
                    <MyText style={commonStyle.info}>{(info.item.start+'').toDateTime().format('yyyy-MM-dd')}启用</MyText>
                </View>
            </TouchableOpacity>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.id + '';
    }

    getItemLayout = (data, index) => {
        return {length: 112, offset: 112 * index, index};
    }

    renderFooter = () => {
        let more = this.state.index == 1 ? this.state.more2 : this.state.more1;
        return (
            <NoMoreView more={more} />
        );
    }

    renderEmpty = () => {
        return (
            <NoDataView/>
        );
    }

    render() {
        let plans = this.state.plans1;
        if (this.state.index == 1) plans = this.state.plans2;
        return (
            <View style={styles.container}>
                <SpacingView height={5} />
                <SwitchTabCell style={styles.tabView} index={this.state.index} onPress={this.switchTab} list={this.state.items} />
                <FlatList
                    style={commonStyle.bodyView}
                    data={plans}
                    renderItem={this.renderCell}
                    getItemLayout={this.getItemLayout}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData.bind(this, this.state.index)}
                    refreshing={this.state.refreshing}

                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}

                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadMore}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabView: {
        backgroundColor: color.white
    },
    planItem: {
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomColor: color.border,
        borderBottomWidth: ScreenUtil.onePixel,
    },
    planImg: {
        width: 130,
        height: 80,
        marginRight: 10,
    },
});
