
// server.js

// init project
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ba64 = require("ba64");
var fs = require("fs");
var request = require("request")
var Promise = require('node-promise').Promise;




var app = express(); 

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});


app.post('/submit', function(request, response){
	var selfie = request.body.taken_selfie;
	var data_url = "data:image/jpg;base64" + selfie;
  
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
      console.log(redirect)

    });
  }
}

// app.post('/submit', function(request, response){
//       console.log("happened");                
//       response.send(result_url)
//     })


// var result = {
//   sendResult: function(result_url) {
//     app.get('/submit', function(request, response){
//       console.log("happened");                
//       response.send(result_url)
//     })
//   }
// }


// listen for requests :)
app.listen(6700, function () {
  console.log('Your app is listening on port 6700...');
});
