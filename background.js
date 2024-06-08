// listen for messages from content.js
chrome.runtime.onMessage.addListener((message) => {
    if(message.action === 'screenshot') {
        //capture a screenshot
        const screenshotDataUrl = message.dataUrl;
        console.log('screenshot url:', screenshotDataUrl);
    
    }
})