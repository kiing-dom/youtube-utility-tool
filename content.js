// Inject the Material Icons Stylesheet
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Function to capture the video frame as an image
function captureVideoFrame(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}

// Function to take a screenshot of the video at the current timestamp
function takeScreenshot() {
    const video = document.querySelector('video');
    if (video) {
        const screenshotData = captureVideoFrame(video);
        chrome.runtime.sendMessage({ action: 'screenshot', dataUrl: screenshotData });
    } else {
        console.log('No video element found');
    }
}

// Function to inject buttons into the YouTube video player controls
function injectButtons() {
    // Find the container element for the volume and full-screen buttons
    const playerControls = document.querySelector('.ytp-right-controls');
    if (!playerControls) {
        console.error('Failed to find the YouTube video player controls container');
        return;
    }

    // Create the screenshot button
    const screenshotButton = document.createElement('button');
    screenshotButton.id = 'screenshotButton';
    screenshotButton.innerHTML = '<span class="material-icons">camera_alt</span>';
    screenshotButton.className = 'ytp-button'; // Apply the same class as other buttons
    screenshotButton.title = 'Screenshot'; // Set button title for accessibility

    // Append the screenshot button to the player controls
    playerControls.appendChild(screenshotButton);

    // Add event listener to the screenshot button
    screenshotButton.addEventListener('click', takeScreenshot);
}

// Call injectButtons when the content script is loaded
injectButtons();
