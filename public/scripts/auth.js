// Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        // Load user data from localStorage
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
        });
        
        // If DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        const authForm = document.getElementById('auth-form');
        const toggleAuthBtn = document.getElementById('toggle-auth');
        
        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleAuth(e));
        }
        
        if (toggleAuthBtn) {
            toggleAuthBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAuthMode();
            });
        }

        // Handle auth link clicks
        const authLink = document.getElementById('auth-link');
        if (authLink) {
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isLoggedIn) {
                    this.showUserMenu();
                } else {
                    window.showSection('auth');
                }
            });
        }
    }

    loadUserData() {
        try {
            const userData = localStorage.getItem('cinemaspice_user');
            if (userData) {
                const user = JSON.parse(userData);
                this.currentUser = user;
                this.isLoggedIn = true;
                
                // Update global userData
                window.userData = {
                    isLoggedIn: true,
                    user: user,
                    bookings: JSON.parse(localStorage.getItem('cinemaspice_bookings') || '[]')
                };
            } else {
                // Ensure userData is initialized
                window.userData = {
                    isLoggedIn: false,
                    user: null,
                    bookings: []
                };
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.logout();
        }
    }

    async handleAuth(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value?.trim();
        const password = document.getElementById('password')?.value;
        const name = document.getElementById('name')?.value?.trim();
        const age = document.getElementById('age')?.value;
        
        const isSignUp = document.getElementById('auth-submit-btn')?.textContent === 'SIGN UP';
        
        // Clear any existing errors
        this.clearErrors();
        
        try {
            if (isSignUp) {
                await this.signUp(email, password, name, parseInt(age));
            } else {
                await this.signIn(email, password);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    async signUp(email, password, name, age) {
        // Validate inputs
        if (!email || !password || !name || !age) {
            throw new Error('All fields are required');
        }
        
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (age < 1 || age > 120) {
            throw new Error('Please enter a valid age between 1 and 120');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('cinemaspice_users') || '[]');
        if (existingUsers.find(user => user.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('An account with this email already exists');
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email: email.toLowerCase(),
            password, // In production, this should be hashed
            name,
            age,
            isAdult: age >= 18,
            createdAt: new Date().toISOString()
        };
        
        // Save user
        existingUsers.push(newUser);
        localStorage.setItem('cinemaspice_users', JSON.stringify(existingUsers));
        
        // Log in the user
        this.loginUser(newUser);
        
        this.showSuccess('Account created successfully! Welcome to cinemaspice!');
    }

    async signIn(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Find user
        const existingUsers = JSON.parse(localStorage.getItem('cinemaspice_users') || '[]');
        const user = existingUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (!user) {
            throw new Error('Invalid email or password. Please check your credentials.');
        }
        
        // Log in the user
        this.loginUser(user);
        
        this.showSuccess(`Welcome back, ${user.name}!`);
    }

    loginUser(user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        
        // Save to localStorage
        localStorage.setItem('cinemaspice_user', JSON.stringify(user));
        
        // Update global userData
        window.userData = {
            isLoggedIn: true,
            user: user,
            bookings: JSON.parse(localStorage.getItem('cinemaspice_bookings') || '[]')
        };
        
        // Update UI
        this.updateUI();
        
        // Navigate to home after a short delay
        setTimeout(() => {
            if (window.showSection) {
                window.showSection('home');
            }
        }, 1500);
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Clear localStorage
        localStorage.removeItem('cinemaspice_user');
        
        // Update global userData
        window.userData = {
            isLoggedIn: false,
            user: null,
            bookings: []
        };
        
        // Update UI
        this.updateUI();
        
        // Navigate to auth
        if (window.showSection) {
            window.showSection('auth');
        }
        
        this.showSuccess('Logged out successfully!');
    }

    updateUI() {
        const authLink = document.getElementById('auth-link');
        const moviesNav = document.getElementById('movies-nav');
        const kidsZoneNav = document.getElementById('kids-zone-nav');
        const bookingsNav = document.getElementById('bookings-nav');
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroButtons = document.getElementById('hero-buttons');
        
        if (this.isLoggedIn && this.currentUser) {
            // Update auth link
            if (authLink) {
                authLink.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span>${this.currentUser.name}</span>
                `;
            }
            
            // Show navigation items based on user age
            if (this.currentUser.isAdult) {
                if (moviesNav) moviesNav.style.display = 'block';
                if (bookingsNav) bookingsNav.style.display = 'block';
            }
            if (kidsZoneNav) kidsZoneNav.style.display = 'block';
            
            // Update hero content
            if (heroTitle) {
                heroTitle.textContent = `Welcome back, ${this.currentUser.name}!`;
            }
            if (heroSubtitle) {
                heroSubtitle.textContent = this.currentUser.isAdult 
                    ? 'Discover amazing movies and book your tickets'
                    : 'Enjoy our collection of family-friendly movies!';
            }
            if (heroButtons) {
                if (this.currentUser.isAdult) {
                    heroButtons.innerHTML = `
                        <button class="btn btn-primary" onclick="showSection('movies')">Browse Movies</button>
                        <button class="btn btn-secondary" onclick="showSection('kids-zone')">Kids Zone</button>
                    `;
                } else {
                    heroButtons.innerHTML = `
                        <button class="btn btn-primary" onclick="showSection('kids-zone')">Explore Kids Zone</button>
                    `;
                }
            }
        } else {
            // Reset to logged out state
            if (authLink) {
                authLink.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span>Login</span>
                `;
            }
            
            // Hide navigation items
            if (moviesNav) moviesNav.style.display = 'none';
            if (kidsZoneNav) kidsZoneNav.style.display = 'none';
            if (bookingsNav) bookingsNav.style.display = 'none';
            
            // Reset hero content
            if (heroTitle) {
                heroTitle.textContent = 'Welcome to CinemaSpice';
            }
            if (heroSubtitle) {
                heroSubtitle.textContent = 'Your premier destination for movie entertainment';
            }
            if (heroButtons) {
                heroButtons.innerHTML = `
                    <button class="btn btn-primary" onclick="showSection('auth')">Get Started</button>
                `;
            }
        }
        
        // Reload movies if on movies page
        setTimeout(() => {
            if (window.loadMovies && typeof window.loadMovies === 'function') {
                window.loadMovies();
            }
        }, 100);
    }

    toggleAuthMode() {
        const authTitle = document.getElementById('auth-title');
        const authSubmitBtn = document.getElementById('auth-submit-btn');
        const toggleAuthBtn = document.getElementById('toggle-auth');
        const welcomeTitle = document.getElementById('welcome-title');
        const welcomeText = document.getElementById('welcome-text');
        const nameGroup = document.getElementById('name-group');
        const ageGroup = document.getElementById('age-group');
        
        if (!authSubmitBtn) return;
        
        const isSignIn = authSubmitBtn.textContent === 'SIGN IN';
        
        if (isSignIn) {
            // Switch to Sign Up
            if (authTitle) authTitle.textContent = 'Create Account';
            authSubmitBtn.textContent = 'SIGN UP';
            if (toggleAuthBtn) toggleAuthBtn.textContent = 'SIGN IN';
            if (welcomeTitle) welcomeTitle.textContent = 'Welcome Back!';
            if (welcomeText) welcomeText.textContent = 'Sign in to access your account and bookings';
            if (nameGroup) nameGroup.style.display = 'block';
            if (ageGroup) ageGroup.style.display = 'block';
            
            // Make name and age required
            const nameInput = document.getElementById('name');
            const ageInput = document.getElementById('age');
            if (nameInput) nameInput.required = true;
            if (ageInput) ageInput.required = true;
        } else {
            // Switch to Sign In
            if (authTitle) authTitle.textContent = 'Sign in';
            authSubmitBtn.textContent = 'SIGN IN';
            if (toggleAuthBtn) toggleAuthBtn.textContent = 'SIGN UP';
            if (welcomeTitle) welcomeTitle.textContent = 'Hello, Friend!';
            if (welcomeText) welcomeText.textContent = 'Register and book your tickets now!!';
            if (nameGroup) nameGroup.style.display = 'none';
            if (ageGroup) ageGroup.style.display = 'none';
            
            // Make name and age not required
            const nameInput = document.getElementById('name');
            const ageInput = document.getElementById('age');
            if (nameInput) nameInput.required = false;
            if (ageInput) ageInput.required = false;
        }
        
        // Clear form
        this.clearForm();
        this.clearErrors();
    }

    showUserMenu() {
        // Create user dropdown menu
        const existingDropdown = document.querySelector('.user-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-content">
                <div class="user-info">
                    <strong>${this.currentUser.name}</strong>
                    <span>${this.currentUser.email}</span>
                    <small>Age: ${this.currentUser.age} ${this.currentUser.isAdult ? '(Adult)' : '(Minor)'}</small>
                </div>
                <hr>
                <button onclick="showSection('bookings')" class="dropdown-btn">
                    <i class="fas fa-ticket-alt"></i> My Bookings
                </button>
                <button onclick="themeManager.toggleTheme()" class="dropdown-btn">
                    <i class="fas fa-palette"></i> Toggle Theme
                </button>
                <button onclick="authManager.logout()" class="dropdown-btn logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#user-dropdown-styles')) {
            const style = document.createElement('style');
            style.id = 'user-dropdown-styles';
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
                    min-width: 220px;
                    animation: slideDown 0.3s ease;
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
                    font-size: 1rem;
                }
                
                .user-info span {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                
                .user-info small {
                    color: var(--accent-primary);
                    font-size: 0.8rem;
                    margin-top: 0.2rem;
                }
                
                .user-dropdown hr {
                    border: none;
                    border-top: 1px solid var(--border-color);
                    margin: 0.5rem 0;
                }
                
                .dropdown-btn {
                    width: 100%;
                    padding: 0.7rem;
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    text-align: left;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-bottom: 0.25rem;
                    transition: background 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                }
                
                .dropdown-btn:hover {
                    background: var(--bg-tertiary);
                }
                
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }
                
                .nav-item {
                    position: relative;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const authLink = document.getElementById('auth-link');
        if (authLink) {
            authLink.appendChild(dropdown);
            
            // Close dropdown when clicking outside
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && !authLink.contains(e.target)) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        }
    }

    clearForm() {
        const form = document.getElementById('auth-form');
        if (form) {
            form.reset();
        }
    }

    clearErrors() {
        const existingErrors = document.querySelectorAll('.auth-error');
        existingErrors.forEach(error => error.remove());
    }

    showError(message) {
        this.clearErrors();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 0.8rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-size: 0.9rem;
            text-align: center;
        `;
        errorDiv.textContent = message;
        
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.insertBefore(errorDiv, authForm.firstChild);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showSuccess(message) {
        this.clearErrors();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success';
        successDiv.style.cssText = `
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid #22c55e;
            color: #22c55e;
            padding: 0.8rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-size: 0.9rem;
            text-align: center;
        `;
        successDiv.textContent = message;
        
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.insertBefore(successDiv, authForm.firstChild);
        }
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getCurrentUser() {
        return this.currentUser;
    }
    isUserLoggedIn() {
        return this.isLoggedIn;
    }

    isUserAdult() {
        return this.isLoggedIn && this.currentUser && this.currentUser.isAdult;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for global use
window.authManager = authManager;
window.toggleAuthMode = () => authManager.toggleAuthMode();