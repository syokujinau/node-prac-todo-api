# Nodejs MongoDB notebook 2018/10/7

* 用Robo 3T查看mongoDB
* [MongoDB Node.JS Driver](https://mongodb.github.io/node-mongodb-native/)

## MongoDB setup

```shell=
C:\Program Files\MongoDB\Server\4.0\bin>mongod.exe --dbpath C:\Users\npr28\mongo-data
```
之後使用不用重開

## MongoDB v2、v3連線程式差異

v3第一個callback傳入client
![](https://i.imgur.com/YyBAf66.jpg)

## Writing Data

```js=
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo ', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })

    db.collection('Users').insertOne({
        name: 'yc',
        age: 22,
        location: 'Taipei'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo ', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })


    db.close();
});
```

* 儲存結構
![](https://i.imgur.com/7lTCq9e.png)

## The Object Id

id不用1、2、3...這種流水號的方式，而是使用自動產生的identifier，目的是為了方便擴大database server，來handle額外loading
* _id可以自訂
* 自動產生的_id有encode timestamp，所以不用自己紀錄時間欄位
* 使用result.ops是陣列，可以查看insert的物件
* _id.getTimestamp()可以查看時間

```js
console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
```

### destructuring assignment 與 ObjectID物件

```js 
var obj = {name: 'YC', age:22}
var {age} = obj 
age //22

//以下2行功能相同
const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');
```

## Fetching Data

### 查詢database所有內容
```js=
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').find().toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Uable to fetch todos ', err)
    })

    db.close();
});
```

### 查詢特定key、value pair

```js=
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    let target = {completed: false} //find the specific (key, value)
    db.collection('Todos').find(target).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Uable to fetch todos ', err)
    })

    db.close();
});
```

### 查詢特定id

```js=
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    let target_id = { //find the specific id
        _id: new ObjectID('5bbac3d20eaeb04f649e46b7')
    } 
    db.collection('Todos').find(target_id).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Uable to fetch todos ', err)
    })

    db.close();
});
```

### 計算資料量

* [MongoDB Driver API: count](http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html#count)

```js=
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Uable to fetch todos ', err)
    })

    db.close();
});
```

## Deleting Documents

### delete many

刪除所有符合{text: 'Eat launch'}的資料
```js
db.collection('Todos').deleteMany({text: 'Eat launch'}).then((result) => {
        console.log(result.result) //{ n: 0, ok: 1 }代表ok，刪除n個，因為沒這筆所以刪除0個
    })
```

### delete one

刪除第一筆符合{text: 'Eat dinner'}的資料
```js
db.collection('Todos').deleteOne({text: 'Eat dinneer'}).then((result) => {
        console.log(result.result) //{ n: 1, ok: 1 }代表ok，刪除1個
    })
```

### find One And Delete

查詢一筆並且刪除

```js
db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result)
})
```

## Updating Data

[findOneAndUpdate API](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/)

> must use [update operator](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set) to change data
> Update有很多做法，比如說用$inc可以讓特定key的value增加數值，但一定要透過[Field Update Operator](https://docs.mongodb.com/manual/reference/operator/update-field/)

```js=
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5bbac43cb781073f60d69fc2')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false //回傳更新後的資料
    }).then((result) => {
        console.log(result);
    })
    

    db.close();
});
```

## mongoose ODM

> Node.js 專用的 MongoDB ODM，類似SQL資料庫 schema-based 的方式，來操作MongoDB，model的第二個參數就是schema

```js=
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

// var Todo1 = new Todo({
//   text: '買菜'
// });
//
// Todo1.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save todo')
// });

var Todo2 = new Todo({
  text: '煮飯',
  completed: true,
  completedAt: 123
});

Todo2.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save', e);
});

```

## Mongoose Validation

用於定義必填欄位、最小字串長度、trim(空格設1)、給予default value...etc
* [Mongoose v5.3.2: Validation](https://mongoosejs.com/docs/validation.html) 

```js=
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, //必填
    minlength: 1,   //字串長度至少1
    trim: true      //刪多餘空格
  },
  completed: {
    type: Boolean,
    default: false  //預設值為false
  },
  completedAt: {
    type: Number,
    default: null   //預設值為null
  }
});

var todo1 = new Todo({
    text: '吃飯' //其他欄位將有default值
})

todo1.save().then((doc) => {
    console.log('todo saved', doc);
}, (e) => {
    console.log('Unable to save todo', e);
})
```

```js= 
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
})

var user1 = new User({
    email: 'abc123@gmail.com'
})

user1.save().then((doc) => {
    console.log('User saved', doc);
}, (e) => {
    console.log('Unable to save user', e);
})
```

## 檔案結構化RESTful API

see repo

