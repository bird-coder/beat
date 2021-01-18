import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, DeviceEventEmitter} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/RNIMigration';

import color from '../../common/color';
import api from '../../common/api';
import commonStyle from '../../common/style';
import ScreenUtil from '../../utils/ScreenUtil';
import HttpUtil from '../../utils/HttpUtil';

import {Heading3, MyText} from '../../module/Text';
import HeaderBar from '../../module/HeaderBar';
import InputFrame from '../../module/InputFrame';
import TurnFollowCell from '../../module/mine/TurnFollowCell';

export default class SearchPageScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerShown: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            search: '',
            filters: [],
        };
        this.changes = {};
    }

    componentDidMount(): void {
        let params = this.props.navigation.state.params;
        let obj = {};
        if (params.users) obj.users = params.users;
        this.setState(obj);
    }

    _getData = (text, name) => {
        switch (name) {
            case 'search': {
                this.state.search = text;
                this.setState({search: text});
                this.filterFollow();
                break;
            }
        }
    }

    cancel = () => {
        DeviceEventEmitter.emit('searchFollowCallback', this.changes);
        this.props.navigation.goBack();
    }

    goSearch = () => {
        let that = this;
        // this.filterFollow();
    }

    filterFollow = () => {
        let list = this.state.users;
        let reg1 = new RegExp("([`~!@#$%^&*()=|{}':;'\\[\\]\\\\.<>/?'])", 'g');
        let reg = new RegExp(this.state.search.replace(reg1, '\\$1'), 'i');
        let filters = [];
        for (let i in list) {
            if (reg.test(list[i].username)) filters.push(list[i]);
        }
        this.setState({filters});
    }

    switchFollow = (index) => {
        let that = this;
        let filters = Object.assign([], this.state.filters);
        let user = filters[index];
        if (!user) return;
        let state;
        if (user.del) {
            user.del = false;
            state = 1;
        } else {
            user.del = true;
            state = 0;
        }
        HttpUtil.post(api.switchFollow, {fuid: user.uid, state: state}).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                this.changes[user.uid] = state;
                that.setState({filters});
                DeviceEventEmitter.emit('switchFollowCallback', state, user.uid);
            } else {
                global.toastShow(json.message);
            }
        });
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
                {this.state.search.length == 0 && <TouchableOpacity activeOpacity={1} onPress={this.cancel} style={commonStyle.fillView}/>}
                {this.state.search.length > 0 && <ScrollView>
                    {this.state.filters.map((info, index) => {
                        return (
                            <View style={commonStyle.bodyView}>
                                <TurnFollowCell avatar={info.avatar} name={info.username} uid={info.uid} border={true} follow={!info.del}
                                                onPress={this.switchFollow.bind(this, index)}/>
                            </View>
                        );
                    })}
                </ScrollView>}
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    headerBar: {
        backgroundColor: color.white,
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
        bottom: 10,
    },
});
