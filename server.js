const express = require('express')
// making it possible to use express
const app = express()
// we're calling the express function and saving it as app instead of doing it again and again
const MongoClient = require('mongodb').MongoClient
// we're connecting to MongoDB database and this is how we initialize it
// MongoDB is the location we're storing the data
// Mongoclient is the way we're using and getting things from the mongoclient
const PORT = 2121
// this is the PORT that we're running
// where our server is listening
// setting it up as a variable
require('dotenv').config()
// this is how we set up dotenv
// and allows us to access the variables we've saved inside the DOT ENV file

let db, // we're declaring 3 variable ==> here we declared it but didnt' assign any value
    dbConnectionStr = process.env.DB_STRING, // here we assigned dbConnectionStr and tied it to process.env.DB_STRING
    dbName = 'todo'
    // and here we named the dbName and set it as 'todo'
    // we're setting the name of the database essentially

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // ^ here we're connecting to the Mongo Database
    // ^ and passing in connection string 
    // ^ useUnifiedTopology is what we pass in
    .then(client => {
        // Why are we using then here?
        // Because MongoClient.connect is establishing a promise
        // then we can connect a .then to it
        // we want it to be a promise and then .then because we only want to console log to the thing if it is successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`)
        // ^ connected to the database that we're connecting to
        db = client.db(dbName)
        // ^ assigning a value to previously declared db variable that contains 
        // we're assinging it to db so that we can use it later
        // contains a db client factory method
    })

// MIDDLEWARES:
// in between server and client it helps us handle stuff
app.set('view engine', 'ejs') 
// ^ sets ejs as the default render
app.use(express.static('public'))
// we want to make sure that our code knows where to look
// for static assets which is the public folder here
app.use(express.urlencoded({ extended: true }))
// tells express to decode and encode URLs where the header
// matches the content
// Supports arrays and objects
app.use(express.json())
// parsing the content so that the server can read json content

app.get('/',async (request, response)=>{ // read of CRUD
    // first argument is the route => here it is '/'
    // that's the route
    // when there is any load, refreshing the page,
    // request that we make
    // and the response we get back from it

    const todoItems = await db.collection('todos').find().toArray() // it is going to the db object and gets the collection of 'todos' then finding something then transforms it to array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // we're setting a variable and awaits and that's getting the count of documents
    // we need this data to display the total number of items that we need to display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // we're rendering our index.ejs
    // inside that we are passing through the db items and the count remaining inside of an object
    // that is going into the ejs
    // ejs just takes it straight out of the database
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // ^// this is doing it with .then
    // we can use either async or .then both works
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // here /addTodo
    // post method is the create method in CRUD when the addTodo route is passed in
    // this is coming from the form
    // the action was addTodo
    // here we are syncing with it
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // go to the db find collection that has todos
    // we're inserting a newitem
    // there is a request coming from the client side
    // it has a body
    // todoItem is the name of the input box inside our form
    // we're also setting completed to false
    // because when something is completed
    // then we've got the strike through on it
    // gives it a completed value of false by default
    // if insert is successful do something
    .then(result => { // if
        console.log('Todo Added') // console.log this string
        response.redirect('/') // once it is done, and the thing has been updated, render the main page again
        // so it's like I don't want to stay in /addTodo
        // no I want to be in /
    })
    .catch(error => console.error(error))
    // in case there are any errors I can catch it
})

app.put('/markComplete', (request, response) => {
    // we're starting a put method
    // we also have a req, res as usual
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true
            // setting the completed value to true
          }
    },{
        sort: {_id: -1}, // moves the item to the bottom of the list
        upsert: false // if the value did not exist it will insert it for us
    })
    .then(result => { // starting a then if update was successful
        console.log('Marked Complete') // saying update was complete
        response.json('Marked Complete') // we send this response back to the sender in main.js
    })
    .catch(error => console.error(error)) // we're catching errors

})

app.put('/markUnComplete', (request, response) => { // starting a put but the route is different
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        // go to the db collection
        // go update one method
        $set: {
            completed: false
          } // setting completed to false
    },{
        sort: {_id: -1}, // moving to the bottom of the list
        upsert: false // if the value does not exist it will insert it for us
    }) 
    .then(result => {
        console.log('Marked Complete')
        // we console log marked complete
        response.json('Marked Complete')
        // we respond back to the js file with response json
        // that is being received in main.js
    })
    .catch(error => console.error(error))
    // catching the error
})

app.delete('/deleteItem', (request, response) => {
    // go to the deleteItem
    // then we get request, response
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // go into the db
    // find the collection that has the name todos
    // then call deleteOne method
    // go and check the thing that has the item name
    // check the ONE itm that has a matching name from our js file
    .then(result => { // if successful
        console.log('Todo Deleted') // delete this
        response.json('Todo Deleted') // then send the response back to the sender
    })
    .catch(error => console.error(error)) // catch error

})

app.listen(process.env.PORT || PORT, ()=>{ // specifying which port we will be listening on
    // gets it from .env file
    // or takes from the port variable in the server js
    console.log(`Server running on port ${PORT}`)
    // console logs that the server is successfully running in our port
})