import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, SectionList} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import ScreenUtil from '../utils/ScreenUtil';

import {MyText, Paragraph} from '../module/Text';

const width = ScreenUtil.screenW / 4 - 11;

class SwitchItemCell extends PureComponent {
    static propTypes = {
        index: PropTypes.number.isRequired,
        onPress: PropTypes.func.isRequired,
        list: PropTypes.arrayOf(PropTypes.string).isRequired,
        style: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    handleIndex = (event) => {
        let obj = event.nativeEvent.contentOffset;
        console.log(obj)
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <ScrollView horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}
                            snapToInterval={width}
                            decelerationRate={'fast'}
                            onMomentumScrollEnd={this.handleIndex}
                >
                    {this.props.list.map((info, index) => {
                        if (info) {
                            return (
                                <TouchableOpacity activeOpacity={0.8} style={styles.item} key={index}
                                                  onPress={() => this.props.onPress(index)}>
                                    <Paragraph style={styles.text}>{info}</Paragraph>
                                    {this.props.index == index && <View style={styles.selectItem}/>}
                                </TouchableOpacity>
                            );
                        }
                    })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        // justifyContent: 'space-around',
        // alignItems: 'center',
        backgroundColor: color.primary_1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        height: 40,
        borderRadius: 20,
    },
    item: {
        width: width,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectItem: {
        width: 94,
        height: 30,
        borderRadius: 15,
        backgroundColor: color.white,
        position: 'absolute',
    },
    text: {
        fontSize: 13,
        color: color.primary,
        fontWeight: 'bold',
        zIndex: 2,
    },
});

export default SwitchItemCell;
