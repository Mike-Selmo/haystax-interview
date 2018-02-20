// public/core.js
var haystaxInterview = angular.module('haystaxInterview', []);
var bearertoken = '';

function loginController($scope, $http) {
    $scope.showform = true;
    $scope.showthank = false;
    $scope.formData = {};

    // when submitting the add form, send the text to the node API
    $scope.userReg = function() {
        console.log($scope.formData);
        $http.post('/api/user', $scope.formData)
            .success(function(data) {
            $scope.showform = false;   
            $scope.showthank = true;
            console.log($scope.formData);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}

function mongoController($scope, $http) {
    $scope.stepOne = true;
    $scope.stepTwo = false;  
    $scope.stepThree = false;  
    $scope.stepFour = false;  
    
    // when landing on the page, get all data
    $http.get('/api/data')
        .success(function(data) {
        $scope.mongoCollections = data;
            console.log($scope.mongoCollections );
    })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    
//Allow User to Add data through front end
    $scope.addData = function() {
    $scope.formData.wordList = $scope.formData.wordList.split(/[ ,.]+/); 
    console.log($scope.formData);
        $http.post('/api/add', $scope.formData)
            .success(function(data) {
            console.log($scope.formData);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    
    
//This will get data on Trends.    
$scope.getWordCount = function() {
  $http.get('/api/count')
        .success(function(data) {
            $scope.stepOne = false;   
            $scope.stepTwo = true;
            console.log(data);
            $scope.words = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
    
$scope.getTrends = function() {
  $http.get('/api/trends')
        .success(function(data) {
            $scope.stepThree = true;   
            $scope.stepTwo = false;
            console.log(data);
            $scope.trends = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
    
$scope.getFinal = function() {
  $http.get('/api/final')
        .success(function(data) {
            $scope.stepThree = false;   
            $scope.stepFour = true;
            console.log(data);
            $scope.finals = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
    
}

function twitterController($scope, $http) {
    
    $scope.twitterSearch = {};

    // when landing on the page, get all todos and show them
    $scope.getTweets = function() {
  $http.get('/api/twitter', $scope.twitterSearch)
        .success(function(data) {
            console.log(data);
            $scope.tweets = data.statuses;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

}

