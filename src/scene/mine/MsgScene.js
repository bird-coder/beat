import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';

import color from '../../common/color';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import SwitchTabCell from '../../module/SwitchTabCell';
import MsgItem from '../../module/msg/MsgItem';
import {NoMoreView, NoDataView} from '../../module/NoDataView';

export default class MsgScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>消息</Heading>,
    })

    constructor(props) {
        super(props);

        this.state = {
            items: ['私信'],
            msgs: [
                {avatar: '', username: '天火', vip: 1, ctime: 0, content: '哈哈哈哈哈'},
            ],
            refreshing: false,
            index: 0,
        };
    }

    switchMsgType = (index) => {
        this.setState({index: index});
    }

    renderCell = (info: Object) => {
        return (
            <MsgItem data={info.item} navigation={this.props.navigation} />
        );
    }

    keyExtractor = (item: Object, index: number) => {
        return item.id + '';
    }

    renderHeader = () => {
        return (
            <SwitchTabCell index={this.state.index} onPress={this.switchMsgType} list={this.state.items} />
        );
    }

    renderFooter = () => {
        return (
            <NoMoreView more={this.state.more} />
        );
    }

    renderEmpty = () => {
        return (
            <NoDataView/>
        );
    }

    render() {
        return (
            <FlatList
                data={this.state.msgs}
                renderItem={this.renderCell}

                keyExtractor={this.keyExtractor}
                onRefresh={this.requestData}
                refreshing={this.state.refreshing}

                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                ListEmptyComponent={this.renderEmpty}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
});
