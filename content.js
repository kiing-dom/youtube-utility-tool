let audioContext;
let gainNode;

// Inject the toolbar HTML into the page
function injectToolbar() {
  fetch(chrome.runtime.getURL('toolbar.html'))
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      addToolbarListeners();
    })
    .catch(error => {
      console.error('Failed to fetch toolbar.html:', error);
    });
}

// Add event listeners to the toolbar buttons
function addToolbarListeners() {
  document.getElementById('screenshot-btn').addEventListener('click', captureScreenshot);
  document.getElementById('volume-boost-btn').addEventListener('click', toggleVolumeSlider);
  document.getElementById('volume-boost-slider').addEventListener('input', adjustVolumeBoost);
}

// Toggle the visibility of the toolbar
function toggleToolbar() {
  const toolbar = document.getElementById('youtube-enhancer-toolbar');
  if (toolbar) {
    toolbar.classList.toggle('hidden');
  }
}

// Toggle the visibility of the volume boost slider
function toggleVolumeSlider() {
  const sliderContainer = document.getElementById('volume-boost-container');
  if (sliderContainer) {
    sliderContainer.classList.toggle('hidden');
  }
}

// Adjust the video volume based on the slider value
function adjustVolumeBoost() {
  const slider = document.getElementById('volume-boost-slider');
  const video = document.querySelector('video');
  if (slider && video) {
    if (!audioContext) {
      setupAudioContext(video);
    }
    const maxBoost = 2.0; // Max boost is 200%
    const boost = (slider.value - 100) / 100 * maxBoost + 1;
    gainNode.gain.value = boost;
  }
}

// Setup audio context and gain node
function setupAudioContext(video) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(video);
  gainNode = audioContext.createGain();
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
}

// Capture and download the screenshot
function captureScreenshot() {
  console.log('Capturing screenshot...');
  let video = document.querySelector('video');
  if (video) {
    console.log('Video element found:', video);
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      console.log('Screenshot captured as blob:', blob);

      // Get the video title and extract the first letter of each word
      let videoTitle = document.title;
      let abbreviatedTitle = videoTitle.split(' ').map(word => word[0]).join('');
      // Get the current timestamp of the video
      let timestamp = new Date(video.currentTime * 1000).toISOString().substr(11, 8).replace(/:/g, '-');

      // Create a sanitized filename
      let filename = `${abbreviatedTitle}-${timestamp}.png`.replace(/[^a-z0-9\s\-_.]/gi, '_');
      
      let a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      console.log('Download link:', a);
      a.click();
    }, 'image/png');
  } else {
    console.error('Video element not found');
  }
}

// Inject Material Icons CSS into the document
function injectMaterialIcons() {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(link);
}

// Wait for the YouTube player to be ready before adding the toolbar
function waitForPlayer() {
  console.log('Waiting for player...');
  let player = document.querySelector('.html5-video-player');
  if (player) {
    console.log('Player found:', player);
    injectMaterialIcons(); // Inject Material Icons CSS
    injectToolbar(); // Inject the custom toolbar
  } else {
    console.error('Player not found');
    setTimeout(waitForPlayer, 2000); // Increase delay between checks
  }
}

waitForPlayer();
