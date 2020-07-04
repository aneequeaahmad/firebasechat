import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import User from '../User';
import styles from '../constants/styles';
import firebase from 'firebase';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    name: User.name,
    imageSource: require('../images/userProfile.png'),
    upload: false,
  };

  handleChange = (key) => (val) => {
    this.setState({[key]: val});
  };
  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  changeName = async () => {
    if (this.state.name.length < 3) {
      Alert.alert('Error', 'Please Enter valid name');
    }
    if (User.name !== this.state.name) {
      await firebase
        .database()
        .ref('users')
        .child(User.phone)
        .set({name: this.state.name});
      User.name = this.state.name;
      Alert.alert('Success', 'Name Changed Successful');
    }
  };

  changeImage = () => {
    console.log('Change image clicked');
    const options = {
      quality: 0.7,
      allowsEditing: true,
      mediaType: 'photo',
      noData: true,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        path: 'images',
        cameraRoll: true,
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        console.log(error);
      } else if (!response.didCancel) {
        console.log('Image Response');
        this.setState(
          {
            upload: true,
            imageSource: {uri: response.uri},
          },
          this.uploadFile,
        );
      }
    });
  };

  uploadFile = async () => {
    let file = await this.uriToBlob(this.state.imageSource.uri);
    firebase
      .storage()
      .ref(`profile_picture/${User.phone}.png`)
      .put(file)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => this.setState({upload: false, imageSource: {uri: url}}))
      .catch((error) => {
        this.setState({
          upload: false,
          imageSource: require('../images/userProfile.png'),
        });
        Alert.alert('Error in uploading file', error);
      });
  };

  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('Error on upload image'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={this.changeImage}>
          {this.state.upload ? (
            <ActivityIndicator size="large" />
          ) : (
            <Image
              style={{
                borderRadius: 100,
                width: 100,
                height: 100,
                resizeMode: 'cover',
                // tintColor: '#999',
                marginBottom: 10,
              }}
              source={this.state.imageSource}
            />
          )}
        </TouchableOpacity>
        <Text style={{fontSize: 20}}> {User.phone}</Text>
        <Text style={{fontSize: 20}}> {User.name}</Text>
        <TextInput
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')}
        />
        <TouchableOpacity onPress={this.changeName}>
          <Text style={styles.btnText}>Change Name</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._logout}>
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
