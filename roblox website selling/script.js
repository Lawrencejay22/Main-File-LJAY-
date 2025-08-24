// Get the button and the navigation menu elements by their IDs.
const toggleButton = document.getElementById('toggle-nav');
const navLinks = document.getElementById('nav-links');

// Add a click event listener to the button.
toggleButton.addEventListener('click', () => {
    // Toggle the 'active' class on the nav-links element.
    navLinks.classList.toggle('active');
});

// Optional: Close the menu when a link is clicked.
const navItems = navLinks.querySelectorAll('a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});