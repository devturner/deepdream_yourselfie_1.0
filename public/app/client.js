var video = document.getElementById('camera-stream');
var image = document.getElementById('selfie');

var pickedSelfie = '';

var selfie = {

  takeSelfie: function() {
    var selfie = handlers.createSelfie();
    image.setAttribute('src', selfie);
    image.classList.add("visible");
    videoView.pauseVideo();

    hideUi.toggleButton('deletePhoto');
    hideUi.toggleButton('submit');
    hideUi.toggleButton('takePhoto');
  },
  // retake a selfie
  retakeSelfie: function() {
    videoView.pauseVideo();
    hideUi.toggleButton('deletePhoto');
    hideUi.toggleButton('submit');
    hideUi.toggleButton('takePhoto');
  },

  // save this selfie for the api, turn off camera, and show selectable styles, hide buttons
  submitSelfie: function() {
    console.log('here');
    videoView.stopVideo();
    hideUi.toggleButton('start');
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
    hideUi.toggleButton('submit');
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
  }
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

  // press enter to take a photo
  setupEventListeners: function () {
    document.addEventListener('click', function(event) {
      var elementClicked = event.target;

      if(elementClicked.id === 'submit') {
        handlers.fillSubmitForm();
        selfie.submitSelfie();
      }
    });


    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 13) {
        selfie.takeSelfie();
      }
    }, true);
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
      return hidden_canvas.toDataURL('image/jpg');
    }
  },

    // submit your selfie and choices

    fillSubmitForm() {
      document.getElementById('taken_selfie').value = (image.src)
    }
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
    var z = document.getElementById('submit')
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
}

handlers.setupEventListeners();


