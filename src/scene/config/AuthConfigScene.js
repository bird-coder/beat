import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import color from '../../common/color';

import {Heading, MyText} from '../../module/Text';

export default class AuthConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    })

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
});
