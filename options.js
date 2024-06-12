// JavaScript to handle tab navigation
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            tabButtons.forEach((btn) => {
                btn.classList.remove('active');
            });
            // Hide all tab contents
            tabContents.forEach((content) => {
                content.classList.add('hidden');
            });

            // Activate the clicked button
            button.classList.add('active');
            // Show corresponding tab content
            const targetId = button.getAttribute('id').replace('-tab', '-section');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
});
