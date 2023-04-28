var express = require('express');
var router = express.Router();
var database = require('./../config/database');

router.get("/", function (request, response, next) {
    var query = "SELECT * FROM final_data";
    database.query(query, function (error, data) {
            response.render('data', {  sampleData: data })
    });
});

module.exports = router;
