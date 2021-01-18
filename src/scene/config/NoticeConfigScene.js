import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import color from '../../common/color';
import PermissionUtil from '../../utils/PermissionUtil';

import {Heading, MyText} from '../../module/Text';
import SpacingView from '../../module/SpacingView';
import TurnCheckCell from '../../module/TurnCheckCell';

export default class NoticeConfigScene extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title || '通知设置'}</Heading>,
    })

    constructor(props) {
        super(props);

        this.state = {
            configs: [
                {title: '评论', checked: true},
                {title: '点赞', checked: false},
                {title: '粉丝', checked: false},
                {title: '系统通知', checked: false},
                {title: '消息', checked: false},
                {title: '运动提醒', checked: false},
            ],
        };
    }

    toggleCheck = (index) => {
        let that = this;
        let config = this.state.configs[index];
        if (!config) return;
        PermissionUtil.requestNotice(function (res) {
            if (res) {
                config.checked = !config.checked;
                that.setState({configs: that.state.configs});
            }
        });
    }

    render() {
        return (
            <View>
                <SpacingView height={5} />
                <View style={styles.view}>
                    {this.state.configs.length > 0 && this.state.configs.map((info, index) => {
                        let bool = index < this.state.configs.length - 1;
                        return (
                            <TurnCheckCell title={info.title} border={bool} checked={info.checked} onPress={this.toggleCheck.bind(this, index)} />
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    view: {
        backgroundColor: color.white,
        paddingLeft: 12,
        paddingRight: 12,
    },
});
