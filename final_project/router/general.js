const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
      if (isValid(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "User already exists!"});    
        }
  } else {
      return res.status(404).json({message: "Provide Username and Password"});
  }
});

function bookList () {
    return new Promise ((resolve, reject) => {
        resolve(books)
    })
}

async function getBookList(){
    return books;
}
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  const data = await getBookList();
  response = { books: data};
  res.send(JSON.stringify(response, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  bookList()
    .then(data => {
        let book = data[isbn];
        if (book) {
            return res.send(JSON.stringify(book, null, 4));
        } else {
            return res.send("Book not found");
        }        
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred.');
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    booksList = [];
    bookList()
    .then(data => {
        for (key in data){
            if (data[key]["author"] === author){
                booksList.push(data[key]); 
            }
        }
        if (booksList.length > 0) {
            response = { booksbyauthor: booksList };
            return res.send(JSON.stringify(response, null, 4));
        } else {
            return res.send("Book not found");
        }     
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred.');
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  booksList = [];
  bookList()
    .then(data => {
        for (key in data){
            if (data[key]["title"] === title){
                booksList.push(data[key]); 
            }
        }
        if (booksList.length > 0) {
            response = { booksbytitle: booksList };
            return res.send(JSON.stringify(response, null, 4));
        } else {
            return res.send("Book not found");
        }     
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred.');
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  let reviews = books[isbn]["reviews"]
  if (reviews) {
      if(reviews.lenth > 0){
        return res.send(JSON.stringify(reviews, null, 4));
      } else {
        return res.send("There are no reviews for the book title " + books[isbn]["title"]);
      }  
  } else {
    return res.send("Book not found");
  }
});

module.exports.general = public_users;
