import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {theme} from '@atoms';
import {useNavigation} from '@react-navigation/native';
import {GoBackIcon} from '../../assets/svgs';

const GoBackButton = ({onPress}) => {
  const navigation = useNavigation();
  function goBack() {
    navigation.goBack();
  }

  return (
    <TouchableOpacity
      style={{
        paddingVertical: theme.spacing.backButtonPadding,
        width: 30,
      }}
      onPress={onPress ? onPress : goBack}>
      <GoBackIcon />
    </TouchableOpacity>
  );
};

export default GoBackButton;

const styles = StyleSheet.create({});
