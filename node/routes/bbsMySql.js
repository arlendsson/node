var express = require('express');
var router = express.Router();
var config = require('../config');
var mysql = require('mysql');
var pool  = mysql.createPool(config.mysql);

router.get('/', function (req, res, next) {
  pool.getConnection(function(err, connection) {
    var queryStr = 'select * from bbs';

    connection.query(queryStr, function (err, rows) {
      if (err) {
        console.error(err);
      } else {
        res.render('./bbs/bbsList', {rows : rows});
      }

      connection.release();
    });
  });
});

router.get('/:id', function (req, res) {
  pool.getConnection(function(err, connection) {
    var bbsId = req.params.id;
    var queryStr = 'update bbs set BBS_COUNT = BBS_COUNT + 1 where BBS_ID = ?';

    connection.query(queryStr, [bbsId], function (err, rows) {
      if (err) {
        console.error(err);
        connection.rollback(function () {
          console.error('rollback error');
        });
      } else {
        queryStr = 'select * from bbs where BBS_ID = ?';

        connection.query(queryStr, [bbsId], function (err, rows) {
          if (err) {
            console.error(err);
          } else {
            res.render('./bbs/bbsView', {rows : rows});
          }
        });
      }

      connection.release();
    });
  });
});

router.post('/', function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body));
  var datas = {
    bbs_title : input.bbs_title,
    bbs_user : input.bbs_user,
    bbs_content : input.bbs_content
  };

  req.getConnection(function(err, connection) {
    var queryStr = 'insert into bbs ('
                + 'BBS_TITLE, BBS_USER, BBS_CONTENT, BBS_DATE'
                + ') values ('
                + '?, ?, ?, now()'
                + ')';

    connection.query(queryStr, datas, function (err, rows) {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/bbs');
      }

      connection.release();
    });
  });
});

router.put('/:id', function (req, res) {
  var bbsId = req.params.id;
  var input = JSON.parse(JSON.stringify(req.body));
  var datas = {
    bbs_title : input.bbs_title,
    bbs_user : input.bbs_user,
    bbs_content : input.bbs_content,
    bbs_id : bbsId
  };

  req.getConnection(function (err, connection) {
    var queryStr = 'update bbs set '
                + 'BBS_TITLE = ?, BBS_USER = ?, BBS_CONTENT = ? '
                + 'WHERE BBS_ID = ?';

    connection.query(queryStr, datas, function (err, rows) {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/bbs');
      }

      connection.release();
    });
  });
});

router.delete('/:id', function (req, res) {
  var bbsId = req.params.id;

  req.getConnection(function (err, connection) {
    var queryStr = 'delete from bbs where BBS_ID = ?';

    connection.query(queryStr, [id], function (err, rows) {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/bbs');
      }

      connection.release();
    });
  });
});




module.exports = router;
