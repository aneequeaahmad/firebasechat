import React from 'react';
import {ActivityIndicator, AsyncStorage, StatusBar, View} from 'react-native';
import User from '../User';
import firebase from 'firebase';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentWillMount() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCFc31nmH2HqKxBNjwHeDHEfGxhxkQlOBU',
      authDomain: 'fir-chat-5de38.firebaseapp.com',
      databaseURL: 'https://fir-chat-5de38.firebaseio.com',
      projectId: 'fir-chat-5de38',
      storageBucket: 'fir-chat-5de38.appspot.com',
      messagingSenderId: '727233093720',
      appId: '1:727233093720:web:5b52950ff072d3e8ceea2d',
      measurementId: 'G-L40S1DTXL6',
    };

    firebase.initializeApp(firebaseConfig);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
