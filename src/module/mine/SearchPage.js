import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading3, MyText} from '../../module/Text';
import HeaderBar from '../HeaderBar';
import InputFrame from '../InputFrame';

class SearchPage extends PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        onPress: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            search: null,
            filters: [],
        };
    }

    _getData = (text, name) => {
        switch (name) {
            case 'search': this.setState({search: text}); break;
        }
    }

    cancel = () => {
        global.toastHide();
    }

    goSearch = () => {
        let that = this;
        global.toastHide().then(() => {

        });
    }

    switchFollow = (index) => {
        if (this.props.onPress) this.props.onPress(index);
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={commonStyle.fillView} keyboardShouldPersistTaps={'handled'}>
                <HeaderBar style={styles.headerBar}>
                    <InputFrame name={'search'} type={'text'} placeholder={'搜索'}
                                style={styles.input} onValueChange={this._getData}
                                value={this.state.search} isFocus={true} onSubmit={this.goSearch} />
                    <Heading3 style={commonStyle.info} onPress={this.cancel}>取消</Heading3>
                    <Icon name={'ion|search'} size={20} color={color.gray} style={styles.search} />
                </HeaderBar>
                <TouchableOpacity activeOpacity={1} onPress={this.cancel} style={commonStyle.fillView}/>
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
        paddingLeft: 12,
        paddingRight: 12,
    },
    input: {
        height: 34,
        borderRadius: 17,
        backgroundColor: color.paper,
        borderWidth: 0,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 46,
        paddingRight: 17,
        marginRight: 11,
        width: ScreenUtil.screenW - 65,
    },
    search: {
        position: 'absolute',
        left: 29,
    },
});

export default SearchPage;
