import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Status = 'hit' | 'miss' | 'end';

interface FeedbackScreenProps {
  status: Status;
  username?: string;
  points?: number;
  onContinue?: () => void;
  onRestart?: () => void;
  onQuit?: () => void;
}

export const FeedbackScreen = ({
  status,
  username,
  points,
  onContinue,
  onRestart,
  onQuit
}: FeedbackScreenProps) => {
  if (status === 'end') {
    return (
      <SafeAreaView style={[styles.resultContainer, styles.endContainer]}>
        <Text style={styles.resultText}>Fim de jogo!</Text>
        <View style={{ flex: 2, alignItems: 'center' }}>
          <Text style={[styles.resultText]}>{username}</Text>
          <Text style={[styles.resultText]}>{points} pontos!</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ paddingHorizontal: 10 }}>
            <Button title="Recomeçar" onPress={onRestart} />
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <Button title="Encerrar" color="red" onPress={onQuit} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isHit = status === 'hit';
  const containerStyle = isHit ? styles.hitContainer : styles.missContainer;
  const iconName = isHit ? 'check' : 'close';
  const buttonColor = isHit ? 'green' : 'red';
  const message = isHit ? 'Acertou!' : 'Errou!';

  return (
    <SafeAreaView style={[styles.resultContainer, containerStyle]}>
      <Text style={styles.resultText}>{message}</Text>
      <AntDesign style={{ flex: 4 }} name={iconName} size={240} color="black" />
      <Button
        title="Continuar"
        color={buttonColor}
        onPress={onContinue}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 40,
  },
  hitContainer: {
    backgroundColor: 'lightgreen',
  },
  missContainer: {
    backgroundColor: 'orangered',
  },
  endContainer: {
    backgroundColor: 'lightblue',
  },
  resultText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
