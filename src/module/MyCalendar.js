import React, {PureComponent, Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {WeekCalendar, LocaleConfig, Calendar, Agenda, CalendarList, ExpandableCalendar} from 'react-native-calendars';

import color from '../common/color';
import commonStyle from '../common/style';
import ScreenUtil from '../utils/ScreenUtil';

import {Heading, Heading3, MyText, Paragraph} from '../module/Text';
import SpacingView from './SpacingView';

const theme = {
    textSectionTitleColor: color.text,
    textSectionTitleDisabledColor: color.info,
    todayTextColor: color.white,
    todayBackgroundColor: color.primary,
    dotColor: color.finish_dot,
};

LocaleConfig.locales['zh-CN'] = {
    monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    dayNames: ['周一','周二','周三','周四','周五','周六','周日'],
    dayNamesShort: ['一','二','三','四','五','六','日'],
    today: '今日',
};
LocaleConfig.defaultLocale = 'zh-CN';

class MyWeekCalendar extends PureComponent {
    static defaultProps = {
        details: [
            // {day: '2020-10-24', w: 6, d: 24, plan: true, stype: 2, duration: 30, state: 1},
            // {day: '2020-10-25', w: 7, d: 25, plan: true, stype: 2, duration: 30, state: 0},
            // {day: '2020-10-26', w: 1, d: 26, plan: false},
            // {day: '2020-10-27', w: 2, d: 27, plan: true, stype: 2, duration: 30, state: 0},
            // {day: '2020-10-28', w: 3, d: 28, plan: false},
            // {day: '2020-10-29', w: 4, d: 29, plan: true, stype: 2, duration: 30, state: 1},
            // {day: '2020-10-30', w: 5, d: 30, plan: true, stype: 2, duration: 30, state: 1},
        ],
    }

    static propTypes = {
        details: PropTypes.arrayOf(PropTypes.object),
        onPress: PropTypes.func,
    };

    constructor(props) {
        super(props);

        let index = 1;
        let today = new Date().format('yyyy-MM-dd');
        for (let i in this.props.details) {
            if (this.props.details[i].day == today) index = i;
        }
        this.state = {
            dayNames: ['一','二','三','四','五','六','日'],
            index: index,
            select: index,
        };
    }

    checkDay = (index) => {
        this.setState({select: index});
        if (this.props.onPress) this.props.onPress(index);
    }

    render() {
        let finishDot = {backgroundColor: color.finish_dot};
        let failDot = {backgroundColor: color.warning};
        return (
            <View style={styles.weekView}>
                {this.props.details.map((info, index) => {
                    let checkStyle = null;
                    if (index == this.state.select) checkStyle = {backgroundColor: color.listItem};
                    if (index == this.state.index) checkStyle = {backgroundColor: color.primary};
                    let textStyle = null;
                    if (!info.plan) textStyle = commonStyle.info;
                    if (index == this.state.index || index == this.state.select) textStyle = commonStyle.white;
                    return (
                        <View style={styles.dayView}>
                            <Paragraph>{this.state.dayNames[info.w - 1]}</Paragraph>
                            <SpacingView height={5}/>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.checkDay.bind(this, index)} style={[styles.dayItem, checkStyle]}>
                                <Paragraph style={textStyle}>{info.d}</Paragraph>
                            </TouchableOpacity>
                            <SpacingView height={4}/>
                            <View
                                style={[styles.dot, index < this.state.index && info.plan && (info.state == 1 ? finishDot : failDot)]}/>
                        </View>
                    );
                })}
            </View>
        );
    }
}

class MyCalendar extends Component {
    static defaultProps = {
        details: [
            // {day: '2020-10-24', w: 6, d: 24, plan: true, stype: 2, duration: 30, state: 1},
            // {day: '2020-10-25', w: 7, d: 25, plan: true, stype: 2, duration: 30, state: 0},
            // {day: '2020-10-26', w: 1, d: 26, plan: false},
            // {day: '2020-10-27', w: 2, d: 27, plan: true, stype: 2, duration: 30, state: 0},
            // {day: '2020-10-28', w: 3, d: 28, plan: false},
            // {day: '2020-10-29', w: 4, d: 29, plan: true, stype: 2, duration: 30, state: 1},
            // {day: '2020-10-30', w: 5, d: 30, plan: true, stype: 2, duration: 30, state: 1},
        ],
    }

