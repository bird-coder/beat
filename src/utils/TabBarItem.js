/**
 * Created by yujiajie on 2019/1/21.
 */
import React, {PureComponent} from 'react'
import {Image} from 'react-native'
import PropTypes from 'prop-types'

export default class TabBarItem extends PureComponent {
    static propTypes ={
        tintColor: PropTypes.string,
        normalImage: PropTypes.any,
        selectedImage: PropTypes.any,
        focused: PropTypes.bool,
    }

    render() {
        let selectedImage = this.props.selectedImage ? this.props.selectedImage : this.props.normalImage
        return (
            <Image
                source={this.props.focused ? selectedImage : this.props.normalImage}
                style={{ tintColor: this.props.tintColor, width: 25, height: 25 }}
            />
        )
    }
}