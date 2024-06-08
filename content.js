/** Adding Buttons into YouTube for the needed screenshot and clipping functionality */


// Inject the Material Icons Stylesheet
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'
link.rel = 'stylesheet';
document.head.appendChild(link);

function injectButtons() {
    // first check if the buttons are added already
    if(document.getElementById('youtube-clipper-buttons')) return;

    const container = document.createElement('div');
    container.id = 'youtube-clipper-buttons';
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
}

// create the screenshot button
const screenshotButton = document.createElement('button');
screenshotButton.id = 'screenshot-button';
screenshotButton.innerHTML = '<span class="material-icons">camera_alt</span>';
screenshotButton.style.marginBottom = '10px';

// create the clip button
const clipButton = document.createElement('button');
clipButton.id = 'clip-button';
clipButton.innerHTML = '<span class="material-icons">video_call</span>'

// append the buttons to the container
container.appendChild(screenshotButton);
container.appendChild(clipButton);

// append the container to the body;
document.body.appendChild(container);

//add event listeners to the butotns
screenshotButton.addEventListener('click', takeScreenshot);
clipButton.addEventListener('click', promptForClipRange);