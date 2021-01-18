import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';

import color from '../common/color';
import FileUtil from '../utils/FileUtil';

import {MyText} from '../module/Text';

class MyImage extends Component {
    static propTypes = {
        source: PropTypes.any.isRequired,
        style: PropTypes.object,
    };

    constructor(props) {
        super(props);

        let pic = null;
        if (typeof props.source === 'number') pic = props.source;
        this.state = {
            pic: pic,
        };
    }

    componentDidMount(): void {
        this.getImage();
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (nextProps.source != this.props.source) {
            this.getImage();
        }
        return true;
    }

    getImage = () => {
        let that = this;
        if (typeof this.props.source === 'string') {
            FileUtil.saveRemotePic(this.props.source).then((res) => {
                that.setState({pic: {uri: res}});
            });
        }
    }

    render() {
        return (
            <Image source={this.state.pic} style={this.props.style}
                   resizeMode={'cover'} fadeDuration={0}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});

export default MyImage;
