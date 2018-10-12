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