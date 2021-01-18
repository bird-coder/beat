import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, SectionList, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import SpacingView from '../SpacingView';

class WeekChart2 extends PureComponent {
    static defaultProps = {
        // sections: [
        //     {
        //         data: [
        //             {title: '9.14-9.20', progress: 25, index: 1},
        //             {title: '9.21-9.27', progress: 50, index: 2},
        //             {title: '9.28-10.4', progress: 45, index: 3},
        //             {title: '10.5-10.11', progress: 79, index: 4},
        //             {title: '10.11-10.17', progress: 65, index: 5},
        //             {title: '10.18-10.24', progress: 80, index: 6},
        //             {title: '10.25-11.1', progress: 115, index: 7},
        //         ],
        //         title: '2020',
        //         index: 0,
        //     },
        //     {
        //         data: [
        //             {title: '9.14-9.20', progress: 25, index: 9},
        //             {title: '9.21-9.27', progress: 50, index: 10},
        //             {title: '9.28-10.4', progress: 45, index: 11},
        //             {title: '10.5-10.11', progress: 79, index: 12},
        //             {title: '10.11-10.17', progress: 65, index: 13},
        //             {title: '10.18-10.24', progress: 80, index: 14},
        //             {title: '10.25-11.1', progress: 115, index: 15},
        //         ],
        //         title: '2019',
        //         index: 1,
        //     },
        // ],
        // total: 16,
    }

    static propTypes = {
        sections: PropTypes.arrayOf(PropTypes.object),
        total: PropTypes.number,
    };

    constructor(props) {
        super(props);

        let index = props.total - 1;
        this.state = {
            index: index,
            x: 81 * index,
        };
        this.flatList = React.createRef();
    }

    checkWeek = (index, itemIndex, sectionIndex) => {
        // console.log(index, sectionIndex, itemIndex);
        this.flatList.current.scrollToLocation({animated: true, itemIndex: itemIndex + 1 - sectionIndex, sectionIndex: sectionIndex, viewPosition: 0});
        if (this.state.index != index) {
            this.setState({index, x: index * 81});
            let week = this.props.sections[sectionIndex]['data'][itemIndex];
            DeviceEventEmitter.emit('checkWeekCallback', week && week.start);
        }
    }

    handleIndex = (event) => {
        let obj = event.nativeEvent.contentOffset;
        if (obj) {
            let index = Math.round(obj.x / 81);
            if (this.state.index != index) {
                let diff = Math.round((obj.x - this.state.x) / 81);
                let itemIndex = -1, sectionIndex = 0;
                let sections = this.props.sections;
                outer:
                for (let i in sections) {
                    sectionIndex = i;
                    inter:
                    for (let j in sections[i].data) {
                        if (sections[i].data[j].index >= index) {
                            if (sections[i].data[j].index == index) itemIndex = j;
                            break outer;
                        }
                    }
                }
                // console.log(index, sectionIndex, itemIndex);
                if (itemIndex == -1) {
                    if (diff > 0 || (diff < 0 && sectionIndex == 0)) {
                        itemIndex = 0;
                        index++;
                    } else if (diff < 0) {
                        if (sectionIndex > 0) {
                            sectionIndex--;
                            itemIndex = sections[sectionIndex].data.length - 1;
                            index--;
                        }
                    }
                    this.checkWeek(index, itemIndex, sectionIndex);
                    return;
                }
                this.setState({index, x: index * 81});
                let week = this.props.sections[sectionIndex]['data'][itemIndex];
                DeviceEventEmitter.emit('checkWeekCallback', week && week.start);
            }
        }
    }

    renderItem = (info: Object) => {
        let style = {height: info.item.progress};
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.checkWeek.bind(this, info.item.index, info.index, info.section.index)} style={styles.view}>
                <MyText style={styles.title}>{info.item.title}</MyText>
                <SpacingView height={5} />
                <View style={styles.lineView}>
                    <LinearGradient colors={[color.gradient, color.primary]} start={{x:0, y:0}} end={{x:0, y:1}} style={[styles.progress, style]} />
                </View>
            </TouchableOpacity>
        );
    }

    renderSectionHeader = (info: Object) => {
        return (
            <View style={styles.yearView}>
                <Heading style={commonStyle.white}>{info.section.title}</Heading>
            </View>
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.index + '';
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
            <SectionList horizontal={true}
                         showsHorizontalScrollIndicator={false}
                         pagingEnabled={true}
                         decelerationRate={'fast'}
                         stickySectionHeadersEnabled={false}
                         snapToInterval={81}

                         sections={this.props.sections}
                         initialScrollIndex={this.props.total - 1}
                         renderItem={this.renderItem}
                         renderSectionHeader={this.renderSectionHeader}
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
    yearView: {
        width: 81,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WeekChart2;
