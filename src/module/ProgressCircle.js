import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Svg, {Circle, Defs, Stop, LinearGradient} from 'react-native-svg';

import color from '../common/color';

import {MyText} from '../module/Text';
import {round} from 'react-native-reanimated';

class ProgressCircle extends PureComponent {
    static defaultProps = {
        percent: 0,
    }

    static propTypes = {
        size: PropTypes.number,
        width: PropTypes.number,
        radius: PropTypes.number,
        percent: PropTypes.number,
    };

    constructor(props) {
        super(props);

        let radius = (props.size - props.width) / 2 || 56;
        this.state = {
            size: props.size || 120,
            width: props.width || 8,
            radius: radius,
        };
        this.dasharray = [Math.PI * 2 * radius];
    }

    getOffset = () => {
        return Math.round(Math.PI * 2 * this.state.radius * (1 - this.props.percent));
    }

    render() {
        let half = this.state.size / 2;
        let origin = half + ',' + half;
        let style = {width: this.state.size, height: this.state.size};
        let offset = this.getOffset();
        return (
            <Svg width={this.state.size} height={this.state.size}>
                <Defs>
                    <LinearGradient id={'grad'} x1={'1'} y1={'0'} x2={'0'} y2={'0'}>
                        <Stop offset={0} stopColor={color.rainbow_red}/>
                        <Stop offset={0.3} stopColor={color.rainbow_yellow}/>
                        <Stop offset={0.65} stopColor={color.rainbow_green}/>
                        <Stop offset={0.85} stopColor={color.rainbow_cyan}/>
                        <Stop offset={0.95} stopColor={color.rainbow_blue}/>
                        <Stop offset={1} stopColor={color.rainbow_purple}/>
                    </LinearGradient>
                </Defs>
                <Circle cx={half} cy={half} r={this.state.radius} stroke={color.paper} strokeWidth={this.state.width}/>
                <Circle cx={half} cy={half} r={this.state.radius} stroke={'url(#grad)'} strokeWidth={this.state.width}
                        origin={origin} rotation={'-90'} strokeLinecap={'round'}
                        strokeDasharray={this.dasharray} strokeDashoffset={offset}/>
                <View style={[styles.container, style]}>
                    {this.props.children}
                </View>
            </Svg>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

export default ProgressCircle;
