const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')
const {ObjectID} = require('mongodb');

var id = '5a0f8d1521ab9d6608888c41';

if(!ObjectID.isValid(id)){
  console.log('ID not valid');
}
// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });

Todo.findById(id).then((todo)=>{
  if(!todo){
    return console.log('Id not found');
  }
  console.log('Todo By Id', todo);
}).catch((e)=>console.log(e));

id = '5a0cfda2e2de695d8273545d';

//returns the array of users
User.find({
  _id: id
}).then((users)=>{
  console.log('Users', users);
}).catch((e)=> console.log(e));

//returns the one user by id with method 'findOne'
User.findOne({
  _id: id
}).then((user)=>{
  console.log('User', user);
}).catch((e)=> console.log(e));

User.findById(id).then((user)=>{
  if(!user || !ObjectID.isValid(id)){
    return console.log('Id not found');
  }
  console.log('User by ID', JSON.stringify(user, undefined, 2));
}).catch((e)=> console.log(e));
