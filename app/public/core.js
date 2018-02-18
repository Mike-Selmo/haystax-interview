// public/core.js
var haystaxInterview = angular.module('haystaxInterview', []);
var bearertoken = '';

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/user')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.userReg = function() {
        $http.post('/api/user', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/user/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
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
    
     $scope.getLatestTweets = function() {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var url = 'https://api.twitter.com/1.1/search/tweets.json?';
            if (data) {
                url += '?q=' +  $scope.twitterSearch.handle;
            }
            var promise = authorizationResult.get(url).done(function(data) {
                // https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                // when the data is retrieved resolve the deferred object
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            });
            //return the promise of the deferred object
            return deferred.promise;
        };
        
 
    // when submitting the add form, send the text to the node API
    $scope.userReg = function() {
        $http.post('/api/user', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/user/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}

