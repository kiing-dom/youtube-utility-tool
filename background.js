chrome.commands.onCommand.addListener(command => {
    console.log('Command received:', command);
    if (command === 'toggleToolbar' || command === 'togglePictureInPicture' || command === 'takeScreenshot') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length === 0) {
                console.error('No active tab found');
                return;
            }

            const activeTabId = tabs[0].id;
            chrome.scripting.executeScript(
                {
                    target: { tabId: activeTabId },
                    files: ['content.js']
                },
                () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error injecting content script:', chrome.runtime.lastError.message);
                        return;
                    }
                    chrome.tabs.sendMessage(activeTabId, { command: command }, response => {
                        if (chrome.runtime.lastError) {
                            console.error('Error sending message:', chrome.runtime.lastError.message);
                        } else {
                            console.log('Response:', response);
                        }
                    });
                }
            );
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
});

chrome.webNavigation.onCompleted.addListener(details => {
    if (details.frameId === 0) { // Ensure it's the main frame
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['content.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error injecting content script:', chrome.runtime.lastError.message);
            }
        });
    }
}, { url: [{ urlMatches: 'https://www.youtube.com/*' }] });
