const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')
const {ObjectID} = require('mongodb');

Todo.remove({}).then((result)=>{
  console.log(result);
});

// Tode.findOneAndReemove({_id:'5a0fd5fc52b3e00f8731b85e'}).then((result)=>{
// console.log(result);
// });

Todo.findByIdAndRemove('5a0fd5fc52b3e00f8731b85e').then((result)=>{
  console.log(result);
});
