import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  Image,
  View,
  Text,
  TextInput,
  Animated,
  Platform,
  Keyboard,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import firebase from 'firebase';
import styles from '../constants/styles';
import User from '../User';

const isIOS = Platform.OS === 'ios';

export default class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      person: {
        name: props.navigation.getParam('name'),
        phone: props.navigation.getParam('phone'),
      },
      textMessage: '',
      messageList: [],
      dbRef: firebase.database().ref('messages'),
    };
    this.keyboardHeight = new Animated.Value(0);
    this.bottomPadding = new Animated.Value(60);
  }

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(
      isIOS ? 'keyboardWillShow' : '  keyboardDidShow',
      (e) => this.keyboardEvent(e, true),
    );

    this.keyboardHideListener = Keyboard.addListener(
      isIOS ? 'keyboardWillHide' : '  keyboardDidHide',
      (e) => this.keyboardEvent(e, false),
    );
    this.state.dbRef
      .child(User.phone)
      .child(this.state.person.phone)
      .on('child_added', (value) => {
        this.setState((previousState) => {
          return {
            messageList: [...previousState.messageList, value.val()],
          };
        });
      });
  }

  componentWillUnmount() {
    this.state.dbRef.off();
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardEvent = (event, isShow) => {
    let heightOS = isIOS ? 60 : 80;
    let bottomOS = isIOS ? 120 : 140;
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: isShow ? heightOS : 0,
      }),
      Animated.timing(this.bottomPadding, {
        duration: event.duration,
        toValue: isShow ? bottomOS : 60,
      }),
    ]).start();
  };
  convertTimeStamp = (time) => {
    let date = new Date(time);
    let latestDate = new Date();

    let result = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':';
    result += (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    if (latestDate.getDay() !== date.getDay()) {
      result = date.getDay() + ' ' + date.getMonth() + ' ' + result;
    }
    return result;
  };

  handleChange = (key) => (val) => {
    this.setState({[key]: val});
  };
  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = this.state.dbRef
        .child(User.phone)
        .child(this.state.person.phone)
        .push().key;

      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.phone,
      };
      updates[
        User.phone + '/' + this.state.person.phone + '/' + msgId
      ] = message;
      updates[
        this.state.person.phone + '/' + User.phone + '/' + msgId
      ] = message;

      this.state.dbRef.update(updates);
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    const isUserPhoneNo = item.from === User.phone;
    return (
      <View
        style={{
          flexDirection: 'row',
          maxWidth: '60%',
          alignSelf: isUserPhoneNo ? 'flex-end' : 'flex-start',
          backgroundColor: isUserPhoneNo ? '#00897b' : '#7cb342',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text style={{color: '#eee', padding: 3, fontSize: 12}}>
          {this.convertTimeStamp(item.time)}
        </Text>
      </View>
    );
  };

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <KeyboardAvoidingView behaviou="height" style={{flex: 1}}>
        <Animated.View
          style={[styles.bottomBar, {bottom: this.keyboardHeight}]}>
          <TextInput
            style={styles.inputMessage}
            value={this.state.textMessage}
            placeholder="Type Message...."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage} style={styles.sendBtn}>
            <Image
              source={require('../images/send.png')}
              style={{tintColor: 'white', resizeMode: 'contain', height: 20}}
            />
          </TouchableOpacity>
        </Animated.View>
        <FlatList
          ref={(ref) => (this.flatList = ref)}
          onContentSizeChange={() =>
            this.flatList.scrollToEnd({animated: true})
          }
          onLayout={() => this.flatList.scrollToEnd({animated: true})}
          style={{paddingTop: 5, paddingHorizontal: 5, height}} //was height + 0.8
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            <Animated.View style={{height: this.bottomPadding}} />
          }
        />
      </KeyboardAvoidingView>
    );
  }
}
what
