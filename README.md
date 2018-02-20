# haystax-interview

# Question 8
You have a MongoDB collection with documents which each have a date and an array of words. Find the word that occurs the most frequently in the entire data set. Next, find the word that occurs most frequently in just the last 24 hours. Then, find the word that is trending the most - that is, the appearance of this word has increased more than any other word in the last 24 hours over the previous 24 hour period.

# Question 9
Create a small AngularJS page with input boxes for a user registration page. The input boxes should collect email address, password, and phone number. Email and password should be required. Create a validator to make sure the email address and phone number are valid. On pressing a "Register" button the page should thank the user (by name) for registering. 

# Question 10
Create a simple web app. Connect to the public Twitter API and display the last 5 public tweets for a username that is entered into an input dialog. Make sure CSS and HTML is proper and looks decent. The output should show the Tweet content, date/time, and a count of how many words are from the English dictionary.

## dependencies
    
    MongoDB - https://www.mongodb.com/download-center?jmp=nav#compass
    NodeJS - https://nodejs.org/en/download/

## Install Instructions

    Install both MongoDB and NodeJS. 
    
    Open command prompt or terminal 
    Navigate to your MongoDB install directory
    (Windows default: C:\Program Files\MongoDB\Server\3.0\bin)
    
    Clone repository. 
    Enter app folder within repository and run:
    "npm install"
    This will install all dependencies.
    
    Then in the same command line run:
    "node server.js"
    
    This will run on http://localhost:8080/
