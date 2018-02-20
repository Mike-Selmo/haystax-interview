// server.js
    var express = require('express');
    var app = express();  
    var mongoose = require('mongoose'); //Use Mongoose to interact with MongoDB

    var morgan = require('morgan'); 
    var bodyParser = require('body-parser'); 
    var methodOverride = require('method-override');
    var request = require('request'); 

    var checkWord = require('check-word'), //Node Module for word checking
    words     = checkWord('en'); // setup the language for counting english words in tweet.
    
    var bearertoken=''; //bearerToken will be set when initializing API call to Twitter.

    mongoose.connect('mongodb://localhost:27017/haystax-interview');  //Connect to MongoDB

    app.use(express.static(__dirname + '/public')); //Direct to client side directory.       
    app.use(morgan('dev'));                                     
    app.use(bodyParser.urlencoded({'extended':'true'}));      
    app.use(bodyParser.json());                               
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());

 // define model for all colelctions used
    var User = mongoose.model('User', {
        email : String,
        password : String,
        phone : String
    });

    var str = mongoose.model('str', {
        date : Date,
        wordlist : Array,
    });

    var recentWordCount = mongoose.model('recentWordCount', {
        _id : String,
        value : Number
    },'recentWordCounts');

    var oldWordCount = mongoose.model('oldWordCount', {
        _id : String,
        value : Number
    },'oldWordCounts');

    var totalWordCount = mongoose.model('totalWordCount', {
        _id : String,
        value : Number
    },'totalWordCounts');

    var trendingWordCount = mongoose.model('trendingWord', {
        _id : String,
        value : Number
    },'trendingWords');



// API Section

    // get all Users
    app.get('/api/user', function(req, res) {
        
        // use mongoose to get all Users in the database
        User.find(function(err, user) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(user); // return all todos in JSON format
        });
    });

//Get Word lists from database
    app.get('/api/data', function(req, res) {
        
            str.find(function(err, str) {
                if (err){
                    res.send(err)
                }
//Here we need to MapReduce for 3 scenarios - Total word counts, 24 hour word count, and previous 24 hour word count.
                recentWords();
                oldWords();
                allWords();
//Here we respond with the data set - after we generate collections for data parsing. 
                res.json(str);
            });
    });

    // create user and send back all users after creation
    app.post('/api/add', function(req, res) {
        // create a todo, information comes from AJAX request from Angular
        str.create({
            date : req.body.date,
            wordlist : req.body.wordList,
        }, function(err, user) {
            if (err)
                res.send(err);

            // get and return all the wordlists after you create another
            str.find(function(err, str) {
                if (err){
                    res.send(err)
                }
//Here we need to MapReduce for 3 scenarios - Total word counts, 24 hour word count, and previous 24 hour word count.
                recentWords();
                oldWords();
                allWords();
//Here we respond with the data set - after we generate collections for data parsing. 
                res.json(str);
            });
        });

    });

//This call will initiate data parsing. 

    app.get('/api/count', function(req, res) {

            totalWordCount.find(function(err, totalWordCount) {
                if (err){
                    res.send(err)
                }
                res.json(dataSort(totalWordCount));
            });
    });

//Now we sort the most recent word counts
    app.get('/api/trends', function(req, res) {

      recentWordCount.find(function(err, recentWordCount) {
                if (err){
                    res.send(err)
                }
           trendingWords()
            res.json(dataSort(recentWordCount));
            });
        
    });

//Now we return the trending word list
    app.get('/api/final', function(req, res) {

      trendingWordCount.find(function(err, trendingWordCount) {
                if (err){
                    res.send(err)
                }
            res.json(dataSort(trendingWordCount));
            });
        
    });


//This will sort the data in descending word count. 
function dataSort(data){
data.sort(function(a, b) { return b.value - a.value; });

console.log(data);
return data;
}


