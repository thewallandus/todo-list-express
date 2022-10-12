const deleteBtn = document.querySelectorAll('.fa-trash')
// this is the selector for the trash icon
// querySelectorAll is getting all the trash icons
const item = document.querySelectorAll('.item span')
// creating a variable that is selection a class of item that has a span inside it
// in ejs it is our span inside the list item we created with ejs
const itemCompleted = document.querySelectorAll('.item span.completed')
// creating a variable that's assigning to a selection of spans but the spans must also have .completed ass the class

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) // close our loop
// we're taking those delete buttons and creating an array
// then we're looping through them
// and then we're adding an eventListener
// and calling the deleteItem function

Array.from(item).forEach((element)=>{ // creating an array and starting a loop
    element.addEventListener('click', markComplete)
    // then run the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // creating an array from item completed
    // then running a forloop
    element.addEventListener('click', markUnComplete)
    // then we're adding an event listener to it
    // and running the markUnComplete
})

async function deleteItem(){ // starting an asynchronous function
    // it will allow us to change the flow of execution
    // more flexibility on when or how things will run
    const itemText = this.parentNode.childNodes[1].innerText
    // innerText => text inside of an element
    // looks inside of the list item and grabs only the innertext within the list span
    try{
        // we're declaing a try block
        // allows us to run something
        const response = await fetch('deleteItem', {
            // we're making a fetch request by creating a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete',
            // method is the delete that sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},
            // letting the server know we're sending JSON data
            body: JSON.stringify({ // declare the message content being passed and stringify that content
              'itemFromJS': itemText
              // this will be passed inside the body
              // so we're setting the content of the body to the inner text
              // of the list item and naming it 'itemFromJS'
            })
            // here we are closing the body
            // and closing the object
          })
        const data = await response.json()
        // we're waiting for the server to respond with json
        // for the response to be converted
        console.log(data)
        // logging the data to the console
        location.reload()
        // reloads the page to update what is displayed

    }catch(err){ // if an error occurs
        // pass it into the catch
        console.log(err)
        // log this error to the console
    } // catch block allows us to catch any errors
}

async function markComplete(){ // declare an async function
    const itemText = this.parentNode.childNodes[1].innerText
    // we're selecting itemText
    // reaching into the span
    // and getting innertext of that span
    try{ // starting a try block to do something
        const response = await fetch('markComplete', {
            // we're declaring a response
            // that's calling markcomplete
            // put is update
            method: 'put',
            // put is update: setting CRUD method to update for the route
            headers: {'Content-Type': 'application/json'},
            // we're saying this will be JSON and stringifying the content
            body: JSON.stringify({
                'itemFromJS': itemText
            // we're naming it itemText
            })
          })
        const data = await response.json() // then we're awaiting the data that's coming back
        console.log(data)
        // we'll console log that data
        location.reload()
        // then we'll reload that page

    }catch(err){ //we're setting this up to catch any errors
        console.log(err)
        // we log the error to the console
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    // we're selecting our item text
    try{
        const response = await fetch('markUnComplete', {
            // we're sending data to markUnComplete
            method: 'put',
            // we're making an update data
            headers: {'Content-Type': 'application/json'},
            // we're letting server know that we're sending json data
            body: JSON.stringify({
                'itemFromJS': itemText
            // setting the content of the body to the inner text of the list item
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}