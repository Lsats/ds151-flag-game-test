import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { countries } from '../data/countries';
// @ts-ignore
import _ from '../../underscore-esm-min';
import { GameHeader } from '../components/GameHeader';
import { FlagQuestion } from '../components/FlagQuestion';
import { OptionButton } from '../components/OptionButton';
import { FeedbackScreen } from '../components/FeedbackScreen';
import { useCronometro } from '../hooks/useCronometro';

interface Country {
  name: string;
  code: string;
}

type GameStatus = 'question' | 'hit' | 'miss' | 'end';

const api = 'http://localhost:3000/timedscores';

const GameTimedScreen = () => {
  const [points, setPoints] = useState<number>(0);

  const [status, setStatus] =
    useState<GameStatus>('question');

  const [selectedCountry, setSelectedCountry] =
    useState<Country | null>(null);

  const [options, setOptions] = useState<Country[]>([]);

  const [chosenOption, setChosenOption] =
    useState<number>(-1);

  const [finished, setFinished] =
    useState<boolean>(false);

  const router = useRouter();

  const { username } =
    useLocalSearchParams<{ username: string }>();

  const saveScore = async () => {
    try {
      await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: username,
          score: points,
        }),
      });
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível salvar a pontuação.'
      );
    } finally {
      setStatus('end');
    }
  };

  const tempoRestante = useCronometro(30, () => {
    setFinished(true);
  });

  useEffect(() => {
    if (finished) {
      saveScore();
    }
  }, [finished]);

  const nextQuestion = () => {
    setChosenOption(-1);
    setStatus('question');
  };

  const confirmTry = () => {
    const isCorrect =
      selectedCountry &&
      options[chosenOption] &&
      selectedCountry.name ===
        options[chosenOption].name;

    if (isCorrect) {
      setPoints((p) => p + 1);
      setStatus('hit');
    } else {
      setStatus('miss');
    }
  };

  useEffect(() => {
    if (status === 'question') {
      const randomCountry =
        countries[
          Math.floor(
            Math.random() * countries.length
          )
        ];

      setSelectedCountry(randomCountry);
    }
  }, [status]);

  useEffect(() => {
    if (selectedCountry) {
      let optionsArray = (_ as any).sample(
        countries,
        3
      );

      optionsArray.push(selectedCountry);

      setOptions(
        (_ as any).shuffle(optionsArray)
      );
    }
  }, [selectedCountry]);

  if (status !== 'question') {
    return (
      <FeedbackScreen
        status={status}
        username={username}
        points={points}
        onContinue={nextQuestion}
        onRestart={() => {
          setPoints(0);
          setStatus('question');
        }}
        onQuit={() => router.replace('/')}
      />
    );
  }

  if (!selectedCountry)
    return <Text>Carregando...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>
          Tempo: {tempoRestante}s
        </Text>
      </View>

      <GameHeader
        onClose={() => router.replace('/')}
        step={0}
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

  timerContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  timer: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
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

export default GameTimedScreen;