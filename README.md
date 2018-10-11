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
        name: '宇謙',
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