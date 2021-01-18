import React, {PureComponent} from 'react';
import {Image, StyleSheet} from 'react-native';

import color from '../common/color';

export function MyImage({style, ...props}: Object) {
    return <Image style={style} {...props} resizeMethod={'resize'} fadeDuration={0} />;
}