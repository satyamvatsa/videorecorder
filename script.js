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
          let videowin = document.querySelector('.videowin');
          let showmobileupload = document.querySelector('.showmobileupload');
          video.src=window.URL.createObjectURL(input.files[0]);
          videowin.style.display="block";
          form.style.display="none";
          uploadpre.style.display="none";
          showmobileupload.style.display="block";
      }
  })
  
})