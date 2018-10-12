var express = require('express'); //@4.14.0
var bodyParser = require('body-parser'); //@1.15.2
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose'); 
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json()); //middleware

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
    //add body you want...
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

// GET /todos/1234
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    
    // Valid id 
    if (!ObjectID.isValid(id)){
      return res.status(404).send('invalid id');
    }

    Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send('no data');
      }

      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    })

});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
