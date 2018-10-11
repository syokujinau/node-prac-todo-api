const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat launch'}).then((result) => {
    //     console.log(result.result) //{ n: 0, ok: 1 }代表ok，刪除n個，因為沒這筆所以刪除0個
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat dinneer'}).then((result) => {
    //     console.log(result.result) //{ n: 1, ok: 1 }代表ok，刪除1個
    // })

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result)
    // })

    

    db.close();
});