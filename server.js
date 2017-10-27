// server.js

// BASE SETUP
// =============================================================================

// read environment variables and set defaults
var PORT = process.env.PORT || 8080;        // set our port
var ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var morgan       = require('morgan');
var fs          = require('fs');
var yaml      = require('js-yaml');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs'); // set up ejs for templating

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.get('', function(req,res) {
    res.render('index.ejs');
});

router.get('/about', function(req,res) {
    res.render('about.ejs');
});

router.get('/contact', function(req,res) {
    res.render('contact.ejs');
});

router.get('/:gallery', function(req,res) {
    var data = {};
    data.pieces = fs.readdirSync("public/pieces/" + req.params.gallery);
    res.render(req.params.gallery + '.ejs', data);
});

router.get('/pieces/:gallery/:piece_name', function(req,res) {
    var data = {};
    data.name = req.params.piece_name;
    data.gallery_name = req.params.gallery;
    data.gallery = fs.readdirSync("public/pieces/"+data.gallery_name+"/"+data.name).filter(function(filename) { return filename.toLowerCase().includes(".jpg") && filename.toLowerCase() != "thumbnail.jpg" });
    data.info = yaml.safeLoad(fs.readFileSync('public/pieces/' + data.gallery_name + '/' + data.name + '/info.yaml', 'utf8'));
    res.render('piece.ejs', data);
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(PORT);
console.log('Magic happens on port ' + PORT);