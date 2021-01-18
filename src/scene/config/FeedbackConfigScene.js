import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import color from '../../common/color';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import TurnDetailCell from '../../module/TurnDetailCell';

export default class FeedbackConfigScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    })

    constructor(props) {
        super(props);

        this.state = {
            problems: [
                {title: '问题1'},
                {title: '问题2'},
                {title: '问题3'},
                {title: '问题4'},
                {title: '问题5'},
                {title: '问题6'},
                {title: '问题7'},
            ],
        };
    }

    seeProblem = (index) => {

    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.problems.map((info, index) => (
                    <TurnDetailCell title={info.title} onPress={this.seeProblem.bind(this, index)} border={true} style={styles.problem} />
                ))}
                <View style={styles.bottomView}>
                    <View style={styles.btnView}>
                        <Icon name={'phone-in-talk'} size={24} color={color.gray} />
                        <MyText style={styles.btnText}>联系客服</MyText>
                    </View>
                    <View style={styles.btnView}>
                        <Icon name={'headset'} size={24} color={color.gray} />
                        <MyText style={styles.btnText}>在线客服</MyText>
                    </View>
                    <View style={styles.btnView}>
                        <Icon name={'message'} size={24} color={color.gray} />
                        <MyText style={styles.btnText}>投诉建议</MyText>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    problem: {
        backgroundColor: color.white,
    },
    bottomView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        borderTopWidth: ScreenUtil.onePixel,
        borderTopColor: color.border,
        backgroundColor: color.white,
        width: '100%',
        paddingBottom: ScreenUtil.SAFE_BOTTOM_HEIGHT,
    },
    btnView: {
        alignItems: 'center',
        padding: 5,
        paddingLeft: 30,
        paddingRight: 30,
    },
    btnText: {
        fontSize: 14,
        color: color.gray,
        marginTop: 3,
    },
});
