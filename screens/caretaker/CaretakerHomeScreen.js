import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from '../../components';

export const CaretakerHomeScreen = () => {
  return (
    <View isSafe style={styles.container}>
      <Text>caretaker</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    alignItems: 'center',
    // justifyContent: 'center',
  }
});