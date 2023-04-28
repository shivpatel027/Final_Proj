var express = require('express');
var router = express.Router();
var database = require('./../config/database');

var data_exporter = require('json2csv').Parser;

router.get("/data", function (request, response, next) {
    var query = "SELECT * FROM final_data";
    database.query(query, function (error, data) {
            response.render('data', {  sampleData: data })
    });
});

router.get('/export', function(request, response, next){

    database.query('SELECT * FROM final_data', function(error, data){

        var mysql_data = JSON.parse(JSON.stringify(data));

        // convert JSON to CSV Data

        var file_header = ['CAP', 'MAXLOAD', 'GEN', 'DATE'];

        var json_data = new data_exporter({file_header});

        var csv_data = json_data.parse(mysql_data);

        response.setHeader("Content-Type", "text/csv");

        response.setHeader("Content-Disposition", "attachment: filename=sample_data.csv");

        response.status(200).end(csv_data);

    });

});


module.exports = router;

