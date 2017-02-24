// http://bcho.tistory.com/1094

var express = require('express');
var router = express.Router();
var config = require('../config');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;


// https://www.npmjs.com/package/mongoose-auto-increment

var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(config.mongodb);
autoIncrement.initialize(connection);

var bbsSchema = mongoose.Schema({
    bbsId: Number
  , bbsUser: String
  , bbsTitle: String
  , bbsContent: String
  , bbsRegDate: {type: Date, default: Date.now}
  , bbsModDate: {type: Date, default: Date.now}
  , bbsUseYn: {type : Boolean, default: true}
  , bbsCount: {type: Number, default: 0}
});

bbsSchema.plugin(
  autoIncrement.plugin
  , {model: 'Bbs', field: 'bbsId', startAt: 1, incrementBy: 1}
);

var Bbs = mongoose.model('bbs', bbsSchema);

// get list bbs
router.get('/', function(req, res, next) {
  Bbs.find({}).sort({bbsId: 'desc'}).exec({bbsUseYn: true}, function(err, resultSet) {
    if (err) {
      console.error(JSON.stringify(err));
    } else {
      // res.send(resultSet);
      res.render('./bbs/bbsList', {result : resultSet});
    }
  });
});

// get one bbs
router.get('/:id', function(req, res, next) {
  var bbsId = req.params.id;

  Bbs.findOne({bbsId: bbsId}, function(err, resultSet) {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      // update click count
      resultSet.bbsCount = resultSet.bbsCount + 1;

      resultSet.save(function(err, resultSet) {
        if (err) {
          console.error(JSON.stringify(err));
          res.status(500).send('Error!');
        } else {
          res.render('./bbs/bbsForm', {result : resultSet});
        }
      });
    }
  });
});

// bbs create form
router.get('/0/form', function(req, res, next) {
  res.render('./bbs/bbsForm', {result : undefined});
});

// insert bbs
router.post('/', function(req, res, next) {
  var datas = {
      bbsTitle: req.body.bbsTitle
    , bbsUser: req.body.bbsUser
    , bbsContent: req.body.bbsContent
    //   bbsTitle: 'Auto increment test!'
    // , bbsContent: 'This is content. wow~'
    // , bbsUser: 'tester'
  };

  var bbsObj = new Bbs(datas);

  bbsObj.save(function(err, resultSet) {
    if (err) {
      console.log(err);
      res.status(500).send('Error!');
    } else {
      res.send({resultCode: 001});
    }
  });
});

// update bbs
router.put('/:id', function(req, res, next) {
  var bbsId = req.params.id;

  Bbs.findOne({bbsId: bbsId}, function(err, resultSet) {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      resultSet.bbsTitle = req.body.bbsTitle;
      resultSet.bbsUser = req.body.bbsUser;
      resultSet.bbsContent = req.body.bbsContent;
      resultSet.bbsModDate = new Date();

      resultSet.save(function(err, resultSet) {
        if (err) {
          console.error(JSON.stringify(err));
          res.status(500).send('Error!');
        } else {
          res.send({resultCode: 001});
        }
      });
    }
  });
});

// delete bbs
router.delete('/:id', function(req, res, next) {
  var bbsId = req.params.id;

  Bbs.findOne({bbsId: bbsId}, function(err, resultSet) {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      // update useYn
      resultSet.bbsUseYn = false;
      resultSet.bbsModDate = new Date();

      resultSet.save(function(err, resultSet) {
        if (err) {
          console.error(JSON.stringify(err));
          res.status(500).send('Error!');
        } else {
          res.send({resultCode: 001});
        }
      });
    }
  });
});




module.exports = router;
