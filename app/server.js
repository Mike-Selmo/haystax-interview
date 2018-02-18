// server.js
    var express = require('express');
    var app = express();  
    var mongoose = require('mongoose'); 
    var morgan = require('morgan'); 
    var bodyParser = require('body-parser'); 
    var methodOverride = require('method-override');
    var request = require('request'); 
    var checkWord = require('check-word'),
    words     = checkWord('en'); // setup the language for check, default is en 
    
    var bearertoken='';

    mongoose.connect('mongodb://localhost:27017/haystax-interview'); 

    app.use(express.static(__dirname + '/public'));       
    app.use(morgan('dev'));                                     
    app.use(bodyParser.urlencoded({'extended':'true'}));      
    app.use(bodyParser.json());                               
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());

 // define model =================
    var User = mongoose.model('User', {
        email : String,
        password : String,
        phone : String
    });

    var Tweet;

// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/user', function(req, res) {

        // use mongoose to get all todos in the database
        User.find(function(err, user) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(user); // return all todos in JSON format
        });
    });

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



    // create todo and send back all todos after creation
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



    // delete a todo
    app.delete('/api/user/:user_id', function(req, res) {
        User.remove({
            _id : req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            User.find(function(err, user) {
                if (err)
                    res.send(err)
                res.json(users);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('/register', function(req, res) {
        res.sendfile('./public/register.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
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