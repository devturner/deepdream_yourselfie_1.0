//  var createImage = function(src, title) {
//           var img   = new Image();
//           img.src   = src;
//           img.alt   = title;
//           img.title = title;
//           return img; 
//         };


// var createImage = function(src,title) {
//     title = title.replace(/"/g,"&quot;");
//     return '<img src="'+src+'" title="'+title+'" alt="'+title+'" />';
// }


// createImage(sessionStorage.selfie)

// // show the origial image next to the result, pull from sessions storage

// document.getElementById(beforeSelfie) 


// <template repeat="{{sessionStorage.selfie}}">
//   <my-panel><img src="{{item.src}}" alt="{{item.title}}" title="{{item.title}}"></my-panel>
// </template>


var dataImage = sessionStorage.getItem('selfie');
var beforeSelfie = document.getElementById('beforeSelfie')
beforeSelfie.src = dataImage;


// document.getElementById("beforeSelfie").innerHTML = sessionStorage.getItem("selfie");