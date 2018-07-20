
// server.js

// init project
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ba64 = require("ba64");
var fs = require("fs");
var request = require('request');
var jimp = require('jimp');




var app = express(); 

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});


app.post('/choices/submit', function(request, response){
	var selfie = request.body.taken_selfie;
	var data_url = "data:image/jpg;base64" + selfie;
	// var data_url = "data:image/jpeg;base64, request.body.taken_selfie";

  // console.log(data_url),

	// data_url = ba64.getBa64Img(data_url),
	ba64.writeImage("myimage", data_url, function(err){
  		if (err) throw err;
		  console.log("Image saved successfully");

		  deepDream.sendSelfie();
		})
});

// JIMP to turn photo black and white. 


var deepDream = {
  sendSelfie: function() {
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
      var response = JSON.parse(body);
      var redirect = response.output_url;
      result.sendResult(redirect);
    });
  }

}

var result = {
  sendResult: function(result_url) {
    app.get('/', function(request, response){
      console.log("happened");                
      response.json(result_url)
    })
  }
}


// listen for requests :)
app.listen(6700, function () {
  console.log('Your app is listening on port 6700...');
});
