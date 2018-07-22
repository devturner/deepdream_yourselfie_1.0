var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ba64 = require("ba64");
var fs = require("fs");

var app = express();

//view engine

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/views'));


app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


app.get('/', function(request, response) {
  response.render('index', {result: ''});
});


app.post('/results', function(request, response){
	var selfie = request.body.taken_selfie;
	var data_url = "data:image/jpg;base64" + selfie;
  
  ba64.writeImage("myimage", data_url, function(err){
  	if (err) throw err;
	  console.log("Image saved successfully");
  
    var request = require("request");
    request.post({
      url: 'https://api.deepai.org/api/deepdream',
      headers: {
          'Api-Key': '96c94bdc-77e0-4371-8a0d-8538d4c2693d'
      },
      formData: {
          'content': fs.createReadStream('myimage.jpg'),
      }
    }, function callback(err, httpResponse, body) {
      if (err) {
          console.error('request failed:', err);
          return;
      }
      var reply = JSON.parse(body);
      var redirect = reply.output_url;
      var str = '<img id="deepSelfie" src="' + redirect + '">';
      console.log(str);
      response.render('results', {result: str});
    });
  })
});


// listen for requests :)
app.listen(8080, function () {
  console.log('Your app is listening on port 8080...');
});
