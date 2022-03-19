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
let playbtn = document.querySelector('#playbtn');
let prewindow = document.querySelector('#prewindow');
let uploadbtn = document.querySelector('.uploadbtn');

startcam.addEventListener('click',() => {
    camicon.innerHTML="videocam";
    startcam.style.backgroundColor="transparent";
});



retake.addEventListener('click',() => {
    window.location.reload()
});

recordbtn.addEventListener('click',() => {
    if (recordbutton.textContent === 'Start Recording') {
        startRecording();
        uploadpre.style.display="none";
        videopre.classList.remove('col-lg-7');
        heading.style.display="none";
        recordbutton.textContent = 'Stop Recording';
    } else {
        stopRecording();
        recordbtn.style.display="none";
        secondscreen.style.display="block";
        prewindow.style.display="block";
        recwindow.style.display="none";
    }
});

playbtn.addEventListener('click', () => {
    const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    prewindow.src = null;
    prewindow.srcObject = null;
    prewindow.src = window.URL.createObjectURL(superBuffer);
    prewindow.controls = true;
    prewindow.play();
});

uploadbtn.addEventListener('click', () => {
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
    recordbutton.textContent = 'Stop Recording';
    playbtn.disabled = true;
    uploadbtn.disabled = true;
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
    recordbutton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;
  
    const gumVideo = document.querySelector('video#recwindow');
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

  document.querySelector('button#startcam').addEventListener('click', async () => {
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