// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // })

  // deleteOne
  // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // })

  // find one and delete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
  //   console.log(result);
  // });


  // db.collection('Users').deleteMany({name: 'Artem'}).then((result)=>{
  //   console.log(result);
  // });
    // db.collection('Users').deleteOne({name: 'Andrew'}).then((result)=>{
    //   console.log(result);
    // })
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5a0ca42ff0bbab71ba9ecf7a')
  }).then((result)=>{
    console.log(result);
  })
});
