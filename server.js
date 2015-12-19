var application_root = __dirname,
    express = require("express"),
    fs = require("fs"),
    bodyParser = require("body-parser"),
    constants = require("./private/constants.js"),
    path = require('path'),
    port = 3001;

var app = express();

function server() {
    var self = this;
    self.configureExpress();
};

server.prototype.configureExpress = function() {
    var router = express.Router();

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    app.use('/api', router);
    app.get('/getFlightDetails', function(req, res) {
        var obj;
        var filePath = path.join(__dirname, 'data/data.JSON');
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) throw err;
            obj = JSON.parse(data);

            var i = 0;
            var resObj = [];
            for (i; i < obj.length; i++) {
                if (obj[i].originCity == req.query.originCity && obj[i].departureCity == req.query.departureCity) {
                    resObj.push(obj[i]);
                }
            }
            res.send(JSON.stringify(resObj));
        });
    });

    app.get('/getCityList', function(req, res) {
        var arr = ['Delhi', 'Mumbai', 'Chennai', 'Pune', 'Hyderabad', 'Bangalore'];
        res.send(arr);
    });

    this.startServer();
}

server.prototype.startServer = function() {
    app.listen(port, function() {
        console.log("All right ! I am alive at Port." + port);
    });
}

server.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new server();