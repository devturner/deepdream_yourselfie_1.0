var video = document.getElementById('camera-stream');
var image = document.getElementById('selfie');

var localstream;






var selfie = {
  // persistSelfie: function() {
  //   window.sessionStorage.setItem('selfie', image);
  // },

  // take a seflie
  takeSelfie: function() {
    var selfie = handlers.createSelfie();
    
    image.setAttribute('src', selfie);
    image.classList.add("visible");

    view.pauseVideo();
    // selfie.persistSelfie();
    window.sessionStorage.setItem('selfie', image);
  },
  // retake a selfie
  retakeSelfie: function() {
    console.log('here'),
    view.pauseVideo();
  }
};

var view = {
  // turn on webcam
  startVideo: function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(function(stream) {
        video.srcObject = stream;
        localstream = stream;
        // show buttons on taking, retaking, and submitting
        
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
  },
  // pause the video while taking/ displaying photo
  pauseVideo: function() {
    if (!video.paused) {
      video.pause();
    } else {
      video.play();
    }
  },

  setupEventListeners: function () {
    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 13) {
        selfie.takeSelfie();
      }
    }, true);
  }
};



var handlers = {
  // turn on the webcam
  startCamera: function() {
    view.startVideo() 
  },
  // turn off the webcam
  stopCamera: function() {
    view.stopVideo()
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
  },
};


view.setupEventListeners();

