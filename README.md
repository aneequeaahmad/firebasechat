# firebasechat


#APP.js

Stack navigators are created i-e AppStack and AuthStack
navigtion bar is added at the bottom if the user is authenticated.

###Login Screen

When the user credentials are submited we validate the user input and set the User data in local storage.

We also added a User object(Can be redux storage) which stores the User data.

User name and phone number is set in database (if user doesn't exist before) or just logs in if user already exist and navigate to chat screen. 


