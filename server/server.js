require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

//add the ne todo
app.post('/todos', (req, res)=>{
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.status(200).send(doc);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

//gets the list of todos
app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }).catch((e)=>{
    res.status(400).send(e)
  });
})

//gets the specific todo by id
app.get('/todos/:id', (req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

//delets the todo by id
app.delete('/todos/:id', (req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

//editing the todo by id
app.patch('/todos/:id', (req, res)=>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
})

//adds the new user
app.post('/users', (req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save().then((user)=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.listen(port, ()=>{
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