function recentWords(){
 var o = {};
o.map = function () { 
    var d = new Date();
    d.setDate(d.getDate() - 1); 
    if(this.date>=d){
    for(var i =0; i< this.wordlist.length - 1; i++){
    emit(this.wordlist[i], 1)
    }
    } 
}

o.out = {replace: 'recentWordCounts'}

o.reduce = function (k, vals) { return vals.length }
str.mapReduce(o, function (err, results) {
})

}

function oldWords(){
 var o = {};
o.map = function () { 
    var d2 = new Date();
    var d3 = new Date();

    d2.setDate(d2.getDate() - 1); 
    d3.setDate(d3.getDate() - 2); 
                
    if(this.date<=d2&&this.date<=d3){
    for(var i =0; i< this.wordlist.length - 1; i++){
    emit(this.wordlist[i], 1)
    }
    }
}
o.out = {replace: 'oldWordCounts'}
o.reduce = function (k, vals) { return vals.length }
str.mapReduce(o, function (err, results) {
})
}

function allWords(){
 var o = {};
o.map = function () { 
    for(var i =0; i< this.wordlist.length - 1; i++){
    emit(this.wordlist[i], 1)} }
o.out = {replace: 'totalWordCounts'}

o.reduce = function (k, vals) { return vals.length } 
str.mapReduce(o, function (err, results) {
})
}

//Now we reduce the 2 collections subtracting 24 hours word count, with previous 24 hour word count and output to a collection
function trendingWords(){
trendingWordCount.remove({}, function(err) { 
   console.log('collection removed') 
});
 var o = {};
o.map = function () { 
    emit(this._id, this.value)}
o.out = {reduce: 'trendingWords'}

o.reduce = function (k, vals) {
    var values = 0;
    values +=vals[1];
    values -=vals[0]
return values;
}
recentWordCount.mapReduce(o, function (err, results) {
})
oldWordCount.mapReduce(o, function (err, results) {
})
}


    app.get('/api/twitter', function(req, res) {
        
       var options = {
    url: 'https://api.twitter.com/1.1/search/tweets.json?q='+req.body.handle+'&count=5',
    headers: {
        'Authorization': 'bearer ' + bearertoken,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    };
        
 request.get(options, function(error, response, body) {
     Tweet=JSON.parse(body);
     for(var i=0; i<Tweet.statuses.length;i++){
         var str = Tweet.statuses[i].text.split(" ");
        var wordCount =0;
         for(var n =0; n<str.length;n++){
        var cleanstr = str[n].replace(/[@"'.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        cleanstr = cleanstr.toLowerCase();
        if(words.check(cleanstr)){
            console.log('Is word:' +cleanstr)
            wordCount++
        }
             else{
         console.log('not word:' +cleanstr) 
             }
         }
    Tweet.statuses[i].wordCount=wordCount;     
     };
     
     res.json(Tweet);
});
    });



    // create user and send back all users after creation
    app.post('/api/user', function(req, res) {
        // create a todo, information comes from AJAX request from Angular
        User.create({
            email : req.body.email,
            password : req.body.password,
            phone : req.body.phone,
        }, function(err, user) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            User.find(function(err, user) {
                if (err)
                    res.send(err)
                res.json(user);
            });
        });

    });




    // application -------------------------------------------------------------
    app.get('/register', function(req, res) {
        res.sendfile('./public/register.html');
    });

    app.get('/mongo', function(req, res) {
        res.sendfile('./public/mongo.html'); 
    });


    app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); 
    });


   app.get('/twitter', function(req, res) {
       var consumerkey = 'eNqhaQZ87zJtdfMA9fznEHy3i';
       var consumersecret = '4RWRmPkNkliikw17n05HmPFjgCg9vFhctvS3KVmtfuqjMWFDmB';
       var encode_secret = new Buffer(consumerkey + ':' + consumersecret).toString('base64');
       var options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': 'Basic ' + encode_secret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    body: 'grant_type=client_credentials'
    };

request.post(options, function(error, response, body) {
    bearertoken= JSON.parse(body).access_token;
    console.log(bearertoken);
});
        res.sendfile('./public/twitter.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    app.listen(8080);
    console.log("App listening on port 8080");