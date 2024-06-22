document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const editShortcutsBtn = document.getElementById('edit-shortcuts-btn');
    const defaultCommandsList = document.getElementById('default-commands-list');

    // Function to load default commands from manifest.json
    function loadDefaultCommands() {
        // Fetch manifest.json from the extension
        fetch(chrome.runtime.getURL('/manifest.json'))
            .then(response => response.json())
            .then(manifest => {
                const commands = manifest.commands;
                if (commands) {
                    Object.keys(commands).forEach(key => {
                        const command = commands[key];
                        const commandName = key;
                        const suggestedKey = command.suggested_key.default;
                        const description = command.description;

                        // Create list item for each command
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<strong>${suggestedKey}</strong> - ${description}`;
                        defaultCommandsList.appendChild(listItem);
                    });
                } else {
                    defaultCommandsList.innerHTML = '<li>No default commands found.</li>';
                }
            })
            .catch(error => {
                console.error('Error fetching manifest.json', error);
                defaultCommandsList.innerHTML = '<li>Error loading default commands.</li>';
            });
    }

    // Load default commands when options page is loaded
    loadDefaultCommands();

    // Event listener for tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Activate the clicked button
            button.classList.add('active');
            // Show corresponding tab content
            const targetId = button.getAttribute('id').replace('-tab', '-section');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Event listener for Edit Shortcuts button (specific to Chrome and Edge)
    editShortcutsBtn.addEventListener('click', function() {
        chrome.tabs.update({ url: "chrome://extensions/shortcuts" });
    });
});
