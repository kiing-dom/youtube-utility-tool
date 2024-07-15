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
    document.getElementById('decrease-speed-btn').addEventListener('click', decreaseSpeed);
    document.getElementById('reset-speed-btn').addEventListener('click', resetSpeed);
    document.getElementById('increase-speed-btn').addEventListener('click', increaseSpeed);

    // Add event listeners to the speed buttons
    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(button => {
        button.addEventListener('click', () => {
            const speed = parseFloat(button.dataset.speed);
            setVideoSpeed(speed);
            updateSpeedTooltip(speed);
        });
    });
}

// Handle message from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.command === 'toggleToolbar') {
      toggleToolbar();
  }
});

// Rest of your content script logic

function toggleToolbar() {
  const toolbar = document.getElementById('youtube-enhancer-toolbar');
  if (toolbar) {
      toolbar.classList.toggle('hidden');
  }
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
        const maxBoost = 5.0; // Max boost is 500%
        const boost = (slider.value - 100) / 100 * maxBoost + 1;
        gainNode.gain.value = boost;

        console.log(`Slider value: ${slider.value}`);
        console.log(`Gain value: ${gainNode.gain.value}`);
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

// Decrease video playback speed by 0.1x
function decreaseSpeed() {
    console.log('Decrease speed button clicked');
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = Math.max(0.1, video.playbackRate - 0.1); // Prevent going below 0.1x
        console.log('Playback rate decreased to:', video.playbackRate);
        updateSpeedTooltip(video.playbackRate);
    } else {
        console.error('Video element not found');
    }
}

// Reset video playback speed to 1.0x
function resetSpeed() {
    console.log('Reset speed button clicked');
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = 1.0;
        console.log('Playback rate reset to:', video.playbackRate);
        updateSpeedTooltip(video.playbackRate);
    } else {
        console.error('Video element not found');
    }
}

// Increase video playback speed by 0.1x
function increaseSpeed() {
    console.log('Increase speed button clicked');
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = Math.min(4.0, video.playbackRate + 0.1); // Prevent going above 4.0x
        console.log('Playback rate increased to:', video.playbackRate);
        updateSpeedTooltip(video.playbackRate);
    } else {
        console.error('Video element not found');
    }
}

// Update the speed tooltip
function updateSpeedTooltip(speed) {
    const tooltip = `${speed.toFixed(1)}x`;
    const speedTooltipDivs = document.querySelectorAll('.speed-btn');
    speedTooltipDivs.forEach(tooltipDiv => {
        const originalText = tooltipDiv.dataset.originalText;
        tooltipDiv.textContent = `${originalText}: ${tooltip}`;
    });

    // Show speed overlay on the video
    const video = document.querySelector('video');
    if (video) {
        const speedDisplay = document.createElement('div');
        speedDisplay.textContent = `Speed: ${tooltip}`;
        speedDisplay.style.position = 'absolute';
        speedDisplay.style.top = '10px'; // Adjust top position
        speedDisplay.style.left = '50%'; // Center horizontally
        speedDisplay.style.transform = 'translateX(-50%)'; // Center horizontally
        speedDisplay.style.padding = '5px 10px';
        speedDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        speedDisplay.style.color = 'white';
        speedDisplay.style.fontSize = '16px';
        speedDisplay.style.borderRadius = '5px';
        speedDisplay.style.zIndex = '1000';
        video.parentElement.appendChild(speedDisplay);

        setTimeout(() => {
            speedDisplay.remove();
        }, 1000);
    }
}

waitForPlayer();
