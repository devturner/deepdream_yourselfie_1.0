var video = document.getElementById('camera-stream');
var localstream;
var selfie = {

}

var view = {
  startVideo: function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(function(stream) {
        video.srcObject = stream;
        // video.src = window.URL.createObjectURL(stream);
        localstream = stream;
      });
    } else {
      displayErrorMessage("Your browser does not support the webcam control, please try a modern version of Chrome");
    }

  },
  stopVideo: function() {
    video.pause();
    video.src = '';
    localstream.getTracks()[0].stop();
  }
};


var handlers = {
  startCamera: function() {
    view.startVideo()
  },
  stopCamera: function() {
    view.stopVideo()
  }

};