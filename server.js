// server.js

// BASE SETUP
// =============================================================================

// read environment variables and set defaults
var PORT = process.env.PORT || 8080;        // set our port
var ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var morgan       = require('morgan');
var fs          = require('fs');
var yaml      = require('js-yaml');

app.use(morgan('dev')); // log every request to the console
app.use(express.static('public'));
app.set('view engine', 'ejs'); // set up ejs for templating

var data = {galleryData: yaml.load(fs.readFileSync('gallery-data.yaml', 'utf8'))};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.get('', function(req,res) {
    res.render('index.ejs', data);
});

router.get('/:page', function(req,res) {
    var subtitle = "";
    if (req.params.page == "in_progress") {
        subtitle = "In Progress";
    } else if (req.params.page == "about") {
        subtitle = "The Artist";
    }
    res.render(req.params.page + '.ejs', {subtitle: subtitle});
});

router.get('/gallery/:gallery', function(req,res) {    
    var gallery = data.galleryData.galleries.find(function(x) { return x.name == req.params.gallery});
    res.render('gallery.ejs', 
        {
            subtitle: gallery.display_name,
            gallery: gallery
        }
    );
});

router.get('/gallery/:gallery/:piece_name', function(req,res) {
    var gallery = data.galleryData.galleries.find(function(x) { return x.name == req.params.gallery; });
    var piece = gallery.pieces.find(function(x) { return x.name == req.params.piece_name; });
    var images = fs.readdirSync("public/pieces/"+gallery.name+"/"+piece.name).filter(function(filename) { return filename.toLowerCase().includes(".jpg") && filename.toLowerCase() != "thumbnail.jpg" });
    res.render('piece.ejs', 
        {
            gallery: gallery,
            piece: piece,
            images: images,
            subtitle: gallery.display_name,
            subtitle_link: gallery.name
        }
    );
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(PORT);
console.log('Magic happens on port ' + PORT);