// Listen for keyboard shortcut command from extension
chrome.commands.onCommand.addListener(command => {
    console.log('Command received:', command);
    if (command === 'toggleToolbar') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'toggleToolbar' });
        });
    }
});
