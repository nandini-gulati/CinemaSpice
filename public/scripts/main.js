// Main application functionality
class CinemaSpiceApp {
    constructor() {
        this.currentSection = 'auth';
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeApp();
        this.handleInitialRoute();
    }

    setupEventListeners() {
        // Handle clicks outside modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.showSection(e.state.section, false);
            }
        });

        // Handle auth link clicks
        const authLink = document.getElementById('auth-link');
        if (authLink) {
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.userData.isLoggedIn) {
                    this.toggleUserDropdown();
                } else {
                    this.showSection('auth');
                }
            });
        }
    }

    initializeApp() {
        // Initialize all managers
        if (window.authManager) {
            window.authManager.updateUI();
        }

        // Load initial data
        this.loadInitialData();

        // Set up intersection observer for animations
        this.setupIntersectionObserver();
    }

    loadInitialData() {
        // Preload movie data
        if (window.moviesData) {
            console.log(`Loaded ${window.moviesData.length} movies`);
        }

        // Initialize movies display
        setTimeout(() => {
            if (window.loadMovies) {
                window.loadMovies();
            }
        }, 100);
    }

    handleInitialRoute() {
        // Check URL hash or show default section
        const hash = window.location.hash.substring(1);
        
        if (hash && ['home', 'movies', 'kids-zone', 'bookings'].includes(hash)) {
            this.showSection(hash);
        } else {
            // Show auth if not logged in, otherwise show home
            const initialSection = window.userData.isLoggedIn ? 'home' : 'auth';
            this.showSection(initialSection);
        }
    }

    showSection(sectionName, updateHistory = true) {
        // Validate section access
        if (!this.canAccessSection(sectionName)) {
            if (!window.userData.isLoggedIn) {
                this.showSection('auth');
                window.authManager.showError('Please login to access this section');
            } else if (!window.userData.user.isAdult && sectionName === 'movies') {
                this.showSection('kids-zone');
                window.authManager.showError('Adult content is restricted. Enjoy our Kids Zone!');
            }
            return;
        }

        // Hide all sections
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = sectionName;

            // Update navigation
            this.updateNavigation(sectionName);

            // Update URL
            if (updateHistory) {
                const url = sectionName === 'auth' ? '/' : `/#${sectionName}`;
                history.pushState({ section: sectionName }, '', url);
            }

            // Section-specific initialization
            this.initializeSection(sectionName);

            // Close mobile menu
            this.closeMobileMenu();

            // Add fade-in animation
            this.addSectionAnimation(targetSection);
        }
    }

    canAccessSection(sectionName) {
        // Public sections
        if (['auth', 'home', 'kids-zone'].includes(sectionName)) {
            return true;
        }

        // Require login
        if (!window.userData.isLoggedIn) {
            return false;
        }

        // Adult-only sections
        if (['movies', 'bookings'].includes(sectionName)) {
            return window.userData.user.isAdult;
        }

        return true;
    }

    updateNavigation(sectionName) {
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Find and activate current nav link
        const currentNavLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (currentNavLink) {
            currentNavLink.classList.add('active');
        }
    }

    initializeSection(sectionName) {
        switch (sectionName) {
            case 'movies':
                if (window.loadMovies) {
                    window.loadMovies();
                }
                break;
            case 'kids-zone':
                if (window.loadKidsMovies) {
                    window.loadKidsMovies();
                }
                break;
            case 'bookings':
                if (window.bookingManager) {
                    window.bookingManager.loadBookings();
                }
                break;
            case 'home':
                this.initializeHome();
                break;
        }
    }

    initializeHome() {
        // Update hero content based on user status
        if (window.authManager) {
            window.authManager.updateUI();
        }
    }

    addSectionAnimation(section) {
        section.classList.remove('fade-in');
        setTimeout(() => {
            section.classList.add('fade-in');
        }, 50);
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (!navMenu || !hamburger) return;

        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            this.isMobileMenuOpen = false;
        }
    }

    toggleUserDropdown() {
        // Create or toggle user dropdown
        let dropdown = document.querySelector('.user-dropdown');
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.innerHTML = `
                <div class="dropdown-content">
                    <div class="user-info">
                        <strong>${window.userData.user.name}</strong>
                        <span>${window.userData.user.email}</span>
                    </div>
                    <hr>
                    <button onclick="app.showSection('bookings')">My Bookings</button>
                    <button onclick="themeManager.toggleHighContrast()">High Contrast</button>
                    <button onclick="authManager.logout()">Logout</button>
                </div>
            `;
            
            const authLink = document.getElementById('auth-link');
            authLink.appendChild(dropdown);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    box-shadow: 0 10px 25px var(--shadow-color);
                    z-index: 1000;
                    min-width: 200px;
                    display: none;
                }
                
                .dropdown-content {
                    padding: 1rem;
                }
                
                .user-info {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 0.5rem;
                }
                
                .user-info strong {
                    color: var(--text-primary);
                }
                
                .user-info span {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                
                .user-dropdown hr {
                    border: none;
                    border-top: 1px solid var(--border-color);
                    margin: 0.5rem 0;
                }
                
                .user-dropdown button {
                    width: 100%;
                    padding: 0.5rem;
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    text-align: left;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-bottom: 0.25rem;
                    transition: background 0.3s ease;
                }
                
                .user-dropdown button:hover {
                    background: var(--bg-tertiary);
                }
                
                .nav-item {
                    position: relative;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Toggle visibility
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        
        // Close dropdown when clicking outside
        if (!isVisible) {
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && !e.target.closest('#auth-link')) {
                        dropdown.style.display = 'none';
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Close booking modal specifically
        if (window.bookingManager) {
            window.bookingManager.closeBookingModal();
        }
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
        
        // Adjust layout for different screen sizes
        this.adjustLayoutForScreenSize();
    }

    adjustLayoutForScreenSize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Add responsive classes
        document.body.classList.toggle('mobile-view', isMobile);
        document.body.classList.toggle('tablet-view', isTablet);
        document.body.classList.toggle('desktop-view', !isMobile && !isTablet);
    }

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe movie cards and other elements
        const observeElements = () => {
            const elements = document.querySelectorAll('.movie-card, .booking-card, .hero-content');
            elements.forEach(el => {
                if (!el.classList.contains('observed')) {
                    observer.observe(el);
                    el.classList.add('observed');
                }
            });
        };

        // Initial observation
        observeElements();

        // Re-observe when content changes
        const contentObserver = new MutationObserver(() => {
            observeElements();
        });

        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Error handling
    handleError(error, context = 'Application') {
        console.error(`${context} Error:`, error);
        
        if (window.authManager) {
            window.authManager.showError('Something went wrong. Please try again.');
        }
        
        // Log error for debugging
        this.logError(error, context);
    }

    logError(error, context) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            context: context,
            message: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store in localStorage for debugging
        const logs = JSON.parse(localStorage.getItem('cinemaspice_error_logs') || '[]');
        logs.push(errorLog);
        
        // Keep only last 10 errors
        if (logs.length > 10) {
            logs.shift();
        }
        
        localStorage.setItem('cinemaspice_error_logs', JSON.stringify(logs));
    }

    // Utility methods
    getCurrentSection() {
        return this.currentSection;
    }

    isMobile() {
        return window.innerWidth <= 768;
    }

    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .mobile-view .hero {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .tablet-view .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
    
    .desktop-view .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
`;

document.head.appendChild(animationStyles);

// Initialize app when DOM is loaded
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new CinemaSpiceApp();
});

// Global error handler
window.addEventListener('error', (e) => {
    if (app) {
        app.handleError(e.error, 'Global');
    }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    if (app) {
        app.handleError(e.reason, 'Promise');
    }
});

// Export for global use
window.app = app;
window.showSection = (section) => {
    if (app) {
        app.showSection(section);
    }
};
window.toggleMobileMenu = () => {
    if (app) {
        app.toggleMobileMenu();
    }
};