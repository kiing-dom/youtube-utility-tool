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

// Add a button to the YouTube player's control bar
function addButtonToPlayer() {
  let controlBar = document.querySelector('.ytp-chrome-controls');
  if (controlBar) {
      let buttonContainer = document.createElement('div');
      buttonContainer.classList.add('ytp-button');
      
      let button = document.createElement('button');
      button.classList.add('ytp-button');
      button.title = 'Capture Screenshot';
      // Use a camera icon from Material Icons
      button.innerHTML = '<i class="material-icons" style="vertical-align: middle;">camera_alt</i>';
      button.onclick = captureScreenshot;

      buttonContainer.appendChild(button);
      
      // Find the rightmost button in the control bar
      let rightmostButton = controlBar.querySelector('.ytp-right-controls');
      // Insert the button before the rightmost button
      controlBar.insertBefore(buttonContainer, rightmostButton);

      console.log('Button added to player');
  } else {
      console.error('Control bar not found');
      setTimeout(addButtonToPlayer, 1000);
  }
}

// Inject Material Icons CSS into the document
function injectMaterialIcons() {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(link);
}

// Wait for the YouTube player to be ready before adding the button
function waitForPlayer() {
  console.log('Waiting for player...');
  let player = document.querySelector('.html5-video-player');
  if (player) {
      console.log('Player found:', player);
      injectMaterialIcons(); // Inject Material Icons CSS
      addButtonToPlayer();
  } else {
      console.error('Player not found');
      setTimeout(waitForPlayer, 1000);
  }
}

waitForPlayer();
