'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');
const uploadsection = document.querySelector('.uploadsection');
const mainrecord = document.querySelector('#mainrecord');
const blockquote = document.querySelector('.blockquote');
const heading = document.querySelector('.heading');
const secondscreen = document.querySelector('.secondscreen');
const recorded = document.querySelector('#recorded');
const gum = document.querySelector('.gum');
let retake = document.querySelector('.retakebtn');
let startvid = document.querySelector('.startvid');
let icon = document.querySelector('.startvid span');
let progressbar = document.querySelector('.progressbar');
let copyandprocess = document.querySelector('.copyandprocess');
let processedvideobtn = document.querySelector('.processedvideobtn');
let mobileupload = document.querySelector('.mobileupload');
let mobilebtn = document.querySelector('.mobilebtn');
let mobilevideo = document.querySelector('.mobilevideo');
let mobilerecoder = document.querySelector('.mobilerecoder');
let recordandupload = document.querySelector('.recordandupload');

mobileupload.addEventListener('click',() => {
  mobilebtn.style.display="none";
  mobilevideo.style.display="none";
  progressbar.style.display="block";
  copyandprocess.style.display="block";
  processedvideobtn.style.display="block";
  mobilerecoder.style.height="60vh";
});

downloadButton.addEventListener('click',() => {
  secondscreen.style.display="none";
  recorded.style.display="none";
  progressbar.style.display="block";
  copyandprocess.style.display="block";
  processedvideobtn.style.display="block";
});

startvid.addEventListener('click',() => {
  icon.textContent="videocam";
  startvid.style.backgroundColor="transparent";
});

retake.addEventListener('click',() => {
  window.location.reload()
});

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Record') {
    startRecording();
    uploadsection.style.display="none";
    mainrecord.classList.remove('col-lg-7');
    mainrecord.classList.add('col-lg-12');
    blockquote.style.display="none";
    heading.style.display="none";
    
  } else {
    stopRecording();
    recordButton.textContent = 'Record';
    playButton.disabled = false;
    downloadButton.disabled = false;
    secondscreen.style.display="block";
    recorded.style.display="block";
    gum.style.display="none";
    recordButton.style.display="none";
    startvid.style.display="none";
  }
});


playButton.addEventListener('click', () => {
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});


downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.mp4';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
  stream.getTracks().forEach(function(track){
    track.stop();
    })
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      echoCancellation: {exact: hasEchoCancellation}
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
});

/* Mobile video */

document.addEventListener('DOMContentLoaded', (ev)=>{
  let form = document.getElementById('myform');
  //get the captured media file
  let input = document.getElementById('capture');
  
  input.addEventListener('change', (ev)=>{
      console.dir( input.files[0] );
      if(input.files[0].type.indexOf("audio/") > -1 ){
          let audio = document.getElementById('audio');
          audio.src = window.URL.createObjectURL(input.files[0]);
      }
      else if(input.files[0].type.indexOf("video/") > -1 ){
          let video = document.getElementById('video');
          
          let mainmobilerecorder = document.querySelector('.mainmobilerecorder');
          let fileupload = document.querySelector('.fileupload');
          video.src=window.URL.createObjectURL(input.files[0]);
          mobilebtn.style.display="block";
          mobilevideo.style.display="block";
          mainmobilerecorder.style.display="none";
          fileupload.style.display="none";
          heading.style.display="none";
      }
  })
  
})


const form = document.querySelector("#uploadform"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");
let urlcopy = document.querySelector('.showurl');

// form click event
form.addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  urlcopy.style.display="block";
  progressbar.style.display="block";
  copyandprocess.style.display="block";
  processedvideobtn.style.display="block";
  recordandupload.style.display="none";
  heading.style.display="none";
  recorded.style.display="none";
    gum.style.display="none";
    recordButton.style.display="none";
    startvid.style.display="none";
  let file = target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
  if(file){
    let fileName = file.name; //getting file name
    if(fileName.length >= 12){ //if file name length is greater than 12 then split it and add ...
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName); //calling uploadFile with passing file name as an argument
  }
}

// file upload function
function uploadFile(name){
  let xhr = new XMLHttpRequest(); //creating new xhr object (AJAX)
  xhr.open("POST", "php/upload.php"); //sending post request to the specified URL
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{ //file uploading progress event
    let fileLoaded = Math.floor((loaded / total) * 100);  //getting percentage of loaded file size
    let fileTotal = Math.floor(total / 1000); //gettting total file size in KB from bytes
    let fileSize;
    // if file size is less than 1024 then add only KB else convert this KB into MB
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    // uploadedArea.innerHTML = ""; //uncomment this line if you don't want to show upload history
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if(loaded == total){
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      // uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML); //remove this line if you don't want to show upload history
    }
  });
  let data = new FormData(form); //FormData is an object to easily send form data
  xhr.send(data); //sending form data
}