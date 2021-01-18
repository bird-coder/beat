import React, {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import color from '../common/color';

export function Heading({style, ...props}: Object) {
    return <Text style={[styles.h, style]} {...props} />;
}

export function Heading2({style, ...props}: Object) {
    return <Text style={[styles.h2, style]} {...props} />;
}

export function Heading3({style, ...props}: Object) {
    return <Text style={[styles.h3, style]} {...props} />;
}

export function Paragraph({style, ...props}: Object) {
    return <Text style={[styles.p, style]} {...props} />;
}

export function MyText({style, ...props}: Object) {
    return <Text style={[styles.text, style]} {...props} />;
}

export class MyHeading extends PureComponent{
    constructor(props) {
        super(props);
        this.text = React.createRef();
    }

    setNativeProps = (nativeProps) => {
        this.text.current.setNativeProps(nativeProps);
    }

    render() {
        return <Text ref={this.text} style={[styles.h, this.props.style]}>{this.props.children}</Text>;
    }
}

const styles = StyleSheet.create({
    h: {
        color: color.text,
        fontFamily: global.platform.isIOS ? 'PingFang SC' : 'Source Han Sans CN',
        fontSize: 18,
        lineHeight: 25,
    },
    h2: {
        fontSize: 20,
        lineHeight: 24,
        color: color.title,
        fontFamily: global.platform.isIOS ? 'PingFang SC' : 'Source Han Sans CN',
    },
    h3: {
        fontSize: 15,
        color: color.title,
        lineHeight: 20,
        fontFamily: global.platform.isIOS ? 'PingFang SC' : 'Source Han Sans CN',
    },
    p: {
        fontSize: 14,
        lineHeight: 20,
        color: color.text,
        fontFamily: global.platform.isIOS ? 'PingFang SC' : 'Source Han Sans CN',
    },
    text: {
        fontSize: 12,
        color: color.text,
        fontFamily: global.platform.isIOS ? 'PingFang SC' : 'Source Han Sans CN',
    },

})
