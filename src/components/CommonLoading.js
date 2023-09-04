/* eslint-disable prettier/prettier */
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {theme} from '../atoms/theme';

class CommonLoading extends Component {
  static _ref = null;

  static setRef(ref = {}) {
    this._ref = ref;
  }

  static getRef() {
    return this._ref;
  }

  static clearRef() {
    this._ref = null;
  }
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      title: '',
      subTitle: '',
    };
  }
  _setState(reducer) {
    return new Promise(resolve => this.setState(reducer, () => resolve()));
  }
  show(title, subTitle) {
    this._setState({show: true, title: title, subTitle: subTitle});
  }

  hide() {
    this._setState({show: false});
  }

  static show(title, subTitle) {
    this._ref.show(title, subTitle);
  }
  static hide() {
    this._ref.hide();
  }

  render() {
    const {show, title, subTitle} = this.state;
    if (show) {
      return (
        <View style={styles.container}>
          {/* <LottieView
            source={require("../assets/lotties/loader.json")}
            autoPlay
            loop
            style={styles.loading}
          /> */}
          <ActivityIndicator color={theme.colors.sushiittoRed} />
          {title && <Text style={styles.titleText}>{title}</Text>}
          {subTitle && <Text style={styles.subTitleText}>{subTitle}</Text>}
        </View>
      );
    }

    return <></>;
  }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
    backgroundColor: 'rgba(241,242,247,0.5)',
  },
  loading: {
    zIndex: 9999,
    width: 125,
    height: 125,
  },
  titleText: {
    textAlign: 'center',
    color: theme.colors.darkText,
    fontSize: 24,
  },
  subTitleText: {
    textAlign: 'center',
    color: theme.colors.lightBlack,
    fontSize: 14,
  },
});
export default CommonLoading;
