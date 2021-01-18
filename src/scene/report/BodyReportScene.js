import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, DeviceEventEmitter} from 'react-native';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading, Heading3, MyText, Paragraph} from '../../module/Text';
import BackBtn from '../../module/BackBtn';
import SwitchTabCell from '../../module/SwitchTabCell';
import BtnCell from '../../module/BtnCell';
import SpacingView from '../../module/SpacingView';
import {NoDataView, NoMoreView} from '../../module/NoDataView';
import ChartView from '../../module/report/ChartView';
import RecodeNode from '../../module/report/RecodeNode';

export default class BodyReportScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <BackBtn style={commonStyle.white} onPress={() => navigation.goBack()} />,
        headerTitle: () => (<Heading style={commonStyle.white}>身体数据</Heading>),
        headerStyle: {borderBottomWidth: 0, elevation: 0, backgroundColor: color.headerBar},
    });

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            actions: ['体重', '身高', 'BMI值', '心率'],
            units: ['kg', 'cm', '', ''],
            data: [
                {day: '2020/10/01', record: '170'},
                {day: '2020/10/02', record: '170'},
                {day: '2020/10/03', record: '170'},
                {day: '2020/10/04', record: '170'},
                {day: '2020/10/05', record: '170'},
                {day: '2020/10/06', record: '170'},
                {day: '2020/10/07', record: '170'},
            ],
            chart: {
                data: [],
                domain: [0, 120],
                categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            },
            refreshing: false,
            more: true,
        };
    }

    componentDidMount(): void {
        let params = this.props.navigation.state.params;
        this.setState({index: params.index});
        this.requestData(params.index);
    }

    switchTab = (index) => {
        this.setState({index});
        this.requestData(index);
    }

    requestData = (index) => {
        let that = this;
        HttpUtil.httpCache(api.getUserBodyReport, {type: index}, -1, HttpUtil.BodyCacheKey).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({chart: json.data.chart, data: json.data.data});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    updateHealthData = () => {
        let name = this.state.actions[this.state.index];
        let unit = this.state.units[this.state.index];
        global.toastNode(<RecodeNode title={'请输入当前' + name} unit={unit} onPress={this.updateData} />, false);
    }

    updateData = (res) => {
        if (!res) return;
        let that = this;
        switch (that.state.index) {
            case 0: res = parseFloat(res).toFixed(1); break;
            case 1: res = parseInt(res); break;
            case 2: res = parseFloat(res).toFixed(1); break;
            case 3: res = parseInt(res); break;
        }
        HttpUtil.post(api.addUserBodyRecord, {type: this.state.index, record: res}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                let date = new Date();
                let day = date.format('yyyy/MM/dd');
                let data = Object.assign([], that.state.data);
                let chart = Object.assign([], that.state.chart);
                let idx = chart.categories.indexOf(day);
                if (idx == - 1) {
                    data.unshift({day, record: res});
                    chart.data.push(res);
                    chart.categories.push(day);
                } else {
                    chart.data[idx] = res;
                    data[data.length - 1 - idx].record = res;
                }
                that.setState({chart, data});
                switch (that.state.index) {
                    case 0:
                        global.config.user.weight = res;
                        global.config.user.last_weight_day = '今天';
                        break;
                    case 1:
                        global.config.user.height = res; break;
                    case 2:
                        global.config.user.bmi = res; break;
                    case 3:
                        global.config.user.heart_rate = res; break;
                }
                DeviceEventEmitter.emit('mineUpdateCallback');
                DeviceEventEmitter.emit('bodyUpdateCallback', {record: res, index: that.state.index});
                HttpUtil.clearCache(api.getUserBodyReport, {type: that.state.index});
            } else {
                global.toastShow(json.message);
            }
        });
    }

    renderCell = (info: Object) => {
        let unit = this.state.units[this.state.index];
        return (
            <>
                <SpacingView height={14} />
                <View style={commonStyle.rowView}>
                    <Paragraph style={commonStyle.info}>{info.item.day}</Paragraph>
                    <View style={commonStyle.fillView}/>
                    <Paragraph style={styles.val}>{info.item.record + unit}</Paragraph>
                </View>
                <SpacingView height={13} />
                <View style={commonStyle.borderLine}/>
            </>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return index + '';
    }

    renderHeader = () => {
        let name = this.state.actions[this.state.index];
        return (
            <>
                <SpacingView height={15} />
                <Heading3>{name}记录</Heading3>
                <SpacingView height={4} />
                <View style={commonStyle.borderLine}/>
            </>
        );
    }

    renderFooter = () => {
        return (
            <>
                <NoMoreView more={this.state.more} />
                <SpacingView height={50} />
            </>
        );
    }

    render() {
        let name = this.state.actions[this.state.index];
        return (
            <>
                <SwitchTabCell style={styles.tabView} index={this.state.index} onPress={this.switchTab} list={this.state.actions} color={color.white} />
                <View style={styles.chartView}>
                    <ChartView backgroundColor={color.headerBar} type={'line'} chart={this.state.chart} />
                </View>
                <FlatList
                    style={commonStyle.bodyView}
                    data={this.state.data}
                    renderItem={this.renderCell}

                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData.bind(this, this.state.index)}
                    refreshing={this.state.refreshing}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                />
                <BtnCell value={'记录' + name} width={1} style={commonStyle.bottomRowBtn} onPress={this.updateHealthData} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    tabView: {
        backgroundColor: color.headerBar,
    },
    chartView: {
        backgroundColor: color.headerBar,
        height: 215,
    },
    val: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
