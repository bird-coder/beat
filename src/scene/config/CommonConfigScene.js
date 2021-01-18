import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import color from '../../common/color';

import {Heading, MyText} from '../../module/Text';
import TurnDetailCell from '../../module/TurnDetailCell';
import SpacingView from '../../module/SpacingView';
import BtnCell from '../../module/BtnCell';

export default class CommonConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title || '通用设置'}</Heading>,
    })

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    turnConfigDetail = (index) => {
        switch (index) {
            case 0:
                this.props.navigation.navigate('AccountConfig', {title: '账号安全'});
                break;
            case 1:
                this.props.navigation.navigate('CacheConfig', {title: '缓存管理'});
                break;
            case 2:
                this.props.navigation.navigate('AboutConfig', {title: '关于我们'});
                break;
            case 3:
                this.props.navigation.navigate('ShieldConfig', {title: '屏蔽列表'});
                break;
        }
    }

    render() {
        return (
            <>
                <SpacingView height={5} />
                <View style={styles.view}>
                    <TurnDetailCell title={'账号安全'} onPress={this.turnConfigDetail.bind(this, 0)} border={true} />
                    <TurnDetailCell title={'缓存管理'} onPress={this.turnConfigDetail.bind(this, 1)} border={true} />
                    <TurnDetailCell title={'关于我们'} onPress={this.turnConfigDetail.bind(this, 2)} border={true} />
                    <TurnDetailCell title={'屏蔽列表'} onPress={this.turnConfigDetail.bind(this, 3)} />
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        backgroundColor: color.white,
        paddingLeft: 12,
        paddingRight: 12,
    },
    clear: {
        borderRadius: 0,
        backgroundColor: color.white,
    },
    clearText: {
        color: color.black,
        fontWeight: 'normal',
    },
});
