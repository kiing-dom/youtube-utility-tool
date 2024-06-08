/** Adding Buttons into YouTube for the needed screenshot and clipping functionality */


// Inject the Material Icons Stylesheet
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'
link.rel = 'stylesheet';
document.head.appendChild(link);

// Inject modal HTML and styles
function injectModal() {
    const modalHTML = `
      <div id="clipModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Select Clip Range</h2>
          <label for="startTime">Start Time (seconds):</label>
          <input type="number" id="startTime" name="startTime" min="0">
          <label for="endTime">End Time (seconds):</label>
          <input type="number" id="endTime" name="endTime" min="0">
          <button id="clipButton">Clip</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

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

// Add event listeners for the modal
document.querySelector('.close').addEventListener('click', closeModal);
document.getElementById('clip-button').addEventListener('click', submitClipRange);
}

// function to take a  screenshot
function takeScreenshot() {
    chrome.runtime.sendMessage({ action: 'screenshot'})
}

// Function to open the modal
function openModal() {
    document.getElementById('clipModal').style.display = 'block';
  }
  
  // Function to close the modal
  function closeModal() {
    document.getElementById('clipModal').style.display = 'none';
  }
  
  // Function to submit the clip range
  function submitClipRange() {
    const startTime = parseFloat(document.getElementById('startTime').value);
    const endTime = parseFloat(document.getElementById('endTime').value);
  
    if (!isNaN(startTime) && !isNaN(endTime) && startTime < endTime) {
      const clipData = { start: startTime, end: endTime };
      chrome.runtime.sendMessage({ action: 'clip', clipData: clipData });
      closeModal();
    } else {
      alert('Please enter valid start and end times with start time less than end time.');
    }
  }
  
  // Call injectModal and injectButtons when the content script is loaded
  injectModal();
  injectButtons();