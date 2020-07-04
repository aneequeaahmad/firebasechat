import React from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    users: [],
    dbRef: firebase.database().ref('users'),
  };

  componentWillMount() {
    this.state.dbRef.on('child_added', (val) => {
      let person = val.val();
      person.phone = val.key;
      if (person.phone === User.phone) {
        User.name = person.name;
      }
      this.setState((previousState) => {
        return {
          users: [...previousState.users, person],
        };
      });
    });
  }

  componentWillUnmount() {
    this.state.dbRef.off();
  }

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}
        onPress={() => this.props.navigation.navigate('Chat', item)}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {width, height} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <FlatList
          style={{height: height}}
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={(item) => item.phone}
          ListHeaderComponent={() => (
            <Text
              style={{
                fontSize: 30,
                marginVertical: 10,
                marginLeft: 10,
                fontWeight: 'bold',
              }}>
              Chats
            </Text>
          )}
        />
      </SafeAreaView>
    );
  }
}
