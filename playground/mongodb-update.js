// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5a0ca3370a148e7192791e15')
  },{
    $set: {
      completed: true,
    }
  }, {
    returnOriginal: false
  }).then((result)=> {
    console.log(result);
  })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a0cbbd949cfdc79e300d1ab')
  }, {
    $set: {
      name: 'Andrew'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  })

  db.close();
});
