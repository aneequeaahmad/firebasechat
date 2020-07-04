import React from 'react';
import {Image} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';

import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Chat: ChatScreen,
});

AppStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = navigation.state.index === 0;

  return {
    tabBarVisible,
  };
};

const AuthStack = createStackNavigator({Login: LoginScreen});

const TabNavigation = createBottomTabNavigator(
  {
    Chats: AppStack,
    Profile: ProfileScreen, //define Items on bottom navigator
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let imageName = require('./images/message.png');
        let iconName;
        if (routeName === 'Profile') {
          imageName = require('./images/settings.png');
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
        }

        // You can return any component that you like here!
        return (
          <Image
            source={imageName}
            style={{width: 24, resizeMode: 'contain', tintColor}}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: TabNavigation, //was AppStack
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
