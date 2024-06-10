document.getElementById('toggle-toolbar-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          // Inject toggleToolbar function and call it
          if (typeof toggleToolbar === 'undefined') {
            function toggleToolbar() {
              const toolbar = document.getElementById('youtube-enhancer-toolbar');
              if (toolbar) {
                toolbar.classList.toggle('hidden');
              }
            }
          }
          toggleToolbar();
        }
      });
    });
  });
  