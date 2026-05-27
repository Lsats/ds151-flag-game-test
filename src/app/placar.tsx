import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Score {
  id: string;
  name: string;
  score: number;
}

type ScoreType = 'normal' | 'timed';

const PlacarScreen = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [type, setType] = useState<ScoreType>('normal');
  const [loading, setLoading] = useState<boolean>(false);

  const getScores = async (scoreType: ScoreType) => {
    try {
      setLoading(true);

      const endpoint =
        scoreType === 'normal'
          ? 'http://localhost:3000/scores'
          : 'http://localhost:3000/timedscores';

      const response = await fetch(endpoint);

      const data = await response.json();

      data.sort((a: Score, b: Score) => b.score - a.score);

      setScores(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getScores(type);
  }, [type]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PLACAR</Text>

      <View style={styles.buttonsContainer}>
        <Button
          title="Placar Normal"
          onPress={() => setType('normal')}
        />

        <Button
          title="Placar Temporizado"
          onPress={() => setType('timed')}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.position}>
                #{index + 1}
              </Text>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.score}>
                {item.score} pts
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 20,
  },

  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  position: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  name: {
    fontSize: 18,
    flex: 1,
    marginLeft: 20,
  },

  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default PlacarScreen;