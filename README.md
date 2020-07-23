# firebasechat


# APP.js

Stack navigators are created i-e AppStack and AuthStack
navigtion bar is added at the bottom if the user is authenticated.

### Login Screen

When the user credentials are submited we validate the user input and set the User data in local storage.

We also added a User object(Can be redux storage) which stores the User data.

User name and phone number is set in database (if user doesn't exist before) or just logs in if user already exist and navigate to chat screen. 

### AuthLoadingScreen

AuthLoadingScreen checks if the User phone already exists in storage it navigated to App stack otherwise AuthStack


### HomeScreen

When the user login in successfully, HomeScreen appears which renders all the users which are set in state componentWillMount. When the user is clicked it navigates to ChatScreen and shows all messages in a FlatList. When the new message is sent from the other user firebase ref get the new message in realtime using ref.child().on('child_added) and appedns the message in previous state of messageList.

## ProfileScreen

We can add the profile picture of user and uploads that in database.
It also has logout button which clears the local storage and navigates the app to Auth screen. 

