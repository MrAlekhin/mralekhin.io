// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');
  db.collection('Users').insertOne({
    name: 'Artem',
    age: 19,
    locaton: 'Moscow'
  }, (err, result)=>{
    if(err){
      return console.log('Unable to insert todo ', err);
    }
    console.log(result.ops[0]._id.getTimestamp());
    console.log();
  });

  db.close();
});
