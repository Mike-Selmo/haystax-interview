const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/haystax-interview';

class UserService{
	
	constructor(req, res){
		this.req = req
		this.res = res
	}

	insert(user, db, callback){
		db.collection('users').insertOne({
		  		"item" : user
		}, function(){
			callback()		
		})
	}

	register(){
		let self = this;
		let user = this.req.body.user;
		try{
			MongoClient.connect(url, function(err, db) {
				assert.equal(null, err);
			  	self.insert(user, db, function(){
			  		db.close()
			  		return self.res.status(200).json({
						status: 'success'
					})
			  	})
			});
		}
		catch(error){
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}

}
module.exports = UserService