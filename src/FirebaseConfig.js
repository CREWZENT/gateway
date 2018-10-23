const firebase = require('firebase/app');
require('firebase/auth')
require('firebase/firestore');

const config = {
  apiKey: "AIzaSyDzu-r5tszpMVG1cfOBBzZWgRSkdlGRPik",
  authDomain: "gateway-b4288.firebaseapp.com",
  databaseURL: "https://gateway-b4288.firebaseio.com",
  projectId: "gateway-b4288",
  storageBucket: "gateway-b4288.appspot.com",
  messagingSenderId: "1079415994628"
};

firebase.initializeApp(config);

export default firebase;
