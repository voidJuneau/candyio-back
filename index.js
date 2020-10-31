const express = require('express');
const bodyParse = require('body-parser');
const postalValidator = require('postcode-validator');
const firebase = require('firebase');
require("firebase/firestore");

const app = express();
const port = 3000 | process.env.PORT;

// Initialize Cloud Firestore
firebase.initializeApp({
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
});
var db = firebase.firestore();

app.use(bodyParse.json());

app.get('/:postcode', (req, res) => {
  const code = req.params.postcode;
  if (!postalValidator.postcodeValidator(code, 'US')) {
    return res.status(400).send({error: "Sorry, enter valid US zip code."});
  }
  db.collection("zipMedian")
  .doc(code)
  .get()
  .then(docRef => {
    res.send(docRef.data());
  })
  .catch(e => {
    console.log(e);
    return res.status(500).send({error: "Sorry, there was an error on server."});
  });
//   db.collection("zipMedian").get().then((querySnapshot) => {
//     querySnapshot.forEach((code) => {
//         console.log(`${code.id} => ${doc.data()}`);
//     });
// });
})

app.get('/', (req, res) => {
  res.send({message: "hello world"});
})

app.listen(port, () => {
  console.log("Server learning on " + port);
})