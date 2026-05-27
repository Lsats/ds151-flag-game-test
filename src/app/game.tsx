import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { countries } from '../data/countries';
// @ts-ignore
import _ from '../../underscore-esm-min';

import { GameHeader } from '../components/GameHeader';
import { FlagQuestion } from '../components/FlagQuestion';
import { OptionButton } from '../components/OptionButton';
import { FeedbackScreen } from '../components/FeedbackScreen';

interface Country {
  name: string;
  code: string;
}

type GameStatus = 'question' | 'hit' | 'miss' | 'end';

const api = 'http://localhost:3000/scores';

const GameScreen = () => {
  const [points, setPoints] = useState<number>(0);
  const [step, setStep] = useState<number>(1);
  const [status, setStatus] = useState<GameStatus>('question');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [chosenOption, setChosenOption] = useState<number>(-1);

  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();

const saveScore = async (finalScore: number) => {
    try {
     await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: username,
        score: finalScore,
      }),
    });
   } catch (error) {
    console.log(error);
    Alert.alert('Erro', 'Não foi possível salvar a pontuação.');
    } finally {
    setStatus('end');
    }
  };
  const nextStep = () => {
    setChosenOption(-1);
    setStatus('question');
  };

  const confirmTry = async () => {
    let newPoints = points;

    const isCorrect =
      selectedCountry &&
      options[chosenOption] &&
      selectedCountry.name === options[chosenOption].name;

    if (isCorrect) {
      newPoints = points + 1;
      setPoints(newPoints);
      setStatus('hit');
    } else {
      setStatus('miss');
    }

    if (step === 10) {
      await saveScore(newPoints);
      return;
    }

    setStep((s) => s + 1);
  };

  useEffect(() => {
    if (status === 'question') {
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];

      setSelectedCountry(randomCountry);
    }
  }, [status]);

  useEffect(() => {
    if (selectedCountry) {
    let optionsArray = (_ as any).sample(countries, 3);

    optionsArray.push(selectedCountry);

    setOptions((_ as any).shuffle(optionsArray));
    }
  }, [selectedCountry]);

  if (status !== 'question') {
    return (
      <FeedbackScreen
        status={status}
        username={username}
        points={points}
        onContinue={nextStep}
        onRestart={() => {
          setPoints(0);
          setStep(1);
          setStatus('question');
        }}
        onQuit={() => router.replace('/')}
      />
    );
  }

  if (!selectedCountry) return <Text>Carregando ...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader
        onClose={() => router.replace('/')}
        step={step}
        points={points}
      />

      <FlagQuestion
        username={username || 'Jogador'}
        countryCode={selectedCountry.code}
      />

      <View style={styles.optionsContainer}>
        {options.map((option, idx) => (
          <OptionButton
            key={idx}
            label={option.name}
            isSelected={idx === chosenOption}
            onPress={() => setChosenOption(idx)}
          />
        ))}
      </View>

      <View style={styles.confirmContainer}>
        <Button
          title="Confirmar"
          color="green"
          disabled={chosenOption === -1}
          onPress={confirmTry}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  optionsContainer: {
    flex: 4,
    justifyContent: 'space-evenly',
  },
  confirmContainer: {
    flex: 1,
    margin: 50,
  },
});

export default GameScreen;