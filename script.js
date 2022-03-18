'use strict';

let startcam = document.querySelector('#startcam');
let camicon = document.querySelector('#camicon');
let recordbtn = document.querySelector('#recordbtn');
let uploadpre = document.querySelector('.uploadpre');
let videopre = document.querySelector('.videopre');
let heading = document.querySelector('.heading');
let recordbutton = document.querySelector('#recordbutton');
let secondscreen = document.querySelector('.secondscreen');
let retake = document.querySelector('.retakebtn');

startcam.addEventListener('click',() => {
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