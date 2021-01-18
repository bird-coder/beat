import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import color from '../../common/color';
import ScreenUtil from '../../utils/ScreenUtil';

import {MyText} from '../../module/Text';
import SpacingView from '../SpacingView';

const part = 18;
const min = 24;

class WeekChart extends PureComponent {
    static defaultProps = {
        weeks: [
            {title: '9.14-9.20', progress: 25},
            {title: '9.21-9.27', progress: 50},
            {title: '9.28-10.4', progress: 45},
            {title: '10.5-10.11', progress: 79},
            {title: '10.11-10.17', progress: 65},
            {title: '10.18-10.24', progress: 80},
            {title: '10.25-11.1', progress: 115},
        ],
    }

    static propTypes = {
        weeks: PropTypes.arrayOf(PropTypes.object),
    };

    constructor(props) {
        super(props);

        this.state = {
            index: 6,
        };
        this.flatList = React.createRef();
    }

    checkWeek = (index) => {
        console.log(index);
        this.flatList.current.scrollToIndex({animated: true, index: index, viewPosition: 0});
        if (this.state.index != index) {
            this.setState({index: index});
            DeviceEventEmitter.emit('checkWeekCallback', index);
        }
    }

    handleIndex = (event) => {
        let obj = event.nativeEvent.contentOffset;
        if (obj) {
            let index = Math.round(obj.x / 81);
            if (this.state.index != index) {
                this.setState({index: index});
                DeviceEventEmitter.emit('checkWeekCallback', index);
            }
        }
    }

    renderItem = (info: Object) => {
        let style = {height: info.item.progress};
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.checkWeek.bind(this, info.index)} style={styles.view}>
                <MyText style={styles.title}>{info.item.title}</MyText>
                <SpacingView height={5} />
                <View style={styles.lineView}>
                    <LinearGradient colors={[color.gradient, color.primary]} start={{x:0, y:0}} end={{x:0, y:1}} style={[styles.progress, style]} />
                </View>
            </TouchableOpacity>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return index + '';
    }

    getItemLayout = (data, index) => {
        return {length: 81, offset: 81 * index, index};
    }

    renderHeader = () => {
        return (
            <View style={styles.fillView}/>
        );
    }

    renderFooter = () => {
        return (
            <View style={styles.fillView}/>
        );
    }

    render() {
        return (
            <FlatList horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled={true}
                      decelerationRate={'fast'}
                      snapToInterval={81}

                      data={this.props.weeks}
                      initialScrollIndex={this.state.index}
                      renderItem={this.renderItem}
                      getItemLayout={this.getItemLayout}

                      keyExtractor={this.keyExtractor}

                      ListHeaderComponent={this.renderHeader}
                      ListFooterComponent={this.renderFooter}

                      onMomentumScrollEnd={this.handleIndex}

                      ref={this.flatList}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    view: {
        alignItems: 'center',
    },
    title: {
        color: color.white,
    },
    lineView: {
        width: 1,
        height: 125,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: color.imgDrop,
    },
    progress: {
        width: 30,
        height: 112,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    fillView: {
        width: ScreenUtil.screenW * 0.4,
    },
});

export default WeekChart;
