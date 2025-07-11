// Theme management functionality
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        // Load saved theme
        this.loadTheme();
        this.setupEventListeners();
        this.updateThemeIcon();
    }

    setupEventListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('cinemaspice_theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    loadTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('cinemaspice_theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.currentTheme = 'light';
            } else {
                this.currentTheme = 'dark';
            }
        }
        
        this.applyTheme();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme();
        this.saveTheme();
        this.updateThemeIcon();
    }

    applyTheme() {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('dark-theme', 'light-theme');
        
        // Add current theme class
        body.classList.add(`${this.currentTheme}-theme`);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor();
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const themeColors = {
            dark: '#0a0a0a',
            light: '#ffffff'
        };
        
        metaThemeColor.content = themeColors[this.currentTheme];
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('theme-icon');
        if (!themeIcon) return;
        
        // Update icon based on current theme
        if (this.currentTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeIcon.title = 'Switch to Light Mode';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeIcon.title = 'Switch to Dark Mode';
        }
    }

    saveTheme() {
        localStorage.setItem('cinemaspice_theme', this.currentTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add transition effect
        this.addThemeTransition();
        
        // Show feedback
        const message = `Switched to ${newTheme} mode`;
        if (window.authManager) {
            window.authManager.showToast(message, 'info');
        }
    }

    addThemeTransition() {
        const body = document.body;
        
        // Add transition class
        body.classList.add('theme-transition');
        
        // Remove transition class after animation
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 300);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    isLightMode() {
        return this.currentTheme === 'light';
    }

    // Auto theme based on time of day
    setAutoTheme() {
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 18;
        const autoTheme = isDayTime ? 'light' : 'dark';
        
        this.setTheme(autoTheme);
        
        if (window.authManager) {
            window.authManager.showToast(`Auto theme: ${autoTheme} mode`, 'info');
        }
    }

    // High contrast mode for accessibility
    toggleHighContrast() {
        const body = document.body;
        body.classList.toggle('high-contrast');
        
        const isHighContrast = body.classList.contains('high-contrast');
        localStorage.setItem('cinemaspice_high_contrast', isHighContrast);
        
        if (window.authManager) {
            const message = isHighContrast ? 'High contrast enabled' : 'High contrast disabled';
            window.authManager.showToast(message, 'info');
        }
    }

    // Load high contrast preference
    loadHighContrast() {
        const highContrast = localStorage.getItem('cinemaspice_high_contrast') === 'true';
        if (highContrast) {
            document.body.classList.add('high-contrast');
        }
    }

    // Reduced motion preference
    loadReducedMotion() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    }
}

// Add CSS for theme transitions
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    .theme-transition {
        transition: background-color 0.3s ease, color 0.3s ease !important;
    }
    
    .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
    
    .high-contrast {
        filter: contrast(150%) !important;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    @media (prefers-color-scheme: dark) {
        :root {
            color-scheme: dark;
        }
    }
    
    @media (prefers-color-scheme: light) {
        :root {
            color-scheme: light;
        }
    }
`;

document.head.appendChild(themeStyles);

// Initialize theme manager
const themeManager = new ThemeManager();

// Load accessibility preferences
themeManager.loadHighContrast();
themeManager.loadReducedMotion();

// Export for global use
window.themeManager = themeManager;
window.toggleTheme = () => themeManager.toggleTheme();