    static propTypes = {
        details: PropTypes.arrayOf(PropTypes.object),
        onPress: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            markedDates: {},
            isShow: false,
        };
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (JSON.stringify(nextProps.details) != JSON.stringify(this.props.details)) {
            this.formatMarks(nextProps.details);
        }
        return true;
    }

    formatMarks = (details) => {
        let markedDates = {};
        if (details.length == 0) return;
        for (let i in details) {
            if (details[i].plan) {
                markedDates[details[i].day] = {marked: true, dotColor: details[i].state == 1 ? color.finish_dot : color.warning};
            } else {
                markedDates[details[i].day] = {disabled: true, disableTouchEvent: false};
            }
        }
        this.setState({markedDates, isShow: true});
    }

    checkDay = (day) => {
        let details = this.props.details;
        let markedDates = Object.assign({}, this.state.markedDates);
        let index = 0;
        for (let j in markedDates) {
            markedDates[j].selected = false;
        }
        for (let i in details) {
            if (details[i].day == day.dateString) {
                index = i;
                markedDates[day.dateString].selected = true;
            }
        }
        this.setState({markedDates});
        if (this.props.onPress) this.props.onPress(index);
    }

    renderDay = ({date, marking, state}) => {
        let checkStyle = null, dotStyle = null, textStyle = {fontSize: 16};
        if (state == 'disabled') textStyle.color = color.border;
        if (marking.disabled) textStyle.color = color.info;
        if (marking.selected) {
            checkStyle = {backgroundColor: color.listItem};
            textStyle.color = color.white;
        }
        if (marking.marked) dotStyle = {borderRadius: 4, backgroundColor: marking.dotColor};
        if (state == 'today') {
            checkStyle = {backgroundColor: color.primary};
            textStyle.color = color.white;
        }
        return (
            <>
                <TouchableOpacity activeOpacity={0.5} disabled={state == 'disabled'} onPress={this.checkDay.bind(this, date)} style={[styles.dayItem, checkStyle]}>
                    <Heading3 style={textStyle}>
                        {date.day}
                    </Heading3>
                </TouchableOpacity>
                <SpacingView height={4}/>
                <View style={[styles.dot, dotStyle]}/>
            </>
        );
    }

    render() {
        let minDate, maxDate, past, future;
        let len = this.props.details.length;
        let month = new Date().getMonth() + 1;
        if (len > 0) {
            minDate = this.props.details[0].day;
            maxDate = this.props.details[len - 1].day;
            let minMonth = minDate.slice(5, 2);
            let maxMonth = minDate.slice(5, 2);
            past = month > minMonth ? month - minMonth : 0;
            future = maxMonth > month ? maxMonth - month : 0;
        }
        return (
            <>
                {this.state.isShow && <CalendarList style={styles.container}
                              horizontal={true}
                              pagingEnabled={true}
                              pastScrollRange={past || 0}
                              futureScrollRange={future || 0}
                              firstDay={0}
                              theme={theme}
                              current={this.props.today}
                              minDate={minDate || '2020-10-01'}
                              maxDate={maxDate || '2020-10-30'}
                              markedDates={this.state.markedDates}
                              disableAllTouchEventsForDisabledDays={true}
                              onDayPress={this.checkDay}
                              dayComponent={this.renderDay}
                />}
                {!this.state.isShow && <View style={styles.calendarView}>
                    <Heading>加载中。。。</Heading>
                </View>}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // height: 100,
        paddingBottom: 0,
        marginBottom: 0,
    },
    weekView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 12,
        // paddingBottom: 10,
    },
    dayView: {
        alignItems: 'center',
    },
    dayItem: {
        width: 30,
        height: 30,
        borderRadius: 15,
        // backgroundColor: color.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        // backgroundColor: color.finish_dot,
    },
    calendarView: {
        width: ScreenUtil.screenW,
        height: 360,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

module.exports = {
    MyWeekCalendar,
    MyCalendar,
};
