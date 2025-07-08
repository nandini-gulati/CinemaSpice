// Theme management
let currentTheme = 'dark';

function initTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('cinemaspice_theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (theme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-moon';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
    }
    
    // Save theme preference
    localStorage.setItem('cinemaspice_theme', theme);
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', initTheme);

// Export functions for global use
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;