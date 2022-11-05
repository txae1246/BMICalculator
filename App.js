import React, { Component } from 'react';
import axios from 'axios';
import {
  Alert,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 2000);

const heightKey = '@MyApp:key1';
const resultsKey = '@MyApp:key2';

export default class App extends Component {
  state = {
    results: '',
    weight:  '',
    height:  '',
  };

  constructor(props) {
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(heightKey);
      const results = await AsyncStorage.getItem(resultsKey);
      this.setState({ height, results });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

   onCompute = async () => {
    const { weight, height } = this.state;
    try {
      await AsyncStorage.setItem(heightKey, height);
      const bmiCalc = ((weight/(height ** 2))*703).toFixed(1);
      const results = 'Body Mass Index is ' + bmiCalc;
      this.setState({ results })
      await AsyncStorage.setItem(resultsKey, results);
    } catch (error) {
      Alert.alert('Error', 'There was an error while calculating:  ${error}');
    }
  }

  onWeightChange = (weight) => this.setState({ weight });
  onHeightChange = (height) => this.setState({ height });

  render() {
    const { storedHeight, storedResults, results, weight, height  } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style ={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
          <TextInput
            ref={(input => {this.weightText = input})}
            style={styles.input}
            onChangeText={this.onWeightChange}
            value={weight}
            placeholder="Weight in Pounds"
          />
          <TextInput
            ref={(input => {this.heightText = input})}
            style={styles.input}
            onChangeText={this.onHeightChange}
            value={height}
            placeholder="Height in Inches"
          />
          <TouchableOpacity 
            onPress={this.onCompute} 
            style={styles.button}>
              <Text style={styles.buttonText}>Compute BMI</Text>
            </TouchableOpacity>
          <Text style={styles.preview}>{results}</Text>
          <Text style={styles.assessing}>Assessing Your BMI</Text>
          <Text style={styles.assessmentLevels}>
            Underweight:  less than 18.5{"\n"}
            Healthy:  18.5 to 24.9{"\n"}
            Overweight:  25.0 to 29.9{"\n"}
            Obese:  30.0 or higher
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar:  {
    backgroundColor:  '#f4511e',
    color:  '#fff',
    textAlign:  'center',
    padding:  25,
    fontSize:  28,
    fontWeight:  'bold',
  },
  content:  {
    flex:  1,
    padding:  10,
  },
  preview: {
    backgroundColor: '#ffffff',
    flex:  1,
    height: 100,
    fontSize:  28,
    fontColor:  '#000000',
    textAlign:  'center'
  },
  input:  {
    fontSize:  24,
    backgroundColor:  '#ecf0f1',
    borderRadius:  3,
    height:  40,
    padding:  5,
    marginBottom:  10,
    flex:  1,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
  },
  buttonText:  {
    fontSize:  24,
    color:  '#ffffff',
    textAlign:  'center',
    alignItems:  'center'
  },
  assessing:  {
    fontSize:  20
  },
  assessmentLevels:  {
    fontSize:  20,
    paddingLeft:  25
  },
});