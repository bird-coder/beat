import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';

import api from '../../common/api';
import color from '../../common/color';
import commonStyle from '../../common/style';
import ImageResources from '../../common/image';
import HttpUtil from '../../utils/HttpUtil';
import ScreenUtil from '../../utils/ScreenUtil';

import {Heading, MyText} from '../../module/Text';
import TurnDetailCell from '../../module/TurnDetailCell';

export default class HelpCenterScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: () => <Heading>{navigation.state.params.title}</Heading>,
    });

    constructor(props) {
        super(props);

        this.state = {
            problems: [
                // {id: 1, title: '问题1'},
                // {id: 2, title: '问题2'},
                // {id: 3, title: '问题3'},
            ],
        };
    }

    componentDidMount(): void {
        let that = this;
        HttpUtil.clearCache(api.getQuestions);
        HttpUtil.httpCache(api.getQuestions, {}, -1).then((json) => {
            if (!json) return;
            if (json && json.code == 0) {
                that.setState({problems: json.data});
            }
        });
    }

    seeProblem = (index) => {
        let problem = this.state.problems[index];
        if (!problem) return;
        this.props.navigation.navigate('HelpDetail', {title: problem.title, content: problem.content});
    }

    customer = () => {
        global.toastAlert('客服热线', '客服电话：18758292040', '', null, (res) => {

        });
    }

    feedback = () => {
        this.props.navigation.navigate('Feedback', {});
    }

    render() {
        return (
            <>
                <ScrollView>
                    <View style={commonStyle.bodyView}>
                    {this.state.problems.map((info, index) => (
                        <TurnDetailCell title={info.title} onPress={this.seeProblem.bind(this, index)} border={true} style={styles.problem} />
                    ))}
                    </View>
                </ScrollView>
                <View style={styles.bottomView}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.customer} style={[commonStyle.rowView, styles.btnView]}>
                        <Image source={ImageResources.icon_phone} resizeMode={'stretch'} style={styles.icon}/>
                        <MyText style={styles.btnText}>联系客服</MyText>
                    </TouchableOpacity>
                    {/*<View style={commonStyle.rowView}>*/}
                    {/*    <Icon name={'headset'} size={18} color={color.gray} />*/}
                    {/*    <MyText style={styles.btnText}>在线客服</MyText>*/}
                    {/*</View>*/}
                    <View style={styles.lineView} />
                    <TouchableOpacity activeOpacity={0.8} onPress={this.feedback} style={[commonStyle.rowView, styles.btnView]}>
                        <Image source={ImageResources.icon_complaint} resizeMode={'stretch'} style={styles.icon}/>
                        <MyText style={styles.btnText}>反馈建议</MyText>
                    </TouchableOpacity>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {

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
        backgroundColor: color.white,
        width: '100%',
        paddingTop: 14,
        paddingBottom: ScreenUtil.getIphoneXBottom(12),
        paddingLeft: 51,
        paddingRight: 51,
    },
    lineView: {
        width: 1,
        height: '100%',
        backgroundColor: color.border,
    },
    btnView: {
        paddingTop: 7,
        paddingBottom: 9,
    },
    btnText: {
        fontSize: 13,
        marginLeft: 12,
    },
    icon: {
        width: 18,
        height: 18,
    },
});
