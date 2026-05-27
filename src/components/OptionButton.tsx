import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface OptionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const OptionButton = ({ label, isSelected, onPress }: OptionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.buttonOption, isSelected ? styles.buttonOptionSelected : {}]}>
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonOption: {
    borderWidth: 3,
    borderRadius: 25,
    borderColor: 'lightgray',
    margin: 10,
    padding: 10,
  },
  buttonOptionSelected: {
    borderColor: 'mediumseagreen',
    backgroundColor: 'lightgreen'
  },
});
