import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface GameHeaderProps {
  onClose: () => void;
  step: number;
  points: number;
}

export const GameHeader = ({ onClose, step, points }: GameHeaderProps) => {
  return (
    <View style={styles.topContainer}>
      <TouchableOpacity onPress={onClose}>
        <AntDesign style={styles.buttonClose} name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.progress}>{step}/10</Text>
      <Text style={styles.score}>Pontos: {points}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  buttonClose: {
    flex: 2,
  },
  progress: {
    flex: 4,
    textAlign: 'center',
    fontSize: 20,
  },
  score: {
    flex: 2,
    fontSize: 20,
  },
});
