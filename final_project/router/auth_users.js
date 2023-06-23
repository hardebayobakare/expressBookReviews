const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
      }//returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    let validuser = users.filter((user) => {
        return (user.username === username && user.password === password)
    })
    if(validuser.length > 0){
        return true;
    } else {
        return false;
    }
//returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
      if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, "access", {expiresIn: 60 * 60});

        req.session.authorization = {accessToken, username}

        return res.status(200).send("User successfully logged in");

      } else {
        return res.status(404).json({message: "Invalid username or password or user not registered"});
      }
  } else {
    return res.status(404).json({message: "Provide Username and Password"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here\
  const isbn = req.params.isbn;
  username = req.session.authorization["username"];
  let review = req.body.review;
  if(username){
    if (books[parseInt(isbn)]) {
        if (review){
          books[parseInt(isbn)]["reviews"][username] = review;
          return res.status(200).send("The review for the book ISBN " + isbn + " has been added/updated");
        } else {
          return res.status(404).json({message: "Provide Review Content"});
        }
    } else {
      return res.send("Book not found");
    }
  } else {
    return res.status(403).json({message: "Login to continue"})
  }
  

});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    username = req.session.authorization["username"];
    if(username){
        delete books[parseInt(isbn)]["reviews"][username];
        return res.status(200).send("The review for the book ISBN " + isbn + " has been deleted");
    } else {
        return res.status(403).json({message: "Login to continue"})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
