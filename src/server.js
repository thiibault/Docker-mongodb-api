const express = require('express')
const app = express()
const port = 3000
//const users = require('../data/users.json')

const MongoClient = require('mongodb').MongoClient;

// connection Url:
const user = process.env.MONGO_INITDB_ROOT_USERNAME
const pwd = process.env.MONGO_INITDB_ROOT_PASSWORD

const url = `${user}:${pwd}@mongodb://mongo:27017/userAPI`;

// def data base to connect with :
//const dbName = 'usersApi';

 
// MongoClient.connect(url, function(err, res) {
//   console.log("Connected successfully to server");
//   const db = res.db(dbName);
// });


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get("/add", (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        //const db = res.db(dbName);
        const myobj = [
            {"id": 1, "username":"insetest", "privileges": "none", "password":"mypasswordtest"},
        ];
        db.collection("users").insertMany(myobj, function (err, db) {
            if (err) throw err;
            console.log("Number of objects inserted: " + db.insertedCount);
            db.close();
        });
    });
    res.send("Insertion succeeded");
})


app.get('/users', async (req,db) => {
    try {
        //const db = res.db(dbName);
        const docs = await db.collection('users').find({}).toArray()
        res.status(200).json(docs)
    } catch (err) {
        console.log(err)
        throw err
    }
})

app.get("/find", (re, res) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
    //   var dbo = db.db("mydb");
      db
        .collection("users")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          res.send(result);
          console.log(result);
          db.close();
        });
    });
})



app.get('/users/:id', async (req,db) => {
    const id = parseInt(req.params.id)
    try {
        //const db = res.db(dbName);
        const docs = await db.collection('users').find({id}).toArray()
        res.status(200).json(docs)
    } catch (err) {
        console.log(err)
        throw err
    }
})

app.listen(port, () => {
    console.log(`Server listening ! on port : ${port}`)
})