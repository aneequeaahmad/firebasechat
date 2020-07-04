import React, {Component} from 'react';
import {
  Alert,
  AsyncStorage,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/styles';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      name: '',
    };
  }
  static navigationOptions = {
    header: null,
  };

  handleChange = (key) => (val) => {
    this.setState({[key]: val});
  };

  submitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert('Error', 'Wrong phone number');
    } else if (this.state.name.length < 3) {
      Alert.alert('Error Wrong name');
    } else {
      //save user data
      await AsyncStorage.setItem('userPhone', this.state.phone);
      User.phone = this.state.phone;

      firebase
        .database()
        .ref('users/' + User.phone)
        .set({name: this.state.name});
      this.props.navigation.navigate('App');
    }
    alert(this.state.phone + '\n' + this.state.name);
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Phone number"
          keyboardType="number-pad"
          style={styles.input}
          value={this.state.phone}
          onChangeText={this.handleChange('phone')}></TextInput>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')}></TextInput>
        <TouchableOpacity onPress={this.submitForm}>
          <Text style={styles.btnText}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
