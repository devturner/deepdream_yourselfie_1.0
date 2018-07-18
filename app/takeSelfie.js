var video = document.getElementById('camera-stream');
var image = document.getElementById('selfie');

var selfie = {

  takeSelfie: function() {
    var selfie = handlers.createSelfie();
    
    image.setAttribute('src', selfie);
    image.classList.add("visible");

    videoView.pauseVideo();

    console.log(selfie)

    // selfie.persistSelfie();
    window.sessionStorage.setItem('selfie', image);
    hideUi.toggleButton('deletePhoto');
    hideUi.toggleButton('submitPhoto');
    hideUi.toggleButton('takePhoto');
  },
  // retake a selfie
  retakeSelfie: function() {
    videoView.pauseVideo();
    hideUi.toggleButton('deletePhoto');
    hideUi.toggleButton('submitPhoto');
    hideUi.toggleButton('takePhoto');
  },

  // save this selfie for the api, turn off camera, and show selectable styles, hide buttons
  submitSelfie: function() {
    videoView.stopVideo();
    hideUi.toggleButton('start');
    hideUi.toggleButton('stop');
    hideUi.cameraOff();
    hideUi.unhideStyles();
    hideUi.toggleButton('stop');
    sytlesView.setupEventListeners();
  }

};

var videoView = {
  // turn on webcam
  startVideo: function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(function(stream) {
        video.srcObject = stream;
        localstream = stream;
        // show buttons on taking, retaking, and submitting (hide before using webcam)
        hideUi.toggleButton('start');
        hideUi.toggleButton('stop');
        hideUi.toggleButton('takePhoto');
        hideUi.toggleVideo();

      });
    } else {
      displayErrorMessage("Your browser does not support the webcam control, please try a modern version of Chrome");
    }
  },
  // turn off the webcam
  stopVideo: function() {
    video.pause();
    video.src = '';
    localstream.getTracks()[0].stop();
    // hide buttons on taking, retaking, and submitting

    hideUi.toggleButton('stop');
    hideUi.toggleButton('start');
    hideUi.cameraOff();
    hideUi.toggleVideo();
  },
  // pause the video while taking/ displaying photo
  pauseVideo: function() {
    if (!video.paused) {
      video.pause();
    } else {
      video.play();
    }
  },
  // press enter to take a photo
  setupEventListeners: function () {
    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 13) {
        selfie.takeSelfie();
      }
    }, true);
  }
};
// <a href="#"><img src="assets/styles/caravaggio.jpg" />
var sytlesView = {
  
  styles: ['<img id="style" src="assets/styles/caravaggio.jpg" />', '<img id="style" src="assets/styles/charley_harper.jpg" />', '<img id="style" src="assets/styles/daydream-alphonse-mucha.jpg" />', '<img id="style" src="assets/styles/escher.jpg" />', '<img id="style" src="assets/styles/matisse.jpg" />', '<img id="style" src="assets/styles/Picasso.jpg" />', '<img id="style" src="assets/styles/michelangelo.jpg" />', '<img id="style" id="style" id="style" src="assets/styles/starheadboy.jpg" />'],
  picked: '',

  displayStyles: function () { 
    var str = '<ul>'
    this.styles.forEach(function(style) {
      str += '<li class="style">' + style + '</li>';
    }); 
      
    str += '</ul>';
    document.getElementById('ul').innerHTML = str;
  },

  setupEventListeners: function() {
      document.getElementById("table").addEventListener("click", function(event) {
    // console.log('here')
    if (event.target) {
      alert("clicked " + event.target.src);
      picked = event.target.src;
    } deepDream.sendSelfie();
  });
  }, 

};


var handlers = {
  // turn on the webcam
  startCamera: function() {
    videoView.startVideo() 
  },
  // turn off the webcam
  stopCamera: function() {
    videoView.stopVideo()
  },
  // process the selfie from a temporary canvas
  createSelfie() {
    var hidden_canvas = document.getElementById('canvas');
        context = hidden_canvas.getContext('2d');

    var width = video.offsetWidth;
        height = video.offsetHeight;

    if (width && height) {
      hidden_canvas.width = width;
      hidden_canvas.height = height;

      // copy the video frame
      context.drawImage(video, 0, 0, width, height)
      
      // canvas image to dataURL for image source
      return hidden_canvas.toDataURL('image/png');
    }
  }

    // submit your selfie and choices

};

// gotta hide things when they are not needed
var hideUi = {
  toggleButton: function(buttonId) { 
    var x = document.getElementById(buttonId)
    if (x.style.display == 'none') {
        x.style.display = 'inline-block';
    } else {
        x.style.display = 'none';
    }
  }, 
  cameraOff: function() {
    var x = document.getElementById('takePhoto')
    var y = document.getElementById('deletePhoto')
    var z = document.getElementById('submitPhoto')
    x.style.display = 'none';
    y.style.display = 'none';
    z.style.display = 'none';
  },
  toggleVideo: function () {
    var x = document.getElementById('camera-stream')
    if (x.style.display == 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
  },

  unhideStyles: function() { 
    var x = document.getElementById('table')
    x.style.display = 'table'
  }, 

}


var deepDream = {
  sendSelfie: function () {
    var fs = require('fs');
    var request = require('request');
    request.post({
      url: 'https://api.deepai.org/api/neural-style',
      headers: {
          'Api-Key': '96c94bdc-77e0-4371-8a0d-8538d4c2693d'
      },
      formData: {
          'style': fs.createReadStream('picked'),
          'content': fs.createReadStream('image'),
      }
    }, function callback(err, httpResponse, body) {
      if (err) {
          console.error('request failed:', err);
          return;
      }
      var response = JSON.parse(body);
      console.log(response);
    });
  }

}


videoView.setupEventListeners();
sytlesView.displayStyles();

