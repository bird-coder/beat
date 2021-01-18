import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, NativeModules, Button, StatusBar, TouchableOpacity} from 'react-native';
import UnityView, {UnityModule} from '@asmadsen/react-native-unity-view';
import Orientation from 'react-native-orientation-locker';
import RNIdleTimer from 'react-native-idle-timer';

import color from '../common/color';
import commonStyle from '../common/style';
import {MyText} from '../module/Text';

export default class TestUnityScene extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {};
    }

    UNSAFE_componentWillMount(): void {
        let that = this;
        RNIdleTimer.setIdleTimerDisabled(true);
    }

    componentDidMount(): void {
        Orientation.lockToLandscapeLeft();
        StatusBar.setHidden(true);
    }

    componentWillUnmount(): void {
        UnityModule.pause();
        Orientation.lockToPortrait();
        RNIdleTimer.setIdleTimerDisabled(false);
        StatusBar.setHidden(false);
    }

    call_button () {
        UnityModule.postMessage('Globle', 'StartGame', 'man:bike:5:test:beachroad:Alex:Bob:0:1:2:0');
        UnityModule.resume();
        // UnityModule.postMessage('Globle', 'Reload', 'reload');
    }

    onClick = () => {
        UnityModule.postMessage('Globle', 'SetSpeed', '40:40:10:100:14:14:16:16');
    }

    onClick2 = () => {
        UnityModule.postMessage('Globle', 'SetSpeed', '40:40:0:100:14:14:16:16');
    }

    onUnityMessage = (res) => {
        console.log('unity message........', res);
        switch (res) {
            case 'open':
                UnityModule.postMessage('Globle', 'StartGame', 'man:bike:5:test:beachroad:Alex:Bob:0:1:2:0');
                break;
            case 'start': break;
            case 'exit': this.props.navigation.goBack(); break;
            case 'game over':
                // UnityModule.pause();
                break;
            case 'reload':
                UnityModule.postMessage('Globle', 'StartGame', 'man:bike:5:test:beachroad:Alex:Bob:0:1:2:0');
                // UnityModule.postMessage('Globle', 'Reload', 'reload');
                break;
        }
        // this.setState({isShow: false});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={commonStyle.fillView}>
                    <UnityView
                        style={commonStyle.fillView}
                        onMessage={this.onUnityMessage}
                        onUnityMessage={this.onUnityMessage}
                    />
                </View>
                {/*<Button title={"调用unity"} onPress={this.call_button.bind(this)}/>*/}
                <Button title={"设置速度"} onPress={this.onClick.bind(this)}/>
                {/*<Button title={"设置速度0"} onPress={this.onClick2.bind(this)}/>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: color.white,
    },
    exitBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.disabled,
    },
});
