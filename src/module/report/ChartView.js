import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {VictoryChart, VictoryBar, VictoryTheme, VictoryAxis, VictoryStack, VictoryLine, VictoryScatter, VictoryZoomContainer, VictoryLabel} from 'victory-native';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {MyText} from '../../module/Text';
import SpacingView from '../SpacingView';
import SwitchItemCell from '../SwitchItemCell';

class ChartView extends PureComponent {
    static defaultProps = {
        showTab: false,
        type: 'bar',
        color: color.primary,
        backgroundColor: color.white,
        // title: '运动时长',
        chart: {
            data: [],
            domain: [0, 120],
            categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            sections: [0,4,8,12,16,20,24],
        },
    }

    static propTypes = {
        showTab: PropTypes.bool,
        tabList: PropTypes.arrayOf(PropTypes.string),
        tabIndex: PropTypes.number,
        switchTab: PropTypes.func,
        chart: PropTypes.object,
        type: PropTypes.oneOf(['bar', 'section', 'line']),
        color: PropTypes.string,
        backgroundColor: PropTypes.string,
        title: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    renderBar = () => {
        let data = [0].concat(this.props.chart.data);
        return (
            <VictoryChart theme={VictoryTheme.material}
                          height={200} padding={{ top: 20, bottom: 35, left: 30, right: 30 }}
            >
                <VictoryBar style={{data: {fill: this.props.color, width: 8}}}
                            domain={{y: this.props.chart.domain}}
                            domainPadding={{ x: [20, 20] }}
                            cornerRadius={{top: 4}}
                            data={data}
                />
                <VictoryAxis style={{
                    axis: {stroke: color.border, strokeWidth: 0.5},
                    grid: {strokeWidth: 0},
                    ticks: {size: 0},
                }}
                             tickValues={this.props.chart.categories}
                />
                <VictoryAxis dependentAxis
                             style={{
                                 axis: {stroke: color.border, strokeWidth: 0},
                                 grid: {stroke: color.border, strokeDasharray: 0, strokeWidth: 0.5},
                                 ticks: {size: 0},
                             }}
                             // tickValues={[40, 80, 120]}
                />
            </VictoryChart>
        );
    }

    handleFill = ({index}) => {
        // console.log(index);
        let fill = color.primary;
        switch (index) {
            case 7: fill = color.rainbow_yellow; break;
            case 6: fill = color.rainbow_blue; break;
            case 5: fill = color.green; break;
            case 4: fill = color.lightOrange; break;
            case 3: fill = color.blue; break;
            case 2: fill = color.purple; break;
            case 1: fill = color.warning; break;
        }
        return fill;
    }

    renderSection = () => {
        let arr = [];
        for (let i in this.props.chart.data) {
            arr.push([{y:0, y0: 0}].concat(this.props.chart.data[i]));
        }
        return (
            <VictoryChart theme={VictoryTheme.material}
                          height={200} horizontal={true}
                          padding={{ top: 20, bottom: 40, left: 35, right: 30 }}
                          domainPadding={{ y: [0, 18] }}
            >
                <VictoryStack style={{data: {width: 4}}}>
                    {arr.map((info, index) => (
                        <VictoryBar style={{data: {fill: this.handleFill}}}
                                    data={info}
                                    cornerRadius={{top: 2, bottom: 2}}
                        />
                    ))}
                    {/*<VictoryBar style={{data: {fill: this.handleFill}}}*/}
                    {/*            data={[{y:0,y0:0},{y:1,y0:0},{y:2,y0:0},{y:1,y0:0},{y:1,y0:0},{y:2,y0:0},{y:1,y0:0},{y:1,y0:0}]}*/}
                    {/*            cornerRadius={{top: 2, bottom: 2}}*/}
                    {/*/>*/}
                    {/*<VictoryBar style={{data: {fill: this.handleFill}}}*/}
                    {/*            data={[{y:0,y0:0},{y:1,y0:1},{y:2,y0:0},{y:1,y0:0},{y:1,y0:0},{y:2,y0:0},{y:1,y0:0},{y:1,y0:0}]}*/}
                    {/*            cornerRadius={{top: 2, bottom: 2}}*/}
                    {/*/>*/}
                    {/*<VictoryBar style={{data: {fill: this.handleFill}}}*/}
                    {/*            data={[{y:0,y0:0},{y:1,y0:2},{y:2,y0:0},{y:1,y0:0},{y:1,y0:0},{y:2,y0:0},{y:1,y0:0},{y:1,y0:0}]}*/}
                    {/*            cornerRadius={{top: 2, bottom: 2}}*/}
                    {/*/>*/}
                </VictoryStack>
                <VictoryAxis style={{
                    axis: {stroke: color.border, strokeWidth: 0},
                    grid: {stroke: color.border, strokeDasharray: 0, strokeWidth: 0.5},
                    ticks: {size: 0},
                    tickLabels: {fill: color.info},
                }}
                             tickValues={this.props.chart.categories}
                />
                <VictoryAxis dependentAxis
                             style={{
                                 axis: {stroke: color.border, strokeWidth: 0.5},
                                 grid: {strokeWidth: 0},
                                 ticks: {size: 0},
                                 tickLabels: {padding: 15, fill: color.info},
                             }}
                             tickValues={this.props.chart.sections}
                             tickFormat={(t) => `${t}:00`}
                />
            </VictoryChart>
        );
    }

    getAnchor = ({index}) => {
        let anchor = 'middle';
        switch (index) {
            case 1: anchor = 'start'; break;
            case this.props.chart.data.length: anchor = 'end'; break;
        }
        return anchor;
    }

    renderLine = () => {
        let data = [0].concat(this.props.chart.data);
        return (
            <VictoryChart theme={VictoryTheme.material}
                          height={200} padding={{ top: 20, bottom: 35, left: 30, right: 30 }}
                          containerComponent={<VictoryZoomContainer zoomDimension={'x'} minimumZoom={{x: 2}} zoomDomain={{x: [1, 5]}} />}
            >
                <VictoryLine style={{data: {stroke: this.props.color, strokeWidth: 2}}}
                             domain={{y: this.props.chart.domain}}
                             data={data}
                />
                <VictoryScatter style={{data: {fill: this.props.color}, labels: {fill: this.props.color, fontSize: 12}}}
                                data={data}
                                labels={({ index }) => this.props.chart.data[index - 1] || 0}
                                labelComponent={<VictoryLabel textAnchor={this.getAnchor}/>}
                />
                <VictoryAxis style={{
                    axis: {stroke: color.border, strokeWidth: 0.5},
                    grid: {strokeWidth: 0},
                    ticks: {size: 0},
                    tickLabels: {fill: color.info},
                }}
                             tickValues={this.props.chart.categories}
                             tickLabelComponent={<VictoryLabel/>}
                />
                <VictoryAxis dependentAxis
                             style={{
                                 axis: {strokeWidth: 0},
                                 grid: {strokeWidth: 0},
                                 ticks: {size: 0},
                                 tickLabels: {fill: color.info},
                             }}
                />
            </VictoryChart>
        )
    }

    render() {
        let style = {backgroundColor: this.props.backgroundColor};
        let chart = this.renderBar();
        if (this.props.type == 'section') chart = this.renderSection();
        if (this.props.type == 'line') chart = this.renderLine();
        return (
            <View style={[commonStyle.bodyView, style]}>
                <SpacingView height={10} />
                {this.props.title && <>
                    <MyText style={styles.title}>{this.props.title}</MyText>
                    <SpacingView height={10} />
                </>}
                {this.props.showTab && <>
                    <SwitchItemCell index={this.props.tabIndex} onPress={this.props.switchTab} list={this.props.tabList} />
                </>}
                {chart}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold',
    },
});

export default ChartView;
