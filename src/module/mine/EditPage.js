import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import HeaderBar from '../HeaderBar';
import SpacingView from '../SpacingView';
import InputFrame from '../InputFrame';

class EditPage extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        val: PropTypes.string,
        type: PropTypes.oneOf(['name', 'phone']),
        onPress: PropTypes.onPress,
    };

    constructor(props) {
        super(props);

        this.state = {
            val: props.val || null,
        };
    }

    hidePage = () => {
        global.toastHide();
    }

    _getData = (text, name) => {
        switch (name) {
            case 'username':
                this.state.val = text; break;
            case 'phone':
                this.state.val = text; break;
        }
    }

    submit = () => {
        let that = this;
        global.toastHide().then(() => {
            if (that.props.onPress) that.props.onPress(that.props.type, that.state.val);
        });
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'handled'}>
                <HeaderBar style={[styles.headerBar, global.platform.isAndroid && commonStyle.androidHeaderBar]}>
                    <MyText style={styles.cancel} onPress={this.hidePage}>取消</MyText>
                    <View style={commonStyle.fillView} />
                    <Heading>{this.props.title}</Heading>
                    <View style={commonStyle.fillView} />
                    <MyText style={styles.finish} onPress={this.submit}>完成</MyText>
                </HeaderBar>
                <SpacingView height={5} />
                <InputFrame name={this.props.type} value={this.state.val} onValueChange={this._getData} placeholder={'请输入您的' + this.props.title} type={'text'} maxLength={11} style={styles.input} />
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.paper,
    },
    headerBar: {
        backgroundColor: color.white,
        height: ScreenUtil.HEADER_BAR_HEIGHT,
    },
    cancel: {
        fontSize: 16,
        paddingLeft: 12,
    },
    finish: {
        fontSize: 16,
        color: color.primary,
        paddingRight: 12,
    },
    input: {
        padding: 13,
        backgroundColor: color.white,
        width: ScreenUtil.screenW,
        borderWidth: 0,
        borderRadius: 0,
    },
});

export default EditPage;
