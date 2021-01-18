import React from 'react';
import {View, TouchableOpacity, Keyboard} from 'react-native';
import Picker from 'react-native-picker';

const hideComponent = () => {
    Keyboard.dismiss();
    Picker.isPickerShow((state) => {
        if (state) Picker.hide();
    });
};

export function MyView({style, ...props}: Object) {
    return <TouchableOpacity style={style} {...props} activeOpacity={1} onPress={hideComponent} />;
}
