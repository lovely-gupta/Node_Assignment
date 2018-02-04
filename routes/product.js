/* NodeJs mongodb tutorial - insert update delete records */

var express     = require('express');
var router      = express.Router();
var mongodb     = require('mongodb');
var MongoClient = mongodb.MongoClient;

var dburl = "mongodb://localhost:27017/onlinestore";

/* GET products listing. */
router.get('/product', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) {  console.log(err); throw err;  }
    data = '';
    db.collection('product').find().toArray(function(err, docs){
      if(err) throw err;
      res.render('product.jade', {data: docs});
      db.close();
    });
  });
});

router.get('/product/fetchdata', function(req, res, next) {
  var id = req.query.id;

  MongoClient.connect(dburl, function(err, db) {
   if(err) {  console.log(err); throw err;  }
   data = '';
   db.collection('product').find({_id: new mongodb.ObjectID(id)}).toArray(function(err, docs){
     if(err) throw err;
     res.send(docs);
     db.close();
   });
 });
});

router.post('/product/edit', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('product');
    
    var product = {'product_name': req.body.product_name, 'price': req.body.price, 'category': req.body.category, 'product_id': req.body.product_id};
    collection.update({'_id':new mongodb.ObjectID(req.body.id)}, {$set:{'product_name': req.body.product_name, 'price': req.body.price, 'category': req.body.category, 'product_id': req.body.product_id}}, function(err, result) {
    if(err) { throw err; }
      db.close();
      res.redirect('/product');
     });
  });
});

router.post('/product/add', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('product');
    var product = { product_name: req.body.product_name, price: req.body.price, category: req.body.category, product_id: req.body.product_id};
    collection.insert(product, function(err, result) {
    if(err) { throw err; }
      db.close();
      res.redirect('/product');
     });
  });
});

router.get('/product/delete', function(req, res, next) {
  var id = req.query.id;
  
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }

    db.collection('product', function(err, products) {
      products.deleteOne({product_id : id});
      if (err){
         throw err;
       }else{
          db.close();
          res.redirect('/product');
       }
    });
  });
});

router.get('/product/:product_id', function(req, res, next) {
  var id = req.params.product_id;
  console.log(id);
  MongoClient.connect(dburl, function(err, db) {
    if (err) throw err;    
    db.collection("product").find({ product_id: id }).toArray(function(err, result) {
      if (err) throw err;
      res.render('product.jade', {data: result});
      console.log(result);
      db.close();
    });
  });
});

module.exports = router;
