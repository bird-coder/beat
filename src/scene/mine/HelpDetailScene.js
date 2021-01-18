import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import HtmlView from 'react-native-htmlview';

import color from '../../common/color';

import {Heading, MyText} from '../../module/Text';

export default class HelpDetailScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            content: null,
        };
    }

    componentDidMount(): void {
        let params = this.props.navigation.state.params;
        if (!params.content) return;
        this.setState({content: params.content});
    }

    render() {
        return (
            <HtmlView value={this.state.content} stylesheet={styles}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});
