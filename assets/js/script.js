var video = document.getElementById('camera-stream');
var localstream;
var selfie = {

}

// if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//     video.src = window.URL.createObjectURL(stream);
//     video.play();
//   });
// }


var view = {
  displayVideo: function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        localstream = stream;
      });
    } else {
      displayErrorMessage("Your browser does not support the webcam control, please try a modern version of Chrome");
    }

  },
  stopVideo: function() {
    // video.src = '';
    video.pause();
    video.src = "";
    localstream.getTracks()[0].stop();
  }
};

// var view = {
//   displayVideo: function() {
//     if (!navigator.getMedia){
//       displayErrorMessage("Your browser does not support the webcam control, please try a modern version of Chrome");
//     } else {
//       navigator.getMedia( 
//           {
//             video:true
//           },
//           function(stream){
//             video.src = window.URL.createObjectURL(stream);
//             video.play();
//             video.onplay = function() {
//               showVideo();
//             };
//           },

//         function(err) {
//           displayErrorMessage("There was an error accessing your cameras video: " + err.name, err);
//         }
//       );
//     }
//     function showVideo() {
//       hideUI();
//       video.classList.add("visible");
//       control.classList.add("visible");
//     }
//   }
// };

var handlers = {
  startCamera: function() {
    view.displayVideo()
  },
  stopCamera: function() {
    view.stopVideo()
  }

};