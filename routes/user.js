/* NodeJs mongodb tutorial - insert update delete records */

var express     = require('express');
var router      = express.Router();
var mongodb     = require('mongodb');
var MongoClient = mongodb.MongoClient;

var dburl = "mongodb://localhost:27017/onlinestore";

/* GET products listing. */
router.get('/user', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) {  console.log(err); throw err;  }
    data = '';
    db.collection('users').find().toArray(function(err, docs){
      if(err) throw err;
      res.render('user.jade', {data: docs});
      db.close();
    });
  });
});

router.get('/user/fetchdata', function(req, res, next) {
  var id = req.query.id;
  
  MongoClient.connect(dburl, function(err, db) {
   if(err) {  console.log(err); throw err;  }
   data = '';
   db.collection('users').find({_id: new mongodb.ObjectID(id)}).toArray(function(err, docs){
     if(err) throw err;
     res.send(docs);
     db.close();
   });
 });
});

router.post('/user/edit', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('users');

    var user = {'first_name': req.body.first_name, 'last_name': req.body.last_name, 'country': req.body.country, 'email_address': req.body.email_address, 'user_id': req.body.user_id};
    collection.update({'_id':new mongodb.ObjectID(req.body.id)}, {$set:{'first_name': req.body.first_name, 'last_name': req.body.last_name, 'country': req.body.country, 'email_address': req.body.email_address, 'user_id': req.body.user_id}}, function(err, result) {
    if(err) { throw err; }
      db.close();
      res.redirect('/user');
     });
  });
});


router.post('/user/add', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('users');
    var user = { first_name: req.body.first_name, last_name: req.body.last_name, country: req.body.country, email_address: req.body.email_address, user_id: req.body.user_id};
    collection.insert(user, function(err, result) {
    if(err) { throw err; }
      db.close();
      res.redirect('/user');
     });
  });
});


router.get('/user/delete', function(req, res, next) {
  var id = req.query.id;
  
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }

    db.collection('users', function(err, users) {
      users.deleteOne({user_id : id});
      if (err){
         throw err;
       }else{
          db.close();
          res.redirect('/user');
       }
    });
  });
});

router.get('/user/:user_id', function(req, res, next) {
  var id = req.params.user_id;
  console.log(id);
  MongoClient.connect(dburl, function(err, db) {
    if (err) throw err;    
    db.collection("users").find({ user_id: id }).toArray(function(err, docs1) {
      if (err) throw err;
      res.render('user.jade', {data: docs1});      
      db.close();
    });
  });
});

module.exports = router;
