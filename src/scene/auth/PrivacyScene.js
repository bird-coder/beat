import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

import api from '../../common/api';
import color from '../../common/color';

import {Heading, MyText} from '../../module/Text';

export default class PrivacyScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (<Heading>隐私政策</Heading>),
    });

    constructor(props) {
        super(props);

        this.state = {
            url: api.web + 'beat/privacy.html',
        };
        this.webview = React.createRef();
    }

    render() {
        return (
            <View style={styles.container}>
                <WebView style={styles.webView}
                         source={{uri: this.state.url}}
                         contentInsetAdjustmentBehavior={'always'}
                         scrollEnabled={true}
                         hideKeyboardAccessoryView={false}
                         userAgent={'MyFancyWebView'}
                         ref={this.webview}
                         onLoadEnd={() => global.toastHide()}
                         onLoadStart={() => global.toastLoading()}
                         onLoad={(e) => this.webview.current.postMessage('')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: color.white,
    },
    webView: {
        backgroundColor: color.white,
    },
});
