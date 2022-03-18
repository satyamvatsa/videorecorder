'use strict';

let mediaRecorder;
let recordedBlobs;

let startcam = document.querySelector('#startcam');
let camicon = document.querySelector('#camicon');
let recordbtn = document.querySelector('#recordbtn');
let uploadpre = document.querySelector('.uploadpre');
let videopre = document.querySelector('.videopre');
let heading = document.querySelector('.heading');
let recordbutton = document.querySelector('#recordbutton');
let secondscreen = document.querySelector('.secondscreen');
let retake = document.querySelector('.retakebtn');
let recwindow = document.querySelector('#recwindow');

startcam.addEventListener('click',() => {
    if(navigator.mediaDevices.getUserMedia){
        recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  recwindow.srcObject = stream;
    }
    else{
        console.log("getUserMedia not supported!");
    }
    camicon.innerHTML="videocam";
    startcam.style.backgroundColor="transparent";
});



retake.addEventListener('click',() => {
    window.location.reload()
});

recordbtn.addEventListener('click',() => {
    if (recordbutton.textContent === 'Record') {
        
        uploadpre.style.display="none";
        videopre.classList.remove('col-lg-7');
        heading.style.display="none";
        recordbutton.textContent = 'Stop Recording';
    } else {
        recordbtn.style.display="none";
        secondscreen.style.display="block";
    }
});

if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:true})
    .then(function(stream){
        recwindow.srcObject = stream;
    })
    .catch (function(error){
        console.log("Somthing went wrong");
    })
}
else{
    console.log("getUserMedia not supported!");
}