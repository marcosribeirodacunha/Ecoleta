import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface SelectItem {
  key: number;
  label: string;
  value: string;
}

interface IBGEUFResponse {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECityResponse {
  id: number;
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  // Get all UFs to show inside select
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then(response => {
        const ufs = response.data.map(uf => ({
          key: uf.id,
          label: uf.nome,
          value: uf.sigla,
        }));
        setUfs(ufs);
      });
  }, []);

  // Get all cities from a given UF
  useEffect(() => {
    if (selectedUf === '0') {
      setCities([]);
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then(response => {
        const cities = response.data.map(city => ({
          key: city.id,
          label: city.nome,
          value: city.nome,
        }));

        setCities(cities);
      });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    if (selectedCity === '0') {
      Alert.alert('Please select a city.');
      return;
    }

    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos.
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            style={{ inputAndroid: styles.input, inputIOS: styles.input }}
            useNativeAndroidPickerStyle={false}
            onValueChange={value => setSelectedUf(value)}
            placeholder={{
              label: 'Selecione uma UF',
              value: '0',
              color: '#ccc',
            }}
            items={ufs}
          />

          <RNPickerSelect
            style={{ inputAndroid: styles.input, inputIOS: styles.input }}
            useNativeAndroidPickerStyle={false}
            onValueChange={value => setSelectedCity(value)}
            placeholder={{
              label: 'Selecione uma cidade',
              value: '0',
              color: '#ccc',
            }}
            items={cities}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setSelectedUf}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite a cidade"
            autoCorrect={false}0
            onChangeText={setSelectedCity}
          /> */}

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

export default Home;
