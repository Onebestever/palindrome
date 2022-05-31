const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db



const url = 'mongodb+srv://carlaH:wTUtPlW5gpU4ROH0@cluster0.hrwir.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'palindromeApp'

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.listen(3000, function() {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, 
        (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
    
    
}); 

app.get('/', (req, res) => {
    db.collection('palindrome').find().toArray((err, result) => {
        if (err) return console.log(err)
        console.log({palindrome: result})
        res.render('index.ejs', {palindrome: result})
      })
    
})

app.post('/checkWord', (req, res) => {
  console.log(req.body.word)
  let word = `${req.body.word}`
  let wordPal = word.toLowerCase().split('').reverse().join('')
          
  if ( word.toLowerCase() === wordPal) {
      conclusion = 'WOO-HOO! A Palindrome'
  } else {
      conclusion = 'BOO! Tomatoes'
  }

    db.collection('palindrome').insertOne({word: req.body.word, outcome: conclusion})
      .then(result => {
        console.log('saved to database')
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })