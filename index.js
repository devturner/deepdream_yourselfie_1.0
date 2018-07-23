var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ba64 = require("ba64");
var fs = require("fs");
var jimp = require("jimp")
var app = express();

//view engine

app.set('view engine', 'ejs');

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.use(express.static('public'));


var port = process.env.PORT || 8080;

app.get('/', function(request, response) {
  response.render('index', {result: ''});
});


app.post('/results', function(request, response){
	var selfie = request.body.taken_selfie;
	var data_url = "data:image/jpg;base64" + selfie;
  
  ba64.writeImage("myimage", data_url, function(err){
  	if (err) throw err;

  // jimp.read("myimage.jpg", function(err, image){
  //   if (err) throw err;
  //     image.quality(45);
  //     image.write("myimage1.jpg");

    console.log("Image saved successfully");

      
      var request = require("request");
      
      request.post({
        url: 'https://api.deepai.org/api/deepdream',
        headers: {
            'Api-Key': '96c94bdc-77e0-4371-8a0d-8538d4c2693d'
        },
        formData: {
            'content': fs.createReadStream('myimage.jpg'),
            // console.log(content)
        }
      }, function callback(err, httpResponse, body) {
        if (err) {
            console.error('request failed:', err);
            return;
        }
        // console.log(JSON.parse(body));
        var reply = JSON.parse(body);
        var redirect = reply.output_url;
        var str = '<img id="deepSelfie" src="' + redirect + '">';
        console.log(str);
        response.render('results', {result: str});
      });
    })
// })
});

// function resize() {
//   jimp.read("myimage.jpg", function(err, image) {
//     if (err) { 
//       throw err; 
//     } else {
//         image.quality(45);
//         image.write("myimage.jpg");
//         console.log("image quality lowered");
//     }
//   });
// };
// }
  // function resize() {
  //   jimp.read("myimage.jpg").then(function(image) {

  //   return image.quality(45);
  //          image.write("myimage.jpg");
  //          console.log('happened')
  //          console.log("image quality lowered");
  //    }).catch(function (err) {
  //      console.log('err');
  //   });
  // }



// listen for requests :)
app.listen(port, function () {
  console.log('Your app is listening on port 8080...');
});
