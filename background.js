// listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === 'screenshot') {
        //capture a screenshot
        const screenshotDataUrl = message.dataUrl;
        console.log('screenshot url:', screenshotDataUrl);
    } else if(message.action === 'clip') {
        const clipData = message.clipData;
        console.log('clipping video from', clipData.start, 'to', clipData.end);
        // Implement video clipping functionality here
    sendResponse({ status: "clip request received", clipData: clipData });
    }
})