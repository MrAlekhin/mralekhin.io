require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {Project} = require('./models/project');
var {authenticate} = require('./middleware/authenticate');
const publicPath = path.join(__dirname, '../public');
var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(publicPath));
//add the ne todo
app.post('/todos', authenticate, (req, res)=>{
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc)=>{
    res.status(200).send(doc);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

//gets the list of todos
app.get('/todos', authenticate, (req, res)=>{
  Todo.find({
    _creator: req.user._id
  }).then((todos)=>{
    res.send({todos});
  }).catch((e)=>{
    res.status(400).send(e)
  });
})

//gets the specific todo by id
app.get('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

//delets the todo by id
app.delete('/todos/:id', authenticate, async (req, res)=>{
  const id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  try{
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  } catch (e){
    res.status(400).send();
  }
});

//editing the todo by id
app.patch('/todos/:id', authenticate, (req, res)=>{
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
})

//adds the new user
app.post('/users', async (req, res)=>{
  try{
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    var token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }catch(e){
    res.status(400).send(e);
  }
});

//authenticate the user
app.get('/users/me', authenticate, (req, res)=>{
  res.send(req.user);
})

//post /users/login {email, password}
app.post('/users/login', async (req, res)=>{
  try{
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }catch (e){
    res.status(400).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, res)=>{
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
});

app.post('/projects', authenticate, async (req, res)=>{
  try{
    // const body = _.pick(req.body, ['projectName', 'image', 'shortDescription', 'tags']);
    var project = new Project(req.body);
    project.save().then((doc)=>{
      res.status(200).send(doc);
    }).catch((e)=>{
      res.status(400).send(e);
    });
  }catch(e){
    res.status(400).send(e);
  }
})

app.listen(port, ()=>{
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
