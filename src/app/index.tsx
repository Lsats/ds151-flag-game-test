import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const [username, setUsername] =
    useState<string>('');

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Bem-vindo
      </Text>

      <View style={styles.container_name}>
        <Text style={styles.labelName}>
          Digite seu nome
        </Text>

        <TextInput
          style={styles.textInput}
          value={username}
          onChangeText={(t) => setUsername(t)}
        />

        <View style={styles.buttonsContainer}>
          <Button
            title="Modo Normal"
            color="#0a0"
            disabled={username === ''}
            onPress={() => {
              router.push({
                pathname: '/game',
                params: { username: username },
              });
            }}
          />

          <Button
            title="Modo Temporizado"
            color="#a00"
            disabled={username === ''}
            onPress={() => {
              router.push({
                pathname: '/game-timed',
                params: { username: username },
              });
            }}
          />

          <Button
            title="Ver Placar"
            color="#004"
            onPress={() => router.push('/placar')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 50,
    color: '#004',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },

  container_name: {
    justifyContent: 'center',
    width: '80%',
  },

  labelName: {
    fontSize: 30,
    fontFamily: 'monospace',
  },

  textInput: {
    borderWidth: 2,
    margin: 20,
    borderColor: '#008',
    borderRadius: 20,
    padding: 20,
    fontSize: 20,
    fontFamily: 'monospace',
  },

  buttonsContainer: {
    gap: 15,
  },
});

export default HomeScreen;